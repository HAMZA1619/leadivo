"use client"

import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "react-i18next"
import { Upload, FileSpreadsheet, AlertCircle, Check, Download, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ParsedRow {
  [key: string]: string
}

function parseCSV(text: string): ParsedRow[] {
  // RFC 4180-compliant parser that handles newlines within quoted fields
  const records: string[][] = []
  let current: string[] = []
  let field = ""
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ",") {
        current.push(field.trim())
        field = ""
      } else if (char === "\r" && text[i + 1] === "\n") {
        current.push(field.trim())
        field = ""
        if (current.some((v) => v)) records.push(current)
        current = []
        i++
      } else if (char === "\n") {
        current.push(field.trim())
        field = ""
        if (current.some((v) => v)) records.push(current)
        current = []
      } else {
        field += char
      }
    }
  }
  // Last field/record
  current.push(field.trim())
  if (current.some((v) => v)) records.push(current)

  if (records.length < 2) return []

  const headers = records[0]
  const rows: ParsedRow[] = []

  for (let i = 1; i < records.length; i++) {
    const row: ParsedRow = {}
    headers.forEach((h, j) => {
      row[h] = records[i][j] || ""
    })
    rows.push(row)
  }

  return rows
}

interface PreviewProduct {
  name: string
  sku: string
  price: string
  compareAt: string
  status: string
  variants: number
  collection: string
}

function getPreviewProducts(rows: ParsedRow[]): PreviewProduct[] {
  const productMap = new Map<string, PreviewProduct>()
  const order: string[] = []

  for (const row of rows) {
    const r: Record<string, string> = {}
    for (const [k, v] of Object.entries(row)) {
      r[k.toLowerCase().trim().replace(/\s+/g, "_")] = v?.trim() ?? ""
    }

    const title = r.title || r.name || ""
    const handle = r.handle || title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    if (!title && !handle) continue

    const hasOption = (r.option1_name && r.option1_value) || (r.option2_name && r.option2_value)
    const existing = productMap.get(handle)

    if (existing) {
      if (hasOption) existing.variants++
    } else {
      productMap.set(handle, {
        name: title,
        sku: r.sku || r.variant_sku || "",
        price: r.price || r.variant_price || "0",
        compareAt: r.compare_at_price || "",
        status: r.status === "draft" ? "draft" : "active",
        variants: hasOption ? 1 : 0,
        collection: r.collection || r.type || r.product_type || "",
      })
      order.push(handle)
    }
  }

  return order.map((h) => productMap.get(h)!)
}

const CSV_TEMPLATE = `Title,Description,SKU,Price,Compare At Price,Status,Stock,Image URL,Collection,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Variant Price,Variant Compare At Price,Variant SKU,Variant Stock
"Classic T-Shirt","Comfortable cotton t-shirt",TSH-001,29.99,39.99,active,100,,,Size,Small,Color,Black,29.99,39.99,TSH-S-BLK,25
"Classic T-Shirt",,,,,,,,,Size,Medium,Color,Black,29.99,39.99,TSH-M-BLK,25
"Classic T-Shirt",,,,,,,,,Size,Large,Color,White,34.99,44.99,TSH-L-WHT,20
"Leather Wallet","Genuine leather wallet",WLT-001,49.99,,active,50,,,,,,,,,,
"Summer Hat","Lightweight sun hat",HAT-001,19.99,24.99,active,200,,Accessories,,,,,,,,`

export function CsvImportDialog({ allowed }: { allowed: boolean }) {
  const { t } = useTranslation()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"upload" | "preview" | "importing" | "done">("upload")
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [fileName, setFileName] = useState("")
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ imported: number; total: number; errors: string[] } | null>(null)

  const previewProducts = rows.length > 0 ? getPreviewProducts(rows) : []
  const productCount = previewProducts.length

  const reset = useCallback(() => {
    setStep("upload")
    setRows([])
    setFileName("")
    setResult(null)
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      toast.error(t("csvImport.invalidFile"))
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const parsed = parseCSV(text)
      if (parsed.length === 0) {
        toast.error(t("csvImport.emptyFile"))
        return
      }
      setRows(parsed)
      setStep("preview")
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  async function handleImport() {
    setImporting(true)
    setStep("importing")

    try {
      const res = await fetch("/api/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      })

      const data = await res.json()

      if (!res.ok) {
        setResult({ imported: 0, total: productCount, errors: [data.error, ...(data.errors || [])] })
        setStep("done")
        setImporting(false)
        return
      }

      setResult(data)
      setStep("done")

      if (data.imported > 0) {
        toast.success(t("csvImport.importSuccess", { count: data.imported }))
        router.refresh()
      }
    } catch {
      setResult({ imported: 0, total: productCount, errors: ["Network error"] })
      setStep("done")
    }

    setImporting(false)
  }

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "leadivo-products-template.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setTimeout(reset, 300) }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!allowed}>
          <Upload className="me-1.5 h-4 w-4" />
          {t("csvImport.importCsv")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            {t("csvImport.title")}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Upload */}
        {step === "upload" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{t("csvImport.description")}</p>

            <div
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors hover:border-primary/50 hover:bg-muted/30"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{t("csvImport.dragOrClick")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("csvImport.csvOnly")}</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <Separator />

            <button
              type="button"
              onClick={downloadTemplate}
              className="flex w-full items-center gap-3 rounded-lg border p-3 text-start transition-colors hover:bg-muted/50"
            >
              <Download className="h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">{t("csvImport.downloadTemplate")}</p>
                <p className="text-xs text-muted-foreground">{t("csvImport.templateDescription")}</p>
              </div>
            </button>
          </div>
        )}

        {/* Step 2: Preview */}
        {step === "preview" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <FileSpreadsheet className="h-3 w-3" />
                  {fileName}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {t("csvImport.rowsFound", { rows: rows.length, products: productCount })}
                </span>
              </div>
              <button type="button" onClick={reset} className="text-xs text-muted-foreground hover:text-foreground">
                {t("csvImport.changeFile")}
              </button>
            </div>

            {/* Product preview list */}
            <div className="max-h-72 space-y-2 overflow-auto pe-1">
              {previewProducts.slice(0, 20).map((product, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{product.name}</p>
                      <span className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        product.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      )}>
                        {product.status}
                      </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      {product.price && <span>${product.price}</span>}
                      {product.compareAt && <span className="line-through">${product.compareAt}</span>}
                      {product.sku && <span>SKU: {product.sku}</span>}
                      {product.variants > 0 && (
                        <span className="text-primary">{product.variants} {product.variants === 1 ? "variant" : "variants"}</span>
                      )}
                      {product.collection && (
                        <span className="rounded bg-muted px-1.5 py-0.5">{product.collection}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {previewProducts.length > 20 && (
                <p className="py-2 text-center text-xs text-muted-foreground">
                  {t("csvImport.andMore", { count: previewProducts.length - 20 })}
                </p>
              )}
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={reset}>{t("csvImport.cancel")}</Button>
              <Button onClick={handleImport}>
                <Upload className="me-1.5 h-4 w-4" />
                {t("csvImport.importProducts", { count: productCount })}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Importing */}
        {step === "importing" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center">
              <p className="font-medium">{t("csvImport.importing")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("csvImport.importingDescription")}</p>
            </div>
          </div>
        )}

        {/* Step 4: Done */}
        {step === "done" && result && (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3 py-4">
              {result.imported > 0 ? (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                    <Check className="h-6 w-6 text-emerald-500" />
                  </div>
                  <p className="font-medium">{t("csvImport.importComplete")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("csvImport.importedCount", { imported: result.imported, total: result.total })}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <p className="font-medium">{t("csvImport.importFailed")}</p>
                </>
              )}
            </div>

            {result.errors.length > 0 && (
              <div className="max-h-32 overflow-auto rounded-lg border bg-muted/30 p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">{t("csvImport.errors")}:</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {result.errors.map((err, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-destructive" />
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={() => { setOpen(false); setTimeout(reset, 300) }}>
                {t("csvImport.done")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

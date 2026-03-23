"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { AlertCircle, Check, ChevronDown, ChevronsUpDown, Download, FileSpreadsheet, Gift, Loader2, Plus, Trash2, Truck, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn, getCurrencySymbol } from "@/lib/utils"
import { COUNTRIES } from "@/lib/constants"
import { Separator } from "@/components/ui/separator"
import "@/lib/i18n"

function parseCSV(text: string): Record<string, string>[] {
  const records: string[][] = []
  let current: string[] = []
  let field = ""
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else { inQuotes = false }
      } else { field += char }
    } else {
      if (char === '"') { inQuotes = true }
      else if (char === ",") { current.push(field.trim()); field = "" }
      else if (char === "\r" && text[i + 1] === "\n") { current.push(field.trim()); field = ""; if (current.some((v) => v)) records.push(current); current = []; i++ }
      else if (char === "\n") { current.push(field.trim()); field = ""; if (current.some((v) => v)) records.push(current); current = [] }
      else { field += char }
    }
  }
  current.push(field.trim())
  if (current.some((v) => v)) records.push(current)
  if (records.length < 2) return []
  const headers = records[0].map((h) => h.toLowerCase().trim())
  return records.slice(1).map((row) => {
    const obj: Record<string, string> = {}
    headers.forEach((h, j) => { obj[h] = row[j] || "" })
    return obj
  })
}

const CITY_CSV_TEMPLATE = `City,Rate,Excluded
Algiers,400,no
Oran,500,no
Constantine,450,no
Tamanrasset,,yes`

interface CityRate {
  id: string
  zone_id: string
  city_name: string
  rate: number | null
  is_excluded: boolean
}

interface ShippingZone {
  id: string
  country_code: string
  country_name: string
  default_rate: number
  free_shipping_threshold: number | null
  is_active: boolean
  shipping_city_rates: CityRate[]
}

interface ShippingManagerProps {
  initialZones: ShippingZone[]
  currency: string
  markets: Array<{ id: string; name: string }>
  limitReached?: boolean
}

export function ShippingManager({ initialZones, currency, markets, limitReached = false }: ShippingManagerProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [zones, setZones] = useState(initialZones)
  const [selectedMarketId, setSelectedMarketId] = useState<string>("")
  const [loadingZones, setLoadingZones] = useState(false)
  const [expandedZone, setExpandedZone] = useState<string | null>(null)
  const [showAddZone, setShowAddZone] = useState(false)
  const [showAddCity, setShowAddCity] = useState<string | null>(null)
  const [deleteZoneId, setDeleteZoneId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Add zone form state
  const [countryOpen, setCountryOpen] = useState(false)
  const [newCountryCode, setNewCountryCode] = useState("")
  const [newDefaultRate, setNewDefaultRate] = useState("")
  const [newFreeShipping, setNewFreeShipping] = useState(false)
  const [newThreshold, setNewThreshold] = useState("")

  // Add city form state (bulk)
  const [newCityNames, setNewCityNames] = useState("")
  const [newCityRate, setNewCityRate] = useState("")
  const [newCityExcluded, setNewCityExcluded] = useState(false)

  // Inline city rate editing
  const [editingCity, setEditingCity] = useState<{ id: string; value: string } | null>(null)

  // CSV import state
  const [csvZoneId, setCsvZoneId] = useState<string | null>(null)
  const [csvStep, setCsvStep] = useState<"upload" | "preview" | "importing" | "done">("upload")
  const [csvRows, setCsvRows] = useState<Array<{ city_name: string; rate: number | null; is_excluded: boolean }>>([])
  const [csvErrors, setCsvErrors] = useState<string[]>([])
  const [csvFileName, setCsvFileName] = useState("")
  const [csvResult, setCsvResult] = useState<{ imported: number; errors: string[] } | null>(null)
  const csvFileRef = useRef<HTMLInputElement>(null)

  const usedCountryCodes = zones.map((z) => z.country_code)
  const availableCountries = COUNTRIES.filter((c) => !usedCountryCodes.includes(c.code))
  const sym = getCurrencySymbol(currency)
  const selectedCountry = COUNTRIES.find((c) => c.code === newCountryCode)

  const parsedCityNames = newCityNames
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)

  async function handleAddZone() {
    if (!newCountryCode) return
    if (!newFreeShipping && !newDefaultRate) return
    const country = COUNTRIES.find((c) => c.code === newCountryCode)
    if (!country) return

    setSaving(true)
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country_code: country.code,
          country_name: country.name,
          default_rate: newFreeShipping ? 0 : parseFloat(newDefaultRate),
          free_shipping_threshold: newThreshold ? parseFloat(newThreshold) : null,
          is_active: true,
          market_id: selectedMarketId || null,
        }),
      })
      if (res.ok) {
        const zone = await res.json()
        setZones((prev) => [...prev, zone])
        toast.success(t("shipping.zoneSaved"))
        setShowAddZone(false)
        setNewCountryCode("")
        setNewDefaultRate("")
        setNewFreeShipping(false)
        setNewThreshold("")
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || t("shipping.saveError"))
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(zone: ShippingZone) {
    const prev = zone.is_active
    setZones((zs) => zs.map((z) => z.id === zone.id ? { ...z, is_active: !prev } : z))
    const res = await fetch("/api/shipping", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: zone.id, is_active: !prev }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      setZones((zs) => zs.map((z) => z.id === zone.id ? { ...z, is_active: prev } : z))
      toast.error(t("shipping.saveError"))
    }
  }

  async function handleUpdateRate(zoneId: string, rate: string) {
    const num = parseFloat(rate)
    if (isNaN(num) || num < 0) return
    const res = await fetch("/api/shipping", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: zoneId, default_rate: num }),
    })
    if (res.ok) {
      setZones((prev) => prev.map((z) => z.id === zoneId ? { ...z, default_rate: num } : z))
    } else {
      toast.error(t("shipping.saveError"))
    }
  }

  async function handleUpdateThreshold(zoneId: string, value: string) {
    const threshold = value.trim() === "" ? null : parseFloat(value)
    if (threshold !== null && (isNaN(threshold) || threshold < 0)) return
    const res = await fetch("/api/shipping", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: zoneId, free_shipping_threshold: threshold }),
    })
    if (res.ok) {
      setZones((prev) => prev.map((z) => z.id === zoneId ? { ...z, free_shipping_threshold: threshold } : z))
    } else {
      toast.error(t("shipping.saveError"))
    }
  }

  async function handleDeleteZone() {
    if (!deleteZoneId) return
    const res = await fetch(`/api/shipping?id=${deleteZoneId}`, { method: "DELETE" })
    if (res.ok) {
      setZones((prev) => prev.filter((z) => z.id !== deleteZoneId))
      toast.success(t("shipping.zoneDeleted"))
      router.refresh()
    } else {
      toast.error(t("shipping.saveError"))
    }
    setDeleteZoneId(null)
  }

  async function handleAddCity() {
    if (!showAddCity || parsedCityNames.length === 0) return
    if (!newCityExcluded && !newCityRate) return

    setSaving(true)
    try {
      const cities = parsedCityNames.map((name) => ({
        city_name: name,
        rate: newCityExcluded ? null : parseFloat(newCityRate),
        is_excluded: newCityExcluded,
      }))

      const res = await fetch("/api/shipping/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zone_id: showAddCity, cities }),
      })
      if (res.ok) {
        const newRates: CityRate[] = await res.json()
        setZones((prev) =>
          prev.map((z) => {
            if (z.id !== showAddCity) return z
            const existing = z.shipping_city_rates.filter(
              (c) => !newRates.some((nr) => nr.id === c.id)
            )
            return { ...z, shipping_city_rates: [...existing, ...newRates] }
          })
        )
        toast.success(
          newRates.length === 1
            ? t("shipping.citySaved")
            : t("shipping.citiesAdded", { count: newRates.length })
        )
        setShowAddCity(null)
        setNewCityNames("")
        setNewCityRate("")
        setNewCityExcluded(false)
      } else {
        const data = await res.json()
        toast.error(data?.error || t("shipping.saveFailed"))
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateCityRate(cityRate: CityRate, newRate: string) {
    const num = parseFloat(newRate)
    if (isNaN(num) || num < 0) {
      setEditingCity(null)
      return
    }
    if (num === cityRate.rate) {
      setEditingCity(null)
      return
    }
    const res = await fetch("/api/shipping/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zone_id: cityRate.zone_id,
        city_name: cityRate.city_name,
        rate: num,
        is_excluded: false,
      }),
    })
    if (res.ok) {
      const updated = await res.json()
      setZones((prev) =>
        prev.map((z) =>
          z.id === cityRate.zone_id
            ? { ...z, shipping_city_rates: z.shipping_city_rates.map((c) => c.id === cityRate.id ? updated : c) }
            : z
        )
      )
    }
    setEditingCity(null)
  }

  function resetCsvImport() {
    setCsvStep("upload")
    setCsvRows([])
    setCsvErrors([])
    setCsvFileName("")
    setCsvResult(null)
  }

  function handleCsvFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith(".csv")) {
      toast.error(t("shipping.csvInvalidFile"))
      return
    }
    setCsvFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const parsed = parseCSV(text)
      if (parsed.length === 0) {
        toast.error(t("shipping.csvEmptyFile"))
        return
      }
      const cityMap = new Map<string, { city_name: string; rate: number | null; is_excluded: boolean }>()
      const errors: string[] = []
      for (let i = 0; i < parsed.length; i++) {
        const row = parsed[i]
        const city = row.city || row.city_name || row.name || ""
        if (!city) { errors.push(`Row ${i + 2}: missing city name`); continue }
        const excludedRaw = (row.excluded || row.is_excluded || "").toLowerCase()
        const isExcluded = ["yes", "true", "1", "oui", "نعم"].includes(excludedRaw)
        const rateStr = row.rate ?? row.price ?? ""
        if (!isExcluded && rateStr === "") { errors.push(`Row ${i + 2}: "${city}" — rate is required`); continue }
        const rate = isExcluded ? null : parseFloat(rateStr)
        if (!isExcluded && (rate === null || isNaN(rate!) || rate! < 0)) { errors.push(`Row ${i + 2}: "${city}" — invalid rate "${rateStr}"`); continue }
        cityMap.set(city.toLowerCase(), { city_name: city, rate, is_excluded: isExcluded })
      }
      setCsvRows(Array.from(cityMap.values()))
      setCsvErrors(errors)
      setCsvStep("preview")
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  async function handleCsvImport() {
    if (!csvZoneId || csvRows.length === 0) return
    setCsvStep("importing")
    try {
      const res = await fetch("/api/shipping/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zone_id: csvZoneId, cities: csvRows }),
      })
      if (res.ok) {
        const newRates: CityRate[] = await res.json()
        setZones((prev) =>
          prev.map((z) => {
            if (z.id !== csvZoneId) return z
            const existing = z.shipping_city_rates.filter((c) => !newRates.some((nr) => nr.id === c.id))
            return { ...z, shipping_city_rates: [...existing, ...newRates] }
          })
        )
        setCsvResult({ imported: newRates.length, errors: csvErrors })
        setCsvStep("done")
        toast.success(t("shipping.citiesAdded", { count: newRates.length }))
      } else {
        const data = await res.json()
        setCsvResult({ imported: 0, errors: [data?.error || t("shipping.saveFailed"), ...csvErrors] })
        setCsvStep("done")
      }
    } catch {
      setCsvResult({ imported: 0, errors: [t("shipping.saveFailed"), ...csvErrors] })
      setCsvStep("done")
    }
  }

  function downloadCityTemplate() {
    const blob = new Blob([CITY_CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "shipping-city-rates-template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDeleteCity(cityRateId: string, zoneId: string) {
    const res = await fetch(`/api/shipping/cities?id=${cityRateId}`, { method: "DELETE" })
    if (res.ok) {
      setZones((prev) =>
        prev.map((z) =>
          z.id === zoneId
            ? { ...z, shipping_city_rates: z.shipping_city_rates.filter((c) => c.id !== cityRateId) }
            : z
        )
      )
      toast.success(t("shipping.cityDeleted"))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold sm:text-2xl">{t("shipping.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("shipping.description")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {markets.length > 0 && (
            <select
              value={selectedMarketId}
              onChange={async (e) => {
                const val = e.target.value
                setSelectedMarketId(val)
                setLoadingZones(true)
                try {
                  const params = new URLSearchParams()
                  if (val) params.set("market_id", val)
                  const res = await fetch(`/api/shipping?${params}`)
                  if (res.ok) {
                    const data = await res.json()
                    setZones(data)
                  }
                } finally {
                  setLoadingZones(false)
                }
              }}
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="">{t("shipping.globalZones")}</option>
              {markets.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          )}
          <Button size="sm" onClick={() => setShowAddZone(true)} disabled={limitReached}>
            <Plus className="me-2 h-4 w-4" />
            {t("shipping.addZone")}
          </Button>
        </div>
      </div>

      {zones.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <Truck className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium">{t("shipping.noZones")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("shipping.noZonesDesc")}</p>
          <Button size="sm" className="mt-4" onClick={() => setShowAddZone(true)} disabled={limitReached}>
            <Plus className="me-2 h-4 w-4" />
            {t("shipping.addZone")}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {zones.map((zone) => {
            const isExpanded = expandedZone === zone.id
            return (
              <div key={zone.id} className={cn("rounded-lg border transition-opacity", !zone.is_active && "opacity-60")}>
                <div
                  className="flex cursor-pointer items-center gap-3 p-4"
                  onClick={() => setExpandedZone(isExpanded ? null : zone.id)}
                >
                  <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", !isExpanded && "-rotate-90 rtl:rotate-90")} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{zone.country_name}</span>
                      <span className="text-xs text-muted-foreground">({zone.country_code})</span>
                      {zone.shipping_city_rates.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          · {zone.shipping_city_rates.length} {t("shipping.cityOverrides").toLowerCase()}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span>{t("shipping.defaultRate")}: {Number(zone.default_rate) === 0 ? t("shipping.freeShipping") : `${zone.default_rate} ${sym}`}</span>
                      {zone.free_shipping_threshold != null && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <Gift className="h-3 w-3" />
                          {t("shipping.freeAbove")} {zone.free_shipping_threshold} {sym}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={zone.is_active}
                      onCheckedChange={() => handleToggleActive(zone)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => setDeleteZoneId(zone.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t px-4 pb-4 pt-3">
                    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">{t("shipping.defaultRate")} ({sym})</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="h-9"
                          defaultValue={zone.default_rate}
                          onBlur={(e) => handleUpdateRate(zone.id, e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">{t("shipping.freeShippingThreshold")} ({sym})</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="h-9"
                          placeholder={t("shipping.noThreshold")}
                          defaultValue={zone.free_shipping_threshold ?? ""}
                          onBlur={(e) => handleUpdateThreshold(zone.id, e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">{t("shipping.thresholdHint")}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h4 className="text-sm font-medium">{t("shipping.cityOverrides")}</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            setCsvZoneId(zone.id)
                            resetCsvImport()
                          }}
                        >
                          <Upload className="me-1 h-3 w-3" />
                          {t("shipping.importCsv")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            setShowAddCity(zone.id)
                            setNewCityNames("")
                            setNewCityRate("")
                            setNewCityExcluded(false)
                          }}
                        >
                          <Plus className="me-1 h-3 w-3" />
                          {t("shipping.addCity")}
                        </Button>
                      </div>
                    </div>

                    {zone.shipping_city_rates.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-2">
                        {t("shipping.noCityOverrides")}
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {[...zone.shipping_city_rates]
                          .sort((a, b) => a.city_name.localeCompare(b.city_name))
                          .map((cr) => (
                          <div
                            key={cr.id}
                            className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm"
                          >
                            <span className={cn(cr.is_excluded && "line-through text-muted-foreground")}>
                              {cr.city_name}
                            </span>
                            <div className="flex items-center gap-2">
                              {cr.is_excluded ? (
                                <span className="text-xs text-destructive">{t("shipping.excluded")}</span>
                              ) : editingCity?.id === cr.id ? (
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="h-7 w-24 text-sm"
                                  autoFocus
                                  defaultValue={editingCity.value}
                                  onBlur={(e) => handleUpdateCityRate(cr, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleUpdateCityRate(cr, (e.target as HTMLInputElement).value)
                                    if (e.key === "Escape") setEditingCity(null)
                                  }}
                                />
                              ) : (
                                <button
                                  className="cursor-pointer rounded px-1.5 py-0.5 text-sm hover:bg-muted transition-colors"
                                  onClick={() => setEditingCity({ id: cr.id, value: String(cr.rate ?? 0) })}
                                >
                                  {Number(cr.rate) === 0 ? t("shipping.freeShipping") : `${cr.rate} ${sym}`}
                                </button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleDeleteCity(cr.id, zone.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add Zone Dialog */}
      <Dialog open={showAddZone} onOpenChange={setShowAddZone}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("shipping.addZone")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("shipping.country")}</Label>
              <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={countryOpen}
                    className="w-full justify-between font-normal"
                  >
                    {selectedCountry ? selectedCountry.name : t("shipping.selectCountry")}
                    <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder={t("shipping.searchCountry")} />
                    <CommandList>
                      <CommandEmpty>{t("shipping.noCountryFound")}</CommandEmpty>
                      <CommandGroup>
                        {availableCountries.map((c) => (
                          <CommandItem
                            key={c.code}
                            value={c.name}
                            onSelect={() => {
                              setNewCountryCode(c.code)
                              setCountryOpen(false)
                            }}
                          >
                            <Check className={cn("me-2 h-4 w-4", newCountryCode === c.code ? "opacity-100" : "opacity-0")} />
                            {c.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="free-shipping"
                checked={newFreeShipping}
                onCheckedChange={(v) => setNewFreeShipping(!!v)}
              />
              <Label htmlFor="free-shipping" className="text-sm">
                {t("shipping.freeShippingToggle")}
              </Label>
            </div>
            {!newFreeShipping && (
              <>
                <div className="space-y-2">
                  <Label>{t("shipping.defaultRate")} ({sym})</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={newDefaultRate}
                    onChange={(e) => setNewDefaultRate(e.target.value)}
                  />
                </div>
                <div className="rounded-md border border-dashed border-emerald-300 bg-emerald-50/50 p-3 dark:border-emerald-800 dark:bg-emerald-950/20">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    <Gift className="h-4 w-4" />
                    {t("shipping.freeShippingThreshold")}
                  </div>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={t("shipping.thresholdPlaceholder")}
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(e.target.value)}
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">{t("shipping.thresholdHint")}</p>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddZone(false)}>
              {t("shipping.cancel")}
            </Button>
            <Button onClick={handleAddZone} disabled={!newCountryCode || (!newFreeShipping && !newDefaultRate) || saving}>
              {t("shipping.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add City Dialog (bulk support) */}
      <Dialog open={!!showAddCity} onOpenChange={(open) => !open && setShowAddCity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("shipping.addCity")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("shipping.cityName")}</Label>
              <Textarea
                placeholder={t("shipping.bulkCityPlaceholder")}
                value={newCityNames}
                onChange={(e) => setNewCityNames(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {t("shipping.bulkCityHint")}
                {parsedCityNames.length > 1 && (
                  <span className="ms-1 font-medium">
                    ({parsedCityNames.length})
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="exclude-city"
                checked={newCityExcluded}
                onCheckedChange={(v) => setNewCityExcluded(!!v)}
              />
              <Label htmlFor="exclude-city" className="text-sm">
                {t("shipping.excludeCity")}
              </Label>
            </div>
            {newCityExcluded && (
              <p className="text-xs text-muted-foreground">{t("shipping.excludeDesc")}</p>
            )}
            {!newCityExcluded && (
              <div className="space-y-2">
                <Label>{t("shipping.rate")} ({sym})</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={newCityRate}
                  onChange={(e) => setNewCityRate(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCity(null)}>
              {t("shipping.cancel")}
            </Button>
            <Button
              onClick={handleAddCity}
              disabled={parsedCityNames.length === 0 || (!newCityExcluded && !newCityRate) || saving}
            >
              {parsedCityNames.length > 1
                ? t("shipping.addCities", { count: parsedCityNames.length })
                : t("shipping.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Zone Confirmation */}
      <AlertDialog open={!!deleteZoneId} onOpenChange={(open) => !open && setDeleteZoneId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("shipping.deleteZone")}</AlertDialogTitle>
            <AlertDialogDescription>{t("shipping.deleteZoneConfirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("shipping.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteZone} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t("shipping.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* CSV Import Dialog */}
      <Dialog open={!!csvZoneId} onOpenChange={(open) => { if (!open) { setCsvZoneId(null); setTimeout(resetCsvImport, 300) } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              {t("shipping.importCsv")}
            </DialogTitle>
          </DialogHeader>

          {csvStep === "upload" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{t("shipping.csvDescription")}</p>
              <div
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors hover:border-primary/50 hover:bg-muted/30"
                onClick={() => csvFileRef.current?.click()}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{t("shipping.csvDragOrClick")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t("shipping.csvOnly")}</p>
                </div>
                <input
                  ref={csvFileRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCsvFileChange}
                />
              </div>
              <Separator />
              <button
                type="button"
                onClick={downloadCityTemplate}
                className="flex w-full items-center gap-3 rounded-lg border p-3 text-start transition-colors hover:bg-muted/50"
              >
                <Download className="h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium">{t("shipping.csvDownloadTemplate")}</p>
                  <p className="text-xs text-muted-foreground">{t("shipping.csvTemplateDesc")}</p>
                </div>
              </button>
            </div>
          )}

          {csvStep === "preview" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                    <FileSpreadsheet className="h-3 w-3" />
                    {csvFileName}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t("shipping.csvRowsFound", { count: csvRows.length })}
                  </span>
                </div>
                <button type="button" onClick={resetCsvImport} className="text-xs text-muted-foreground hover:text-foreground">
                  {t("shipping.csvChangeFile")}
                </button>
              </div>

              <div className="max-h-60 space-y-1 overflow-auto pe-1">
                {csvRows.slice(0, 30).map((row, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm">
                    <span className={cn(row.is_excluded && "line-through text-muted-foreground")}>{row.city_name}</span>
                    {row.is_excluded ? (
                      <span className="text-xs text-destructive">{t("shipping.excluded")}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">{row.rate} {sym}</span>
                    )}
                  </div>
                ))}
                {csvRows.length > 30 && (
                  <p className="py-2 text-center text-xs text-muted-foreground">
                    +{csvRows.length - 30} {t("shipping.csvMore")}
                  </p>
                )}
              </div>

              {csvErrors.length > 0 && (
                <div className="max-h-24 overflow-auto rounded-lg border bg-muted/30 p-3">
                  <p className="mb-1 text-xs font-medium text-destructive">{t("shipping.csvSkipped")}:</p>
                  <ul className="space-y-0.5 text-xs text-muted-foreground">
                    {csvErrors.map((err, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-destructive" />
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setCsvZoneId(null); resetCsvImport() }}>{t("shipping.cancel")}</Button>
                <Button onClick={handleCsvImport} disabled={csvRows.length === 0}>
                  <Upload className="me-1.5 h-4 w-4" />
                  {t("shipping.csvImportCities", { count: csvRows.length })}
                </Button>
              </div>
            </div>
          )}

          {csvStep === "importing" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="font-medium">{t("shipping.csvImporting")}</p>
            </div>
          )}

          {csvStep === "done" && csvResult && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 py-4">
                {csvResult.imported > 0 ? (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                      <Check className="h-6 w-6 text-emerald-500" />
                    </div>
                    <p className="font-medium">{t("shipping.csvComplete")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("shipping.citiesAdded", { count: csvResult.imported })}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                      <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <p className="font-medium">{t("shipping.csvFailed")}</p>
                  </>
                )}
              </div>
              {csvResult.errors.length > 0 && (
                <div className="max-h-32 overflow-auto rounded-lg border bg-muted/30 p-3">
                  <ul className="space-y-0.5 text-xs text-muted-foreground">
                    {csvResult.errors.map((err, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-destructive" />
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={() => { setCsvZoneId(null); setTimeout(resetCsvImport, 300) }}>
                  {t("shipping.csvDone")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

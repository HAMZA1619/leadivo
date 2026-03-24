"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { formatPrice } from "@/lib/utils"
import { RelativeDate } from "@/components/dashboard/relative-date"
import { Download, Loader2, Search, X } from "lucide-react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

interface Customer {
  id: string
  customer_phone: string
  customer_name: string
  customer_email: string | null
  customer_city: string | null
  customer_country: string | null
  tags: string[]
  currency: string | null
  total_spent: number
  order_count: number
  last_order_at: string | null
  created_at: string
}

interface CustomersTableProps {
  initialCustomers: Customer[]
  hasMore: boolean
  canExport?: boolean
}

export function CustomersTable({ initialCustomers, hasMore: initialHasMore, canExport }: CustomersTableProps) {
  const { t } = useTranslation()
  const [customers, setCustomers] = useState(initialCustomers)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [search, setSearch] = useState("")
  const [searching, setSearching] = useState(false)
  const [countryFilter, setCountryFilter] = useState("")
  const [exporting, setExporting] = useState(false)
  const [exportConfirmOpen, setExportConfirmOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hasActiveFilters = !!countryFilter

  function buildParams(pageNum: number, searchQuery?: string) {
    const params = new URLSearchParams({ page: String(pageNum) })
    const q = searchQuery ?? search.trim()
    if (q) params.set("search", q)
    if (countryFilter) params.set("country", countryFilter)
    return params
  }

  const fetchFiltered = useCallback(async (params: URLSearchParams) => {
    setSearching(true)
    try {
      const res = await fetch(`/api/customers/list?${params}`)
      if (!res.ok) return
      const data = await res.json()
      setCustomers(data.customers)
      setHasMore(data.hasMore)
      setPage(1)
    } finally {
      setSearching(false)
    }
  }, [])

  function handleSearchChange(value: string) {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!value.trim() && !hasActiveFilters) {
      setCustomers(initialCustomers)
      setHasMore(initialHasMore)
      setPage(1)
      return
    }

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams({ page: "0" })
      if (value.trim()) params.set("search", value.trim())
      if (countryFilter) params.set("country", countryFilter)
      fetchFiltered(params)
    }, 400)
  }

  function handleCountryChange(value: string) {
    setCountryFilter(value)
    const params = new URLSearchParams({ page: "0" })
    if (search.trim()) params.set("search", search.trim())
    if (value) params.set("country", value)

    if (!value && !search.trim()) {
      setCustomers(initialCustomers)
      setHasMore(initialHasMore)
      setPage(1)
      return
    }
    fetchFiltered(params)
  }

  function clearAll() {
    setSearch("")
    setCountryFilter("")
    setCustomers(initialCustomers)
    setHasMore(initialHasMore)
    setPage(1)
  }

  async function loadMore() {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const params = buildParams(page)
      const res = await fetch(`/api/customers/list?${params}`)
      if (!res.ok) {
        setHasMore(false)
        return
      }
      const data = await res.json()
      setCustomers((prev) => [...prev, ...data.customers])
      setHasMore(data.hasMore)
      setPage((p) => p + 1)
    } finally {
      setLoading(false)
    }
  }

  async function handleExport() {
    if (exporting) return
    setExporting(true)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set("search", search.trim())
      if (countryFilter) params.set("country", countryFilter)

      const res = await fetch(`/api/customers/export?${params}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "" }))
        if (data.error === "rate_limit") {
          toast.error(t("customers.exportRateLimit"))
        } else if (data.error === "upgrade_required") {
          toast.error(t("customers.exportUpgradeRequired"))
        } else {
          toast.error(t("customers.exportFailed"))
        }
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `customers-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success(t("customers.exportSuccess"))
    } catch {
      toast.error(t("customers.exportFailed"))
    } finally {
      setExporting(false)
    }
  }

  const countries = Array.from(new Set(initialCustomers.map((c) => c.customer_country).filter(Boolean))) as string[]

  const isEmpty = customers.length === 0 && !search.trim() && !hasActiveFilters
  const noResults = customers.length === 0 && (!!search.trim() || hasActiveFilters)

  if (isEmpty) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        {t("customers.empty")}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t("customers.search")}
            className="ps-9 pe-9"
          />
          {search && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            </button>
          )}
        </div>

        <div className="ms-auto flex flex-wrap items-center gap-2">
          {(hasActiveFilters || search) && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="h-9 gap-1 text-xs">
              <X className="h-3 w-3" />
              {t("customers.filters.clearFilters")}
            </Button>
          )}

          {countries.length > 0 && (
            <select
              value={countryFilter}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="">{t("customers.filters.allCountries")}</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          {canExport && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={() => setExportConfirmOpen(true)}
              disabled={exporting}
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {t("customers.export")}
            </Button>
          )}
        </div>
      </div>

      {searching ? (
        <div className="py-12 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
        </div>
      ) : noResults ? (
        <div className="py-12 text-center text-muted-foreground">
          {t("customers.emptySearch")}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("customers.columns.name")}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t("customers.columns.phone")}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("customers.columns.country")}</TableHead>
                  <TableHead>{t("customers.columns.orders")}</TableHead>
                  <TableHead>{t("customers.columns.totalSpent")}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t("customers.columns.lastOrder")}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t("customers.columns.tags")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id} className="relative cursor-pointer">
                    <TableCell>
                      <Link
                        href={`/dashboard/customers/${customer.id}`}
                        className="absolute inset-0"
                      />
                      <span className="relative font-medium">{customer.customer_name}</span>
                      <span className="relative block text-xs text-muted-foreground sm:hidden">{customer.customer_phone}</span>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">{customer.customer_phone}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">{customer.customer_country || "—"}</TableCell>
                    <TableCell>{customer.order_count}</TableCell>
                    <TableCell>{formatPrice(customer.total_spent, customer.currency || "USD")}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {customer.last_order_at ? <RelativeDate date={customer.last_order_at} /> : "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="relative flex flex-wrap gap-1">
                        {customer.tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {tag}
                          </span>
                        ))}
                        {(customer.tags?.length || 0) > 3 && (
                          <span className="text-xs text-muted-foreground">+{customer.tags.length - 3}</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={loadMore} disabled={loading}>
                {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                {t("customers.loadMore")}
              </Button>
            </div>
          )}
        </>
      )}

      <AlertDialog open={exportConfirmOpen} onOpenChange={setExportConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("customers.exportConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("customers.exportConfirmDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("customers.exportCancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => { setExportConfirmOpen(false); handleExport() }}>
              {t("customers.exportConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

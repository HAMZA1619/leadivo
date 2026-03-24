"use client"

import { useState, useCallback, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { RelativeDate } from "@/components/dashboard/relative-date"
import { Check, ChevronDown, Loader2, Star, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

interface Review {
  id: string
  product_id: string
  customer_name: string | null
  customer_phone: string
  rating: number
  comment: string | null
  image_urls: string[]
  status: string
  created_at: string
  products: { name: string } | null
}

interface ReviewsListProps {
  initialCounts: {
    all: number
    pending: number
    approved: number
    rejected: number
  }
}

type StatusFilter = "all" | "pending" | "approved" | "rejected"

const statusBadgeConfig: Record<string, { dot: string; bg: string; labelKey: string }> = {
  pending: { dot: "bg-amber-400", bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300", labelKey: "reviews.statusPending" },
  approved: { dot: "bg-emerald-400", bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300", labelKey: "reviews.statusApproved" },
  rejected: { dot: "bg-rose-400", bg: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300", labelKey: "reviews.statusRejected" },
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation()
  const cfg = statusBadgeConfig[status] || { dot: "bg-gray-400", bg: "bg-gray-100 text-gray-600", labelKey: status }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg}`}>
      <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
      {t(cfg.labelKey)}
    </span>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn("h-3.5 w-3.5", s <= rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")}
        />
      ))}
    </div>
  )
}

export function ReviewsList({ initialCounts }: ReviewsListProps) {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<Review[]>([])
  const [counts, setCounts] = useState(initialCounts)
  const [filter, setFilter] = useState<StatusFilter>("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [bulkAction, setBulkAction] = useState<"approved" | "rejected" | "deleted" | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchReviews = useCallback(async (status: StatusFilter, p: number, append = false) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" })
      if (status !== "all") params.set("status", status)
      const res = await fetch(`/api/reviews/list?${params}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setReviews(append ? (prev) => [...prev, ...data.reviews] : data.reviews)
      setCounts(data.counts)
      setTotalPages(data.totalPages)
      setPage(p)
    } catch {
      toast.error(t("reviews.fetchError"))
    } finally {
      setLoading(false)
    }
  }, [t])

  const handleFilterChange = useCallback((status: StatusFilter) => {
    setFilter(status)
    setSelected(new Set())
    setExpandedId(null)
    fetchReviews(status, 1)
  }, [fetchReviews])

  useEffect(() => {
    fetchReviews("all", 1)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectAll = () => {
    if (selected.size === reviews.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(reviews.map((r) => r.id)))
    }
  }

  const handleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleModerate = async (reviewId: string, status: "approved" | "rejected") => {
    setActionLoading(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_id: reviewId, status }),
      })
      if (!res.ok) throw new Error()
      toast.success(t(status === "approved" ? "reviews.approved" : "reviews.rejected"))
      await fetchReviews(filter, page)
      setSelected((prev) => { const next = new Set(prev); next.delete(reviewId); return next })
    } catch {
      toast.error(t("reviews.actionError"))
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (reviewId: string) => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success(t("reviews.deleted"))
      await fetchReviews(filter, page)
      setSelected((prev) => { const next = new Set(prev); next.delete(reviewId); return next })
    } catch {
      toast.error(t("reviews.actionError"))
    } finally {
      setActionLoading(false)
      setDeleteTarget(null)
    }
  }

  const handleBulkAction = async (action: "approved" | "rejected" | "deleted") => {
    if (selected.size === 0) return
    setActionLoading(true)
    try {
      const res = await fetch("/api/reviews/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_ids: Array.from(selected), action }),
      })
      if (!res.ok) throw new Error()
      const label = action === "approved" ? "reviews.bulkApproved" : action === "rejected" ? "reviews.bulkRejected" : "reviews.bulkDeleted"
      toast.success(t(label, { count: selected.size }))
      setSelected(new Set())
      await fetchReviews(filter, 1)
    } catch {
      toast.error(t("reviews.actionError"))
    } finally {
      setActionLoading(false)
      setBulkAction(null)
    }
  }

  const tabs: { key: StatusFilter; labelKey: string; count: number }[] = [
    { key: "all", labelKey: "reviews.filterAll", count: counts.all },
    { key: "pending", labelKey: "reviews.filterPending", count: counts.pending },
    { key: "approved", labelKey: "reviews.filterApproved", count: counts.approved },
    { key: "rejected", labelKey: "reviews.filterRejected", count: counts.rejected },
  ]

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(tab.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              filter === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {t(tab.labelKey)}
            <span className={cn(
              "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs",
              filter === tab.key ? "bg-primary-foreground/20" : "bg-background"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/50 p-3">
          <span className="text-sm font-medium">
            {t("reviews.selected", { count: selected.size })}
          </span>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("approved")} disabled={actionLoading}>
              <Check className="me-1 h-3.5 w-3.5" />
              {t("reviews.approve")}
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("rejected")} disabled={actionLoading}>
              <X className="me-1 h-3.5 w-3.5" />
              {t("reviews.reject")}
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setBulkAction("deleted")} disabled={actionLoading}>
              <Trash2 className="me-1 h-3.5 w-3.5" />
              {t("reviews.delete")}
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={reviews.length > 0 && selected.size === reviews.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>{t("reviews.colProduct")}</TableHead>
              <TableHead>{t("reviews.colCustomer")}</TableHead>
              <TableHead>{t("reviews.colRating")}</TableHead>
              <TableHead className="hidden sm:table-cell">{t("reviews.colComment")}</TableHead>
              <TableHead>{t("reviews.colStatus")}</TableHead>
              <TableHead className="hidden sm:table-cell">{t("reviews.colDate")}</TableHead>
              <TableHead className="text-end">{t("reviews.colActions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                  {t("reviews.empty")}
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <>
                  <TableRow
                    key={review.id}
                    className={cn("cursor-pointer", expandedId === review.id && "bg-muted/30")}
                    onClick={() => setExpandedId(expandedId === review.id ? null : review.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(review.id)}
                        onCheckedChange={() => handleSelect(review.id)}
                      />
                    </TableCell>
                    <TableCell className="max-w-[120px] truncate font-medium">
                      {review.products?.name || "—"}
                    </TableCell>
                    <TableCell className="max-w-[100px] truncate">
                      {review.customer_name || review.customer_phone}
                    </TableCell>
                    <TableCell>
                      <StarRating rating={review.rating} />
                    </TableCell>
                    <TableCell className="hidden max-w-[200px] truncate sm:table-cell">
                      {review.comment ? (review.comment.length > 50 ? review.comment.slice(0, 50) + "..." : review.comment) : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={review.status} />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <RelativeDate date={review.created_at} />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {review.status !== "approved" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-emerald-600 hover:text-emerald-700"
                            onClick={() => handleModerate(review.id, "approved")}
                            disabled={actionLoading}
                            title={t("reviews.approve")}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        {review.status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-rose-600 hover:text-rose-700"
                            onClick={() => handleModerate(review.id, "rejected")}
                            disabled={actionLoading}
                            title={t("reviews.reject")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteTarget(review.id)}
                          disabled={actionLoading}
                          title={t("reviews.delete")}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedId === review.id && (
                    <TableRow key={`${review.id}-expanded`}>
                      <TableCell colSpan={8} className="bg-muted/20 p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} />
                            {review.customer_name && (
                              <span className="text-sm font-medium">{review.customer_name}</span>
                            )}
                            <span className="text-xs text-muted-foreground">{review.customer_phone}</span>
                          </div>
                          {review.comment && (
                            <p className="text-sm">{review.comment}</p>
                          )}
                          {review.image_urls && review.image_urls.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {review.image_urls.map((url, i) => (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                                  <img
                                    src={url}
                                    alt=""
                                    className="h-16 w-16 rounded-md border object-cover"
                                  />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Load More */}
      {page < totalPages && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchReviews(filter, page + 1, true)}
            disabled={loading}
          >
            {loading ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <ChevronDown className="me-2 h-4 w-4" />}
            {t("reviews.loadMore")}
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("reviews.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("reviews.deleteConfirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("reviews.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              {t("reviews.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkAction === "deleted"} onOpenChange={(open) => !open && setBulkAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("reviews.bulkDeleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("reviews.bulkDeleteDesc", { count: selected.size })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("reviews.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => handleBulkAction("deleted")}
            >
              {t("reviews.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

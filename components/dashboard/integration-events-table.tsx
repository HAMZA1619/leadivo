"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RelativeDate } from "@/components/dashboard/relative-date"
import { ArrowLeft, Activity, Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

interface IntegrationEvent {
  id: string
  integration_id: string | null
  event_type: string
  payload: Record<string, unknown>
  status: string
  error: string | null
  processed_at: string | null
  created_at: string
}

interface Props {
  appName: string
  integrationId: string
  initialEvents: IntegrationEvent[]
  hasMore: boolean
}

function parseErrorMessage(raw: string | null): string | null {
  if (!raw) return null
  // Try to extract message from JSON embedded in error string (e.g. "WhatsApp API error 400: {"status":400,"error":"..."}")
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0])
      const msg = parsed.message || parsed.error || parsed.error_message || parsed.detail
      if (typeof msg === "string" && msg) return msg
      if (typeof parsed.error === "object" && parsed.error?.message) return parsed.error.message
    } catch { /* not valid JSON, fall through */ }
  }
  // Strip common prefixes like "WhatsApp API error 400: "
  const prefixMatch = raw.match(/^.+?:\s*(.+)/)
  if (prefixMatch && prefixMatch[1] && !prefixMatch[1].startsWith("{")) return prefixMatch[1]
  return raw
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  pending: "secondary",
  processing: "outline",
  failed: "destructive",
}

export function IntegrationEventsTable({ appName, integrationId, initialEvents, hasMore: initialHasMore }: Props) {
  const { t } = useTranslation()
  const [events, setEvents] = useState(initialEvents)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)

  async function loadMore() {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      const res = await fetch(`/api/integrations/events?integration_id=${integrationId}&page=${page}`)
      if (!res.ok) {
        setHasMore(false)
        return
      }
      const data = await res.json()
      setEvents((prev) => [...prev, ...data.events])
      setHasMore(data.hasMore)
      setPage((p) => p + 1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/integrations"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">
          {t("integrations.events.title", { name: appName })}
        </h1>
      </div>

      {events.length > 0 ? (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("integrations.events.eventType")}</TableHead>
                  <TableHead>{t("integrations.events.order")}</TableHead>
                  <TableHead>{t("integrations.events.customer")}</TableHead>
                  <TableHead>{t("integrations.events.status")}</TableHead>
                  <TableHead>{t("integrations.events.error")}</TableHead>
                  <TableHead>{t("integrations.events.date")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      {event.event_type}
                    </TableCell>
                    <TableCell>
                      {event.payload.order_number
                        ? `#${event.payload.order_number}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {(event.payload.customer_name as string) || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[event.status] || "secondary"}>
                        {t(`integrations.events.statuses.${event.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate text-sm text-red-600 dark:text-red-400" title={event.error || undefined}>
                      {parseErrorMessage(event.error) || "—"}
                    </TableCell>
                    <TableCell>
                      <RelativeDate date={event.created_at} />
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
                {t("integrations.events.loadMore")}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Activity className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">{t("integrations.events.empty")}</p>
        </div>
      )}
    </div>
  )
}

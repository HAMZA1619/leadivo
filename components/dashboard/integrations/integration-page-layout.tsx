"use client"

import { useState, useEffect } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RelativeDate } from "@/components/dashboard/relative-date"
import { Activity, Loader2, Save, Settings, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"
import { useLanguageStore } from "@/lib/store/language-store"

interface IntegrationEvent {
  id: string
  event_type: string
  payload: Record<string, unknown>
  status: string
  error: string | null
  created_at: string
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  pending: "secondary",
  processing: "outline",
  failed: "destructive",
  abandoned: "destructive",
}

interface Props {
  integrationId: string
  installed: boolean
  children: React.ReactNode
  hasChanges?: boolean
  saving?: boolean
  saveDisabled?: boolean
  onSave?: () => void
  onDiscard?: () => void
}

export function IntegrationPageLayout({ integrationId, installed, children, hasChanges, saving, saveDisabled, onSave, onDiscard }: Props) {
  const { t } = useTranslation()
  const language = useLanguageStore((s) => s.language)
  const dir = language === "ar" ? "rtl" : "ltr"
  const [activeTab, setActiveTab] = useState("config")
  const [events, setEvents] = useState<IntegrationEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    if (!installed || activeTab !== "events" || fetched) return
    setLoading(true)
    fetch(`/api/integrations/events?integration_id=${integrationId}&page=0`)
      .then((res) => (res.ok ? res.json() : { events: [], hasMore: false }))
      .then((data) => {
        setEvents(data.events || [])
        setHasMore(data.hasMore ?? false)
        setPage(1)
        setFetched(true)
      })
      .finally(() => setLoading(false))
  }, [activeTab, fetched, installed, integrationId])

  if (!installed) return <>{children}</>

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
      setHasMore(data.hasMore ?? false)
      setPage((p) => p + 1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div dir={dir} className="flex flex-wrap items-center justify-between gap-2">
        <TabsList>
          <TabsTrigger value="config">
            <Settings className="me-1.5 h-3.5 w-3.5" />
            {t("integrations.settings")}
          </TabsTrigger>
          <TabsTrigger value="events">
            <Activity className="me-1.5 h-3.5 w-3.5" />
            {t("integrations.events.link")}
          </TabsTrigger>
        </TabsList>
        {hasChanges && onSave && onDiscard && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDiscard}
            >
              <X className="me-1.5 h-3.5 w-3.5" />
              {t("integrations.discard")}
            </Button>
            <Button
              size="sm"
              onClick={onSave}
              disabled={saving || saveDisabled}
            >
              {saving ? (
                <Loader2 className="me-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="me-1.5 h-3.5 w-3.5" />
              )}
              {t("integrations.saveChanges")}
            </Button>
          </div>
        )}
      </div>
      <TabsContent value="config">
        {children}
      </TabsContent>
      <TabsContent value="events">
        {loading && events.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("integrations.events.eventType")}</TableHead>
                    <TableHead>{t("integrations.events.order")}</TableHead>
                    <TableHead>{t("integrations.events.status")}</TableHead>
                    <TableHead>{t("integrations.events.error")}</TableHead>
                    <TableHead>{t("integrations.events.date")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((ev) => (
                    <TableRow key={ev.id}>
                      <TableCell className="text-sm font-medium">
                        {ev.event_type}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ev.payload.order_number ? `#${ev.payload.order_number}` : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[ev.status] || "secondary"}>
                          {t(`integrations.events.statuses.${ev.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm text-red-600">
                        {ev.error || "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <RelativeDate date={ev.created_at} />
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
      </TabsContent>
    </Tabs>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"
import { APP_LIST } from "@/lib/integrations/registry"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { BarChart3, Bell, Puzzle, Table as TableIcon, Truck } from "lucide-react"
import type { AppDefinition } from "@/lib/integrations/registry"

const CATEGORY_ORDER = ["analytics", "notifications", "productivity", "shipping"] as const

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  analytics: BarChart3,
  notifications: Bell,
  productivity: TableIcon,
  shipping: Truck,
}

interface InstalledIntegration {
  id: string
  store_id: string
  integration_id: string
  config: Record<string, unknown>
  installed_at: string
  updated_at: string
}

interface Props {
  storeId: string
  installedIntegrations: InstalledIntegration[]
  latestEvents?: Record<string, { status: string; created_at: string }>
}

function getStatusInfo(
  installed: InstalledIntegration | undefined,
  t?: (key: string) => string,
): { color: string; dotColor: string; label: string } {
  if (!installed) return { color: "", dotColor: "", label: "" }
  const config = installed.config as Record<string, unknown>
  if (config.connected === false) {
    return { color: "text-amber-600 dark:text-amber-400", dotColor: "bg-amber-500", label: t?.("integrations.statusAttention") || "Attention" }
  }
  return { color: "text-green-600 dark:text-green-400", dotColor: "bg-green-500", label: t?.("integrations.statusActive") || "Active" }
}

export function IntegrationManager({ storeId, installedIntegrations, latestEvents = {} }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [uninstallId, setUninstallId] = useState<string | null>(null)

  const installedMap = new Map(
    installedIntegrations.map((i) => [i.integration_id, i])
  )

  async function handleTestModeToggle(installed: InstalledIntegration) {
    const currentTestMode = !!(installed.config as Record<string, unknown>).test_mode
    const res = await fetch("/api/integrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: installed.id,
        config: { ...installed.config, test_mode: !currentTestMode },
      }),
    })
    if (res.ok) {
      toast.success(
        currentTestMode
          ? t("integrations.liveMode")
          : t("integrations.testMode")
      )
      router.refresh()
    }
  }

  async function handleUninstall() {
    if (!uninstallId) return

    const installed = installedIntegrations.find((i) => i.id === uninstallId)
    if (installed?.integration_id === "whatsapp") {
      await fetch("/api/integrations/whatsapp/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_id: storeId }),
      })
    }

    if (installed?.integration_id === "google-sheets") {
      await fetch("/api/integrations/google-sheets/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_id: storeId }),
      })
    }

    const res = await fetch(`/api/integrations?id=${uninstallId}`, {
      method: "DELETE",
    })
    if (res.ok) {
      toast.success(t("integrations.uninstalled"))
      router.refresh()
    }
    setUninstallId(null)
  }

  const groupedApps = CATEGORY_ORDER
    .map((cat) => ({
      category: cat,
      apps: APP_LIST.filter((app) => app.category === cat),
    }))
    .filter((g) => g.apps.length > 0)

  function renderAppCard(app: AppDefinition) {
    const installed = installedMap.get(app.id)
    const Icon = app.icon
    const config = (installed?.config || {}) as Record<string, unknown>
    const hasTestCode = (app.id === "meta-capi" || app.id === "tiktok-eapi") && !!config.test_event_code
    const isTestMode = hasTestCode && !!config.test_mode
    const status = installed ? getStatusInfo(installed, t) : null

    return (
      <Card key={app.id}>
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-5 w-5" style={app.iconColor ? { color: app.iconColor } : undefined} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base truncate">{app.name}</CardTitle>
              {installed && status && (
                <div className={`flex items-center gap-1.5 text-xs ${status.color}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${status.dotColor}`} />
                  <span className="hidden sm:inline">{status.label}</span>
                </div>
              )}
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1 hidden sm:block">
              {app.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {installed && hasTestCode && (
              <Switch
                checked={!isTestMode}
                onCheckedChange={() => handleTestModeToggle(installed)}
              />
            )}
            {installed ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/integrations/${app.id}`)}
              >
                {t("integrations.open")}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => router.push(`/dashboard/integrations/${app.id}`)}
              >
                {t("integrations.install")}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("integrations.title")}</h1>
      </div>

      {groupedApps.length > 0 ? (
        <div className="space-y-8">
          {groupedApps.map(({ category, apps }) => {
            const CatIcon = CATEGORY_ICONS[category] || Puzzle
            return (
              <section key={category}>
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <CatIcon className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      {t(`integrations.category.${category}`)}
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground/70 ps-6">
                    {t(`integrations.categoryDesc.${category}`)}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {apps.map(renderAppCard)}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Puzzle className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">{t("integrations.empty")}</p>
        </div>
      )}

      <AlertDialog
        open={!!uninstallId}
        onOpenChange={(open) => !open && setUninstallId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("integrations.uninstallTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("integrations.uninstallDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("integrations.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUninstall}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("integrations.uninstall")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

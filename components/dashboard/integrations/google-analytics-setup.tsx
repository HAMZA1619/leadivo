"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, CheckCircle2 } from "lucide-react"
import { GoogleAnalyticsIcon } from "@/components/icons/google-analytics"
import { IntegrationPageHeader } from "@/components/dashboard/integrations/integration-page-header"
import { IntegrationPageLayout } from "@/components/dashboard/integrations/integration-page-layout"

interface InstalledIntegration {
  id: string
  store_id: string
  integration_id: string
  config: Record<string, unknown>
}

interface Props {
  storeId: string
  installed: InstalledIntegration | null
  onDone?: () => void
}

export function GoogleAnalyticsSetup({ storeId, installed, onDone }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const done = onDone ?? (() => router.refresh())
  const config = installed?.config || {}

  const savedMeasurementId = (config.measurement_id as string) || ""
  const [measurementId, setMeasurementId] = useState(savedMeasurementId)
  const [saving, setSaving] = useState(false)

  const isValid = /^G-[A-Z0-9]+$/.test(measurementId.trim())
  const hasChanges = measurementId.trim() !== savedMeasurementId

  async function handleSave() {
    if (!isValid) return

    setSaving(true)
    try {
      const newConfig = { measurement_id: measurementId.trim() }

      if (installed) {
        const res = await fetch("/api/integrations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: installed.id, config: newConfig }),
        })
        if (!res.ok) {
          toast.error(t("integrations.connectFailed"))
          return
        }
      } else {
        const res = await fetch("/api/integrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            store_id: storeId,
            integration_id: "google-analytics",
            config: newConfig,
          }),
        })
        if (!res.ok) {
          toast.error(t("integrations.connectFailed"))
          return
        }
      }

      toast.success(t("integrations.googleAnalyticsSaved"))
      done()
    } catch {
      toast.error(t("integrations.connectFailed"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <IntegrationPageHeader
        title="Google Analytics"
        description={t("integrations.googleAnalyticsDescription")}
        icon={GoogleAnalyticsIcon}
        iconColor="#E37400"
        installed={installed}
        storeId={storeId}
        integrationId="google-analytics"
      />
      <IntegrationPageLayout
        integrationId="google-analytics"
        installed={!!installed}
        hasChanges={hasChanges}
        saving={saving}
        saveDisabled={!isValid}
        onSave={handleSave}
        onDiscard={() => setMeasurementId(savedMeasurementId)}
      >
      <div className="space-y-4">
      {installed && !!config.measurement_id && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
          <p className="text-sm text-green-800 dark:text-green-200">
            {t("integrations.googleAnalyticsSetupHint")}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="measurement_id">{t("integrations.googleAnalyticsMeasurementId")}</Label>
        <Input
          id="measurement_id"
          placeholder="G-XXXXXXXXXX"
          value={measurementId}
          onChange={(e) => setMeasurementId(e.target.value.toUpperCase())}
        />
        {measurementId && !isValid && (
          <p className="text-xs text-red-600">{t("integrations.googleAnalyticsInvalidId")}</p>
        )}
      </div>
      {!installed && (
        <Button
          className="w-full"
          onClick={handleSave}
          disabled={saving || !isValid}
        >
          {saving ? (
            <Loader2 className="me-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="me-2 h-4 w-4" />
          )}
          {t("integrations.googleAnalyticsSave")}
        </Button>
      )}
      </div>
      </IntegrationPageLayout>
    </div>
  )
}

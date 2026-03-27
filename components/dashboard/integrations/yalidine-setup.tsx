"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, CheckCircle2, Wifi } from "lucide-react"
import { YalidineIcon } from "@/components/icons/yalidine"
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

export function YalidineSetup({ storeId, installed, onDone }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const done = onDone ?? (() => router.refresh())
  const config = installed?.config || {}

  const savedApiId = (config.api_id as string) || ""
  const savedApiToken = (config.api_token as string) || ""
  const savedFromWilaya = (config.from_wilaya_name as string) || ""
  const savedAutoCreate = config.auto_create_shipment !== false
  const savedEconomic = (config.economic as boolean) || false

  const [apiId, setApiId] = useState(savedApiId)
  const [apiToken, setApiToken] = useState(savedApiToken)
  const [fromWilaya, setFromWilaya] = useState(savedFromWilaya)
  const [autoCreate, setAutoCreate] = useState(savedAutoCreate)
  const [economic, setEconomic] = useState(savedEconomic)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testOk, setTestOk] = useState<boolean | null>(null)
  const [wilayas, setWilayas] = useState<Array<{ id: number; name: string }>>([])

  const hasChanges =
    apiId.trim() !== savedApiId ||
    apiToken.trim() !== savedApiToken ||
    fromWilaya.trim() !== savedFromWilaya ||
    autoCreate !== savedAutoCreate ||
    economic !== savedEconomic

  function handleDiscard() {
    setApiId(savedApiId)
    setApiToken(savedApiToken)
    setFromWilaya(savedFromWilaya)
    setAutoCreate(savedAutoCreate)
    setEconomic(savedEconomic)
    setTestOk(null)
  }

  async function handleTest() {
    if (!apiId.trim() || !apiToken.trim()) return
    setTesting(true)
    setTestOk(null)
    try {
      const res = await fetch("/api/integrations/yalidine/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_id: storeId, api_id: apiId.trim(), api_token: apiToken.trim() }),
      })
      const data = await res.json()
      if (data.ok) {
        setTestOk(true)
        if (data.wilayas) setWilayas(data.wilayas)
        toast.success(t("integrations.yalidineTestSuccess"))
      } else {
        setTestOk(false)
        toast.error(data.error || t("integrations.yalidineTestFailed"))
      }
    } catch {
      setTestOk(false)
      toast.error(t("integrations.yalidineTestFailed"))
    } finally {
      setTesting(false)
    }
  }

  async function handleSave() {
    if (!apiId.trim() || !apiToken.trim()) return
    setSaving(true)
    try {
      const newConfig = {
        api_id: apiId.trim(),
        api_token: apiToken.trim(),
        from_wilaya_name: fromWilaya.trim(),
        enabled_events: ["order.created"],
        auto_create_shipment: autoCreate,
        economic,
      }

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
          body: JSON.stringify({ store_id: storeId, integration_id: "yalidine", config: newConfig }),
        })
        if (!res.ok) {
          toast.error(t("integrations.connectFailed"))
          return
        }
      }

      toast.success(t("integrations.yalidineConfigSaved"))
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
        title="Yalidine Express"
        description={t("integrations.yalidineDescription")}
        icon={YalidineIcon}
        iconColor="#E02424"
        installed={installed}
        storeId={storeId}
        integrationId="yalidine"
      />
      <IntegrationPageLayout
        integrationId="yalidine"
        installed={!!installed}
        hasChanges={hasChanges}
        saving={saving}
        saveDisabled={!apiId.trim() || !apiToken.trim()}
        onSave={handleSave}
        onDiscard={handleDiscard}
      >
        <div className="space-y-4">
          {installed && !!config.api_id && (
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
              <p className="text-sm text-green-800 dark:text-green-200">
                {t("integrations.yalidineConnected")}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="api_id">{t("integrations.yalidineApiId")}</Label>
            <Input
              id="api_id"
              placeholder="API ID"
              value={apiId}
              onChange={(e) => setApiId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api_token">{t("integrations.yalidineApiToken")}</Label>
            <Input
              id="api_token"
              type="password"
              placeholder="API Token"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            onClick={handleTest}
            disabled={testing || !apiId.trim() || !apiToken.trim()}
            className="w-full"
          >
            {testing ? (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            ) : testOk ? (
              <CheckCircle2 className="me-2 h-4 w-4 text-green-600" />
            ) : (
              <Wifi className="me-2 h-4 w-4" />
            )}
            {t("integrations.yalidineTestConnection")}
          </Button>

          <div className="space-y-2">
            <Label htmlFor="from_wilaya">{t("integrations.yalidineFromWilaya")}</Label>
            {wilayas.length > 0 ? (
              <select
                id="from_wilaya"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={fromWilaya}
                onChange={(e) => setFromWilaya(e.target.value)}
              >
                <option value="">{t("integrations.yalidineSelectWilaya")}</option>
                {wilayas.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.id} - {w.name}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id="from_wilaya"
                placeholder="Alger"
                value={fromWilaya}
                onChange={(e) => setFromWilaya(e.target.value)}
              />
            )}
            <p className="text-xs text-muted-foreground">{t("integrations.yalidineFromWilayaHint")}</p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">{t("integrations.yalidineAutoShip")}</p>
              <p className="text-xs text-muted-foreground">{t("integrations.yalidineAutoShipDesc")}</p>
            </div>
            <Switch checked={autoCreate} onCheckedChange={setAutoCreate} />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">{t("integrations.yalidineEconomic")}</p>
              <p className="text-xs text-muted-foreground">{t("integrations.yalidineEconomicDesc")}</p>
            </div>
            <Switch checked={economic} onCheckedChange={setEconomic} />
          </div>

          {!installed && (
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={saving || !apiId.trim() || !apiToken.trim()}
            >
              {saving ? (
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="me-2 h-4 w-4" />
              )}
              {t("integrations.yalidineInstall")}
            </Button>
          )}
        </div>
      </IntegrationPageLayout>
    </div>
  )
}

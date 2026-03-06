"use client"

import urlJoin from "url-join"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AVAILABLE_FIELDS,
  DEFAULT_FIELD_MAPPINGS,
  type FieldMapping,
  type RowGrouping,
  type SyncFilters,
} from "@/lib/integrations/apps/google-sheets"

import { GoogleSheetsIcon } from "@/components/icons/google-sheets"
import {
  Loader2,
  CheckCircle2,
  FileSpreadsheet,
  ExternalLink,
  GripVertical,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertTriangle,
  ChevronsUpDown,
} from "lucide-react"
import { IntegrationPageHeader } from "@/components/dashboard/integrations/integration-page-header"
import { IntegrationPageLayout } from "@/components/dashboard/integrations/integration-page-layout"
import { useLanguageStore } from "@/lib/store/language-store"

interface InstalledIntegration {
  id: string
  store_id: string
  integration_id: string
  config: Record<string, unknown>
}

interface Market {
  id: string
  name: string
}

interface Props {
  storeId: string
  storeName: string
  installed: InstalledIntegration | null
  markets?: Market[]
}

function initMappingsFromConfig(config: Record<string, unknown>): {
  enabled: FieldMapping[]
  disabled: string[]
} {
  const saved = config.field_mappings as FieldMapping[] | undefined
  if (saved && saved.length > 0) {
    const enabledKeys = new Set(saved.map((f) => f.key))
    const disabled = AVAILABLE_FIELDS
      .filter((f) => !enabledKeys.has(f.key))
      .map((f) => f.key)
    return { enabled: saved, disabled }
  }
  return {
    enabled: [...DEFAULT_FIELD_MAPPINGS],
    disabled: [],
  }
}

function StepIndicator({ current, total, labels }: { current: number; total: number; labels: string[] }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        const isActive = step === current
        const isDone = step < current
        return (
          <div key={step} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={`h-px w-8 ${isDone ? "bg-primary" : "bg-border"}`}
              />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  isDone
                    ? "bg-primary text-primary-foreground"
                    : isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isDone ? <Check className="h-3 w-3" /> : step}
              </div>
              <span
                className={`text-xs hidden sm:inline ${
                  isActive ? "font-medium text-foreground" : "text-muted-foreground"
                }`}
              >
                {labels[i]}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MarketFilterSelect({
  markets,
  selected,
  onChange,
  labelText,
  hintText,
  allText,
}: {
  markets: Market[]
  selected: string[]
  onChange: (ids: string[]) => void
  labelText: string
  hintText: string
  allText: string
}) {
  if (markets.length === 0) return null
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{labelText}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-full justify-between font-normal">
            <span className="truncate">
              {selected.length === 0
                ? allText
                : markets
                    .filter((m) => selected.includes(m.id))
                    .map((m) => m.name)
                    .join(", ")}
            </span>
            <ChevronsUpDown className="ms-2 h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-1">
          {markets.map((market) => {
            const isSelected = selected.includes(market.id)
            return (
              <button
                key={market.id}
                type="button"
                onClick={() => {
                  onChange(
                    isSelected
                      ? selected.filter((id) => id !== market.id)
                      : [...selected, market.id],
                  )
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
              >
                <Check className={`h-3.5 w-3.5 ${isSelected ? "opacity-100" : "opacity-0"}`} />
                {market.name}
              </button>
            )
          })}
        </PopoverContent>
      </Popover>
      <p className="text-xs text-muted-foreground">{hintText}</p>
    </div>
  )
}

function FieldMappingEditor({
  enabled,
  disabled,
  onChange,
  tEnabledFields,
  tDisabledFields,
  tColumnHeader,
}: {
  enabled: FieldMapping[]
  disabled: string[]
  onChange: (enabled: FieldMapping[], disabled: string[]) => void
  tEnabledFields: string
  tDisabledFields: string
  tColumnHeader: string
}) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  function toggleField(key: string) {
    const inEnabled = enabled.findIndex((f) => f.key === key)
    if (inEnabled >= 0) {
      if (enabled.length <= 1) return
      const next = enabled.filter((_, i) => i !== inEnabled)
      onChange(next, [...disabled, key])
    } else {
      const def = AVAILABLE_FIELDS.find((f) => f.key === key)
      if (!def) return
      const existing = enabled.find((f) => f.key === key)
      onChange(
        [...enabled, { key, header: existing?.header || def.defaultHeader }],
        disabled.filter((k) => k !== key),
      )
    }
  }

  function updateHeader(key: string, header: string) {
    onChange(
      enabled.map((f) => (f.key === key ? { ...f, header } : f)),
      disabled,
    )
  }

  function handleDragStart(idx: number) {
    setDragIdx(idx)
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) return
    const next = [...enabled]
    const [moved] = next.splice(dragIdx, 1)
    next.splice(idx, 0, moved)
    onChange(next, disabled)
    setDragIdx(idx)
  }

  function handleDragEnd() {
    setDragIdx(null)
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          {tEnabledFields}
        </p>
        <div className="space-y-1">
          {enabled.map((field, idx) => {
            const def = AVAILABLE_FIELDS.find((f) => f.key === field.key)
            return (
              <div
                key={field.key}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-2 rounded-md border bg-background p-2 ${
                  dragIdx === idx ? "opacity-50" : ""
                }`}
              >
                <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground/50" />
                <Checkbox
                  checked
                  onCheckedChange={() => toggleField(field.key)}
                  className="shrink-0"
                />
                <span className="shrink-0 text-xs text-muted-foreground w-24 truncate">
                  {def?.defaultHeader || field.key}
                </span>
                <Input
                  value={field.header}
                  onChange={(e) => updateHeader(field.key, e.target.value)}
                  className="h-7 text-sm"
                  placeholder={tColumnHeader}
                />
              </div>
            )
          })}
        </div>
      </div>

      {disabled.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {tDisabledFields}
          </p>
          <div className="space-y-1">
            {disabled.map((key) => {
              const def = AVAILABLE_FIELDS.find((f) => f.key === key)
              if (!def) return null
              return (
                <div
                  key={key}
                  className="flex items-center gap-2 rounded-md border border-dashed bg-muted/30 p-2"
                >
                  <div className="w-3.5 shrink-0" />
                  <Checkbox
                    checked={false}
                    onCheckedChange={() => toggleField(key)}
                    className="shrink-0"
                  />
                  <span className="text-sm text-muted-foreground">
                    {def.defaultHeader}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}


export function GoogleSheetsSetup({ storeId, storeName, installed, markets = [] }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const language = useLanguageStore((s) => s.language)
  const dir = language === "ar" ? "rtl" : "ltr"
  const g = (key: string, opts?: Record<string, unknown>) => String(t(`integrations.googleSheets.${key}`, opts as never))

  const scopeError = searchParams.get("error") === "insufficient_scopes"
  const config = (installed?.config || {}) as Record<string, unknown>
  const isConnected = !!config.connected
  const hasSpreadsheet = !!config.spreadsheet_id

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [savingFields, setSavingFields] = useState(false)
  const [syncOldOrders, setSyncOldOrders] = useState(false)
  const [rowGrouping, setRowGrouping] = useState<RowGrouping>(
    (config.row_grouping as RowGrouping) || "per_product",
  )
  const [trackAbandoned, setTrackAbandoned] = useState(
    !!(config as Record<string, unknown>).track_abandoned_checkouts
  )
  const [spreadsheetName, setSpreadsheetName] = useState(`${storeName} Orders`)
  // Filters state
  const savedFilters = (config.filters as SyncFilters) || {}
  const [filterMarkets, setFilterMarkets] = useState<string[]>(
    savedFilters.market_ids || [],
  )

  const initialRowGrouping = (config.row_grouping as RowGrouping) || "per_product"
  const initial = initMappingsFromConfig(config)
  const [enabledFields, setEnabledFields] = useState<FieldMapping[]>(
    initial.enabled,
  )
  const [disabledFields, setDisabledFields] = useState<string[]>(
    initial.disabled,
  )

  const initialTrackAbandoned = !!(config as Record<string, unknown>).track_abandoned_checkouts
  const hasChanges =
    rowGrouping !== initialRowGrouping ||
    trackAbandoned !== initialTrackAbandoned ||
    JSON.stringify(enabledFields) !== JSON.stringify(initial.enabled) ||
    JSON.stringify(disabledFields) !== JSON.stringify(initial.disabled) ||
    JSON.stringify(filterMarkets) !== JSON.stringify(savedFilters.market_ids || [])

  function handleCancelChanges() {
    setEnabledFields(initial.enabled)
    setDisabledFields(initial.disabled)
    setRowGrouping(initialRowGrouping)
    setTrackAbandoned(initialTrackAbandoned)
    setFilterMarkets(savedFilters.market_ids || [])
  }


  function handleFieldsChange(enabled: FieldMapping[], disabled: string[]) {
    setEnabledFields(enabled)
    setDisabledFields(disabled)
  }

  function refreshPage() {
    router.refresh()
  }

  async function handleConnect() {
    setLoading(true)
    try {
      const res = await fetch("/api/integrations/google-sheets/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_id: storeId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || g("connectFailed"))
        return
      }
      window.location.href = data.url
    } catch {
      toast.error(g("connectFailed"))
    } finally {
      setLoading(false)
    }
  }

  async function handleFinishSetup() {
    setLoading(true)
    try {
      const filters: SyncFilters = {}
      if (filterMarkets.length > 0) filters.market_ids = filterMarkets

      const mappingsPayload = {
        field_mappings: enabledFields,
        row_grouping: rowGrouping,
        track_abandoned_checkouts: trackAbandoned,
        filters,
      }

      const res = await fetch(
        "/api/integrations/google-sheets/spreadsheets",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            store_id: storeId,
            spreadsheet_name: spreadsheetName.trim() || undefined,
            ...mappingsPayload,
          }),
        },
      )
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || g("createFailed"))
        setLoading(false)
        return
      }

      toast.success(g("setupReady"))

      if (syncOldOrders) {
        handleSync().catch(() => {
          toast.error(g("syncFailed"))
        })
      }

      refreshPage()
    } catch {
      toast.error(g("setupFailed"))
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveFieldMappings() {
    if (!installed) return
    setSavingFields(true)
    try {
      const res = await fetch("/api/integrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: installed.id,
          config: {
            field_mappings: enabledFields,
            row_grouping: rowGrouping,
            track_abandoned_checkouts: trackAbandoned,
            filters: {
              ...(filterMarkets.length > 0 ? { market_ids: filterMarkets } : {}),
            },
          },
        }),
      })
      if (!res.ok) {
        toast.error(g("settingsSaveFailed"))
        return
      }
      toast.success(g("settingsSaved"))
      refreshPage()
    } catch {
      toast.error(g("settingsSaveFailed"))
    } finally {
      setSavingFields(false)
    }
  }

  async function handleSync() {
    try {
      const res = await fetch("/api/integrations/google-sheets/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_id: storeId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || g("syncFailed"))
        return
      }
      toast.success(g("syncSuccess", { count: data.synced }))
    } catch {
      toast.error(g("syncFailed"))
    }
  }

  function handleNextFromStep1() {
    setStep(2)
  }

  const rowGroupingOptions: {
    value: RowGrouping
    label: string
    description: string
  }[] = [
    {
      value: "per_product",
      label: g("perProduct"),
      description: g("perProductHint"),
    },
    {
      value: "per_order",
      label: g("perOrder"),
      description: g("perOrderHint"),
    },
  ]

  return (
    <div className="space-y-6">
      <IntegrationPageHeader
        title={g("title")}
        description={g("description")}
        icon={GoogleSheetsIcon}
        iconColor="#0F9D58"
        installed={installed}
        storeId={storeId}
        integrationId="google-sheets"
        onBeforeUninstall={async () => {
          await fetch("/api/integrations/google-sheets/disconnect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ store_id: storeId }),
          })
        }}
      />

      <IntegrationPageLayout
        integrationId="google-sheets"
        installed={!!installed}
        hasChanges={hasChanges && isConnected && hasSpreadsheet}
        saving={savingFields}
        saveDisabled={enabledFields.length === 0}
        onSave={handleSaveFieldMappings}
        onDiscard={handleCancelChanges}
      >

      {/* Scope error banner */}
      {scopeError && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800 dark:text-amber-200">
              {g("insufficientPermissions")}
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
              {g("insufficientPermissionsHint")}
            </p>
          </div>
        </div>
      )}

      {/* State 1: Not connected */}
      {!isConnected && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="rounded-full bg-muted p-4">
            <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center space-y-1">
            <p className="font-medium">{g("connectTitle")}</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              {g("connectDescription")}
            </p>
          </div>
          <Button onClick={handleConnect} disabled={loading} className="mt-2">
            {loading ? (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="me-2 h-4 w-4" />
            )}
            {g("connectButton")}
          </Button>
        </div>
      )}

      {/* State 2: Connected, no spreadsheet — Setup Wizard */}
      {isConnected && !hasSpreadsheet && (
        <>
          <div dir={dir} className="flex items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {g("connectedBanner")}
              </p>
            </div>
            <StepIndicator current={step} total={2} labels={[g("chooseSpreadsheet"), g("settings")]} />
          </div>

          {/* Step 1: Name the spreadsheet */}
          {step === 1 && (
            <div dir={dir} className="mt-4 space-y-4">
              <div>
                <h2 className="text-lg font-medium">{g("createNew")}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {g("createNewHint")}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{g("spreadsheetName")}</Label>
                <Input
                  value={spreadsheetName}
                  onChange={(e) => setSpreadsheetName(e.target.value)}
                  placeholder={g("spreadsheetNamePlaceholder")}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {g("spreadsheetNameHint")}
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNextFromStep1}>
                  {g("next")}
                  <ArrowRight className="ms-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Column mapping + Row grouping + Sync + Finish */}
          {step === 2 && (
            <>
              <div dir={dir} className="mt-4 grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{g("columnMapping")}</Label>
                  <p className="text-xs text-muted-foreground">
                    {g("columnMappingHint")}
                  </p>
                  <FieldMappingEditor
                      enabled={enabledFields}
                      disabled={disabledFields}
                      onChange={handleFieldsChange}
                      tEnabledFields={g("enabledFields")}
                      tDisabledFields={g("disabledFields")}
                      tColumnHeader={g("columnHeader")}
                    />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{g("rowGrouping")}</Label>
                    {rowGroupingOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-start gap-3 cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                          rowGrouping === opt.value
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="row-grouping"
                          value={opt.value}
                          checked={rowGrouping === opt.value}
                          onChange={() => setRowGrouping(opt.value)}
                          className="mt-0.5 h-4 w-4 appearance-none rounded-full border-2 border-input checked:border-primary checked:bg-primary checked:shadow-[inset_0_0_0_2.5px_white]"
                        />
                        <div>
                          <p className="text-sm font-medium">{opt.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {opt.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <MarketFilterSelect
                    markets={markets}
                    selected={filterMarkets}
                    onChange={setFilterMarkets}
                    labelText={g("marketFilter")}
                    hintText={g("marketFilterHint")}
                    allText={g("allMarkets")}
                  />

                  <label className="flex items-center gap-3 cursor-pointer rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                    <Checkbox
                      checked={syncOldOrders}
                      onCheckedChange={(v) => setSyncOldOrders(!!v)}
                      className="shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium">{g("syncExisting")}</p>
                      <p className="text-xs text-muted-foreground">
                        {g("syncExistingHint")}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div dir={dir} className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="me-2 h-4 w-4" />
                  {g("back")}
                </Button>
                <Button onClick={handleFinishSetup} disabled={loading || enabledFields.length === 0}>
                  {loading ? (
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="me-2 h-4 w-4" />
                  )}
                  {g("finishSetup")}
                </Button>
              </div>
            </>
          )}
        </>
      )}

      {/* State 3: Spreadsheet configured */}
      {hasSpreadsheet && (
        <div dir={dir} className="space-y-4">
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900 dark:bg-green-950 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                <div className="min-w-0">
                  <p className="font-medium text-green-800 dark:text-green-200">
                    {g("connectedStatus")}
                  </p>
                  <a
                    href={urlJoin("https://docs.google.com/spreadsheets/d", String(config.spreadsheet_id))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 flex items-center gap-1 text-sm text-green-600 hover:underline dark:text-green-400"
                  >
                    {(config.spreadsheet_name as string) || "Spreadsheet"}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {config.google_email ? (
                    <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-0.5">
                      {String(config.google_email)}
                    </p>
                  ) : null}
                </div>
              </div>

            </div>
          </div>

          <div dir={dir} className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{g("columnMapping")}</Label>
              <p className="text-xs text-muted-foreground">
                {g("columnMappingHint")}
              </p>
              <FieldMappingEditor
                enabled={enabledFields}
                disabled={disabledFields}
                onChange={handleFieldsChange}
                tEnabledFields={g("enabledFields")}
                tDisabledFields={g("disabledFields")}
                tColumnHeader={g("columnHeader")}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">{g("filters")}</Label>
                  <p className="text-xs text-muted-foreground mt-1">{g("filtersHint")}</p>
                </div>
                <MarketFilterSelect
                  markets={markets}
                  selected={filterMarkets}
                  onChange={setFilterMarkets}
                  labelText={g("marketFilter")}
                  hintText={g("marketFilterHint")}
                  allText={g("allMarkets")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{g("rowGrouping")}</Label>
                <p className="text-xs text-muted-foreground">
                  {g("rowGroupingHint")}
                </p>
                {rowGroupingOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                      rowGrouping === opt.value
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="row-grouping"
                      value={opt.value}
                      checked={rowGrouping === opt.value}
                      onChange={() => setRowGrouping(opt.value)}
                      className="mt-0.5 h-4 w-4 appearance-none rounded-full border-2 border-input checked:border-primary checked:bg-primary checked:shadow-[inset_0_0_0_2.5px_white]"
                    />
                    <div>
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {opt.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">{g("trackAbandoned")}</p>
                  <p className="text-xs text-muted-foreground">
                    {g("trackAbandonedHint")}
                  </p>
                </div>
                <Switch
                  checked={trackAbandoned}
                  onCheckedChange={setTrackAbandoned}
                />
              </div>
            </div>
          </div>
        </div>
      )}


      </IntegrationPageLayout>
    </div>
  )
}

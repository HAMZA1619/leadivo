import urlJoin from "url-join"
import { createAdminClient } from "@/lib/supabase/admin"
import { OAuth2Client } from "google-auth-library"
import { sheets as googleSheets } from "@googleapis/sheets"
import {
  formatOrderRows,
  getHeaders,
  shouldSyncOrder,
  type FieldMapping,
  type RowGrouping,
  type EventPayload,
  type SyncFilters,
} from "@/lib/integrations/apps/google-sheets"

interface GoogleSheetsConfig {
  access_token: string
  refresh_token: string
  token_expiry: number
  spreadsheet_id: string
  spreadsheet_name: string
  sheet_name: string
  sheet_id?: number
  connected: boolean
  field_mappings?: FieldMapping[]
  row_grouping?: RowGrouping
  filters?: SyncFilters
  last_synced_at?: string
  google_email?: string
  track_abandoned_checkouts?: boolean
}

export function createOAuth2Client() {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    urlJoin(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", "api/integrations/google-sheets/callback"),
  )
}

export function getAuthenticatedClient(config: { access_token: string; refresh_token: string }) {
  const oauth2 = createOAuth2Client()
  oauth2.setCredentials({
    access_token: config.access_token,
    refresh_token: config.refresh_token,
  })
  return oauth2
}

export function getSheetsClient(auth: ReturnType<typeof getAuthenticatedClient>) {
  return googleSheets({ version: "v4", auth })
}

export async function revokeIntegration(storeId: string): Promise<void> {
  const supabase = createAdminClient()
  const { data: existing } = await supabase
    .from("store_integrations")
    .select("config")
    .eq("store_id", storeId)
    .eq("integration_id", "google-sheets")
    .single()

  if (existing?.config) {
    await supabase
      .from("store_integrations")
      .update({
        config: { ...(existing.config as Record<string, unknown>), connected: false },
        updated_at: new Date().toISOString(),
      })
      .eq("store_id", storeId)
      .eq("integration_id", "google-sheets")
  }
}

function isAuthError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false
  const e = err as Record<string, unknown>
  const status = e.status || (e.response as Record<string, unknown>)?.status
  if (status === 401 || status === 403) return true
  const message = String(e.message || "")
  return message.includes("invalid_grant") || message.includes("Token has been expired or revoked")
}

export async function refreshAccessToken(
  config: GoogleSheetsConfig,
  storeId?: string,
): Promise<GoogleSheetsConfig> {
  if (Date.now() < config.token_expiry - 60_000) {
    return config
  }

  try {
    const oauth2 = createOAuth2Client()
    oauth2.setCredentials({ refresh_token: config.refresh_token })
    const { credentials } = await oauth2.refreshAccessToken()

    return {
      ...config,
      access_token: credentials.access_token!,
      token_expiry: credentials.expiry_date || Date.now() + 3600 * 1000,
    }
  } catch (err) {
    if (isAuthError(err) && storeId) {
      await revokeIntegration(storeId)
      throw new Error("Google Sheets credentials expired — integration disconnected")
    }
    throw err
  }
}

export async function handleGoogleSheets(
  eventType: string,
  payload: EventPayload,
  config: GoogleSheetsConfig,
  storeId: string,
  storeName: string,
  currency: string,
): Promise<void> {
  if (eventType !== "order.created" && eventType !== "checkout.abandoned") return
  if (eventType === "checkout.abandoned" && !config.track_abandoned_checkouts) return
  if (!config.connected || !config.spreadsheet_id || !config.refresh_token) return

  if (!shouldSyncOrder(payload, config.filters)) return

  // Resolve market name if market_id is present but market_name is missing
  if (payload.market_id && !payload.market_name) {
    const supabase = createAdminClient()
    const { data: market } = await supabase
      .from("markets")
      .select("name")
      .eq("id", payload.market_id)
      .single()
    if (market) {
      payload.market_name = market.name
    }
  }

  try {
    const refreshed = await refreshAccessToken(config, storeId)
    const supabase = createAdminClient()

    if (refreshed.access_token !== config.access_token) {
      await supabase
        .from("store_integrations")
        .update({
          config: refreshed,
          updated_at: new Date().toISOString(),
        })
        .eq("store_id", storeId)
        .eq("integration_id", "google-sheets")
    }

    const auth = getAuthenticatedClient(refreshed)
    const sheets = getSheetsClient(auth)
    const rows = formatOrderRows(payload, currency, refreshed.field_mappings, refreshed.row_grouping)

    await sheets.spreadsheets.values.append({
      spreadsheetId: refreshed.spreadsheet_id,
      range: refreshed.sheet_name || "Orders",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: rows },
    })

    // Update last_synced_at
    await supabase
      .from("store_integrations")
      .update({
        config: { ...refreshed, last_synced_at: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      })
      .eq("store_id", storeId)
      .eq("integration_id", "google-sheets")
  } catch (err) {
    if (isAuthError(err)) {
      await revokeIntegration(storeId)
      throw new Error("Google Sheets credentials expired — integration disconnected")
    }
    throw err
  }
}

export { getHeaders, formatOrderRows }

import { createClient } from "@/lib/supabase/server"
import {
  refreshAccessToken,
  formatOrderRows,
  getHeaders,
  getAuthenticatedClient,
  getSheetsClient,
  revokeIntegration,
} from "@/lib/integrations/apps/google-sheets.server"
import { shouldSyncOrder } from "@/lib/integrations/apps/google-sheets"
import { NextResponse } from "next/server"

export const maxDuration = 120

const PAGE_SIZE = 200
const SHEET_BATCH_SIZE = 500

export async function POST(request: Request) {
  let storeId = ""
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { store_id } = await request.json()
    storeId = store_id
    if (!store_id)
      return NextResponse.json({ error: "Missing store_id" }, { status: 400 })

    const { data: store } = await supabase
      .from("stores")
      .select("id, currency")
      .eq("id", store_id)
      .eq("owner_id", user.id)
      .single()

    if (!store)
      return NextResponse.json({ error: "Store not found" }, { status: 404 })

    const { data: integration } = await supabase
      .from("store_integrations")
      .select("id, config")
      .eq("store_id", store_id)
      .eq("integration_id", "google-sheets")
      .single()

    if (!integration)
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 },
      )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let config = integration.config as any
    if (!config.connected || !config.spreadsheet_id)
      return NextResponse.json(
        { error: "Spreadsheet not configured" },
        { status: 400 },
      )

    config = await refreshAccessToken(config, store_id)

    const auth = getAuthenticatedClient(config)
    const sheets = getSheetsClient(auth)
    const sheetName = config.sheet_name || "Orders"
    const mappings = config.field_mappings
    const grouping = config.row_grouping

    // Clear the sheet and write headers
    await sheets.spreadsheets.values.clear({
      spreadsheetId: config.spreadsheet_id,
      range: sheetName,
      requestBody: {},
    })

    await sheets.spreadsheets.values.update({
      spreadsheetId: config.spreadsheet_id,
      range: sheetName,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [getHeaders(mappings)] },
    })

    // Paginate orders and append in batches
    let synced = 0
    let offset = 0
    let rowBuffer: string[][] = []

    while (true) {
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select(
          "order_number, customer_name, customer_phone, customer_email, customer_city, customer_country, customer_address, status, total, subtotal, note, created_at, market_id, markets(name), order_items(product_name, product_price, quantity, variant_options)",
        )
        .eq("store_id", store_id)
        .order("created_at", { ascending: true })
        .range(offset, offset + PAGE_SIZE - 1)

      if (ordersError)
        return NextResponse.json(
          { error: "Failed to fetch orders" },
          { status: 500 },
        )

      if (!orders || orders.length === 0) break

      for (const order of orders) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const marketName = (order as any).markets?.name as string | undefined
        const orderPayload = {
          ...order,
          items: order.order_items || [],
          market_name: marketName,
        }

        if (!shouldSyncOrder(orderPayload, config.filters)) continue

        synced++
        const rows = formatOrderRows(
          orderPayload,
          store.currency,
          mappings,
          grouping,
        )
        rowBuffer.push(...rows)

        if (rowBuffer.length >= SHEET_BATCH_SIZE) {
          await sheets.spreadsheets.values.append({
            spreadsheetId: config.spreadsheet_id,
            range: sheetName,
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            requestBody: { values: rowBuffer },
          })
          rowBuffer = []
        }
      }

      if (orders.length < PAGE_SIZE) break
      offset += PAGE_SIZE
    }

    // Flush remaining rows
    if (rowBuffer.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: config.spreadsheet_id,
        range: sheetName,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: rowBuffer },
      })
    }

    // Update config with refreshed token and last_synced_at
    await supabase
      .from("store_integrations")
      .update({
        config: { ...config, last_synced_at: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      })
      .eq("id", integration.id)

    return NextResponse.json({ synced })
  } catch (err) {
    console.error("Google Sheets sync error:", err)

    // Auto-disconnect on auth errors
    const errObj = err as Record<string, unknown>
    const status = errObj?.status || (errObj?.response as Record<string, unknown>)?.status
    const message = String(errObj?.message || "")
    if (status === 401 || status === 403 || message.includes("invalid_grant") || message.includes("Token has been expired or revoked")) {
      await revokeIntegration(storeId)
      return NextResponse.json(
        { error: "Google Sheets credentials expired. Please reconnect your Google account." },
        { status: 401 },
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

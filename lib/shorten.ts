import { createAdminClient } from "@/lib/supabase/admin"

function generateCode(length = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let code = ""
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function shortenUrl(
  originalUrl: string,
  storeId: string,
  baseUrl: string
): Promise<string> {
  const supabase = createAdminClient()

  // Check if this URL was already shortened for this store
  const { data: existing } = await supabase
    .from("short_links")
    .select("code")
    .eq("store_id", storeId)
    .eq("original_url", originalUrl)
    .single()

  if (existing) {
    return `${baseUrl}/r/${existing.code}`
  }

  // Generate a unique code with retry
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode()
    const { error } = await supabase
      .from("short_links")
      .insert({ store_id: storeId, code, original_url: originalUrl })

    if (!error) {
      return `${baseUrl}/r/${code}`
    }

    // If duplicate code, retry; otherwise throw
    if (!error.message.includes("duplicate") && !error.message.includes("unique")) {
      throw new Error(`Failed to create short link: ${error.message}`)
    }
  }

  // Fallback: return original URL if shortening fails
  return originalUrl
}

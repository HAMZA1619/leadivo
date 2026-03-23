"use server"

import { revalidateTag } from "next/cache"
import { cacheDelPattern } from "@/lib/upstash/cache"

export async function revalidateStoreCache(tags: string[]) {
  const promises: Promise<void>[] = []
  for (const tag of tags) {
    revalidateTag(tag, "max")
    // Purge Upstash keys matching store:<slug>:*
    if (tag.startsWith("store:")) {
      promises.push(cacheDelPattern(`${tag}:*`))
    }
  }
  await Promise.all(promises)
}

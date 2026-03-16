"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { List } from "lucide-react"

interface TocItem {
  id: string
  text: string
  level: number
}

const TOC_EXCLUDE = /^(table of contents|جدول المحتويات|table des matières|sommaire)$/i

function extractHeadings(content: string): TocItem[] {
  const headings: TocItem[] = []
  const regex = /^(#{2,3})\s+(.+)/gm
  let match

  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    if (TOC_EXCLUDE.test(text.trim())) continue
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
    headings.push({ id, text, level })
  }

  return headings
}

export function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content)
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px", threshold: 0 }
    )

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 3) return null

  return (
    <nav className="mb-10 overflow-hidden rounded-xl border bg-muted/30">
      <div className="flex items-center gap-2 border-b bg-muted/50 px-5 py-3 text-sm font-semibold">
        <List className="h-4 w-4 text-primary" />
        Table of Contents
      </div>
      <ul className="space-y-0.5 p-4">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "block rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted",
                heading.level === 3 && "ms-4",
                activeId === heading.id
                  ? "font-medium text-primary bg-primary/5"
                  : "text-muted-foreground"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

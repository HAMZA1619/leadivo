"use client"

import { useState, useRef, useEffect } from "react"
import { X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

interface CustomerTagsEditorProps {
  customerId: string
  initialTags: string[]
}

const PRESET_TAGS = ["VIP", "Wholesale", "Loyal", "New"]

export function CustomerTagsEditor({ customerId, initialTags }: CustomerTagsEditorProps) {
  const { t } = useTranslation()
  const [tags, setTags] = useState<string[]>(initialTags)
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/customers/tags")
      .then((res) => res.json())
      .then((data) => {
        if (data.tags) setSuggestions(data.tags)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function saveTags(newTags: string[]) {
    try {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: newTags }),
      })
      if (!res.ok) throw new Error()
      setTags(newTags)
    } catch {
      toast.error(t("customers.detail.updateFailed"))
    }
  }

  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (!trimmed || tags.includes(trimmed)) return
    saveTags([...tags, trimmed])
    setInput("")
    setShowSuggestions(false)
  }

  function removeTag(tag: string) {
    saveTags(tags.filter((t) => t !== tag))
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag(input)
    }
  }

  const allSuggestions = Array.from(new Set([...PRESET_TAGS, ...suggestions]))
  const filtered = allSuggestions.filter(
    (s) => !tags.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  )

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
          >
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder={t("customers.detail.addTag")}
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="h-8 text-sm"
        />
        {showSuggestions && filtered.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 mt-1 max-h-32 w-full overflow-y-auto rounded-md border bg-popover p-1 shadow-md"
          >
            {filtered.slice(0, 8).map((s) => (
              <button
                key={s}
                onClick={() => addTag(s)}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
              >
                <Plus className="h-3 w-3" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

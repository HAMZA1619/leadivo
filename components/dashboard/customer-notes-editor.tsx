"use client"

import { useState, useRef, useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Check } from "lucide-react"
import { useTranslation } from "react-i18next"

interface CustomerNotesEditorProps {
  customerId: string
  initialNotes: string | null
}

export function CustomerNotesEditor({ customerId, initialNotes }: CustomerNotesEditorProps) {
  const { t } = useTranslation()
  const [notes, setNotes] = useState(initialNotes || "")
  const [saved, setSaved] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const save = useCallback(async (value: string) => {
    try {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: value }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch {
      // silent fail
    }
  }, [customerId])

  function handleChange(value: string) {
    setNotes(value)
    setSaved(false)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => save(value), 1000)
  }

  return (
    <div className="space-y-1">
      <Textarea
        placeholder={t("customers.detail.notesPlaceholder")}
        value={notes}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => { if (debounceRef.current) { clearTimeout(debounceRef.current); save(notes) } }}
        className="min-h-[80px] resize-none text-sm"
      />
      {saved && (
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Check className="h-3 w-3" />
          {t("customers.detail.notesSaved")}
        </p>
      )}
    </div>
  )
}

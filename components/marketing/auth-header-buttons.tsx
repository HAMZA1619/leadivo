"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard } from "lucide-react"
import { useTranslation } from "react-i18next"
import { createClient } from "@/lib/supabase/client"

export function AuthHeaderButtons() {
  const { t } = useTranslation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
      setChecked(true)
    })
  }, [])

  if (!checked) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-8 w-16" />
        <div className="h-8 w-20" />
      </div>
    )
  }

  if (isLoggedIn) {
    return (
      <Button asChild size="sm" className="w-full sm:w-auto">
        <Link href="/dashboard" className="gap-1.5">
          <LayoutDashboard className="h-3.5 w-3.5" />
          {t("landing.dashboard")}
        </Link>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Button asChild variant="ghost" size="sm" className="flex-1 sm:flex-none">
        <Link href="/login">{t("landing.signIn")}</Link>
      </Button>
      <Button asChild size="sm" className="flex-1 sm:flex-none">
        <Link href="/signup">{t("landing.getStarted")}</Link>
      </Button>
    </div>
  )
}

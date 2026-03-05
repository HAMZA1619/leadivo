"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Trash2, Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import "@/lib/i18n"

interface Props {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  iconColor?: string
  installed?: { id: string } | null
  storeId: string
  integrationId: string
  onBeforeUninstall?: () => Promise<void>
}

export function IntegrationPageHeader({
  title,
  description,
  icon: Icon,
  iconColor,
  installed,
  storeId,
  integrationId,
  onBeforeUninstall,
}: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [uninstalling, setUninstalling] = useState(false)

  async function handleUninstall() {
    if (!installed) return
    setUninstalling(true)
    try {
      if (onBeforeUninstall) await onBeforeUninstall()

      const res = await fetch(`/api/integrations?id=${installed.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success(t("integrations.uninstalled"))
        router.push("/dashboard/integrations")
        router.refresh()
      }
    } finally {
      setUninstalling(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/dashboard/integrations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-5 w-5" style={iconColor ? { color: iconColor } : undefined} />
            </div>
            <div>
              <h1 className="text-xl font-semibold">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>
        {installed && (
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-950 border-red-200 dark:border-red-900"
            onClick={() => setShowConfirm(true)}
            disabled={uninstalling}
          >
            {uninstalling ? (
              <Loader2 className="me-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="me-1.5 h-3.5 w-3.5" />
            )}
            {t("integrations.uninstall")}
          </Button>
        )}
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("integrations.uninstallTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("integrations.uninstallDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("integrations.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUninstall}
              className="bg-red-600 hover:bg-red-700"
              disabled={uninstalling}
            >
              {uninstalling && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
              {t("integrations.uninstall")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Loader2, Check } from "lucide-react"

interface PhoneVerificationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  phone: string
  country: string
  slug: string
  onVerified: (token: string) => void
}

export function PhoneVerificationSheet({
  open,
  onOpenChange,
  phone,
  country,
  slug,
  onVerified,
}: PhoneVerificationSheetProps) {
  const { t } = useTranslation()
  const [digits, setDigits] = useState(["", "", "", ""])
  const [status, setStatus] = useState<"idle" | "sending" | "waiting" | "verifying" | "success" | "error" | "expired" | "blocked">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [resendCount, setResendCount] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const autoSubmitRef = useRef(false)

  const maskedPhone = phone.length > 4
    ? phone.slice(0, -4).replace(/./g, "*") + phone.slice(-4)
    : phone

  const sendCode = useCallback(async () => {
    setStatus("sending")
    setErrorMsg("")
    setDigits(["", "", "", ""])
    autoSubmitRef.current = false

    try {
      const res = await fetch("/api/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, phone, country }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        if (res.status === 429) {
          setStatus("blocked")
          setErrorMsg(t("storefront.verification.tooManyAttempts"))
          return
        }
        throw new Error(data?.error || "Failed")
      }

      setStatus("waiting")
      setCountdown(60)

      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch {
      setStatus("error")
      setErrorMsg(t("storefront.verification.codeExpired"))
    }
  }, [slug, phone, country, t])

  // Start verification when sheet opens
  useEffect(() => {
    if (open) {
      setResendCount(0)
      sendCode()
    } else {
      setStatus("idle")
      setDigits(["", "", "", ""])
      setCountdown(0)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  // Auto-submit when all 4 digits are filled
  useEffect(() => {
    if (digits.every((d) => d !== "") && !autoSubmitRef.current) {
      autoSubmitRef.current = true
      verifyCode(digits.join(""))
    }
  }, [digits]) // eslint-disable-line react-hooks/exhaustive-deps

  async function verifyCode(code: string) {
    setStatus("verifying")
    setErrorMsg("")

    try {
      const res = await fetch("/api/verify-phone/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, phone, code, country }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        if (res.status === 429) {
          setStatus("blocked")
          setErrorMsg(t("storefront.verification.tooManyAttempts"))
          return
        }
        throw new Error(data?.error || "Failed")
      }

      const data = await res.json()
      if (data.verified && data.token) {
        setStatus("success")
        setTimeout(() => {
          onVerified(data.token)
          onOpenChange(false)
        }, 800)
      } else {
        setStatus("error")
        setErrorMsg(t("storefront.verification.invalidCode"))
        setDigits(["", "", "", ""])
        autoSubmitRef.current = false
        setTimeout(() => inputRefs.current[0]?.focus(), 100)
      }
    } catch {
      setStatus("error")
      setErrorMsg(t("storefront.verification.invalidCode"))
      setDigits(["", "", "", ""])
      autoSubmitRef.current = false
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
  }

  function handleDigitChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return
    const newDigits = [...digits]
    newDigits[index] = value
    setDigits(newDigits)
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4)
    if (pasted.length === 4) {
      setDigits(pasted.split(""))
      inputRefs.current[3]?.focus()
    }
  }

  async function handleResend() {
    if (resendCount >= 3) {
      setStatus("blocked")
      setErrorMsg(t("storefront.verification.tooManyAttempts"))
      return
    }
    setResendCount((c) => c + 1)
    await sendCode()
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm px-6 pb-8 pt-4">
          <h3 className="text-center text-lg font-semibold">
            {t("storefront.verification.verifyPhone")}
          </h3>

          <p className="mt-1 text-center text-sm text-muted-foreground">
            {t("storefront.verification.enterCode")}
          </p>

          <p className="mt-0.5 text-center text-xs text-muted-foreground">
            {maskedPhone}
          </p>

          {/* OTP Input */}
          <div className="mt-6 flex justify-center gap-3">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className={`h-14 w-12 rounded-lg border-2 text-center text-2xl font-bold outline-none transition-colors ${
                  status === "error"
                    ? "animate-shake border-destructive"
                    : status === "success"
                      ? "border-green-500"
                      : "border-input focus:border-primary"
                }`}
                disabled={status === "verifying" || status === "success" || status === "blocked"}
              />
            ))}
          </div>

          {/* Status messages */}
          <div className="mt-4 text-center text-sm">
            {status === "sending" && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("storefront.verification.enterCode")}
              </div>
            )}
            {status === "verifying" && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                {t("storefront.verification.verified")}
              </div>
            )}
            {(status === "error" || status === "expired" || status === "blocked") && errorMsg && (
              <p className="text-destructive">{errorMsg}</p>
            )}
          </div>

          {/* Countdown + resend */}
          {status === "waiting" && (
            <div className="mt-4 space-y-2 text-center">
              {countdown > 0 ? (
                <p className="text-xs text-muted-foreground">
                  {t("storefront.verification.expiresIn", { seconds: countdown })}
                </p>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResend()}
                  disabled={resendCount >= 3}
                >
                  {t("storefront.verification.resend")}
                </Button>
              )}
            </div>
          )}

          {/* Verify button (fallback for auto-submit) */}
          {status === "waiting" && digits.every((d) => d !== "") && (
            <Button
              className="mt-4 w-full"
              onClick={() => verifyCode(digits.join(""))}
            >
              {t("storefront.verification.verifyPhone")}
            </Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

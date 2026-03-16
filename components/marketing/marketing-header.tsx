"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { LeadivoLogo } from "@/components/icons/leadivo-logo"
import { AuthHeaderButtons } from "@/components/marketing/auth-header-buttons"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/blog", labelKey: "blog.title" },
  { href: "/docs", labelKey: "docs.title" },
  { href: "/compare", labelKey: "compare.backToAll" },
]

export function MarketingHeader() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="shrink-0">
            <LeadivoLogo className="h-8" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Auth + Mobile menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <AuthHeaderButtons />
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-72 flex-col p-0">
              <div className="flex h-14 items-center justify-between border-b px-4">
                <LeadivoLogo className="h-7" />
              </div>
              <nav className="flex-1 space-y-1 p-4">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary/5 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {t(item.labelKey)}
                  </Link>
                ))}
              </nav>
              <Separator />
              <div className="p-4">
                <AuthHeaderButtons />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

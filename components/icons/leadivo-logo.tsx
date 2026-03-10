import { LeadivoIcon } from "@/components/icons/leadivo-icon"

export function LeadivoLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className || ""}`}>
      <LeadivoIcon className="size-[22px] shrink-0" />
      <span className="whitespace-nowrap text-lg font-semibold leading-none tracking-tight">
        Leadivo
      </span>
    </div>
  )
}

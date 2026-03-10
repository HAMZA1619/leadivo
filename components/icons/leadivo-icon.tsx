import Image from "next/image"

export function LeadivoIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Leadivo"
      width={512}
      height={512}
      className={`object-contain ${className || ""}`}
    />
  )
}

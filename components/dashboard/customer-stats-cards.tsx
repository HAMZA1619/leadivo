"use client"

import { Users, UserPlus, Repeat, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import { formatPrice } from "@/lib/utils"

interface CustomerStatsProps {
  totalCustomers: number
  newThisPeriod: number
  repeatRate: number
  avgOrderValue: number
  currency?: string
}

export function CustomerStatsCards({ totalCustomers, newThisPeriod, repeatRate, avgOrderValue, currency = "USD" }: CustomerStatsProps) {
  const { t } = useTranslation()

  const stats = [
    { label: t("customers.stats.totalCustomers"), value: totalCustomers.toLocaleString(), icon: Users },
    { label: t("customers.stats.newThisMonth"), value: newThisPeriod.toLocaleString(), icon: UserPlus },
    { label: t("customers.stats.repeatRate"), value: `${repeatRate}%`, icon: Repeat },
    { label: t("customers.stats.avgOrderValue"), value: formatPrice(avgOrderValue, currency), icon: DollarSign },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="mt-2 truncate text-2xl font-bold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

"use client"

import { ArrowDown, ArrowUp, Info, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KPI } from "@/data/types"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  kpi: KPI
  onInfoClick?: (kpi: KPI) => void
}

export function KpiCard({ kpi, onInfoClick }: KpiCardProps) {
  const formatValue = (value: number | string, unit: string) => {
    if (typeof value === "number") {
      if (unit === "$") {
        return `$${value.toLocaleString()}`
      }
      if (unit === "%") {
        return `${value.toFixed(0)}%`
      }
      if (unit === "months") {
        return `${value.toFixed(0)} months`
      }
      return value.toLocaleString()
    }
    return value
  }

  // Status icon configuration
  const statusConfig = {
    green: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    yellow: {
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    red: {
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  }

  const config = statusConfig[kpi.status]
  const StatusIcon = config.icon

  // For inverse metrics (churn, burn, etc.), higher is worse, so flip the colors
  const isPositiveTrend = kpi.inverse ? kpi.trendPct < 0 : kpi.trendPct >= 0
  const trendColor = isPositiveTrend ? "text-green-600" : "text-red-600"
  const TrendIcon = kpi.trendPct >= 0 ? ArrowUp : ArrowDown

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.name}
              </CardTitle>
              {onInfoClick && (
                <button
                  onClick={() => onInfoClick(kpi)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`View definition for ${kpi.name}`}
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
          <div className={cn("rounded-full p-1.5", config.bgColor)}>
            <StatusIcon className={cn("h-4 w-4", config.color)} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold">
            {formatValue(kpi.value, kpi.unit)}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Target: {formatValue(kpi.target, kpi.unit)}
            </span>
            <div className={cn("flex items-center gap-1 font-medium", trendColor)}>
              <TrendIcon className="h-4 w-4" />
              <span>{Math.abs(kpi.trendPct).toFixed(0)}% vs PM</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

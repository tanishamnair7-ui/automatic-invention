"use client"

import { AlertCircle, AlertTriangle, Info, X } from "lucide-react"
import { Alert } from "@/data/types"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface AlertsProps {
  alerts: Alert[]
}

export function Alerts({ alerts }: AlertsProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.has(alert.id))

  if (visibleAlerts.length === 0) {
    return null
  }

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(alertId))
  }

  const severityConfig = {
    critical: {
      icon: AlertCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-600",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
    },
  }

  return (
    <div className="space-y-3">
      {visibleAlerts.map((alert) => {
        const config = severityConfig[alert.severity]
        const Icon = config.icon

        return (
          <div
            key={alert.id}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-4",
              config.bgColor,
              config.borderColor
            )}
          >
            <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconColor)} />
            <div className="flex-1 min-w-0">
              <p className={cn("font-semibold text-sm", config.textColor)}>
                {alert.title}
              </p>
              <p className={cn("text-sm mt-1", config.textColor, "opacity-90")}>
                {alert.message}
              </p>
            </div>
            <button
              onClick={() => dismissAlert(alert.id)}
              className={cn(
                "flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors",
                config.iconColor
              )}
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

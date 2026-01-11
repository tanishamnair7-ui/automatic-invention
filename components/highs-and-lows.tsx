"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface HighLowItem {
  id: string
  title: string
  message: string
  type: "win" | "concern" | "urgent" | "watch"
  action?: {
    label: string
    onClick: () => void
  }
}

interface HighsAndLowsProps {
  items: HighLowItem[]
}

export function HighsAndLows({ items }: HighsAndLowsProps) {
  const [dismissedItems, setDismissedItems] = useState<Set<string>>(new Set())

  const visibleItems = items.filter((item) => !dismissedItems.has(item.id))

  const dismissItem = (itemId: string) => {
    setDismissedItems((prev) => new Set(prev).add(itemId))
  }

  // Categorize items into quadrants
  const wins = visibleItems.filter((item) => item.type === "win")
  const concerns = visibleItems.filter((item) => item.type === "concern")
  const watches = visibleItems.filter((item) => item.type === "watch")
  const urgents = visibleItems.filter((item) => item.type === "urgent")

  const quadrants = [
    {
      title: "Wins This Week",
      items: wins,
      icon: CheckCircle2,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-900",
      position: "top-left",
    },
    {
      title: "Watch Closely",
      items: watches,
      icon: TrendingDown,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-900",
      position: "top-right",
    },
    {
      title: "Monitor",
      items: concerns,
      icon: TrendingDown,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-900",
      position: "bottom-left",
    },
    {
      title: "Immediate Attention",
      items: urgents,
      icon: AlertTriangle,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-900",
      position: "bottom-right",
    },
  ]

  if (visibleItems.length === 0) {
    return null
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">This Week's Highs & Lows</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Prioritized view: Wins (top-left) → Immediate attention (bottom-right)
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {quadrants.map((quadrant) => {
          const Icon = quadrant.icon

          return (
            <div
              key={quadrant.position}
              className={cn(
                "rounded-xl border-2 p-4",
                quadrant.borderColor,
                quadrant.bgColor
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className={cn("h-5 w-5", quadrant.iconColor)} />
                <h3 className={cn("font-semibold", quadrant.textColor)}>
                  {quadrant.title}
                </h3>
                {quadrant.items.length > 0 && (
                  <span className={cn("text-xs font-medium", quadrant.textColor)}>
                    ({quadrant.items.length})
                  </span>
                )}
              </div>

              {quadrant.items.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No items</p>
              ) : (
                <div className="space-y-3">
                  {quadrant.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 bg-white/50 rounded-lg p-3 border border-white/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className={cn("font-semibold text-sm", quadrant.textColor)}>
                          {item.title}
                        </p>
                        <p className="text-sm mt-1 text-foreground/80">
                          {item.message}
                        </p>
                        {item.action && (
                          <button
                            onClick={item.action.onClick}
                            className={cn(
                              "text-sm font-medium mt-2 underline hover:no-underline",
                              quadrant.iconColor
                            )}
                          >
                            {item.action.label}
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => dismissItem(item.id)}
                        className={cn(
                          "flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors",
                          quadrant.iconColor
                        )}
                        aria-label="Dismiss"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

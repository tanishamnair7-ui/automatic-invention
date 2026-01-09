"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TimelineEvent } from "@/data/types"
import { Calendar, TrendingUp, Megaphone, Package, Wrench, Info } from "lucide-react"

interface TimelineProps {
  events: TimelineEvent[]
  title?: string
}

export function Timeline({ events, title = "Change Log" }: TimelineProps) {
  const categoryConfig = {
    price: { icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    campaign: { icon: Megaphone, color: "text-blue-600", bg: "bg-blue-50" },
    vendor: { icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
    product: { icon: Wrench, color: "text-orange-600", bg: "bg-orange-50" },
    other: { icon: Info, color: "text-gray-600", bg: "bg-gray-50" },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => {
            const config = categoryConfig[event.category]
            const Icon = config.icon

            return (
              <div key={event.id} className="relative">
                {index !== events.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-border" />
                )}
                <div className="flex gap-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full ${config.bg} flex items-center justify-center`}
                  >
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{event.title}</h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {event.description}
                    </p>
                    {event.impact && (
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="text-xs">
                          Impact
                        </Badge>
                        <p className="text-xs text-muted-foreground flex-1">
                          {event.impact}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

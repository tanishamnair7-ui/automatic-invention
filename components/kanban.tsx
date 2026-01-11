"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Deal } from "@/data/types"
import { DollarSign, TrendingUp } from "lucide-react"

interface KanbanProps {
  deals: Deal[]
}

const stages = [
  "Prospecting",
  "Qualification",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
] as const

export function Kanban({ deals: initialDeals }: KanbanProps) {
  const [deals, setDeals] = useState(initialDeals)

  const getDealsByStage = (stage: string) => {
    return deals.filter((deal) => deal.stage === stage)
  }

  const stageColors: Record<string, string> = {
    Prospecting: "bg-gray-100 border-gray-200",
    Qualification: "bg-blue-50 border-blue-200",
    Proposal: "bg-purple-50 border-purple-200",
    Negotiation: "bg-yellow-50 border-yellow-200",
    "Closed Won": "bg-green-50 border-green-200",
    "Closed Lost": "bg-red-50 border-red-200",
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage)
          const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0)
          const weightedValue = stageDeals.reduce(
            (sum, deal) => sum + deal.value * (deal.probability / 100),
            0
          )
          const avgDealAmount = stageDeals.length > 0 ? totalValue / stageDeals.length : 0
          const avgProbability = stageDeals.length > 0
            ? stageDeals.reduce((sum, deal) => sum + deal.probability, 0) / stageDeals.length
            : 0

          return (
            <div key={stage} className="w-80 flex-shrink-0">
              <div
                className={`rounded-xl border-2 ${stageColors[stage]} p-4 h-full`}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{stage}</h3>
                    <Badge variant="outline" className="text-xs">
                      {stageDeals.length} {stageDeals.length === 1 ? "deal" : "deals"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Total Value</p>
                      <p className="font-semibold">${(totalValue / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Weighted</p>
                      <p className="font-semibold">${(weightedValue / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Deal</p>
                      <p className="font-semibold">${(avgDealAmount / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Prob</p>
                      <p className="font-semibold">{avgProbability.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {stageDeals.map((deal) => (
                    <Card key={deal.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="p-4 pb-3">
                        <CardTitle className="text-sm font-semibold">
                          {deal.partnerName}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {deal.type}
                        </p>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="h-3.5 w-3.5" />
                            <span>${deal.value.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>{deal.probability}%</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <p className="font-medium mb-1">Next Step:</p>
                          <p>{deal.nextStep}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Close Date:{" "}
                          {new Date(deal.closeDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

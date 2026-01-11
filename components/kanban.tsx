"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Deal } from "@/data/types"

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
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-muted-foreground mb-1">Total Value</p>
                      <p className="text-lg font-bold">${(totalValue / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-muted-foreground mb-1">Weighted</p>
                      <p className="text-lg font-bold">${(weightedValue / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-muted-foreground mb-1">Avg Deal</p>
                      <p className="text-lg font-bold">${(avgDealAmount / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-muted-foreground mb-1">Avg Prob</p>
                      <p className="text-lg font-bold">{avgProbability.toFixed(0)}%</p>
                    </div>
                  </div>

                  {/* Conversion rate for non-terminal stages */}
                  {stage !== "Closed Won" && stage !== "Closed Lost" && stageDeals.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="text-xs">
                        <p className="text-muted-foreground mb-2">Pipeline Health</p>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expected Value:</span>
                            <span className="font-semibold">${(weightedValue / 1000).toFixed(0)}k</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Success Rate:</span>
                            <span className="font-semibold">{avgProbability.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

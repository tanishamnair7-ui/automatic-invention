"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ForecastScenario } from "@/data/types"

interface ScenarioPlannerProps {
  scenarios: ForecastScenario[]
}

export function ScenarioPlanner({ scenarios }: ScenarioPlannerProps) {
  const [selectedScenario, setSelectedScenario] = useState<ForecastScenario>(
    scenarios.find((s) => s.name === "Base") || scenarios[0]
  )

  const [assumptions, setAssumptions] = useState(selectedScenario.assumptions)

  // Recalculate outputs based on assumptions
  const calculateOutputs = (assumptions: typeof selectedScenario.assumptions) => {
    // Simple calculation logic (in real app, this would be more sophisticated)
    const baseMRR = 142000
    const baseBurn = 285000

    // Adjust MRR based on price and churn
    const priceMultiplier = assumptions.price / 58
    const churnMultiplier = 1 - (assumptions.churn - 4.2) / 100
    const mrr = Math.round(baseMRR * priceMultiplier * churnMultiplier)

    // Adjust burn based on hiring and marketing
    const hiringCost = assumptions.hiring * 10000
    const burn = Math.round(
      baseBurn + hiringCost + (assumptions.marketingSpend - 45000)
    )

    const cashBalance = 2400000
    const runwayMonths = Number((cashBalance / burn).toFixed(1))

    return { mrr, burn, runwayMonths }
  }

  const outputs = calculateOutputs(assumptions)

  const handleAssumptionChange = (key: keyof typeof assumptions, value: number) => {
    setAssumptions((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario Planner</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedScenario.name}
          onValueChange={(value) => {
            const scenario = scenarios.find((s) => s.name === value)
            if (scenario) {
              setSelectedScenario(scenario)
              setAssumptions(scenario.assumptions)
            }
          }}
        >
          <TabsList className="mb-6">
            {scenarios.map((scenario) => (
              <TabsTrigger key={scenario.id} value={scenario.name}>
                {scenario.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {scenarios.map((scenario) => (
            <TabsContent key={scenario.id} value={scenario.name}>
              <div className="space-y-6">
                {/* Assumptions */}
                <div>
                  <h3 className="text-sm font-semibold mb-4">Assumptions</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground flex justify-between mb-2">
                        <span>New Hires (next month)</span>
                        <span className="font-medium text-foreground">
                          {assumptions.hiring}
                        </span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={assumptions.hiring}
                        onChange={(e) =>
                          handleAssumptionChange("hiring", Number(e.target.value))
                        }
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground flex justify-between mb-2">
                        <span>Marketing Spend</span>
                        <span className="font-medium text-foreground">
                          ${assumptions.marketingSpend.toLocaleString()}
                        </span>
                      </label>
                      <input
                        type="range"
                        min="20000"
                        max="100000"
                        step="5000"
                        value={assumptions.marketingSpend}
                        onChange={(e) =>
                          handleAssumptionChange("marketingSpend", Number(e.target.value))
                        }
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground flex justify-between mb-2">
                        <span>Churn Rate (%)</span>
                        <span className="font-medium text-foreground">
                          {assumptions.churn.toFixed(1)}%
                        </span>
                      </label>
                      <input
                        type="range"
                        min="2"
                        max="8"
                        step="0.1"
                        value={assumptions.churn}
                        onChange={(e) =>
                          handleAssumptionChange("churn", Number(e.target.value))
                        }
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Outputs */}
                <div>
                  <h3 className="text-sm font-semibold mb-4">Projected Outputs</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Monthly Burn
                      </p>
                      <p className="text-2xl font-bold">
                        ${outputs.burn.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-muted rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">Runway</p>
                      <p className="text-2xl font-bold">
                        {outputs.runwayMonths} mo
                      </p>
                    </div>
                    <div className="bg-muted rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">MRR</p>
                      <p className="text-2xl font-bold">
                        ${outputs.mrr.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Impact Analysis */}
                <div className="bg-accent-2/20 rounded-xl p-4 border border-accent/20">
                  <h3 className="text-sm font-semibold mb-2">Impact Analysis</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {outputs.runwayMonths < 9 && (
                      <p className="text-red-600 font-medium">
                        ⚠️ Runway below 9 months - critical risk level
                      </p>
                    )}
                    {outputs.runwayMonths >= 9 && outputs.runwayMonths < 12 && (
                      <p className="text-yellow-600 font-medium">
                        ⚠️ Runway below target - moderate risk
                      </p>
                    )}
                    {outputs.runwayMonths >= 12 && (
                      <p className="text-green-600 font-medium">
                        ✓ Runway meets target - healthy position
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

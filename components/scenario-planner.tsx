"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ForecastScenario } from "@/data/types"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react"

interface ScenarioPlannerProps {
  scenarios: ForecastScenario[]
}

export function ScenarioPlanner({ scenarios }: ScenarioPlannerProps) {
  const baseScenario = scenarios.find((s) => s.name === "Base")!
  const [selectedScenario, setSelectedScenario] = useState<ForecastScenario>(baseScenario)

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
  const baseOutputs = baseScenario.outputs

  // Calculate deltas vs base case
  const burnDelta = outputs.burn - baseOutputs.burn
  const runwayDelta = outputs.runwayMonths - baseOutputs.runwayMonths
  const mrrDelta = outputs.mrr - baseOutputs.mrr

  const formatDelta = (value: number, prefix = "$", suffix = "") => {
    const sign = value > 0 ? "+" : ""
    return `${sign}${prefix}${value.toLocaleString()}${suffix}`
  }

  const handleAssumptionChange = (key: keyof typeof assumptions, value: number) => {
    setAssumptions((prev) => ({ ...prev, [key]: value }))
  }

  // Generate insights based on scenario
  const getScenarioInsights = () => {
    const insights = []

    if (selectedScenario.name === "Bear") {
      insights.push("Conservative scenario: Minimal hiring, reduced marketing spend")
      insights.push("Extends runway to 11.2 months by cutting costs")
      insights.push("Risk: Lower MRR growth may miss revenue targets")
    } else if (selectedScenario.name === "Bull") {
      insights.push("Aggressive scenario: Accelerated hiring, increased marketing")
      insights.push("Prioritizes growth over runway (6.9 months)")
      insights.push("Risk: Requires fundraising or revenue acceleration within 6 months")
    } else {
      insights.push("Current trajectory: Moderate hiring, steady marketing")
      insights.push("Runway at 8.4 months - below 9-month minimum threshold")
      insights.push("Action needed: Either reduce burn or accelerate revenue")
    }

    return insights
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario Planning: Compare Financial Tradeoffs</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Model how hiring, marketing spend, and churn affect runway and growth.
          Adjust sliders to see real-time impact vs. base case.
        </p>
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
                {scenario.name === "Base" && (
                  <Badge variant="outline" className="ml-2 text-xs">Current</Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {scenarios.map((scenario) => (
            <TabsContent key={scenario.id} value={scenario.name}>
              <div className="space-y-6">
                {/* Scenario Description */}
                <div className="bg-accent-2/20 rounded-xl p-4 border border-accent/20">
                  <h3 className="text-sm font-semibold mb-2">Scenario Overview</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {getScenarioInsights().map((insight, i) => (
                      <li key={i}>• {insight}</li>
                    ))}
                  </ul>
                </div>
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

                {/* Outputs - Comparison with Base */}
                <div>
                  <h3 className="text-sm font-semibold mb-4">
                    Financial Impact vs. Base Case
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Monthly Burn */}
                    <div className="bg-muted rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Monthly Burn
                      </p>
                      <p className="text-2xl font-bold mb-1">
                        ${outputs.burn.toLocaleString()}
                      </p>
                      {selectedScenario.name !== "Base" && (
                        <div className="flex items-center gap-1 text-sm">
                          {burnDelta < 0 ? (
                            <>
                              <TrendingDown className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">
                                {formatDelta(burnDelta, "$", "")}
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingUp className="h-4 w-4 text-red-600" />
                              <span className="text-red-600 font-medium">
                                {formatDelta(burnDelta, "$", "")}
                              </span>
                            </>
                          )}
                          <span className="text-muted-foreground text-xs">vs base</span>
                        </div>
                      )}
                    </div>

                    {/* Runway */}
                    <div className="bg-muted rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">Runway</p>
                      <p className="text-2xl font-bold mb-1">
                        {outputs.runwayMonths} mo
                      </p>
                      {selectedScenario.name !== "Base" && (
                        <div className="flex items-center gap-1 text-sm">
                          {runwayDelta > 0 ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">
                                {formatDelta(runwayDelta, "", " mo")}
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-4 w-4 text-red-600" />
                              <span className="text-red-600 font-medium">
                                {formatDelta(runwayDelta, "", " mo")}
                              </span>
                            </>
                          )}
                          <span className="text-muted-foreground text-xs">vs base</span>
                        </div>
                      )}
                    </div>

                    {/* MRR */}
                    <div className="bg-muted rounded-xl p-4">
                      <p className="text-sm text-muted-foreground mb-1">MRR</p>
                      <p className="text-2xl font-bold mb-1">
                        ${outputs.mrr.toLocaleString()}
                      </p>
                      {selectedScenario.name !== "Base" && (
                        <div className="flex items-center gap-1 text-sm">
                          {mrrDelta > 0 ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">
                                {formatDelta(mrrDelta, "$", "")}
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-4 w-4 text-red-600" />
                              <span className="text-red-600 font-medium">
                                {formatDelta(mrrDelta, "$", "")}
                              </span>
                            </>
                          )}
                          <span className="text-muted-foreground text-xs">vs base</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Decision Guidance */}
                <div className="bg-accent-2/20 rounded-xl p-4 border border-accent/20">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    {outputs.runwayMonths >= 12 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    )}
                    Decision Guidance
                  </h3>
                  <div className="space-y-2 text-sm">
                    {outputs.runwayMonths < 9 && (
                      <div className="flex gap-2">
                        <span className="text-red-600 font-bold">⚠️</span>
                        <div>
                          <p className="text-red-600 font-medium">
                            Critical: Runway below 9 months
                          </p>
                          <p className="text-muted-foreground text-xs mt-1">
                            Immediate action required: Cut costs or secure funding within 60 days
                          </p>
                        </div>
                      </div>
                    )}
                    {outputs.runwayMonths >= 9 && outputs.runwayMonths < 12 && (
                      <div className="flex gap-2">
                        <span className="text-amber-600 font-bold">⚠️</span>
                        <div>
                          <p className="text-amber-600 font-medium">
                            Caution: Runway below 12-month target
                          </p>
                          <p className="text-muted-foreground text-xs mt-1">
                            Plan to improve runway or initiate fundraising conversation
                          </p>
                        </div>
                      </div>
                    )}
                    {outputs.runwayMonths >= 12 && (
                      <div className="flex gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <div>
                          <p className="text-green-600 font-medium">
                            Healthy: Runway meets 12-month target
                          </p>
                          <p className="text-muted-foreground text-xs mt-1">
                            Good position for growth investments and strategic planning
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tradeoff analysis */}
                    <div className="pt-2 mt-2 border-t border-accent/20">
                      <p className="text-xs font-medium text-foreground mb-1">Key Tradeoffs:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {selectedScenario.name === "Bear" && (
                          <>
                            <li>✓ Extends runway significantly (+2.8 mo)</li>
                            <li>✗ Slower MRR growth (-$14k/mo)</li>
                            <li>→ Best if: Need to preserve cash, fundraising delayed</li>
                          </>
                        )}
                        {selectedScenario.name === "Bull" && (
                          <>
                            <li>✓ Accelerates MRR growth (+$26k/mo)</li>
                            <li>✗ Burns runway faster (-1.5 mo)</li>
                            <li>→ Best if: Fundraising secured or revenue milestone critical</li>
                          </>
                        )}
                        {selectedScenario.name === "Base" && (
                          <>
                            <li>• Balanced approach: Moderate growth + reasonable runway</li>
                            <li>• Needs improvement: 8.4 mo runway below 9 mo minimum</li>
                            <li>→ Action: Slight burn reduction or revenue acceleration needed</li>
                          </>
                        )}
                      </ul>
                    </div>
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

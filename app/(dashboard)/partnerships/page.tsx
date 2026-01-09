"use client"

import { useState } from "react"
import { Kanban } from "@/components/kanban"
import { InsightsPanel } from "@/components/insights-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deals } from "@/data/mock"
import { Calculator, FileText, TrendingUp } from "lucide-react"

export default function PartnershipsPage() {
  const [dealValue, setDealValue] = useState(250000)
  const [probability, setProbability] = useState(70)

  const expectedValue = (dealValue * probability) / 100

  // Calculate pipeline metrics
  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const weightedPipelineValue = deals.reduce(
    (sum, deal) => sum + deal.value * (deal.probability / 100),
    0
  )
  const avgDealSize = totalPipelineValue / deals.length

  // Group deals by stage for summary
  const dealsByStage = deals.reduce(
    (acc, deal) => {
      if (!acc[deal.stage]) acc[deal.stage] = []
      acc[deal.stage].push(deal)
      return acc
    },
    {} as Record<string, typeof deals>
  )

  // Contract renewals (mock data)
  const contracts = [
    {
      id: "c1",
      partner: "Mindful Clinics",
      type: "Co-Marketing",
      value: 75000,
      startDate: "2026-01-05",
      renewalDate: "2027-01-05",
      obligations: "Joint campaign quarterly, co-branded content monthly",
    },
    {
      id: "c2",
      partner: "Previous Partner A",
      type: "Distribution",
      value: 120000,
      startDate: "2025-06-01",
      renewalDate: "2026-06-01",
      obligations: "Revenue share 15%, quarterly business reviews",
    },
  ]

  const insights = [
    "Pipeline value totals $1.1M with $537k weighted by probability",
    "WellnessCorp deal (70% prob, $250k) is critical - board intro could accelerate close",
    "FitLife Insurance opportunity ($500k) requires executive sponsorship - long sales cycle",
    "Successfully closed Mindful Clinics co-marketing deal - campaign launches Feb 1",
    "Need to increase top-of-funnel - only 1 deal in prospecting stage",
    "Contract with Previous Partner A renewing in 5 months - start renewal discussion now",
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Partnerships</h1>
        <p className="text-muted-foreground">
          Partnership pipeline, deal tracking, and contract management
        </p>
      </div>

      {/* Pipeline Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pipeline Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${(totalPipelineValue / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Across {deals.length} opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Weighted Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${(weightedPipelineValue / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Probability-adjusted value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Deal Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${(avgDealSize / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Mean across all deals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Partnership Pipeline Kanban */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Partnership Pipeline</h2>
        <Kanban deals={deals} />
      </div>

      {/* Deal Model Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Deal Model Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground flex justify-between mb-2">
                  <span>Deal Value ($)</span>
                  <span className="font-medium text-foreground">
                    ${dealValue.toLocaleString()}
                  </span>
                </label>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={dealValue}
                  onChange={(e) => setDealValue(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground flex justify-between mb-2">
                  <span>Probability (%)</span>
                  <span className="font-medium text-foreground">
                    {probability}%
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={probability}
                  onChange={(e) => setProbability(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            <div className="bg-accent-2/20 rounded-xl p-6 border border-accent/20">
              <p className="text-sm text-muted-foreground mb-2">
                Expected Value
              </p>
              <p className="text-4xl font-bold text-accent">
                ${expectedValue.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Formula: Deal Value × Probability = ${dealValue.toLocaleString()} ×{" "}
                {probability}% = ${expectedValue.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Active Contracts & Renewals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Annual Value</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Renewal Date</TableHead>
                <TableHead>Key Obligations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => {
                const monthsToRenewal = Math.ceil(
                  (new Date(contract.renewalDate).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24 * 30)
                )
                const isRenewalSoon = monthsToRenewal <= 6

                return (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">
                      {contract.partner}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{contract.type}</Badge>
                    </TableCell>
                    <TableCell>${contract.value.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(contract.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {new Date(contract.renewalDate).toLocaleDateString()}
                        </span>
                        {isRenewalSoon && (
                          <Badge variant="yellow" className="text-xs">
                            {monthsToRenewal}mo
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs">
                      {contract.obligations}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Insights */}
      <InsightsPanel insights={insights} />
    </div>
  )
}

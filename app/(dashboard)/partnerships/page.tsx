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
import { deals, partnershipContracts } from "@/data/mock"
import { Calculator, FileText, AlertTriangle } from "lucide-react"

export default function PartnershipsPage() {
  const [dealValue, setDealValue] = useState(250000)
  const [commissionRate, setCommissionRate] = useState(10)

  const commissionAmount = (dealValue * commissionRate) / 100

  // Calculate pipeline metrics
  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const weightedPipelineValue = deals.reduce(
    (sum, deal) => sum + deal.value * (deal.probability / 100),
    0
  )
  const avgDealSize = totalPipelineValue / deals.length

  // Calculate NPS metrics
  const avgPartnerNps = partnershipContracts.reduce((sum, c) => sum + c.nps, 0) / partnershipContracts.length
  const lowNpsPartners = partnershipContracts.filter(c => c.nps < 35)
  const atRiskValue = lowNpsPartners.reduce((sum, c) => sum + c.value, 0)

  const insights = [
    `Partnership pipeline: $${(totalPipelineValue / 1000000).toFixed(0)}M total value across ${deals.length} opportunities, $${(weightedPipelineValue / 1000000).toFixed(0)}M weighted by probability. Strong pipeline coverage.`,
    `Active contracts worth $${(partnershipContracts.reduce((sum, c) => sum + c.value, 0) / 1000).toFixed(0)}k with avg NPS of ${avgPartnerNps.toFixed(0)}. Critical issues: HealthTech Solutions (NPS 28) and Fitness Network Global (NPS 18) require immediate attention.`,
    `$${(atRiskValue / 1000).toFixed(0)}k in contract value at risk from low NPS partners (<35). Pattern: overdue contacts (HealthTech: 24 days, Fitness Network: 37 days). Schedule executive QBRs immediately.`,
    `Pipeline funnel: 30 prospects → 15 qualified (50% conversion) → 8 proposals (53% conversion) → 5 negotiating (63% conversion) → 3 won. Top of funnel is healthy but watch proposal→negotiation conversion.`,
    `Commission structure: At 10% rate on avg deal ($${(avgDealSize / 1000).toFixed(0)}k), expect $${(avgDealSize * 0.10 / 1000).toFixed(0)}k per closed deal. Review rates for strategic partnerships (higher value, lower margin).`,
    `Weighted pipeline value ($${(weightedPipelineValue / 1000000).toFixed(0)}M) represents realistic expected revenue based on stage probabilities. Focus on moving negotiation stage deals (avg 70% prob) to close.`,
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

      {/* Commission Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Commission Calculator
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Calculate partner commissions or referral fees based on deal value
          </p>
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
                  className="w-full h-2 bg-gradient-to-r from-accent/20 to-accent/20 rounded-full appearance-none cursor-grab active:cursor-grabbing border border-border [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:active:cursor-grabbing"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground flex justify-between mb-2">
                  <span>Commission Rate (%)</span>
                  <span className="font-medium text-foreground">
                    {commissionRate}%
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-accent/20 to-accent/20 rounded-full appearance-none cursor-grab active:cursor-grabbing border border-border [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:active:cursor-grabbing"
                />
              </div>
            </div>

            <div className="bg-accent-2/20 rounded-xl p-6 border border-accent/20">
              <p className="text-sm text-muted-foreground mb-2">
                Commission Amount
              </p>
              <p className="text-4xl font-bold text-accent">
                ${commissionAmount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Formula: Deal Value × Commission Rate = ${dealValue.toLocaleString()} × {commissionRate}% = ${commissionAmount.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground mb-1">At 5% rate</p>
                <p className="font-semibold">${(dealValue * 0.05).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground mb-1">At 10% rate</p>
                <p className="font-semibold">${(dealValue * 0.10).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground mb-1">At 15% rate</p>
                <p className="font-semibold">${(dealValue * 0.15).toLocaleString()}</p>
              </div>
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
          <p className="text-sm text-muted-foreground mt-1">
            {partnershipContracts.length} active partnerships worth ${(partnershipContracts.reduce((sum, c) => sum + c.value, 0) / 1000).toFixed(0)}k annually
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Annual Value</TableHead>
                  <TableHead>Renewal Date</TableHead>
                  <TableHead>NPS</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Key Obligations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partnershipContracts
                  .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
                  .map((contract) => {
                    const monthsToRenewal = Math.ceil(
                      (new Date(contract.renewalDate).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24 * 30)
                    )
                    const isRenewalSoon = monthsToRenewal <= 6
                    const daysSinceContact = Math.floor(
                      (new Date().getTime() - new Date(contract.lastContact).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                    const needsContact = contract.nps < 35 || daysSinceContact > 14

                    return (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">
                          {contract.partner}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{contract.type}</Badge>
                        </TableCell>
                        <TableCell>${(contract.value / 1000).toFixed(0)}k</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {new Date(contract.renewalDate).toLocaleDateString()}
                            </span>
                            {isRenewalSoon && (
                              <Badge variant="outline" className="text-xs bg-yellow-50">
                                {monthsToRenewal}mo
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                contract.nps >= 50
                                  ? "bg-green-50 text-green-700"
                                  : contract.nps >= 35
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {contract.nps}
                            </Badge>
                            {needsContact && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Contact Now
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>
                            <p className="font-medium">{contract.primaryContact}</p>
                            <p className="text-xs text-muted-foreground">
                              Last: {daysSinceContact} days ago
                            </p>
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
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <InsightsPanel insights={insights} />
    </div>
  )
}

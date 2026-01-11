"use client"

import { useState } from "react"
import { KpiCard } from "@/components/kpi-card"
import { TrendChart } from "@/components/trend-chart"
import { InsightsPanel } from "@/components/insights-panel"
import { KpiDefinitionsDrawer } from "@/components/kpi-definitions-drawer"
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
import {
  kpis,
  mrrTrendData,
  churnTrendData,
  salesDeals,
  renewalAccounts,
  salesReps,
  csms,
} from "@/data/mock"
import { KPI } from "@/data/types"
import { CheckCircle, AlertCircle, XCircle, AlertTriangle, Target } from "lucide-react"

export default function RevenuePage() {
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null)

  const revenueKpis = kpis.filter((kpi) =>
    ["MRR", "ARR", "Churn Rate", "ARPU", "CAC", "LTV"].includes(kpi.name)
  )

  // Calculate pipeline metrics
  const totalPipelineValue = salesDeals.reduce(
    (sum, deal) => sum + deal.dealValue * (deal.probability / 100),
    0
  )
  const totalDealValue = salesDeals.reduce((sum, deal) => sum + deal.dealValue, 0)
  const avgDealSize = totalDealValue / salesDeals.length

  // Calculate renewal metrics
  const totalRenewalArr = renewalAccounts.reduce((sum, acc) => sum + acc.arr, 0)
  const atRiskArr = renewalAccounts
    .filter((acc) => acc.risk === "High")
    .reduce((sum, acc) => sum + acc.arr, 0)
  const avgNps = renewalAccounts.reduce((sum, acc) => sum + acc.nps, 0) / renewalAccounts.length

  const insights = [
    `Sales pipeline shows $${(totalPipelineValue / 1000).toFixed(0)}k weighted value across ${salesDeals.length} deals (avg: $${(avgDealSize / 1000).toFixed(0)}k). Healthcare & Corporate Wellness driving largest opportunities.`,
    `Renewal pipeline at $${(totalRenewalArr / 1000).toFixed(0)}k ARR with $${(atRiskArr / 1000).toFixed(0)}k at high risk. MindfulCare Network (NPS 18) and WellLife Corp (NPS 32) require immediate executive intervention.`,
    "Sales performance mixed: Alex Chen at 77% of quota (strong), Jordan Lee at 59% (needs support). Pipeline coverage shows Alex has 71% quota in pipe vs Jordan's 35% - reallocate leads to Alex.",
    "CSM performance: Rachel Foster leading with 62 avg NPS and 0 at-risk renewals. David Kim managing 2 at-risk accounts (20% of his portfolio) - needs immediate support on MindfulCare and WellLife.",
    `Low NPS accounts (< 35) represent $${((95000 + 75000 + 165000) / 1000).toFixed(0)}k ARR renewal risk. Pattern: overdue contacts (WellLife 22 days, Corporate Health Co 14 days). Enforce weekly touch cadence for yellow/red accounts.`,
  ]

  const healthConfig = {
    green: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    yellow: { icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50" },
    red: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Revenue</h1>
        <p className="text-muted-foreground">
          Subscription metrics, sales pipeline, renewals, and team performance
        </p>
      </div>

      {/* Revenue KPIs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Revenue Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {revenueKpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} onInfoClick={setSelectedKpi} />
          ))}
        </div>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          title="MRR Growth"
          data={mrrTrendData}
          type="area"
          color="#E56B4E"
          formatValue={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <TrendChart
          title="Churn Rate Trend"
          data={churnTrendData}
          type="line"
          color="#D45A3E"
          formatValue={(value) => `${value.toFixed(0)}%`}
        />
      </div>

      {/* Split Section: Sales Pipeline & Renewals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Pipeline (First Sales)</CardTitle>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-sm text-muted-foreground">Pipeline Value</p>
                <p className="text-2xl font-bold">${(totalDealValue / 1000).toFixed(0)}k</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weighted Value</p>
                <p className="text-2xl font-bold">${(totalPipelineValue / 1000).toFixed(0)}k</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deals</p>
                <p className="text-2xl font-bold">{salesDeals.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Deal Size</p>
                <p className="text-2xl font-bold">${(avgDealSize / 1000).toFixed(0)}k</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {salesDeals
                .sort((a, b) => b.dealValue - a.dealValue)
                .map((deal) => (
                  <div
                    key={deal.id}
                    className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{deal.companyName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {deal.industry} • {deal.companySize}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ${(deal.dealValue / 1000).toFixed(0)}k
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {deal.probability}% prob
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{deal.stage}</Badge>
                        <span className="text-muted-foreground">
                          Contact: {deal.contactName}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Next:</span> {deal.nextStep}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Owner: {deal.owner} • Close: {new Date(deal.closeDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Renewal Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Renewal Pipeline</CardTitle>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-sm text-muted-foreground">Total ARR</p>
                <p className="text-2xl font-bold">${(totalRenewalArr / 1000).toFixed(0)}k</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">At Risk ARR</p>
                <p className="text-2xl font-bold text-red-600">
                  ${(atRiskArr / 1000).toFixed(0)}k
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accounts</p>
                <p className="text-2xl font-bold">{renewalAccounts.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg NPS</p>
                <p className="text-2xl font-bold">{avgNps.toFixed(0)}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {renewalAccounts
                .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
                .map((account) => {
                  const config = healthConfig[account.health]
                  const HealthIcon = config.icon
                  const daysSinceContact = Math.floor(
                    (new Date().getTime() - new Date(account.lastContact).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                  const needsContact = account.nps < 35 || daysSinceContact > 14

                  return (
                    <div
                      key={account.id}
                      className={`border rounded-lg p-4 ${config.bg} border-${account.health === "green" ? "green" : account.health === "yellow" ? "yellow" : "red"}-200`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-2">
                          <HealthIcon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                          <div>
                            <h3 className="font-semibold">{account.companyName}</h3>
                            <p className="text-sm text-muted-foreground">
                              CSM: {account.csm}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            ${(account.arr / 1000).toFixed(0)}k ARR
                          </p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${account.nps >= 50 ? "bg-green-50" : account.nps >= 35 ? "bg-yellow-50" : "bg-red-50"}`}
                          >
                            NPS {account.nps}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          <span className="font-medium">Renewal:</span>{" "}
                          {new Date(account.renewalDate).toLocaleDateString()}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-medium">Next:</span> {account.nextStep}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                          <span>
                            Last contact: {daysSinceContact} days ago
                          </span>
                          {needsContact && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Contact Now
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Sales Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesReps.map((rep) => {
                const quotaAttainment = (rep.closed / rep.quota) * 100
                const pipelineCoverage = (rep.pipeline / rep.quota) * 100

                return (
                  <div key={rep.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{rep.name}</h3>
                      <Badge
                        variant={quotaAttainment >= 75 ? "default" : "outline"}
                        className={quotaAttainment >= 75 ? "bg-green-600" : ""}
                      >
                        {quotaAttainment.toFixed(0)}% to quota
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Closed</p>
                        <p className="font-semibold">${(rep.closed / 1000).toFixed(0)}k</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Pipeline</p>
                        <p className="font-semibold">${(rep.pipeline / 1000).toFixed(0)}k</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Quota</p>
                        <p className="font-semibold">${(rep.quota / 1000).toFixed(0)}k</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground">Deals Active</p>
                        <p className="font-medium">{rep.dealsInProgress}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Deal Size</p>
                        <p className="font-medium">${(rep.avgDealSize / 1000).toFixed(0)}k</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Win Rate</p>
                        <p className="font-medium">{rep.winRate}%</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Pipeline Coverage</span>
                        <span className={`font-medium ${pipelineCoverage >= 50 ? "text-green-600" : "text-red-600"}`}>
                          {pipelineCoverage.toFixed(0)}% of quota
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* CSM Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Customer Success Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {csms.map((csm) => {
                const arrPerAccount = csm.totalArr / csm.accountsManaged
                const atRiskPct = (csm.renewalsAtRisk / csm.accountsManaged) * 100

                return (
                  <div key={csm.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{csm.name}</h3>
                      <Badge
                        variant={csm.avgNps >= 50 ? "default" : "outline"}
                        className={csm.avgNps >= 50 ? "bg-green-600" : ""}
                      >
                        NPS {csm.avgNps}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Accounts</p>
                        <p className="font-semibold">{csm.accountsManaged}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total ARR</p>
                        <p className="font-semibold">${(csm.totalArr / 1000).toFixed(0)}k</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">ARR/Account</p>
                        <p className="font-semibold">${(arrPerAccount / 1000).toFixed(0)}k</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground">At Risk</p>
                        <p className={`font-medium ${csm.renewalsAtRisk > 0 ? "text-red-600" : "text-green-600"}`}>
                          {csm.renewalsAtRisk} ({atRiskPct.toFixed(0)}%)
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expansion Opps</p>
                        <p className="font-medium text-green-600">{csm.expansionOpportunities}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Response Time</p>
                        <p className="font-medium">{csm.avgResponseTime.toFixed(0)}h</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <InsightsPanel insights={insights} />

      {/* KPI Definitions Drawer */}
      <KpiDefinitionsDrawer
        kpi={selectedKpi}
        open={!!selectedKpi}
        onOpenChange={(open) => !open && setSelectedKpi(null)}
      />
    </div>
  )
}

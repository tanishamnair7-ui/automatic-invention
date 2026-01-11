"use client"

import { useState } from "react"
import { KpiCard } from "@/components/kpi-card"
import { TrendChart } from "@/components/trend-chart"
import { HighsAndLows } from "@/components/highs-and-lows"
import { InsightsPanel } from "@/components/insights-panel"
import { KpiDefinitionsDrawer } from "@/components/kpi-definitions-drawer"
import { CashForecastModal } from "@/components/cash-forecast-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  kpis,
  initiatives,
  risks,
  deals,
  cashTrendData,
} from "@/data/mock"
import { KPI } from "@/data/types"
import { Target, DollarSign, AlertTriangle } from "lucide-react"

export default function OverviewPage() {
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null)
  const [showCashForecast, setShowCashForecast] = useState(false)

  // Get the most critical KPIs for the overview
  const overviewKpis = kpis.filter((kpi) =>
    [
      "Cash Balance",
      "Runway",
      "Monthly Burn Rate",
      "MRR",
      "Churn Rate",
      "Response Time",
    ].includes(kpi.name)
  )

  // Calculate priority metrics
  const inProgressInitiatives = initiatives.filter((init) => init.status === "In Progress")
  const avgImpactScore = inProgressInitiatives.length > 0
    ? inProgressInitiatives.reduce((sum, init) => sum + init.impactScore, 0) / inProgressInitiatives.length
    : 0

  // Calculate risk metrics
  const highRisks = risks.filter((risk) => risk.impact === "High" && risk.status !== "Mitigated")
  const criticalRisks = risks.filter((risk) =>
    risk.impact === "High" && risk.likelihood === "High" && risk.status !== "Mitigated"
  )

  // Calculate pipeline metrics
  const activeDeals = deals.filter((deal) => deal.stage !== "Closed Lost")
  const totalPipelineValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0)
  const weightedPipelineValue = activeDeals.reduce(
    (sum, deal) => sum + deal.value * (deal.probability / 100),
    0
  )
  const topDeal = activeDeals.sort((a, b) => b.value * b.probability - a.value * a.probability)[0]

  // Create operational KPIs
  const operationalKpis: KPI[] = [
    {
      id: "op-initiatives",
      name: "Active Initiatives",
      value: inProgressInitiatives.length,
      unit: "",
      target: 5,
      trendPct: 0,
      status: inProgressInitiatives.length <= 5 ? "green" : "yellow",
      owner: "Head of Operations",
      definition: "Number of initiatives currently in progress",
      formula: "Count of initiatives with status 'In Progress'",
      source: "Operations Board",
      updatedAt: "2026-01-09",
    },
    {
      id: "op-impact",
      name: "Avg Impact Score",
      value: avgImpactScore.toFixed(1),
      unit: "/10",
      target: 7,
      trendPct: 5.2,
      status: avgImpactScore >= 7 ? "green" : avgImpactScore >= 5 ? "yellow" : "red",
      owner: "Head of Operations",
      definition: "Average impact score of active initiatives",
      formula: "Sum of impact scores / Number of initiatives",
      source: "Operations Board",
      updatedAt: "2026-01-09",
    },
    {
      id: "op-risks",
      name: "High Impact Risks",
      value: highRisks.length,
      unit: "",
      target: 0,
      trendPct: 15.0,
      status: highRisks.length === 0 ? "green" : highRisks.length <= 3 ? "yellow" : "red",
      owner: "Head of Operations",
      definition: "Number of high-impact risks requiring attention",
      formula: "Count of risks with Impact = High and Status != Mitigated",
      source: "Risk Register",
      updatedAt: "2026-01-09",
    },
    {
      id: "op-critical-risks",
      name: "Critical Risks",
      value: criticalRisks.length,
      unit: "",
      target: 0,
      trendPct: 50.0,
      status: criticalRisks.length === 0 ? "green" : "red",
      owner: "Head of Operations",
      definition: "High likelihood + high impact risks",
      formula: "Count where Likelihood = High AND Impact = High",
      source: "Risk Register",
      updatedAt: "2026-01-09",
    },
    {
      id: "op-pipeline",
      name: "Total Pipeline",
      value: totalPipelineValue,
      unit: "$",
      target: 1000000,
      trendPct: 8.5,
      status: totalPipelineValue >= 1000000 ? "green" : "yellow",
      owner: "Head of Partnerships",
      definition: "Total value of active partnership opportunities",
      formula: "Sum of all active deal values",
      source: "Partnership CRM",
      updatedAt: "2026-01-09",
    },
    {
      id: "op-weighted-pipeline",
      name: "Weighted Pipeline",
      value: weightedPipelineValue,
      unit: "$",
      target: 500000,
      trendPct: 12.3,
      status: weightedPipelineValue >= 500000 ? "green" : "yellow",
      owner: "Head of Partnerships",
      definition: "Pipeline value adjusted by probability",
      formula: "Sum of (Deal Value × Probability)",
      source: "Partnership CRM",
      updatedAt: "2026-01-09",
    },
  ]

  // Create Highs & Lows items
  const churnedAccounts = 127 // Mock data: actual churned accounts
  const activeCustomers = 2450 // Mock data

  const highsAndLowsItems = [
    // WINS (Quadrant 1)
    {
      id: "win-1",
      title: "MRR Growth Strong",
      message: "MRR up 8.3% to $142k - pricing changes showing positive impact on revenue.",
      type: "win" as const,
    },
    {
      id: "win-2",
      title: "Partnership Momentum",
      message: "WellnessCorp deal at 70% probability ($250k value) - final negotiations underway.",
      type: "win" as const,
    },
    {
      id: "win-3",
      title: "CSAT Score Improving",
      message: "Customer satisfaction up to 4.6/5 despite operational challenges - team executing well.",
      type: "win" as const,
    },

    // WATCH CLOSELY (Quadrant 2)
    {
      id: "watch-1",
      title: "CAC Increasing",
      message: "Customer Acquisition Cost up 14% to $285. Review marketing efficiency and channel performance.",
      type: "watch" as const,
    },
    {
      id: "watch-2",
      title: "Response Time Degrading",
      message: "Support response time at 2.4hrs vs 2.0hr target. Ticket volume up 40% - may need additional headcount.",
      type: "watch" as const,
    },

    // MONITOR (Quadrant 3)
    {
      id: "monitor-1",
      title: "Burn Rate Above Target",
      message: "Monthly burn increased to $285k, 14% above target of $250k. Marketing overspend primary driver.",
      type: "concern" as const,
    },
    {
      id: "monitor-2",
      title: "Upcoming Renewals With No Follow-Ups",
      message: "Salesforce renewal in 66 days, Intercom in 50 days - need to initiate renegotiation discussions.",
      type: "concern" as const,
    },

    // IMMEDIATE ATTENTION (Quadrant 4)
    {
      id: "urgent-1",
      title: "Runway Below Threshold",
      message: "Cash runway at 8.4 months, below 9-month minimum. Burn reduction and cash management critical.",
      type: "urgent" as const,
      action: {
        label: "View 13-week cash forecast →",
        onClick: () => setShowCashForecast(true),
      },
    },
    {
      id: "urgent-2",
      title: "Churn Spike Detected",
      message: `${churnedAccounts} accounts churned this period (${((churnedAccounts / activeCustomers) * 100).toFixed(1)}% churn rate). Review NPS scores for churned accounts. Review renewal pipeline.`,
      type: "urgent" as const,
    },
  ]

  const insights = [
    "Runway dropped to 8.4 months - immediate burn reduction required to extend to 12+ months",
    "Churn spiked to 4.2% (40% above target) - retention program launching this week is critical",
    "MRR growth remains strong at 8.3% - pricing changes showing positive impact",
    "WellnessCorp partnership (70% prob, $250k value) in final negotiations - board intro may accelerate close",
    "Lab vendor SLA breaches creating customer friction - backup vendor evaluation underway",
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Weekly Operating Review</h1>
        <p className="text-muted-foreground">
          Overview of key metrics, priorities, and risks across all operational areas
        </p>
      </div>

      {/* Highs & Lows */}
      <HighsAndLows items={highsAndLowsItems} />

      {/* KPI Scoreboard */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overviewKpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} onInfoClick={setSelectedKpi} />
          ))}
        </div>
      </div>

      {/* Operational Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Operational Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {operationalKpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} onInfoClick={setSelectedKpi} />
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart
          title="Cash Balance Trend"
          data={cashTrendData}
          type="area"
          color="#E56B4E"
          formatValue={(value) => `$${(value / 1000).toFixed(0)}k`}
        />

        {/* Top Initiative & Risk Highlights */}
        <div className="grid grid-cols-1 gap-4">
          {/* Top Priority Card */}
          {inProgressInitiatives[0] && (
            <Card className="border-accent/40">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  <CardTitle className="text-base">Top Priority This Week</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-1">{inProgressInitiatives[0].title}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{inProgressInitiatives[0].owner}</span>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    Impact: {inProgressInitiatives[0].impactScore}/10
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Risk Card */}
          {highRisks[0] && (
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <CardTitle className="text-base">Top Risk</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-1 text-red-900">{highRisks[0].title}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-700">{highRisks[0].owner}</span>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-200">
                      {highRisks[0].likelihood}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-200">
                      {highRisks[0].impact}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Deal Card */}
          {topDeal && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-base">Top Pipeline Opportunity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-1 text-green-900">{topDeal.partnerName}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-700">
                    ${(topDeal.value / 1000).toFixed(0)}k • {topDeal.probability}% prob
                  </span>
                  <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-200">
                    {topDeal.stage}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Insights Panel */}
      <InsightsPanel insights={insights} />

      {/* KPI Definitions Drawer */}
      <KpiDefinitionsDrawer
        kpi={selectedKpi}
        open={!!selectedKpi}
        onOpenChange={(open) => !open && setSelectedKpi(null)}
      />

      {/* Cash Forecast Modal */}
      <CashForecastModal
        open={showCashForecast}
        onOpenChange={setShowCashForecast}
      />
    </div>
  )
}

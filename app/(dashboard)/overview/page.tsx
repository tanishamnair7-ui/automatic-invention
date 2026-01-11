"use client"

import { useState } from "react"
import { KpiCard } from "@/components/kpi-card"
import { SwitchableChart } from "@/components/switchable-chart"
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
  mrrTrendData,
  churnTrendData,
  burnTrendData,
} from "@/data/mock"
import { KPI, TrendData } from "@/data/types"
import { Target, DollarSign, AlertTriangle } from "lucide-react"

export default function OverviewPage() {
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null)
  const [showCashForecast, setShowCashForecast] = useState(false)

  // Get the most critical KPIs for the overview
  const overviewKpis = kpis.filter((kpi) =>
    [
      "Cash Balance",
      "Runway",
      "Monthly Burn",
      "MRR",
      "Churn Rate",
      "Response Time",
    ].includes(kpi.name)
  )

  // Calculate priority metrics
  const inProgressInitiatives = initiatives.filter((init) => init.status === "In Progress")

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

  // Create operational KPIs with new metrics
  const operationalKpis: KPI[] = [
    {
      id: "op-forecast-accuracy",
      name: "Forecast Accuracy",
      value: 93,
      unit: "%",
      target: 95,
      trendPct: 3,
      status: "yellow",
      owner: "Finance Planning",
      definition: "Accuracy of financial projections vs actuals",
      formula: "100 - (|Forecasted - Actual| / Actual × 100)",
      source: "Finance System",
      updatedAt: "2026-01-09",
    },
    {
      id: "op-pipeline-coverage",
      name: "Pipeline Coverage",
      value: 2,
      unit: "x",
      target: 3,
      trendPct: 9,
      status: "yellow",
      owner: "Commercial Engine",
      definition: "Pipeline value as multiple of quarterly target",
      formula: "Total Pipeline Value / Quarterly Revenue Target",
      source: "Partnership CRM",
      updatedAt: "2026-01-09",
    },
    {
      id: "op-nps",
      name: "NPS",
      value: 42,
      unit: "",
      target: 50,
      trendPct: 5,
      status: "yellow",
      owner: "Customer Voice",
      definition: "Net Promoter Score - customer satisfaction metric",
      formula: "% Promoters (9-10) - % Detractors (0-6)",
      source: "Survey Tool",
      updatedAt: "2026-01-09",
    },
    {
      id: "op-enps",
      name: "eNPS",
      value: 38,
      unit: "",
      target: 40,
      trendPct: 3,
      status: "green",
      owner: "People Health",
      definition: "Employee Net Promoter Score - team satisfaction",
      formula: "% Promoters (9-10) - % Detractors (0-6)",
      source: "Employee Survey",
      updatedAt: "2026-01-09",
    },
    {
      id: "op-sla-resolution",
      name: "SLA Resolution Time",
      value: 2,
      unit: "hours",
      target: 2,
      trendPct: 9,
      status: "yellow",
      owner: "Service Performance",
      definition: "Average time to resolve customer support tickets",
      formula: "Sum of Resolution Times / Total Resolved Tickets",
      source: "Support System",
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
      title: "eNPS Score Healthy",
      message: "Employee satisfaction at 38 (on target) - team morale and retention strong despite growth pressure.",
      type: "win" as const,
    },

    // WATCH CLOSELY (Quadrant 2)
    {
      id: "watch-1",
      title: "NPS Below Target",
      message: "Customer NPS at 42 vs 50 target - improving but needs continued focus on product experience.",
      type: "watch" as const,
    },
    {
      id: "watch-2",
      title: "Pipeline Coverage Gap",
      message: "Pipeline at 2x quarterly target (need 3x) - accelerate partnership prospecting.",
      type: "watch" as const,
    },

    // MONITOR (Quadrant 3)
    {
      id: "monitor-1",
      title: "Forecast Accuracy Below Target",
      message: "Financial forecast accuracy at 93% vs 95% target - refine projection models.",
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
      message: "Cash runway at 8 months, below 9-month minimum. Burn reduction and cash management critical.",
      type: "urgent" as const,
      action: {
        label: "View 13-week cash forecast →",
        onClick: () => setShowCashForecast(true),
      },
    },
    {
      id: "urgent-2",
      title: "Churn Spike Detected",
      message: `${churnedAccounts} accounts churned this period (${((churnedAccounts / activeCustomers) * 100).toFixed(0)}% churn rate). Review NPS scores for churned accounts. Review renewal pipeline.`,
      type: "urgent" as const,
    },
  ]

  // Prepare metrics for switchable chart
  const runwayTrendData: TrendData[] = [
    { date: "2025-07", value: 13, label: "Jul" },
    { date: "2025-08", value: 12, label: "Aug" },
    { date: "2025-09", value: 11, label: "Sep" },
    { date: "2025-10", value: 10, label: "Oct" },
    { date: "2025-11", value: 9, label: "Nov" },
    { date: "2025-12", value: 9, label: "Dec" },
    { date: "2026-01", value: 8, label: "Jan" },
  ]

  const chartMetrics = [
    {
      id: "cash",
      name: "Cash Balance",
      data: cashTrendData,
      color: "#E56B4E",
      formatValue: (value: number) => `$${(value / 1000).toFixed(0)}k`,
    },
    {
      id: "runway",
      name: "Runway (months)",
      data: runwayTrendData,
      color: "#D45A3E",
      formatValue: (value: number) => `${value.toFixed(0)} mo`,
    },
    {
      id: "burn",
      name: "Monthly Burn",
      data: burnTrendData,
      color: "#F4C7B8",
      formatValue: (value: number) => `$${(value / 1000).toFixed(0)}k`,
    },
    {
      id: "mrr",
      name: "MRR",
      data: mrrTrendData,
      color: "#E56B4E",
      formatValue: (value: number) => `$${(value / 1000).toFixed(0)}k`,
    },
    {
      id: "churn",
      name: "Churn Rate",
      data: churnTrendData,
      color: "#D45A3E",
      formatValue: (value: number) => `${value.toFixed(0)}%`,
    },
  ]

  const insights = [
    "Immediate focus on runway extension: 8.4 months is below threshold. 13-week cash forecast shows critical weeks ahead - burn reduction plan required.",
    "Churn spike (127 accounts, 5.2%) demands urgent retention action: analyze NPS scores for churned cohort, prioritize renewal pipeline reviews, and accelerate retention program launch.",
    "Commercial engine shows mixed signals: MRR growth strong at 8.3%, but pipeline coverage at 2.3x (need 3.0x). Accelerate partnership prospecting while maintaining deal quality.",
    "Operational health improving but needs attention: eNPS healthy (38), but customer NPS at 42 vs 50 target. Service SLA at 2.4hrs trending up from 2.0hr target due to volume.",
    "Financial planning accuracy at 92.5% needs improvement: forecast accuracy below 95% target suggests model refinement needed as business scales.",
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

      {/* Operational Snapshot */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Operational Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {operationalKpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} onInfoClick={setSelectedKpi} />
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SwitchableChart metrics={chartMetrics} />

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
                    ${(topDeal.value / 1000).toFixed(0)}k • {Math.round(topDeal.probability)}% prob
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

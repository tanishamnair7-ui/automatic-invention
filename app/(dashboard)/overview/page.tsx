"use client"

import { useState } from "react"
import { KpiCard } from "@/components/kpi-card"
import { TrendChart } from "@/components/trend-chart"
import { Alerts } from "@/components/alerts"
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
  alerts,
  initiatives,
  risks,
  deals,
  cashTrendData,
} from "@/data/mock"
import { KPI } from "@/data/types"
import { Clock, AlertTriangle, TrendingUp } from "lucide-react"

export default function OverviewPage() {
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null)

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

  // Get in-progress initiatives
  const thisWeeksPriorities = initiatives
    .filter((init) => init.status === "In Progress")
    .slice(0, 5)

  // Get high-impact risks
  const risksToWatch = risks
    .filter((risk) => risk.impact === "High" && risk.status !== "Mitigated")
    .slice(0, 3)

  // Get top deals
  const topDeals = deals
    .filter((deal) => deal.stage !== "Closed Lost")
    .sort((a, b) => b.value * b.probability - a.value * a.probability)
    .slice(0, 5)

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

      {/* Alerts */}
      <Alerts alerts={alerts} />

      {/* KPI Scoreboard */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overviewKpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} onInfoClick={setSelectedKpi} />
          ))}
        </div>
      </div>

      {/* Charts and Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash & Runway Trend */}
        <TrendChart
          title="Cash Balance Trend"
          data={cashTrendData}
          type="area"
          color="#E56B4E"
          formatValue={(value) => `$${(value / 1000).toFixed(0)}k`}
        />

        {/* This Week's Priorities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              This Week's Priorities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {thisWeeksPriorities.map((initiative) => (
                <div
                  key={initiative.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{initiative.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {initiative.owner} • {initiative.team}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs whitespace-nowrap"
                    >
                      Impact: {initiative.impactScore}/10
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risks and Pipeline Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risks to Watch */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Risks to Watch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {risksToWatch.map((risk) => (
                <div
                  key={risk.id}
                  className="p-3 rounded-lg border border-red-200 bg-red-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-sm">{risk.title}</p>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        {risk.likelihood}
                      </Badge>
                      <Badge variant="red" className="text-xs">
                        {risk.impact}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Owner: {risk.owner} • Next Review:{" "}
                    {new Date(risk.nextReviewDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Snapshot */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Pipeline Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Prob</TableHead>
                  <TableHead>Stage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topDeals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium text-sm">
                      {deal.partnerName}
                    </TableCell>
                    <TableCell className="text-sm">
                      ${(deal.value / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell className="text-sm">{deal.probability}%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {deal.stage}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Insights Panel */}
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

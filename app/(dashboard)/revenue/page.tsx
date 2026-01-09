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
import { kpis, pricingExperiments, mrrTrendData, churnTrendData } from "@/data/mock"
import { KPI } from "@/data/types"
import { TrendingUp, DollarSign } from "lucide-react"

export default function RevenuePage() {
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null)

  const revenueKpis = kpis.filter((kpi) =>
    ["MRR", "ARR", "Churn Rate", "ARPU", "CAC", "LTV"].includes(kpi.name)
  )

  const insights = [
    "MRR growth of 8.3% is strong - on track to hit $150k target by end of Q1",
    "Churn spike to 4.2% is concerning - retention program is top priority",
    "CAC increased 14% to $285 - need to optimize marketing spend efficiency",
    "LTV:CAC ratio is 5.0 (healthy) but trending down due to churn and CAC increases",
    "Annual plan discount experiment successful - rolling out to all users will improve cash flow",
    "Freemium tier showing early promise - 9% conversion vs 12% target",
  ]

  // Calculate unit economics
  const cacKpi = kpis.find((k) => k.name === "CAC")!
  const ltvKpi = kpis.find((k) => k.name === "LTV")!
  const arpuKpi = kpis.find((k) => k.name === "ARPU")!
  const churnKpi = kpis.find((k) => k.name === "Churn Rate")!

  const ltv = Number(ltvKpi.value)
  const cac = Number(cacKpi.value)
  const ltvCacRatio = (ltv / cac).toFixed(1)
  const paybackMonths = ((cac / Number(arpuKpi.value)).toFixed(1))

  const experimentStatusColors = {
    planning: "bg-blue-50 text-blue-700 border-blue-200",
    running: "bg-yellow-50 text-yellow-700 border-yellow-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-gray-50 text-gray-700 border-gray-200",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Revenue</h1>
        <p className="text-muted-foreground">
          Subscription metrics, pricing experiments, and unit economics
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
          formatValue={(value) => `${value.toFixed(1)}%`}
        />
      </div>

      {/* Unit Economics Panel */}
      <Card className="bg-gradient-to-br from-accent-2/20 to-accent/10 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent" />
            Unit Economics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Customer Acquisition Cost (CAC)
              </p>
              <p className="text-3xl font-bold mb-2">${cac}</p>
              <p className="text-xs text-muted-foreground">
                Total Marketing & Sales Spend ÷ New Customers
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Lifetime Value (LTV)
              </p>
              <p className="text-3xl font-bold mb-2">${ltv.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                ARPU ÷ Churn Rate
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                LTV:CAC Ratio
              </p>
              <p className="text-3xl font-bold mb-2">{ltvCacRatio}x</p>
              <p className="text-xs text-muted-foreground">
                Target: 3x+ (Healthy: 3-5x)
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-accent/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Payback Period
                </p>
                <p className="text-xl font-semibold">{paybackMonths} months</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Time to recover acquisition cost
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Monthly ARPU
                </p>
                <p className="text-xl font-semibold">${Number(arpuKpi.value)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  MRR ÷ Active Customers
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Packaging Experiments */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing & Packaging Experiments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pricingExperiments.map((experiment) => (
              <div
                key={experiment.id}
                className="border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{experiment.name}</h3>
                      <Badge
                        variant="outline"
                        className={experimentStatusColors[experiment.status]}
                      >
                        {experiment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">Hypothesis:</span>{" "}
                      {experiment.hypothesis}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Start:{" "}
                    {new Date(experiment.startDate).toLocaleDateString()}
                  </span>
                  {experiment.endDate && (
                    <span>
                      End:{" "}
                      {new Date(experiment.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {experiment.result && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Result:</span>{" "}
                      {experiment.result}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Retention Cohort (Mock Chart) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Retention Cohort Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cohort</TableHead>
                <TableHead className="text-right">Month 0</TableHead>
                <TableHead className="text-right">Month 1</TableHead>
                <TableHead className="text-right">Month 2</TableHead>
                <TableHead className="text-right">Month 3</TableHead>
                <TableHead className="text-right">Month 6</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Oct 2025</TableCell>
                <TableCell className="text-right">100%</TableCell>
                <TableCell className="text-right">94%</TableCell>
                <TableCell className="text-right">89%</TableCell>
                <TableCell className="text-right">85%</TableCell>
                <TableCell className="text-right">-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Nov 2025</TableCell>
                <TableCell className="text-right">100%</TableCell>
                <TableCell className="text-right">92%</TableCell>
                <TableCell className="text-right">87%</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dec 2025</TableCell>
                <TableCell className="text-right">100%</TableCell>
                <TableCell className="text-right">91%</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jan 2026</TableCell>
                <TableCell className="text-right">100%</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground mt-4">
            Note: Retention trending down in recent cohorts - validates need for
            retention program
          </p>
        </CardContent>
      </Card>

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

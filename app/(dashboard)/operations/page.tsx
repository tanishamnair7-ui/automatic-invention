"use client"

import { useState } from "react"
import { KpiCard } from "@/components/kpi-card"
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
import { kpis, bottlenecks, initiatives } from "@/data/mock"
import { KPI } from "@/data/types"
import { AlertTriangle, Target, Zap, CheckCircle2 } from "lucide-react"

export default function OperationsPage() {
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null)

  // Operational KPIs matching Overview operational metrics
  const operationalKpis: KPI[] = [
    {
      id: "op-forecast-accuracy",
      name: "Forecast Accuracy",
      value: 92.5,
      unit: "%",
      target: 95,
      trendPct: 3.2,
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
      value: 2.3,
      unit: "x",
      target: 3.0,
      trendPct: 8.5,
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
      trendPct: 5.0,
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
      trendPct: 2.7,
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
      value: 2.4,
      unit: "hours",
      target: 2.0,
      trendPct: 8.5,
      status: "yellow",
      owner: "Service Performance",
      definition: "Average time to resolve customer support tickets",
      formula: "Sum of Resolution Times / Total Resolved Tickets",
      source: "Support System",
      updatedAt: "2026-01-09",
      inverse: true,
    },
  ]

  const priorityColors = {
    critical: "bg-red-100 text-red-800 border-red-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-blue-100 text-blue-800 border-blue-200",
  }

  const statusColors = {
    identified: "bg-gray-100 text-gray-700",
    analyzing: "bg-blue-100 text-blue-700",
    fixing: "bg-yellow-100 text-yellow-700",
    resolved: "bg-green-100 text-green-700",
  }

  const initiativeStatusColors = {
    "Not Started": "bg-gray-100 text-gray-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "At Risk": "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
    Blocked: "bg-red-100 text-red-700",
  }

  const insights = [
    "SLA Resolution Time at 2.4hrs (target: 2.0hrs) due to 40% increase in support ticket volume - hiring plan in progress",
    "Lab processing is critical bottleneck (48hr SLA missed 15% of time) - backup vendor contract pending signature by 2026-01-14",
    "Forecast Accuracy at 92.5% vs 95% target - need tighter alignment between sales pipeline and finance projections",
    "NPS at 42 (target: 50) and eNPS at 38 (target: 40) - customer and employee satisfaction need focus",
    "Pipeline Coverage at 2.3x vs 3.0x target - commercial engine needs more top-of-funnel activity to hit quarterly goals",
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Operations</h1>
        <p className="text-muted-foreground">
          Operational excellence, bottlenecks, and cross-functional execution
        </p>
      </div>

      {/* Operations KPIs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Operations Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {operationalKpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} onInfoClick={setSelectedKpi} />
          ))}
        </div>
      </div>

      {/* Bottleneck Radar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Bottleneck Radar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bottlenecks.map((bottleneck) => (
              <div
                key={bottleneck.id}
                className="border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{bottleneck.area}</h3>
                      <Badge
                        variant="outline"
                        className={priorityColors[bottleneck.priority]}
                      >
                        {bottleneck.priority}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={statusColors[bottleneck.status]}
                      >
                        {bottleneck.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Issue:{" "}
                    </span>
                    <span>{bottleneck.issue}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Root Cause:{" "}
                    </span>
                    <span>{bottleneck.rootCause}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Fix Owner:{" "}
                    </span>
                    <span>{bottleneck.fixOwner}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-border">
                    <span className="font-medium text-muted-foreground">
                      Next Steps:{" "}
                    </span>
                    <span>{bottleneck.nextSteps}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Follow-up Date:{" "}
                    </span>
                    <span className="font-medium">
                      {new Date(bottleneck.followUpDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Pending Deliverables:{" "}
                    </span>
                    <ul className="list-disc list-inside mt-1 ml-2">
                      {bottleneck.pendingDeliverables.map((deliverable, idx) => (
                        <li key={idx} className="text-muted-foreground">
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cross-Functional Execution Board */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Cross-Functional Execution Board
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Initiative</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Dependencies</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initiatives.map((initiative) => (
                <TableRow key={initiative.id}>
                  <TableCell className="font-medium">
                    {initiative.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{initiative.team}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {initiative.owner}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={initiativeStatusColors[initiative.status]}
                    >
                      {initiative.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(initiative.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{
                            width: `${(initiative.impactScore / 10) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {initiative.impactScore}/10
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs">
                    {initiative.dependencies.length > 0
                      ? initiative.dependencies.join(", ")
                      : "None"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Support Metrics Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Support & Service Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Avg Response Time
              </p>
              <p className="text-2xl font-bold">2.4 hrs</p>
              <p className="text-xs text-yellow-600 mt-1">
                ↑ 33% from last period
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Ticket Volume
              </p>
              <p className="text-2xl font-bold">487</p>
              <p className="text-xs text-yellow-600 mt-1">
                ↑ 40% from last period
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Resolution Rate
              </p>
              <p className="text-2xl font-bold">94%</p>
              <p className="text-xs text-green-600 mt-1">
                On target
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">CSAT Score</p>
              <p className="text-2xl font-bold">4.6/5</p>
              <p className="text-xs text-green-600 mt-1">
                ↑ 1.2% from last period
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Recommendation
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  Consider hiring 1-2 additional support team members to handle
                  40% increase in ticket volume and reduce response time back to
                  target levels.
                </p>
              </div>
            </div>
          </div>
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

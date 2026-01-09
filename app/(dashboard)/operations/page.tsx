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

  const opsKpis = kpis.filter((kpi) =>
    ["Response Time", "CSAT"].includes(kpi.name)
  )

  // Mock additional ops KPIs
  const additionalOpsKpis = [
    {
      id: "ops-refunds",
      name: "Refund Rate",
      value: 1.8,
      unit: "%",
      target: 2.0,
      trendPct: -5.2,
      status: "green" as const,
      owner: "Head of Operations",
      definition: "Percentage of transactions resulting in refunds",
      formula: "Refunds / Total Transactions",
      source: "Payment System",
      updatedAt: "2026-01-09",
    },
  ]

  const allOpsKpis = [...opsKpis, ...additionalOpsKpis]

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
    "Support response time degraded to 2.4hrs (target: 2.0hrs) due to 40% increase in ticket volume",
    "Lab processing delays affecting 15% of orders - critical bottleneck requiring immediate attention",
    "Customer onboarding time-to-value of 14 days causing early churn - self-serve improvements needed",
    "5 initiatives in progress across teams - 2 are high-impact (score 9/10) and on track",
    "CSAT remains strong at 4.6/5 despite operational challenges - team executing well",
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allOpsKpis.map((kpi) => (
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

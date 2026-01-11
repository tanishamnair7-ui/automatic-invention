"use client"

import { useState } from "react"
import { KpiCard } from "@/components/kpi-card"
import { CashForecastChart } from "@/components/cash-forecast-chart"
import { BurnBreakdownChart } from "@/components/burn-breakdown-chart"
import { InsightsPanel } from "@/components/insights-panel"
import { KpiDefinitionsDrawer } from "@/components/kpi-definitions-drawer"
import { ScenarioPlanner } from "@/components/scenario-planner"
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
  forecastScenarios,
  budgetItems,
  monthEndTasks,
  cashForecastData,
  burnBreakdownData,
} from "@/data/mock"
import { KPI } from "@/data/types"
import { CheckCircle2, Circle, Clock } from "lucide-react"

export default function FinancePage() {
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null)

  const financeKpis = kpis.filter((kpi) =>
    ["Cash Balance", "Monthly Burn", "Runway"].includes(kpi.name)
  )

  // Calculate minimum buffer (2.5 months of burn)
  const monthlyBurn = 285000
  const minimumBuffer = monthlyBurn * 2.5

  const insights = [
    "Cash forecast shows critical period in late March: balance dips to $2.18M before Q1 renewals arrive. Ensure renewal pipeline is secured.",
    "Marketing is largest burn driver at $52k/mo (18% of total), up 15.6% over budget. Engineering at $125k (44%) is largest absolute spend but within plan variance.",
    "Scenario analysis shows Bear case extends runway to 11.2 months (+2.8mo) vs Bull case at 6.9mo (-1.5mo). Current trajectory requires action: runway at 8.4mo is below 9mo minimum.",
    "Budget variance driven by Marketing overspend ($7k) offset partially by Sales underspend (-$4k) and Infrastructure savings (-$1.5k). Net: +$10.5k/mo over budget.",
    "One-off events ahead: Partnership payment ($180k) in Feb, Q1 renewals ($175k) in March will stabilize cash. Plan hiring start (Mar 30) only after renewals confirmed.",
  ]

  const taskStatusConfig = {
    completed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    "in-progress": { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    pending: { icon: Circle, color: "text-gray-400", bg: "bg-gray-50" },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Finance</h1>
        <p className="text-muted-foreground">
          Cash position, burn rate, runway, and financial planning
        </p>
      </div>

      {/* Finance KPIs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Financial Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {financeKpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} onInfoClick={setSelectedKpi} />
          ))}
        </div>
      </div>

      {/* Advanced Charts */}
      <CashForecastChart
        data={cashForecastData}
        minimumBuffer={minimumBuffer}
        monthlyBurn={monthlyBurn}
      />

      <BurnBreakdownChart data={burnBreakdownData} />

      {/* Budget vs Actuals */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actuals (Current Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Budgeted</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-right">Variance</TableHead>
                <TableHead className="text-right">Variance %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetItems.map((item) => {
                const isOverBudget = item.variance > 0
                const isSignificant = Math.abs(item.variancePct) > 10

                return (
                  <TableRow key={item.category}>
                    <TableCell className="font-medium">
                      {item.category}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.budgeted.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.actual.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          isOverBudget
                            ? "text-red-600 font-medium"
                            : "text-green-600 font-medium"
                        }
                      >
                        {isOverBudget ? "+" : ""}$
                        {Math.abs(item.variance).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          isSignificant
                            ? isOverBudget
                              ? "red"
                              : "green"
                            : "outline"
                        }
                      >
                        {isOverBudget ? "+" : ""}
                        {item.variancePct.toFixed(0)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
              <TableRow className="font-semibold bg-muted/50">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">
                  $
                  {budgetItems
                    .reduce((sum, item) => sum + item.budgeted, 0)
                    .toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  $
                  {budgetItems
                    .reduce((sum, item) => sum + item.actual, 0)
                    .toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-red-600">
                    +$
                    {budgetItems
                      .reduce((sum, item) => sum + item.variance, 0)
                      .toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="red">
                    +
                    {(
                      (budgetItems.reduce((sum, item) => sum + item.variance, 0) /
                        budgetItems.reduce((sum, item) => sum + item.budgeted, 0)) *
                      100
                    ).toFixed(0)}
                    %
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Scenario Planner */}
      <ScenarioPlanner scenarios={forecastScenarios} />

      {/* Month-End Close Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Month-End Close Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthEndTasks.map((task) => {
              const config = taskStatusConfig[task.status]
              const Icon = config.icon

              return (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${config.bg}`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.color}`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.task}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Owner: {task.owner} • Due:{" "}
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${config.color} capitalize`}
                  >
                    {task.status.replace("-", " ")}
                  </Badge>
                </div>
              )
            })}
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

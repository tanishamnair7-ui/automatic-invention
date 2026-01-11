"use client"

import { useEffect } from "react"
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
  deals,
  risks,
  report,
} from "@/data/mock"

export default function BoardPackPrintPage() {
  useEffect(() => {
    // Automatically open print dialog
    const timer = setTimeout(() => {
      window.print()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const criticalKpis = kpis.filter((kpi) =>
    [
      "Cash Balance",
      "Runway",
      "Monthly Burn",
      "MRR",
      "ARR",
      "Churn Rate",
    ].includes(kpi.name)
  )

  const baseScenario = forecastScenarios.find((s) => s.name === "Base")!

  const topDeals = deals
    .filter((deal) => deal.stage !== "Closed Lost")
    .sort((a, b) => b.value * b.probability - a.value * a.probability)
    .slice(0, 3)

  const topRisks = risks
    .filter((r) => r.impact === "High" && r.status !== "Mitigated")
    .slice(0, 3)

  return (
    <div className="max-w-5xl mx-auto p-8 print:p-0 bg-white">
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          @page {
            margin: 1in;
          }
        }
      `}</style>

      {/* Header */}
      <div className="mb-8 pb-6 border-b-2 border-accent">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-accent mb-2">Hormona</h1>
            <h2 className="text-2xl font-semibold">Board Pack</h2>
            <p className="text-muted-foreground mt-2">{report.month}</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Operations Command Center</p>
            <p>Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Executive Summary</h3>
        <p className="text-foreground leading-relaxed">{report.summary}</p>
      </div>

      {/* KPI Highlights */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Key Metrics Snapshot</h3>
        <div className="grid grid-cols-3 gap-4">
          {criticalKpis.map((kpi) => {
            const formatValue = (value: number | string, unit: string) => {
              if (typeof value === "number") {
                if (unit === "$") return `$${value.toLocaleString()}`
                if (unit === "%") return `${value.toFixed(1)}%`
                if (unit === "months") return `${value.toFixed(1)} months`
                return value.toLocaleString()
              }
              return value
            }

            return (
              <div
                key={kpi.id}
                className="bg-muted/50 rounded-xl p-4 border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{kpi.name}</p>
                  <Badge
                    variant={
                      kpi.status === "green"
                        ? "green"
                        : kpi.status === "yellow"
                        ? "yellow"
                        : "red"
                    }
                  >
                    {kpi.status}
                  </Badge>
                </div>
                <p className="text-2xl font-bold mb-1">
                  {formatValue(kpi.value, kpi.unit)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Target: {formatValue(kpi.target, kpi.unit)} •{" "}
                  {kpi.trendPct >= 0 ? "+" : ""}
                  {kpi.trendPct.toFixed(1)}%
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Financial Position */}
      <div className="mb-8 page-break-before">
        <h3 className="text-xl font-semibold mb-4">
          Financial Position & Runway
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Current Scenario</p>
            <p className="text-2xl font-bold">Base Case</p>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Cash:</span> $2.4M
              </p>
              <p>
                <span className="text-muted-foreground">Monthly Burn:</span> $
                {baseScenario.outputs.burn.toLocaleString()}
              </p>
              <p>
                <span className="text-muted-foreground">Runway:</span>{" "}
                <span className="text-red-600 font-semibold">
                  {baseScenario.outputs.runwayMonths} months
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Key Assumptions</p>
            <ul className="space-y-1 text-sm">
              <li>• New hires: {baseScenario.assumptions.hiring}/month</li>
              <li>
                • Marketing: $
                {baseScenario.assumptions.marketingSpend.toLocaleString()}/mo
              </li>
              <li>• COGS: {baseScenario.assumptions.cogsPct}% of revenue</li>
              <li>• Churn: {baseScenario.assumptions.churn}%</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-900 mb-2">
              Critical Action Required
            </p>
            <p className="text-sm text-red-800">
              Runway below 9-month minimum threshold. Immediate burn reduction
              of 20% required.
            </p>
          </div>
        </div>
      </div>

      {/* Performance Highlights */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Performance Highlights</h3>
        <ul className="space-y-2">
          {report.kpiHighlights.map((highlight, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium">
                {index + 1}
              </span>
              <p className="text-sm text-foreground flex-1">{highlight}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Pipeline */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">
          Partnership Pipeline (Top 3)
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Prob</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead>Stage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topDeals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell className="font-medium">
                  {deal.partnerName}
                </TableCell>
                <TableCell className="text-sm">{deal.type}</TableCell>
                <TableCell>${(deal.value / 1000).toFixed(0)}k</TableCell>
                <TableCell>{deal.probability}%</TableCell>
                <TableCell className="font-semibold">
                  ${((deal.value * deal.probability) / 100 / 1000).toFixed(0)}k
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{deal.stage}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Risks */}
      <div className="mb-8 page-break-before">
        <h3 className="text-xl font-semibold mb-4">Top Risks & Mitigations</h3>
        <div className="space-y-4">
          {topRisks.map((risk, index) => (
            <div
              key={risk.id}
              className="border border-red-200 bg-red-50 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <h4 className="font-semibold">{risk.title}</h4>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-red-100 text-red-700">
                    {risk.likelihood}
                  </Badge>
                  <Badge variant="outline" className="bg-red-100 text-red-700">
                    {risk.impact}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-red-900 mb-2">
                <span className="font-medium">Mitigation:</span>{" "}
                {risk.mitigation}
              </p>
              <p className="text-xs text-red-700">Owner: {risk.owner}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Asks */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-accent">
          Asks & Decisions Needed from Board
        </h3>
        <ul className="space-y-3">
          {report.asks.map((ask, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium">
                {index + 1}
              </span>
              <p className="text-foreground flex-1 font-medium">{ask}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-6 border-t print:hidden">
        <p>
          Press Ctrl+P (Cmd+P on Mac) to print or save as PDF, or close this
          window to return to the board pack.
        </p>
      </div>
    </div>
  )
}

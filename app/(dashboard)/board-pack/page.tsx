"use client"

import { Button } from "@/components/ui/button"
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
import { FileText, Printer } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BoardPackPage() {
  const router = useRouter()

  const handlePrint = () => {
    router.push("/board-pack/print")
  }

  const handleExportPDF = () => {
    // In a real app, this would generate a PDF
    alert(
      "PDF export functionality would be implemented here using a library like react-pdf or by sending to a backend PDF generation service."
    )
  }

  // Get critical KPIs
  const criticalKpis = kpis.filter((kpi) =>
    [
      "Cash Balance",
      "Runway",
      "Monthly Burn Rate",
      "MRR",
      "ARR",
      "Churn Rate",
    ].includes(kpi.name)
  )

  // Get base scenario
  const baseScenario = forecastScenarios.find((s) => s.name === "Base")!

  // Get top 3 deals
  const topDeals = deals
    .filter((deal) => deal.stage !== "Closed Lost")
    .sort((a, b) => b.value * b.probability - a.value * a.probability)
    .slice(0, 3)

  // Get top risks
  const topRisks = risks
    .filter((r) => r.impact === "High" && r.status !== "Mitigated")
    .slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Board Pack Builder</h1>
          <p className="text-muted-foreground">
            {report.month} • Compiled for Board of Directors
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Print View
          </Button>
          <Button onClick={handleExportPDF} className="gap-2">
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{report.summary}</p>
        </CardContent>
      </Card>

      {/* KPI Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </CardContent>
      </Card>

      {/* Financial Position & Runway */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Position & Runway</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Scenario</p>
              <p className="text-3xl font-bold">Base Case</p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Cash:</span>{" "}
                  $2.4M
                </p>
                <p>
                  <span className="text-muted-foreground">Monthly Burn:</span>{" "}
                  ${baseScenario.outputs.burn.toLocaleString()}
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
                  {baseScenario.assumptions.marketingSpend.toLocaleString()}
                  /mo
                </li>
                <li>
                  • COGS: {baseScenario.assumptions.cogsPct}% of revenue
                </li>
                <li>• Churn: {baseScenario.assumptions.churn}%</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-900 mb-2">
                Critical Action Required
              </p>
              <p className="text-sm text-red-800">
                Runway below 9-month minimum threshold. Immediate burn reduction
                of 20% required to extend runway to 12+ months.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Highlights</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Pipeline Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Partnership Pipeline (Top 3)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Expected Value</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Next Step</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topDeals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">
                    {deal.partnerName}
                  </TableCell>
                  <TableCell className="text-sm">{deal.type}</TableCell>
                  <TableCell>${deal.value.toLocaleString()}</TableCell>
                  <TableCell>{deal.probability}%</TableCell>
                  <TableCell className="font-semibold">
                    ${((deal.value * deal.probability) / 100).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{deal.stage}</Badge>
                  </TableCell>
                  <TableCell className="text-sm max-w-xs">
                    {deal.nextStep}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Risks & Mitigations */}
      <Card>
        <CardHeader>
          <CardTitle>Top Risks & Mitigations</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <h3 className="font-semibold">{risk.title}</h3>
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
                <p className="text-xs text-red-700">
                  Owner: {risk.owner} • Next Review:{" "}
                  {new Date(risk.nextReviewDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Asks & Decisions Needed */}
      <Card className="border-2 border-accent">
        <CardHeader>
          <CardTitle className="text-accent">
            Asks & Decisions Needed from Board
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-6 border-t">
        <p>
          Generated on {new Date().toLocaleDateString()} • Hormona Operations
          Command Center
        </p>
      </div>
    </div>
  )
}

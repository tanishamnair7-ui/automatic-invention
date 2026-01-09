"use client"

import { InsightsPanel } from "@/components/insights-panel"
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
import { risks, complianceItems, incidents } from "@/data/mock"
import { AlertTriangle, Shield, FileWarning, CheckCircle2, AlertCircle } from "lucide-react"

export default function RiskPage() {
  const likelihoodColors = {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-red-100 text-red-700",
  }

  const impactColors = {
    Low: "bg-blue-100 text-blue-700",
    Medium: "bg-orange-100 text-orange-700",
    High: "bg-red-100 text-red-700",
  }

  const statusColors = {
    Open: "bg-red-100 text-red-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Mitigated: "bg-green-100 text-green-700",
    Accepted: "bg-blue-100 text-blue-700",
  }

  const complianceStatusColors = {
    compliant: "bg-green-100 text-green-700",
    "in-progress": "bg-yellow-100 text-yellow-700",
    "non-compliant": "bg-red-100 text-red-700",
  }

  const incidentSeverityColors = {
    low: "bg-blue-100 text-blue-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
  }

  const incidentStatusColors = {
    open: "bg-red-100 text-red-700",
    investigating: "bg-yellow-100 text-yellow-700",
    resolved: "bg-green-100 text-green-700",
  }

  // Calculate risk scores (likelihood × impact)
  const scoreMap = { Low: 1, Medium: 2, High: 3 }
  const risksWithScores = risks.map((risk) => ({
    ...risk,
    score: scoreMap[risk.likelihood] * scoreMap[risk.impact],
  }))

  // Sort by score (highest first)
  const sortedRisks = [...risksWithScores].sort((a, b) => b.score - a.score)

  const insights = [
    "5 active risks identified - 2 rated as High likelihood & High impact requiring immediate action",
    "Runway risk is most critical - burn reduction plan in progress to extend to 12+ months",
    "Churn rate trending above target - retention program launching this week",
    "SOC 2 Type II audit status is non-compliant - CISO working on remediation plan",
    "2 incidents resolved in last 30 days - including critical customer data access bug",
    "1 incident under investigation - lab results delay affecting customer experience",
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Risk & Compliance</h1>
        <p className="text-muted-foreground">
          Risk register, compliance tracking, and incident management
        </p>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{risks.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Active risks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {risksWithScores.filter((r) => r.score >= 6).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Likelihood × Impact ≥ 6
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Mitigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {risks.filter((r) => r.status === "In Progress").length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Active mitigation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {incidents.filter((i) => i.status !== "resolved").length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Register */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Risk Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk</TableHead>
                <TableHead>Likelihood</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Next Review</TableHead>
                <TableHead>Mitigation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRisks.map((risk) => (
                <TableRow key={risk.id}>
                  <TableCell className="font-medium max-w-xs">
                    {risk.title}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={likelihoodColors[risk.likelihood]}
                    >
                      {risk.likelihood}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={impactColors[risk.impact]}
                    >
                      {risk.impact}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={risk.score >= 6 ? "red" : "outline"}
                      className="font-mono"
                    >
                      {risk.score}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[risk.status]}
                    >
                      {risk.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {risk.owner}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(risk.nextReviewDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs">
                    {risk.mitigation}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Compliance Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Compliance Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complianceItems.map((item) => {
              const Icon =
                item.status === "compliant"
                  ? CheckCircle2
                  : item.status === "non-compliant"
                  ? AlertCircle
                  : AlertTriangle

              return (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 border border-border rounded-xl"
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                      item.status === "compliant"
                        ? "text-green-600"
                        : item.status === "non-compliant"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Badge variant="outline" className="text-xs mb-2">
                          {item.category}
                        </Badge>
                        <p className="font-medium">{item.requirement}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={complianceStatusColors[item.status]}
                      >
                        {item.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Owner: {item.owner}</span>
                      <span>
                        Last Reviewed:{" "}
                        {new Date(item.lastReviewed).toLocaleDateString()}
                      </span>
                      <span>
                        Next Review:{" "}
                        {new Date(item.nextReview).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Incident Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-red-600" />
            Incident Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className={`border rounded-xl p-4 ${
                  incident.status !== "resolved"
                    ? "border-red-200 bg-red-50"
                    : "border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{incident.title}</h3>
                      <Badge
                        variant="outline"
                        className={incidentSeverityColors[incident.severity]}
                      >
                        {incident.severity}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={incidentStatusColors[incident.status]}
                      >
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(incident.date).toLocaleDateString()} •{" "}
                      {incident.description}
                    </p>
                  </div>
                </div>
                {incident.resolution && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Resolution:</span>{" "}
                      {incident.resolution}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <InsightsPanel insights={insights} />
    </div>
  )
}

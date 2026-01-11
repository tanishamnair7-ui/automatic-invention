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
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { vendors, vendorSpendData, procurementRequests } from "@/data/mock"
import { Package, AlertCircle, ShoppingCart } from "lucide-react"

export default function VendorsPage() {
  const totalMonthlySpend = vendors.reduce(
    (sum, vendor) => sum + vendor.spendMonthly,
    0
  )

  const riskColors = {
    Low: "bg-green-100 text-green-700 border-green-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    High: "bg-red-100 text-red-700 border-red-200",
  }

  const procurementStatusColors = {
    requested: "bg-blue-100 text-blue-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    purchased: "bg-gray-100 text-gray-700",
  }

  // Calculate days to renewal for each vendor
  const vendorsWithRenewalDays = vendors.map((vendor) => {
    const daysToRenewal = Math.ceil(
      (new Date(vendor.renewalDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )
    return { ...vendor, daysToRenewal }
  })

  // Sort by renewal date (soonest first)
  const sortedVendors = [...vendorsWithRenewalDays].sort(
    (a, b) => a.daysToRenewal - b.daysToRenewal
  )

  const insights = [
    `Total monthly vendor spend: $${totalMonthlySpend.toLocaleString()} across ${vendors.length} vendors`,
    "Clinical Labs Inc renewal in 22 days with HIGH risk - urgent discussion needed due to SLA breaches",
    "Intercom renewal in 50 days - considering alternatives to reduce costs from $3.2k/mo",
    "Salesforce renewal in 66 days - opportunity to negotiate price reduction",
    "AWS and infrastructure costs represent 32% of total vendor spend",
    "Recent Segment migration saved $800/mo in analytics costs",
  ]

  const COLORS = ["#E56B4E", "#F4C7B8", "#D45A3E", "#E7DED7", "#F6EFEA", "#1F2328", "#6B7280"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Vendors</h1>
        <p className="text-muted-foreground">
          Vendor management, spend tracking, renewals, and procurement
        </p>
      </div>

      {/* Spend Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Vendor Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${totalMonthlySpend.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Across {vendors.length} vendors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Annual Run Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${(totalMonthlySpend * 12).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Annualized vendor costs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Renewals Next 90 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {vendorsWithRenewalDays.filter((v) => v.daysToRenewal <= 90).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Vendors requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Spend Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spend Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vendorSpendData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) =>
                  `${name}: $${(value / 1000).toFixed(0)}k`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {vendorSpendData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `$${Number(value || 0).toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Vendor Directory & Renewals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Vendor Directory & Renewal Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Monthly Spend</TableHead>
                <TableHead>Renewal Date</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Issues</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedVendors.map((vendor) => {
                const isRenewalSoon = vendor.daysToRenewal <= 60
                const isRenewalUrgent = vendor.daysToRenewal <= 30

                return (
                  <TableRow
                    key={vendor.id}
                    className={isRenewalUrgent ? "bg-red-50" : ""}
                  >
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{vendor.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${vendor.spendMonthly.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {new Date(vendor.renewalDate).toLocaleDateString()}
                        </span>
                        {isRenewalUrgent && (
                          <Badge variant="red" className="text-xs">
                            {vendor.daysToRenewal}d
                          </Badge>
                        )}
                        {isRenewalSoon && !isRenewalUrgent && (
                          <Badge variant="yellow" className="text-xs">
                            {vendor.daysToRenewal}d
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {vendor.sla}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={riskColors[vendor.riskRating]}
                      >
                        {vendor.riskRating}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm max-w-xs">
                      {vendor.issues ? (
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">
                            {vendor.issues}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Procurement Workflow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Procurement Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {procurementRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border border-border rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{request.vendor}</h3>
                    <Badge
                      variant="outline"
                      className={procurementStatusColors[request.status]}
                    >
                      {request.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Amount: ${request.amount.toLocaleString()}</span>
                    <span>Requester: {request.requester}</span>
                    {request.approver && (
                      <span>Approver: {request.approver}</span>
                    )}
                    <span>
                      Requested:{" "}
                      {new Date(request.requestDate).toLocaleDateString()}
                    </span>
                  </div>
                  {request.notes && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {request.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-xl">
            <h4 className="font-medium mb-2 text-sm">Procurement Process</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                1. Request
              </span>
              <span>→</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                2. Review
              </span>
              <span>→</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                3. Approve
              </span>
              <span>→</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                4. Purchase
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <InsightsPanel insights={insights} />
    </div>
  )
}

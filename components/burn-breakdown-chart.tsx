"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export interface BurnBreakdownData {
  month: string
  engineering: number
  marketing: number
  sales: number
  customerSuccess: number
  operations: number
  infrastructure: number
}

interface BurnBreakdownChartProps {
  data: BurnBreakdownData[]
}

const CATEGORY_COLORS = {
  engineering: "#E56B4E",
  marketing: "#F4C7B8",
  sales: "#D45A3E",
  customerSuccess: "#F6EFEA",
  operations: "#E7DED7",
  infrastructure: "#FFE5DC",
}

const CATEGORY_LABELS = {
  engineering: "Engineering",
  marketing: "Marketing",
  sales: "Sales",
  customerSuccess: "Customer Success",
  operations: "Operations",
  infrastructure: "Infrastructure",
}

export function BurnBreakdownChart({ data }: BurnBreakdownChartProps) {
  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}k`

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null

    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0)

    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium mb-2">{label}</p>
        <div className="space-y-1">
          {payload
            .reverse()
            .map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs">{entry.name}:</span>
                </div>
                <span className="text-xs font-medium">
                  {formatCurrency(entry.value)}
                  <span className="text-muted-foreground ml-1">
                    ({((entry.value / total) * 100).toFixed(0)}%)
                  </span>
                </span>
              </div>
            ))}
        </div>
        <div className="pt-2 mt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Total Burn:</span>
            <span className="text-xs font-bold">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Burn Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Spend by category over time
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7DED7" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                stroke="#6B7280"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                iconType="rect"
                formatter={(value) =>
                  CATEGORY_LABELS[value as keyof typeof CATEGORY_LABELS]
                }
              />
              <Bar
                dataKey="engineering"
                stackId="burn"
                fill={CATEGORY_COLORS.engineering}
                name="engineering"
              />
              <Bar
                dataKey="marketing"
                stackId="burn"
                fill={CATEGORY_COLORS.marketing}
                name="marketing"
              />
              <Bar
                dataKey="sales"
                stackId="burn"
                fill={CATEGORY_COLORS.sales}
                name="sales"
              />
              <Bar
                dataKey="customerSuccess"
                stackId="burn"
                fill={CATEGORY_COLORS.customerSuccess}
                name="customerSuccess"
              />
              <Bar
                dataKey="operations"
                stackId="burn"
                fill={CATEGORY_COLORS.operations}
                name="operations"
              />
              <Bar
                dataKey="infrastructure"
                stackId="burn"
                fill={CATEGORY_COLORS.infrastructure}
                name="infrastructure"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendData } from "@/data/types"

interface TrendChartProps {
  title: string
  data: TrendData[]
  dataKey?: string
  type?: "line" | "area" | "bar"
  color?: string
  formatValue?: (value: number) => string
}

export function TrendChart({
  title,
  data,
  dataKey = "value",
  type = "line",
  color = "#E56B4E",
  formatValue = (value) => value.toLocaleString(),
}: TrendChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{payload[0].payload.label}</p>
          <p className="text-sm text-muted-foreground">
            {formatValue(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 5, left: 5, bottom: 5 },
    }

    switch (type) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7DED7" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              stroke="#6B7280"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6B7280"
              tickFormatter={formatValue}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${title})`}
            />
          </AreaChart>
        )

      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7DED7" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              stroke="#6B7280"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6B7280"
              tickFormatter={formatValue}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
          </BarChart>
        )

      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7DED7" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              stroke="#6B7280"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6B7280"
              tickFormatter={formatValue}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { TrendChart } from "@/components/trend-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TrendData } from "@/data/types"

interface MetricOption {
  id: string
  name: string
  data: TrendData[]
  color: string
  formatValue: (value: number) => string
}

interface SwitchableChartProps {
  metrics: MetricOption[]
}

export function SwitchableChart({ metrics }: SwitchableChartProps) {
  const [selectedMetricId, setSelectedMetricId] = useState(metrics[0]?.id || "")

  const selectedMetric = metrics.find((m) => m.id === selectedMetricId) || metrics[0]

  if (!selectedMetric) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Metric Trends</CardTitle>
          <Select value={selectedMetricId} onValueChange={setSelectedMetricId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((metric) => (
                <SelectItem key={metric.id} value={metric.id}>
                  {metric.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <TrendChart
            title=""
            data={selectedMetric.data}
            type="area"
            color={selectedMetric.color}
            formatValue={selectedMetric.formatValue}
          />
        </div>
      </CardContent>
    </Card>
  )
}

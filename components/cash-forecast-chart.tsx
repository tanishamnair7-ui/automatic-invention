"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Label,
} from "recharts"

interface CashDataPoint {
  date: string
  actual?: number
  forecast?: number
  events?: string[]
}

interface CashForecastChartProps {
  data: CashDataPoint[]
  minimumBuffer: number
  monthlyBurn: number
}

export function CashForecastChart({
  data,
  minimumBuffer,
  monthlyBurn,
}: CashForecastChartProps) {
  // Calculate runway thresholds based on monthly burn
  const runway12Months = monthlyBurn * 12
  const runway9Months = monthlyBurn * 9

  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}k`

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null

    const dataPoint = payload[0]?.payload as CashDataPoint
    const value = dataPoint.actual ?? dataPoint.forecast

    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium mb-1">{label}</p>
        <p className="text-sm text-muted-foreground">
          {dataPoint.actual !== undefined ? "Actual" : "Forecast"}:{" "}
          <span className="font-medium text-foreground">
            {formatCurrency(value || 0)}
          </span>
        </p>
        {dataPoint.events && dataPoint.events.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border">
            <p className="text-xs font-medium mb-1">Events:</p>
            {dataPoint.events.map((event, i) => (
              <p key={i} className="text-xs text-accent">
                • {event}
              </p>
            ))}
          </div>
        )}
        {value && (
          <p className="text-xs text-muted-foreground mt-1">
            Runway: {(value / monthlyBurn).toFixed(1)} months
          </p>
        )}
      </div>
    )
  }

  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.actual || 0, d.forecast || 0)),
    runway12Months
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Balance Forecast with Runway Bands</CardTitle>
        <p className="text-sm text-muted-foreground">
          Actual performance + 13-week forecast with risk zones
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7DED7" />

              {/* Risk Bands - Green Zone (>12 months) */}
              <ReferenceArea
                y1={runway12Months}
                y2={maxValue * 1.1}
                fill="#22c55e"
                fillOpacity={0.1}
                strokeOpacity={0}
              >
                <Label value="Safe (>12mo)" position="insideTopLeft" fill="#16a34a" fontSize={11} />
              </ReferenceArea>

              {/* Risk Bands - Yellow Zone (9-12 months) */}
              <ReferenceArea
                y1={runway9Months}
                y2={runway12Months}
                fill="#eab308"
                fillOpacity={0.1}
                strokeOpacity={0}
              >
                <Label value="Caution (9-12mo)" position="insideTopLeft" fill="#ca8a04" fontSize={11} />
              </ReferenceArea>

              {/* Risk Bands - Red Zone (<9 months) */}
              <ReferenceArea
                y1={0}
                y2={runway9Months}
                fill="#ef4444"
                fillOpacity={0.1}
                strokeOpacity={0}
              >
                <Label value="Critical (<9mo)" position="insideTopLeft" fill="#dc2626" fontSize={11} />
              </ReferenceArea>

              {/* Minimum Cash Buffer Line */}
              <ReferenceLine
                y={minimumBuffer}
                stroke="#E56B4E"
                strokeDasharray="5 5"
                strokeWidth={2}
              >
                <Label
                  value={`Min Buffer (${(minimumBuffer / monthlyBurn).toFixed(1)}mo)`}
                  position="insideTopRight"
                  fill="#E56B4E"
                  fontSize={11}
                  fontWeight="bold"
                />
              </ReferenceLine>

              <XAxis
                dataKey="date"
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

              {/* Actual Cash Line */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#E56B4E"
                strokeWidth={3}
                dot={(props: any) => {
                  const dataPoint = data[props.index]
                  // Only render dot if actual value exists
                  if (dataPoint.actual === undefined) return null

                  if (dataPoint.events && dataPoint.events.length > 0) {
                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={6}
                        fill="#E56B4E"
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    )
                  }
                  return <circle cx={props.cx} cy={props.cy} r={3} fill="#E56B4E" />
                }}
                connectNulls={false}
              />

              {/* Forecast Cash Line (Dashed) */}
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#D45A3E"
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={(props: any) => {
                  const dataPoint = data[props.index]
                  // Only render dot if forecast value exists
                  if (dataPoint.forecast === undefined) return null
                  return <circle cx={props.cx} cy={props.cy} r={3} fill="#D45A3E" />
                }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-[#E56B4E]" />
            <span>Actual Cash</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-[#D45A3E] border-dashed border-t-2 border-[#D45A3E]" />
            <span>Forecast</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#E56B4E] border-2 border-white" />
            <span>One-off Event</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

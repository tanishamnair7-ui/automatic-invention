"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { KPI } from "@/data/types"
import { Badge } from "@/components/ui/badge"

interface KpiDefinitionsDrawerProps {
  kpi: KPI | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KpiDefinitionsDrawer({
  kpi,
  open,
  onOpenChange,
}: KpiDefinitionsDrawerProps) {
  if (!kpi) return null

  const formatValue = (value: number | string, unit: string) => {
    if (typeof value === "number") {
      if (unit === "$") {
        return `$${value.toLocaleString()}`
      }
      if (unit === "%") {
        return `${value.toFixed(0)}%`
      }
      if (unit === "months") {
        return `${value.toFixed(0)} months`
      }
      return value.toLocaleString()
    }
    return value
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-2xl">{kpi.name}</DialogTitle>
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
          <DialogDescription>
            KPI Definition and Calculation Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Value */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Current Value
            </h3>
            <p className="text-3xl font-bold text-foreground">
              {formatValue(kpi.value, kpi.unit)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Target: {formatValue(kpi.target, kpi.unit)} | Trend: {kpi.trendPct >= 0 ? '+' : ''}{kpi.trendPct.toFixed(0)}%
            </p>
          </div>

          {/* Definition */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Definition
            </h3>
            <p className="text-sm text-foreground">{kpi.definition}</p>
          </div>

          {/* Formula */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Calculation Formula
            </h3>
            <code className="block bg-muted px-4 py-3 rounded-lg text-sm font-mono text-foreground">
              {kpi.formula}
            </code>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Owner
              </h3>
              <p className="text-sm text-foreground">{kpi.owner}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Data Source
              </h3>
              <p className="text-sm text-foreground">{kpi.source}</p>
            </div>
          </div>

          {/* Last Updated */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Last Updated
            </h3>
            <p className="text-sm text-foreground">
              {new Date(kpi.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

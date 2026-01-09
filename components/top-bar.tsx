"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Download } from "lucide-react"
import { useRouter } from "next/navigation"

export type DateRange = "7d" | "30d" | "qtd" | "ytd"

interface TopBarProps {
  title?: string
  onDateRangeChange?: (range: DateRange) => void
}

export function TopBar({ title, onDateRangeChange }: TopBarProps) {
  const [dateRange, setDateRange] = useState<DateRange>("7d")
  const router = useRouter()

  const handleDateRangeChange = (value: DateRange) => {
    setDateRange(value)
    onDateRangeChange?.(value)
  }

  const handleExportBoardPack = () => {
    router.push("/board-pack")
  }

  return (
    <div className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div>
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Date Range:</span>
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="qtd">QTD</SelectItem>
              <SelectItem value="ytd">YTD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleExportBoardPack}
          variant="default"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export Board Pack
        </Button>
      </div>
    </div>
  )
}

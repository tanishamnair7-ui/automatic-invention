"use client"

import { Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InsightsPanelProps {
  insights: string[]
  title?: string
}

export function InsightsPanel({ insights, title = "Key Insights" }: InsightsPanelProps) {
  return (
    <Card className="bg-gradient-to-br from-accent-2/20 to-accent/10 border-accent/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {insights.map((insight, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium mt-0.5">
                {index + 1}
              </span>
              <p className="text-sm text-foreground flex-1">{insight}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

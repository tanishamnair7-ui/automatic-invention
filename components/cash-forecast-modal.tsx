"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface CashForecastModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock 13-week cash forecast data
const generateCashForecast = () => {
  const weeks = []
  let runningCash = 2400000 // Starting cash
  const minimumBuffer = 500000

  for (let i = 0; i < 13; i++) {
    const weekNumber = i + 1
    const weekStart = new Date(2026, 0, 13 + i * 7) // Starting Jan 13, 2026

    // Committed outflows
    const payroll = weekNumber % 2 === 0 ? 95000 : 0 // Bi-weekly
    const rent = weekNumber === 1 ? 12000 : 0 // Monthly
    const coreTools = 8500 // Weekly avg
    const vendorRetainers = weekNumber === 1 ? 15000 : 0 // Monthly
    const taxVat = weekNumber === 4 || weekNumber === 8 || weekNumber === 12 ? 18000 : 0

    // Expected inflows
    const subscriptions = 32000 + Math.random() * 5000 // Weekly subscriptions
    const invoices = weekNumber % 2 === 0 ? 45000 : 0 // Bi-weekly
    const partnerPayments = weekNumber === 3 || weekNumber === 7 || weekNumber === 11 ? 25000 : 0

    // One-offs
    const annualRenewals = weekNumber === 2 ? -48000 : weekNumber === 5 ? -22000 : 0
    const refunds = -(Math.random() * 3000)
    const legalBills = weekNumber === 6 ? -12000 : 0

    const totalOutflows = payroll + rent + coreTools + vendorRetainers + taxVat + Math.abs(annualRenewals) + Math.abs(refunds) + Math.abs(legalBills)
    const totalInflows = subscriptions + invoices + partnerPayments
    const netChange = totalInflows - totalOutflows

    runningCash += netChange

    weeks.push({
      week: weekNumber,
      weekStart: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      openingCash: runningCash - netChange,
      outflows: {
        payroll,
        rent,
        coreTools,
        vendorRetainers,
        taxVat,
        total: payroll + rent + coreTools + vendorRetainers + taxVat,
      },
      inflows: {
        subscriptions,
        invoices,
        partnerPayments,
        total: totalInflows,
      },
      oneOffs: {
        annualRenewals,
        refunds,
        legalBills,
        total: annualRenewals + refunds + legalBills,
      },
      endingCash: runningCash,
      buffer: runningCash - minimumBuffer,
      isHealthy: runningCash > minimumBuffer,
    })
  }

  return weeks
}

export function CashForecastModal({ open, onOpenChange }: CashForecastModalProps) {
  const forecast = generateCashForecast()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">13-Week Cash Forecast</DialogTitle>
          <DialogDescription>
            Detailed weekly cash flow projection with committed outflows, expected inflows, and one-off items
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Starting Cash</p>
                <p className="text-2xl font-bold">${forecast[0].openingCash.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Ending Cash (Week 13)</p>
                <p className="text-2xl font-bold">${forecast[12].endingCash.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Minimum Buffer</p>
                <p className="text-2xl font-bold">$500,000</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Week</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Opening Cash</TableHead>
                  <TableHead className="text-right">Outflows</TableHead>
                  <TableHead className="text-right">Inflows</TableHead>
                  <TableHead className="text-right">One-Offs</TableHead>
                  <TableHead className="text-right">Ending Cash</TableHead>
                  <TableHead className="text-right">vs Buffer</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forecast.map((week) => (
                  <TableRow key={week.week} className={!week.isHealthy ? "bg-red-50" : ""}>
                    <TableCell className="font-medium">W{week.week}</TableCell>
                    <TableCell className="text-sm">{week.weekStart}</TableCell>
                    <TableCell className="text-right text-sm">
                      ${(week.openingCash / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell className="text-right text-sm text-red-600">
                      -${(week.outflows.total / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell className="text-right text-sm text-green-600">
                      +${(week.inflows.total / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {week.oneOffs.total < 0 ? '-' : '+'}${Math.abs(week.oneOffs.total / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${(week.endingCash / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      <span className={week.buffer > 0 ? "text-green-600" : "text-red-600"}>
                        {week.buffer > 0 ? '+' : ''}${(week.buffer / 1000).toFixed(0)}k
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={week.isHealthy ? "green" : "red"}>
                        {week.isHealthy ? "Healthy" : "At Risk"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold mb-2 text-red-900">Committed Outflows</h4>
              <ul className="text-sm space-y-1 text-red-800">
                <li>• Payroll (bi-weekly): ~$95k</li>
                <li>• Rent (monthly): $12k</li>
                <li>• Core tools: ~$8.5k/week</li>
                <li>• Vendor retainers: $15k/month</li>
                <li>• Tax/VAT (quarterly): $18k</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-900">Expected Inflows</h4>
              <ul className="text-sm space-y-1 text-green-800">
                <li>• Subscriptions: ~$32k/week</li>
                <li>• Invoices (bi-weekly): $45k</li>
                <li>• Partner payments: $25k/quarter</li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold mb-2 text-orange-900">One-Off Items</h4>
              <ul className="text-sm space-y-1 text-orange-800">
                <li>• Annual renewals: -$48k, -$22k</li>
                <li>• Refunds: ~$3k/week</li>
                <li>• Legal bills: -$12k (Week 6)</li>
              </ul>
            </div>
          </div>

          {forecast.some(w => !w.isHealthy) && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-sm font-semibold text-red-900">
                ⚠️ Warning: Cash falls below minimum buffer in weeks {forecast.filter(w => !w.isHealthy).map(w => w.week).join(', ')}
              </p>
              <p className="text-sm text-red-800 mt-1">
                Recommended actions: Reduce burn rate, accelerate collections, or secure bridge financing.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

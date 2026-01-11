import { z } from "zod"

// KPI Schema and Type
export const KPISchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.union([z.number(), z.string()]),
  unit: z.string(),
  target: z.union([z.number(), z.string()]),
  trendPct: z.number(),
  status: z.enum(["green", "yellow", "red"]),
  owner: z.string(),
  definition: z.string(),
  formula: z.string(),
  source: z.string(),
  updatedAt: z.string(),
  inverse: z.boolean().optional(), // True if lower values are better (e.g., churn, burn, response time)
})

export type KPI = z.infer<typeof KPISchema>

// ForecastScenario Schema and Type
export const ForecastScenarioSchema = z.object({
  id: z.string(),
  name: z.enum(["Base", "Bear", "Bull"]),
  assumptions: z.object({
    hiring: z.number(),
    marketingSpend: z.number(),
    cogsPct: z.number(),
    price: z.number(),
    churn: z.number(),
  }),
  outputs: z.object({
    burn: z.number(),
    runwayMonths: z.number(),
    mrr: z.number(),
  }),
  updatedAt: z.string(),
})

export type ForecastScenario = z.infer<typeof ForecastScenarioSchema>

// Deal/Partnership Schema and Type
export const DealSchema = z.object({
  id: z.string(),
  partnerName: z.string(),
  type: z.string(),
  stage: z.enum(["Prospecting", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]),
  value: z.number(),
  probability: z.number(),
  nextStep: z.string(),
  closeDate: z.string(),
  notes: z.string(),
})

export type Deal = z.infer<typeof DealSchema>

// Partnership Contract Schema and Type
export const PartnershipContractSchema = z.object({
  id: z.string(),
  partner: z.string(),
  type: z.string(),
  value: z.number(),
  startDate: z.string(),
  renewalDate: z.string(),
  obligations: z.string(),
  nps: z.number(),
  lastContact: z.string(),
  primaryContact: z.string(),
})

export type PartnershipContract = z.infer<typeof PartnershipContractSchema>

// Vendor Schema and Type
export const VendorSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  spendMonthly: z.number(),
  renewalDate: z.string(),
  sla: z.string(),
  riskRating: z.enum(["Low", "Medium", "High"]),
  issues: z.string().optional(),
})

export type Vendor = z.infer<typeof VendorSchema>

// Risk Schema and Type
export const RiskSchema = z.object({
  id: z.string(),
  title: z.string(),
  likelihood: z.enum(["Low", "Medium", "High"]),
  impact: z.enum(["Low", "Medium", "High"]),
  mitigation: z.string(),
  owner: z.string(),
  nextReviewDate: z.string(),
  status: z.enum(["Open", "In Progress", "Mitigated", "Accepted"]),
})

export type Risk = z.infer<typeof RiskSchema>

// Initiative Schema and Type
export const InitiativeSchema = z.object({
  id: z.string(),
  title: z.string(),
  team: z.string(),
  owner: z.string(),
  status: z.enum(["Not Started", "In Progress", "At Risk", "Completed", "Blocked"]),
  dueDate: z.string(),
  dependencies: z.array(z.string()),
  impactScore: z.number(),
})

export type Initiative = z.infer<typeof InitiativeSchema>

// Report Schema and Type
export const ReportSchema = z.object({
  id: z.string(),
  month: z.string(),
  summary: z.string(),
  kpiHighlights: z.array(z.string()),
  risks: z.array(z.string()),
  asks: z.array(z.string()),
})

export type Report = z.infer<typeof ReportSchema>

// Alert Schema and Type
export const AlertSchema = z.object({
  id: z.string(),
  title: z.string(),
  severity: z.enum(["info", "warning", "critical"]),
  message: z.string(),
  timestamp: z.string(),
})

export type Alert = z.infer<typeof AlertSchema>

// Timeline Event Schema and Type
export const TimelineEventSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(["price", "campaign", "vendor", "product", "other"]),
  impact: z.string().optional(),
})

export type TimelineEvent = z.infer<typeof TimelineEventSchema>

// Budget Item Schema and Type
export const BudgetItemSchema = z.object({
  category: z.string(),
  budgeted: z.number(),
  actual: z.number(),
  variance: z.number(),
  variancePct: z.number(),
})

export type BudgetItem = z.infer<typeof BudgetItemSchema>

// Month-End Task Schema and Type
export const MonthEndTaskSchema = z.object({
  id: z.string(),
  task: z.string(),
  owner: z.string(),
  status: z.enum(["pending", "in-progress", "completed"]),
  dueDate: z.string(),
})

export type MonthEndTask = z.infer<typeof MonthEndTaskSchema>

// Pricing Experiment Schema and Type
export const PricingExperimentSchema = z.object({
  id: z.string(),
  name: z.string(),
  hypothesis: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  result: z.string().optional(),
  status: z.enum(["planning", "running", "completed", "cancelled"]),
})

export type PricingExperiment = z.infer<typeof PricingExperimentSchema>

// Bottleneck Schema and Type
export const BottleneckSchema = z.object({
  id: z.string(),
  area: z.string(),
  issue: z.string(),
  rootCause: z.string(),
  fixOwner: z.string(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["identified", "analyzing", "fixing", "resolved"]),
})

export type Bottleneck = z.infer<typeof BottleneckSchema>

// Compliance Checklist Item Schema and Type
export const ComplianceItemSchema = z.object({
  id: z.string(),
  category: z.string(),
  requirement: z.string(),
  status: z.enum(["compliant", "in-progress", "non-compliant"]),
  lastReviewed: z.string(),
  nextReview: z.string(),
  owner: z.string(),
})

export type ComplianceItem = z.infer<typeof ComplianceItemSchema>

// Incident Schema and Type
export const IncidentSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  description: z.string(),
  resolution: z.string().optional(),
  status: z.enum(["open", "investigating", "resolved"]),
})

export type Incident = z.infer<typeof IncidentSchema>

// Procurement Request Schema and Type
export const ProcurementRequestSchema = z.object({
  id: z.string(),
  requestDate: z.string(),
  vendor: z.string(),
  amount: z.number(),
  requester: z.string(),
  approver: z.string().optional(),
  status: z.enum(["requested", "approved", "rejected", "purchased"]),
  notes: z.string().optional(),
})

export type ProcurementRequest = z.infer<typeof ProcurementRequestSchema>

// Sales Deal Schema and Type (for first sales pipeline)
export const SalesDealSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  industry: z.string(),
  dealValue: z.number(),
  stage: z.enum(["Lead", "Qualified", "Demo", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]),
  probability: z.number(),
  companySize: z.string(),
  contactName: z.string(),
  nextStep: z.string(),
  closeDate: z.string(),
  owner: z.string(),
})

export type SalesDeal = z.infer<typeof SalesDealSchema>

// Renewal Account Schema and Type
export const RenewalAccountSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  arr: z.number(),
  renewalDate: z.string(),
  health: z.enum(["green", "yellow", "red"]),
  nps: z.number(),
  lastContact: z.string(),
  nextStep: z.string(),
  risk: z.enum(["Low", "Medium", "High"]),
  csm: z.string(),
})

export type RenewalAccount = z.infer<typeof RenewalAccountSchema>

// Sales Rep Schema and Type
export const SalesRepSchema = z.object({
  id: z.string(),
  name: z.string(),
  quota: z.number(),
  closed: z.number(),
  pipeline: z.number(),
  dealsInProgress: z.number(),
  avgDealSize: z.number(),
  winRate: z.number(),
})

export type SalesRep = z.infer<typeof SalesRepSchema>

// Customer Success Manager Schema and Type
export const CSMSchema = z.object({
  id: z.string(),
  name: z.string(),
  accountsManaged: z.number(),
  totalArr: z.number(),
  avgNps: z.number(),
  renewalsAtRisk: z.number(),
  expansionOpportunities: z.number(),
  avgResponseTime: z.number(),
})

export type CSM = z.infer<typeof CSMSchema>

// Chart Data Types
export interface ChartDataPoint {
  name: string
  value: number
  date?: string
  [key: string]: string | number | undefined
}

export interface TrendData {
  date: string
  value: number
  label?: string
}

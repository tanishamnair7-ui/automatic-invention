# Hormona Operations Command Center

A production-quality MVP dashboard application for Hormona's Head of Operations to manage finance, revenue, partnerships, operations, vendors, and compliance.

![Hormona Brand](https://img.shields.io/badge/Hormona-Operations%20Dashboard-E56B4E?style=flat-square)

## Overview

This dashboard provides a comprehensive view of all operational areas for a digital health/wellness startup, enabling the Head of Operations to:

- Monitor key metrics across finance, revenue, partnerships, and operations
- Track runway and burn rate with scenario planning
- Manage vendor relationships and renewals
- Identify and mitigate risks
- Generate board-ready reports

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Validation**: Zod
- **Icons**: Lucide React

## Features

### 🎨 Design System

- Calm, warm, minimal wellness-clinical aesthetic
- Custom Hormona brand color palette
- Rounded cards (2xl), soft shadows, clean typography
- Fully responsive and accessible

### 📊 Modules

#### 1. Overview (Weekly Operating Review)
- KPI scoreboard with real-time status indicators
- Alert strip for critical issues (runway, churn, vendor renewals)
- This week's priorities and initiatives
- Risks to watch
- Cash runway snapshot
- Partnership pipeline preview

#### 2. Finance
- Cash balance, burn rate, and runway tracking
- Budget vs actuals comparison
- Interactive scenario planner (Base/Bear/Bull cases)
- Month-end close checklist
- Trend charts for cash and burn

#### 3. Revenue
- MRR/ARR tracking with growth trends
- Churn rate monitoring
- Unit economics (CAC, LTV, payback period)
- Pricing & packaging experiments tracker
- Retention cohort analysis

#### 4. Partnerships
- Partnership pipeline Kanban board
- Deal model calculator (expected value)
- Contract tracker with renewal alerts
- Pipeline metrics and insights

#### 5. Operations
- Bottleneck radar with root cause analysis
- Cross-functional execution board
- Support metrics (response time, CSAT, ticket volume)
- Initiative tracking with impact scores

#### 6. Vendors
- Vendor directory with spend breakdown
- Renewal alerts and risk ratings
- Monthly spend visualization (pie chart)
- Procurement request workflow

#### 7. Risk & Compliance
- Risk register with likelihood/impact scoring
- Compliance checklist (GDPR, privacy, security)
- Incident log and tracking
- Automated risk prioritization

#### 8. Board Pack
- Executive summary
- KPI highlights
- Financial position and runway
- Top partnership opportunities
- Critical risks and mitigations
- Asks and decisions for the board
- Printable view and PDF export stub

### 🎯 Key UX Features

- **Left Sidebar Navigation**: Easy access to all modules
- **Top Bar**: Date range selector (7d/30d/QTD/YTD) and board pack export
- **KPI Definitions Drawer**: Click any KPI to see formula, owner, target, and data source
- **Change Log Timeline**: Track major events with impact correlation
- **Insights Panels**: AI-ready summaries on every page
- **Interactive Charts**: Hover for details, responsive design
- **Status Badges**: Color-coded (green/yellow/red) for quick health checks

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd automatic-invention

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

The app will automatically redirect to `/overview`.

### Build for Production

```bash
# Create optimized production build
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
├── app/
│   ├── (dashboard)/          # Dashboard route group
│   │   ├── overview/         # Weekly operating review
│   │   ├── finance/          # Finance & runway
│   │   ├── revenue/          # Revenue & subscriptions
│   │   ├── partnerships/     # Partnership pipeline
│   │   ├── operations/       # Operations & execution
│   │   ├── vendors/          # Vendor management
│   │   ├── risk/             # Risk & compliance
│   │   └── board-pack/       # Board pack builder
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles & theme
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── kpi-card.tsx          # KPI display component
│   ├── trend-chart.tsx       # Recharts wrapper
│   ├── alerts.tsx            # Alert notifications
│   ├── insights-panel.tsx    # Insights display
│   ├── kpi-definitions-drawer.tsx  # KPI details modal
│   ├── timeline.tsx          # Change log timeline
│   ├── kanban.tsx            # Partnership Kanban
│   ├── scenario-planner.tsx  # Finance scenario planner
│   ├── sidebar.tsx           # Navigation sidebar
│   └── top-bar.tsx           # Top navigation bar
├── data/
│   ├── types.ts              # TypeScript types & Zod schemas
│   └── mock.ts               # Comprehensive mock data
├── lib/
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## Data Models

All data is fully typed with TypeScript and validated with Zod schemas:

- **KPI**: Metrics with targets, trends, owners, and definitions
- **ForecastScenario**: Financial projections (Base/Bear/Bull)
- **Deal**: Partnership opportunities and pipeline
- **Vendor**: Vendor information, spend, and renewals
- **Risk**: Risk register with mitigation plans
- **Initiative**: Cross-functional projects and initiatives
- **ComplianceItem**: Compliance requirements tracking
- **Incident**: Security and operational incidents
- **ProcurementRequest**: Vendor procurement workflow

## Mock Data

The application uses realistic mock data located in `/data/mock.ts`:

- 11 KPIs across all operational areas
- 3 financial forecast scenarios
- 5 partnership deals in pipeline
- 7 vendors with renewal tracking
- 5 active risks with mitigations
- 5 cross-functional initiatives
- Historical trend data for charts
- Budget vs actuals data
- Compliance checklist items
- Incident log

## Color Palette (Hormona Brand)

```css
Background:    #FFF7F3
Card:          #F6EFEA
Border:        #E7DED7
Text:          #1F2328
Primary:       #E56B4E
Secondary:     #F4C7B8
Accent:        #D45A3E
```

## Customization

### Adding New KPIs

1. Add KPI data to `/data/mock.ts`
2. Use the `<KpiCard>` component to display
3. Optionally add to KPI definitions drawer

### Adding New Routes

1. Create new page in `app/(dashboard)/your-route/page.tsx`
2. Add navigation item to `components/sidebar.tsx`
3. Import and use existing components

### Modifying Charts

Charts use Recharts. Customize in `components/trend-chart.tsx` or create specialized chart components.

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables

No environment variables required - all data is mocked locally.

## Development Notes

- Uses Next.js 14+ App Router with React Server Components
- Tailwind CSS v4 with new `@theme` syntax
- All components are client-side (`"use client"`) for interactivity
- No backend or API calls - pure frontend application
- Print-friendly board pack with CSS print media queries

## Future Enhancements

When connecting to real data:

1. Replace mock data imports with API calls
2. Add authentication/authorization
3. Implement real-time data updates
4. Add data export to CSV/Excel
5. Integrate with actual PDF generation library
6. Add user preferences and saved views
7. Implement data caching and optimization

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Proprietary - Hormona Internal Use Only

## Support

For questions or issues, contact the Hormona engineering team.

---

**Built with ❤️ for Hormona Operations**

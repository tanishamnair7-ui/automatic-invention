"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  Handshake,
  Settings,
  Package,
  AlertTriangle,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "Revenue", href: "/revenue", icon: TrendingUp },
  { name: "Partnerships", href: "/partnerships", icon: Handshake },
  { name: "Operations", href: "/operations", icon: Settings },
  { name: "Vendors", href: "/vendors", icon: Package },
  { name: "Risk", href: "/risk", icon: AlertTriangle },
  { name: "Board Pack", href: "/board-pack", icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <Image
          src="/hormona-logo.png"
          alt="Hormona"
          width={40}
          height={40}
          className="flex-shrink-0"
        />
        <h1 className="text-xl font-bold text-primary">Hormona</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">
          Operations Command Center
        </p>
        <p className="text-xs text-muted-foreground mt-1">v1.0.0</p>
      </div>
    </div>
  )
}

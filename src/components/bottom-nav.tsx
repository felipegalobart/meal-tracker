"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, UtensilsCrossed, Activity, Clock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Início", icon: Home, match: "/" },
  { href: "/meals", label: "Refeições", icon: UtensilsCrossed, match: "/meals" },
  { href: "/symptoms", label: "Sintomas", icon: Activity, match: "/symptoms" },
  { href: "/timeline", label: "Histórico", icon: Clock, match: "/timeline" },
  { href: "/reports/history", label: "Relatório", icon: Sparkles, match: "/reports" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]"
      style={{ background: "oklch(0.13 0.014 52 / 92%)", backdropFilter: "blur(16px)" }}
    >
      <div
        className="h-px"
        style={{ background: "linear-gradient(to right, transparent, oklch(0.28 0.018 54 / 60%), transparent)" }}
      />
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            item.match === "/"
              ? pathname === "/"
              : pathname.startsWith(item.match)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-4 py-1 transition-all duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {/* Active background pill */}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-xl opacity-100 transition-all duration-200"
                  style={{ background: "oklch(0.74 0.110 54 / 10%)" }}
                />
              )}
              <item.icon
                className={cn(
                  "relative h-[18px] w-[18px] transition-all duration-200",
                  isActive ? "stroke-[2.5px]" : "stroke-[1.8px]"
                )}
              />
              <span
                className={cn(
                  "relative text-[10px] font-medium transition-all duration-200",
                  isActive ? "font-semibold" : ""
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

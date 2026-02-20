"use client"

import { cn } from "@/lib/utils"

interface SeveritySelectorProps {
  value: number
  onChange: (severity: number) => void
}

const levels = [
  { value: 1, label: "Leve", color: "oklch(0.72 0.073 148)" },
  { value: 2, label: "Baixa", color: "oklch(0.78 0.090 130)" },
  { value: 3, label: "Média", color: "oklch(0.80 0.120 80)" },
  { value: 4, label: "Alta", color: "oklch(0.72 0.110 48)" },
  { value: 5, label: "Severa", color: "oklch(0.62 0.110 22)" },
]

export function SeveritySelector({ value, onChange }: SeveritySelectorProps) {
  return (
    <div className="flex gap-2">
      {levels.map((level) => {
        const isActive = value === level.value
        return (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={cn(
              "flex h-14 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-wide transition-all duration-150",
              isActive ? "scale-[1.04]" : "opacity-50 hover:opacity-75"
            )}
            style={{
              background: isActive ? `${level.color}18` : "oklch(0.19 0.015 52)",
              border: `2px solid ${isActive ? level.color : "oklch(0.28 0.018 54 / 50%)"}`,
              color: isActive ? level.color : "oklch(0.56 0.022 62)",
            }}
          >
            <div
              className="h-3 w-3 rounded-full transition-all"
              style={{ backgroundColor: level.color, boxShadow: isActive ? `0 0 8px ${level.color}80` : "none" }}
            />
            {level.label}
          </button>
        )
      })}
    </div>
  )
}

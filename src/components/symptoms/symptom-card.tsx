"use client"

import { Trash2 } from "lucide-react"
import { deleteSymptom } from "@/app/(app)/symptoms/actions"
import { toast } from "sonner"
import { LocalTime } from "@/components/local-time"

interface SymptomCardProps {
  symptom: {
    id: string
    name: string
    severity: number
    notes: string | null
    loggedAt: Date
  }
}

const severityConfig: Record<number, { label: string; color: string }> = {
  1: { label: "Leve", color: "oklch(0.72 0.073 148)" },
  2: { label: "Baixa", color: "oklch(0.78 0.090 130)" },
  3: { label: "Média", color: "oklch(0.80 0.120 80)" },
  4: { label: "Alta", color: "oklch(0.72 0.110 48)" },
  5: { label: "Severa", color: "oklch(0.62 0.110 22)" },
}

export function SymptomCard({ symptom }: SymptomCardProps) {
  const config = severityConfig[symptom.severity] ?? severityConfig[3]

  async function handleDelete() {
    if (!confirm("Excluir este sintoma?")) return
    try {
      await deleteSymptom(symptom.id)
      toast.success("Sintoma excluído")
    } catch {
      toast.error("Falha ao excluir sintoma")
    }
  }

  return (
    <div
      className="overflow-hidden rounded-2xl transition-all duration-200 active:scale-[0.99]"
      style={{ background: "oklch(0.155 0.015 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }}
    >
      <div className="flex items-stretch">
        <div className="w-1 shrink-0 rounded-l-2xl" style={{ backgroundColor: config.color }} />

        <div className="flex flex-1 items-start gap-3 p-4 pl-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: config.color }} />
                <span
                  className="rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ backgroundColor: `${config.color}20`, color: config.color }}
                >
                  {config.label}
                </span>
              </div>
              <LocalTime date={symptom.loggedAt} fmt="d 'de' MMM, HH:mm" className="text-xs text-muted-foreground" />
            </div>

            <p className="font-serif text-base font-medium leading-snug text-foreground">
              {symptom.name}
            </p>

            {symptom.notes && (
              <p className="text-xs leading-relaxed text-muted-foreground">{symptom.notes}</p>
            )}
          </div>

          <div className="flex flex-col items-center gap-1 pr-1 pt-0.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-1 w-2 rounded-full transition-all"
                  style={{
                    backgroundColor: i <= symptom.severity ? config.color : "oklch(0.28 0.018 54 / 60%)",
                  }}
                />
              ))}
            </div>
            <button
              onClick={handleDelete}
              className="mt-1 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { deleteMeal } from "@/app/(app)/meals/actions"
import { toast } from "sonner"
import type { MealType } from "@prisma/client"

interface MealCardProps {
  meal: {
    id: string
    name: string
    mealType: MealType
    ingredients: string[]
    notes: string | null
    loggedAt: Date
  }
}

const mealTypeLabels: Record<MealType, string> = {
  BREAKFAST: "Café da manhã",
  LUNCH: "Almoço",
  DINNER: "Jantar",
  SNACK: "Lanche",
  OTHER: "Outro",
}

const mealTypeColors: Record<MealType, string> = {
  BREAKFAST: "oklch(0.80 0.120 80)",
  LUNCH: "oklch(0.72 0.073 148)",
  DINNER: "oklch(0.65 0.090 270)",
  SNACK: "oklch(0.70 0.090 20)",
  OTHER: "oklch(0.56 0.022 62)",
}

export function MealCard({ meal }: MealCardProps) {
  async function handleDelete() {
    if (!confirm("Excluir esta refeição?")) return
    try {
      await deleteMeal(meal.id)
      toast.success("Refeição excluída")
    } catch {
      toast.error("Falha ao excluir refeição")
    }
  }

  const color = mealTypeColors[meal.mealType]

  return (
    <div
      className="overflow-hidden rounded-2xl transition-all duration-200 active:scale-[0.99]"
      style={{ background: "oklch(0.155 0.015 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }}
    >
      <div className="flex items-stretch">
        <div className="w-1 shrink-0 rounded-l-2xl" style={{ backgroundColor: color }} />

        <div className="flex flex-1 items-start gap-3 p-4 pl-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {mealTypeLabels[meal.mealType]}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(meal.loggedAt), "d 'de' MMM, HH:mm", { locale: ptBR })}
              </span>
            </div>

            <p className="font-serif text-base font-medium leading-snug text-foreground">
              {meal.name}
            </p>

            {meal.ingredients.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {meal.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="rounded-full px-2.5 py-0.5 text-xs text-muted-foreground"
                    style={{ background: "oklch(0.21 0.016 52)", border: "1px solid oklch(0.28 0.018 54 / 50%)" }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            )}

            {meal.notes && (
              <p className="text-xs leading-relaxed text-muted-foreground">{meal.notes}</p>
            )}
          </div>

          <div className="mt-0.5 flex shrink-0 gap-1">
            <Link
              href={`/meals/${meal.id}/edit`}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              onClick={handleDelete}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

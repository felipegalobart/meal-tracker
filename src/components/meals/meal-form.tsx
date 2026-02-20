"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IngredientInput } from "@/components/meals/ingredient-input"
import { createMeal, updateMeal } from "@/app/(app)/meals/actions"
import { format } from "date-fns"
import type { MealType } from "@prisma/client"

const mealTypes = [
  { value: "BREAKFAST", label: "Café da manhã" },
  { value: "LUNCH", label: "Almoço" },
  { value: "DINNER", label: "Jantar" },
  { value: "SNACK", label: "Lanche" },
  { value: "OTHER", label: "Outro" },
]

const fieldClass = "w-full rounded-xl px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground"
const fieldStyle = { background: "oklch(0.19 0.015 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }
const fieldFocusStyle = { outline: "none", boxShadow: "0 0 0 2px oklch(0.74 0.110 54 / 35%)" }

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </label>
  )
}

interface MealFormProps {
  meal?: {
    id: string
    name: string
    mealType: MealType
    ingredients: string[]
    notes: string | null
    loggedAt: Date
  }
}

export function MealForm({ meal }: MealFormProps) {
  const router = useRouter()
  const [ingredients, setIngredients] = useState<string[]>(meal?.ingredients ?? [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set("ingredients", JSON.stringify(ingredients))

    try {
      if (meal) {
        await updateMeal(meal.id, formData)
      } else {
        await createMeal(formData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "oklch(0.60 0.095 22 / 12%)", color: "oklch(0.75 0.095 22)", border: "1px solid oklch(0.60 0.095 22 / 30%)" }}
        >
          {error}
        </div>
      )}

      <div className="space-y-2">
        <FormLabel>Tipo de Refeição</FormLabel>
        <Select name="mealType" required defaultValue={meal?.mealType}>
          <SelectTrigger
            className="h-12 rounded-xl border-0 text-sm"
            style={fieldStyle}
          >
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {mealTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <FormLabel>O que você comeu?</FormLabel>
        <input
          name="name"
          placeholder="ex.: Frango grelhado, Macarrão…"
          required
          defaultValue={meal?.name}
          className={fieldClass}
          style={fieldStyle}
          onFocus={(e) => Object.assign(e.target.style, fieldFocusStyle)}
          onBlur={(e) => { e.target.style.boxShadow = "none" }}
        />
      </div>

      <div className="space-y-2">
        <FormLabel>Ingredientes</FormLabel>
        <IngredientInput value={ingredients} onChange={setIngredients} />
      </div>

      <div className="space-y-2">
        <FormLabel>Quando?</FormLabel>
        <input
          name="loggedAt"
          type="datetime-local"
          defaultValue={format(meal ? new Date(meal.loggedAt) : new Date(), "yyyy-MM-dd'T'HH:mm")}
          required
          className={fieldClass}
          style={fieldStyle}
          onFocus={(e) => Object.assign(e.target.style, fieldFocusStyle)}
          onBlur={(e) => { e.target.style.boxShadow = "none" }}
        />
      </div>

      <div className="space-y-2">
        <FormLabel>Observações (opcional)</FormLabel>
        <textarea
          name="notes"
          placeholder="Detalhes adicionais…"
          rows={3}
          defaultValue={meal?.notes ?? ""}
          className={`${fieldClass} resize-none leading-relaxed`}
          style={fieldStyle}
          onFocus={(e) => Object.assign(e.target.style, fieldFocusStyle)}
          onBlur={(e) => { e.target.style.boxShadow = "none" }}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-12 flex-1 rounded-xl text-sm font-semibold text-muted-foreground transition-all hover:text-foreground"
          style={{ background: "oklch(0.21 0.016 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="h-12 flex-1 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-60"
          style={{ background: "oklch(0.74 0.110 54)", color: "oklch(0.115 0.014 54)" }}
        >
          {loading ? "Salvando…" : meal ? "Salvar alterações" : "Salvar Refeição"}
        </button>
      </div>
    </form>
  )
}

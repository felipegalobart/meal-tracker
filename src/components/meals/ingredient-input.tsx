"use client"

import { useState, KeyboardEvent } from "react"
import { X } from "lucide-react"

interface IngredientInputProps {
  value: string[]
  onChange: (ingredients: string[]) => void
}

export function IngredientInput({ value, onChange }: IngredientInputProps) {
  const [input, setInput] = useState("")

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const trimmed = input.trim()
      if (trimmed && !value.includes(trimmed)) {
        onChange([...value, trimmed])
      }
      setInput("")
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  function removeIngredient(ingredient: string) {
    onChange(value.filter((i) => i !== ingredient))
  }

  return (
    <div
      className="min-h-[44px] rounded-xl px-3 py-2.5 transition-all"
      style={{ background: "oklch(0.19 0.015 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }}
    >
      <div className="flex flex-wrap gap-1.5">
        {value.map((ingredient) => (
          <span
            key={ingredient}
            className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ background: "oklch(0.74 0.110 54 / 15%)", color: "oklch(0.74 0.110 54)", border: "1px solid oklch(0.74 0.110 54 / 25%)" }}
          >
            {ingredient}
            <button
              type="button"
              onClick={() => removeIngredient(ingredient)}
              className="rounded-full p-0.5 opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? "Digite e pressione Enter para adicionar" : "Adicionar mais…"}
          className="min-w-24 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  )
}

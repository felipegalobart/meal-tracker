import { z } from "zod"

export const mealSchema = z.object({
  name: z.string().min(1, "Meal name is required"),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK", "OTHER"]),
  ingredients: z.array(z.string()).default([]),
  notes: z.string().optional(),
  loggedAt: z.coerce.date(),
})

export type MealInput = z.infer<typeof mealSchema>

import { z } from "zod"

export const symptomSchema = z.object({
  name: z.string().min(1, "Symptom name is required"),
  severity: z.number().int().min(1).max(5),
  notes: z.string().optional(),
  loggedAt: z.coerce.date(),
})

export type SymptomInput = z.infer<typeof symptomSchema>

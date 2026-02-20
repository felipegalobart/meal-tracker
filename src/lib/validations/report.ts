import { z } from "zod"

export const ReportSchema = z.object({
  summary: z.string().describe("2–3 sentence overall health and nutrition summary in Brazilian Portuguese"),
  eatingPatterns: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ).describe("Key observations about eating habits"),
  correlations: z.array(
    z.object({
      foods: z.array(z.string()).describe("Specific foods or ingredients involved"),
      symptom: z.string(),
      confidence: z.enum(["baixa", "média", "alta"]),
      explanation: z.string(),
    })
  ).describe("Possible meal–symptom or meal–allergy correlations"),
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ).describe("Specific actionable dietary recommendations"),
})

export type Report = z.infer<typeof ReportSchema>

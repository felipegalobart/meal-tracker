import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ReportSchema } from "@/lib/validations/report"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const [meals, symptoms] = await Promise.all([
    prisma.meal.findMany({
      where: { userId: session.user.id },
      orderBy: { loggedAt: "asc" },
    }),
    prisma.symptom.findMany({
      where: { userId: session.user.id },
      orderBy: { loggedAt: "asc" },
    }),
  ])

  if (meals.length === 0 && symptoms.length === 0) {
    return NextResponse.json({ error: "No data" }, { status: 400 })
  }

  const { object } = await generateObject({
    model: google("gemini-2.0-flash"),
    schema: ReportSchema,
    prompt: `
      You are a personal nutrition and health analyst. Analyze the following meal and symptom logs
      and provide insights entirely in Brazilian Portuguese.

      Focus on:
      - Eating patterns: meal type distribution, timing, skipped meals
      - Correlations between specific foods/ingredients and symptoms (especially allergies,
        digestive issues, inflammation, headaches, fatigue, skin reactions)
      - Symptom severity trends over time
      - Concrete dietary recommendations

      Meals logged (${meals.length} total):
      ${JSON.stringify(meals, null, 2)}

      Symptoms logged (${symptoms.length} total):
      ${JSON.stringify(symptoms, null, 2)}
    `,
  })

  return NextResponse.json(object)
}

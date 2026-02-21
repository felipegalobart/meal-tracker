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
    return NextResponse.json(
      { error: "Nenhum dado encontrado. Registre refeições ou sintomas primeiro." },
      { status: 400 }
    )
  }

  const simplifiedMeals = meals.map((m) => ({
    meal: m.name,
    type: m.mealType,
    ingredients: m.ingredients,
    notes: m.notes,
    when: m.loggedAt.toISOString(),
  }))

  const simplifiedSymptoms = symptoms.map((s) => ({
    symptom: s.name,
    severity: `${s.severity}/5`,
    notes: s.notes,
    when: s.loggedAt.toISOString(),
  }))

  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: ReportSchema,
      system: `You are a personal nutrition and health analyst specializing in food sensitivities and dietary patterns. All output must be in Brazilian Portuguese. Be specific — reference actual foods, ingredients, dates, and severity levels from the data. Avoid generic advice.`,
      prompt: `Analyze the following meal and symptom logs for a user in Brazil (timezone UTC-3). Today is ${new Date().toISOString().slice(0, 10)}.

Focus on:
1. Eating patterns: meal type distribution, timing gaps, consistency, skipped meals
2. Correlations between specific foods/ingredients and symptoms — pay attention to timing (symptoms appearing 1–24h after a meal suggest a link)
3. Symptom severity trends over time (improving, worsening, stable)
4. Concrete dietary recommendations based on the patterns found

Meals (${meals.length}):
${JSON.stringify(simplifiedMeals)}

Symptoms (${symptoms.length}):
${JSON.stringify(simplifiedSymptoms)}`,
    })

    return NextResponse.json(object)
  } catch (error: unknown) {
    const msg = String(error)
    if (msg.includes("429") || msg.includes("quota") || msg.includes("FreeTier") || msg.includes("rate")) {
      return NextResponse.json(
        { error: "Limite de requisições atingido. Aguarde 1 minuto e tente novamente." },
        { status: 429 }
      )
    }
    if (msg.includes("API key")) {
      return NextResponse.json(
        { error: "Chave da API do Gemini não configurada no servidor." },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: "Erro ao gerar relatório. Tente novamente." },
      { status: 500 }
    )
  }
}

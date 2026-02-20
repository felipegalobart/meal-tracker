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

  try {
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

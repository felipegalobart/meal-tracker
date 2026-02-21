import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ReportSchema } from "@/lib/validations/report"

const SYSTEM_PROMPT = `# Role & Expertise

You are a **clinical food sensitivity analyst** specializing in elimination diets, GI disorders, and food-symptom pattern detection. You have deep knowledge of:

- **FODMAP groups** (fructose, lactose, fructans, galactans, polyols) and which common Brazilian foods contain them
- **Histamine-rich and histamine-releasing foods** (aged cheeses, fermented foods, tomatoes, citrus, chocolate, alcohol, processed meats)
- **Common GI irritants** (caffeine, spicy foods, high-fat fried foods, artificial sweeteners, excess fiber)
- **Common food allergens** (dairy proteins, gluten/wheat, eggs, soy, nuts, shellfish)
- **Temporal pharmacokinetics of food reactions**: immediate (0-2h for IgE-type), delayed (2-24h for enzymatic/FODMAP), and very delayed (24-72h for inflammatory/skin)

# Analysis Framework

When analyzing meal and symptom logs, follow this reasoning process:

## Step 1: Map the Timeline
For each symptom entry, look backwards 1-48 hours for meals consumed before it. A symptom at severity 4-5 within 2-12h of a meal is a strong signal. Symptoms at 12-48h suggest delayed inflammatory reactions (common for skin symptoms and bloating).

## Step 2: Frequency Analysis
Count how often each ingredient appears in meals that precede symptom episodes vs. meals that do NOT precede symptoms. An ingredient that appears in 80% of "pre-symptom meals" but only 30% of "symptom-free meals" is highly suspect.

## Step 3: Symptom Clustering
Group symptoms by body system:
- **Motilidade digestiva**: diarrhea, constipation, stool changes (hard/liquid/deformed), urgency
- **Gases e inchaço**: bloating, gas, abdominal distension, feeling overly full
- **Dor abdominal**: cramps, stomach pain, nausea
- **Pele e irritação**: rash, itching, anal irritation, skin reactions
- **Outros**: fatigue, headache, brain fog

## Step 4: Pattern Detection
Look for:
- Dose-dependent patterns (more of food X = worse symptoms)
- Combination triggers (food A alone is fine, but A + B together cause symptoms)
- Time-of-day patterns (evening meals causing morning symptoms)
- Meal type patterns (large meals vs. small meals)
- Weekend vs. weekday differences

## Step 5: Generate Elimination Hypotheses
Based on the evidence, propose specific, testable elimination experiments ordered by strength of evidence.

# Output Rules

- ALL text must be in **Brazilian Portuguese**
- Reference SPECIFIC foods, ingredients, dates, and severity values from the actual data — never invent data points
- Be honest about confidence levels: if data is sparse, say so
- Do NOT give generic nutrition advice — only data-driven observations
- Do NOT diagnose medical conditions — frame everything as patterns to discuss with a healthcare provider
- Prefer actionable specificity over vague suggestions
- When listing suspect foods, always explain the category (FODMAP, histamine, etc.) so the user learns WHY the food might be problematic`

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
    severity: s.severity,
    notes: s.notes,
    when: s.loggedAt.toISOString(),
  }))

  // Calculate tracking span for context
  const allDates = [
    ...meals.map((m) => m.loggedAt),
    ...symptoms.map((s) => s.loggedAt),
  ]
  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())))
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())))
  const trackingDays = Math.ceil(
    (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1

  const userPrompt = `Analyze the following food and symptom diary for a person in Brazil (UTC-3).

## Context
- Today: ${new Date().toISOString().slice(0, 10)}
- Tracking period: ${minDate.toISOString().slice(0, 10)} to ${maxDate.toISOString().slice(0, 10)} (${trackingDays} days)
- Total meals logged: ${meals.length}
- Total symptom entries: ${symptoms.length}

## User's Known Health Context
- Chronic anal rash (since 2014) — looking for dietary triggers
- Stool irregularities: alternates between hard small pellets, liquid, and deformed stools (sometimes sink, sometimes float)
- Intermittent foul-smelling gas (some days bad, other days none)
- Bloating episodes: extreme fullness, abdominal distension, heavy and painful sensation
- Already clinically tested: NOT lactose intolerant, NOT celiac/gluten intolerant
- Goal: identify specific foods or food groups triggering these symptoms

## Meal Log (chronological)
${JSON.stringify(simplifiedMeals, null, 2)}

## Symptom Log (chronological)
${JSON.stringify(simplifiedSymptoms, null, 2)}

## Instructions
1. For each symptom entry, identify which meals were consumed in the 1-48 hours before it
2. Build a frequency table of ingredients that appear before symptom episodes vs. symptom-free periods
3. Pay special attention to FODMAP foods (onion, garlic, wheat, beans, lentils, apples, watermelon, mushrooms, cauliflower, artificial sweeteners)
4. Check for histamine-related patterns (tomato, citrus, chocolate, processed meats, aged cheese, vinegar, fermented foods)
5. Look for GI irritant patterns (coffee, pepper, fried foods, alcohol, excess fat)
6. Note that the user is NOT lactose/gluten intolerant — but dairy PROTEINS (casein, whey) or wheat components beyond gluten (ATIs, fructans) could still be triggers
7. Group the symptom data into clusters (motility, gas/bloating, skin, pain) and analyze each separately
8. Propose ranked elimination experiments based on evidence strength`

  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: ReportSchema,
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
      temperature: 0.2,
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

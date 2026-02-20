import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed, Activity, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { MealType } from "@prisma/client"

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

const severityLabels: Record<number, string> = {
  1: "Leve",
  2: "Baixa",
  3: "Média",
  4: "Alta",
  5: "Severa",
}

const severityColors: Record<number, string> = {
  1: "oklch(0.72 0.073 148)",
  2: "oklch(0.78 0.090 130)",
  3: "oklch(0.80 0.120 80)",
  4: "oklch(0.72 0.110 48)",
  5: "oklch(0.62 0.110 22)",
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Bom dia"
  if (h < 18) return "Boa tarde"
  return "Boa noite"
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const [recentMeals, recentSymptoms] = await Promise.all([
    prisma.meal.findMany({
      where: { userId: session.user.id },
      orderBy: { loggedAt: "desc" },
      take: 5,
    }),
    prisma.symptom.findMany({
      where: { userId: session.user.id },
      orderBy: { loggedAt: "desc" },
      take: 5,
    }),
  ])

  const firstName = session.user.name?.split(" ")[0] || "você"

  return (
    <div className="space-y-7">
      {/* Saudação */}
      <div className="space-y-0.5 pt-1">
        <p className="text-sm text-muted-foreground">{getGreeting()}</p>
        <h1 className="font-serif text-3xl font-semibold leading-tight text-foreground">
          {firstName}.
        </h1>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/meals/new"
          className="group flex flex-col gap-3 rounded-2xl p-4 transition-all duration-200 active:scale-[0.97]"
          style={{ background: "oklch(0.74 0.110 54 / 12%)", border: "1px solid oklch(0.74 0.110 54 / 20%)" }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "oklch(0.74 0.110 54 / 20%)" }}
          >
            <UtensilsCrossed className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Registrar Refeição</p>
            <p className="text-xs text-muted-foreground">O que você comeu?</p>
          </div>
        </Link>

        <Link
          href="/symptoms/new"
          className="group flex flex-col gap-3 rounded-2xl p-4 transition-all duration-200 active:scale-[0.97]"
          style={{ background: "oklch(0.72 0.073 148 / 10%)", border: "1px solid oklch(0.72 0.073 148 / 20%)" }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "oklch(0.72 0.073 148 / 18%)" }}
          >
            <Activity className="h-5 w-5" style={{ color: "oklch(0.72 0.073 148)" }} />
          </div>
          <div>
            <p className="font-semibold text-foreground">Registrar Sintoma</p>
            <p className="text-xs text-muted-foreground">Como você está?</p>
          </div>
        </Link>
      </div>

      {/* Refeições recentes */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            Refeições Recentes
          </h2>
          <Button asChild variant="ghost" size="sm" className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground">
            <Link href="/meals">
              Ver todas <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>

        <div
          className="overflow-hidden rounded-2xl"
          style={{ background: "oklch(0.155 0.015 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }}
        >
          {recentMeals.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-muted-foreground">Nenhuma refeição registrada ainda.</p>
              <Link href="/meals/new" className="mt-1 inline-block text-xs text-primary">
                Registre sua primeira refeição →
              </Link>
            </div>
          ) : (
            <ul>
              {recentMeals.map((meal, i) => (
                <li
                  key={meal.id}
                  className="flex items-center gap-3 px-4 py-3"
                  style={i < recentMeals.length - 1 ? { borderBottom: "1px solid oklch(0.28 0.018 54 / 40%)" } : {}}
                >
                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: mealTypeColors[meal.mealType] }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{meal.name}</p>
                    <p className="text-xs text-muted-foreground">{mealTypeLabels[meal.mealType]}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {format(new Date(meal.loggedAt), "HH:mm")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Sintomas recentes */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            Sintomas Recentes
          </h2>
          <Button asChild variant="ghost" size="sm" className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground">
            <Link href="/symptoms">
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>

        <div
          className="overflow-hidden rounded-2xl"
          style={{ background: "oklch(0.155 0.015 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }}
        >
          {recentSymptoms.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-muted-foreground">Nenhum sintoma registrado ainda.</p>
              <Link href="/symptoms/new" className="mt-1 inline-block text-xs text-primary">
                Registre seu primeiro sintoma →
              </Link>
            </div>
          ) : (
            <ul>
              {recentSymptoms.map((symptom, i) => (
                <li
                  key={symptom.id}
                  className="flex items-center gap-3 px-4 py-3"
                  style={i < recentSymptoms.length - 1 ? { borderBottom: "1px solid oklch(0.28 0.018 54 / 40%)" } : {}}
                >
                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: severityColors[symptom.severity] }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{symptom.name}</p>
                    <p className="text-xs text-muted-foreground">{severityLabels[symptom.severity]}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {format(new Date(symptom.loggedAt), "HH:mm")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { LocalTime } from "@/components/local-time"
import { UtensilsCrossed, Activity } from "lucide-react"
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

const severityColors: Record<number, string> = {
  1: "oklch(0.72 0.073 148)",
  2: "oklch(0.78 0.090 130)",
  3: "oklch(0.80 0.120 80)",
  4: "oklch(0.72 0.110 48)",
  5: "oklch(0.62 0.110 22)",
}

const severityLabels: Record<number, string> = {
  1: "Leve",
  2: "Baixa",
  3: "Média",
  4: "Alta",
  5: "Severa",
}

type TimelineEntry =
  | { type: "meal"; id: string; name: string; mealType: MealType; loggedAt: Date }
  | { type: "symptom"; id: string; name: string; severity: number; loggedAt: Date }

export default async function TimelinePage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const [meals, symptoms] = await Promise.all([
    prisma.meal.findMany({
      where: { userId: session.user.id },
      orderBy: { loggedAt: "desc" },
      take: 50,
      select: { id: true, name: true, mealType: true, loggedAt: true },
    }),
    prisma.symptom.findMany({
      where: { userId: session.user.id },
      orderBy: { loggedAt: "desc" },
      take: 50,
      select: { id: true, name: true, severity: true, loggedAt: true },
    }),
  ])

  const entries: TimelineEntry[] = [
    ...meals.map((m) => ({ type: "meal" as const, ...m })),
    ...symptoms.map((s) => ({ type: "symptom" as const, ...s })),
  ].sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime())

  const grouped = new Map<string, TimelineEntry[]>()
  for (const entry of entries) {
    const dateKey = format(new Date(entry.loggedAt), "yyyy-MM-dd")
    if (!grouped.has(dateKey)) grouped.set(dateKey, [])
    grouped.get(dateKey)!.push(entry)
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-foreground">Histórico</h1>

      {entries.length === 0 ? (
        <div
          className="rounded-2xl px-6 py-14 text-center"
          style={{ background: "oklch(0.155 0.015 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }}
        >
          <p className="font-serif text-lg text-muted-foreground">Ainda vazio</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Comece a registrar refeições e sintomas para vê-los aqui.
          </p>
        </div>
      ) : (
        Array.from(grouped.entries()).map(([dateKey, items]) => (
          <div key={dateKey}>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: "oklch(0.28 0.018 54 / 40%)" }} />
              <LocalTime date={new Date(dateKey + "T12:00:00")} fmt="EEEE, d 'de' MMMM" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground" />
              <div className="h-px flex-1" style={{ background: "oklch(0.28 0.018 54 / 40%)" }} />
            </div>

            <div className="relative pl-8">
              <div
                className="absolute left-[13px] top-2 w-px"
                style={{ height: "calc(100% - 1rem)", background: "oklch(0.28 0.018 54 / 50%)" }}
              />

              <div className="space-y-3">
                {items.map((item) => {
                  const isMeal = item.type === "meal"
                  const color = isMeal
                    ? mealTypeColors[item.mealType]
                    : severityColors[item.severity]

                  return (
                    <div key={`${item.type}-${item.id}`} className="relative flex items-start gap-3">
                      <div
                        className="absolute -left-8 flex h-7 w-7 items-center justify-center rounded-full"
                        style={{ background: `${color}18`, border: `1.5px solid ${color}50` }}
                      >
                        {isMeal ? (
                          <UtensilsCrossed className="h-3.5 w-3.5" style={{ color }} />
                        ) : (
                          <Activity className="h-3.5 w-3.5" style={{ color }} />
                        )}
                      </div>

                      <div
                        className="flex flex-1 items-center gap-3 rounded-xl p-3"
                        style={{ background: "oklch(0.155 0.015 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }}
                      >
                        <div className="w-0.5 self-stretch rounded-full" style={{ backgroundColor: color }} />

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="text-[11px] font-semibold" style={{ color }}>
                              {isMeal
                                ? mealTypeLabels[item.mealType]
                                : severityLabels[item.severity]}
                            </span>
                            {!isMeal && (
                              <span className="text-[11px] text-muted-foreground">
                                · {item.severity}/5
                              </span>
                            )}
                          </div>
                        </div>

                        <LocalTime date={item.loggedAt} fmt="HH:mm" className="shrink-0 text-xs text-muted-foreground" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

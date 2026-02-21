"use client"

import { useState } from "react"
import {
  Sparkles,
  AlertCircle,
  FlaskConical,
  Clock,
  Activity,
  Search,
  Database,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react"
import type {
  Report,
  SuspectFood,
  TemporalCorrelation,
  SymptomCluster,
  EliminationExperiment,
  DataQuality,
} from "@/lib/validations/report"

// ---------------------------------------------------------------------------
// Design tokens (OKLCH warm dark editorial)
// ---------------------------------------------------------------------------

const cardStyle = {
  background: "oklch(0.155 0.015 52)",
  border: "1px solid oklch(0.28 0.018 54 / 55%)",
}

const suspicionColors: Record<
  string,
  { label: string; color: string; bg: string; border: string; barWidth: string }
> = {
  baixa: {
    label: "Baixa",
    color: "oklch(0.70 0.13 148)",
    bg: "oklch(0.70 0.13 148 / 10%)",
    border: "oklch(0.70 0.13 148 / 30%)",
    barWidth: "25%",
  },
  moderada: {
    label: "Moderada",
    color: "oklch(0.78 0.13 80)",
    bg: "oklch(0.78 0.13 80 / 10%)",
    border: "oklch(0.78 0.13 80 / 30%)",
    barWidth: "50%",
  },
  alta: {
    label: "Alta",
    color: "oklch(0.72 0.14 45)",
    bg: "oklch(0.72 0.14 45 / 10%)",
    border: "oklch(0.72 0.14 45 / 30%)",
    barWidth: "75%",
  },
  muito_alta: {
    label: "Muito Alta",
    color: "oklch(0.65 0.18 22)",
    bg: "oklch(0.65 0.18 22 / 10%)",
    border: "oklch(0.65 0.18 22 / 30%)",
    barWidth: "100%",
  },
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  fodmap: { label: "FODMAP", color: "oklch(0.72 0.12 270)" },
  histamina: { label: "Histamina", color: "oklch(0.72 0.14 45)" },
  irritante_gi: { label: "Irritante GI", color: "oklch(0.78 0.13 80)" },
  alergenio_comum: { label: "Alergeno", color: "oklch(0.65 0.18 22)" },
  outro: { label: "Outro", color: "oklch(0.56 0.022 62)" },
}

const trendLabels: Record<string, { label: string; color: string }> = {
  melhorando: { label: "Melhorando", color: "oklch(0.70 0.13 148)" },
  piorando: { label: "Piorando", color: "oklch(0.65 0.18 22)" },
  estável: { label: "Estavel", color: "oklch(0.78 0.13 80)" },
  dados_insuficientes: { label: "Dados insuficientes", color: "oklch(0.56 0.022 62)" },
}

const priorityColors: Record<string, { label: string; color: string; bg: string; border: string }> = {
  alta: {
    label: "Prioridade Alta",
    color: "oklch(0.65 0.18 22)",
    bg: "oklch(0.65 0.18 22 / 10%)",
    border: "oklch(0.65 0.18 22 / 30%)",
  },
  média: {
    label: "Prioridade Media",
    color: "oklch(0.78 0.13 80)",
    bg: "oklch(0.78 0.13 80 / 10%)",
    border: "oklch(0.78 0.13 80 / 30%)",
  },
  baixa: {
    label: "Prioridade Baixa",
    color: "oklch(0.56 0.022 62)",
    bg: "oklch(0.56 0.022 62 / 10%)",
    border: "oklch(0.56 0.022 62 / 30%)",
  },
}

const completenessLabels: Record<string, { label: string; color: string }> = {
  insuficiente: { label: "Insuficiente", color: "oklch(0.65 0.18 22)" },
  parcial: { label: "Parcial", color: "oklch(0.72 0.14 45)" },
  bom: { label: "Bom", color: "oklch(0.78 0.13 80)" },
  excelente: { label: "Excelente", color: "oklch(0.70 0.13 148)" },
}

// ---------------------------------------------------------------------------
// Section Header
// ---------------------------------------------------------------------------

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
}) {
  return (
    <div className="flex items-center gap-2 px-1">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Suspect Foods Section
// ---------------------------------------------------------------------------

function SuspectFoodsSection({ foods }: { foods: SuspectFood[] }) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? foods : foods.slice(0, 5)

  return (
    <section className="space-y-3">
      <SectionHeader icon={Search} title="Alimentos Suspeitos" />
      {shown.map((food, i) => {
        const sus = suspicionColors[food.suspicionLevel] ?? suspicionColors.baixa
        const cat = categoryLabels[food.category] ?? categoryLabels.outro
        return (
          <div key={i} className="rounded-2xl p-5 space-y-3" style={cardStyle}>
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">
                    {food.ingredient}
                  </p>
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: cat.color, background: `${cat.color} / 12%` }}
                  >
                    {cat.label}
                  </span>
                </div>
                {/* Symptom type tags */}
                <div className="flex flex-wrap gap-1">
                  {food.symptomTypes.map((st, j) => (
                    <span
                      key={j}
                      className="rounded-lg px-2 py-0.5 text-[11px]"
                      style={{
                        background: "oklch(0.19 0.015 52)",
                        color: "oklch(0.56 0.022 62)",
                      }}
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>
              {/* Suspicion badge */}
              <span
                className="shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
                style={{
                  color: sus.color,
                  background: sus.bg,
                  border: `1px solid ${sus.border}`,
                }}
              >
                {sus.label}
              </span>
            </div>
            {/* Suspicion bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Nivel de suspeita</span>
                <span>{food.occurrences} ocorrencia(s)</span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "oklch(0.19 0.015 52)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: sus.barWidth, background: sus.color }}
                />
              </div>
            </div>
            {/* Reasoning */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {food.reasoning}
            </p>
          </div>
        )
      })}
      {foods.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 px-1 text-xs font-medium transition-colors"
          style={{ color: "oklch(0.74 0.110 54)" }}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              Mostrar menos
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              Ver todos ({foods.length})
            </>
          )}
        </button>
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Temporal Correlations Section
// ---------------------------------------------------------------------------

function TemporalSection({ correlations }: { correlations: TemporalCorrelation[] }) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? correlations : correlations.slice(0, 4)

  return (
    <section className="space-y-3">
      <SectionHeader icon={Clock} title="Correlacoes Temporais" />
      {shown.map((c, i) => (
        <div
          key={i}
          className="rounded-2xl p-4 space-y-2"
          style={{
            ...cardStyle,
            borderLeft: `3px solid oklch(0.72 0.14 ${c.severity >= 4 ? 22 : c.severity >= 3 ? 45 : 148})`,
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {c.meal}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {c.mealDate}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-medium text-foreground">{c.symptom}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {c.symptomDate}
              </p>
            </div>
          </div>
          {/* Timeline indicator */}
          <div className="flex items-center gap-2">
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.28 0.018 54 / 55%)" }}
            />
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={{
                background: "oklch(0.19 0.015 52)",
                color: "oklch(0.74 0.110 54)",
              }}
            >
              {c.delayHours}h depois
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.28 0.018 54 / 55%)" }}
            />
          </div>
          {/* Suspect ingredients + severity */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {c.suspectIngredients.map((ing, j) => (
                <span
                  key={j}
                  className="rounded-lg px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    background: "oklch(0.74 0.110 54 / 12%)",
                    color: "oklch(0.74 0.110 54)",
                  }}
                >
                  {ing}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {Array.from({ length: 5 }).map((_, j) => (
                <div
                  key={j}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background:
                      j < c.severity
                        ? c.severity >= 4
                          ? "oklch(0.65 0.18 22)"
                          : c.severity >= 3
                            ? "oklch(0.78 0.13 80)"
                            : "oklch(0.70 0.13 148)"
                        : "oklch(0.28 0.018 54 / 40%)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
      {correlations.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 px-1 text-xs font-medium transition-colors"
          style={{ color: "oklch(0.74 0.110 54)" }}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              Mostrar menos
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              Ver todas ({correlations.length})
            </>
          )}
        </button>
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Symptom Clusters Section
// ---------------------------------------------------------------------------

function ClustersSection({ clusters }: { clusters: SymptomCluster[] }) {
  return (
    <section className="space-y-3">
      <SectionHeader icon={Activity} title="Agrupamento de Sintomas" />
      {clusters.map((cluster, i) => {
        const trend = trendLabels[cluster.trend] ?? trendLabels.dados_insuficientes
        return (
          <div key={i} className="rounded-2xl p-5 space-y-3" style={cardStyle}>
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">
                {cluster.clusterName}
              </p>
              <span
                className="shrink-0 text-[10px] font-semibold uppercase tracking-wide"
                style={{ color: trend.color }}
              >
                {trend.label}
              </span>
            </div>
            {/* Symptoms list */}
            <div className="flex flex-wrap gap-1.5">
              {cluster.symptoms.map((s, j) => (
                <span
                  key={j}
                  className="rounded-lg px-2 py-0.5 text-[11px]"
                  style={{
                    background: "oklch(0.19 0.015 52)",
                    color: "oklch(0.92 0.020 66)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
            {/* Average severity bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Severidade media</span>
                <span>{cluster.averageSeverity.toFixed(1)} / 5</span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "oklch(0.19 0.015 52)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(cluster.averageSeverity / 5) * 100}%`,
                    background:
                      cluster.averageSeverity >= 4
                        ? "oklch(0.65 0.18 22)"
                        : cluster.averageSeverity >= 3
                          ? "oklch(0.78 0.13 80)"
                          : "oklch(0.70 0.13 148)",
                  }}
                />
              </div>
            </div>
            {/* Top triggers */}
            {cluster.topTriggers.length > 0 && (
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">
                  Principais gatilhos:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cluster.topTriggers.map((t, j) => (
                    <span
                      key={j}
                      className="rounded-lg px-2 py-0.5 text-[11px] font-medium"
                      style={{
                        background: "oklch(0.74 0.110 54 / 12%)",
                        color: "oklch(0.74 0.110 54)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Observations */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {cluster.observations}
            </p>
          </div>
        )
      })}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Elimination Experiments Section
// ---------------------------------------------------------------------------

function EliminationSection({
  experiments,
}: {
  experiments: EliminationExperiment[]
}) {
  return (
    <section className="space-y-3">
      <SectionHeader icon={FlaskConical} title="Experimentos de Eliminacao" />
      {experiments.map((exp, i) => {
        const prio = priorityColors[exp.priority] ?? priorityColors.baixa
        return (
          <div
            key={i}
            className="rounded-2xl p-5 space-y-3"
            style={{
              ...cardStyle,
              borderLeft: `3px solid ${prio.color}`,
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {exp.title}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Duracao: {exp.duration}
                </p>
              </div>
              <span
                className="shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
                style={{
                  color: prio.color,
                  background: prio.bg,
                  border: `1px solid ${prio.border}`,
                }}
              >
                {prio.label}
              </span>
            </div>
            {/* Foods to remove */}
            <div className="flex flex-wrap gap-1.5">
              {exp.foodsToRemove.map((f, j) => (
                <span
                  key={j}
                  className="rounded-lg px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    background: "oklch(0.65 0.18 22 / 12%)",
                    color: "oklch(0.65 0.18 22)",
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
            {/* Rationale */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {exp.rationale}
            </p>
            {/* Expected improvement */}
            <div
              className="rounded-xl px-3 py-2 text-[12px] leading-relaxed"
              style={{
                background: "oklch(0.70 0.13 148 / 8%)",
                color: "oklch(0.70 0.13 148)",
              }}
            >
              <span className="font-semibold">Melhoria esperada:</span>{" "}
              {exp.expectedImprovement}
            </div>
          </div>
        )
      })}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Data Quality Section
// ---------------------------------------------------------------------------

function DataQualitySection({ data }: { data: DataQuality }) {
  const completeness =
    completenessLabels[data.completeness] ?? completenessLabels.insuficiente

  return (
    <section className="space-y-3">
      <SectionHeader icon={Database} title="Qualidade dos Dados" />
      <div className="rounded-2xl p-5 space-y-4" style={cardStyle}>
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Refeicoes", value: data.totalMeals },
            { label: "Sintomas", value: data.totalSymptoms },
            { label: "Dias", value: data.trackingDays },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p
                className="text-lg font-semibold font-serif"
                style={{ color: "oklch(0.74 0.110 54)" }}
              >
                {stat.value}
              </p>
              <p className="text-[11px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        {/* Completeness */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            Completude geral
          </span>
          <span
            className="text-[11px] font-semibold"
            style={{ color: completeness.color }}
          >
            {completeness.label}
          </span>
        </div>
        {/* Gaps */}
        {data.gaps.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-medium text-muted-foreground">
              Lacunas identificadas:
            </p>
            {data.gaps.map((gap, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-[12px] text-muted-foreground"
              >
                <AlertTriangle
                  className="h-3 w-3 mt-0.5 shrink-0"
                  style={{ color: "oklch(0.78 0.13 80)" }}
                />
                {gap}
              </div>
            ))}
          </div>
        )}
        {/* Suggestion */}
        <div
          className="rounded-xl px-3 py-2 text-[12px] leading-relaxed"
          style={{
            background: "oklch(0.74 0.110 54 / 8%)",
            color: "oklch(0.74 0.110 54)",
          }}
        >
          {data.suggestion}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function generate() {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/reports", { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Erro ao gerar relatorio.")
        return
      }
      setReport(data)
    } catch {
      setError("Nao foi possivel conectar ao servidor.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Analise de Sensibilidade
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Deteccao de gatilhos alimentares com IA
          </p>
        </div>
        <button
          onClick={generate}
          disabled={isLoading}
          className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.97] disabled:opacity-60"
          style={{
            background: "oklch(0.74 0.110 54)",
            color: "oklch(0.115 0.014 54)",
          }}
        >
          <Sparkles className="h-4 w-4" />
          {isLoading
            ? "Analisando..."
            : report
              ? "Gerar novamente"
              : "Gerar analise"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm"
          style={{
            background: "oklch(0.60 0.095 22 / 12%)",
            color: "oklch(0.75 0.095 22)",
            border: "1px solid oklch(0.60 0.095 22 / 30%)",
          }}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[80, 60, 72, 55, 68].map((w, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 space-y-2 animate-pulse"
              style={cardStyle}
            >
              <div
                className="h-3 rounded-lg"
                style={{
                  width: `${w}%`,
                  background: "oklch(0.28 0.018 54 / 40%)",
                }}
              />
              <div
                className="h-3 rounded-lg"
                style={{
                  width: "90%",
                  background: "oklch(0.28 0.018 54 / 25%)",
                }}
              />
              <div
                className="h-3 rounded-lg"
                style={{
                  width: "65%",
                  background: "oklch(0.28 0.018 54 / 25%)",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!report && !isLoading && !error && (
        <div className="rounded-2xl px-6 py-12 text-center" style={cardStyle}>
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground opacity-40" />
          <p className="text-sm text-muted-foreground">
            Clique em{" "}
            <strong className="text-foreground">Gerar analise</strong> para
            identificar gatilhos alimentares nos seus dados.
          </p>
          <p className="mt-2 text-xs text-muted-foreground opacity-70">
            A IA analisara correlacoes temporais entre refeicoes e sintomas,
            padroes FODMAP, histamina e irritantes GI.
          </p>
        </div>
      )}

      {/* Report content */}
      {report && !isLoading && (
        <>
          {/* Executive Summary */}
          {report.executiveSummary && (
            <div className="rounded-2xl p-5" style={cardStyle}>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Resumo Executivo
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                {report.executiveSummary}
              </p>
            </div>
          )}

          {/* Suspect Foods */}
          {report.suspectFoods?.length > 0 && (
            <SuspectFoodsSection foods={report.suspectFoods} />
          )}

          {/* Temporal Correlations */}
          {report.temporalCorrelations?.length > 0 && (
            <TemporalSection correlations={report.temporalCorrelations} />
          )}

          {/* Symptom Clusters */}
          {report.symptomClusters?.length > 0 && (
            <ClustersSection clusters={report.symptomClusters} />
          )}

          {/* Elimination Experiments */}
          {report.eliminationExperiments?.length > 0 && (
            <EliminationSection experiments={report.eliminationExperiments} />
          )}

          {/* Data Quality */}
          {report.dataQuality && (
            <DataQualitySection data={report.dataQuality} />
          )}

          {/* Disclaimer */}
          <p className="px-1 text-[11px] leading-relaxed text-muted-foreground opacity-60">
            Esta analise e gerada por IA com base nos seus registros e nao substitui
            orientacao medica. Compartilhe os resultados com seu gastroenterologista
            ou nutricionista.
          </p>
        </>
      )}
    </div>
  )
}

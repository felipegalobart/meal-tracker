"use client"

import { useState } from "react"
import { Sparkles, AlertCircle } from "lucide-react"
import type { Report } from "@/lib/validations/report"

const confidenceStyle: Record<string, { label: string; color: string; bg: string; border: string }> = {
  baixa: { label: "Baixa", color: "oklch(0.70 0.13 148)", bg: "oklch(0.70 0.13 148 / 10%)", border: "oklch(0.70 0.13 148 / 30%)" },
  média: { label: "Média", color: "oklch(0.78 0.13 80)",  bg: "oklch(0.78 0.13 80 / 10%)",  border: "oklch(0.78 0.13 80 / 30%)"  },
  alta:  { label: "Alta",  color: "oklch(0.65 0.18 22)",  bg: "oklch(0.65 0.18 22 / 10%)",  border: "oklch(0.65 0.18 22 / 30%)"  },
}

const cardStyle = {
  background: "oklch(0.155 0.015 52)",
  border: "1px solid oklch(0.28 0.018 54 / 55%)",
}

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
        setError(data.error ?? "Erro ao gerar relatório.")
        return
      }
      setReport(data)
    } catch {
      setError("Não foi possível conectar ao servidor.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Relatório de Saúde</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Análise de padrões entre suas refeições e sintomas
          </p>
        </div>
        <button
          onClick={generate}
          disabled={isLoading}
          className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.97] disabled:opacity-60"
          style={{ background: "oklch(0.74 0.110 54)", color: "oklch(0.115 0.014 54)" }}
        >
          <Sparkles className="h-4 w-4" />
          {isLoading ? "Analisando…" : report ? "Gerar novamente" : "Gerar relatório"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm"
          style={{ background: "oklch(0.60 0.095 22 / 12%)", color: "oklch(0.75 0.095 22)", border: "1px solid oklch(0.60 0.095 22 / 30%)" }}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[80, 60, 72].map((w, i) => (
            <div key={i} className="rounded-2xl p-5 space-y-2 animate-pulse" style={cardStyle}>
              <div className="h-3 rounded-lg" style={{ width: `${w}%`, background: "oklch(0.28 0.018 54 / 40%)" }} />
              <div className="h-3 rounded-lg" style={{ width: "90%", background: "oklch(0.28 0.018 54 / 25%)" }} />
              <div className="h-3 rounded-lg" style={{ width: "65%", background: "oklch(0.28 0.018 54 / 25%)" }} />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!report && !isLoading && !error && (
        <div className="rounded-2xl px-6 py-12 text-center" style={cardStyle}>
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground opacity-40" />
          <p className="text-sm text-muted-foreground">
            Clique em <strong className="text-foreground">Gerar relatório</strong> para analisar seus dados com IA.
          </p>
        </div>
      )}

      {report && (
        <>
          {/* Summary */}
          {report.summary && (
            <div className="rounded-2xl p-5" style={cardStyle}>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Resumo</p>
              <p className="text-sm leading-relaxed text-foreground">{report.summary}</p>
            </div>
          )}

          {/* Eating patterns */}
          {report.eatingPatterns?.length > 0 && (
            <section className="space-y-3">
              <h2 className="px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Padrões Alimentares
              </h2>
              {report.eatingPatterns.map((p, i) => (
                <div key={i} className="rounded-2xl p-5" style={{ ...cardStyle, borderLeft: "3px solid oklch(0.74 0.110 54)" }}>
                  <p className="text-sm font-semibold text-foreground mb-1">{p.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                </div>
              ))}
            </section>
          )}

          {/* Correlations */}
          {report.correlations?.length > 0 && (
            <section className="space-y-3">
              <h2 className="px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Correlações Refeição → Sintoma
              </h2>
              {report.correlations.map((c, i) => {
                const conf = confidenceStyle[c.confidence] ?? confidenceStyle.baixa
                return (
                  <div key={i} className="rounded-2xl p-5 space-y-3" style={cardStyle}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1.5">
                          {c.foods.map((f, j) => (
                            <span
                              key={j}
                              className="rounded-lg px-2 py-0.5 text-xs font-medium"
                              style={{ background: "oklch(0.74 0.110 54 / 12%)", color: "oklch(0.74 0.110 54)" }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm font-medium text-foreground">→ {c.symptom}</p>
                      </div>
                      <span
                        className="shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
                        style={{ color: conf.color, background: conf.bg, border: `1px solid ${conf.border}` }}
                      >
                        {conf.label}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{c.explanation}</p>
                  </div>
                )
              })}
            </section>
          )}

          {/* Recommendations */}
          {report.recommendations?.length > 0 && (
            <section className="space-y-3">
              <h2 className="px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Recomendações
              </h2>
              {report.recommendations.map((r, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5"
                  style={{ ...cardStyle, borderLeft: "3px solid oklch(0.70 0.13 148)" }}
                >
                  <p className="text-sm font-semibold text-foreground mb-1">{r.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{r.description}</p>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  )
}

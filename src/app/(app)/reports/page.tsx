"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles, AlertCircle, History } from "lucide-react"
import type { Report } from "@/lib/validations/report"
import { ReportDisplay } from "@/components/reports/report-display"
import { saveReport } from "./actions"

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------

const cardStyle = {
  background: "oklch(0.155 0.015 52)",
  border: "1px solid oklch(0.28 0.018 54 / 55%)",
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
      // Auto-save the generated report
      try {
        await saveReport(data)
      } catch {
        // Saving failed silently — report is still displayed
      }
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

      {/* History link */}
      <Link
        href="/reports/history"
        className="flex items-center gap-2 text-sm font-medium transition-colors"
        style={{ color: "oklch(0.74 0.110 54)" }}
      >
        <History className="h-4 w-4" />
        Ver relatorios anteriores
      </Link>

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
      {report && !isLoading && <ReportDisplay report={report} />}
    </div>
  )
}

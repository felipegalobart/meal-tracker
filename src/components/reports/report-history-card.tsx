"use client"

import Link from "next/link"
import { Trash2 } from "lucide-react"
import { deleteReport } from "@/app/(app)/reports/actions"
import { toast } from "sonner"
import { LocalTime } from "@/components/local-time"
import type { Report as ReportType } from "@/lib/validations/report"

interface ReportHistoryCardProps {
  report: {
    id: string
    content: unknown
    createdAt: Date
  }
}

export function ReportHistoryCard({ report }: ReportHistoryCardProps) {
  const content = report.content as ReportType

  async function handleDelete() {
    if (!confirm("Excluir este relatorio?")) return
    try {
      await deleteReport(report.id)
      toast.success("Relatorio excluido")
    } catch {
      toast.error("Falha ao excluir relatorio")
    }
  }

  const dataQuality = content.dataQuality
  const summarySnippet = content.executiveSummary
    ? content.executiveSummary.length > 120
      ? content.executiveSummary.slice(0, 120) + "..."
      : content.executiveSummary
    : "Sem resumo"

  return (
    <Link href={`/reports/${report.id}`} className="block">
      <div
        className="rounded-2xl p-4 space-y-3 transition-all active:scale-[0.99]"
        style={{
          background: "oklch(0.155 0.015 52)",
          border: "1px solid oklch(0.28 0.018 54 / 55%)",
          borderLeft: "3px solid oklch(0.74 0.110 54)",
        }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Analise de Sensibilidade
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              <LocalTime date={report.createdAt} fmt="d 'de' MMM, HH:mm" />
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleDelete()
            }}
            className="shrink-0 rounded-lg p-2 transition-colors"
            style={{ color: "oklch(0.56 0.022 62)" }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Summary snippet */}
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {summarySnippet}
        </p>

        {/* Data quality stats */}
        {dataQuality && (
          <div className="flex gap-4 text-[11px] text-muted-foreground">
            <span>{dataQuality.totalMeals} refeicoes</span>
            <span>{dataQuality.totalSymptoms} sintomas</span>
            <span>{dataQuality.trackingDays} dias</span>
          </div>
        )}
      </div>
    </Link>
  )
}

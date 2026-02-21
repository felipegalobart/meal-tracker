import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Sparkles } from "lucide-react"
import { ReportHistoryCard } from "@/components/reports/report-history-card"

export default async function ReportHistoryPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const reports = await prisma.report.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Relatorios
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Historico de analises de sensibilidade
          </p>
        </div>
        <Link
          href="/reports"
          className="flex h-9 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold transition-all active:scale-[0.97]"
          style={{ background: "oklch(0.74 0.110 54)", color: "oklch(0.115 0.014 54)" }}
        >
          <Sparkles className="h-4 w-4" />
          Nova analise
        </Link>
      </div>

      {reports.length === 0 ? (
        <div
          className="rounded-2xl px-6 py-14 text-center"
          style={{ background: "oklch(0.155 0.015 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }}
        >
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-muted-foreground opacity-40" />
          <p className="font-serif text-lg text-muted-foreground">Nenhum relatorio ainda</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Gere sua primeira{" "}
            <Link href="/reports" className="text-primary">analise de sensibilidade</Link>
            {" "}para comecar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <ReportHistoryCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  )
}

import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ReportDisplay } from "@/components/reports/report-display"
import { ReportDetailActions } from "@/components/reports/report-detail-actions"
import { LocalTime } from "@/components/local-time"
import type { Report } from "@/lib/validations/report"

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return null

  const report = await prisma.report.findUnique({
    where: { id, userId: session.user.id },
  })

  if (!report) notFound()

  const content = report.content as unknown as Report

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link href="/reports/history">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <ReportDetailActions reportId={report.id} />
      </div>

      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Analise de Sensibilidade
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <LocalTime date={report.createdAt} fmt="d 'de' MMM, HH:mm" />
        </p>
      </div>

      <ReportDisplay report={content} />
    </div>
  )
}

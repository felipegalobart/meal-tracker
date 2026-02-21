"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { deleteReport } from "@/app/(app)/reports/actions"
import { toast } from "sonner"

export function ReportDetailActions({ reportId }: { reportId: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm("Excluir este relatório?")) return
    try {
      await deleteReport(reportId)
      toast.success("Relatório excluído")
      router.push("/reports/history")
    } catch {
      toast.error("Falha ao excluir relatório")
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors"
      style={{ color: "oklch(0.60 0.095 22)" }}
    >
      <Trash2 className="h-4 w-4" />
      Excluir
    </button>
  )
}

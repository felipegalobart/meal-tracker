import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SymptomCard } from "@/components/symptoms/symptom-card"
import { Plus } from "lucide-react"

export default async function SymptomsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const symptoms = await prisma.symptom.findMany({
    where: { userId: session.user.id },
    orderBy: { loggedAt: "desc" },
    take: 50,
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Sintomas</h1>
        <Link
          href="/symptoms/new"
          className="flex h-9 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold transition-all active:scale-[0.97]"
          style={{ background: "oklch(0.74 0.110 54)", color: "oklch(0.115 0.014 54)" }}
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </Link>
      </div>

      {symptoms.length === 0 ? (
        <div
          className="rounded-2xl px-6 py-14 text-center"
          style={{ background: "oklch(0.155 0.015 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }}
        >
          <p className="font-serif text-lg text-muted-foreground">Nenhum sintoma ainda</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Toque em <span className="text-primary">Adicionar</span> para registrar um sintoma.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {symptoms.map((symptom) => (
            <SymptomCard key={symptom.id} symptom={symptom} />
          ))}
        </div>
      )}
    </div>
  )
}

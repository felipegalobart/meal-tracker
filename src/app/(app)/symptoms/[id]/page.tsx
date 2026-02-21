import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SymptomCard } from "@/components/symptoms/symptom-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function SymptomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return null

  const symptom = await prisma.symptom.findUnique({
    where: { id, userId: session.user.id },
  })

  if (!symptom) notFound()

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="gap-1.5">
        <Link href="/symptoms">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <SymptomCard symptom={symptom} />
    </div>
  )
}

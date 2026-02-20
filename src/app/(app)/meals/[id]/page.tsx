import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { MealCard } from "@/components/meals/meal-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function MealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return null

  const meal = await prisma.meal.findUnique({
    where: { id, userId: session.user.id },
  })

  if (!meal) notFound()

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="gap-1.5">
        <Link href="/meals">
          <ArrowLeft className="h-4 w-4" />
          Back to Meals
        </Link>
      </Button>
      <MealCard meal={meal} />
    </div>
  )
}

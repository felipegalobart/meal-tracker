import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { MealForm } from "@/components/meals/meal-form"

export default async function EditMealPage({
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
    <div className="space-y-5">
      <h1 className="font-serif text-2xl font-semibold text-foreground">Editar Refeição</h1>
      <MealForm meal={meal} />
    </div>
  )
}

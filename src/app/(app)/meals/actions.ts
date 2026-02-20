"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { mealSchema } from "@/lib/validations/meal"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createMeal(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const parsed = mealSchema.safeParse({
    name: formData.get("name"),
    mealType: formData.get("mealType"),
    ingredients: JSON.parse((formData.get("ingredients") as string) || "[]"),
    notes: formData.get("notes") || undefined,
    loggedAt: formData.get("loggedAt"),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  await prisma.meal.create({
    data: {
      ...parsed.data,
      userId: session.user.id,
    },
  })

  revalidatePath("/meals")
  revalidatePath("/")
  revalidatePath("/timeline")
  redirect("/meals")
}

export async function updateMeal(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const parsed = mealSchema.safeParse({
    name: formData.get("name"),
    mealType: formData.get("mealType"),
    ingredients: JSON.parse((formData.get("ingredients") as string) || "[]"),
    notes: formData.get("notes") || undefined,
    loggedAt: formData.get("loggedAt"),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  await prisma.meal.update({
    where: { id, userId: session.user.id },
    data: parsed.data,
  })

  revalidatePath("/meals")
  revalidatePath(`/meals/${id}`)
  revalidatePath("/")
  revalidatePath("/timeline")
  redirect(`/meals/${id}`)
}

export async function deleteMeal(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.meal.delete({
    where: { id, userId: session.user.id },
  })

  revalidatePath("/meals")
  revalidatePath("/")
  revalidatePath("/timeline")
}

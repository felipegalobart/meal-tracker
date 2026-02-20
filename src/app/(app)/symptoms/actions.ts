"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { symptomSchema } from "@/lib/validations/symptom"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createSymptom(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const parsed = symptomSchema.safeParse({
    name: formData.get("name"),
    severity: Number(formData.get("severity")),
    notes: formData.get("notes") || undefined,
    loggedAt: formData.get("loggedAt"),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  await prisma.symptom.create({
    data: {
      ...parsed.data,
      userId: session.user.id,
    },
  })

  revalidatePath("/symptoms")
  revalidatePath("/")
  revalidatePath("/timeline")
  redirect("/symptoms")
}

export async function deleteSymptom(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.symptom.delete({
    where: { id, userId: session.user.id },
  })

  revalidatePath("/symptoms")
  revalidatePath("/")
  revalidatePath("/timeline")
}

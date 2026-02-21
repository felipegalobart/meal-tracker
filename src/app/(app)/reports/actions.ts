"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { Report } from "@/lib/validations/report"

export async function saveReport(content: Report) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const report = await prisma.report.create({
    data: {
      userId: session.user.id,
      content: JSON.parse(JSON.stringify(content)),
    },
  })

  revalidatePath("/reports/history")
  return report.id
}

export async function deleteReport(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.report.delete({
    where: { id, userId: session.user.id },
  })

  revalidatePath("/reports/history")
}

"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"
import { headers } from "next/headers"

export async function loginAction(_: string, formData: FormData): Promise<string> {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? ""
  const proto = h.get("x-forwarded-proto") ?? "http"
  const redirectTo = host ? `${proto}://${host}/` : "/"

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo,
    })
    return ""
  } catch (error) {
    if (error instanceof AuthError) {
      return "E-mail ou senha inválidos"
    }
    throw error // re-throws NEXT_REDIRECT on success
  }
}

"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function loginAction(_: string, formData: FormData): Promise<string> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    })
    return ""
  } catch (error) {
    if (error instanceof AuthError) {
      return "E-mail ou senha inválidos"
    }
    throw error // re-throws NEXT_REDIRECT on success
  }
}

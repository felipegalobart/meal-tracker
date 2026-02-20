"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"
import { verifyTurnstile } from "@/lib/turnstile"

export async function loginAction(_: string, formData: FormData): Promise<string> {
  const turnstileToken = formData.get("turnstileToken") as string
  const valid = await verifyTurnstile(turnstileToken ?? "")
  if (!valid) {
    return "Verificação de segurança falhou. Tente novamente."
  }

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

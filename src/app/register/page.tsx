"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const fieldClass = "w-full rounded-xl px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground"
const fieldStyle = { background: "oklch(0.19 0.015 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }
const fieldFocusStyle = { outline: "none", boxShadow: "0 0 0 2px oklch(0.74 0.110 54 / 35%)" }

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setLoading(false)
      return
    }

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Conta criada, mas o login falhou. Tente entrar manualmente.")
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-6">
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.74 0.110 54 / 15%), transparent)" }}
      />

      <div className="relative w-full max-w-sm space-y-8">
        <div className="text-center">
          <img src="/logo.png" alt="Meal Tracker" className="mx-auto mb-5 h-14 w-14 rounded-2xl" />
          <h1 className="font-serif text-3xl font-semibold text-foreground">Comece seu diário</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Crie sua conta no Meal Tracker</p>
        </div>

        <div
          className="space-y-4 rounded-2xl p-6"
          style={{ background: "oklch(0.155 0.015 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }}
        >
          {error && (
            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{ background: "oklch(0.60 0.095 22 / 12%)", color: "oklch(0.75 0.095 22)", border: "1px solid oklch(0.60 0.095 22 / 30%)" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Seu nome
              </label>
              <input
                name="name"
                type="text"
                placeholder="Ana"
                required
                autoComplete="name"
                className={fieldClass}
                style={fieldStyle}
                onFocus={(e) => Object.assign(e.target.style, fieldFocusStyle)}
                onBlur={(e) => { e.target.style.boxShadow = "none" }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                E-mail
              </label>
              <input
                name="email"
                type="email"
                placeholder="voce@exemplo.com"
                required
                autoComplete="email"
                className={fieldClass}
                style={fieldStyle}
                onFocus={(e) => Object.assign(e.target.style, fieldFocusStyle)}
                onBlur={(e) => { e.target.style.boxShadow = "none" }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Senha
              </label>
              <input
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                autoComplete="new-password"
                className={fieldClass}
                style={fieldStyle}
                onFocus={(e) => Object.assign(e.target.style, fieldFocusStyle)}
                onBlur={(e) => { e.target.style.boxShadow = "none" }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Confirmar senha
              </label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Repita a senha"
                required
                minLength={6}
                autoComplete="new-password"
                className={fieldClass}
                style={fieldStyle}
                onFocus={(e) => Object.assign(e.target.style, fieldFocusStyle)}
                onBlur={(e) => { e.target.style.boxShadow = "none" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-60"
              style={{ background: "oklch(0.74 0.110 54)", color: "oklch(0.115 0.014 54)" }}
            >
              {loading ? "Criando conta…" : "Criar conta"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}

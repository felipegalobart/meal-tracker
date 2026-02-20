"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const fieldClass = "w-full rounded-xl px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground"
const fieldStyle = { background: "oklch(0.19 0.015 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }
const fieldFocusStyle = { outline: "none", boxShadow: "0 0 0 2px oklch(0.74 0.110 54 / 35%)" }

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("E-mail ou senha inválidos")
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
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <svg width="24" height="24" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1C7 1 4 3.5 4 6.5C4 8.16 5.34 9.5 7 9.5C8.66 9.5 10 8.16 10 6.5C10 3.5 7 1 7 1Z" fill="currentColor" fillOpacity="0.9" style={{ color: "oklch(0.115 0.014 54)" }}/>
              <path d="M5.5 10V13M7 10V13M8.5 10V13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" style={{ color: "oklch(0.115 0.014 54)" }}/>
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">Bem-vindo de volta</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Entre no seu Meal Tracker</p>
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
                placeholder="••••••••"
                required
                autoComplete="current-password"
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
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
            Criar uma
          </Link>
        </p>
      </div>
    </div>
  )
}

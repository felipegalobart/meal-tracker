"use client"

import { useActionState } from "react"
import Link from "next/link"
import { loginAction } from "./actions"

const fieldClass = "w-full rounded-xl px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground"
const fieldStyle = { background: "oklch(0.19 0.015 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }
const fieldFocusStyle = { outline: "none", boxShadow: "0 0 0 2px oklch(0.74 0.110 54 / 35%)" }

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, "")

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-6">
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.74 0.110 54 / 15%), transparent)" }}
      />

      <div className="relative w-full max-w-sm space-y-8">
        <div className="text-center">
          <img src="/logo.png" alt="Meal Tracker" className="mx-auto mb-5 h-28 w-28 rounded-2xl" />
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

          <form action={formAction} className="space-y-4">
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
              disabled={pending}
              className="mt-2 h-12 w-full rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-60"
              style={{ background: "oklch(0.74 0.110 54)", color: "oklch(0.115 0.014 54)" }}
            >
              {pending ? "Entrando…" : "Entrar"}
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

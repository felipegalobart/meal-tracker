"use client"

import { useState, useRef } from "react"

const fieldClass = "w-full rounded-xl px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground"
const fieldStyle = { background: "oklch(0.19 0.015 52)", border: "1px solid oklch(0.28 0.018 54 / 55%)" }
const fieldFocusStyle = { outline: "none", boxShadow: "0 0 0 2px oklch(0.74 0.110 54 / 35%)" }

export default function CreateUserPage() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSuccess(false)
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
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    setSuccess(true)
    formRef.current?.reset()
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Criar novo usuário</h1>
        <p className="mt-1 text-sm text-muted-foreground">Adicione uma nova conta ao Meal Tracker.</p>
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

        {success && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{ background: "oklch(0.74 0.110 54 / 12%)", color: "oklch(0.74 0.110 54)", border: "1px solid oklch(0.74 0.110 54 / 30%)" }}
          >
            Usuário criado com sucesso.
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Nome
            </label>
            <input
              name="name"
              type="text"
              placeholder="Ana"
              required
              autoComplete="off"
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
              autoComplete="off"
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
            {loading ? "Criando…" : "Criar usuário"}
          </button>
        </form>
      </div>
    </main>
  )
}

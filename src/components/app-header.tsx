import { auth } from "@/lib/auth"
import { UserMenu } from "@/components/auth/user-menu"

export async function AppHeader() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 pt-[env(safe-area-inset-top)]" style={{ background: "oklch(0.115 0.014 54)" }}>
      <div className="flex h-14 items-center justify-between px-5">
        {/* Brand mark */}
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Meal Tracker" className="h-7 w-7 rounded-lg" />
          <span className="font-serif text-[17px] font-semibold tracking-tight text-foreground">
            Meal Tracker
          </span>
        </div>

        {session?.user && (
          <UserMenu name={session.user.name} />
        )}
      </div>
      {/* Amber-tinted separator */}
      <div className="h-px" style={{ background: "linear-gradient(to right, transparent, oklch(0.74 0.110 54 / 20%), transparent)" }} />
    </header>
  )
}

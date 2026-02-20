import { auth } from "@/lib/auth"
import { UserMenu } from "@/components/auth/user-menu"

export async function AppHeader() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
      <div
        className="flex h-14 items-center justify-between px-5"
        style={{ background: "oklch(0.115 0.014 54 / 95%)", backdropFilter: "blur(12px)" }}
      >
        {/* Brand mark */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1C7 1 4 3.5 4 6.5C4 8.16 5.34 9.5 7 9.5C8.66 9.5 10 8.16 10 6.5C10 3.5 7 1 7 1Z" fill="currentColor" fillOpacity="0.9"/>
              <path d="M5.5 10V13M7 10V13M8.5 10V13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
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

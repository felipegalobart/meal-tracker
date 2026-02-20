# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # Run ESLint
```

No test framework is configured; TypeScript provides compile-time checking via `npm run build`.

## Architecture

**Meal Tracker** is a mobile-first PWA for logging meals and symptoms. Built with Next.js 15 App Router, PostgreSQL (Prisma ORM), NextAuth v5 (JWT/credentials), Tailwind CSS v4, and shadcn/ui (New York style).

### Route Structure

```
/                   → Root layout (providers, metadata)
/(app)/             → Protected group layout (header + bottom nav)
  /                 → Dashboard
  /meals            → Meals list
  /meals/new        → Create meal
  /meals/[id]       → Meal detail
  /symptoms         → Symptoms list
  /symptoms/new     → Create symptom
  /symptoms/[id]    → Symptom detail
  /timeline         → Combined chronological view
/login              → Public
/register           → Public
/api/auth/[...nextauth]  → NextAuth handler
/api/auth/register       → Registration endpoint
```

Middleware (`src/middleware.ts`) protects all routes except `/login`, `/register`, `/api/auth/*`, and static assets.

### Data Flow

- **Server Components** (default): fetch data directly from Prisma — no API layer needed
- **Server Actions** (`actions.ts` files): handle mutations (`createMeal`, `deleteMeal`, `createSymptom`, `deleteSymptom`), always verify `session?.user?.id`, call `revalidatePath()` after changes
- **Client Components** (`"use client"`): login/register pages, interactive forms with local state
- **No global client state**: authentication via NextAuth `SessionProvider`; no Redux/Zustand

### Database (Prisma)

Schema at `prisma/schema.prisma`. Three models: `User`, `Meal`, `Symptom`. All have CUID primary keys. Meal and Symptom cascade-delete with User.

- `Meal.mealType`: enum `BREAKFAST | LUNCH | DINNER | SNACK | OTHER`
- `Meal.ingredients`: string array
- `Symptom.severity`: integer 1–5
- Both models index on `(userId, loggedAt)` and `(loggedAt)` for time-based queries

Run migrations with `npx prisma migrate dev`. Generate client with `npx prisma generate`.

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | NextAuth config (JWT strategy, bcrypt credential validation) |
| `src/lib/prisma.ts` | Singleton Prisma client |
| `src/middleware.ts` | Route protection |
| `src/lib/validations/meal.ts` | Zod schema for meal input |
| `src/lib/validations/symptom.ts` | Zod schema for symptom input (severity 1–5) |
| `src/lib/utils.ts` | `cn()` helper (clsx + tailwind-merge) |
| `src/types/next-auth.d.ts` | Session type augmentation (adds `user.id`) |

### Environment Variables

```
DATABASE_URL       # PostgreSQL connection string
NEXTAUTH_SECRET    # JWT signing secret
```

### UI Patterns

- shadcn/ui components live in `src/components/ui/` — use `cn()` from `src/lib/utils.ts` for className composition
- Forms use HTML `FormData` submitted to server actions
- PWA-aware layout: `pt-[env(safe-area-inset-top)]` on header, `pb-[env(safe-area-inset-bottom)]` on bottom nav
- Toasts via Sonner (`src/components/ui/sonner.tsx`)
- Path alias `@/*` maps to `src/*`

# Meal Tracker

**Find out what's hurting you.**

I've been dealing with digestive issues for years — unpredictable bowel habits, bloating that makes my belly feel like it's going to explode, gas that comes and goes with no obvious pattern, and a chronic anal rash since 2014 that no doctor has been able to fully explain. I've done the tests. I'm not lactose intolerant. I'm not gluten intolerant. But something in what I eat is causing these problems.

So I built this app to find out what.

---

## What this does

Meal Tracker is a personal food diary and symptom logger with AI-powered pattern detection. The idea is simple:

1. **Log everything you eat** — meals, snacks, ingredients, timing
2. **Log every symptom** — type, severity, when it happened
3. **Let AI connect the dots** — after enough data, the AI analyzes temporal correlations between specific foods and symptoms

The AI report doesn't give generic nutrition advice. It acts as a food sensitivity analyst — tracking which ingredients appear before your worst symptoms, identifying FODMAP triggers, histamine-rich foods, and common GI irritants, then suggesting concrete elimination experiments.

---

## The AI Analysis

After logging meals and symptoms for a period (ideally 2-4 weeks), the AI generates a structured report with:

- **Suspect Foods** — ranked ingredients with suspicion levels and evidence from your data
- **Temporal Correlations** — "12 hours after eating X, you reported Y at severity 4/5"
- **Symptom Clusters** — patterns grouped by body system (motility, gas/bloating, skin)
- **Elimination Experiments** — "try removing dairy proteins for 2 weeks and track changes"
- **Data Quality** — tells you if you need more data points and what gaps to fill

It understands that negative intolerance tests don't rule out everything — dairy proteins (casein, whey) and wheat ATIs can still cause issues independently of lactose or gluten.

Powered by **Gemini 2.5 Flash** via the Vercel AI SDK.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth v5 (JWT) |
| AI | Gemini 2.5 Flash + Vercel AI SDK (`generateObject`) |
| Deployment | Docker on self-hosted homelab |

---

## Design

Dark editorial theme. No light mode. Built for mobile-first use — you log meals from your phone right after eating.

- Warm charcoal background with amber accents
- Playfair Display serif headings, Nunito sans body text
- Color-coded cards: gold for breakfast, sage for lunch, indigo for dinner, rose for snacks
- Symptom severity from sage (1) to red (5)
- PWA-ready with safe area insets

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- A Google AI API key (for Gemini reports)

### Setup

```bash
npm install
```

Create `.env.local`:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/mealtracker"
NEXTAUTH_SECRET="your-secret"
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-key"
```

```bash
npx prisma migrate dev
npm run dev
```

### Docker

The project includes a Docker setup for self-hosted deployment with automatic CI/CD via GitHub webhooks.

```bash
docker compose up -d
```

---

## Project Structure

```
src/
  app/
    (app)/          # Protected routes (dashboard, meals, symptoms, timeline, reports)
    api/reports/    # AI analysis endpoint
    login/          # Public auth pages
    register/
  components/
    meals/          # Meal form, cards
    symptoms/       # Symptom form, cards, severity selector
    ui/             # shadcn/ui components
  lib/
    auth.ts         # NextAuth config
    prisma.ts       # Database client
    validations/    # Zod schemas (meal, symptom, report)
  middleware.ts     # Route protection
prisma/
  schema.prisma     # User, Meal, Symptom models
```

---

## Why not just use an app from the store?

Because none of them do what I need. Most food diary apps focus on calories and macros. I don't care about calories. I care about which specific ingredient is making my gut react. I need an AI that looks at timing patterns, cross-references ingredients across meals, and tells me "every time you eat X, you report Y within 12 hours." That's what this does.

---

*Built out of necessity. If you're dealing with similar issues, feel free to fork and adapt.*

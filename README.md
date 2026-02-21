# 🍽️ Meal Tracker

**Find out what's hurting you.**

A personal food diary and symptom logger with AI-powered pattern detection. Track what you eat, log how you feel, and let AI connect the dots.

> Built for people who've done the tests, gotten normal results, but *know* something in their diet is causing problems.

---

## ✨ How It Works

1. 📝 **Log everything you eat** — meals, snacks, ingredients, timing
2. 🩺 **Log every symptom** — type, severity, when it happened
3. 🤖 **Let AI find the patterns** — after enough data, the AI analyzes temporal correlations between specific foods and your symptoms

---

## 🧠 AI-Powered Analysis

After logging meals and symptoms for a period (ideally 2–4 weeks), the AI generates a structured report:

| Section | What it does |
|---------|-------------|
| 🔍 **Suspect Foods** | Ranked ingredients with suspicion levels and evidence from your data |
| ⏱️ **Temporal Correlations** | *"12h after eating X, you reported Y at severity 4/5"* |
| 📊 **Symptom Clusters** | Patterns grouped by body system (motility, gas/bloating, skin, etc.) |
| 🧪 **Elimination Experiments** | *"Try removing dairy proteins for 2 weeks and track changes"* |
| 📈 **Data Quality** | Tells you if you need more data and what gaps to fill |

The analysis understands that negative intolerance tests don't rule out everything — dairy proteins (casein, whey) and wheat ATIs can still cause issues independently of lactose or gluten.

Powered by **Gemini 2.5 Flash** via the Vercel AI SDK.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| ⚡ Framework | Next.js 15 (App Router, Server Components) |
| 📘 Language | TypeScript |
| 🎨 Styling | Tailwind CSS v4 + shadcn/ui |
| 🗄️ Database | PostgreSQL via Prisma ORM |
| 🔐 Auth | NextAuth v5 (JWT) |
| 🤖 AI | Gemini 2.5 Flash + Vercel AI SDK (`generateObject`) |
| 🐳 Deployment | Docker on self-hosted homelab |

---

## 🎨 Design

Dark editorial theme. No light mode. Mobile-first — log meals from your phone right after eating.

- 🌑 Warm charcoal background with amber accents
- ✍️ Playfair Display serif headings, Nunito sans body
- 🎨 Color-coded cards: gold (breakfast), sage (lunch), indigo (dinner), rose (snacks)
- 🔴 Symptom severity gradient from sage (1) to red (5)
- 📱 PWA-ready with safe area insets

---

## 🚀 Getting Started

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

### 🐳 Docker

The project includes a Docker setup for self-hosted deployment with automatic CI/CD via GitHub webhooks.

```bash
docker compose up -d
```

---

## 📁 Project Structure

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
    reports/        # Report display, history cards
    ui/             # shadcn/ui components
  lib/
    auth.ts         # NextAuth config
    prisma.ts       # Database client
    validations/    # Zod schemas (meal, symptom, report)
  middleware.ts     # Route protection
prisma/
  schema.prisma     # User, Meal, Symptom, Report models
```

---

## 💡 Why not just use an app from the store?

Most food diary apps focus on calories and macros. This one doesn't care about calories — it cares about **which specific ingredient is making your gut react**. It uses AI to look at timing patterns, cross-reference ingredients across meals, and tell you *"every time you eat X, you report Y within 12 hours."*

---

*Built out of necessity. If you're dealing with similar issues, feel free to fork and adapt.* 🍴

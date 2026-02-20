# Meal Tracker 🥗

Welcome to **Meal Tracker**, a mobile-first Progressive Web App (PWA) designed for logging meals and tracking symptoms. Built with modern web technologies and optimized for both mobile and desktop experiences, this project is an excellent example of a full‑stack Next.js application with TypeScript, Tailwind CSS, Prisma, and NextAuth.

---

## 🚀 Project Overview

Users can:

- Record meals with type, time, and ingredients
- Log symptoms and rate their severity
- View lists of meals and symptoms
- Browse a chronological timeline combining all entries
- Easily add or delete records

Authentication uses credentials (email/password) or JSON Web Tokens via **NextAuth v5**, and the application secures routes through middleware.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui components |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth v5 (JWT strategy) |
| State | No global client state; server actions handle mutations |
| Toasts | Sonner |

---

## 📁 Architecture & Key Files

- `src/app` – main routes and layouts
  - `/login`, `/register`, protected app group under `(app)`
  - Data fetched via server components; mutations via `actions.ts` files
- `src/components` – UI elements, organized by feature
- `src/lib` – helpers: `auth.ts`, `prisma.ts`, `utils.ts`, validations
- `src/middleware.ts` – route protection logic
- `prisma/schema.prisma` – database models

Refer to `CLAUDE.md` (in repo root) for a complete architecture overview.

---

## 🏗️ Getting Started

### Prerequisites

- Node.js 18+ or compatible
- PostgreSQL database (local or hosted)
- `npm`, `yarn`, or `pnpm` for package management

### Local Setup

1. **Install dependencies**

   ```bash
   npm install
   # or yarn
   # or pnpm install
   ```

2. **Configure environment**

   Create a `.env.local` file at the project root:

   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/mealtracker"
   NEXTAUTH_SECRET="some-long-random-string"
   ```

3. **Migrate database**

   ```bash
   npx prisma migrate dev --name init
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000).

### Prisma & Database

- Schema located at `prisma/schema.prisma`
- Models: `User`, `Meal`, `Symptom`
- Use `npx prisma studio` to explore data visually.

### Deployment

The app is ready for deployment to platforms like **Vercel**, **Netlify**, or any Node environment. Build with:

```bash
npm run build
npm run start
```

Remember to set the corresponding environment variables in your deployment.

---

## 📘 Usage

- Register a new account or login with existing credentials.
- Navigate the bottom tab bar (protected routes) to view meals, symptoms, or timeline.
- Add entries via the "New" buttons.
- Delete items using the trash icon on individual cards.

---

## ✨ Contributions

Contributions are welcome! Feel free to open issues or pull requests. Please follow the existing code style and keep TypeScript strict.

---

## 📝 License

This repository is open source. Specify a license here if applicable (e.g., MIT).

---

*Made with ❤️ using Next.js and Tailwind CSS.*

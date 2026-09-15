# PadelDNA

Know your game. Build your DNA.

PadelDNA helps padel players understand their playing identity, track
development over time, analyze match performance, and get targeted training
recommendations.

## Status

Built in phases; see [PHASES.md](./PHASES.md) for what's live and what's next.
Currently: **Phase 1 — Architecture, database design, application shell.**

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- React Router
- Supabase (Postgres + Auth) — schema defined, not yet connected
- Recharts (for progress/trend charts, from Phase 5 onward)

## Getting started

```bash
npm install
npm run dev
```

The app runs entirely on local seed data until Supabase is connected — no
backend is required to browse it.

### Connecting Supabase (optional, for later phases)

1. Create a project at [supabase.com](https://supabase.com).
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in the SQL editor (or
   `supabase db push`) to create tables, RLS policies, and triggers.
3. Copy `.env.example` to `.env` and fill in your project's URL and anon key:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart the dev server. `src/lib/supabase.ts` picks the env vars up
   automatically — no code changes needed.

Never commit a real `.env` file or a service-role key. `.env` is already
git-ignored.

## Project structure

```
src/
  components/   Reusable UI (Button, state views, charts, ...)
  pages/        Route-level page components
  layouts/      PublicLayout (marketing/auth), AppLayout (authenticated app)
  features/     Feature-specific logic as it's built (DNA, matches, ...)
  services/     Data-access layer — talks to Supabase or falls back to seed data
  lib/          Supabase client, navigation config, shared config
  hooks/        Shared React hooks
  types/        TypeScript types, mirroring supabase/schema.sql
  utils/        Pure helper functions
supabase/
  schema.sql    Full Postgres schema + RLS policies (run manually — see above)
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — serve the production build locally

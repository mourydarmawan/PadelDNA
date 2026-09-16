# PadelDNA

Know your game. Build your DNA.

PadelDNA helps padel players understand their playing identity, track
development over time, analyze match performance, and get targeted training
recommendations.

## Status

Built in phases; see [PHASES.md](./PHASES.md) for what's live and what's next.
Currently: **Phase 2 — Authentication, player profile, dashboard, My DNA,
Trading Card.**

## Demo login

There's no real backend yet. On `/login`, either:
- Click **"Continue with demo account"** to sign straight in, or
- Enter any email + a 6+ character password

Both log you into the same seeded player (Moury Darmawan). `/register`
works the same way — it signs you in with the name you entered, still on
top of the demo player's DNA/match data. Real, separate accounts arrive
once Supabase Auth is connected (see below); the swap only touches
`src/services/authService.ts`, nothing else.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- React Router (with auth-aware route guards)
- Supabase (Postgres + Auth) — schema defined, not yet connected
- Recharts (for progress/trend charts, from Phase 5 onward)

## Getting started

```bash
npm install
npm run dev
```

The app runs entirely on local seed data and local/demo auth until Supabase
is connected — no backend is required to browse it.

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
5. Auth still needs one more step even then: implement a `SupabaseAuthService`
   that satisfies the `AuthService` interface in `src/services/authService.ts`
   and swap the `authService` export. No page or context needs to change.

Never commit a real `.env` file or a service-role key. `.env` is already
git-ignored.

## Project structure

```
src/
  components/
    auth/       ProtectedRoute, RedirectIfAuthenticated
    charts/     DnaRadar (reused by My DNA and the Trading Card)
    dna/        TradingCard
    ui/         Button, TextField, Panel, state views
  context/      AuthContext — session state + the signed-in player's Profile/DNA
  pages/        Route-level page components
  layouts/      PublicLayout (marketing), AuthLayout (login/register), AppLayout (authenticated app)
  data/         demoPlayer.ts — the single seed-data source every page reads from
  services/     authService.ts (swappable auth), Supabase-backed services land here later
  lib/          Supabase client, navigation config, DNA scoring math, display labels
  hooks/        Shared React hooks
  types/        TypeScript types — database.ts mirrors supabase/schema.sql, auth.ts is auth-only
  utils/        Pure helper functions
supabase/
  schema.sql    Full Postgres schema + RLS policies (run manually — see above)
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — serve the production build locally
- `npx oxlint` — lint

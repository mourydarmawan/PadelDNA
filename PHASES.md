# PadelDNA — build phases

Work proceeds one phase at a time; each phase ends with a build/type-check
pass and a summary before moving on.

- [x] **Phase 1 — Repository inspection, architecture, database design,
      application shell.** Vite + React + TS scaffold, Tailwind design
      system, full Supabase schema (`supabase/schema.sql`, unconnected),
      TypeScript types, route tree with placeholders for every nav item,
      polished landing page.
- [x] **Phase 2 — Authentication, profile, navigation.** Local/demo auth
      behind a swappable `AuthService` interface, protected routes,
      editable Player Profile, functional Dashboard and My DNA pages, the
      PadelDNA Trading Card component, full authenticated app shell
      (sidebar + mobile header/bottom nav + logout). Assessment, Matches,
      Analysis, Training, Partners, Community remain polished placeholders.
      Only one demo account exists — see README for details.
- [x] **Phase 3 — PadelDNA assessment, scoring engine.** 25-question
      assessment (5 per category, one at a time, progress/back/next/
      validation), scoring engine (`src/lib/dna.ts`), `playerService`
      computing a fresh `PlayerDNA` from answers, inline results view
      reusing the DNA radar and Trading Card. Dashboard/My DNA/Trading
      Card all update automatically since they read DNA from
      `AuthContext`, which the assessment now writes to.
- [ ] **Phase 4 — Match logging, match metrics, match analysis.** Match
      CRUD with optional performance metrics, derived stats (win rate,
      winner/error ratio, efficiency), plain-language interpretation.
- [ ] **Phase 5 — Dashboard, progress, training recommendations.**
      Real-data performance dashboard, progress/trend charts, rule-based
      training recommendation engine (architected to swap in an AI engine
      later without a rewrite).
- [ ] **Phase 6 — Partners, community.** Partner profiles + basic
      compatibility view, player list/search, public DNA summaries.
- [ ] **Phase 7 — UI polish, responsive optimization, error handling,
      security review.**
- [ ] **Phase 8 — Testing, bug fixing, production readiness.**

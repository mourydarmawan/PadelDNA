-- ============================================================================
-- PadelDNA — Supabase schema
-- ============================================================================
-- Not yet applied to a live project (no Supabase project connected as of
-- Phase 1). Run this against a fresh Supabase project with the SQL editor,
-- or via `supabase db push`, once credentials are available.
--
-- Conventions:
--   - UUID primary keys, defaulting to gen_random_uuid()
--   - created_at / updated_at on every mutable table
--   - RLS enabled on every table; owners can read/write their own rows
--   - Public read access is opt-in per table (profiles.is_public,
--     player_dna via the same flag) rather than the default
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- profiles
-- ----------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  avatar_url text,
  playing_side text check (playing_side in ('left', 'right', 'both')),
  dominant_hand text check (dominant_hand in ('left', 'right')),
  current_level text check (
    current_level in ('beginner', 'intermediate', 'advanced', 'competitive', 'professional')
  ),
  years_playing numeric(4, 1),
  preferred_position text check (preferred_position in ('left', 'right', 'both')),
  primary_style text check (
    primary_style in (
      'playmaker', 'tactical_aggressor', 'counter_puncher',
      'power_player', 'defender', 'all_rounder'
    )
  ),
  goals text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- skill_assessments — one row per submitted (or in-progress) assessment
-- ----------------------------------------------------------------------------
create table if not exists skill_assessments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'submitted')),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- skill_scores — individual 1-10 scores that make up an assessment
-- ----------------------------------------------------------------------------
create table if not exists skill_scores (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references skill_assessments (id) on delete cascade,
  category text not null check (category in ('technique', 'defense', 'tactics', 'physical', 'mental')),
  skill text not null,
  score smallint not null check (score between 1 and 10),
  created_at timestamptz not null default now(),
  unique (assessment_id, category, skill)
);

-- ----------------------------------------------------------------------------
-- player_dna — the computed, current DNA snapshot for a player
-- (denormalized from the latest submitted assessment for fast reads)
-- ----------------------------------------------------------------------------
create table if not exists player_dna (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles (id) on delete cascade,
  source_assessment_id uuid references skill_assessments (id) on delete set null,
  overall_score numeric(4, 2) not null,
  technique_score numeric(4, 2) not null,
  defense_score numeric(4, 2) not null,
  tactics_score numeric(4, 2) not null,
  physical_score numeric(4, 2) not null,
  mental_score numeric(4, 2) not null,
  archetype text,
  strengths text[] not null default '{}',
  weaknesses text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- partners — a player's recorded playing partners (not other app users)
-- ----------------------------------------------------------------------------
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  playing_side text check (playing_side in ('left', 'right', 'both')),
  dominant_hand text check (dominant_hand in ('left', 'right')),
  level text,
  style text,
  strengths text,
  weaknesses text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- matches
-- ----------------------------------------------------------------------------
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  played_on date not null,
  partner_id uuid references partners (id) on delete set null,
  opponent_names text,
  result text check (result in ('win', 'loss')),
  score text,
  player_position text check (player_position in ('left', 'right')),
  match_type text check (match_type in ('friendly', 'league', 'tournament', 'training')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- match_players — bridge table, ready for tracking all 4 players on court
-- once the app supports shared/partner accounts (V1 only populates the
-- logging player's own row)
-- ----------------------------------------------------------------------------
create table if not exists match_players (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches (id) on delete cascade,
  profile_id uuid references profiles (id) on delete cascade,
  partner_id uuid references partners (id) on delete cascade,
  team smallint not null check (team in (1, 2)),
  created_at timestamptz not null default now(),
  constraint match_players_one_side check (
    (profile_id is not null and partner_id is null) or
    (profile_id is null and partner_id is not null)
  )
);

-- ----------------------------------------------------------------------------
-- match_metrics — optional per-match performance counters
-- ----------------------------------------------------------------------------
create table if not exists match_metrics (
  match_id uuid primary key references matches (id) on delete cascade,
  winners smallint,
  forced_errors smallint,
  unforced_errors smallint,
  smash_winners smallint,
  volley_winners smallint,
  drop_winners smallint,
  lob_winners smallint,
  defensive_saves smallint,
  successful_returns smallint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- training_recommendations — output of the rule engine (Phase 5)
-- ----------------------------------------------------------------------------
create table if not exists training_recommendations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  problem text not null,
  why_it_matters text not null,
  suggested_drill text not null,
  target text not null,
  priority text not null check (priority in ('low', 'medium', 'high')),
  source text not null default 'rule_engine',
  status text not null default 'active' check (status in ('active', 'dismissed', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- progress_snapshots — periodic rollups for trend charts
-- ----------------------------------------------------------------------------
create table if not exists progress_snapshots (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  snapshot_date date not null,
  overall_dna_score numeric(4, 2),
  matches_played integer not null default 0,
  win_rate numeric(5, 2),
  created_at timestamptz not null default now(),
  unique (profile_id, snapshot_date)
);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table profiles enable row level security;
alter table skill_assessments enable row level security;
alter table skill_scores enable row level security;
alter table player_dna enable row level security;
alter table partners enable row level security;
alter table matches enable row level security;
alter table match_players enable row level security;
alter table match_metrics enable row level security;
alter table training_recommendations enable row level security;
alter table progress_snapshots enable row level security;

-- profiles: owner can do everything with their own row; anyone can read
-- rows explicitly marked public (Community module)
create policy "profiles_select_own_or_public" on profiles
  for select using (auth.uid() = id or is_public = true);
create policy "profiles_modify_own" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- player_dna: same public/private rule as the owning profile
create policy "player_dna_select_own_or_public" on player_dna
  for select using (
    auth.uid() = profile_id
    or exists (select 1 from profiles p where p.id = profile_id and p.is_public)
  );
create policy "player_dna_modify_own" on player_dna
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- everything else: strictly private to the owner
create policy "skill_assessments_owner" on skill_assessments
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "skill_scores_owner" on skill_scores
  for all using (
    exists (
      select 1 from skill_assessments a
      where a.id = assessment_id and a.profile_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from skill_assessments a
      where a.id = assessment_id and a.profile_id = auth.uid()
    )
  );

create policy "partners_owner" on partners
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "matches_owner" on matches
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "match_players_owner" on match_players
  for all using (
    exists (select 1 from matches m where m.id = match_id and m.profile_id = auth.uid())
  ) with check (
    exists (select 1 from matches m where m.id = match_id and m.profile_id = auth.uid())
  );

create policy "match_metrics_owner" on match_metrics
  for all using (
    exists (select 1 from matches m where m.id = match_id and m.profile_id = auth.uid())
  ) with check (
    exists (select 1 from matches m where m.id = match_id and m.profile_id = auth.uid())
  );

create policy "training_recommendations_owner" on training_recommendations
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "progress_snapshots_owner" on progress_snapshots
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ============================================================================
-- updated_at trigger
-- ============================================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'skill_assessments', 'player_dna', 'partners',
    'matches', 'match_metrics', 'training_recommendations'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on %I
       for each row execute function set_updated_at();', t
    );
  end loop;
end $$;

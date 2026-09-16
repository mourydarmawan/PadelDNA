import clsx from 'clsx';
import type { PlayerDNA, Profile } from '@/types/database';
import { DnaRadar } from '@/components/charts/DnaRadar';
import { categoryScoreEntries } from '@/lib/dna';
import { DOMINANT_HAND_LABELS, PLAYER_LEVEL_LABELS, PLAYING_SIDE_LABELS, SKILL_CATEGORY_LABELS } from '@/lib/labels';

interface TradingCardProps {
  profile: Profile;
  dna: PlayerDNA;
  size?: 'full' | 'compact';
  className?: string;
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function TradingCard({ profile, dna, size = 'full', className }: TradingCardProps) {
  const isCompact = size === 'compact';
  const primaryStrength = dna.strengths[0];
  const primaryWeakness = dna.weaknesses[0];
  const categories = categoryScoreEntries(dna);

  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-2xl border border-[var(--color-court-500)]/40 bg-[var(--color-ink-800)]',
        isCompact ? 'p-4' : 'p-6 sm:p-7',
        className
      )}
    >
      {/* single subtle diagonal court-line motif — consistent with landing page, not decoration piled on decoration */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.06] pointer-events-none" aria-hidden="true">
        <line x1="0%" y1="0%" x2="30%" y2="100%" stroke="var(--color-court-400)" strokeWidth="60" />
      </svg>

      <div className="relative">
        {/* header: identity */}
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              'flex items-center justify-center rounded-full bg-[var(--color-ink-700)] border border-[var(--color-ink-600)] font-display font-bold text-[var(--color-court-400)]',
              isCompact ? 'h-10 w-10 text-sm' : 'h-14 w-14 text-lg'
            )}
          >
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              initials(profile.fullName)
            )}
          </div>
          <div className="min-w-0">
            <p className={clsx('font-display font-semibold truncate', isCompact ? 'text-base' : 'text-xl')}>
              {profile.fullName}
            </p>
            <p className="text-xs uppercase tracking-wide text-[var(--color-court-400)]">
              {dna.archetype}
            </p>
          </div>
          <div className="ml-auto text-right shrink-0">
            <p className={clsx('font-display font-extrabold leading-none', isCompact ? 'text-3xl' : 'text-5xl')}>
              {dna.overallScore.toFixed(1)}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-[var(--color-mist-400)] mt-1">
              DNA score
            </p>
          </div>
        </div>

        {!isCompact ? (
          <div className="mt-6 flex justify-center">
            <DnaRadar
              points={categories.map((c) => ({ label: SKILL_CATEGORY_LABELS[c.category], value: c.value }))}
              size={260}
              showValues={false}
            />
          </div>
        ) : null}

        {/* category scores */}
        <dl className={clsx('grid grid-cols-5 gap-2', isCompact ? 'mt-4' : 'mt-6')}>
          {categories.map((c) => (
            <div key={c.category} className="text-center">
              <dt className="text-[10px] uppercase tracking-wide text-[var(--color-mist-400)] truncate">
                {SKILL_CATEGORY_LABELS[c.category].slice(0, 4)}
              </dt>
              <dd className="font-display font-semibold text-[var(--color-paper)]">{c.value.toFixed(1)}</dd>
            </div>
          ))}
        </dl>

        {/* identity chips */}
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          {profile.currentLevel ? (
            <span className="rounded-full border border-[var(--color-ink-600)] px-2.5 py-1 text-[var(--color-mist-100)]">
              {PLAYER_LEVEL_LABELS[profile.currentLevel]}
            </span>
          ) : null}
          {profile.preferredPosition ? (
            <span className="rounded-full border border-[var(--color-ink-600)] px-2.5 py-1 text-[var(--color-mist-100)]">
              {PLAYING_SIDE_LABELS[profile.preferredPosition]} side
            </span>
          ) : null}
          {profile.dominantHand ? (
            <span className="rounded-full border border-[var(--color-ink-600)] px-2.5 py-1 text-[var(--color-mist-100)]">
              {DOMINANT_HAND_LABELS[profile.dominantHand]}-handed
            </span>
          ) : null}
        </div>

        {/* strength / weakness */}
        {!isCompact ? (
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm border-t border-[var(--color-ink-700)] pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-[var(--color-mist-400)]">Primary strength</p>
              <p className="font-display font-semibold text-[var(--color-ball-500)]">{primaryStrength}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-[var(--color-mist-400)]">Primary weakness</p>
              <p className="font-display font-semibold text-[var(--color-clay-500)]">{primaryWeakness}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

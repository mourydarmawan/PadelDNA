import { useAuth } from '@/context/AuthContext';
import { Panel } from '@/components/ui/Panel';
import { DnaRadar } from '@/components/charts/DnaRadar';
import { TradingCard } from '@/components/dna/TradingCard';
import { categoryScoreEntries } from '@/lib/dna';
import { SKILL_CATEGORY_LABELS } from '@/lib/labels';

export function DnaPage() {
  const { dna } = useAuth();
  if (!dna) return null;

  const categories = categoryScoreEntries(dna);

  return (
    <div className="px-5 sm:px-8 py-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">My DNA</h1>
        <p className="mt-1 text-[var(--color-mist-300)]">Know your game.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Panel>
            <div className="flex items-center gap-6">
              <div>
                <p className="font-display text-6xl font-extrabold leading-none">{dna.overallScore.toFixed(1)}</p>
                <p className="mt-1 text-sm text-[var(--color-mist-400)] uppercase tracking-wide">Overall DNA</p>
              </div>
              <div className="h-14 w-px bg-[var(--color-ink-700)]" />
              <div>
                <p className="font-display text-2xl font-semibold text-[var(--color-court-400)]">{dna.archetype}</p>
                <p className="text-sm text-[var(--color-mist-400)]">Your archetype</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <DnaRadar
                points={categories.map((c) => ({ label: SKILL_CATEGORY_LABELS[c.category], value: c.value }))}
                size={340}
              />
            </div>
          </Panel>

          <Panel title="Category scores">
            <ul className="space-y-4">
              {categories.map((c) => (
                <li key={c.category}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium">{SKILL_CATEGORY_LABELS[c.category]}</span>
                    <span className="text-[var(--color-mist-300)]">{c.value.toFixed(1)} / 10</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-ink-700)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--color-court-500)]"
                      style={{ width: `${(c.value / 10) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <div className="grid sm:grid-cols-2 gap-6">
            <Panel title="Strengths">
              <ul className="space-y-2">
                {dna.strengths.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-[var(--color-ball-500)] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-ball-500)]" />
                    {s}
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Weaknesses">
              <ul className="space-y-2">
                {dna.weaknesses.map((w) => (
                  <li key={w} className="flex items-center gap-2 text-[var(--color-clay-500)] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-clay-500)]" />
                    {w}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>

        <TradingCardSection />
      </div>
    </div>
  );
}

function TradingCardSection() {
  const { profile, dna } = useAuth();
  if (!profile || !dna) return null;

  return (
    <div>
      <p className="text-sm font-medium text-[var(--color-mist-300)] mb-3">Trading card</p>
      <TradingCard profile={profile} dna={dna} size="full" />
    </div>
  );
}

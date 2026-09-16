import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Panel } from '@/components/ui/Panel';
import { TradingCard } from '@/components/dna/TradingCard';
import { buttonClasses } from '@/components/ui/Button';
import { demoRecentMatches, demoTrainingFocus } from '@/data/demoPlayer';
import { PLAYER_LEVEL_LABELS } from '@/lib/labels';
import { formatShortDate } from '@/utils/date';

export function DashboardPage() {
  const { profile, dna } = useAuth();

  if (!profile || !dna) return null; // ProtectedRoute guarantees a session exists

  const firstName = profile.fullName.split(' ')[0];
  const primaryStrength = dna.strengths[0];
  const primaryWeakness = dna.weaknesses[0];

  return (
    <div className="px-5 sm:px-8 py-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Good to see you, {firstName}.</h1>
        <p className="mt-1 text-[var(--color-mist-300)]">Here's where your game stands right now.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <Panel title="Level & rating">
              <p className="font-display text-2xl font-semibold">
                {profile.currentLevel ? PLAYER_LEVEL_LABELS[profile.currentLevel] : 'Not set'}
              </p>
              <p className="mt-1 text-sm text-[var(--color-mist-300)]">
                Current rating <span className="text-[var(--color-paper)] font-semibold">{profile.currentRating?.toFixed(1)}</span>
              </p>
            </Panel>

            <Panel title="PadelDNA summary">
              <div className="flex items-baseline gap-2">
                <p className="font-display text-2xl font-semibold">{dna.overallScore.toFixed(1)}</p>
                <p className="text-sm text-[var(--color-court-400)]">{dna.archetype}</p>
              </div>
              <div className="mt-2 flex gap-4 text-sm">
                <p>
                  <span className="text-[var(--color-mist-400)]">Top strength </span>
                  <span className="text-[var(--color-ball-500)] font-medium">{primaryStrength}</span>
                </p>
                <p>
                  <span className="text-[var(--color-mist-400)]">Main weakness </span>
                  <span className="text-[var(--color-clay-500)] font-medium">{primaryWeakness}</span>
                </p>
              </div>
            </Panel>
          </div>

          <Panel title="Quick actions">
            <div className="flex flex-wrap gap-3">
              <Link to="/assessment" className={buttonClasses('primary', 'md')}>
                Start Assessment
              </Link>
              <Link to="/matches" className={buttonClasses('secondary', 'md')}>
                Log Match
              </Link>
              <Link to="/dna" className={buttonClasses('secondary', 'md')}>
                View My DNA
              </Link>
            </div>
          </Panel>

          <Panel title="Recent activity">
            <ul className="divide-y divide-[var(--color-ink-700)]">
              {demoRecentMatches.map((match) => (
                <li key={match.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">vs. {match.opponentNames}</p>
                    <p className="text-sm text-[var(--color-mist-400)]">
                      {formatShortDate(match.playedOn)} · {match.score}
                    </p>
                  </div>
                  <span
                    className={
                      'text-xs font-display font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ' +
                      (match.result === 'win'
                        ? 'bg-[var(--color-court-500)]/15 text-[var(--color-court-400)]'
                        : 'bg-[var(--color-clay-500)]/15 text-[var(--color-clay-500)]')
                    }
                  >
                    {match.result}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Training focus">
            <p className="text-[var(--color-mist-100)]">{demoTrainingFocus}</p>
          </Panel>
        </div>

        <div>
          <p className="text-sm font-medium text-[var(--color-mist-300)] mb-3">Your trading card</p>
          <TradingCard profile={profile} dna={dna} size="compact" />
          <Link to="/dna" className="mt-3 inline-block text-sm text-[var(--color-court-400)] hover:underline">
            View full card on My DNA
          </Link>
        </div>
      </div>
    </div>
  );
}

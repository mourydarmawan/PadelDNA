import { Link } from 'react-router-dom';
import { buttonClasses } from '@/components/ui/Button';
import { DnaRadar } from '@/components/charts/DnaRadar';

const HERO_RADAR = [
  { label: 'Technique', value: 7.4 },
  { label: 'Defense', value: 6.1 },
  { label: 'Tactics', value: 8.2 },
  { label: 'Physical', value: 5.8 },
  { label: 'Mental', value: 7.0 },
];

const QUESTIONS = [
  {
    q: 'Who am I as a padel player?',
    a: 'A DNA profile built from real skill data, not a vague self-rating — your archetype, in your own numbers.',
  },
  {
    q: 'What are my strengths?',
    a: 'The categories where you consistently score above your own average, ranked so you know what to lean on.',
  },
  {
    q: 'What are my weaknesses?',
    a: 'The specific skills holding your overall score down — named, not hidden inside a single grade.',
  },
  {
    q: 'How do I actually perform in matches?',
    a: 'Winners, errors, and efficiency pulled from the matches you log, not from how a session felt.',
  },
  {
    q: 'What should I train next?',
    a: 'A short, prioritized list of drills targeted at your lowest-scoring skills and your match data.',
  },
];

const FLOW = ['Player', 'DNA', 'Match data', 'Analysis', 'Recommendation', 'Progress'];

export function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--color-ink-700)]">
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none opacity-60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="-5%" y1="100%" x2="55%" y2="-5%" stroke="var(--color-ink-700)" strokeWidth="1" />
        </svg>

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-5xl sm:text-6xl font-extrabold leading-[0.95] tracking-tight">
              Know your game.
              <br />
              Build your DNA.
            </h1>
            <p className="mt-6 text-lg text-[var(--color-mist-100)] max-w-md">
              PadelDNA turns your skills, matches, and habits on court into a single, honest picture
              of your game — what you're strong at, what's holding you back, and what to train next.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className={buttonClasses('primary', 'lg')}>
                Discover Your PadelDNA
              </Link>
              <Link to="/app/dashboard" className={buttonClasses('secondary', 'lg')}>
                Explore the App
              </Link>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-sm">
              <DnaRadar points={HERO_RADAR} size={380} />
            </div>
          </div>
        </div>
      </section>

      {/* Five questions */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 py-16 sm:py-24">
        <h2 className="font-display text-3xl sm:text-4xl font-bold max-w-lg">
          Every player asks the same five questions. Most never get real answers.
        </h2>
        <div className="mt-10 divide-y divide-[var(--color-ink-700)] border-t border-[var(--color-ink-700)]">
          {QUESTIONS.map((item) => (
            <div key={item.q} className="py-6 grid sm:grid-cols-2 gap-2 sm:gap-8">
              <p className="font-display text-xl font-semibold">{item.q}</p>
              <p className="text-[var(--color-mist-300)]">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Flow */}
      <section className="border-y border-[var(--color-ink-700)] bg-[var(--color-ink-950)]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-20">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            From your first match log to your next drill.
          </h2>
          <div className="mt-12 flex flex-wrap md:flex-nowrap items-center justify-center gap-y-8">
            {FLOW.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center gap-2 px-2">
                  <span className="font-display text-sm text-[var(--color-court-400)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-lg font-semibold whitespace-nowrap">{step}</span>
                </div>
                {i < FLOW.length - 1 ? (
                  <span
                    className="hidden sm:block w-10 md:w-14 h-px bg-[var(--color-ink-600)] mx-1"
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 py-20 sm:py-28 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold">
          Your game already has a shape. See it.
        </h2>
        <p className="mt-4 text-[var(--color-mist-300)] max-w-md mx-auto">
          Takes about ten minutes to build your first DNA profile — no equipment, no camera, just an
          honest read of your own game.
        </p>
        <div className="mt-8">
          <Link to="/signup" className={buttonClasses('primary', 'lg')}>
            Discover Your PadelDNA
          </Link>
        </div>
      </section>
    </div>
  );
}

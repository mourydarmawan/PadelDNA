import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ASSESSMENT_QUESTIONS } from '@/data/assessmentQuestions';
import { ANSWER_SCALE_LABELS, type AssessmentAnswers } from '@/types/assessment';
import type { PlayerDNA, Profile } from '@/types/database';
import { Button, buttonClasses } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { DnaRadar } from '@/components/charts/DnaRadar';
import { TradingCard } from '@/components/dna/TradingCard';
import { categoryScoreEntries, computeTrainingFocus } from '@/lib/dna';
import { SKILL_CATEGORY_LABELS } from '@/lib/labels';

type Step = 'intro' | 'question' | 'submitting' | 'results';

const SCALE_VALUES = [1, 2, 3, 4, 5];
const TOTAL_QUESTIONS = ASSESSMENT_QUESTIONS.length;

export function AssessmentPage() {
  const { profile, submitAssessment } = useAuth();
  const [step, setStep] = useState<Step>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [result, setResult] = useState<PlayerDNA | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!profile) return null;

  const question = ASSESSMENT_QUESTIONS[index];
  const currentAnswer = answers[question?.id ?? ''];
  const isLastQuestion = index === TOTAL_QUESTIONS - 1;

  function selectAnswer(value: number) {
    setValidationError(null);
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function goBack() {
    setValidationError(null);
    setIndex((i) => Math.max(0, i - 1));
  }

  async function goNext() {
    if (!currentAnswer) {
      setValidationError('Choose an answer before continuing.');
      return;
    }
    if (!isLastQuestion) {
      setIndex((i) => i + 1);
      return;
    }
    setStep('submitting');
    setSubmitError(null);
    try {
      const dna = await submitAssessment(answers);
      setResult(dna);
      setStep('results');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Couldn\u2019t submit your assessment. Try again.');
      setStep('question');
    }
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setResult(null);
    setValidationError(null);
    setSubmitError(null);
    setStep('intro');
  }

  if (step === 'intro') {
    return (
      <div className="px-5 sm:px-8 py-8 max-w-xl mx-auto">
        <h1 className="font-display text-3xl font-bold">PadelDNA Assessment</h1>
        <p className="mt-3 text-[var(--color-mist-300)]">
          {TOTAL_QUESTIONS} quick questions, 5 for each of Technique, Defense, Tactics, Physical, and
          Mental. Answer honestly rather than aspirationally — this is what builds your DNA.
        </p>
        <p className="mt-2 text-sm text-[var(--color-mist-400)]">Takes about 5 minutes.</p>
        <Button className="mt-8" size="lg" onClick={() => setStep('question')}>
          Start Assessment
        </Button>
      </div>
    );
  }

  if (step === 'results' && result) {
    return <AssessmentResults profile={profile} dna={result} onRetake={restart} />;
  }

  // 'question' or 'submitting'
  return (
    <div className="px-5 sm:px-8 py-8 max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-[var(--color-mist-400)] mb-2">
          <span>{SKILL_CATEGORY_LABELS[question.category]}</span>
          <span>
            Question {index + 1} of {TOTAL_QUESTIONS}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--color-ink-700)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--color-court-500)] transition-all"
            style={{ width: `${((index + 1) / TOTAL_QUESTIONS) * 100}%` }}
          />
        </div>
      </div>

      <fieldset>
        <legend className="font-display text-2xl font-semibold leading-snug">{question.prompt}</legend>

        <div role="radiogroup" aria-label={question.prompt} className="mt-6 space-y-2">
          {SCALE_VALUES.map((value) => {
            const selected = currentAnswer === value;
            return (
              <label
                key={value}
                className={
                  'flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ' +
                  (selected
                    ? 'border-[var(--color-court-400)] bg-[var(--color-court-500)]/10'
                    : 'border-[var(--color-ink-600)] hover:border-[var(--color-ink-500)]')
                }
              >
                <input
                  type="radio"
                  name={question.id}
                  value={value}
                  checked={selected}
                  onChange={() => selectAnswer(value)}
                  className="h-4 w-4 accent-[var(--color-court-500)]"
                />
                <span className="font-display font-semibold w-4">{value}</span>
                <span className="text-sm text-[var(--color-mist-100)]">{ANSWER_SCALE_LABELS[value]}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {validationError ? (
        <p role="alert" className="mt-4 text-sm text-[var(--color-clay-500)]">
          {validationError}
        </p>
      ) : null}
      {submitError ? (
        <p role="alert" className="mt-4 text-sm text-[var(--color-clay-500)]">
          {submitError}
        </p>
      ) : null}

      <div className="mt-8 flex gap-3">
        <Button variant="secondary" onClick={goBack} disabled={index === 0 || step === 'submitting'}>
          Back
        </Button>
        <Button onClick={goNext} disabled={step === 'submitting'}>
          {step === 'submitting' ? 'Submitting…' : isLastQuestion ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
}

function AssessmentResults({
  profile,
  dna,
  onRetake,
}: {
  profile: Profile;
  dna: PlayerDNA;
  onRetake: () => void;
}) {
  const categories = categoryScoreEntries(dna);
  const trainingFocus = computeTrainingFocus(dna.categoryScores);

  return (
    <div className="px-5 sm:px-8 py-8 max-w-6xl mx-auto space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-[var(--color-court-400)]">Assessment complete</p>
        <h1 className="font-display text-3xl font-bold mt-1">Here's your PadelDNA.</h1>
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
                size={320}
              />
            </div>
          </Panel>

          <Panel title="Category breakdown">
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

          <Panel title="Training focus">
            <p className="text-[var(--color-mist-100)]">{trainingFocus}</p>
          </Panel>

          <div className="flex flex-wrap gap-3">
            <Link to="/dashboard" className={buttonClasses('primary', 'md')}>
              Go to Dashboard
            </Link>
            <Link to="/dna" className={buttonClasses('secondary', 'md')}>
              View My DNA
            </Link>
            <Button variant="ghost" onClick={onRetake}>
              Retake assessment
            </Button>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-[var(--color-mist-300)] mb-3">Your trading card</p>
          <TradingCard profile={profile} dna={dna} size="full" />
        </div>
      </div>
    </div>
  );
}

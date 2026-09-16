import type { PlayerDNA, SkillCategory } from '@/types/database';
import { SKILL_CATEGORY_LABELS } from '@/lib/labels';

export const CATEGORY_ORDER: SkillCategory[] = ['technique', 'defense', 'tactics', 'physical', 'mental'];

/**
 * Overall DNA score is always the average of the five category scores,
 * rounded to one decimal. There is exactly one place this calculation
 * happens — nothing should hardcode an overall score separately.
 */
export function computeOverallDnaScore(categoryScores: Record<SkillCategory, number>): number {
  const total = CATEGORY_ORDER.reduce((sum, category) => sum + categoryScores[category], 0);
  return Math.round((total / CATEGORY_ORDER.length) * 10) / 10;
}

export function categoryScoreEntries(dna: PlayerDNA): { category: SkillCategory; label: string; value: number }[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    label: category,
    value: dna.categoryScores[category],
  }));
}

/** Highest-scoring category, used for "top strength" summaries. */
export function topCategory(categoryScores: Record<SkillCategory, number>): SkillCategory {
  return CATEGORY_ORDER.reduce((best, category) =>
    categoryScores[category] > categoryScores[best] ? category : best
  );
}

/** Lowest-scoring category, used for "main weakness" summaries. */
export function bottomCategory(categoryScores: Record<SkillCategory, number>): SkillCategory {
  return CATEGORY_ORDER.reduce((worst, category) =>
    categoryScores[category] < categoryScores[worst] ? category : worst
  );
}

/** All five categories, ranked strongest to weakest. */
export function rankCategoriesDesc(categoryScores: Record<SkillCategory, number>): SkillCategory[] {
  return [...CATEGORY_ORDER].sort((a, b) => categoryScores[b] - categoryScores[a]);
}

// ----------------------------------------------------------------------------
// Assessment scoring engine (Phase 3)
// ----------------------------------------------------------------------------
//
// Each category has 5 questions, answered 1-5. Per the spec, a category
// score is "normalized 0-100 from its 5 questions" — computed here exactly
// that way — then expressed on the same 0-10 scale the rest of the app
// already uses everywhere (DnaRadar's rings, PlayerDNA.categoryScores,
// the Supabase schema's numeric(4,2) columns, TradingCard's .toFixed(1)
// display). Dividing by 10 keeps that one existing scale intact instead of
// introducing a second, conflicting one across the app.

/**
 * @param answers Exactly 5 answers for one category, each 1-5.
 * @returns The category score on the app's existing 0-10 scale, one decimal.
 */
export function computeCategoryScoreFromAnswers(answers: number[]): number {
  const sum = answers.reduce((total, value) => total + value, 0); // 5-25
  const normalizedTo100 = ((sum - 5) / 20) * 100; // 0-100, per spec
  const scaledToExistingRange = normalizedTo100 / 10; // 0-10
  return Math.round(scaledToExistingRange * 10) / 10;
}

const ARCHETYPE_BY_CATEGORY: Record<SkillCategory, string> = {
  technique: 'The Technician',
  defense: 'The Wall',
  tactics: 'The Strategist',
  physical: 'The Athlete',
  mental: 'The Competitor',
};

export function computeArchetype(categoryScores: Record<SkillCategory, number>): string {
  return ARCHETYPE_BY_CATEGORY[topCategory(categoryScores)];
}

/** Top 2 categories, strongest first, as display labels for PlayerDNA.strengths. */
export function computeStrengthLabels(categoryScores: Record<SkillCategory, number>): string[] {
  return rankCategoriesDesc(categoryScores)
    .slice(0, 2)
    .map((category) => SKILL_CATEGORY_LABELS[category]);
}

/** Bottom 2 categories, weakest first, as display labels for PlayerDNA.weaknesses. */
export function computeWeaknessLabels(categoryScores: Record<SkillCategory, number>): string[] {
  return rankCategoriesDesc(categoryScores)
    .slice(-2)
    .reverse()
    .map((category) => SKILL_CATEGORY_LABELS[category]);
}

const TRAINING_FOCUS_BY_CATEGORY: Record<SkillCategory, string> = {
  technique:
    'Sharpen technical execution — dedicated reps on your shot mechanics will move the needle more than tactics work right now.',
  defense:
    'Work on defensive fundamentals — glass control and recovery position are what\u2019s costing you rallies.',
  tactics:
    'Build match-reading and shot selection — the technical tools are there, your decisions need to catch up.',
  physical:
    'Prioritize conditioning — speed and stamina are the ceiling on everything else in your game right now.',
  mental:
    'Train composure and focus — your technical and tactical game is ahead of your mental game.',
};

/** Training focus is always derived from the current lowest category — one place, one rule. */
export function computeTrainingFocus(categoryScores: Record<SkillCategory, number>): string {
  return TRAINING_FOCUS_BY_CATEGORY[bottomCategory(categoryScores)];
}

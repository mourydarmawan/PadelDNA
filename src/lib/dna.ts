import type { PlayerDNA, SkillCategory } from '@/types/database';

const CATEGORY_ORDER: SkillCategory[] = ['technique', 'defense', 'tactics', 'physical', 'mental'];

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

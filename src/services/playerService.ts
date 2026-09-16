import type { PlayerDNA, SkillCategory } from '@/types/database';
import type { AssessmentAnswers } from '@/types/assessment';
import { ASSESSMENT_QUESTIONS } from '@/data/assessmentQuestions';
import {
  CATEGORY_ORDER,
  computeArchetype,
  computeCategoryScoreFromAnswers,
  computeOverallDnaScore,
  computeStrengthLabels,
  computeWeaknessLabels,
} from '@/lib/dna';

export interface PlayerService {
  submitAssessment(profileId: string, answers: AssessmentAnswers): Promise<PlayerDNA>;
}

const FAKE_LATENCY_MS = 400;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), FAKE_LATENCY_MS));
}

/**
 * Local implementation — computes the DNA snapshot entirely client-side.
 * The Supabase version of this method will instead insert into
 * skill_assessments/skill_scores, then upsert player_dna with the same
 * computed values; AuthContext and every page calling submitAssessment
 * won't need to change.
 */
class LocalPlayerService implements PlayerService {
  async submitAssessment(profileId: string, answers: AssessmentAnswers): Promise<PlayerDNA> {
    const categoryScores = CATEGORY_ORDER.reduce((scores, category) => {
      const categoryAnswers = ASSESSMENT_QUESTIONS.filter((q) => q.category === category).map(
        (q) => answers[q.id]
      );
      scores[category] = computeCategoryScoreFromAnswers(categoryAnswers);
      return scores;
    }, {} as Record<SkillCategory, number>);

    const dna: PlayerDNA = {
      id: `dna-${profileId}-${Date.now()}`,
      profileId,
      sourceAssessmentId: null,
      overallScore: computeOverallDnaScore(categoryScores),
      categoryScores,
      archetype: computeArchetype(categoryScores),
      strengths: computeStrengthLabels(categoryScores),
      weaknesses: computeWeaknessLabels(categoryScores),
      updatedAt: new Date().toISOString(),
    };

    return delay(dna);
  }
}

export const playerService: PlayerService = new LocalPlayerService();

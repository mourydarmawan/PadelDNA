import type { SkillCategory } from './database';

export interface AssessmentQuestion {
  id: string;
  category: SkillCategory;
  prompt: string;
}

/** questionId -> answer, 1-5 */
export type AssessmentAnswers = Record<string, number>;

export const ANSWER_SCALE_LABELS: Record<number, string> = {
  1: 'Rarely',
  2: 'Sometimes',
  3: 'Often',
  4: 'Usually',
  5: 'Almost always',
};

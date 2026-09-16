// Types mirror `supabase/schema.sql`. Once Supabase is connected, these can
// be replaced/augmented by generated types (`supabase gen types typescript`),
// but are kept hand-written for now so the app compiles without a live project.

export type PlayingSide = 'left' | 'right' | 'both';
export type DominantHand = 'left' | 'right';
export type PlayerLevel =
  | 'beginner'
  | 'lower_intermediate'
  | 'intermediate'
  | 'upper_intermediate'
  | 'advanced'
  | 'competitive'
  | 'professional';
export type PlayingStyle =
  | 'playmaker'
  | 'tactical_aggressor'
  | 'counter_puncher'
  | 'power_player'
  | 'defender'
  | 'all_rounder';

export type SkillCategory = 'technique' | 'defense' | 'tactics' | 'physical' | 'mental';

export interface Profile {
  id: string;
  fullName: string;
  username: string | null;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  bio: string | null;
  playingSide: PlayingSide | null;
  dominantHand: DominantHand | null;
  currentLevel: PlayerLevel | null;
  yearsPlaying: number | null;
  preferredPosition: PlayingSide | null;
  primaryStyle: PlayingStyle | null;
  /** Self-reported rating, 1-10. Distinct from the computed PadelDNA score. */
  currentRating: number | null;
  goals: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillScore {
  id: string;
  assessmentId: string;
  category: SkillCategory;
  skill: string;
  score: number; // 1-10
}

export interface SkillAssessment {
  id: string;
  profileId: string;
  status: 'draft' | 'submitted';
  submittedAt: string | null;
  scores: SkillScore[];
}

export interface PlayerDNA {
  id: string;
  profileId: string;
  sourceAssessmentId: string | null;
  overallScore: number;
  categoryScores: Record<SkillCategory, number>;
  archetype: string | null;
  strengths: string[];
  weaknesses: string[];
  updatedAt: string;
}

export interface Partner {
  id: string;
  profileId: string;
  name: string;
  playingSide: PlayingSide | null;
  dominantHand: DominantHand | null;
  level: string | null;
  style: string | null;
  strengths: string | null;
  weaknesses: string | null;
  notes: string | null;
}

export type MatchResult = 'win' | 'loss';
export type MatchType = 'friendly' | 'league' | 'tournament' | 'training';

export interface MatchMetrics {
  winners: number | null;
  forcedErrors: number | null;
  unforcedErrors: number | null;
  smashWinners: number | null;
  volleyWinners: number | null;
  dropWinners: number | null;
  lobWinners: number | null;
  defensiveSaves: number | null;
  successfulReturns: number | null;
}

export interface Match {
  id: string;
  profileId: string;
  playedOn: string;
  partnerId: string | null;
  opponentNames: string | null;
  result: MatchResult | null;
  score: string | null;
  playerPosition: 'left' | 'right' | null;
  matchType: MatchType | null;
  notes: string | null;
  metrics: MatchMetrics | null;
}

export type RecommendationPriority = 'low' | 'medium' | 'high';

export interface TrainingRecommendation {
  id: string;
  profileId: string;
  problem: string;
  whyItMatters: string;
  suggestedDrill: string;
  target: string;
  priority: RecommendationPriority;
  status: 'active' | 'dismissed' | 'completed';
}

export interface ProgressSnapshot {
  id: string;
  profileId: string;
  snapshotDate: string;
  overallDnaScore: number | null;
  matchesPlayed: number;
  winRate: number | null;
}

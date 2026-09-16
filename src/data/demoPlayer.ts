import type { Match, PlayerDNA, Profile, ProgressSnapshot, TrainingRecommendation } from '@/types/database';
import type { AuthUser } from '@/types/auth';
import { computeOverallDnaScore } from '@/lib/dna';

export const DEMO_PROFILE_ID = 'demo-player-moury';

export const demoAuthUser: AuthUser = {
  id: DEMO_PROFILE_ID,
  email: 'moury@padeldna.app',
};

export const demoProfile: Profile = {
  id: DEMO_PROFILE_ID,
  fullName: 'Moury Darmawan',
  username: 'mourydarmawan',
  avatarUrl: null,
  dateOfBirth: '1994-03-12',
  bio: 'Left-side player working on finishing higher-percentage points at the net. Plays 2-3 times a week.',
  playingSide: 'left',
  dominantHand: 'right',
  currentLevel: 'upper_intermediate',
  yearsPlaying: 3.5,
  preferredPosition: 'left',
  primaryStyle: 'tactical_aggressor',
  currentRating: 3.8,
  goals: 'Compete in a local intermediate tournament this season.',
  isPublic: true,
  createdAt: '2025-11-02T09:00:00.000Z',
  updatedAt: '2026-09-10T09:00:00.000Z',
};

const demoCategoryScores = {
  technique: 7.4,
  defense: 6.1,
  tactics: 8.2,
  physical: 5.8,
  mental: 7.0,
} as const;

export const demoDNA: PlayerDNA = {
  id: 'demo-dna-moury',
  profileId: DEMO_PROFILE_ID,
  sourceAssessmentId: null,
  overallScore: computeOverallDnaScore(demoCategoryScores),
  categoryScores: demoCategoryScores,
  archetype: 'Tactical Aggressor',
  strengths: ['Tactics', 'Technique'],
  weaknesses: ['Physical', 'Defense'],
  updatedAt: '2026-09-10T09:00:00.000Z',
};

export const demoRecentMatches: Match[] = [
  {
    id: 'demo-match-1',
    profileId: DEMO_PROFILE_ID,
    playedOn: '2026-09-13',
    partnerId: null,
    opponentNames: 'Andi & Fajar',
    result: 'win',
    score: '6-3, 6-4',
    playerPosition: 'left',
    matchType: 'league',
    notes: null,
    metrics: null,
  },
  {
    id: 'demo-match-2',
    profileId: DEMO_PROFILE_ID,
    playedOn: '2026-09-08',
    partnerId: null,
    opponentNames: 'Rizky & Bagas',
    result: 'loss',
    score: '4-6, 6-7',
    playerPosition: 'left',
    matchType: 'friendly',
    notes: null,
    metrics: null,
  },
  {
    id: 'demo-match-3',
    profileId: DEMO_PROFILE_ID,
    playedOn: '2026-09-01',
    partnerId: null,
    opponentNames: 'Dimas & Yoga',
    result: 'win',
    score: '6-2, 6-1',
    playerPosition: 'left',
    matchType: 'friendly',
    notes: null,
    metrics: null,
  },
];

export const demoProgressSnapshots: ProgressSnapshot[] = [
  { id: 'snap-1', profileId: DEMO_PROFILE_ID, snapshotDate: '2026-07-01', overallDnaScore: 6.5, matchesPlayed: 4, winRate: 50 },
  { id: 'snap-2', profileId: DEMO_PROFILE_ID, snapshotDate: '2026-08-01', overallDnaScore: 6.8, matchesPlayed: 5, winRate: 60 },
  { id: 'snap-3', profileId: DEMO_PROFILE_ID, snapshotDate: '2026-09-01', overallDnaScore: 6.9, matchesPlayed: 3, winRate: 67 },
];

export const demoTrainingRecommendations: TrainingRecommendation[] = [
  {
    id: 'rec-1',
    profileId: DEMO_PROFILE_ID,
    problem: 'Physical is your lowest-scoring category.',
    whyItMatters: 'Longer rallies expose recovery speed, which shows up as late positioning in the third set.',
    suggestedDrill: 'Court-sprint intervals, 2x per week.',
    target: 'Raise Physical from 5.8 toward 7.0.',
    priority: 'high',
    status: 'active',
  },
  {
    id: 'rec-2',
    profileId: DEMO_PROFILE_ID,
    problem: 'Defense trails your other categories.',
    whyItMatters: 'Glass defense and lob quality set up the next attacking shot — weak defense shortens rallies you should be winning.',
    suggestedDrill: 'Wall-rebound glass defense drill, 15 minutes per session.',
    target: 'Raise Defense from 6.1 toward 7.0.',
    priority: 'medium',
    status: 'active',
  },
];

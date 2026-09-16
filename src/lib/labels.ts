import type { DominantHand, PlayerLevel, PlayingSide, PlayingStyle, SkillCategory } from '@/types/database';

export const PLAYER_LEVEL_LABELS: Record<PlayerLevel, string> = {
  beginner: 'Beginner',
  lower_intermediate: 'Lower Intermediate',
  intermediate: 'Intermediate',
  upper_intermediate: 'Upper Intermediate',
  advanced: 'Advanced',
  competitive: 'Competitive',
  professional: 'Professional',
};

export const PLAYING_STYLE_LABELS: Record<PlayingStyle, string> = {
  playmaker: 'Playmaker',
  tactical_aggressor: 'Tactical Aggressor',
  counter_puncher: 'Counter Puncher',
  power_player: 'Power Player',
  defender: 'Defender',
  all_rounder: 'All-Rounder',
};

export const PLAYING_SIDE_LABELS: Record<PlayingSide, string> = {
  left: 'Left',
  right: 'Right',
  both: 'Both',
};

export const DOMINANT_HAND_LABELS: Record<DominantHand, string> = {
  left: 'Left',
  right: 'Right',
};

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  technique: 'Technique',
  defense: 'Defense',
  tactics: 'Tactics',
  physical: 'Physical',
  mental: 'Mental',
};

export function formatYearsPlaying(years: number | null): string {
  if (years === null) return 'Not set';
  return years === 1 ? '1 year' : `${years} years`;
}

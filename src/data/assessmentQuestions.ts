import type { AssessmentQuestion } from '@/types/assessment';

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // Technique
  { id: 'tech-1', category: 'technique', prompt: 'I can place my forehand where I want it, not just get it back in play.' },
  { id: 'tech-2', category: 'technique', prompt: 'My backhand holds up under pressure, not just on easy balls.' },
  { id: 'tech-3', category: 'technique', prompt: 'My volleys are precise enough to finish points at the net.' },
  { id: 'tech-4', category: 'technique', prompt: 'I execute bandeja and vibora cleanly off the back glass.' },
  { id: 'tech-5', category: 'technique', prompt: 'My lobs and drop shots land where I intend, not just "somewhere safe".' },

  // Defense
  { id: 'def-1', category: 'defense', prompt: 'I control the ball off the back glass instead of just surviving it.' },
  { id: 'def-2', category: 'defense', prompt: 'My returns put pressure back on the server.' },
  { id: 'def-3', category: 'defense', prompt: 'I recover court position quickly after being pulled out of place.' },
  { id: 'def-4', category: 'defense', prompt: 'My defensive positioning limits my opponents\u2019 easy winners.' },
  { id: 'def-5', category: 'defense', prompt: 'I react to smashes and fast balls without panicking.' },

  // Tactics
  { id: 'tac-1', category: 'tactics', prompt: 'I choose the right shot for the situation, not just the one I like hitting.' },
  { id: 'tac-2', category: 'tactics', prompt: 'My partner and I move together as a court-positioning unit.' },
  { id: 'tac-3', category: 'tactics', prompt: 'I transition from defense to attack when the opening appears.' },
  { id: 'tac-4', category: 'tactics', prompt: 'I build points toward a winning shot instead of hitting winners cold.' },
  { id: 'tac-5', category: 'tactics', prompt: 'I stay patient and construct the point instead of forcing it early.' },

  // Physical
  { id: 'phys-1', category: 'physical', prompt: 'I reach balls that a step slower would put out of reach.' },
  { id: 'phys-2', category: 'physical', prompt: 'I change direction quickly without losing balance.' },
  { id: 'phys-3', category: 'physical', prompt: 'My level holds up in the third set, not just the first.' },
  { id: 'phys-4', category: 'physical', prompt: 'I generate real power on smashes when the chance is there.' },
  { id: 'phys-5', category: 'physical', prompt: 'I recover physically between points and games during a long match.' },

  // Mental
  { id: 'ment-1', category: 'mental', prompt: 'I make sound decisions under pressure, not rushed ones.' },
  { id: 'ment-2', category: 'mental', prompt: 'My level of play stays consistent across a whole match.' },
  { id: 'ment-3', category: 'mental', prompt: 'I stay composed after an unforced error instead of tilting.' },
  { id: 'ment-4', category: 'mental', prompt: 'I adapt my game against different opponents and styles.' },
  { id: 'ment-5', category: 'mental', prompt: 'My focus holds up late in close matches.' },
];

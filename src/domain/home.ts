import { brushingStreak } from './brushing.ts';
import type { BrushingSession } from './brushing.ts';
import { tipCycle } from './tipCycle.ts';

// RE-C1: rule-ordered home cards (max 3). Lower priority number shows first.
export type HomeCard =
  | { kind: 'device-error'; priority: 0 }
  | { kind: 'tip-replace' | 'tip-soon'; priority: 1 | 2; usedDays: number; remainingDays: number }
  | { kind: 'streak'; priority: 3; current: number; best: number; brushedToday: boolean }
  | { kind: 'device-connected'; priority: 4; records: number; lastSync: string | null }
  | { kind: 'device-disconnected'; priority: 4 }
  | { kind: 'tip-unset'; priority: 5 };

export type HomeInput = { connection: 'disconnected' | 'connecting' | 'mock-connected' | 'error'; sessions: BrushingSession[]; lastSync: string | null; tipReplacedOn: string | null };
export function homeCards(state: HomeInput, now: number): HomeCard[] {
  const cards: HomeCard[] = [];
  if (state.connection === 'error') cards.push({ kind: 'device-error', priority: 0 });
  else if (state.connection === 'mock-connected') cards.push({ kind: 'device-connected', priority: 4, records: state.sessions.length, lastSync: state.lastSync });
  else cards.push({ kind: 'device-disconnected', priority: 4 });
  const tip = tipCycle(state.tipReplacedOn, now);
  if (!tip) cards.push({ kind: 'tip-unset', priority: 5 });
  else if (tip.level !== 'ok') cards.push({ kind: tip.level === 'replace' ? 'tip-replace' : 'tip-soon', priority: tip.level === 'replace' ? 1 : 2, usedDays: tip.usedDays, remainingDays: tip.remainingDays });
  const streak = brushingStreak(state.sessions, now);
  if (streak) cards.push({ kind: 'streak', priority: 3, ...streak });
  return cards.sort((a, b) => a.priority - b.priority).slice(0, 3);
}

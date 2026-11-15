import { dayNumber } from './brushing.ts';

// RE-C4: demo replacement cycle (DECISIONS D-RE-01). Oneway has not published an official interval.
export const demoTipCycleDays = 90;
export type TipLevel = 'ok' | 'soon' | 'replace';
export type TipCycle = { usedDays: number; remainingDays: number; ratio: number; level: TipLevel };

const isoDate = /^\d{4}-\d{2}-\d{2}$/;
export function kstDateInput(now: number) { return new Date(now + 9 * 3_600_000).toISOString().slice(0, 10); }
export function tipCycle(replacedOn: string | null, now: number, cycleDays = demoTipCycleDays): TipCycle | null {
  if (!replacedOn || !isoDate.test(replacedOn)) return null;
  const start = Date.parse(`${replacedOn}T00:00:00+09:00`);
  if (!Number.isFinite(start)) return null;
  const usedDays = dayNumber(now) - dayNumber(start);
  if (usedDays < 0) return null;
  const ratio = usedDays / cycleDays;
  return { usedDays, remainingDays: Math.max(cycleDays - usedDays, 0), ratio, level: ratio >= 1 ? 'replace' : ratio >= 0.7 ? 'soon' : 'ok' };
}

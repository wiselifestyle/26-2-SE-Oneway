export const periods = [7, 14, 30] as const;
export type Period = typeof periods[number];
export type Region = { label: string; coverage: number | null };
export type BrushingSession = { id: string; eventId: string; deviceId: string; recordedAt: string; duration: number | null; score: number | null; coverage: number | null; regions: Region[] | null };
export type ConnectionScenario = 'success' | 'denied' | 'timeout' | 'unavailable';
export type SyncScenario = 'success' | 'flaky' | 'failed' | 'empty' | 'invalid';
export const dayMs = 86_400_000;
const kstOffset = 9 * 3_600_000;
export function dayNumber(time: number) { return Math.floor((time + kstOffset) / dayMs); }
export function dayLabel(day: number) { return new Date(day * dayMs).toISOString().slice(0, 10); }
const metric = (value: unknown) => value === null || typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100;
export function isSession(value: unknown): value is BrushingSession {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === 'string' && !!v.id && typeof v.eventId === 'string' && !!v.eventId && typeof v.deviceId === 'string' && !!v.deviceId
    && typeof v.recordedAt === 'string' && Number.isFinite(Date.parse(v.recordedAt))
    && (v.duration === null || typeof v.duration === 'number' && Number.isFinite(v.duration) && v.duration >= 0 && Number.isInteger(v.duration))
    && metric(v.score) && metric(v.coverage)
    && (v.regions === null || Array.isArray(v.regions) && v.regions.every(r => typeof r === 'object' && r !== null && typeof r.label === 'string' && metric(r.coverage)));
}
export function mergeSessions(existing: BrushingSession[], incoming: unknown): BrushingSession[] {
  if (!Array.isArray(incoming) || !incoming.every(isSession)) throw new Error('INVALID_DATA');
  const map = new Map(existing.map(s => [`${s.deviceId}:${s.eventId}`, s]));
  for (const record of incoming) {
    const key = `${record.deviceId}:${record.eventId}`;
    if (!map.has(key)) map.set(key, { ...record, id: `${record.deviceId}--${record.eventId}` });
  }
  return [...map.values()].sort((a, b) => Date.parse(b.recordedAt) - Date.parse(a.recordedAt));
}
export function inPeriod(sessions: BrushingSession[], period: Period, now: number) {
  const today = dayNumber(now);
  return sessions.filter(s => { const day = dayNumber(Date.parse(s.recordedAt)); return day >= today - period + 1 && day <= today; });
}
export function mean(values: (number | null)[]) {
  const present = values.filter((value): value is number => value !== null);
  return { value: present.length ? Math.round(present.reduce((a, b) => a + b, 0) / present.length * 10) / 10 : null, count: present.length };
}
export function brushingSummary(sessions: BrushingSession[], period: Period, now: number) {
  const records = inPeriod(sessions, period, now);
  return { records, duration: mean(records.map(s => s.duration)), coverage: mean(records.map(s => s.coverage)),
    frequency: Math.round(records.length / period * 10) / 10,
    days: Array.from({ length: period }, (_, index) => {
      const day = dayNumber(now) - period + 1 + index;
      return { date: dayLabel(day), coverage: mean(records.filter(s => dayNumber(Date.parse(s.recordedAt)) === day).map(s => s.coverage)).value };
    }) };
}
export function durationLabel(seconds: number | null) {
  if (seconds === null) return '미수신';
  const rounded = Math.round(seconds);
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, '0')}`;
}
export const dateTimeLabel = (iso: string | null) => iso ? new Date(iso).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) : '없음';

// RE-C2: consecutive KST days with at least one record. null = no records (never shown as 0일).
export type Streak = { current: number; best: number; brushedToday: boolean };
export function brushingStreak(sessions: BrushingSession[], now: number): Streak | null {
  const today = dayNumber(now);
  const days = [...new Set(sessions.map(s => dayNumber(Date.parse(s.recordedAt))).filter(day => day <= today))].sort((a, b) => a - b);
  if (!days.length) return null;
  let best = 1, run = 1;
  for (let i = 1; i < days.length; i++) { run = days[i] === days[i - 1] + 1 ? run + 1 : 1; best = Math.max(best, run); }
  const set = new Set(days);
  const brushedToday = set.has(today);
  let current = 0;
  for (let day = brushedToday ? today : today - 1; set.has(day); day--) current++;
  return { current, best, brushedToday };
}

// RE-C3: demo grade bands (DECISIONS D-RE-02). Not a clinical judgement.
export type Grade = 'great' | 'good' | 'needs-work' | 'unrated';
export const gradeBands = { great: 80, good: 60 } as const;
export function sessionGrade(score: number | null): Grade {
  if (score === null) return 'unrated';
  return score >= gradeBands.great ? 'great' : score >= gradeBands.good ? 'good' : 'needs-work';
}
export const gradeLabels: Record<Grade, { label: string; summary: string }> = {
  great: { label: '좋아요', summary: '데모 기준 가장 높은 구간이에요. 지금 습관을 이어가세요.' },
  good: { label: '괜찮아요', summary: '조금 더 고르게 닦으면 다음 구간이에요. 커버리지가 낮은 구역을 확인해보세요.' },
  'needs-work': { label: '보완 필요', summary: '놓친 구역이 많은 기록이에요. 구역별 커버리지를 보고 천천히 닦아보세요.' },
  unrated: { label: '평가 불가', summary: '점수를 받지 못해 등급을 정하지 않았어요.' },
};

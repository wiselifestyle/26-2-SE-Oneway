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

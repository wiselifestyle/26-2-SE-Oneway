import test from 'node:test';
import assert from 'node:assert/strict';
import { brushingStreak, dayMs, sessionGrade } from '../src/domain/brushing.ts';
import type { BrushingSession } from '../src/domain/brushing.ts';
import { tipCycle, kstDateInput } from '../src/domain/tipCycle.ts';
import { homeCards } from '../src/domain/home.ts';
import { demoSessions } from '../src/mocks/deviceAdapter.ts';
import { createBrushingService } from '../src/services/brushingService.ts';
const now = Date.parse('2026-11-15T12:00:00+09:00');
const at = (iso: string): BrushingSession => ({ id: iso, eventId: iso, deviceId: 'd', recordedAt: iso, duration: 120, score: 70, coverage: 70, regions: null });

test('RE-C2 연속 기록: 기록 없음은 null, KST 자정 기준, 오늘 미기록이면 어제부터 계산', () => {
  assert.equal(brushingStreak([], now), null);
  const days = ['2026-11-15T08:00:00+09:00', '2026-11-14T23:30:00+09:00', '2026-11-13T07:00:00+09:00', '2026-11-10T07:00:00+09:00', '2026-11-09T07:00:00+09:00'];
  assert.deepEqual(brushingStreak(days.map(at), now), { current: 3, best: 3, brushedToday: true });
  // 2026-11-15 00:10 KST is still 11-14 23:10 UTC — must count as the 15th.
  assert.deepEqual(brushingStreak([at('2026-11-14T15:10:00Z')], now), { current: 1, best: 1, brushedToday: true });
  assert.deepEqual(brushingStreak(days.slice(1).map(at), now), { current: 2, best: 2, brushedToday: false });
  assert.deepEqual(brushingStreak([at('2026-11-12T07:00:00+09:00')], now), { current: 0, best: 1, brushedToday: false });
  assert.equal(brushingStreak(demoSessions(now), now)?.current, 1);
});

test('RE-C3 등급: 경계값과 미수신', () => {
  assert.equal(sessionGrade(null), 'unrated');
  assert.equal(sessionGrade(80), 'great'); assert.equal(sessionGrade(79), 'good');
  assert.equal(sessionGrade(60), 'good'); assert.equal(sessionGrade(59), 'needs-work'); assert.equal(sessionGrade(0), 'needs-work');
});

test('RE-C4 팁 주기: 잘못된·미래 날짜 거부, 70%/100% 경계', () => {
  assert.equal(tipCycle(null, now), null);
  assert.equal(tipCycle('2026-13-40', now), null);
  assert.equal(tipCycle('2026-11-16', now), null);
  assert.deepEqual(tipCycle('2026-11-15', now), { usedDays: 0, remainingDays: 90, ratio: 0, level: 'ok' });
  assert.equal(tipCycle(kstDateInput(now - 62 * dayMs), now)?.level, 'ok');
  assert.equal(tipCycle(kstDateInput(now - 63 * dayMs), now)?.level, 'soon');
  assert.equal(tipCycle(kstDateInput(now - 90 * dayMs), now)?.level, 'replace');
  assert.equal(tipCycle(kstDateInput(now - 120 * dayMs), now)?.remainingDays, 0);
  assert.equal(kstDateInput(Date.parse('2026-11-14T15:30:00Z')), '2026-11-15');
});

test('RE-C1 홈 카드: 우선순위 정렬과 최대 3장', () => {
  const base = { connection: 'disconnected' as const, sessions: [], lastSync: null, tipReplacedOn: null };
  assert.deepEqual(homeCards(base, now).map(c => c.kind), ['device-disconnected', 'tip-unset']);
  const busy = { connection: 'error' as const, sessions: demoSessions(now), lastSync: null, tipReplacedOn: kstDateInput(now - 100 * dayMs) };
  assert.deepEqual(homeCards(busy, now).map(c => c.kind), ['device-error', 'tip-replace', 'streak']);
  const fine = { connection: 'mock-connected' as const, sessions: demoSessions(now), lastSync: new Date(now).toISOString(), tipReplacedOn: kstDateInput(now - 10 * dayMs) };
  assert.deepEqual(homeCards(fine, now).map(c => c.kind), ['streak', 'device-connected']);
});

test('연결 실패 유형 보관·팁 교체일은 reset으로 삭제', async () => {
  const service = createBrushingService({ async connect(scenario) { if (scenario !== 'success') throw new Error(scenario); }, async sync() { return []; } }, () => now);
  await service.connect('timeout');
  assert.equal(service.getSnapshot().connectionErrorKind, 'timeout');
  service.disconnect(); assert.equal(service.getSnapshot().connectionErrorKind, null);
  service.setTipReplacedOn('2026-10-01'); assert.equal(service.getSnapshot().tipReplacedOn, '2026-10-01');
  service.setTipReplacedOn(''); assert.equal(service.getSnapshot().tipReplacedOn, null);
  service.setTipReplacedOn('2026-10-01'); service.reset(); assert.equal(service.getSnapshot().tipReplacedOn, null);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { brushingSummary, dayMs, durationLabel, inPeriod, mean, mergeSessions } from '../src/domain/brushing.ts';
import { demoSessions } from '../src/mocks/deviceAdapter.ts';
import { createBrushingService } from '../src/services/brushingService.ts';
import type { DeviceAdapter } from '../src/services/brushingService.ts';
const anchor = Date.parse('2026-10-30T12:00:00+09:00');
const sessions = demoSessions(anchor);
function setup(adapter: DeviceAdapter, sleep?: (ms: number, signal: AbortSignal) => Promise<void>) { return createBrushingService(adapter, () => anchor, sleep); }
const normal: DeviceAdapter = { async connect() {}, async sync() { return sessions; } };

test('연결 전 동기화 차단, 연결 후 빈 상태, 수신 및 중복 이벤트 제거', async () => {
  const service = setup(normal);
  await service.sync(); assert.equal(service.getSnapshot().sessions.length, 0);
  await service.connect(); assert.equal(service.getSnapshot().sessions.length, 0);
  assert.equal(service.getSnapshot().lastSync, null);
  await service.sync(); await service.sync();
  assert.equal(service.getSnapshot().sessions.length, 6);
  assert.equal(service.getSnapshot().lastSync, new Date(anchor).toISOString());
});
test('전송 실패는 1/3/10초 3회 재시도 후 과거 기록과 최종 시각 유지', async () => {
  let fail = false; let calls = 0; const delays: number[] = [];
  const service = setup({ async connect() {}, async sync() { calls++; if (fail) throw new Error('transfer'); return sessions; } }, async ms => { delays.push(ms); });
  await service.connect(); await service.sync();
  fail = true; calls = 0; await service.sync();
  assert.equal(calls, 4); assert.deepEqual(delays, [1000, 3000, 10000]);
  assert.equal(service.getSnapshot().syncStatus, 'failed'); assert.equal(service.getSnapshot().sessions.length, 6);
  assert.equal(service.getSnapshot().lastSync, new Date(anchor).toISOString());
  fail = false; await service.sync(); assert.equal(service.getSnapshot().syncStatus, 'success');
});
test('일시 오류 회복·빈 응답·잘못된 데이터는 각각 구분하고 원자적으로 반영', async () => {
  let mode = 'flaky'; let attempts = 0;
  const service = setup({ async connect() {}, async sync(_, attempt) { attempts++; if (mode === 'flaky' && attempt < 2) throw new Error('retry'); if (mode === 'empty') return []; if (mode === 'invalid') return [sessions[0], { ...sessions[1], score: 101 }]; return sessions; } }, async () => {});
  await service.connect(); await service.sync(); assert.equal(attempts, 3); assert.equal(service.getSnapshot().sessions.length, 6);
  mode = 'empty'; await service.sync(); assert.equal(service.getSnapshot().sessions.length, 6);
  mode = 'invalid'; attempts = 0; await service.sync(); assert.equal(attempts, 1); assert.equal(service.getSnapshot().syncStatus, 'failed'); assert.equal(service.getSnapshot().sessions.length, 6);
  const empty = setup({ ...normal, async sync() { return []; } }); await empty.connect(); await empty.sync(); assert.equal(empty.getSnapshot().sessions.length, 0); assert.equal(empty.getSnapshot().syncStatus, 'success');
});
test('중복 동기화 차단·해제 후 늦은 수신 폐기', async () => {
  let resolve!: (v: unknown) => void; let calls = 0;
  const service = setup({ async connect() {}, sync() { calls++; return new Promise(r => { resolve = r; }); } });
  await service.connect(); const pending = service.sync(); await service.sync(); assert.equal(calls, 1);
  service.disconnect(); resolve(sessions); await pending;
  assert.equal(service.getSnapshot().connection, 'disconnected'); assert.equal(service.getSnapshot().sessions.length, 0); assert.equal(service.getSnapshot().lastSync, null);
});
test('연결 취소 후 늦은 연결 성공을 반영하지 않고 권한/시간초과 오류 회복', async () => {
  let resolve!: () => void;
  const service = setup({ connect() { return new Promise<void>(r => { resolve = r; }); }, async sync() { return []; } });
  const pending = service.connect(); service.disconnect(); resolve(); await pending; assert.equal(service.getSnapshot().connection, 'disconnected');
  for (const scenario of ['denied', 'timeout', 'unavailable'] as const) {
    const failed = setup({ async connect(mode) { if (mode !== 'success') throw new Error(mode); }, async sync() { return []; } });
    await failed.connect(scenario); assert.equal(failed.getSnapshot().connection, 'error'); assert.ok(failed.getSnapshot().connectionError);
    await failed.connect(); assert.equal(failed.getSnapshot().connection, 'mock-connected');
  }
});
test('기간 KST 경계·평균 분모·null/0·날짜별 결측 및 기간 상태 보존', async () => {
  assert.deepEqual(mean([null, 0, 100]), { value: 50, count: 2 }); assert.deepEqual(mean([null]), { value: null, count: 0 });
  assert.equal(durationLabel(null), '미수신'); assert.equal(durationLabel(119.9), '2:00');
  const summary = brushingSummary(sessions, 14, anchor);
  assert.equal(summary.records.length, 6); assert.equal(summary.duration.count, 5); assert.equal(summary.coverage.count, 5);
  assert.equal(summary.duration.value, 126); assert.equal(summary.coverage.value, 80.2); assert.equal(summary.frequency, 0.4);
  assert.ok(summary.days.some(d => d.coverage === null)); assert.equal(inPeriod(sessions, 7, anchor).length, 4);
  const boundary = [{ ...sessions[0], recordedAt: '2026-10-23T14:59:59Z' }, { ...sessions[1], recordedAt: '2026-10-23T15:00:00Z' }];
  assert.equal(inPeriod(boundary, 7, anchor).length, 1);
  assert.equal(inPeriod(sessions, 7, anchor + 40 * dayMs).length, 0);
  const service = setup(normal); service.setPeriod(30); service.disconnect(); assert.equal(service.getSnapshot().period, 30);
});
test('유효하지 않은 값은 0으로 정정하지 않고 전체 묶음을 거부', () => {
  for (const field of ['duration', 'coverage', 'score'] as const) assert.throws(() => mergeSessions([], [{ ...sessions[0], [field]: -1 }]), /INVALID_DATA/);
  assert.throws(() => mergeSessions([], [{ ...sessions[0], score: NaN }]), /INVALID_DATA/);
  assert.throws(() => mergeSessions([], [{ ...sessions[0], recordedAt: 'bad' }]), /INVALID_DATA/);
  assert.equal(mergeSessions([], [{ ...sessions[0], coverage: 0, score: null }])[0].coverage, 0);
});

test('재시도 대기 중 중단하면 추가 전송과 늦은 상태 갱신을 하지 않는다', async () => {
  let fail = false, calls = 0;
  let finishWait!: () => void;
  const service = setup({ async connect() {}, async sync() { calls++; if (fail) throw new Error('transfer'); return sessions; } }, () => new Promise<void>(resolve => { finishWait = resolve; }));
  await service.connect(); await service.sync(); fail = true; calls = 0;
  const request = service.sync();
  await Promise.resolve(); await Promise.resolve();
  assert.equal(service.getSnapshot().syncStatus, 'retrying');
  service.cancelSync(); finishWait(); await request;
  assert.equal(calls, 1); assert.equal(service.getSnapshot().syncStatus, 'idle');
  assert.equal(service.getSnapshot().sessions.length, 6); assert.equal(service.getSnapshot().lastSync, new Date(anchor).toISOString());
});

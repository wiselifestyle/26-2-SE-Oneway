import test from 'node:test';
import assert from 'node:assert/strict';
import { createAssessmentService } from '../src/services/assessmentService.ts';
import { createBrushingService } from '../src/services/brushingService.ts';
import { createSubscriptionService } from '../src/services/subscriptionService.ts';
import { deleteLocalData, deletionTargets } from '../src/services/privacyService.ts';
import { classify } from '../src/domain/assessment.ts';
import { demoSessions } from '../src/mocks/deviceAdapter.ts';
const responses = { sensitivity: 'often', gums: 'often', teeth: 'often', breath: 'often' } as const;
test('실제 세 서비스의 기록/동의/상태를 삭제하고 재삭제도 안전하다', async () => {
  const assessment = createAssessmentService({ analyze: async () => ({ status: 'ready', items: classify(responses), adviceStatus: 'ready' }) });
  assessment.setConsent(true); for (const key of Object.keys(responses) as (keyof typeof responses)[]) assessment.setResponse(key, responses[key]); await assessment.submit();
  const brushing = createBrushingService({ connect: async () => {}, sync: async () => demoSessions(Date.now()) }); await brushing.connect(); await brushing.sync(); brushing.setPeriod(30);
  const subscription = createSubscriptionService({ request: async () => 'demo_requested' }); subscription.setDraft({ productId: 'tip-532', cycle: 3, consent: true }); await subscription.submit();
  const targets = { assessment: assessment.reset, brushing: brushing.reset, subscription: subscription.reset };
  for (let i = 0; i < 2; i++) {
    assert.deepEqual(await deleteLocalData(targets), { removed: [...deletionTargets], failed: [] });
    assert.equal(assessment.getSnapshot().consent, false); assert.deepEqual(assessment.getSnapshot().responses, {}); assert.equal(assessment.getSnapshot().result, null);
    assert.equal(brushing.getSnapshot().sessions.length, 0); assert.equal(brushing.getSnapshot().lastSync, null); assert.equal(brushing.getSnapshot().period, 14); assert.equal(brushing.getSnapshot().connection, 'disconnected');
    assert.equal(subscription.getSnapshot().intent, null); assert.equal(subscription.getSnapshot().draft.consent, false);
  }
});
test('부분 실패는 대상별 실제 결과만 보고하고 재시도는 남은 데이터를 지운다', async () => {
  const data = { assessment: 1, brushing: 6, subscription: 1 };
  const targets = { assessment: () => { data.assessment = 0; }, brushing: () => { throw new Error('fail'); }, subscription: () => { data.subscription = 0; } };
  assert.deepEqual(await deleteLocalData(targets), { removed: ['assessment', 'subscription'], failed: ['brushing'] });
  assert.deepEqual(data, { assessment: 0, brushing: 6, subscription: 0 });
  assert.deepEqual(await deleteLocalData({ ...targets, brushing: () => { data.brushing = 0; } }), { removed: [...deletionTargets], failed: [] }); assert.equal(data.brushing, 0);
});
test('설문 삭제 후 진행 중이던 모의 분석이 결과를 복구하지 못한다', async () => {
  let resolve!: (value: { status: 'ready'; items: ReturnType<typeof classify>; adviceStatus: 'ready' }) => void;
  const service = createAssessmentService({ analyze: async () => new Promise(r => { resolve = r; }) });
  service.setConsent(true); for (const key of Object.keys(responses) as (keyof typeof responses)[]) service.setResponse(key, responses[key]);
  const pending = service.submit(); service.reset(); resolve({ status: 'ready', items: classify(responses), adviceStatus: 'ready' });
  assert.equal(await pending, null); assert.equal(service.getSnapshot().result, null); assert.equal(service.getSnapshot().consent, false);
});
test('양치 삭제는 연결/동기화 지연 응답을 폐기하고 정상 시각도 지운다', async () => {
  let finishConnect!: () => void; let finishSync!: (value: unknown) => void;
  const service = createBrushingService({ connect: async () => new Promise(r => { finishConnect = r; }), sync: async () => new Promise(r => { finishSync = r; }) });
  const first = service.connect(); service.reset(); finishConnect(); await first; assert.equal(service.getSnapshot().connection, 'disconnected');
  const second = service.connect(); finishConnect(); await second;
  const sync = service.sync(); service.reset(); finishSync(demoSessions(Date.now())); await sync;
  assert.equal(service.getSnapshot().sessions.length, 0); assert.equal(service.getSnapshot().lastSync, null); assert.equal(service.getSnapshot().syncStatus, 'idle');
});

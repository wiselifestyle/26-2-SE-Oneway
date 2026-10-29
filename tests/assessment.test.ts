import test from 'node:test';
import assert from 'node:assert/strict';
import { adviceFor, classify, missingResponses, recommendationsFor } from '../src/domain/assessment.ts';
import type { Responses } from '../src/domain/assessment.ts';
import { createAssessmentService } from '../src/services/assessmentService.ts';
import type { AdapterResult, AnalysisAdapter } from '../src/services/assessmentService.ts';
import { analysisAdapter } from '../src/mocks/analysisAdapter.ts';

const full: Responses = { sensitivity: 'none', gums: 'often', teeth: 'sometimes', breath: 'unknown' };
const ready = async () => ({ status: 'ready' as const, items: classify(full), adviceStatus: 'ready' as const });
function setup(adapter: AnalysisAdapter = { analyze: ready }) {
  const service = createAssessmentService(adapter);
  service.setConsent(true);
  for (const [key, value] of Object.entries(full)) service.setResponse(key as keyof Responses, value);
  return service;
}

test('필수 응답 누락은 분석 호출 없이 거부하고 unknown은 결측 표시로 처리한다', async () => {
  let calls = 0;
  const service = createAssessmentService({ analyze: async () => { calls++; return ready(); } });
  assert.equal(await service.submit(), null);
  service.setConsent(true);
  service.setResponse('gums', 'often');
  assert.equal(await service.submit(), null);
  assert.equal(calls, 0);
  assert.deepEqual(missingResponses({ ...full, teeth: undefined }), ['teeth']);
  const unknown = classify(full).find(item => item.category === 'breath')!;
  assert.equal(unknown.position, null);
  assert.equal(unknown.level, '평가 불가');
});

test('응답 변경 즉시 결과가 무효화되고 새 응답의 조언과 후보가 일관되게 바뀐다', async () => {
  const service = setup({ analyze: async responses => ({ status: 'ready', items: classify(responses), adviceStatus: 'ready' }) });
  const first = (await service.submit())!;
  assert.equal(recommendationsFor(first)[0].candidate, 'B');
  const firstAdvice = adviceFor(first.items[1]).text;
  service.setResponse('gums', 'none');
  assert.equal(service.getSnapshot().result, null);
  const second = (await service.submit())!;
  assert.notEqual(first.id, second.id);
  assert.ok(second.revision > first.revision);
  assert.equal(recommendationsFor(second)[0].candidate, 'C');
  assert.notEqual(adviceFor(second.items[1]).text, firstAdvice);
});

test('지연 응답: 입력 수정 후 도착한 결과는 폐기한다', async () => {
  let resolve!: (value: AdapterResult) => void;
  const service = setup({ analyze: () => new Promise<AdapterResult>(r => { resolve = r; }) });
  const request = service.submit();
  service.setResponse('gums', 'none');
  resolve(await ready());
  assert.equal(await request, null);
  assert.equal(service.getSnapshot().result, null);
  assert.equal(service.getSnapshot().status, 'idle');
});

test('확인 철회는 메모리를 비우고 진행 중 응답과 추가 입력을 차단한다', async () => {
  let resolve!: (value: AdapterResult) => void;
  const service = setup({ analyze: () => new Promise<AdapterResult>(r => { resolve = r; }) });
  const request = service.submit();
  service.setConsent(false);
  service.setResponse('gums', 'often');
  resolve(await ready());
  assert.equal(await request, null);
  assert.deepEqual(service.getSnapshot().responses, {});
  assert.equal(service.getSnapshot().result, null);
});

test('중복 제출은 요청 1회만 실행한다', async () => {
  let calls = 0;
  let resolve!: (value: AdapterResult) => void;
  const service = setup({ analyze: () => { calls++; return new Promise<AdapterResult>(r => { resolve = r; }); } });
  const first = service.submit();
  assert.equal(await service.submit(), null);
  assert.equal(calls, 1);
  resolve(await ready());
  assert.ok(await first);
});

test('실패·저신뢰·예외는 결과를 만들지 않고 정상 재시도는 회복한다', async () => {
  for (const status of ['failed', 'low-confidence'] as const) {
    let fail = true;
    const service = setup({ analyze: async () => fail ? { status } : ready() });
    assert.equal(await service.submit(), null);
    assert.equal(service.getSnapshot().status, status);
    assert.equal(service.getSnapshot().result, null);
    fail = false;
    assert.ok(await service.submit());
  }
  const service = setup({ analyze: async () => { throw new Error('offline'); } });
  assert.equal(await service.submit(), null);
  assert.equal(service.getSnapshot().status, 'failed');
});

test('일부 미수신은 null, 조언 실패는 추천 보류, 전부 없음은 일반 안내', async () => {
  const service = setup(analysisAdapter);
  const partial = (await service.submit('partial'))!;
  assert.equal(partial.items.find(i => i.category === 'breath')!.position, null);
  const failedAdvice = (await service.submit('advice-failed'))!;
  assert.deepEqual(recommendationsFor(failedAdvice), []);
  const normal = { ...failedAdvice, adviceStatus: 'ready' as const, items: classify({ sensitivity: 'none', gums: 'none', teeth: 'none', breath: 'none' }) };
  assert.deepEqual(recommendationsFor(normal), []);
});

test('늦게 도착한 이전 요청의 실패가 새 정상 결과를 덮어쓰지 않는다', async () => {
  let resolveOld!: (value: AdapterResult) => void;
  let calls = 0;
  const service = setup({ analyze: async responses => {
    if (++calls === 1) return new Promise<AdapterResult>(resolve => { resolveOld = resolve; });
    return { status: 'ready', items: classify(responses), adviceStatus: 'ready' };
  } });
  const old = service.submit();
  service.setResponse('gums', 'none');
  const latest = await service.submit();
  resolveOld({ status: 'failed' });
  assert.equal(await old, null);
  assert.equal(service.getSnapshot().result?.id, latest?.id);
  assert.equal(service.getSnapshot().status, 'idle');
});

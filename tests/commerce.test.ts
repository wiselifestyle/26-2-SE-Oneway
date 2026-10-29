import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog, productFor, safeShopUrl } from '../src/domain/catalog.ts';
import { createSubscriptionService } from '../src/services/subscriptionService.ts';
import type { SubscriptionAdapter } from '../src/services/subscriptionService.ts';
import { subscriptionAdapter } from '../src/mocks/subscriptionAdapter.ts';
const full = { productId: 'tip-532', cycle: 3, consent: true };
function setup(adapter: SubscriptionAdapter = { request: async () => 'demo_requested' }) {
  const service = createSubscriptionService(adapter); service.setDraft(full); return service;
}
test('카탈로그 ID와 판매 주소는 고유하며 HTTPS 자사몰만 허용한다', () => {
  assert.equal(new Set(catalog.map(p => p.id)).size, 4);
  for (const product of catalog) { assert.ok(safeShopUrl(product.source)); assert.equal(productFor(product.id), product); }
  assert.equal(productFor('demo-tip-a'), undefined);
  for (const url of [undefined, '', 'bad', 'javascript:alert(1)', 'http://oneway.or.kr/', 'https://oneway.or.kr.evil.test/', 'https://evil.test/?oneway.or.kr', 'https://user:pass@oneway.or.kr/', 'https://oneway.or.kr:444/']) assert.equal(safeShopUrl(url), null);
});
test('상품·주기·체험 확인 누락 또는 잘못된 값은 adapter 호출 전 차단한다', async () => {
  let calls = 0; const service = createSubscriptionService({ request: async () => { calls++; return 'demo_requested'; } });
  for (const draft of [{}, { ...full, consent: false }, { ...full, productId: 'fake' }, { ...full, cycle: 1 }]) { service.setDraft(draft); assert.equal(await service.submit(), null); }
  assert.equal(calls, 0); assert.ok(service.getSnapshot().error);
});
test('정상은 로컬 가상 요청이며 중복 제출은 같은 intent를 반환한다', async () => {
  let calls = 0; const service = setup({ request: async () => { calls++; return 'demo_requested'; } });
  const first = (await service.submit())!; const second = await service.submit();
  assert.equal(first.status, 'demo_requested'); assert.equal(first.id, second?.id); assert.equal(calls, 1);
  service.withdraw(); assert.equal(service.getSnapshot().intent?.status, 'demo_withdrawn'); assert.equal(service.getSnapshot().draft.consent, false);
  assert.equal(await service.submit(), null);
});
test('실패 후 재시도·미확인은 성공 주문 상태를 만들지 않는다', async () => {
  const service = setup(subscriptionAdapter);
  assert.equal(await service.submit('failed'), null); assert.equal(service.getSnapshot().status, 'failed');
  assert.equal(service.getSnapshot().intent, null);
  assert.equal((await service.submit('unconfirmed'))?.status, 'unconfirmed');
});
test('진행 중 중복 제출·구성 변경·중단·삭제는 늦은 응답을 차단한다', async () => {
  for (const action of ['change', 'cancel', 'reset', 'withdraw'] as const) {
    let resolve!: (status: 'demo_requested') => void; let calls = 0; let signal!: AbortSignal;
    const service = setup({ request: async (_, current) => { calls++; signal = current; return new Promise(r => { resolve = r; }); } });
    const pending = service.submit(); assert.equal(await service.submit(), null); assert.equal(calls, 1);
    if (action === 'change') service.setDraft({ cycle: 6 }); else service[action]();
    assert.equal(signal.aborted, true); resolve('demo_requested'); assert.equal(await pending, null);
    assert.equal(service.getSnapshot().intent, null); assert.equal(service.getSnapshot().status, 'idle');
  }
});
test('이전 실패가 새 요청의 결과를 덮지 않으며 reset은 동의/구성을 지운다', async () => {
  let rejectOld!: (error: Error) => void; let calls = 0;
  const service = setup({ request: async () => ++calls === 1 ? new Promise((_, reject) => { rejectOld = reject; }) : 'demo_requested' });
  const old = service.submit(); service.cancel(); const current = await service.submit(); rejectOld(new Error('old'));
  await old; assert.equal(service.getSnapshot().intent?.id, current?.id);
  service.reset(); assert.deepEqual(service.getSnapshot(), { draft: { productId: '', cycle: null, consent: false }, status: 'idle', error: null, intent: null });
});

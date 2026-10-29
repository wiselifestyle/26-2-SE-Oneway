import { productFor } from '../domain/catalog.ts';
export type OrderScenario = 'demo' | 'unconfirmed' | 'failed';
export type Draft = { productId: string; cycle: number | null; consent: boolean };
export type Intent = { id: string; productId: string; cycle: number; createdAt: string; status: 'demo_requested' | 'unconfirmed' | 'demo_withdrawn' };
export interface SubscriptionAdapter { request(scenario: OrderScenario, signal: AbortSignal): Promise<'demo_requested' | 'unconfirmed'> }
export type SubscriptionState = { draft: Draft; status: 'idle' | 'pending' | 'failed'; error: string | null; intent: Intent | null };
export function createSubscriptionService(adapter: SubscriptionAdapter) {
  const initial = (): SubscriptionState => ({ draft: { productId: '', cycle: null, consent: false }, status: 'idle', error: null, intent: null });
  let state = initial();
  let request: AbortController | null = null;
  const listeners = new Set<() => void>();
  function update(patch: Partial<SubscriptionState>) { state = { ...state, ...patch }; for (const fn of listeners) fn(); }
  function cancel() { request?.abort(); request = null; }
  return {
    getSnapshot: () => state,
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
    setDraft(patch: Partial<Draft>) {
      cancel(); update({ draft: { ...state.draft, ...patch }, status: 'idle', error: null, intent: null });
    },
    cancel() { cancel(); update({ status: 'idle', error: null }); },
    reset() { cancel(); state = initial(); for (const fn of listeners) fn(); },
    withdraw() {
      cancel(); update({ draft: { ...state.draft, consent: false }, status: 'idle', error: null, intent: state.intent ? { ...state.intent, status: 'demo_withdrawn' } : null });
    },
    async submit(scenario: OrderScenario = 'demo') {
      if (state.status === 'pending') return null;
      if (state.intent && state.intent.status !== 'demo_withdrawn') return state.intent;
      const { productId, cycle, consent } = state.draft;
      if (!productFor(productId) || ![3, 6].includes(cycle ?? 0) || !consent) {
        update({ error: '상품·가상 배송 주기를 선택하고 데모 안내를 확인해 주세요.' }); return null;
      }
      const current = new AbortController(); request = current;
      update({ status: 'pending', error: null, intent: null });
      try {
        const status = await adapter.request(scenario, current.signal);
        if (request !== current || current.signal.aborted) return null;
        const intent: Intent = { id: crypto.randomUUID(), productId, cycle: cycle!, createdAt: new Date().toISOString(), status };
        update({ status: 'idle', intent }); return intent;
      } catch {
        if (request === current && !current.signal.aborted) update({ status: 'failed', error: '가상 요청 처리에 실패했어요. 실제 주문은 생성하지 않았습니다. 다시 시도할 수 있어요.' });
        return null;
      }
    },
  };
}

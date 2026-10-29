import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { RefreshCw } from 'lucide-react';
import { catalog, productFor } from '../domain/catalog';
import type { OrderScenario } from '../services/subscriptionService';
import { subscriptionService, useSubscription } from '../state/subscriptionStore';
import { ShopLink } from '../components/ShopLink';
import { StateNotice } from '../components/StateNotice';

export function SubscriptionPage() {
  const state = useSubscription();
  const [params] = useSearchParams();
  const [scenario, setScenario] = useState<OrderScenario>('demo');
  const [applyProduct] = useState(() => productFor(params.get('product') ?? undefined)?.id);
  const active = useRef(true);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  // Apply an explicit detail-page choice once, without changing the draft on ordinary revisits.
  useEffect(() => { if (applyProduct && subscriptionService.getSnapshot().draft.productId !== applyProduct) subscriptionService.setDraft({ productId: applyProduct, consent: false }); }, [applyProduct]);
  const navigate = useNavigate();
  const busy = state.status === 'pending';
  const debug = import.meta.env.DEV && params.get('demoDebug') === '1';
  return <div className="content-page commerce-page"><div className="page-eyebrow">SUBSCRIPTION · DEMO</div><h1>구독 구성 체험</h1><p className="page-description">내가 사용할 소모품과 가상 배송 주기를 골라보세요.</p><aside className="mock-notice"><strong>실제 구독을 신청하지 않아요</strong><p>3·6개월은 화면 체험용 가정이며, 실제 판매 주기나 교체 권장 주기가 아닙니다. 요금·배송 구성·해지 조건은 확정되지 않았어요. 결제·배송지 입력과 외부 전송은 없습니다.</p></aside>
    <form ref={form} aria-busy={busy} onSubmit={async event => {
      event.preventDefault();
      const intent = await subscriptionService.submit(scenario);
      if (!active.current) return;
      if (intent) navigate(`/subscription/status/${intent.id}`);
      else {
        const current = subscriptionService.getSnapshot();
        if (current.status !== 'failed') {
          const selector = !productFor(current.draft.productId) ? 'select' : !current.draft.cycle ? 'input[type="radio"]' : !current.draft.consent ? 'input[type="checkbox"]' : null;
          if (selector) form.current?.querySelector<HTMLElement>(selector)?.focus();
        }
      }
    }}>
      <label className="commerce-field">상품<select value={state.draft.productId} disabled={busy} aria-invalid={Boolean(state.error && !state.draft.productId)} aria-describedby={state.error ? 'subscription-error' : undefined} onChange={event => subscriptionService.setDraft({ productId: event.target.value, consent: false })}><option value="">상품을 선택하세요</option>{catalog.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
      <fieldset className="cycle-options" disabled={busy} aria-describedby={state.error ? 'subscription-error' : undefined}><legend>가상 배송 주기</legend>{[3, 6].map(cycle => <label key={cycle}><input type="radio" name="cycle" value={cycle} checked={state.draft.cycle === cycle} onChange={() => subscriptionService.setDraft({ cycle, consent: false })} /><span>{cycle}개월<small>데모 선택</small></span></label>)}</fieldset>
      <label className="consent-row"><input type="checkbox" checked={state.draft.consent} disabled={busy} aria-describedby={state.error ? 'subscription-error' : undefined} onChange={event => subscriptionService.setDraft({ consent: event.target.checked })} /><span>실제 주문·결제·정기배송이 발생하지 않는 가상 신청임을 확인했어요.</span></label>
      {state.error && <p className="form-error" id="subscription-error" role="alert">{state.error}</p>}
      {busy && <p role="status" className="source-note">가상 요청 처리 중이에요…</p>}
      <button className="primary-link full-width" type="submit" disabled={busy}>{busy ? '처리 중…' : state.intent && state.intent.status !== 'demo_withdrawn' ? '가상 요청 상태 보기' : state.status === 'failed' ? '가상 신청 다시 시도' : '가상 신청하기'}</button>
      {busy && <button type="button" className="secondary-link full-width" onClick={() => subscriptionService.cancel()}>요청 중단</button>}
    </form>
    {debug && <details className="debug-panel"><summary>개발용 주문 시나리오</summary><label>처리 결과<select value={scenario} disabled={busy} onChange={event => setScenario(event.target.value as OrderScenario)}><option value="demo">가상 요청 생성</option><option value="unconfirmed">외부 확인 없음</option><option value="failed">모의 처리 실패</option></select></label></details>}
    <Link className="inline-link" to="/sales-channels">실제 상품은 자사몰에서 확인</Link>
  </div>;
}

export function SubscriptionStatusPage() {
  const { intentId } = useParams();
  const { intent } = useSubscription();
  if (!intent || intent.id !== intentId) return <div className="content-page"><h1>신청 상태</h1><StateNotice kind="empty" title="가상 요청 기록이 없어요" description="새로고침·삭제·구성 변경 후에는 이전 기록을 조회할 수 없습니다. 외부 주문 내역을 조회한 결과는 아닙니다." /><Link className="primary-link full-width" to="/subscription">구독 체험으로 돌아가기</Link></div>;
  const product = productFor(intent.productId)!;
  const withdrawn = intent.status === 'demo_withdrawn';
  return <div className="content-page commerce-page"><div className="page-eyebrow">LOCAL DEMO REQUEST</div><div className="commerce-banner"><RefreshCw aria-hidden="true" /><div><strong>{withdrawn ? '가상 요청을 철회했어요' : intent.status === 'unconfirmed' ? '외부 주문 미확인' : '가상 요청을 만들었어요'}</strong><p>{withdrawn ? '이 앱 안의 체험 기록만 철회되었습니다.' : '실제 구독·결제·배송은 시작되지 않았어요.'}</p></div></div><h1>신청 상태</h1>
    <dl className="commerce-facts"><div><dt>상품</dt><dd>{product.name}</dd></div><div><dt>선택 주기</dt><dd>{intent.cycle}개월 · 가상 설정</dd></div><div><dt>주문 확인</dt><dd>외부 확인 없음</dd></div><div><dt>결제</dt><dd>수행하지 않음</dd></div></dl>
    <p className="source-note">이 기록은 현재 탭 메모리의 체험 기록입니다. 실제 주문 번호·구독 계약이 아닙니다. 자사몰에서 별도로 구매한 주문의 취소·해지는 판매처에서 확인하세요.</p>
    {!withdrawn && <button className="secondary-link full-width" onClick={() => subscriptionService.withdraw()}>가상 요청 철회</button>}
    <ShopLink url={product.source} /><Link className="primary-link full-width" to="/subscription">구성 다시 살펴보기</Link>
  </div>;
}

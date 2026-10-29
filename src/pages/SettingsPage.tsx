import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ShieldCheck, Link2, ShoppingBag } from 'lucide-react';
import { NavigationCard } from '../components/NavigationCard';
import { assessmentService, useAssessment } from '../state/assessmentStore';
import { brushingService, useBrushing } from '../state/brushingStore';
import { subscriptionService, useSubscription } from '../state/subscriptionStore';
import { deleteLocalData, targetLabels } from '../services/privacyService';
import type { DeleteResult } from '../services/privacyService';

export function SettingsPage() {
  return <div className="content-page commerce-page"><div className="page-eyebrow">MY ONEWAY</div><h1>설정</h1><p className="page-description">체험 데이터와 연결 상태를 관리하세요.</p><NavigationCard to="/settings/privacy" title="동의와 로컬 데이터" description="체험 확인 철회·메모리 데이터 삭제" icon={ShieldCheck} /><NavigationCard to="/device" title="기기 관리" description="모의 연결과 동기화" icon={Link2} /><NavigationCard to="/subscription" title="구독 체험" description="가상 구성·신청 상태 확인" icon={ShoppingBag} /><aside className="mock-notice"><strong>로그인 없이 사용하는 로컬 프로토타입</strong><p>체험 기록은 현재 탭의 메모리에만 있어요. 새로고침·탭 종료 시 초기화되며 다른 탭과 공유하지 않습니다.</p></aside></div>;
}

export function PrivacyPage() {
  const assessment = useAssessment();
  const brushing = useBrushing();
  const subscription = useSubscription();
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<DeleteResult | null>(null);
  const [failure, setFailure] = useState('none');
  const [params] = useSearchParams();
  async function remove() {
    if (!confirmed || busy) return;
    setBusy(true); setResult(null);
    const outcome = await deleteLocalData({
      assessment: () => assessmentService.reset(),
      brushing: () => { if (failure === 'brushing') throw new Error('DEMO_DELETE_FAILED'); brushingService.reset(); },
      subscription: () => subscriptionService.reset(),
    });
    setResult(outcome); setBusy(false); setConfirmed(false);
  }
  return <div className="content-page commerce-page"><div className="page-eyebrow">PRIVACY · LOCAL ONLY</div><h1>동의와 로컬 데이터</h1><p className="page-description">현재 탭의 체험 확인과 데이터만 관리해요.</p>
    <section className="privacy-section"><h2>체험 확인 상태</h2><div className="privacy-card"><strong>가상 설문 체험 · {assessment.consent ? '확인함' : '확인 전'}</strong><p>가상 응답 {Object.keys(assessment.responses).length}개 · 결과 {assessment.result ? '있음' : '없음'}</p><button className="secondary-link full-width" disabled={!assessment.consent || busy} onClick={() => { assessmentService.setConsent(false); setResult(null); }}>설문 체험 확인 철회</button><small>응답·결과를 비우고 진행 중 결과를 폐기해요.</small></div>
    <div className="privacy-card"><strong>구독 체험 · {subscription.draft.consent ? '확인함' : '확인 전'}</strong><p>가상 요청 {subscription.intent ? subscription.intent.status === 'demo_withdrawn' ? '철회됨' : '있음' : '없음'}</p><button className="secondary-link full-width" disabled={(!subscription.draft.consent && !subscription.intent && subscription.status !== 'pending') || busy} onClick={() => { subscriptionService.reset(); setResult(null); }}>구독 체험 확인 철회</button><small>구독 구성·가상 요청을 지우고 처리 중 요청을 중단해요.</small></div>
    <div className="privacy-card"><strong>영상 동의 · 화면 이탈로 초기화</strong><p>영상 화면에서만 별도로 확인합니다. 이 화면으로 이동하면 선택 정보·모의 결과·동의가 정리돼요. 원본·파일명은 저장하거나 전송하지 않아요.</p><Link className="inline-link" to="/video-analysis">영상 체험 안내 보기</Link></div></section>
    <section className="privacy-section"><h2>로컬 체험 데이터 삭제</h2><p>양치 기록 {brushing.sessions.length}건. 아래 대상 전체를 현재 탭 메모리에서 삭제하며 진행 중 작업도 무효화해요.</p><ul className="delete-targets">{Object.entries(targetLabels).map(([key, label]) => <li key={key}>{label}</li>)}</ul><p className="source-note">이 프로토타입의 영속 저장소에는 체험 데이터를 쓰지 않습니다. 다른 탭·판매처의 회원/주문 정보·서버 데이터는 이 버튼으로 삭제되지 않아요. 실제 계정 탈퇴·서버 삭제 요청은 제공하지 않습니다.</p>
      <label className="consent-row"><input type="checkbox" checked={confirmed} disabled={busy} onChange={event => setConfirmed(event.target.checked)} /><span>위 대상을 삭제하면 현재 탭에서 복구할 수 없음을 확인했어요.</span></label><button className="danger-button full-width" disabled={!confirmed || busy} onClick={() => { void remove(); }}>{busy ? '삭제 중…' : '로컬 데이터 삭제'}</button><button className="secondary-link full-width" disabled={!confirmed || busy} onClick={() => setConfirmed(false)}>삭제 취소</button>
      {result && <div className={result.failed.length ? 'delete-outcome failed' : 'delete-outcome'} role="status"><strong>{result.failed.length ? '일부 데이터를 삭제하지 못했어요' : '로컬 체험 데이터를 삭제했어요'}</strong><p>삭제 처리: {result.removed.map(key => targetLabels[key]).join(', ') || '없음'}</p>{result.failed.length > 0 && <p>미삭제: {result.failed.map(key => targetLabels[key]).join(', ')}. 해당 데이터는 남아 있어요. 다시 확인 후 삭제를 재시도하세요.</p>}<small>외부 판매처·다른 탭의 데이터는 대상에 포함되지 않습니다.</small></div>}
    </section>
    {import.meta.env.DEV && params.get('demoDebug') === '1' && <details className="debug-panel"><summary>개발용 삭제 시나리오</summary><label>삭제 처리<select value={failure} onChange={event => { setFailure(event.target.value); setResult(null); }}><option value="none">전체 정상</option><option value="brushing">양치 데이터 삭제 실패</option></select></label></details>}
  </div>;
}

import { ArrowUpRight, ClipboardList, Link2, ShieldCheck, ShoppingBag, Sparkles, Smile } from 'lucide-react';
import { Link } from 'react-router';
import { NavigationCard } from '../components/NavigationCard';
import { useAssessment } from '../state/assessmentStore';
import { useBrushing } from '../state/brushingStore';
import { connectionLabels } from '../components/DeviceState';
import { dateTimeLabel } from '../domain/brushing';
import { useSubscription } from '../state/subscriptionStore';

export function HomePage() {
  const { result, revision, status } = useAssessment();
  const current = result?.revision === revision ? result : null;
  const brushing = useBrushing();
  const subscription = useSubscription();
  return (
    <div className="home-page">
      <div className="page-eyebrow"><span className="status-dot" />프로토타입 · 가상 응답 데모</div>
      <section className="home-intro">
        <p className="eyebrow">나를 위한 구강 관리</p>
        <h1>매일의 작은 관리,<br />나에게 맞는 Oneway.</h1>
        <p>구강 상태부터 양치 습관까지.<br />하나의 공간에서 살펴보세요.</p>
        <Link className="primary-link" to={current ? `/assessment/${current.id}` : '/assessment'}>{current ? '데모 결과 이어보기' : '구강 테스트 시작하기'}<ArrowUpRight size={19} aria-hidden="true" /></Link>
        <span className="hero-decoration" aria-hidden="true"><Smile size={106} strokeWidth={0.8} /></span>
      </section>

      <section className="home-section" aria-labelledby="care-title">
        <div className="section-heading"><div><p className="eyebrow">My oral care</p><h2 id="care-title">나의 구강 관리</h2></div><span className="section-caption">맞춤 케어 체험</span></div>
        <div className="quick-links">
          <Link to="/brushing"><span className="quick-icon blue"><ClipboardList aria-hidden="true" /></span><span>구강 기록</span></Link>
          <Link to={current ? `/assessment/${current.id}` : '/assessment'}><span className="quick-icon violet"><Sparkles aria-hidden="true" /></span><span>맞춤 케어</span></Link>
          <Link to="/products"><span className="quick-icon cyan"><ShoppingBag aria-hidden="true" /></span><span>케어도구</span></Link>
        </div>
      </section>

      <section className="home-summary" aria-label="데모 상태 요약">
        <strong>{status === 'pending' ? '모의 분석 중이에요' : current ? '이번 체험의 결과가 있어요' : status === 'failed' || status === 'low-confidence' ? '데모 결과를 만들지 않았어요' : '아직 구강 테스트 결과가 없어요'}</strong>
        <p>{current ? `${current.items.filter(item => item.position !== null).length}개 항목의 가상 응답 표시 · 새로고침 시 초기화` : '가상 응답으로 테스트를 완료하면 결과를 이어볼 수 있어요.'}</p>
        <span>기기 상태 · {connectionLabels[brushing.connection]}<br />예시 기록 {brushing.sessions.length}건 · 마지막 정상 동기화 {dateTimeLabel(brushing.lastSync)}</span>
        <Link className="inline-link" to={subscription.intent ? `/subscription/status/${subscription.intent.id}` : '/subscription'}>{subscription.status === 'pending' ? '가상 구독 요청 처리 중' : subscription.intent ? subscription.intent.status === 'demo_withdrawn' ? '철회한 가상 요청 보기' : '가상 구독 요청 상태 보기 · 실제 주문 아님' : '구독 구성 체험하기'}</Link>
      </section>

      <section className="home-section" aria-labelledby="connection-title">
        <h2 id="connection-title" className="mb-3">연결과 관리</h2>
        <NavigationCard to="/device" title="기기 관리" description="모의 연결·예시 기록 동기화" icon={Link2} />
        <NavigationCard to="/settings/privacy" title="개인정보 안내" description="체험 확인 철회·로컬 데이터 삭제" icon={ShieldCheck} />
      </section>
      <aside className="scope-note"><strong>가상 응답으로 체험하는 프로토타입</strong><p>테스트·조언·추천·기기·영상·구독 신청은 모의 기능입니다. 실제 건강정보나 개인 영상을 입력하지 마세요. 상품은 원웨이 자사몰로 연결됩니다.</p></aside>
    </div>
  );
}

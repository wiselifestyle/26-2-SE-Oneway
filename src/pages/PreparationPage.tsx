import { ClipboardList, Link2, Package, ShieldCheck, Video } from 'lucide-react';
import { StateNotice } from '../components/StateNotice';
import { NavigationCard } from '../components/NavigationCard';
import type { Screen } from '../routes/screens';

export function PreparationPage({ screen }: { screen: Screen }) {
  return (
    <div className="content-page">
      <div className="page-eyebrow">화면 미리보기 · Phase 1</div>
      <h1>{screen.title}</h1>
      <p className="page-description">{screen.description}</p>
      <StateNotice title={`Phase ${screen.phase} 구현 예정`} description="현재는 화면 구성과 이동 경로를 확인할 수 있어요. 기능은 다음 단계 승인 후 제공됩니다." />
      {screen.id === 'S06' && <section className="related-links" aria-label="양치 관리 관련 화면">
        <NavigationCard to="/device" title="기기 관리" description="연결 화면 안내" icon={Link2} />
        <NavigationCard to="/video-analysis" title="영상 분석" description="영상 입력 화면 안내" icon={Video} />
      </section>}
      {screen.id === 'S08' && <section className="related-links" aria-label="제품 관련 화면">
        <NavigationCard to="/recommendations" title="추천 팁" description="추천 화면 안내 · Phase 2" icon={Package} />
        <NavigationCard to="/subscription" title="구독 구성" description="구독 화면 안내 · Phase 4" icon={ClipboardList} />
        <NavigationCard to="/sales-channels" title="판매 경로" description="판매 정보 미확정" icon={Link2} />
      </section>}
      {screen.id === 'S13' && <section className="related-links" aria-label="설정 관련 화면">
        <NavigationCard to="/settings/privacy" title="개인정보 관리" description="동의·삭제 화면 안내" icon={ShieldCheck} />
        <NavigationCard to="/device" title="기기 관리" description="연결 화면 안내" icon={Link2} />
      </section>}
      <aside className="scope-note"><strong>Oneway 모바일 웹 프로토타입</strong><p>실제 진단·기기 연결·결제·배송을 수행하지 않습니다.</p></aside>
    </div>
  );
}

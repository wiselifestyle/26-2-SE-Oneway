import { Link, useParams } from 'react-router';
import type { CSSProperties } from 'react';
import { dateTimeLabel, durationLabel } from '../domain/brushing';
import { useBrushing } from '../state/brushingStore';
import { MockNotice } from '../components/MockNotice';
import { StateNotice } from '../components/StateNotice';

export function BrushingDetailPage() {
  const { sessionId } = useParams();
  const state = useBrushing();
  const session = state.sessions.find(s => s.id === sessionId);
  return <div className="content-page brushing-page"><div className="page-eyebrow">SESSION · 예시 기록</div><h1>양치 상세</h1><MockNotice />
    {!session ? <><StateNotice kind="empty" title="해당 기록이 없어요" description="새로고침하면 메모리의 예시 기록이 초기화됩니다. 양치 관리에서 다시 동기화하세요." /><Link className="secondary-link" to="/brushing">양치 관리로 이동</Link></> : <>
      <p className="result-time">{dateTimeLabel(session.recordedAt)} · {state.connection === 'mock-connected' ? '모의 수신 기록' : '과거 예시 기록'}</p>
      <div className={`score-circle ${session.score === null ? 'missing' : ''}`} style={{ '--score': `${session.score ?? 0}%` } as CSSProperties}><strong>{session.score ?? '—'}</strong><span>{session.score === null ? '점수 미수신' : '데모 양치 점수'}</span></div>
      <section className="brushing-metrics two" aria-label="한 번의 양치 예시 지표"><div><strong>{durationLabel(session.duration)}</strong><span>양치 시간</span></div><div><strong>{session.coverage === null ? '미수신' : `${session.coverage}%`}</strong><span>커버리지</span></div></section>
      <section className="region-section"><h2>영역별 예시 커버리지</h2><p className="form-hint">6개 구역의 데모 데이터입니다. 치아별 센서 측정이나 압력 분석이 아닙니다.</p>
        {session.regions ? <div className="region-grid">{session.regions.map(region => <div key={region.label}><span>{region.label}</span><strong>{region.coverage === null ? '미수신' : `${region.coverage}%`}</strong></div>)}</div> : <p className="empty-region">영역 데이터 미수신</p>}
      </section>
      <Link className="primary-link full-width" to={`/video-analysis?session=${encodeURIComponent(session.id)}`}>이 기록에서 영상 체험하기</Link><Link className="secondary-link" to="/brushing">기록 목록으로</Link>
    </>}
  </div>;
}

import { Link } from 'react-router';
import { brushingSummary, dateTimeLabel, durationLabel, periods } from '../domain/brushing';
import type { Period } from '../domain/brushing';
import { brushingService, useBrushing } from '../state/brushingStore';
import { MockNotice } from '../components/MockNotice';
import { DeviceState } from '../components/DeviceState';
import { StateNotice } from '../components/StateNotice';
import { CoverageChart } from '../components/CoverageChart';

export function BrushingPage() {
  const state = useBrushing();
  const summary = brushingSummary(state.sessions, state.period, Date.now());
  return <div className="content-page brushing-page"><div className="page-eyebrow">BRUSHING · 예시 기록</div><h1>양치 관리</h1>
    <MockNotice /><DeviceState />
    <div className="brushing-tools"><Link className="secondary-link" to="/device">기기 연결·동기화</Link><Link className="secondary-link" to="/video-analysis">영상 모의 분석</Link></div>
    <label className="period-selector">조회 기간<select aria-label="조회 기간" value={state.period} onChange={e => brushingService.setPeriod(Number(e.target.value) as Period)}>{periods.map(period => <option value={period} key={period}>최근 {period}일</option>)}</select></label>
    {summary.records.length ? <>
      <section className="brushing-metrics" aria-label="기간별 예시 통계">
        <div><strong>{durationLabel(summary.duration.value)}</strong><span>평균 양치 시간</span><small>수신 {summary.duration.count}건</small></div>
        <div><strong>{summary.frequency}<small>회/일</small></strong><span>기간 내 횟수</span><small>{summary.records.length}건 / {state.period}일</small></div>
        <div><strong>{summary.coverage.value === null ? '미수신' : `${summary.coverage.value}%`}</strong><span>평균 커버리지</span><small>수신 {summary.coverage.count}건</small></div>
      </section>
      <CoverageChart days={summary.days} />
      <section className="session-list" aria-label="양치 예시 기록"><h2>기록 <small>{summary.records.length}건 · 데모</small></h2>{summary.records.map(session => <Link key={session.id} to={`/brushing/${session.id}`} className="session-link"><strong>{dateTimeLabel(session.recordedAt)}</strong><span>시간 {durationLabel(session.duration)} · 커버리지 {session.coverage === null ? '미수신' : `${session.coverage}%`}</span><small>점수 {session.score === null ? '미수신' : `${session.score}점`} · 상세 보기 →</small></Link>)}</section>
    </> : <StateNotice kind="empty" title={state.connection === 'mock-connected' ? '조회할 기록이 없어요' : '아직 예시 기록이 없어요'} description={state.sessions.length ? '선택한 기간에 해당하는 기록이 없어요. 다른 기간을 선택하세요.' : state.connection === 'mock-connected' ? '기기는 모의 연결 상태예요. 기기 관리에서 예시 기록 동기화를 실행하세요.' : '기기 관리에서 시연용 기기를 연결하고 예시 기록을 받아보세요.'} />}
  </div>;
}

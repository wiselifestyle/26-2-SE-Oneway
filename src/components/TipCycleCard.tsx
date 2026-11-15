import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { demoTipCycleDays, kstDateInput, tipCycle } from '../domain/tipCycle';
import { brushingService, useBrushing } from '../state/brushingStore';

// RE-C4: usage gauge for the replacement tip, linked to the subscription flow.
export function TipCycleCard() {
  const { tipReplacedOn } = useBrushing();
  const now = Date.now();
  const cycle = tipCycle(tipReplacedOn, now);
  const status = !tipReplacedOn ? '마지막 교체일을 기록해보세요'
    : !cycle ? '올바른 교체일이 아니에요'
      : cycle.level === 'replace' ? '교체 시기가 지났어요' : `교체까지 ${cycle.remainingDays}일 남았어요`;
  const hint = !tipReplacedOn ? '교체일을 넣으면 사용 기간을 계산하고, 교체 시기가 다가오면 홈에서 알려드려요.'
    : !cycle ? '오늘 이전 날짜를 선택해주세요.'
      : cycle.level === 'replace' ? '새 팁으로 바꾼 뒤 교체일을 다시 기록하세요.' : cycle.level === 'soon' ? '교체 시기가 다가오고 있어요. 미리 준비해두세요.' : '아직 여유가 있어요.';
  return <section className={`tip-cycle ${cycle?.level ?? 'unset'}`} aria-labelledby="tip-cycle-title">
    <div className="tip-cycle-head"><h2 id="tip-cycle-title">팁 사용 기간</h2><span className="demo-pill">권장 주기 {demoTipCycleDays}일 · 데모 가정</span></div>
    <div className="tip-cycle-body">
      <div className="tip-ring" role="img" aria-label={cycle ? `사용 ${cycle.usedDays}일, 권장 주기의 ${Math.round(cycle.ratio * 100)}%` : '교체일 미입력'} style={{ '--tip': `${cycle ? Math.min(cycle.ratio, 1) * 100 : 0}%` } as CSSProperties}>
        <strong>{cycle ? cycle.usedDays : '—'}</strong><span>{cycle ? '일 사용' : '미입력'}</span>
      </div>
      <div className="tip-cycle-text">
        <strong role="status">{status}</strong>
        <p>{hint}</p>
        <label className="tip-date">마지막 교체일<input type="date" max={kstDateInput(now)} value={tipReplacedOn ?? ''} onChange={event => brushingService.setTipReplacedOn(event.target.value)} /></label>
      </div>
    </div>
    {cycle && cycle.level !== 'ok' && <Link className="primary-link full-width" to="/subscription">교체용 팁 구독 구성 보기</Link>}
    <details className="tip-why"><summary>왜 팁을 교체해야 하나요?</summary><p>팁은 쓰면서 조금씩 마모·변형되거나 오염될 수 있어, 같은 시간을 써도 관리 효과가 달라질 수 있어요. 정확한 교체 주기는 제품 설명서와 판매처 안내를 확인하세요. 이 화면의 {demoTipCycleDays}일은 화면 체험을 위한 데모 가정입니다.</p></details>
  </section>;
}

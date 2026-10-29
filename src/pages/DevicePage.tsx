import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import type { ConnectionScenario, SyncScenario } from '../domain/brushing';
import { brushingService, useBrushing } from '../state/brushingStore';
import { DeviceState } from '../components/DeviceState';
import { MockNotice } from '../components/MockNotice';

export function DevicePage() {
  const state = useBrushing();
  const [search] = useSearchParams();
  const [connectionScenario, setConnectionScenario] = useState<ConnectionScenario>('success');
  const [syncScenario, setSyncScenario] = useState<SyncScenario>('success');
  const syncing = state.syncStatus === 'pending' || state.syncStatus === 'retrying';
  return <div className="content-page brushing-page">
    <div className="page-eyebrow">DEVICE · 시뮬레이션</div><h1>기기 관리</h1>
    <p className="page-description">시연용 기기의 연결과 기록 동기화를 체험해보세요.</p>
    <MockNotice /><DeviceState />
    {state.connection === 'mock-connected' ? <>
      <button className="primary-link full-width" disabled={syncing} onClick={() => void brushingService.sync(syncScenario)}>{syncing ? '모의 동기화 중…' : '예시 기록 동기화'}</button>
      {syncing && <button className="secondary-link full-width" onClick={() => brushingService.cancelSync()}>동기화 중단</button>}
      {state.syncStatus === 'failed' && <button className="secondary-link full-width" onClick={() => { setSyncScenario('success'); void brushingService.sync(); }}>정상 시나리오로 다시 동기화</button>}
      <button className="secondary-link full-width" onClick={() => brushingService.disconnect()}>모의 연결 해제</button>
    </> : <>
      <button className="primary-link full-width" disabled={state.connection === 'connecting'} onClick={() => void brushingService.connect(connectionScenario)}>{state.connection === 'connecting' ? '모의 연결 중…' : '시연용 기기 연결'}</button>
      {state.connection === 'connecting' && <button className="secondary-link full-width" onClick={() => brushingService.disconnect()}>연결 시도 중단</button>}
      {state.connection === 'error' && <button className="secondary-link full-width" onClick={() => { setConnectionScenario('success'); void brushingService.connect(); }}>정상 시나리오로 다시 연결</button>}
    </>}
    <Link className="secondary-link" to="/brushing">양치 기록 보기</Link>
    {import.meta.env.DEV && search.get('demoDebug') === '1' && <details className="debug-panel"><summary>개발자 기기 시나리오</summary>
      <label>연결 응답<select aria-label="연결 시나리오" value={connectionScenario} disabled={state.connection === 'connecting' || syncing} onChange={e => setConnectionScenario(e.target.value as ConnectionScenario)}>
        <option value="success">정상</option><option value="denied">모의 권한 거절</option><option value="timeout">시간 초과</option><option value="unavailable">연결 불가</option>
      </select></label>
      <label>동기화 응답<select aria-label="동기화 시나리오" value={syncScenario} disabled={syncing} onChange={e => setSyncScenario(e.target.value as SyncScenario)}>
        <option value="success">정상·중복 이벤트</option><option value="flaky">2회 실패 후 회복</option><option value="failed">전송 실패</option><option value="empty">빈 목록</option><option value="invalid">잘못된 데이터</option>
      </select></label>
    </details>}
    <aside className="scope-note"><p>기록과 상태는 현재 탭의 메모리에만 있습니다. 해제·전송 실패 시 과거 기록은 유지되며, 새로고침하면 초기화됩니다.</p></aside>
  </div>;
}

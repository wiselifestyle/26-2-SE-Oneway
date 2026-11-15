import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import type { ConnectionScenario, SyncScenario } from '../domain/brushing';
import { brushingService, useBrushing } from '../state/brushingStore';
import { DeviceState } from '../components/DeviceState';
import { MockNotice } from '../components/MockNotice';
import { Activity, Bluetooth, ShieldCheck } from 'lucide-react';

// RE-C5: cause-specific checklist shown next to the retry button.
const troubleshootSteps = {
  denied: ['휴대폰 설정에서 블루투스·주변 기기 권한을 허용했는지 확인하세요.', '권한을 거절했다면 앱 설정 화면에서 다시 허용할 수 있어요.', '허용한 뒤 아래에서 다시 연결하세요.'],
  timeout: ['기기 전원이 켜져 있고 충전되어 있는지 확인하세요.', '기기를 휴대폰 가까이(약 1m 이내) 두세요.', '다른 휴대폰과 연결되어 있다면 연결을 해제한 뒤 다시 시도하세요.'],
  unavailable: ['기기 전원 버튼을 눌러 켜져 있는지 확인하세요.', '기기가 연결 대기 상태인지 설명서를 확인하세요.', '휴대폰 블루투스를 껐다 켠 뒤 다시 연결하세요.'],
};

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
      {state.connection === 'disconnected' && <section className="connect-guide" aria-labelledby="connect-guide-title"><h2 id="connect-guide-title">연결하면 이렇게 쓰여요</h2><ul>
        <li><Activity size={18} aria-hidden="true" /><span>양치 시간·점수·커버리지 예시 기록을 받아 양치 관리와 홈 카드에 보여줘요.</span></li>
        <li><Bluetooth size={18} aria-hidden="true" /><span>시연용 모의 연결이에요. 실제 기기 검색이나 휴대폰 권한 요청은 하지 않아요.</span></li>
        <li><ShieldCheck size={18} aria-hidden="true" /><span>받은 기록은 현재 탭 메모리에만 있고, 설정에서 언제든 삭제할 수 있어요.</span></li>
      </ul></section>}
      {state.connection === 'error' && <section className="troubleshoot" aria-labelledby="troubleshoot-title"><h2 id="troubleshoot-title">이렇게 해결해보세요</h2><p className="form-hint">실제 서비스에서 안내할 점검 항목 예시예요.</p><ol>{troubleshootSteps[state.connectionErrorKind === 'denied' || state.connectionErrorKind === 'timeout' ? state.connectionErrorKind : 'unavailable'].map(step => <li key={step}>{step}</li>)}</ol></section>}
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

import { dateTimeLabel } from '../domain/brushing';
import { useBrushing } from '../state/brushingStore';

export const connectionLabels = { disconnected: '미연결', connecting: '모의 연결 시도 중', 'mock-connected': '모의 연결됨', error: '모의 연결 실패' };
export function DeviceState() {
  const state = useBrushing();
  return <section className="device-status" aria-label="기기와 동기화 상태">
    <div><span className={`connection-dot ${state.connection}`} /><strong>{connectionLabels[state.connection]}</strong></div>
    <p>마지막 정상 동기화 · {dateTimeLabel(state.lastSync)}</p>
    {state.connectionError && <p role="alert" className="dark-error">{state.connectionError}</p>}
    <div role="status" aria-live="polite">{state.syncStatus === 'pending' ? '모의 데이터를 수신하고 있어요.' : state.syncStatus === 'retrying' ? `전송 보류 · 재시도 ${state.retry}/3 · ${state.delay}초 후` : state.syncStatus === 'success' ? `모의 동기화 완료 · 보관 중인 예시 기록 ${state.sessions.length}건` : state.syncStatus === 'failed' ? '새 동기화를 완료하지 못했어요. 마지막 정상 기록을 유지합니다.' : state.connection === 'disconnected' && state.sessions.length ? '과거 예시 기록입니다. 새 데이터로 갱신된 상태가 아니에요.' : '동기화를 실행하면 예시 기록을 받을 수 있어요.'}</div>
    {state.syncError && <p role="alert" className="dark-error">{state.syncError}</p>}
  </section>;
}

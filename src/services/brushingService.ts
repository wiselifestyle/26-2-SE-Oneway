import { mergeSessions } from '../domain/brushing.ts';
import type { BrushingSession, ConnectionScenario, Period, SyncScenario } from '../domain/brushing.ts';
import { wait } from './wait.ts';

export interface DeviceAdapter {
  connect(scenario: ConnectionScenario, signal: AbortSignal): Promise<void>;
  sync(scenario: SyncScenario, attempt: number, signal: AbortSignal): Promise<unknown>;
}
export type BrushingState = { connection: 'disconnected' | 'connecting' | 'mock-connected' | 'error'; connectionError: string | null;
  syncStatus: 'idle' | 'pending' | 'retrying' | 'success' | 'failed'; syncError: string | null; retry: number; delay: number;
  sessions: BrushingSession[]; lastSync: string | null; period: Period };
export const connectionMessages = {
  denied: '모의 권한 거절 상태예요. 실제 기기 권한은 요청하지 않았어요.', timeout: '모의 연결 시간이 초과되었어요. 다시 시도하거나 중단하세요.',
  unavailable: '시연용 기기를 찾지 못했어요. 실제 기기를 검색한 결과는 아닙니다.',
};

export function createBrushingService(adapter: DeviceAdapter, now = () => Date.now(), sleep = wait) {
  let state: BrushingState = { connection: 'disconnected', connectionError: null, syncStatus: 'idle', syncError: null, retry: 0, delay: 0, sessions: [], lastSync: null, period: 14 };
  let connectionRequest: AbortController | null = null;
  let syncRequest: AbortController | null = null;
  const listeners = new Set<() => void>();
  function update(patch: Partial<BrushingState>) { state = { ...state, ...patch }; for (const listener of listeners) listener(); }
  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    reset() {
      connectionRequest?.abort(); syncRequest?.abort(); connectionRequest = null; syncRequest = null;
      update({ connection: 'disconnected', connectionError: null, syncStatus: 'idle', syncError: null, retry: 0, delay: 0, sessions: [], lastSync: null, period: 14 });
    },
    setPeriod(period: Period) { update({ period }); },
    async connect(scenario: ConnectionScenario = 'success') {
      if (state.connection === 'connecting' || state.connection === 'mock-connected') return;
      const request = new AbortController(); connectionRequest = request;
      update({ connection: 'connecting', connectionError: null });
      try {
        await adapter.connect(scenario, request.signal);
        if (!request.signal.aborted && connectionRequest === request) update({ connection: 'mock-connected' });
      } catch {
        if (!request.signal.aborted && connectionRequest === request) update({ connection: 'error', connectionError: connectionMessages[scenario as keyof typeof connectionMessages] ?? '모의 연결에 실패했어요. 다시 시도하세요.' });
      }
    },
    disconnect() {
      connectionRequest?.abort(); syncRequest?.abort(); connectionRequest = null; syncRequest = null;
      update({ connection: 'disconnected', connectionError: null, syncStatus: 'idle', syncError: null, retry: 0, delay: 0 });
    },
    cancelSync() {
      syncRequest?.abort(); syncRequest = null;
      update({ syncStatus: 'idle', syncError: null, retry: 0, delay: 0 });
    },
    async sync(scenario: SyncScenario = 'success') {
      if (state.connection !== 'mock-connected' || state.syncStatus === 'pending' || state.syncStatus === 'retrying') return;
      const request = new AbortController(); syncRequest = request;
      const delays = [1000, 3000, 10000];
      update({ syncStatus: 'pending', syncError: null, retry: 0, delay: 0 });
      for (let attempt = 0; attempt <= delays.length; attempt++) {
        try {
          const response = await adapter.sync(scenario, attempt, request.signal);
          if (request.signal.aborted || syncRequest !== request) return;
          const sessions = mergeSessions(state.sessions, response);
          update({ sessions, lastSync: new Date(now()).toISOString(), syncStatus: 'success', retry: 0, delay: 0 });
          return;
        } catch (error) {
          if (request.signal.aborted || syncRequest !== request) return;
          const invalid = error instanceof Error && error.message === 'INVALID_DATA';
          if (invalid || attempt === delays.length) {
            update({ syncStatus: 'failed', retry: 0, delay: 0, syncError: invalid ? '수신 데이터 형식이 올바르지 않아 반영하지 않았어요. 과거 기록은 유지됩니다.' : '모의 전송에 실패했어요. 자동 재시도 3회를 마쳤으며 과거 기록은 유지됩니다.' });
            return;
          }
          update({ syncStatus: 'retrying', retry: attempt + 1, delay: delays[attempt] / 1000 });
          try { await sleep(delays[attempt], request.signal); } catch { return; }
          if (request.signal.aborted || syncRequest !== request) return;
          update({ syncStatus: 'pending' });
        }
      }
    },
  };
}

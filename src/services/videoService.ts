import { validVideoHeader, videoMeta } from '../domain/video.ts';
import type { VideoMeta, VideoScenario } from '../domain/video.ts';
export interface LocalVideo { name: string; size: number; type: string; slice(start: number, end: number): { arrayBuffer(): Promise<ArrayBuffer> } }
export interface VideoAdapter { analyze(scenario: VideoScenario, signal: AbortSignal): Promise<VideoScenario> }
export type VideoState = { consent: 'undecided' | 'accepted' | 'declined'; meta: VideoMeta | null; status: 'idle' | 'checking' | 'ready' | 'pending' | VideoScenario; error: string | null };
export function createVideoService(adapter: VideoAdapter) {
  let state: VideoState = { consent: 'undecided', meta: null, status: 'idle', error: null };
  let token = 0;
  let request: AbortController | null = null;
  const listeners = new Set<() => void>();
  function update(patch: Partial<VideoState>) { state = { ...state, ...patch }; for (const listener of listeners) listener(); }
  function invalidate() { token++; request?.abort(); request = null; }
  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    consent(accepted: boolean) { invalidate(); update({ consent: accepted ? 'accepted' : 'declined', meta: null, status: 'idle', error: null }); },
    clear() { invalidate(); update({ meta: null, status: 'idle', error: null }); },
    dispose() { invalidate(); update({ consent: 'undecided', meta: null, status: 'idle', error: null }); },
    async select(file: LocalVideo | null) {
      if (!file || state.consent !== 'accepted') return;
      invalidate(); const current = token;
      update({ meta: null, status: 'checking', error: null });
      try {
        const meta = videoMeta(file.name, file.size, file.type);
        const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
        if (current !== token || state.consent !== 'accepted') return;
        if (!validVideoHeader(meta, bytes)) throw new Error('INVALID_HEADER');
        update({ meta, status: 'ready' });
      } catch (error) {
        if (current === token) update({ status: 'idle', meta: null, error: error instanceof Error && /^(빈 파일|20MiB|MP4|확장자)/.test(error.message) ? error.message : '형식 헤더를 확인할 수 없어요. 손상되지 않은 시연용 영상을 선택하세요.' });
      }
    },
    async analyze(scenario: VideoScenario = 'success') {
      if (state.consent !== 'accepted' || !state.meta || state.status === 'pending') return;
      invalidate(); const current = token; const controller = new AbortController(); request = controller;
      update({ status: 'pending', error: null });
      try {
        const status = await adapter.analyze(scenario, controller.signal);
        if (current === token && !controller.signal.aborted) update({ status });
      } catch {
        if (current === token && !controller.signal.aborted) update({ status: 'failed' });
      }
    },
  };
}

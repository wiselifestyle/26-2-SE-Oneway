import { useEffect, useState, useSyncExternalStore } from 'react';
import type { ChangeEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import type { VideoScenario } from '../domain/video';
import { createVideoService } from '../services/videoService';
import { videoAdapter } from '../mocks/videoAdapter';
import { useBrushing } from '../state/brushingStore';
import { MockNotice } from '../components/MockNotice';

export function VideoPage() {
  const [service] = useState(() => createVideoService(videoAdapter));
  const state = useSyncExternalStore(service.subscribe, service.getSnapshot);
  const [scenario, setScenario] = useState<VideoScenario>('success');
  const [search] = useSearchParams();
  const brushing = useBrushing();
  const sessionId = search.get('session');
  const session = brushing.sessions.find(s => s.id === sessionId);
  useEffect(() => () => service.dispose(), [service, sessionId]);
  async function select(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    await service.select(input.files?.[0] ?? null);
    input.value = '';
  }
  return <div className="content-page video-page"><div className="page-eyebrow">VIDEO · 로컬 검사</div><h1>영상 모의 분석</h1><MockNotice video />
    <p className="page-description">개인이나 구강이 식별되지 않는 시연용 영상만 선택하세요. 파일명은 화면·기록·로그에 보관하지 않습니다.</p>
    {sessionId && <p className="session-context">{session ? '양치 예시 기록에서 진입했어요. 영상 결과로 기기 지표를 바꾸지 않습니다.' : '연결할 양치 기록이 없어 독립 영상 체험으로 진행해요.'}</p>}
    <section className="video-consent" aria-label="영상 이용 동의"><h2>영상 이용 안내</h2><p>동의하면 이 화면에서 로컬 파일의 형식·크기만 검사합니다. 검사 후 파일 참조를 해제하며, 서버 전송·저장·실제 판독은 수행하지 않습니다.</p>
      <label className="consent-box"><input type="checkbox" checked={state.consent === 'accepted'} onChange={e => service.consent(e.target.checked)} /><span>시연용 영상의 로컬 검사에 동의합니다.</span></label>
      {state.consent !== 'accepted' && <button className="text-button" onClick={() => service.consent(false)}>동의하지 않음</button>}
      {state.consent === 'declined' && <p role="status">동의하지 않아 파일 선택과 분석을 시작하지 않았어요. 아래 링크로 양치 관리에 돌아갈 수 있어요.</p>}
    </section>
    <section className="video-input" aria-label="영상 파일 선택"><label htmlFor="demo-video-file" className="file-label">시연용 영상 선택</label><input id="demo-video-file" type="file" accept=".mp4,.webm,video/mp4,video/webm" disabled={state.consent !== 'accepted'} onChange={event => void select(event)} />
      <p className="form-hint">MP4/WebM · 0바이트 초과~20MiB. 확장자·MIME·헤더 검사이며 재생 가능성·길이·화질을 검증하지 않습니다.</p>
      {state.error && <p className="field-error" role="alert">{state.error}</p>}
      <div className="video-input-status" role="status">{state.status === 'checking' ? '파일 형식을 확인하고 있어요.' : state.meta ? `검사된 입력 · ${state.meta.kind.toUpperCase()} · ${(state.meta.size / 1024).toFixed(1)}KiB` : '선택된 영상 없음'}</div>
      {state.meta && <button className="text-button" onClick={() => service.clear()}>선택 해제·결과 지우기</button>}
    </section>
    <button className="primary-link full-width" disabled={!state.meta || state.consent !== 'accepted' || state.status === 'pending'} onClick={() => void service.analyze(scenario)}>{state.status === 'pending' ? '모의 처리 중…' : '모의 분석 시작'}</button>
    {state.status === 'pending' && <><p role="status" className="form-hint">실제 영상 판독 없이 모의 응답을 기다리고 있어요.</p><button className="secondary-link full-width" onClick={() => service.clear()}>모의 처리 중단·선택 해제</button></>}
    {state.status === 'success' && <section className="video-outcome" aria-label="영상 모의 결과"><h2>모의 처리 완료</h2><p>내용을 판독한 결과가 아닙니다. 점수·질환·양치 영역을 영상에서 산출하지 않았어요.</p><h3>개선 안내 예시</h3><p>다음 촬영 전에 칫솔 움직임이 화면 안에 보이는지 확인하는 안내를 예시로 보여드립니다. 현재 파일에서 문제를 발견했다는 뜻은 아닙니다.</p></section>}
    {(state.status === 'failed' || state.status === 'low-quality' || state.status === 'low-confidence') && <section className="error-panel" role="alert"><h2>{state.status === 'failed' ? '모의 분석에 실패했어요' : state.status === 'low-quality' ? '저품질 시나리오 · 결과 보류' : '저신뢰 시나리오 · 결과 보류'}</h2><p>실제 파일의 품질이나 신뢰도를 판정한 것이 아닙니다. 결과를 생성하지 않았어요. 시연용 영상을 바꾸거나 다시 촬영한 입력으로 체험할 수 있어요.</p><button className="text-button" onClick={() => { setScenario('success'); void service.analyze(); }}>정상 시나리오로 다시 시도</button></section>}
    {import.meta.env.DEV && search.get('demoDebug') === '1' && <details className="debug-panel"><summary>개발자 영상 시나리오</summary><label>모의 응답<select aria-label="영상 시나리오" value={scenario} disabled={state.status === 'pending'} onChange={e => setScenario(e.target.value as VideoScenario)}><option value="success">정상</option><option value="failed">분석 실패</option><option value="low-quality">저품질</option><option value="low-confidence">저신뢰</option></select></label></details>}
    <Link className="secondary-link" to={session ? `/brushing/${session.id}` : '/brushing'}>{session ? '연결된 양치 기록으로 돌아가기' : '양치 관리로 돌아가기'}</Link>
    <aside className="scope-note"><p>화면을 벗어나거나 동의를 철회하면 입력·모의 결과를 지웁니다. 원본은 전송·영속 저장하지 않습니다.</p></aside>
  </div>;
}

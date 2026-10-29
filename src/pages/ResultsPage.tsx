import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { adviceFor } from '../domain/assessment';
import { assessmentService, useAssessment } from '../state/assessmentStore';
import { DemoNotice } from '../components/DemoNotice';
import { StateNotice } from '../components/StateNotice';

export function ResultsPage({ adviceOnly = false }: { adviceOnly?: boolean }) {
  const state = useAssessment();
  const { assessmentId } = useParams();
  const result = state.result && state.result.id === assessmentId && state.result.revision === state.revision ? state.result : null;
  const [retryError, setRetryError] = useState(false);
  const mounted = useRef(true);
  const navigate = useNavigate();
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  if (!result) return <div className="content-page"><h1>{adviceOnly ? '관리 조언' : '구강 상태 참고 결과'}</h1><StateNotice kind="empty" title={state.status === 'pending' ? '모의 분석 중이에요' : '확인할 결과가 없어요'} description="새로고침하거나 응답을 수정하면 이전 결과는 사용할 수 없어요. 테스트에서 가상 응답을 제출해주세요." /><Link className="primary-link" to="/assessment">테스트로 이동</Link><DemoNotice /></div>;
  const available = result.items.filter(item => item.position !== null);
  async function retry() {
    setRetryError(false);
    const next = await assessmentService.submit();
    if (!mounted.current) return;
    if (next) void navigate(`/assessment/${next.id}${adviceOnly ? '/advice' : ''}`, { replace: true });
    else setRetryError(true);
  }
  return <div className="content-page assessment-page">
    <div className="page-eyebrow">{adviceOnly ? 'ADVICE' : 'RESULT'} · 데모 규칙 v1</div>
    <h1>{adviceOnly ? '관리 조언' : '구강 상태 참고 결과'}</h1>
    <p className="page-description">{adviceOnly ? '가상 응답에 연결된 사전 정의 조언이에요.' : '가상 응답을 항목별로 정리했어요.'}</p>
    <p className="result-time">생성 시각 {new Date(result.createdAt).toLocaleString('ko-KR')}</p>
    <DemoNotice />
    {!adviceOnly && <section className="result-levels" aria-label="항목별 응답 수준">
      <p className="form-hint">선은 응답 빈도의 표시 위치예요. 질병 위험도나 건강 점수가 아닙니다.</p>
      {result.items.map(item => <article className="result-item" key={item.category}>
        <div className="result-item-heading"><h2>{item.label}</h2><strong className={item.position === null ? 'muted-label' : 'level-label'}>{item.level}</strong></div>
        {item.position !== null && <><div className="level-track" aria-hidden="true"><span className="level-dot" style={{ left: `${5 + item.position * .9}%` }} /></div><div className="level-scale" aria-hidden="true"><span>없음</span><span>가끔</span><span>자주</span></div></>}
        <p>{item.explanation}</p>
      </article>)}
    </section>}
    <section className="advice-section" aria-label="AI 조언 데모">
      <h2>AI 조언 <span className="demo-pill">데모</span></h2>
      {result.adviceStatus === 'failed' ? <div className="error-panel" role="alert"><strong>조언을 불러오지 못했어요</strong><p>평가 항목은 유지하지만 조언과 맞춤 추천은 보류했어요.</p><button className="text-button" disabled={state.status === 'pending'} onClick={() => void retry()}>조언 다시 요청하기</button>{retryError && <p>다시 요청하지 못했어요. 테스트로 돌아가주세요.</p>}</div> : <>
        {result.items.map(item => { const advice = adviceFor(item); return <article className="advice-card" key={item.category}><span className="advice-label">{item.label} · ADVICE</span><p>{advice.text}</p>{adviceOnly && <><h3>응답 분류 근거</h3><p>{advice.basis}</p></>}</article>; })}
        <p className="source-note">일반 상담 안내 참고: <a href="https://www.nhs.uk/conditions/tooth-decay/" target="_blank" rel="noreferrer">NHS 구강 증상 안내</a>. 데모 평가 규칙의 근거는 아닙니다.</p>
      </>}
    </section>
    <div className="result-actions">
      {!adviceOnly && <Link className="secondary-link" to={`/assessment/${result.id}/advice`}>조언 자세히 보기</Link>}
      <Link className="primary-link full-width" to="/recommendations">{available.length && result.adviceStatus === 'ready' ? '추천 팁 확인하기' : '일반 팁 정보 보기'}</Link>
      <Link className="secondary-link" to="/assessment">응답 수정하기</Link>
    </div>
  </div>;
}

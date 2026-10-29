import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { categories, missingResponses, options } from '../domain/assessment';
import type { Category, Scenario } from '../domain/assessment';
import { assessmentService, useAssessment } from '../state/assessmentStore';
import { DemoNotice } from '../components/DemoNotice';

export function SurveyPage() {
  const state = useAssessment();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [errors, setErrors] = useState<Category[]>([]);
  const [consentError, setConsentError] = useState(false);
  const [scenario, setScenario] = useState<Scenario>('success');
  const mounted = useRef(true);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const pending = state.status === 'pending';
  async function submit(event: FormEvent) {
    event.preventDefault();
    const missing = missingResponses(state.responses);
    setErrors(missing);
    setConsentError(!state.consent);
    if (!state.consent) { form.current?.querySelector<HTMLInputElement>('#demo-consent')?.focus(); return; }
    if (missing.length) { form.current?.querySelector<HTMLInputElement>(`input[name="${missing[0]}"]`)?.focus(); return; }
    const result = await assessmentService.submit(scenario);
    if (result && mounted.current) void navigate(`/assessment/${result.id}`);
  }
  return <div className="content-page assessment-page">
    <div className="page-eyebrow">MY ORAL CARE · 데모 테스트</div>
    <h1>구강 타입 테스트</h1>
    <p className="page-description">가상 인물의 응답을 선택하고 결과 화면을 체험해보세요. 실제 건강정보는 입력하지 마세요.</p>
    <DemoNotice />
    <form ref={form} onSubmit={submit} noValidate aria-busy={pending}>
      <label className="consent-box"><input id="demo-consent" type="checkbox" checked={state.consent} onChange={e => { assessmentService.setConsent(e.target.checked); setConsentError(false); setErrors([]); }} />
        <span>가상 응답으로 체험하겠습니다.<small>응답은 현재 탭의 메모리에서만 처리하며 새로고침하면 초기화됩니다. 확인을 해제하면 응답과 결과가 지워집니다.</small></span>
      </label>
      {consentError && <p className="field-error" role="alert">체험 안내를 확인하거나 홈으로 돌아가세요.</p>}
      <div className="survey-progress" role="status">{categories.length - missingResponses(state.responses).length} / 4개 응답 완료</div>
      {errors.length > 0 && state.consent && <p className="field-error" role="alert">응답하지 않은 {errors.length}개 항목을 확인해주세요.</p>}
      {categories.map(({ key, label, question }, index) => <fieldset key={key} disabled={!state.consent || pending} className={`question-group ${errors.includes(key) ? 'has-error' : ''}`}>
        <legend><small>0{index + 1} · {label}</small>{question}<span className="required-label">필수 · 한 개 선택</span></legend>
        <div className="answer-options">{options.map(({ value, label: answerLabel }) => <label key={value} className={`answer-option ${state.responses[key] === value ? 'chosen' : ''}`}>
          <input type="radio" name={key} value={value} checked={state.responses[key] === value} aria-invalid={errors.includes(key)} aria-describedby={errors.includes(key) ? `error-${key}` : undefined}
            onChange={() => { assessmentService.setResponse(key, value); setErrors(previous => previous.filter(item => item !== key)); }} />{answerLabel}
        </label>)}</div>
        {errors.includes(key) && <p className="field-error" id={`error-${key}`}>이 항목의 응답을 선택해주세요.</p>}
      </fieldset>)}
      {import.meta.env.DEV && search.get('demoDebug') === '1' && <details className="debug-panel"><summary>개발자 시나리오</summary><label>분석 응답<select aria-label="분석 시나리오" value={scenario} disabled={pending} onChange={e => setScenario(e.target.value as Scenario)}>
        <option value="success">정상</option><option value="failed">분석 실패</option><option value="low-confidence">저신뢰</option><option value="partial">일부 결과 누락</option><option value="advice-failed">조언 실패</option>
      </select></label></details>}
      {state.status === 'failed' && <div className="error-panel" role="alert"><strong>모의 분석을 완료하지 못했어요</strong><p>결과를 만들지 않았어요. 응답을 유지한 채 다시 시도할 수 있어요.</p><button type="button" className="text-button" onClick={() => setScenario('success')}>정상 시나리오로 바꾸기</button></div>}
      {state.status === 'low-confidence' && <div className="error-panel" role="alert"><strong>결과를 보류했어요</strong><p>모의 저신뢰 상태여서 결과·조언·추천을 표시하지 않아요.</p><button type="button" className="text-button" onClick={() => setScenario('success')}>정상 시나리오로 바꾸기</button></div>}
      <button className="primary-link full-width" type="submit" disabled={pending}>{pending ? '모의 분석 중…' : state.status === 'failed' || state.status === 'low-confidence' ? '다시 분석하기' : '모의 결과 확인하기'}</button>
      <p className="form-hint" role="status">{pending ? '가상 응답을 처리하고 있어요. 실제 AI 분석이 아닙니다.' : '응답을 바꾸면 이전 결과·조언·추천은 무효화됩니다.'}</p>
      <Link className="secondary-link" to="/">홈으로 돌아가기</Link>
    </form>
  </div>;
}

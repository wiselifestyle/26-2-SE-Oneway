import { disclaimer } from '../domain/assessment';

export function DemoNotice() {
  return <aside className="demo-notice"><strong>가상 응답 · 모의 결과</strong><p>{disclaimer} 선택지·표시 수준·조언·추천은 프로토타입 체험용이며, 실제 AI 분석이나 전문가 감수를 거친 결과가 아닙니다.</p></aside>;
}

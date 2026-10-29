// RQ-01~04. All question wording and classification rules are demo assumptions.
export const categories = [
  { key: 'sensitivity', label: '시린이', question: '가상 인물의 시린 느낌은 어느 정도인가요?', candidate: 'A' },
  { key: 'gums', label: '잇몸', question: '가상 인물의 잇몸 불편감은 어느 정도인가요?', candidate: 'B' },
  { key: 'teeth', label: '치아', question: '가상 인물의 치아 불편감은 어느 정도인가요?', candidate: 'C' },
  { key: 'breath', label: '입냄새', question: '가상 인물의 입냄새 고민은 어느 정도인가요?', candidate: 'D' },
] as const;
export type Category = typeof categories[number]['key'];
export const options = [
  { value: 'none', label: '없음' },
  { value: 'sometimes', label: '가끔' },
  { value: 'often', label: '자주' },
  { value: 'unknown', label: '알 수 없음' },
] as const;
export type Answer = typeof options[number]['value'];
export type Responses = Partial<Record<Category, Answer>>;
export type ResultItem = { category: Category; label: string; answer: Answer; position: number | null; level: string; explanation: string };
export type Assessment = { id: string; revision: number; createdAt: string; sourceVersion: 'demo-rules-v1'; items: ResultItem[]; adviceStatus: 'ready' | 'failed' };
export type Scenario = 'success' | 'failed' | 'low-confidence' | 'partial' | 'advice-failed';
export const disclaimer = '본 정보는 진료·진단을 대체하지 않습니다.';

export function missingResponses(responses: Responses): Category[] {
  return categories.filter(({ key }) => !options.some(({ value }) => value === responses[key])).map(({ key }) => key);
}

export function classify(responses: Responses): ResultItem[] {
  if (missingResponses(responses).length) throw new Error('VALIDATION_ERROR');
  return categories.map(({ key, label }) => {
    const answer = responses[key]!;
    const level = options.find(({ value }) => value === answer)!.label;
    const position = answer === 'unknown' ? null : answer === 'none' ? 0 : answer === 'sometimes' ? 50 : 100;
    return { category: key, label, answer, position, level: position === null ? '평가 불가' : level,
      explanation: position === null ? `${label} 응답을 알 수 없어 표시를 보류했어요.` : `${label} 항목에서 ‘${level}’ 응답을 선택했어요. 선택 빈도를 표시하며 실제 구강 건강 수준은 판단하지 않아요.` };
  });
}

export function adviceFor(item: ResultItem) {
  if (item.position === null) return { text: `${item.label} 항목은 정보가 부족해 개별 조언을 보류했어요.`, basis: '응답 또는 결과가 없어 분류하지 않았어요.' };
  return {
    text: item.answer === 'none'
      ? `${item.label} 항목은 ‘없음’으로 선택했어요. 이 선택만으로 구강 건강이 양호하다고 판단할 수는 없어요.`
      : `${item.label} 항목에서 ‘${item.level}’ 응답을 선택했어요. 실제로 불편감이 있다면 치과 상담을 통해 상태를 확인하세요.`,
    basis: `사전 정의된 데모 규칙이 ‘${item.level}’ 선택지를 읽어 표시했어요. 원인이나 질환을 추론하지 않아요.`,
  };
}

export function recommendationsFor(result: Assessment) {
  if (result.adviceStatus !== 'ready') return [];
  return result.items.filter(item => item.position !== null && item.position > 0)
    .sort((a, b) => b.position! - a.position!)
    .map(item => ({ candidate: categories.find(c => c.key === item.category)!.candidate,
      category: item.category, label: item.label,
      reason: `${item.label} 항목의 ‘${item.level}’ 응답을 기준으로 분류한 데모 후보예요. 실제 제품 적합성을 뜻하지 않아요.` }));
}

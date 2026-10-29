import { classify } from '../domain/assessment.ts';
import type { AnalysisAdapter } from '../services/assessmentService.ts';

// DCOM-06. Deterministic simulated responses. No external AI or medical inference.
export const analysisAdapter: AnalysisAdapter = {
  async analyze(responses, scenario) {
    await new Promise(resolve => setTimeout(resolve, 450));
    if (scenario === 'failed' || scenario === 'low-confidence') return { status: scenario };
    const items = classify(responses);
    if (scenario === 'partial') {
      const missing = items.find(item => item.category === 'breath')!;
      missing.position = null;
      missing.level = '평가 불가';
      missing.explanation = '입냄새 항목의 모의 결과가 수신되지 않아 표시를 보류했어요.';
    }
    return { status: 'ready', items, adviceStatus: scenario === 'advice-failed' ? 'failed' : 'ready' };
  },
};

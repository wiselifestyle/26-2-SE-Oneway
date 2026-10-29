import { missingResponses, options } from '../domain/assessment.ts';
import type { Answer, Assessment, Category, Responses, Scenario } from '../domain/assessment.ts';

export type AdapterResult = { status: 'ready'; items: Assessment['items']; adviceStatus: Assessment['adviceStatus'] } | { status: 'failed' | 'low-confidence' };
export interface AnalysisAdapter { analyze(responses: Responses, scenario: Scenario): Promise<AdapterResult> }
export type AssessmentState = { consent: boolean; responses: Responses; revision: number; status: 'idle' | 'pending' | 'failed' | 'low-confidence'; result: Assessment | null };

// DCOM-01/03: no React, browser storage, remote APIs or clinical model dependency.
export function createAssessmentService(adapter: AnalysisAdapter) {
  let state: AssessmentState = { consent: false, responses: {}, revision: 0, status: 'idle', result: null };
  let token = 0;
  const listeners = new Set<() => void>();
  function update(next: AssessmentState) { state = next; for (const listener of listeners) listener(); }
  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    reset() {
      token++;
      update({ consent: false, responses: {}, revision: state.revision + 1, status: 'idle', result: null });
    },
    setConsent(consent: boolean) {
      token++;
      update({ ...state, consent, responses: consent ? state.responses : {}, result: null, revision: state.revision + 1, status: 'idle' });
    },
    setResponse(category: Category, answer: Answer) {
      if (!state.consent || !options.some(o => o.value === answer)) return;
      if (state.responses[category] === answer) return;
      token++;
      update({ ...state, responses: { ...state.responses, [category]: answer }, revision: state.revision + 1, result: null, status: 'idle' });
    },
    async submit(scenario: Scenario = 'success'): Promise<Assessment | null> {
      if (!state.consent || missingResponses(state.responses).length || state.status === 'pending') return null;
      const request = ++token;
      const revision = state.revision;
      const responses = { ...state.responses };
      update({ ...state, result: null, status: 'pending' });
      try {
        const response = await adapter.analyze(responses, scenario);
        if (request !== token || revision !== state.revision || !state.consent) return null;
        if (response.status !== 'ready') { update({ ...state, status: response.status, result: null }); return null; }
        const result: Assessment = { id: crypto.randomUUID(), revision, createdAt: new Date().toISOString(), sourceVersion: 'demo-rules-v1', items: response.items, adviceStatus: response.adviceStatus };
        update({ ...state, status: 'idle', result });
        return result;
      } catch {
        if (request === token) update({ ...state, status: 'failed', result: null });
        return null;
      }
    },
  };
}

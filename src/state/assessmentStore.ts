import { useSyncExternalStore } from 'react';
import { createAssessmentService } from '../services/assessmentService.ts';
import { analysisAdapter } from '../mocks/analysisAdapter.ts';

// Composition root: one ephemeral app session, discarded on reload.
export const assessmentService = createAssessmentService(analysisAdapter);
export function useAssessment() {
  return useSyncExternalStore(assessmentService.subscribe, assessmentService.getSnapshot);
}

export const deletionTargets = ['assessment', 'brushing', 'subscription'] as const;
export type DeletionTarget = typeof deletionTargets[number];
export const targetLabels: Record<DeletionTarget, string> = { assessment: '가상 설문·결과·체험 확인', brushing: '모의 기기·양치 기록·동기화 상태', subscription: '구독 구성·가상 요청·체험 확인' };
export type DeleteResult = { removed: DeletionTarget[]; failed: DeletionTarget[] };
// ONRQ-04: report actual per-target outcomes; never roll back completed deletions.
export async function deleteLocalData(targets: Record<DeletionTarget, () => void | Promise<void>>): Promise<DeleteResult> {
  const result: DeleteResult = { removed: [], failed: [] };
  for (const key of deletionTargets) {
    try { await targets[key](); result.removed.push(key); } catch { result.failed.push(key); }
  }
  return result;
}

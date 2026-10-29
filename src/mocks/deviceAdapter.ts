import { dayMs } from '../domain/brushing.ts';
import type { BrushingSession } from '../domain/brushing.ts';
import type { DeviceAdapter } from '../services/brushingService.ts';
import { wait } from '../services/wait.ts';

export function demoSessions(anchor: number): BrushingSession[] {
  return [
    { age: 0, hours: 1, duration: 122, coverage: 67, score: 67 },
    { age: 0, hours: 3, duration: 138, coverage: 85, score: 82 },
    { age: 2, hours: 1, duration: null, coverage: null, score: null },
    { age: 5, hours: 1, duration: 120, coverage: 78, score: 74 },
    { age: 9, hours: 1, duration: 132, coverage: 91, score: 89 },
    { age: 12, hours: 1, duration: 118, coverage: 80, score: 76 },
  ].map((data, i) => ({ id: `mock-device--event-${i + 1}`, eventId: `event-${i + 1}`, deviceId: 'mock-device',
    recordedAt: new Date(anchor - data.age * dayMs - data.hours * 3_600_000).toISOString(), duration: data.duration, coverage: data.coverage, score: data.score,
    regions: i === 0 ? [{ label: '위 왼쪽', coverage: 60 }, { label: '위 앞쪽', coverage: 80 }, { label: '위 오른쪽', coverage: 100 }, { label: '아래 왼쪽', coverage: null }, { label: '아래 앞쪽', coverage: 55 }, { label: '아래 오른쪽', coverage: 70 }] : null }));
}
export function createDeviceAdapter(anchor = Date.now()): DeviceAdapter {
  const sessions = demoSessions(anchor);
  return {
    async connect(scenario, signal) { await wait(400, signal); if (scenario !== 'success') throw new Error(scenario); },
    async sync(scenario, attempt, signal) {
      await wait(200, signal);
      if (scenario === 'failed' || scenario === 'flaky' && attempt < 2) throw new Error('TRANSFER_FAILED');
      if (scenario === 'empty') return [];
      if (scenario === 'invalid') return [{ ...sessions[0], coverage: -1 }];
      return sessions;
    },
  };
}

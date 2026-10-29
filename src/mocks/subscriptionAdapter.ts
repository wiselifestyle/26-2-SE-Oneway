import type { SubscriptionAdapter } from '../services/subscriptionService.ts';
import { wait } from '../services/wait.ts';
export const subscriptionAdapter: SubscriptionAdapter = {
  async request(scenario, signal) {
    await wait(550, signal);
    if (scenario === 'failed') throw new Error('DEMO_ORDER_FAILED');
    return scenario === 'unconfirmed' ? 'unconfirmed' : 'demo_requested';
  },
};

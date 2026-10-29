import { useSyncExternalStore } from 'react';
import { createSubscriptionService } from '../services/subscriptionService';
import { subscriptionAdapter } from '../mocks/subscriptionAdapter';
export const subscriptionService = createSubscriptionService(subscriptionAdapter);
export function useSubscription() { return useSyncExternalStore(subscriptionService.subscribe, subscriptionService.getSnapshot); }

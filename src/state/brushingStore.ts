import { useSyncExternalStore } from 'react';
import { createDeviceAdapter } from '../mocks/deviceAdapter';
import { createBrushingService } from '../services/brushingService';

export const brushingService = createBrushingService(createDeviceAdapter());
export function useBrushing() { return useSyncExternalStore(brushingService.subscribe, brushingService.getSnapshot); }

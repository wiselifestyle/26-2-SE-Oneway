import type { VideoAdapter } from '../services/videoService.ts';
import { wait } from '../services/wait.ts';

export const videoAdapter: VideoAdapter = { async analyze(scenario, signal) { await wait(650, signal); return scenario; } };

export function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(new Error('CANCELLED')); return; }
    const abort = () => { clearTimeout(timer); signal.removeEventListener('abort', abort); reject(new Error('CANCELLED')); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, ms);
    signal.addEventListener('abort', abort, { once: true });
  });
}

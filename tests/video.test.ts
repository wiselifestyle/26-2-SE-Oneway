import test from 'node:test';
import assert from 'node:assert/strict';
import { maxVideoBytes, videoMeta } from '../src/domain/video.ts';
import { createVideoService } from '../src/services/videoService.ts';
import type { LocalVideo, VideoAdapter } from '../src/services/videoService.ts';
const file = (name = 'synthetic.webm', type = 'video/webm', bytes = new Uint8Array([0x1a, 0x45, 0xdf, 0xa3, 0, 0, 0, 0])) => new File([bytes], name, { type });
const normal: VideoAdapter = { async analyze(scenario) { return scenario; } };

test('미동의/거절 시 파일 내용을 읽지 않고 분석도 호출하지 않는다', async () => {
  let reads = 0, calls = 0;
  const service = createVideoService({ async analyze() { calls++; return 'success'; } });
  const input: LocalVideo = { name: 'private.webm', type: 'video/webm', size: 8, slice() { reads++; throw new Error('must not read'); } };
  await service.select(input); service.consent(false); await service.select(input); await service.analyze();
  assert.equal(reads, 0); assert.equal(calls, 0); assert.equal(service.getSnapshot().meta, null);
});
test('형식·크기·헤더 검증과 선택 취소의 기존 메타 유지', async () => {
  const service = createVideoService(normal); service.consent(true);
  await service.select(file()); assert.equal(service.getSnapshot().meta?.kind, 'webm');
  await service.select(null); assert.equal(service.getSnapshot().status, 'ready');
  for (const input of [file('a.txt', 'text/plain'), file('a.webm', 'video/mp4'), file('a.webm', 'video/webm', new Uint8Array()), file('a.mp4', 'video/mp4')]) {
    await service.select(input); assert.equal(service.getSnapshot().meta, null); assert.ok(service.getSnapshot().error);
  }
  assert.throws(() => videoMeta('large.webm', maxVideoBytes + 1, 'video/webm'), /20MiB/);
  assert.equal(videoMeta('demo.mp4', maxVideoBytes, '').kind, 'mp4');
  await service.select(file('demo.mp4', 'video/mp4', new Uint8Array([0, 0, 0, 12, 102, 116, 121, 112, 0, 0, 0, 0])));
  assert.equal(service.getSnapshot().meta?.kind, 'mp4');
  assert.ok(!JSON.stringify(service.getSnapshot()).includes('demo.mp4'));
});
test('실패/저품질/저신뢰는 결과 보류, 재시도 회복', async () => {
  const service = createVideoService(normal); service.consent(true); await service.select(file());
  for (const scenario of ['failed', 'low-quality', 'low-confidence'] as const) {
    await service.analyze(scenario); assert.equal(service.getSnapshot().status, scenario);
    await service.analyze(); assert.equal(service.getSnapshot().status, 'success');
  }
});
test('처리 중 중복 요청 차단·동의 철회/화면 이탈 후 늦은 결과 폐기', async () => {
  for (const dispose of [false, true]) {
    let resolve!: (value: 'success') => void; let calls = 0;
    const service = createVideoService({ analyze() { calls++; return new Promise(r => { resolve = r; }); } });
    service.consent(true); await service.select(file()); const pending = service.analyze(); await service.analyze(); assert.equal(calls, 1);
    if (dispose) service.dispose(); else service.consent(false);
    resolve('success'); await pending;
    assert.equal(service.getSnapshot().status, 'idle'); assert.equal(service.getSnapshot().meta, null);
  }
});
test('헤더 검사 중 입력 철회 및 새 선택은 이전 검사 응답을 무효화한다', async () => {
  let resolve!: (value: ArrayBuffer) => void;
  const service = createVideoService(normal); service.consent(true);
  const slow = service.select({ name: 'late.webm', type: 'video/webm', size: 8, slice: () => ({ arrayBuffer: () => new Promise(r => { resolve = r; }) }) });
  service.clear(); resolve(new Uint8Array([0x1a, 0x45, 0xdf, 0xa3]).buffer); await slow;
  assert.equal(service.getSnapshot().meta, null);
  await service.select(file()); await service.analyze(); service.clear(); assert.equal(service.getSnapshot().status, 'idle');
});

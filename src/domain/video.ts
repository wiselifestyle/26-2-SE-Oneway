export const maxVideoBytes = 20 * 1024 * 1024;
export type VideoMeta = { kind: 'mp4' | 'webm'; size: number };
export type VideoScenario = 'success' | 'failed' | 'low-quality' | 'low-confidence';
export function videoMeta(name: string, size: number, mime: string): VideoMeta {
  if (!Number.isFinite(size) || size <= 0) throw new Error('빈 파일은 선택할 수 없어요. 다른 영상을 선택하세요.');
  if (size > maxVideoBytes) throw new Error('20MiB를 초과했어요. 더 작은 시연용 영상을 선택하세요.');
  const extension = name.toLowerCase().split('.').pop();
  if (extension !== 'mp4' && extension !== 'webm') throw new Error('MP4 또는 WebM 형식만 지원해요.');
  if (mime && mime !== `video/${extension}`) throw new Error('확장자와 파일 형식이 맞지 않아요. MP4 또는 WebM을 선택하세요.');
  return { kind: extension, size };
}
export function validVideoHeader(meta: VideoMeta, bytes: Uint8Array) {
  return meta.kind === 'webm' ? bytes.length >= 4 && [0x1a, 0x45, 0xdf, 0xa3].every((b, i) => bytes[i] === b)
    : bytes.length >= 12 && String.fromCharCode(...bytes.slice(4, 8)) === 'ftyp';
}

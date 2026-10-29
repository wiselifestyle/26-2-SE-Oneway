import { disclaimer } from '../domain/assessment';

export function MockNotice({ video = false }: { video?: boolean }) {
  return <aside className="mock-notice"><strong>{video ? '로컬 입력 · 영상 분석 시뮬레이션' : '시연용 기기 · 예시 데이터'}</strong>
    <p>{video ? '파일 형식·크기만 검사하며 내용을 판독하거나 서버로 전송하지 않습니다. 결과는 사전 정의된 예시입니다.' : '실제 Bluetooth 연결이나 기기 측정을 수행하지 않습니다. 점수·시간·커버리지는 Mock 예시입니다.'}</p>
    <p>{disclaimer}</p>
  </aside>;
}

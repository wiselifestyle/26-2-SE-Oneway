import { matchPath } from 'react-router';

export type Section = 'home' | 'brushing' | 'products' | 'settings';
export type Screen = {
  id: string;
  path: string;
  title: string;
  section: Section;
  phase: 2 | 3 | 4;
  description: string;
  parent: string;
};

// SCREEN_MAP S01~S14. Business flows are local demos; shop links open the owner's external store.
export const screens: Screen[] = [
  { id: 'S01', path: '/', title: '홈', section: 'home', phase: 2, parent: '/', description: '구강 관리의 시작을 한곳에서 만나보세요.' },
  { id: 'S02', path: '/assessment', title: '구강 타입 테스트', section: 'home', phase: 2, parent: '/', description: '구강 상태를 돌아보는 테스트를 준비하고 있어요.' },
  { id: 'S03', path: '/assessment/:assessmentId', title: '구강 상태 참고 결과', section: 'home', phase: 2, parent: '/assessment', description: '항목별 상태와 설명을 확인할 화면이에요.' },
  { id: 'S04', path: '/assessment/:assessmentId/advice', title: '관리 조언', section: 'home', phase: 2, parent: '/assessment', description: '구강 상태에 따른 참고 조언을 준비하고 있어요.' },
  { id: 'S05', path: '/recommendations', title: '추천 팁', section: 'products', phase: 2, parent: '/', description: '추천 이유와 교체용 팁 정보를 확인할 화면이에요.' },
  { id: 'S06', path: '/brushing', title: '양치 관리', section: 'brushing', phase: 3, parent: '/', description: '양치 기록과 기간별 변화를 확인할 공간이에요.' },
  { id: 'S07', path: '/brushing/:sessionId', title: '양치 상세', section: 'brushing', phase: 3, parent: '/brushing', description: '한 번의 양치 기록을 자세히 살펴볼 화면이에요.' },
  { id: 'S08', path: '/products', title: '제품', section: 'products', phase: 4, parent: '/', description: '나에게 필요한 구강 관리 도구를 알아볼 공간이에요.' },
  { id: 'S09', path: '/products/:productId', title: '상품 정보', section: 'products', phase: 4, parent: '/products', description: '확인된 상품 정보를 안내할 화면이에요.' },
  { id: 'S10', path: '/subscription', title: '구독 구성', section: 'products', phase: 4, parent: '/products', description: '상품 구성과 배송 주기를 살펴볼 화면이에요.' },
  { id: 'S10a', path: '/subscription/status/:intentId', title: '신청 상태', section: 'products', phase: 4, parent: '/subscription', description: '가상 신청과 외부 확인 상태를 구별해 안내할 화면이에요.' },
  { id: 'S11', path: '/device', title: '기기 관리', section: 'brushing', phase: 3, parent: '/brushing', description: '기기 연결 시뮬레이션을 준비하고 있어요.' },
  { id: 'S12', path: '/video-analysis', title: '영상 분석', section: 'brushing', phase: 3, parent: '/brushing', description: '영상 동의와 모의 분석 흐름을 준비하고 있어요.' },
  { id: 'S13', path: '/settings', title: '설정', section: 'settings', phase: 4, parent: '/', description: '개인정보와 기기 관리 안내를 확인하세요.' },
  { id: 'S13a', path: '/settings/privacy', title: '개인정보 관리', section: 'settings', phase: 4, parent: '/settings', description: '동의와 로컬 데이터 삭제 안내를 준비하고 있어요.' },
  { id: 'S14', path: '/sales-channels', title: '판매 경로', section: 'products', phase: 4, parent: '/products', description: '확인된 판매 경로를 안내할 화면이에요.' },
];

export function findScreen(pathname: string) {
  return screens.find((screen) => matchPath({ path: screen.path, end: true }, pathname));
}

export function parentPath(screen: Screen | undefined, pathname: string) {
  if (screen?.id === 'S04') return pathname.replace(/\/advice\/?$/, '');
  return screen?.parent ?? '/';
}

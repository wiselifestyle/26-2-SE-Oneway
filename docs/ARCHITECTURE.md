# 기술 아키텍처 및 Mock 설계

## 기술 스택
- React + TypeScript + Vite, React Router, Tailwind CSS, Lucide Icons.
- 차트가 필요한 경우 경량 라이브러리를 검토하되 먼저 사용자에게 불필요한 종속성 추가 여부를 보고한다.
- 로컬 실행: `npm install`, `npm run dev`; 검증: `npm run build` 및 설정된 typecheck/test.

## SSAD 대응
| SSAD 모델 | 웹 프로토타입의 대응 |
|---|---|
| COM-01 Mobile Presentation | routes/pages/components |
| COM-02 Assessment & Advice | survey/result/advice service |
| COM-03 Brushing & Device | session/video/device mock adapter |
| COM-04 Catalog & Subscription | catalog/recommendation/subscription service |
| COM-05 Identity & Data | consent/local record management |
| DCOM-01~06 | 인터페이스/서비스 계층으로 분리, 필요한 만큼만 구현 |
| BH-01~06, OP-01~05 | 사용자 플로 및 오류/상태 전이의 검증 근거 |

## 최소 데이터 모델 (SSAD OBJ-01~07 기반)
- UserProfile: userId, consent, preferences
- Assessment: responses, results, createdAt
- Advice: category, text, sourceVersion
- BrushingSession: duration, coverage, score, deviceId, createdAt
- VideoAnalysis: status, quality, outcome
- Product: id, type, compatibleDevices, description
- Subscription: productId, cycle, status

유효하지 않은 값이나 미수신 값은 `null`/명시적 상태로 표현한다. 측정값 미수신을 0으로 처리하지 않는다. 시간은 명확한 형식으로 표시하고 필요한 경우 ISO 8601을 사용한다.

## Mock Service 정책
- 외부 서비스 접근 없이 결정적이고 재현 가능한 데모 응답 제공.
- `success`, `pending`, `failed`, `unavailable`, `low-confidence` 등 필요한 상태를 명시적으로 표현.
- 테스트/시연을 위한 개발자 전용 시나리오 선택 UI 또는 유틸리티를 제공하되 사용자 메인 UI에 상시 노출하지 않는다.
- 기기 연결: 실제 Bluetooth API를 사용하지 않고 연결·실패·재시도를 시뮬레이션.
- 영상: 파일 선택/형식·크기 검사 후 가상 분석 수행; 영상 내용에 기반한 결과라고 주장하지 않음; 원본 비영속.
- AI 조언: 설문 결과 기반 규칙/사전 정의 응답; 의료적 진단이라고 주장하지 않음.
- 구독/주문: 사용자가 선택한 상품·주기는 기록 가능하나 외부 확인 전 상태는 `demo_requested`/`unconfirmed` 등으로 구분.
- 개인정보: 로컬 데모 데이터만 저장·삭제. 로컬 스토리지에 영상·민감한 원본 진료 정보를 넣지 않는다.

## 프로젝트 구조 권장안
`src/pages/`, `src/components/`, `src/domain/`, `src/services/`, `src/mocks/`, `src/styles/`, `src/test/`.
세부 구조는 Phase 0 계획에 적고 승인 이후 변경한다. 실제 백엔드를 구성하지 않는다.

## Phase 3 실제 구성

기기/양치 도메인은 domain/brushing.ts, 상태/업무 흐름은 services/brushingService.ts, DeviceAdapter 구현은 mocks/deviceAdapter.ts, React 조립은 state/brushingStore.ts에 있다. AbortController로 진행 요청과 재시도 타이머를 취소하며, 실패/해제로 과거 기록/정상 갱신 시각을 지우지 않는다. 기록은 deviceId+eventId로 중복 제거하고 응답 묶음 검증 뒤 반영한다.

영상은 domain/video.ts의 형식/크기/헤더 규칙, services/videoService.ts의 별도 동의/임시 상태/요청 token, mocks/videoAdapter.ts의 모의 상태로 나뉜다. VideoPage마다 생성한 서비스는 화면 이탈·세션 문맥 변경에 dispose한다. File은 헤더 검사 때만 지역 인자로 사용하고 형식/크기 이외의 원본·파일명은 상태에 보관하지 않는다. 실제 디코더·AI 모델·네트워크·Object URL/영속 저장을 사용하지 않는다. 내부 QA 생성 HTML의 합성 영상용 Object URL은 앱 코드와 별개이며 생성 후 해제한다.

선택적 세션 문맥은 영상 화면 안내만 바꾸고 BrushingSession을 생성/수정하지 않는다. Phase 4 Catalog/Subscription/Privacy 운영 서비스는 구현하지 않았다. 상세 가정/범위는 PHASE3_DEMO_SPEC을 참조한다.

## Phase 4 실제 구성

앞 절의 미구현 표기는 Phase 3 당시 이력이다. domain/catalog.ts는 출처 있는 상품명/모델/URL과 판매 URL 검증을, services/subscriptionService.ts는 가상 구성/intent·취소·중복을 담당한다. SubscriptionAdapter는 mocks/subscriptionAdapter.ts의 지연/실패/미확인만 사용한다. 네트워크/주문 API를 호출하지 않는다. 외부 판매처가 실제 거래 원장을 소유하며 ShopLink는 사용자 클릭으로 새 탭을 열 뿐이다.

services/privacyService.ts는 대상별 reset 결과를 모아 성공/실패를 분리한다. 기존 설문/양치 및 새 구독 서비스의 reset은 요청 token/AbortController를 무효화하고 동의·결과·기록·최종 정상 시각·구성을 초기화한다. 실패 대상의 reset을 호출하지 않은 경우 해당 데이터는 보존된다. rollback으로 삭제된 데이터를 복원하지 않는다. 영상은 현재 라우트에서만 생존하고 설정 진입 전에 dispose되므로 전역 영상 원본/동의 저장소를 만들지 않았다. React 연결은 state/subscriptionStore.ts이며 서비스/도메인은 React에 의존하지 않는다.

이름/주소/전화/결제정보 입력·인증·영속 저장·외부 서버 삭제/실거래는 없다. 데이터 경계와 누락 정책은 PHASE4_DEMO_SPEC 참조.

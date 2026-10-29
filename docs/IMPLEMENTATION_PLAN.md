# 단계별 개발·승인 계획

**상태:** Phase 0~4 **Approved**, Phase 5 완료 — **Awaiting approval** (2026-10-30). 사용자 승인에 따라 통합 검증만 수행한다.

| Phase | 범위 | 필수 산출물 | 통과 조건 | 게이트 |
|---|---|---|---|---|
| 0. 문서 분석 | 원본 3종 대조, 화면·범위·충돌 분석 및 미결 구분 | SCREEN_MAP, DECISIONS, 추적표, 단계 제안, TEST_RESULTS | RQ/ONRQ/SSAD 흐름 매핑, 모든 추정 표시. 제안/미결은 승인 전 미확정 | Approved |
| 1. 기반 구축 | Vite/React/TS, 라우팅, 공통 UI 토큰·레이아웃 | 실행 가능한 앱 셸 | 390/360px 기본 화면·빌드 정상 | Approved |
| 2. 평가 플로 | 홈, 설문, 결과, AI 조언, 팁 추천 | RQ-01~04,08, ONRQ-02(설문·조언) | 입력 변경 반영·누락/실패/저신뢰 처리 | Approved |
| 3. 양치/기기/영상 | 기록·통계, 기기 연결 Mock, 영상 분석·동의 | RQ-05~06, ONRQ-01/02, ONRQ-04(영상 동의) | 연결·미연결·기록 없음·파일 오류/거절 재현 | Approved |
| 4. 상품/구독/정보보호 | 구독, 판매 링크, 동의·로컬 삭제 | RQ-07,09, ONRQ-03~04 | 실결제 성공 오인 방지·삭제 동작 | Approved |
| 5. 통합 검증 | 전체 플로 점검, 스타일 보정, 문서 정리 | QA 보고서, README, 추적표 완성 | 정상·예외 테스트·빌드·미구현 공개 | Awaiting approval |

## 단계 완료 시 Codex 보고 형식
1. **이번 단계 구현·수정 내용** (핵심 파일 포함)
2. **요구사항 ID별 반영 사항**
3. **실행 검증**: 실행한 명령, 통과·실패, 실제 확인 환경
4. **남은 문제·의사결정**: 문서 불일치와 미검증 내용
5. **승인 요청**: 다음 단계로 진행해도 되는지 명시하고 대기

## 승인 규칙
- Codex는 현재 Phase가 `Approved`/`Done`인 경우에만 다음 Phase를 시작한다.
- 단계 완료 후 게이트 상태를 `Awaiting approval`로 표시한다. 사용자의 대화 내 명시적 승인 후 `Approved`로 변경하고 다음 Phase를 진행한다.
- 개발자는 다른 Phase 코드까지 선제적으로 만들지 않는다.
- 사용자가 특정 결함 수정만 요청하면 해당 결함만 수정하고 게이트를 유지한다.

## 실행 로그 (Codex가 갱신)
| 날짜 | Phase | 변경 요약 | 테스트 결과 | 승인/보류 |
|---|---|---|---|---|
| 2026-10-30 | 0 | 원본 3종/전체 지침 검토, 화면 및 요구사항 매핑, 충돌·가정 D-001~018, Phase 1 제안 | 문서 분석/구조 검사 결과는 TEST_RESULTS 참조. 앱 수용 시험은 전부 Not tested | Awaiting approval |
| 2026-10-30 | 승인 | 사용자 Phase 0 승인 및 Phase 1만 수행 지시 | Phase 0 게이트 Approved로 변경 | Phase 1 착수 승인 |
| 2026-10-30 | 1 | React/TS/Vite·Tailwind·Router·Lucide 기반, 17개 경로, 공통 셸/상태 안내·4탭, 계층 경계 문서 | 타입/빌드 Pass, 브라우저 검사 137/137 Pass, 5개 크기 증거 저장. 업무 기능 미구현 | Awaiting approval |
| 2026-10-30 | 승인 | 사용자 Phase 1 승인 및 Phase 2만 수행 지시 | Phase 1 게이트 Approved로 변경 | Phase 2 착수 승인 |
| 2026-10-30 | 2 | 홈 상태·가상 설문·결과·사전 조언·임시 팁 후보, 변경 무효화/오류 회복, 데모 명세 | 타입/빌드 Pass, 단위 8/8, 브라우저 61/61. 제품 사양·임상·실연동 미검증 | Awaiting approval |
| 2026-10-30 | 승인 | 사용자 Phase 2 승인 및 Phase 3만 수행 지시 | Phase 2 게이트 Approved로 변경 | Phase 3 착수 승인 |
| 2026-10-30 | 3 | 기기/동기화 Mock·중복/재시도·양치 기록/통계/상세·별도 영상 동의/파일 검사/모의 결과 | 타입/빌드 Pass, 누적 단위 21/21, 브라우저 81/81. 실BLE·영상 판독·실기기 검증 제외 | Awaiting approval |
| 2026-10-30 | 승인 | 사용자 Phase 3 승인·Phase 4만 수행 지시, 자사몰 oneway.or.kr 제공 | Phase 3 Approved, 실제 판매 경로 확인 | Phase 4 착수 승인 |
| 2026-10-30 | 4 | 상품 4개/상세·자사몰, 가상 구독/실패/미확인/철회, 동의·로컬 삭제/부분 실패 | 타입/빌드 Pass, 단위31/31, 브라우저35/35(실측458px 배치7 포함). 지정320~430px 재검증 Not tested | Awaiting approval |

## Phase 0 결과

- SSRD v1.1의 본문·표, SSAD v1.0의 본문·표·내장 도표 6개, PDF 총 32쪽의 개요와 실제 모바일 UI(p.12/14/20/21/22)를 대조했다. PDF는 이미지 문서로 텍스트 추출만으로 읽을 수 없었으며 렌더링 후 시각 검토했다. 구독·가격 문맥은 p.13/15/24~27도 확인했다.
- `SCREEN_MAP.md`: S01~S15(보조 S10a/S13a 포함)의 화면/경로, RQ·ONRQ·SSAD 대응, 컴포넌트 책임, 로딩·빈 상태·오류, 사용자 흐름, 디자인 보완안을 작성했다.
- `REQUIREMENTS_TRACEABILITY.md`: RQ 9개/ONRQ 4개와 COM/BH/DCOM/OBJ/OP를 대조하고 UI/인터페이스/LOS/PR/ER의 검증 범위를 추가했다. 기능 상태는 Planned / Not tested다.
- `DECISIONS.md`: 문서 간 충돌, 자료 누락, 잠정 설계, 범위 밖 항목을 분리했다. PDF의 진단·효능처럼 보이는 표현은 SSRD의 비진단 원칙을 우선한다. 가격 기획안은 현행 판매 조건으로 취급하지 않는다.
- `TEST_RESULTS.md`: 문서 검사·원본 보존 확인과 미수행 앱 검증을 구별해 기록했다.
- 원본·AGENTS.md는 수정하지 않았다. 앱 코드·설정·의존성·실거래/외부연동은 작성 또는 실행하지 않았다.

## Phase 1 구현 계획 — 사용자 승인 (2026-10-30)

**목표:** 화면과 단계 경계를 검토할 수 있는 실행 가능한 앱 셸. Phase 2 이후 업무 기능은 작성하지 않는다.

권장 순서:

1. D-003/014의 경로·탭·디자인 토큰을 검토하고 Phase 1만 승인한다. 전체 설문·제품 가격 등 뒤 단계 미결은 이 승인으로 확정하지 않는다.
2. React + TypeScript + Vite, React Router, Tailwind CSS, Lucide의 최소 기반을 구성한다. 추가 차트·상태·분석 라이브러리는 현 단계에 필요하지 않다. 실제 버전/설치환경은 착수 시 확인한다.
3. 프레젠테이션·도메인·서비스·Mock의 경계를 만든다. 권장 폴더는 `src/pages`, `src/components`, `src/domain`, `src/services`, `src/mocks`, `src/styles`다. 인터페이스 책임만 정리하고 평가/추천/분석/신청 업무 로직은 만들지 않는다.
4. 흰색·파란색 기본 레이아웃, 양치 영역 어두운 테마 토큰, 헤더·뒤로가기·하단 탭·공통 상태 안내를 구현한다. 모바일 전체 폭/PC 약 390px 중앙 및 안전 영역을 적용한다.
5. SCREEN_MAP의 진입 경로에는 화면 제목·‘해당 Phase 구현 예정’ 안내를 표시한다. 라우트 이동과 잘못된 경로 복귀만 동작시키고 설문/상품 데이터·파일 입력·Mock 연결/가상 주문 기능은 추가하지 않는다.
6. 빌드·타입 검사 및 설정된 lint/test를 실행한다. 실제 브라우저에서 탭/뒤로가기/직접 URL/알 수 없는 경로, 390×844·360×800·320px·430px와 PC 배치를 확인한다. 못 한 항목은 Not tested로 남긴다.
7. 변경 파일·검증 증거·남은 문제를 보고하고 Phase 1 게이트를 Awaiting approval로 바꾼 뒤 중단한다.

Phase 1의 완료는 **앱 셸 검증**이다. RQ-01~09 전체 기능 완료로 집계하지 않는다. 원본에 없는 이미지/가격/측정 수치로 셸을 채우지 않는다.

## 이후 단계의 선행 결정

| 단계 | 먼저 보완할 사항 | 검증 강화 |
|---|---|---|
| 2 | D-004/005/012: 전체 문항·필수/배타 규칙, 데모 평가/추천, 조언 문안 | 설문 수정→결과/조언/추천 일관성, 누락·실패·저신뢰, 비진단 고지 |
| 3 | D-006/007/011/018: 지표/집계, 파일 제한, 동의/수명, 단독 영상 관계 | 중복 동기화·최종 정상 시각, 원본 비영속, 미연결/빈/오류, 동의 거절 |
| 4 | D-009~011: 상품·주기·구성·해지, 판매 URL·가격 표시, 로컬 삭제 범위 | 가상 요청/미확인, 중복 제출, 외부 주소 없음·실패, 삭제 부분 실패 |
| 5 | 추적표의 UI/LOS 정량 기준과 제외·대체 항목 재검토 | 정상/예외 누적, ONRQ ≥12건, UI 9상태, 성능 각 30회, 사용자 5명 검증의 실제 수행 여부 |

**승인 이력:** 2026-10-30 사용자 ‘Phase 0을 승인한다. AGENTS.md와 IMPLEMENTATION_PLAN.md에 따라 Phase 1만 수행해.’ Phase 1 종료 후 다시 Awaiting approval로 전환하고 중단한다.

## Phase 1 결과 및 다음 단계 제안

- 구성: `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`, `public/favicon.svg`.
- 프레젠테이션: `src/main.tsx`, `src/App.tsx`, `src/routes/screens.ts`, `src/components/{AppShell,NavigationCard,StateNotice}.tsx`, `src/pages/{HomePage,PreparationPage,NotFoundPage}.tsx`, `src/styles/app.css`.
- 계층 책임: `src/domain/README.md`, `src/services/README.md`, `src/mocks/README.md`. 구체적인 계약/업무 로직은 다음 승인 단계에 둔다.
- 문서: README, SCREEN_MAP, DECISIONS, REQUIREMENTS_TRACEABILITY, TEST_RESULTS 및 본 계획을 갱신했다. 검증 로그/스크린샷은 `docs/evidence/phase1/`에 있다.
- 실제 제공: 제목·준비 상태, 홈 바로가기, 4개 탭, 헤더/브라우저 뒤로가기·직접 진입 부모 복귀, 잘못된 경로 안내, 화면 전환 초점, 모바일/PC 배치와 밝은/어두운 테마. 가짜 결과/상품/가격/설문 데이터는 없다.
- 검증: `npm run build`에서 `tsc --noEmit` 및 Vite build 통과. 브라우저의 17개 경로·85개 반응형 조합·26개 링크 클릭·4개 탭·부모 경로/키보드/이력/단계 경계 등 137건 통과. 이는 Phase 1 셸 검사 수이며 RQ 정상/예외 수용 시험 건수가 아니다.
- 남은 한계: 실제 모바일 기기/소프트 키보드/노치 안전 영역, LOS 정량 시험·전문가 검수는 미검증이다. lint/단위 테스트 도구는 설정하지 않았고 미수행이다. SSRD 업무 기능은 모두 아직 미구현이다.
- 실행: `npm ci` 후 `npm run dev`, 브라우저 `http://127.0.0.1:5173/`. 검증용 서버는 단계 종료 시 종료한다.

다음 권장 단계는 D-004/005/012의 전체 설문·배타/필수 규칙·데모 평가/추천·조언 문안을 먼저 보완한 뒤 **Phase 2만** 승인받아 구현하는 것이다. 이번 승인에는 Phase 2가 포함되지 않는다. **게이트: Awaiting approval. 다음 승인 전까지 작업 중단.**

## Phase 2 결과 및 다음 단계 제안

위 Phase 1 결과·권장 순서는 당시 이력이다. 이후 사용자 승인으로 Phase 2를 수행했다.

- 구현: `src/domain/assessment.ts`(데모 문항·검증·분류·조언·후보), `src/services/assessmentService.ts`(인터페이스·비영속 상태·revision/token), `src/mocks/analysisAdapter.ts`(정상/실패/저신뢰/부분 누락/조언 실패), `src/state/assessmentStore.ts`(UI 조립).
- 화면: `src/pages/SurveyPage.tsx`, `ResultsPage.tsx`, `RecommendationsPage.tsx`, `HomePage.tsx`, `src/components/DemoNotice.tsx`, `src/App.tsx`, `src/styles/app.css`. 기기·영상·구독은 준비 상태 유지.
- 테스트/기반: `tests/assessment.test.ts`, package.json의 npm test, tsconfig 테스트 포함/TS 확장 import 허용, index 설명·라우트 주석, 계층 README 갱신. 추가 의존성 없음, lockfile 변경 없음.
- 문서: PHASE2_DEMO_SPEC 신규, 결정 D-025~030, SCREEN_MAP·추적표·QA·TEST_RESULTS·README·본 계획 갱신. 원본/AGENTS.md 해시 유지.
- 동작: 가상 인물 고정 응답만, 필수/확인 검사, 4개 결과·null, 조언/분류 근거, 후보 4종 개념·응답별 순서, 일반 대체 안내. 입력 수정/철회는 이전 결과 무효화, 중복/늦은 요청 차단, 실패·저신뢰·누락·조언 실패·재시도 처리.
- 검증: npm run build의 타입/Vite 빌드 통과, npm test 8/8, 브라우저 61/61(주요 5화면×5크기 25건 포함). 증거는 TEST_RESULTS 및 `docs/evidence/phase2/` 참조. 전문가 검수·실제품 적합성·실기기·LOS 측정은 Not tested.
- 자료 한계: 실제 전체 설문/산식·팁별 명칭/사양/호환/효능은 미확정. 제품·임상 승인으로 해석하지 않는다. RQ-04 실제품 추천은 Partial, ONRQ-02 영상 분기는 Phase 3에 남는다.
- 로컬 미리보기: 사용자가 보기 위해 실행한 기존 서버(127.0.0.1:5173)를 유지한다. 새로고침 시 가상 응답·결과 초기화.

다음 권장 순서: **Phase 2 검토/승인 → D-006/007/011/018의 지표 의미·집계·영상 제한·동의/비영속 수명·영상/세션 관계 보완 → Phase 3만 승인받아 구현**. 실제 기기·영상 개인정보 수집 범위 확장은 별도 확인한다. **게이트: Awaiting approval**, Phase 3~5는 **Blocked**이며 여기서 중단한다.

## Phase 3 결과 및 다음 단계 제안

앞선 절은 당시 이력이다. 이후 사용자가 Phase 3만 승인해 다음 내용을 수행했다.

- 도메인/서비스/Mock: `src/domain/brushing.ts`, `video.ts`, `src/services/brushingService.ts`, `videoService.ts`, `wait.ts`, `src/mocks/deviceAdapter.ts`, `videoAdapter.ts`, `src/state/brushingStore.ts`. 실제 외부 연동 없음.
- 화면/공통: `src/pages/DevicePage.tsx`, `BrushingPage.tsx`, `BrushingDetailPage.tsx`, `VideoPage.tsx`, `src/components/MockNotice.tsx`, `DeviceState.tsx`, `CoverageChart.tsx`, App/HomePage/스타일/index 설명 갱신. 기기/양치/영상은 연결되었고 상품·구독·개인정보 운영 화면은 준비 상태다.
- 동기화: 연결/권한 거절/시간 초과/불가/중단·해제·재시도, 빈 기록, 전송 실패/1·3·10초 재시도, 중복 이벤트, 잘못된 묶음 거부. 실패/해제 후 과거 기록·최종 정상 시각 유지, 취소 후 늦은 응답 폐기.
- 기록: 예시 6건, 최근 7/14/30일(KST), 유효값 분모 평균·커버리지 추이/표·상세·6구역 예시·null 미수신. Left/압력/치아별 실제 센서는 구현하지 않았다.
- 영상: 별도 동의·거절, 시연용 MP4/WebM 20MiB 이하 형식/크기/헤더 검사, 검사 후 원본 참조 해제, 정상/실패/저품질/저신뢰 모의 결과·재시도·철회/이탈 정리. 선택적 세션 안내만 제공하고 기기 지표/기록을 수정하거나 생성하지 않는다.
- 테스트/자료: tests/brushing.test.ts 8건 + video.test.ts 5건, 기존 8건 포함 npm test 21/21. Canvas/MediaRecorder로 개인 이미지 없는 합성 WebM 생성, 실제 파일 선택 검사. 브라우저 81/81(반응형 30건 포함), npm run build 통과. 근거는 TEST_RESULTS 및 docs/evidence/phase3.
- 문서: PHASE3_DEMO_SPEC 신규, DECISIONS D-031~036, SCREEN_MAP/추적표/QA/아키텍처/README/본 계획·결과 기록 갱신. 추가 의존성 없음, 원본/AGENTS.md 해시 유지.
- 한계: 실제 영상 디코딩/화질/길이/내용·AI/CNN 성능·BLE/센서·임상·실기기·LOS 정량 수용은 검증하지 않았다. 파일 형식 검사와 Mock 상태 검증을 실서비스 수용으로 집계하지 않는다. 기존 사용자용 localhost 서버는 유지한다.

다음 권장 순서는 **Phase 3 검토/승인 → D-009~011의 상품 자료·가격 표시·주기/구성/해지·판매 URL·로컬 삭제 대상/실패 정책 보완 → Phase 4만 승인받아 구현**이다. 실제 가격/판매 링크나 거래/민감정보 저장 범위를 임의 확정하지 않는다. **현재 게이트: Awaiting approval. Phase 4~5: Blocked. 여기서 중단한다.**

## Phase 4 결과 및 다음 단계 제안

앞선 절은 당시 이력이다. 사용자 명시 승인으로 Phase 4만 수행했다.

- 범위: RQ-07/09, ONRQ-03/04, RQ-04/08 연결. 상품 목록/상세/판매 경로, 가상 구독 구성·신청/미확인·실패·재시도/철회, 설정/동의 철회/현재 탭 메모리 삭제·부분 실패/재시도를 구현했다. 원웨이 자사몰 상품 상세로 연결하며 구매·결제·주문 확인을 수행하지 않는다.
- 새 파일: domain/catalog.ts, services/subscriptionService.ts/privacyService.ts, mocks/subscriptionAdapter.ts, state/subscriptionStore.ts, components/ProductCard.tsx/ShopLink.tsx, pages/ProductsPage.tsx/SubscriptionPage.tsx/SettingsPage.tsx, tests/commerce.test.ts/privacy.test.ts, docs/PHASE4_DEMO_SPEC.md 및 evidence/phase4.
- 수정 파일: App, HomePage, RecommendationsPage, assessmentService/brushingService reset, styles/app.css, routes/screens.ts, 계층 README, 루트 README, SCREEN_MAP/ARCHITECTURE/QA_ACCEPTANCE/DECISIONS/추적표/TEST_RESULTS/본 계획. 신규 의존성 없음. 원본3종/AGENTS.md 해시 유지.
- 충돌/가정: 기획 맞춤 팁4종과 실제 모델별 소모품은 대응 미확정. PDF 가격을 판매 가격으로 사용하지 않는다. 실제 구독 요금/주기/구성/해지 미확정, 3/6개월은 가상 선택이다. 외부/다른 탭/서버 삭제는 대상 밖. D-037~042에 근거/누락/디자인 보완/검증 제약을 구분했다.
- 검증: npm test31/31, npm run build(타입 포함) Pass, 브라우저35/35. 단위10건 신규, 브라우저는 기능28 + 실제458×668 배치7이다. 콘솔 warn/error0. 지정320/360/390/430/1280 크기는 viewport 제어 미적용으로 Not tested이며 명목 검사35건을 통과 집계에서 제외했다. 상세 증거/한계는 TEST_RESULTS Phase4.
- 로컬 미리보기: http://127.0.0.1:5173/products. 기존 사용자용 서버 유지. Phase5 통합 검증/성능30회/사용자5명/전문가 검수는 수행하지 않았다.

다음 권장 순서: **Phase 4 결과·모바일 미검증 한계 검토 → 사용자 Phase 5 명시 승인 → 실제 viewport 일치 확인 후320~430px 재검증 → 전체 정상/예외/접근성·디자인 통합 점검 → 수행 가능한 정량 검사와 외부 검수 필요 항목 분리 보고**. 실제 상품 적합성·구독 정책은 자료 보완 전 확정하지 않는다. **Phase 4: Awaiting approval. Phase 5: Blocked. 여기서 중단한다.**



## Phase 5 결과

2026-10-30 Phase4 승인 후 Phase5만 수행. 구독 오류 색상·필수 초점/오류 연결·입력 초점 보완. 테스트31/31, 타입/빌드 Pass, 기능44/44+실측 배치130/130. 30회씩 측정 p95 화면312ms/설문697ms/영상841ms(로컬 Mock 프록시). 원본/AGENTS 보존. FINAL_QA_REPORT에 파일·근거·정량 한계·미검증 공개. 사용자5명/전문가/실기기/실AI는 Not tested. Phase4 모바일 공백 재검증 완료. **Phase5 Awaiting approval, 다음 승인 전까지 중단한다.** 추가 Phase/배포 계획은 별도 승인 필요.

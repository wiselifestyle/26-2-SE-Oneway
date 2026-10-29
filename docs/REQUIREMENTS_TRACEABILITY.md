# 요구사항 추적표

2026-10-30 Phase 4까지 구현. **RQ-07/09, ONRQ-03/04의 로컬 데모·판매 링크를 검증했다. RQ-04 실제 상태별 상품 적합성은 Partial이다.** 실제 제품 적합성·임상·BLE/영상 판독/거래·서버 삭제 수용을 통과로 계산하지 않는다. Phase 4 지정 모바일 크기 재검증은 도구 제약으로 Not tested다.

## 핵심 기능과 예외

| 요구사항 / 성격 | 원본 위치·PDF 근거 | 화면 / 목표 Phase | SSAD 매핑 | 수용 검증 연결 및 공백 | 구현 / 검증 |
|---|---|---|---|---|---|
| RQ-01 설문 [S] | SSRD §3.2.1 RQ-01; PDF p.12 | S02→S03 / 2 | COM-02, BH-01, DCOM-01, OBJ-02, OP-01 | P2-SURVEY: 가상 응답 정상/미확인/누락 차단, D-025 | 데모 구현 / Pass(가상 응답) |
| RQ-02 결과 [S] | SSRD RQ-02; PDF p.21~22, 보조 p.12 | S03 / 2 | COM-02, BH-01, DCOM-01, OBJ-02, OP-01 | P2-RESULT: 4항목 수준/설명·미수신 null·이전 ID 거부, D-026 | 데모 구현 / Pass(응답 표시) |
| RQ-03 조언 [S] | SSRD RQ-03; PDF p.12/21~22 | S03/S04 / 2 | COM-02, BH-02, DCOM-01/06, OBJ-03, OP-01 | P2-ADVICE: 응답별 사전 조언·오류 보류/재시도, D-026/029 | Mock 구현 / Pass(Mock), 임상/감수 Not tested |
| RQ-04 팁 추천 [S] | SSRD RQ-04; PDF p.21 | S05, 연계 S09 / 2→4 | COM-02/04, BH-02, DCOM-03, OBJ-06, OP-01/04 | P2-TIPS: A~D 후보·분류 이유·일반 대체, D-027. 실제 명칭/호환/적합성 미확정 | Partial / 데모 상호작용 Pass, 실제품 Not tested |
| RQ-05 양치 기록 [S] | SSRD RQ-05; PDF p.20 | S06/S07/S11 / 3 | COM-03, BH-03, DCOM-02/06, OBJ-04, OP-02 | P3-DEVICE/SYNC/RECORD: 6건/기간 평균/추이/결측/중복/보존, D-031/032 | Mock 구현 / Pass(Mock), 실측 Not tested |
| RQ-06 영상 분석 [S] | SSRD RQ-06; PDF p.20/22, 보조 p.12 | S12 / 3 | COM-03, BH-04, DCOM-02/06, OBJ-05, OP-03 | P3-VIDEO: 동의/형식·크기·헤더/모의 결과/보류·회복, D-033~035 | Mock 구현 / Pass(Mock), 실제 판독 Not tested |
| RQ-07 구독 [S] | SSRD RQ-07/§2.3; PDF p.13/15, 가격 기획 p.25/27 | S08~S10a / 4 | COM-04, BH-05, DCOM-04, OBJ-06/07, OP-04 | P4-SUBSCRIPTION: 상품/가상 주기/필수 확인·신청/철회. D-039, 실제 요금/해지 미확정 | Pass(로컬 데모), 실제 구독 Not tested |
| RQ-08 홈 [S] | SSRD RQ-08; PDF p.14 | S01 / 2~4 | COM-01, §3.1.5 Presentation | P2/3-HOME + P4-HOME: 평가/기록·가상 신청 요약/이탈 완료·삭제 반영 | Pass(데모 흐름), 실제 계정 Not tested |
| RQ-09 판매 경로 [S] | SSRD RQ-09/SI-02; PDF p.11/15, 보조 p.24 | S09/S14 / 4 | COM-04, BH-05, DCOM-06 판매 링크 경계, OP-04 | P4-CATALOG/LINK: 사용자 자사몰·4상품 URL/새 탭·주소 예외·미감지 한계 안내, D-037 | Pass(링크), 실거래/실시간 상태 Not tested |
| ONRQ-01 기기 실패 [A] | SSRD §3.2.2; RQ-05 유도 | S06/S07/S11 / 3 | COM-03, BH-03, DCOM-02/06, OP-02, Figure 2-2 | P3-DEVICE/SYNC: 거절/시간 초과/불가/전송/취소·재시도/과거 보존 | Pass(Mock), 실제 권한/기기 Not tested |
| ONRQ-02 분석 실패 [A] | SSRD §3.2.2; RQ-01/03/06 유도 | S02~S04 / 2, S12 / 3 | COM-02/03, BH-01/02/04, DCOM-01/02/06, OP-01/03 | P2-ERROR/RACE, P3-VIDEO: 실패/저품질/저신뢰/지연·취소/회복 | Pass(Mock), 실제 AI Not tested |
| ONRQ-03 주문 실패 [A] | SSRD §3.2.2; RQ-07/09 유도 | S10/S10a/S14 / 4 | COM-04, BH-05, DCOM-04/06, OP-04 | P4-SUBSCRIPTION/LINK: 실패/미확인/재시도/중복/중단·늦은 응답 폐기, 결제 성공 표시 없음 | Pass(Mock), 외부 주문 상태 Not tested |
| ONRQ-04 개인정보 [A] | SSRD §3.2.2/PR-03/LOS-03 | S12 / 3, S13/S13a / 4 | COM-05, BH-06, DCOM-05, OBJ-01, OP-05 | P3-VIDEO + P4-PRIVACY: 철회/이탈·확인/취소/실제 reset·부분 실패/재시도·지연 무효화 | Pass(로컬 데모), 실서버/계정 삭제 Not tested |

QA는 `QA_ACCEPTANCE.md`의 해당 ID다. 화면 상세·주요 상태·경로는 `SCREEN_MAP.md`, 충돌·미결은 `DECISIONS.md`를 참조한다. RQ-04의 Phase 2 상품 연결은 준비 안내까지만 제공한다.

위 Phase 2 준비 연결 설명은 당시 이력이다. Phase 4는 실제 판매 상품 목록을 별도 연결했으며 맞춤 후보/상품 대응은 여전히 미확정이다.

## Phase 4 구현·검증 연결

| 요구사항/SSAD | 실제 파일 | 검증·한계 |
|---|---|---|
| RQ-04/09, COM-04/OBJ-06/OP-04 | domain/catalog.ts, components/ProductCard.tsx/ShopLink.tsx, pages/ProductsPage.tsx/RecommendationsPage.tsx | 상품 4개·상세·판매 경로·호스트 검증·주소 없음/불가. 실제품 임상 적합성 Partial |
| RQ-07/ONRQ-03, DCOM-04/OBJ-07/BH-05 | services/subscriptionService.ts, mocks/subscriptionAdapter.ts, state/subscriptionStore.ts, pages/SubscriptionPage.tsx | 가상 구성/필수/중복·실패·미확인·철회/취소·삭제 경합. 거래 수행 없음 |
| ONRQ-04, COM-05/BH-06/OP-05 | services/privacyService.ts, assessmentService.ts/brushingService.ts의 reset, pages/SettingsPage.tsx | 실제 세 대상 reset/대상별 부분 실패·재시도/진행 작업 폐기. 서버 삭제 제외 |
| RQ-08, COM-01 | pages/HomePage.tsx, App.tsx | 가상 상태/진입·삭제 후 초기화·이탈 후 강제 이동 없음 |
| QA | tests/commerce.test.ts 6건, tests/privacy.test.ts 4건 | 신규 10건 + 기존 21건 = 31/31. 브라우저 35/35(실제 458px 배치 7건 포함). 320~430 지정 뷰포트 재검증 Not tested |

증거: docs/evidence/phase4, 상세 결과 TEST_RESULTS Phase 4. 전체 Phase 5 정량 수용/사용자·전문가 검수는 수행하지 않았다.

## 인터페이스·품질·프로젝트 요구사항

기존 QA 초안만으로 원본의 정량 수용 기준을 충족했다고 판단하지 않는다. 아래 기준은 원본 보존 및 향후 검증 계획이며 측정/검수 결과가 아니다.

| ID / SSRD 위치 | 원본 기준 | 웹 대응 및 검증 시점 | 상태 / 검증 |
|---|---|---|---|
| PR-01, §2 | RQ-01~09 정상/예외 각 ≥1건 | Phase 2~5 각 요구사항 시나리오 증거 | Planned / Not tested |
| PR-02, SI-02 | 외부 판매처가 거래 원장 소유, 확인된 주문 ID만 접수 완료 | Phase 4 가상 요청/실주문 분리, 주소 없는 연결 제한 | Mock 대체 계획 / Not tested |
| PR-03, LOS-03 | 명시 동의·암호화·역할 권한, 영상 30일/계정 삭제 30일 이내 | Phase 3/4 영상 비영속·로컬 삭제. 서버 보관/암호화/실인증은 제외 D-011 | 범위 대체 기록 / Not tested |
| PR-04, §2.1~2.5 | 4명/9주/30만원, 지원 기기 1종/팁 4종, 문의 2영업일 | 운영 약속 미채택. 단계 승인 계획 우선 D-001/017 | 운영 범위 제외 / Not tested |
| UI-01/02, §4.1 | 핵심 화면 이동, 항목명·수준·설명·권고 구분 | S01~S15, Phase 1 셸/2~5 기능. 예시를 임계값으로 사용 금지 | Planned / Not tested |
| UI-03 | 연결/영상/주문 각각 대기·성공·실패, 총 9개 상태 UI 시험 | Phase 3/4 성공은 Mock 작업 완료만, 실주문 성공으로 대응 금지 | Planned / Not tested |
| UI-04, LOS-06 | 분석 화면 비진단 고지 100%, 개발 검토·외부 치과 전문가 1회 사전 감수 | S03/S04/S05/S07/S12, Phase 2~5 고지 검사. 전문가 검수 미수행·출시 검수 통과 주장 금지 | Planned / Not tested |
| HI-01, §4.2 | BLE 5.0 가정, 기기 ID/시각/시간/커버리지/점수 레코드 | Phase 3 Mock 데이터, 결측 null. 실제 센서/호환 시험 제외 | Mock 대체 계획 / Not tested |
| CI-01, §4.3 | TLS 1.2+, 이벤트 중복 제거, 1/3/10초 최대 3회 재시도, 최종 갱신 | Phase 3 Mock 중복/보류/재시도 검사. 실제 통신/TLS 제외, 간격 변경 시 결정 기록 | Mock 대체 계획 / Not tested |
| SI-01, §4.4 | analysis API, request_id/status/model_version/results/advice/error_code | Phase 2/3 내부 Mock 인터페이스 책임 대응, 실제 REST 서버 없음 | Mock 대체 계획 / Not tested |
| LOS-01, §5 | 각 30회 p95: 화면 2초/설문 5초/영상 20초 이하 | Phase 5 환경 고정 웹/Mock 측정. 실제 AI 성능으로 해석 금지 | Planned / Not tested |
| LOS-02 | 독립 영상 100건 macro-F1 ≥0.80 목표, 신뢰도 0.60 미만 보류 | 실제 모델 시험 제외. Phase 2/3 Mock 저신뢰 보류만 검사, 실제 보정 신뢰도로 주장 금지 | 실제 모델 평가 제외 / Not tested |
| LOS-04 | ONRQ 각 ≥3건, 총 ≥12건, 중복 처리 0, 최종 정상 갱신 시각 | Phase 2~5 누적 예외 검사. 부분 삭제 실패/주문 미확인/분석·연결 중단 포함 | Planned / Not tested |
| LOS-05 | 사용자 5명, 설문/결과/추천 각 ≥80% 완료, 작업당 3분 이내 | Phase 5 참여자 시험 필요. 개발자 클릭으로 대체 통과 금지 | Planned / Not tested |
| ER-01~04, §6 | D2C/B2B, 모델 갱신, 품목/기기 확장 [F] | 별도 승인 전 구현 제외, 어댑터 책임 문서만 유지 | Deferred [F] / Not tested |

SSAD 매핑은 §2.1 COM, §2.2 BH, §3.1.2 DCOM, §3.2 OBJ, §3.3 OP, §3.4 Class, §3.5 Configuration 및 부록 A/B와 대조했다. 기능 구현 후 실제 파일·검증 로그를 추가하며 Mock 대체를 원본 전체 Pass로 기록하지 않는다. Phase 0 문서 검사 결과는 `TEST_RESULTS.md`에 별도로 기록한다.

## Phase 1 구현 파일과 검증 근거

| 관련 ID | 실제 파일 | 제공 범위 | 검증·판정 |
|---|---|---|---|
| COM-01, UI-01, RQ-08 일부 | src/main.tsx, src/App.tsx, src/routes/screens.ts, src/components/AppShell.tsx, src/pages/HomePage.tsx | 4탭·홈 진입·부모/브라우저 복귀·17개 경로·제목/초점 | P1-BUILD/P1-NAV/P1-KEY Pass (셸만). RQ-08 전체 Partial |
| UI-01, 모바일 정책 | src/styles/app.css, src/components/NavigationCard.tsx | 토큰·밝은/어두운 테마·safe-area CSS·390px PC 제한·모바일 전체 폭 | P1-LAYOUT 85건 Pass. 실기기 safe-area/키보드 Not tested |
| RQ-01~07/09, ONRQ-01~04의 진입 화면만 | src/pages/PreparationPage.tsx, src/components/StateNotice.tsx | 기능별 준비 안내·관련 경로 이동. 데이터/처리 없음 | P1-NAV/P1-SCOPE Pass. 각 요구사항 정상/예외는 Not tested |
| UI-01 예외 경로 | src/pages/NotFoundPage.tsx | 알 수 없는 경로·홈 복귀 | P1-NAV Pass |
| SSAD §3.1.5 계층 | src/domain/README.md, src/services/README.md, src/mocks/README.md | 책임·의존 방향 문서. 계약/서비스/어댑터 실행 없음 | 구조 검토 완료. 업무 기능 Planned |

P1 검증 ID는 TEST_RESULTS의 Phase 1 표와 연결된다. 원시 브라우저 결과는 `docs/evidence/phase1/browser-checks.json`, 빌드 출력은 같은 폴더 build.log다. 137건은 앱 셸 검사이며 SSRD의 업무 정상/예외 시험 수로 합산하지 않는다.

## Phase 2 구현 파일과 검증 근거

| 요구사항·SSAD | 실제 파일 | 범위 및 검증 |
|---|---|---|
| RQ-01/02, DCOM-01, OBJ-02, OP-01 | src/domain/assessment.ts, src/services/assessmentService.ts, src/pages/SurveyPage.tsx, src/pages/ResultsPage.tsx | 단일 필수 4문항·가상 입력 경계·결과/결측. P2-SURVEY/RESULT/RACE |
| RQ-03, OBJ-03, BH-02 | src/domain/assessment.ts, src/pages/ResultsPage.tsx, src/components/DemoNotice.tsx | 사전 조언/분류 근거·비진단 고지·미수신/실패 보류. P2-ADVICE/ERROR |
| RQ-04, DCOM-03, BH-02 | src/domain/assessment.ts, src/pages/RecommendationsPage.tsx | 임시 후보 4종 분류·이유/일반 정보. 사양/효능 미제공. P2-TIPS |
| RQ-08, COM-01 | src/pages/HomePage.tsx, src/App.tsx | 미평가/진행/보류/결과 요약·진입·이어보기. P2-HOME |
| ONRQ-02, DCOM-06, OP-01 | src/mocks/analysisAdapter.ts, src/services/assessmentService.ts, src/state/assessmentStore.ts | 인터페이스/Mock/UI 분리, 요청 중복/지연·수정 무효화, 실패·저신뢰·부분 누락·재시도. P2-ERROR/RACE |
| UI-01/02/04, 반응형 | src/styles/app.css, 위 화면·고지 컴포넌트 | 5화면×5개 크기 25건, 키보드 선택/제출, 비진단 고지. P2-LAYOUT/KEY. 전체 접근성/LOS 감수 미수행 |

검증 파일: tests/assessment.test.ts, docs/evidence/phase2/unit-tests.log (8/8), browser-checks.json (61/61), build.log. 규칙 근거/가정은 PHASE2_DEMO_SPEC 및 D-025~030. UI/LOS/PR의 위 표에서 Planned인 정량/실서비스 수용은 완료로 바꾸지 않았다.

## Phase 3 구현과 검증 근거

| 요구사항·SSAD | 실제 파일 | 검증 및 한계 |
|---|---|---|
| RQ-05, ONRQ-01, DCOM-02/06, OP-02 | src/domain/brushing.ts, src/services/brushingService.ts, src/mocks/deviceAdapter.ts, src/state/brushingStore.ts, src/services/wait.ts | P3-DEVICE/SYNC: 연결/동기화/재시도·취소/중복/최종 시각/검증 실패 보존. 실BLE 없음 |
| RQ-05/UI-02, OBJ-04 | src/pages/BrushingPage.tsx, BrushingDetailPage.tsx, src/components/CoverageChart.tsx, DeviceState.tsx | P3-RECORD: 7/14/30일 평균 분모·null/0·KST 경계·기간 복귀·구역 결측. Left/압력·실센서 미지원 |
| RQ-06, ONRQ-02/04, DCOM-02/06, OBJ-05, OP-03 | src/domain/video.ts, src/services/videoService.ts, src/mocks/videoAdapter.ts, src/pages/VideoPage.tsx | P3-VIDEO: 동의·헤더/크기·보류/회복·철회/취소/이탈. 파일 내용 디코딩/품질 판독·실AI 없음 |
| RQ-08/ UI-01/04 | src/pages/HomePage.tsx, src/App.tsx, src/components/MockNotice.tsx, src/styles/app.css | P3-HOME/LAYOUT/KEY/REGRESSION: 홈 기기 요약·Mock 고지·5화면+영상 결과 30개 viewport 조합·키보드·Phase 2 회귀 |

tests/brushing.test.ts 8건, tests/video.test.ts 5건 신규. 기존 8건 포함 단위 21/21. docs/evidence/phase3의 browser-checks.json 81/81, build.log/unit-tests.log/스크린샷/console-check.json이 근거다. UI-03은 기기·영상 분기만 검사했고 주문 분기는 Phase 4에 남는다. LOS 정량/실기기/임상 수용은 여전히 Not tested.

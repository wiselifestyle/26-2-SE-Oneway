# ONEWAY 모바일 웹 프로토타입

React + TypeScript + Vite 기반의 한국어 모바일 웹 프로토타입입니다. 현재 **Phase 4 구현 완료 / Awaiting approval**, Phase 5는 미착수입니다. 가상 설문·조언·추천, 기기/양치/영상 Mock, 자사몰 상품 연결·가상 구독·체험 확인 철회/로컬 삭제를 제공합니다. 실제 의료 산식·상태별 제품 적합성·하드웨어·실구독 정책은 미확정입니다. Phase 4 지정 모바일 크기 재검증은 도구 제약으로 미수행입니다.

## 로컬 실행

Node.js 22.12 이상(검증 환경 24.15.0), npm이 필요합니다.

```powershell
npm ci
npm run dev
```

표시되는 [로컬 주소](http://127.0.0.1:5173/)를 여세요. 종료는 실행 터미널에서 Ctrl+C입니다. 루프백에만 바인딩하며 배포 서버가 아닙니다.

```powershell
npm run typecheck
npm test
npm run build
npm run preview
```

빌드는 타입 검사를 포함하며 결과는 dist/에 생성됩니다. npm test는 Node 내장 runner로 누적 도메인·서비스 테스트 31개를 실행합니다(검증 환경 Node 24.15.0). lint는 미설정입니다. preview는 빌드 후 [4173 포트](http://127.0.0.1:4173/)로 실행됩니다. 정적 호스팅은 BrowserRouter 직접 URL 진입을 위한 index.html fallback이 필요합니다. 호스팅 배포는 하지 않았습니다.

## 현재 확인 가능한 내용

- 홈 / 양치 관리 / 제품 / 설정 탭, 헤더 뒤로가기·브라우저 이력·직접 URL 복귀, 없는 경로 안내.
- 홈에서 구강 테스트 시작→체험 확인→가상 응답 4개 선택→모의 결과→조언/추천 후보를 확인할 수 있습니다. 미선택은 제출 차단, 알 수 없음/미수신은 평가 불가입니다.
- 응답 수정·체험 확인 해제는 이전 결과/조언/추천을 무효화합니다. 새로고침하면 응답·결과가 사라집니다. 이름·자유 입력·실제 건강정보를 입력하지 마세요.
- 양치 관리→기기 연결·동기화→시연용 기기 연결→예시 기록 동기화로 6건의 Mock 기록을 받을 수 있습니다. 7/14/30일 통계·추이/표·상세·미수신을 볼 수 있고 해제/전송 실패 시 과거 기록을 유지합니다.
- 영상 모의 분석은 별도 동의 후 시연용 MP4/WebM(20MiB 이하)만 로컬 검사합니다. 실제 사람/구강 영상은 선택하지 마세요. [개인 이미지 없는 합성 WebM](tests/fixtures/oneway-synthetic.webm)을 테스트에 사용할 수 있습니다. 파일은 검사 후 참조를 해제하고 모의 처리 결과만 표시합니다. 영상 내용·화질·길이·실제 AI 판독은 검사하지 않습니다.
- 제품 목록/추천→상품 상세→원웨이 자사몰 새 탭으로 이동합니다. 실제 상태별 맞춤 적합성을 확인한 상품은 아니며, 모델/옵션·현재 가격·재고는 판매처에서 확인하세요. 임의 ID URL은 데이터를 생성하지 않습니다.
- 구독 체험은 상품·가상 3/6개월·체험 확인→로컬 요청/외부 미확인·철회 흐름입니다. 실제 주문·요금·정기배송 계약이 아니며 주소/결제정보를 입력하지 않습니다.
- 설정→동의와 로컬 데이터에서 설문/구독 체험 확인을 철회하고, 삭제 확인 후 현재 탭의 설문·양치·구독 메모리를 삭제합니다. 부분 실패 시 남은 대상을 표시합니다. 외부 판매처/다른 탭/서버 데이터는 삭제하지 않습니다.
- 모바일 전체 폭, PC 390px 중앙 배치, 공통 밝은 테마와 양치 영역 어두운 테마, 키보드 초점 표시.
- 브라우저 영속 저장·서버 전송, 실제 AI 진단·BLE·결제·주문·배송은 제공하지 않습니다. 영상 상태는 화면 이탈/선택 해제/동의 철회 시 지워지고, 기기·기록도 새로고침 시 초기화됩니다.

데모 규칙과 미확정 범위는 [PHASE2_DEMO_SPEC](docs/PHASE2_DEMO_SPEC.md)에 있습니다. 개발 서버의 `/assessment?demoDebug=1`에서만 개발자 시나리오를 펼쳐 실패·저신뢰·일부 누락·조언 실패를 재현할 수 있습니다. 일반 화면/프로덕션에는 이 선택 UI가 없습니다.

기기·영상 규칙은 [PHASE3_DEMO_SPEC](docs/PHASE3_DEMO_SPEC.md)입니다. 개발 서버의 `/device?demoDebug=1`, `/video-analysis?demoDebug=1`에서 연결 거절/시간 초과·전송 실패/빈 목록·영상 실패/저품질/저신뢰를 선택할 수 있습니다. 재시도 지연은 1/3/10초이며 중단할 수 있습니다. 새 URL 직접 진입은 새 문서 로드로 메모리가 초기화될 수 있으므로 예시 기록을 다시 동기화하세요.

상품·구독·삭제 규칙과 출처는 [PHASE4_DEMO_SPEC](docs/PHASE4_DEMO_SPEC.md)입니다. 개발 서버의 `/subscription?demoDebug=1`, `/sales-channels?demoDebug=1`, `/settings/privacy?demoDebug=1`에서 모의 주문 실패/미확인·판매 주소 없음·부분 삭제 실패를 선택할 수 있습니다. 삭제 실패를 기록이 있는 상태에서 보려면 개발 쿼리 화면→홈/기기로 이동해 기록 생성→브라우저 뒤로가기로 개발 쿼리 화면에 돌아오세요. 주소창 직접 진입/새로고침은 메모리를 초기화합니다.

검증 결과와 스크린샷은 [TEST_RESULTS](docs/TEST_RESULTS.md), 경로 목록은 [SCREEN_MAP](docs/SCREEN_MAP.md), 승인 게이트는 [IMPLEMENTATION_PLAN](docs/IMPLEMENTATION_PLAN.md)에 있습니다.

## 코드 구조

| 위치 | 책임 |
|---|---|
| src/routes | 화면 경로/메타데이터 |
| src/components | 앱 셸·탭·공통 상태/링크 |
| src/pages | 평가·양치·기기·영상·상품·구독·설정/삭제·경로 없음 |
| src/styles | 토큰·반응형·테마 |
| src/domain | 설문 분류/조언/후보·양치 집계/검증·영상 검사·상품 출처/주소 검증 |
| src/services, src/mocks | 평가·기기/영상·가상 구독·삭제 결과 및 취소/요청 경쟁 관리·Mock 어댑터 |
| src/state | 메모리 서비스와 React 구독 조립 |
| tests | 도메인/서비스 불변식·오류/경쟁 검증 |

런타임 의존성은 React/React DOM, React Router, Lucide이며 Tailwind/Vite/TypeScript 및 플러그인/타입은 개발 의존성입니다. 버전은 package.json과 package-lock.json에 고정했습니다. 원본 가격·수치를 현행 정보나 실제 측정값으로 사용하지 않습니다.

## 초기 문서 패키지 사용 순서 (이력)
1. 패키지 내용을 작업 폴더에 압축 해제한다.
2. Codex에서 **`AGENTS.md`가 있는 `ONEWAY_Codex_Modular` 폴더**를 프로젝트로 선택한다.
3. `START_PROMPT.md`의 본문을 첫 요청에 입력한다.
4. Phase 0 결과(`SCREEN_MAP`, 추적표, 결정 기록)를 검토한다.
5. 승인할 경우 `Phase 0을 승인한다. AGENTS.md와 IMPLEMENTATION_PLAN.md에 따라 Phase 1만 수행해.`라고 지시한다.
6. 각 단계 종료 후 시험 결과와 화면을 검토하고 다음 Phase를 승인한다.

## 지침 분리
- `AGENTS.md`: 항상 적용되는 개발/승인 규칙
- `docs/PRODUCT_REQUIREMENTS.md`: 요구사항 및 범위
- `docs/UI_UX_SPEC.md`: 화면/디자인 기준
- `docs/ARCHITECTURE.md`: 기술/Mock 구조
- `docs/IMPLEMENTATION_PLAN.md`: 단계별 구현 게이트
- `docs/QA_ACCEPTANCE.md`: 기능 및 예외 검증
- `docs/REQUIREMENTS_TRACEABILITY.md`: 문서-코드-테스트 대응
- `docs/DECISIONS.md`: 가정·충돌 기록
- `START_PROMPT.md`: 최초 실행 프롬프트 (AGENTS.md와 달리 상시 규칙 아님)

**유의:** 원본 파일과 AGENTS.md를 보존합니다. Phase 5 진행은 사용자의 명시적 승인이 필요합니다.

# Phase 0 검토 및 검증 기록

**최신 상태 (2026-10-30): Phase 5 완료 / Awaiting approval.** 앞부분은 단계별 이력이며 최신 결과/미검증 크기는 아래 Phase 4 절을 따른다.

일자: 2026-10-30 (Asia/Seoul). 환경: Windows/PowerShell, Codex 번들 Python 3 런타임의 python-docx/pypdf/pypdfium2/Pillow. **문서 검사는 앱 기능 수용 시험이 아니다.** 구현 파일 없음, 실행 수용 시험은 모두 Not tested.

## 검토 방법과 결과

| 검사 ID | 대상·방법 | 기대값 | 실제 결과 | 판정 / 후속 조치 |
|---|---|---|---|---|
| P0-D01 | AGENTS.md, docs의 기존 7개 파일, README/START_PROMPT UTF-8 전체 읽기 | 범위·단계·검증 지침 파악 | 전체 읽음. Phase 0만 허용, 코드 작성 금지 확인 | 문서 검사 완료 |
| P0-D02 | python-docx로 SSRD 문단/표 전체 추출 | RQ/ONRQ 및 보조 수용 기준 파악 | v1.1, RQ-01~09/ONRQ-01~04, PR/UI/HI/CI/SI/LOS/ER 및 부록 확인 | 문서 검사 완료. DOCX 페이지 레이아웃 렌더 검사는 수행하지 않음 |
| P0-D03 | python-docx/ZIP으로 SSAD 전체 문단/표 및 내장 이미지 6개 확인 | 구조·객체·동작 흐름 파악 | COM-01~05, BH-01~06, DCOM-01~06, OBJ-01~07, OP-01~05 및 도표 확인 | 문서 검사 완료. DOCX 페이지 레이아웃 렌더 검사는 수행하지 않음 |
| P0-D04 | pypdf 텍스트 추출 후 pypdfium2로 PDF 32쪽 PNG 렌더 | 모바일 화면을 실제 그림으로 확인 | 텍스트는 실질 공백, pypdf가 일부 object offset 경고 출력. 32쪽 렌더 성공, 전체 개요 확인, p.12/14/20/21/22 확대 및 p.13/25/27 등 문맥 확인 | 시각 대조 완료. 검색 가능한 텍스트 원본/설계 에셋 없음 |
| P0-D05 | SCREEN_MAP/추적표/결정/계획의 ID·링크·상태 대조 | 13개 핵심 요구사항/5개 OP 대응, 가정 명시 | 화면별 경로/상태, 예외 Phase 2·3·4 분담, UI/LOS 미검증 범위 기록 | 문서 구조 검사 완료, 기능 검증 아님 |
| P0-D06 | AGENTS.md와 원본 3개의 SHA-256 비교 | 원본 보존 | 아래 해시와 최종 검사 일치 | 문서 보존 확인 |
| P0-D07 | 작업 폴더 파일 목록 및 게이트 확인 | 변경은 Markdown 문서, Phase 0 Awaiting approval / 나머지 Blocked | 문서 5개 작성/갱신, 임시 렌더 자료 정리, 앱 코드/패키지 생성 없음 | 단계 경계 확인 |

검토 명령 계열: `Get-Content -Raw -Encoding UTF8`, `rg --files`, 번들 Python의 `Document(...).paragraphs/tables`, `ZipFile(...).read(...)`, `PdfReader(...).pages`, `PdfDocument(...).render(...)`, `Get-FileHash -Algorithm SHA256`. 이미지 검토에는 로컬 이미지 뷰어를 사용했다. 외부 웹 정보·판매 주소를 보충하지 않았다.

Git 상태 조회는 ‘not a git repository’로 종료되었다. Git diff를 근거로 변경 내역을 보고하지 않으며 파일 목록·검사로 확인한다.

## 원본 보존 해시

| 파일 | SHA-256 |
|---|---|
| AGENTS.md | 3207F8DE6A16D7ABD805D81297DEA814DCB2FDF861191BD8349C9C7C4A347DB5 |
| references/Oneway_SSRD(1).docx | F8D49D63B8B85D1B188691624400914413CF2F2311CB931B8D971C43E6A7F08C |
| references/ONEWAY_SSAD(2).docx | 68D95E452EF1B7FBD3A875C0F78D39F027F3DCE3F8F485588A201CD8230B57D9 |
| references/Oneway 최종본(2).pdf | 2F6613FA4573A522B901BB2AA37E950B9F6D10CB1AF6180BC991DEFD0DD5A09A |

## 실행 수용 시험

| 범위 | 판정 | 이유·향후 조치 |
|---|---|---|
| 빌드/타입/lint/단위 테스트 | Not tested | Phase 0은 코드 미작성. Phase 1 이후 환경 구성 시 실행 |
| 390/360/320/430px 및 PC 화면 | Not tested | 실제 앱 없음. Phase 1에서 레이아웃·탭·뒤로가기 검사 |
| RQ-01~09, ONRQ-01~04 클릭/상태 전이 | Not tested | 설계 매핑만 작성. 승인된 단계별 구현 후 검증 |
| LOS 정량 성능·사용성·전문가 검수 | Not tested | 측정/참여자 시험/외부 감수 미수행 |
| 실제 BLE·AI·결제·서버 개인정보 처리 | Not tested / 구현 범위 밖 | Mock 검증과 원본 실서비스 수용을 구분할 것 |

미결 자료와 후속 조치는 DECISIONS D-003~018 및 IMPLEMENTATION_PLAN의 단계별 선행 조건을 따른다. **Phase 0 게이트: Awaiting approval.**

## Phase 1 앱 셸 검증

일자: 2026-10-30 (Asia/Seoul). 위 Phase 0 기록은 당시 결과이며, 이후 사용자 승인을 받아 Phase 1을 수행했다. 환경: Windows, Node v24.15.0, npm 11.12.1, Vite 8.3.5, TypeScript 7.0.2, React 19.3.1, React Router 8.5.1, Tailwind 4.3.3, Lucide 1.64.0. 브라우저: Codex in-app browser, 개발 서버 `http://127.0.0.1:5173/`.

| 검사 ID | 수행 방법 | 기대값 | 실제 결과 | 판정 |
|---|---|---|---|---|
| P1-INSTALL | npm view의 버전/엔진 조회, npm install, npm ls --depth=0 | 승인된 스택·타입만 설치, 의존성 정상 | 47개 패키지 추가, 설치 시 audit 0 vulnerabilities, lockfile 생성, 직접 의존성 모두 정상 | Pass |
| P1-BUILD | npm run build (내부 npm run typecheck → tsc --noEmit → vite build) | 타입 오류 없이 프로덕션 출력 | 최종 종료 코드 0. 2,113개 모듈, index.html 0.68kB / CSS 10.41kB / JS 274.79kB. 최종 Vite 빌드 683ms | Pass |
| P1-HTTP | Invoke-WebRequest 로컬 주소, 브라우저 접속 | HTTP 200 및 앱 렌더 | 서버 위치 조정 후 HTTP 200, 홈 정상 렌더 | Pass |
| P1-NAV | 브라우저 실제 링크 클릭/직접 URL/뒤로·앞으로 | 준비 경로와 올바른 복귀, 선택 탭 1개 | 직접 경로 17개, 주요 4화면의 고유 링크 26개, 탭 4개, 직접 부모 연속 복귀·조언 부모·브라우저 이력 통과. 홈 CTA→테스트→헤더 뒤로→홈 및 없는 경로→홈도 별도 확인 | Pass (셸만) |
| P1-LAYOUT | 17경로 × 320×800/360×800/390×844/430×844/1280×900, DOM 크기 측정·대표 화면 시각 검토 | 가로 넘침 없음, 모바일 가용 폭, PC 390px 중앙, 탭바 같은 폭·화면 하단 | 85/85 통과. document scrollWidth≤clientWidth+1px, 셸/탭바 정렬 오차<1px. 홈 320/360/390/430/1280 및 양치 390 스크린샷 저장. 홈 하단까지 스크롤 시 고지 하단이 탭바 위에 위치함도 확인 | Pass |
| P1-KEY | 본문에서 Tab, CTA Enter, 초점/outline 관찰 | 링크 포커스 표시·키보드 이동, 라우트 전환 본문 초점 | CTA에 solid outline, Enter로 테스트 이동, 4탭 이동 시 main-content 초점 | Pass (검사한 경로) |
| P1-SCOPE | 영상 준비 화면 DOM 검사, src 정적 검색/계층 검토 | 입력/폼·기능 실행 없음, 저장/외부 연동 없음 | 입력/textarea/select/form 0, Phase 3 준비 안내. src에 localStorage/sessionStorage/fetch/Bluetooth/파일 입력·평가/주문 함수 구현 없음. 도메인/서비스/Mock은 책임 문서만 존재 | Pass (Phase 1 경계) |
| P1-CONSOLE | 브라우저 warning/error 로그 조회 | 오류 없음 | 검사 시 수집된 warn/error 없음 | Pass |
| P1-PRESERVE | 원본 3개·AGENTS.md SHA-256 재비교 | Phase 0 해시 유지 | 4개 모두 위 해시와 동일 | Pass |
| P1-LINT/UNIT | 설정 유무 확인 | 설정된 검사 실행 | lint/단위 테스트 스크립트·도구 미설정, 미실행. 별도 테스트 라이브러리 추가 없음 | Not tested |
| P1-DEVICE | 실기기/소프트 키보드/노치 | 실제 기기에서도 배치 확인 | 브라우저 viewport 검사만 수행. 실제 모바일 기기·키보드·safe-area 수치 시험 없음 | Not tested |
| RQ-01~09/ONRQ-01~04 전체 | 단계별 업무 수용 시나리오 | 기능과 정상/예외 처리 | 셸·준비 안내만 존재. RQ-08 진입 기반 일부 외에는 기능 미구현 | Not tested (RQ-08 Partial) |

**원시 결과:** [browser-checks.json](evidence/phase1/browser-checks.json) 137/137 통과. 구성은 직접 경로 17 + 탭 4 + 직접 부모 연속 복귀 1 + 레이아웃 85 + 키보드 1 + 브라우저 이력 1 + 조언 부모 1 + 고유 링크 26 + 단계 경계 1이다. 별도 관찰 검사(홈 CTA/404 복귀/콘솔/스크롤)는 이 숫자에 추가 합산하지 않았다. [build.log](evidence/phase1/build.log)에 최종 명령 출력을 보존했다.

**스크린샷:** [홈 320](evidence/phase1/home-320.png), [홈 360](evidence/phase1/home-360.png), [홈 390](evidence/phase1/home-390.png), [홈 430](evidence/phase1/home-430.png), [PC 1280](evidence/phase1/home-1280.png), [양치 390](evidence/phase1/brushing-390.png). 화면 크기는 CSS viewport 기준이며 브라우저 세로 스크롤바가 있는 경우 가용 폭이 약 15px 작다. 스크린샷 픽셀은 OS/브라우저 배율에 따라 CSS 크기와 다를 수 있다.

### 발견 및 수정 이력

- 최초 타입 검사는 Lucide의 미지원 `Tooth` export로 실패했다. 지원되는 Brush/Smile로 교체한 뒤 타입·빌드 통과를 확인했다.
- 최초 반응형 기대값은 모바일 셸 폭을 innerWidth와 비교해 스크롤바 15px를 오류로 판정했다. 실제 가용 폭인 clientWidth로 검사 기준을 바로잡은 뒤 85건을 수행했다. 앱에 overflow 숨김을 추가해 문제를 가리지 않았다.
- 샌드박스에서 npm DNS는 ENOTFOUND, 로컬 소켓은 접근 거절/시간 초과였다. 네이티브 승인 절차를 통해 패키지 설치와 서버 실행을 수행했다. 재시작 과정의 포트 충돌은 기존 소유 서버를 종료한 뒤 해결했다. 최종 서버에서 브라우저 검증을 수행했다.

**남은 사항:** Phase 2 이전 설문·평가/추천 규칙·조언 문안 확정(D-004/005/012). 전체 접근성 감사, 실제 모바일 기기, SSRD LOS 정량 성능·사용성 및 전문가 검수는 수행하지 않았다. 앱 셸 통과를 의료·연동·주문 기능 통과로 해석하지 않는다.

**Phase 1 게이트: Awaiting approval. Phase 2 이후 Blocked. 검증용 서버 종료 후 다음 승인까지 중단한다.**

## Phase 2 검증 결과

2026-10-30 (Asia/Seoul). 사용자 Phase 1 승인/Phase 2 수행 지시에 따라 작업했다. 환경: Windows, Node 24.15.0/npm 11.12.1, 기존 고정 버전 스택, Codex in-app browser, Vite dev 127.0.0.1:5173. 가상 인물 응답만 사용했다. 추가 패키지 설치·실건강정보·서버 전송·기기/영상/거래 작업 없음.

| 검사 ID | 수행/기대값 | 실제 결과 | 판정 |
|---|---|---|---|
| P2-BUILD | npm run build → npm run typecheck/tsc --noEmit → Vite build, 타입 오류 없음 | 종료 코드 0, 2,121모듈, HTML 0.70kB/CSS 16.22kB/JS 291.82kB. 최종 Vite build 637ms(앱 응답성 측정 아님) | Pass |
| P2-UNIT | npm test, Node 내장 test runner, 입력/요청 경쟁/오류 불변식 | 8/8 통과, 0실패. tests/assessment.test.ts도 타입 검사 포함 | Pass |
| P2-SURVEY | 홈→체험 확인→4문항→제출; 미확인/누락 차단 | 미확인 radio 비활성/안내, 누락 4건 차단·첫 항목 초점, 정상 결과 도달, 단일 선택·unknown 허용 | Pass(데모) |
| P2-RESULT | 4항목 수준·설명/결측, 이전 결과 보호 | unknown 1개 및 모두 unknown 4개에서 평가 불가/점 없음, 일부 미수신은 3개 점만 표시. 응답 변경 후 이전 ID 없음, 새 결과 ID 변경, 새로고침 후 결과/조언 직접 진입은 빈 상태 | Pass(응답 표시) |
| P2-ADVICE | 결과별 조언/분류 근거, 오류 보류/회복 | 4개 상세 근거, 응답 수정 시 문안 변경(단위), 조언 실패는 평가 4개 유지·조언 카드/후보 없음, 재요청 후 4카드 회복 | Pass(Mock) |
| P2-TIPS | 응답별 후보/근거·추천 불가 대체 | B/C→C로 수정 연계, A/D/B 동률 정렬, 전부 없음/unknown이면 일반 4종 개념만, 후보 상품은 Phase 4 준비 화면. 실사양/효능/호환 미검증 | Pass(후보 분류), 실제품 Partial |
| P2-HOME | 미평가/진행/유효/보류 요약 및 이어보기 | 미평가 안내, 유효 결과 이어보기, 입력 수정 후 요약 무효화. 처리 중 홈 이동 후 자동 결과 화면 이동 없이 유효 요약 표시 | Pass(Phase 2 부분) |
| P2-ERROR | 분석 실패/저신뢰/부분 누락/조언 실패, 재시도 | 실패·저신뢰는 결과 미생성/응답 4개 유지, 정상 재시도 회복. 부분 누락·조언 실패는 각각 제한 표시. 단위에서 adapter 예외도 실패 처리 | Pass(설문/조언) |
| P2-RACE | 중복/늦은 응답/철회 처리 | 중복 submit 실제 호출 1회(단위), 제출 중 버튼 비활성(브라우저), 입력 수정/체험 확인 철회 후 늦은 응답 폐기, 이전 실패가 새 정상 결과를 덮어쓰지 않음(단위). 확인 해제 후 radio/결과 초기화(브라우저) | Pass |
| P2-LAYOUT | 5화면×5개 viewport, 가로 넘침·폭/탭바 하단 정렬 | 홈/설문/결과/조언/추천 ×320×800,360×800,390×844,430×844,1280×900: 25/25. 대표 화면 시각 검토·스크린샷 보존 | Pass(브라우저 viewport) |
| P2-KEY | radio Space·제출 Enter·초점 | Space로 radio.checked true, Enter 제출/정상 결과 도달. 전체 스크린리더 감사는 수행하지 않음 | Pass(검사 범위) |
| P2-SCOPE | src 저장/외부호출 검색·생성물/원본 보존 | localStorage/sessionStorage/fetch/Bluetooth 실행 코드 없음. dist에서 demoDebug/개발자 시나리오 UI 문자열 없음. 원본 3개/AGENTS 해시 Phase 0과 동일. 기기·영상·거래 구현 없음 | 확인 완료 |
| P2-CONSOLE | 검증 탭 warning/error 조회 | 검사 시 수집된 warn/error 없음 | Pass |
| 후속 수용 | lint, 실기기/키보드/노치, LOS 정량 성능/사용성·임상 검수/제품 검증 | lint 미설정·미실행, 나머지 미수행. 실제 AI·BLE·거래는 범위 밖 | Not tested |

원시 브라우저 결과는 [browser-checks.json](evidence/phase2/browser-checks.json) **61/61** 통과다. 25건은 반응형 조합, 나머지 36건은 정상/예외/변경/진입/키보드/단계 경계 검사다. 이는 SSRD 전체/LOS의 수용 시험 건수나 의료 정확도 수치가 아니다. [unit-tests.log](evidence/phase2/unit-tests.log)와 [build.log](evidence/phase2/build.log)에 최종 명령 출력을 보존했다.

스크린샷: [홈](evidence/phase2/home-390.png), [설문 320](evidence/phase2/survey-320.png), [설문 360](evidence/phase2/survey-360.png), [설문 390](evidence/phase2/survey-390.png), [설문 430](evidence/phase2/survey-430.png), [PC 설문](evidence/phase2/survey-1280.png), [결과](evidence/phase2/result-390.png), [조언](evidence/phase2/advice-390.png), [추천](evidence/phase2/recommendations-390.png), [분석 실패](evidence/phase2/failed-390.png), [저신뢰](evidence/phase2/low-confidence-390.png). 브라우저 배율과 세로 스크롤바로 이미지 픽셀과 CSS viewport 크기는 다를 수 있다.

### 발견 및 수정

- 최초 타입 검사에서 결과 null narrowing 오류를 발견해 명시적 null 확인으로 수정했다. 테스트 파일도 타입 검사에 포함한 뒤 최종 빌드 통과.
- 브라우저 API가 heading의 level 조건을 적용하지 않아 추천 영역 제목까지 집계했다. h3 DOM 선택자로 교체해 후보 순서 검사를 다시 통과했다. 라디오 checked HTML 속성과 현재 DOM 속성의 차이도 검사 기대값을 바로잡아 Space 선택을 재확인했다. 앱 결함을 숨기기 위한 변경은 없었다.
- HMR/문서 새로고침은 메모리 결과를 초기화하므로 문구 수정 후 가상 응답을 다시 제출해 검증했다. 영속 저장을 추가하지 않았다.

실제 전체 설문·의료 산식·제품별 적합성은 확정되지 않았다. PHASE2_DEMO_SPEC의 [A]만 구현했다. Phase 3의 영상 예외·동의/지표·세션 연결, Phase 4의 실제 상품 자료·구독/삭제는 남아 있다. **Phase 2 게이트: Awaiting approval. Phase 3~5: Blocked.** 사용자 로컬 접속을 위해 이전 요청에서 실행한 기존 서버는 유지하며 임시 검증 탭/viewport만 정리했다.

## Phase 3 검증 결과

2026-10-30 (Asia/Seoul). 사용자 Phase 2 승인·Phase 3 수행 지시에 따라 구현했다. 환경: Windows, Node 24.15.0/npm 11.12.1, 기존 고정 스택, Codex in-app browser, 기존 로컬 서버 127.0.0.1:5173. 신규 의존성/실BLE/외부 전송 없음. 영상 검사는 개인·구강 이미지 없이 Canvas/MediaRecorder로 생성한 합성 WebM(2,896바이트) 및 내부 오류 파일만 사용했다.

| 검사 ID | 방법·기대값 | 실제 결과 | 판정 |
|---|---|---|---|
| P3-BUILD | npm run build → tsc --noEmit/Vite build | 종료 코드 0, 2,136모듈. HTML 0.72kB/CSS 21.84kB/JS 315.62kB, 최종 Vite build 706ms(앱 응답성 시험 아님) | Pass |
| P3-UNIT | npm test, 기존 평가 8 + 기기/기록 8 + 영상 5 | 누적 21/21, 0실패. 새 Phase 3 테스트 13건. 모든 tests 파일 타입 검사 포함 | Pass |
| P3-DEVICE | 미연결·연결 취소·가상 거절/시간 초과/불가·재시도 | 실제 권한 호출 없이 각 실패 사유/회복 확인, 연결 취소 후 늦은 성공 무시(단위). 모의 연결 후에도 기록 없음 구분 | Pass(Mock) |
| P3-SYNC | 정상/빈 응답/중복·전송 실패·일시 오류·잘못된 묶음 | 정상 6건, 재수신 후 6건 유지, 최초 빈 응답 0건. 최초+재시도3회(1/3/10초) 소진/일시 실패2회 후 회복, invalid 묶음 즉시 거부. 실패/취소 후 최종 정상 시각·과거 기록 보존, 해제 후 6건 조회 | Pass(Mock) |
| P3-CANCEL | 중복 실행/취소·해제 후 늦은 응답 방지 | 중복 동기화 실제 호출1회, 늦은 수신 무시, 재시도 대기 중 중단 후 추가 호출0·기록 유지(단위), UI 연결/동기화 중단 정상 | Pass |
| P3-RECORD | 수치/기간/평균·결측·상세·KST 경계 | 14일 예시 6건, 평균126초/80.2%(각5건), 횟수0.4/일. 7일4건, null 미수신/0 유효값 분리, 날짜 경계·빈 추이·반올림 검사. 첫 상세67점/2:02/67%·6구역 중1개 미수신, 결측 세션은 점수/시간/커버리지·영역 미수신. 복귀 시 기간 유지 | Pass(예시) |
| P3-VIDEO-INPUT | 동의 전 선택/읽기/분석 금지, 파일 검증 | 거절 전 File 읽기/adapter 호출0(단위), UI 선택/분석 비활성. 실제 chooser로 txt·빈WebM·20MiB초과·손상MP4헤더 거부, 합성 정상WebM 검사/메타 선택·원본 참조 해제 | Pass(형식 검사) |
| P3-VIDEO-RESULT | 정상·실패·저품질/저신뢰·재시도 | 정상은 ‘모의 처리 완료’/개선 예시만, 수치 판독 없음. 실패/저품질/저신뢰는 모의 결과 영역 없음·각 정상 재시도 회복 | Pass(Mock) |
| P3-VIDEO-LIFETIME | 중복/늦은 분석·철회/해제/이탈·연결 문맥 | 중복 호출1회, 철회/이탈/검사 중 해제 후 늦은 결과 폐기(단위). UI 처리 중 철회·선택 해제는 결과 없음/비활성. 화면 복귀 시 입력/동의 초기화. 세션 연결/없는 세션 독립 안내, 영상 후 기기 지표2:02/점수 유지 | Pass(메모리 경계) |
| P3-HOME/REGRESSION | 기기 요약·Phase 2 정상 흐름 독립성 | 홈 예시 기록6건/상태 요약, 가상 평가4항목/추천B,C 재확인. 평가가 양치 기록6건을 바꾸지 않음. 새로고침 후 미연결/기록0, 없는 세션은 빈 상태 | Pass |
| P3-LAYOUT | 320×800/360×800/390×844/430×844/1280×900 | 홈/기기/기록/상세/영상5화면×5크기=25, 영상 결과5크기 추가=30/30. 가로 넘침 없음·모바일 가용 폭/PC390px·탭바 정렬/하단. 대표 화면 시각 검토 | Pass(viewport) |
| P3-KEY | Enter 연결·동기화, Arrow 기간, Space 동의·Enter 영상 시작 | 각 UI 동작 정상. 전체 스크린리더 감사는 미수행 | Pass(검사 범위) |
| P3-CONSOLE | 최종 새 탭 영상 입력→모의 결과의 warn/error 확인 | 새 페이지 warn/error 0건. 편집 중 HMR에서 useEffect 의존 배열 길이 변경 경고1회는 별도 기록, 최종 새 페이지 재현 없음 | Pass(최종 새 페이지) |
| P3-PRESERVE/SCOPE | 원본 SHA-256·실행 경계 검색·prod 문자열 검사 | 원본3개/AGENTS 해시 위 값 유지. src에 localStorage/sessionStorage/IndexedDB/fetch/Bluetooth/getUserMedia 실행 없음. dist에 demoDebug/개발자 기기/영상 시나리오 UI 문자열 없음 | 확인 완료 |
| 미수행 | 실제 모바일 기기/노치·OS 권한·영상 디코딩/길이/화질/내용·실AI/BLE/센서·LOS 정량/임상·lint | 브라우저/Mock/형식 검사만. lint 미설정, 나머지 미검증/범위 밖 | Not tested |

원시 근거: [browser-checks.json](evidence/phase3/browser-checks.json) **81/81**, [unit-tests.log](evidence/phase3/unit-tests.log) **21/21**, [build.log](evidence/phase3/build.log), [console-check.json](evidence/phase3/console-check.json). 브라우저 81건 중 반응형30건/그 밖51건이며 SSRD의 전체/실서비스 수용이나 의료 정확도 시험 건수가 아니다.

화면 증거: [연결 후 기록 없음](evidence/phase3/connected-empty-390.png), [전송 실패](evidence/phase3/sync-failed-390.png), [양치 통계](evidence/phase3/brushing-390.png), [양치 상세](evidence/phase3/detail-390.png), [영상 입력](evidence/phase3/video-input-390.png), [영상 모의 결과](evidence/phase3/video-result-390.png), [실패](evidence/phase3/video-failed-390.png), [저품질](evidence/phase3/video-low-quality-390.png), [저신뢰](evidence/phase3/video-low-confidence-390.png). 반응형은 DOM 측정값을 JSON으로 보존했고 대표390px 화면을 저장했다. 스크롤바/OS 배율로 이미지 픽셀과 CSS viewport가 다를 수 있다.

### 검증 중 발견 및 보완

- 영상의 선택적 세션 문맥 변경에도 임시 상태를 정리하도록 useEffect cleanup 의존성을 보완했다. 편집 중 기존 탭에서 HMR 경고가1회 발생했으나 새 탭의 최종 파일 선택/처리에서는 warn/error0건이다. 동기화 실패 시 aria 상태 문구도 실패/과거 보존을 직접 안내하도록 보완했다.
- 자동화 locator의 대기 상한이 실제14초 재시도보다 짧아 대기가 종료된 경우, 재시도 값을 바꾸지 않고 이후 도구 호출에서 실제 완료를 관찰했다. select 변경/경로 전환 직후 이전 화면을 집계한 검사와 HTML value/DOM value 차이는 새 화면 제목·선택값을 확인한 뒤 재검증했다.
- 마지막 새 탭 파일 선택 검사에서 자동화의 chooser 대기가 끝나 도구 세션이 초기화되었다. 디스크에 저장한79건 로그를 복원하고 새 탭을 명시적으로 선택해 정상 파일/콘솔2건을 추가 검증했다. 앱 코드를 우회하거나 실패 검사를 통과로 바꾸지 않았다.
- 파일 선택 취소의 기존 메타 유지/검사 중 해제는 단위로 확인했다. OS 파일 선택 창의 수동 취소 자체를 별도 실기기로 시험하지는 않았다. 파일 검사 성공은 전체 영상 디코딩/화질 검증을 의미하지 않는다.
- QA의 초과 용량 파일은 검사 후 정리했고, 작은 합성 WebM/오류 파일·생성 HTML은 tests/fixtures에 남겼다. 실제 개인/구강 영상은 사용하거나 보존하지 않았다.

후속 미결: 상품 명칭/가격/호환·구독 구성/주기/해지·판매 URL·로컬 삭제 범위/부분 실패(D-009~011). **Phase 3 게이트: Awaiting approval, Phase 4~5: Blocked.** 기존 사용자용 로컬 서버는 유지하고 임시 검증 탭/viewport만 정리한다.

## Phase 4 검증 결과

2026-10-30 Asia/Seoul. 사용자 Phase 3 승인·Phase 4만 수행 지시 및 자사몰 연결 승인. 환경: Windows / Node 24.15.0 / npm 11.12.1 / 기존 Vite 로컬 서버 / Codex in-app browser. 새 의존성·실거래·서버 전송 없음.

| 항목 | 수행 방법·기대값 | 실제 결과 | 판정 |
|---|---|---|---|
| P4-BUILD | npm run build: 타입 검사 포함 | tsc 및 Vite 성공. 2145 modules, JS 334.36kB(gzip103.94), CSS25.51kB. build.log | Pass |
| P4-UNIT | npm test | 기존 21 + commerce 6 + privacy 4 = 31/31, 실패/누락 0. unit-tests.log | Pass |
| P4-CATALOG/LINK | 상품 4개 클릭·상세 URL 검증·새 탭 이동·없는 상품/주소 | 4개 상품 ID/판매 URL 대응, 532는 앱 링크 클릭 후 자사몰 상세 상품명 실제 확인. 없는 ID 복귀, 주소 없음/사용 불가 설명. 가격/재고를 앱에 확정 표시하지 않음 | Pass(링크·안내) |
| P4-SUBSCRIPTION | 필수 누락·정상·철회·미확인·실패/재시도·중복/중단 | 필수 안내, 상세 선택 전달, 3/6개월 가상 주기, demo_requested/외부 미확인, 실패 후 회복, 기존 intent 재조회, 처리 중 중단. 실제 주문/결제/배송 성공 상태 없음 | Pass(Mock) |
| P4-PRIVACY | 삭제 확인/취소·구독 확인 철회·실제 기록 부분 실패/재시도 | 미확인 버튼 차단/취소 데이터 보존, 구독 구성/intent 초기화. 실제 동기화한 6건으로 양치 삭제 실패→6건 유지/미삭제 대상 표시→정상 재시도 0건/미연결. 영상 동의는 설정 경유 이탈 후 초기화 | Pass(로컬) |
| P4-RACE | 서비스 테스트·브라우저 화면 이탈 | 입력 변경/중단/삭제 후 지연 응답 폐기, 이전 실패가 새 결과를 덮지 않음. 설문/기기 reset이 요청 무효화. 신청 중 홈 이동 후 결과 요약 갱신, 강제 상태 화면 이동 없음 | Pass(Mock) |
| P4-LAYOUT | 실제 측정 가능한 크기의 7화면: 상품/상세/구독/설정/개인정보/판매/추천 | innerWidth458×668, main/nav390px 중앙, 가로 넘침 없음. 브라우저 35건 중 배치 7건 | Pass(실측 458px만) |
| P4-MOBILE | 320/360/390/430 및 PC1280 지정 크기 확인 | viewport.set이 요청 크기를 반영하지 않음. 초기1280×720/이후 reset458×668 확인. 명목 크기로 실행한 35조합을 폐기하고 통과 수에서 제외. viewport-limitations.json 기록 | Not tested(지정 크기) |
| P4-CONSOLE | 검증 탭 warn/error 확인 | console-check.json 빈 배열 | Pass |
| P4-BOUNDARY | src 정적 검색·원본 해시 | localStorage/sessionStorage/fetch/XMLHttpRequest/indexedDB/Bluetooth 호출 없음. AGENTS/원본3종 기존 SHA256 유지. Phase5 코드/정량 시험 미수행 | 범위 확인 |

브라우저 집계는 **35/35**, 기능/링크/상태 28건 + 실측458px 배치7건이다. 이는 요구사항별 정상/예외 전체 수용 또는 모바일 지정 크기 통과 수가 아니다. 모든 원시 판정은 docs/evidence/phase4/browser-checks.json에 있다. 도구 설정이 실패한 검사와 실제 앱 검사를 구분했다.

증거 화면은 같은 폴더의 product-375x811.jpg, subscription-status-375x811.jpg, order-failed-375x811.jpg, order-unconfirmed-375x811.jpg, delete-partial-1265x712.jpg, delete-complete-1265x712.jpg, products-1265x712.jpg, products-current.jpg다. 파일명 크기는 저장된 JPEG 픽셀 크기이며 CSS viewport를 보장하지 않는다. 초기 화면은 모바일 형태이나 지정 크기 정량 통과 증거로 사용하지 않았다. 검증 탭이 중간에 닫혀 새 탭에서 기록을 다시 생성하고 삭제 검사를 수행했다. 자동화 중 버튼 이름 확인 오류 2건은 실제 UI 상태 확인 후 올바른 대상으로 진행했다.

미검증/미결: 상태별 실제 상품 적합성·기획 맞춤 팁과 판매 상품의 대응, 실제 구독 요금/주기/배송 구성/해지, 가격·재고 동기화·외부 장애 자동 감지, 실거래·계정/서버 삭제, 실기기·임상/전문가 검수·LOS 정량/사용자5명. **모바일 지정 크기 재검증을 다음 단계 첫 순서로 권장**한다. 사용자용 localhost 서버는 유지하며 임시 검증 탭/viewport를 정리했다. **Phase 4 게이트: Awaiting approval. Phase 5: Blocked. 다음 승인 전까지 중단한다.**

## Phase 5 최종 결과

최신 결과는 [FINAL_QA_REPORT](FINAL_QA_REPORT.md)를 따른다. 단위31/31, 타입/빌드 Pass, 브라우저174/174(기능44+배치130), 화면/설문/영상 각30회 프록시 p95 312/697/841ms. Phase4 모바일 미검증 보완. 상세 원시 증거 evidence/phase5. 사용자5명·전문가 감수·실기기/실AI·실거래/서버 삭제는 Not tested. **Awaiting approval**.

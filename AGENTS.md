# ONEWAY — Codex 프로젝트 상시 지침

> 이 문서는 저장소 루트에 두고 Codex의 모든 작업에 적용한다. 세부 기준은 `docs/` 아래에 분리했다.

## 1. 목표와 범위
- 결과물: **React + TypeScript + Vite 기반의 인터랙티브 모바일 웹 프로토타입**. Android APK, iOS 네이티브 앱, 실서비스 서버/결제/BLE/임상 AI 구현이 아니다.
- 목표: 시연 가능한 사용자 흐름, 요구사항 추적성, 안정적인 정상·예외 동작, 기획서 화면과의 디자인 일관성.
- 문서 적용 우선순위: **기능·수용기준은 SSRD**, **컴포넌트·데이터·처리 흐름은 SSAD**, **제품 콘셉트·UI 시각 참조는 최종 기획서**. 충돌 시 조용히 선택하지 말고 `docs/DECISIONS.md`에 기록한다.
- [S]는 기획 근거, [A]는 잠정 가정, [F]는 향후 확장. [F] 기능은 별도 승인 없이는 구현하지 않는다.

## 2. 반드시 읽을 파일
1. `docs/PRODUCT_REQUIREMENTS.md` — 기능, 범위와 경계
2. `docs/UI_UX_SPEC.md` — 화면, 스타일, 내비게이션
3. `docs/ARCHITECTURE.md` — 기술 및 Mock 설계
4. `docs/IMPLEMENTATION_PLAN.md` — 단계와 승인 게이트
5. `docs/QA_ACCEPTANCE.md` — 검증 기준
6. `docs/REQUIREMENTS_TRACEABILITY.md` — 요구사항 상태 및 근거
7. 원본 문서: `references/Oneway_SSRD(1).docx`, `references/ONEWAY_SSAD(2).docx`, `references/Oneway 최종본(2).pdf`

## 3. 진행 방식 — 엄격한 단계별 승인
- **현재 승인된 단계 하나만 수행**한다. 첫 실행에서 Phase 0만 수행한다.
- 단계 종료 시 변경 파일, 구현 내용, 테스트 결과, 미해결 사항, 다음 단계 제안을 보고한다.
- `docs/IMPLEMENTATION_PLAN.md`에서 해당 단계의 게이트를 **Awaiting approval**로 표시하고 **멈춘다**.
- 사용자가 명시적으로 다음 단계를 승인하기 전에는 다음 Phase의 코드를 작성하지 않는다. 오류 수정도 현재 승인 단계 범위에 한한다.
- 불명확한 점은 합리적인 가정을 `docs/DECISIONS.md`에 기록하되, 범위·민감정보·실거래에 영향을 주는 판단은 승인을 요청한다.

## 4. 코드·품질 규칙
- 모바일 우선: 390×844 CSS px 기준; 320~430px에서도 깨지지 않도록. PC에서는 최대 너비 약 390px의 앱을 중앙에 표시; 모바일에서는 기기 프레임 없이 전체 폭 사용.
- 기본 스택: React, TypeScript, Vite, Tailwind CSS, React Router, Lucide 아이콘. 추가 의존성은 필요성을 설명하고 최소화한다.
- 프레젠테이션 / 도메인 / 서비스 / Mock 어댑터를 분리한다. 서버나 하드웨어가 있는 척하는 가짜 성공을 구현하지 않는다.
- 사용자 언어는 한국어. 모든 주요 버튼과 링크는 동작하거나, 비활성 이유가 명확해야 한다.
- 개인정보/영상 원본을 로컬 스토리지에 저장하지 않는다. 실제 결제·진단·BLE 연결을 수행했다고 표시하지 않는다.
- 기능 추가 때마다 요구사항 ID와 검증 항목을 연결한다. 테스트 못 한 것은 통과라고 기록하지 않는다.

## 5. 변경 관리
- `docs/IMPLEMENTATION_PLAN.md`에 단계 진행 상황을, `docs/REQUIREMENTS_TRACEABILITY.md`에 요구사항 충족 상황을, `docs/DECISIONS.md`에 가정과 충돌을 기록한다.
- 원본 문서와 이 지침 파일을 사용자 승인 없이 덮어쓰거나 삭제하지 않는다.

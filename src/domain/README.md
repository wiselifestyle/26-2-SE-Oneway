# 도메인 경계

SSAD OBJ-01~07과 불변식의 위치다. 프레젠테이션·브라우저 저장소·외부 SDK에 의존하지 않는다. Phase 2의 assessment.ts는 데모 문항/응답, 필수 검사, 결과 표시·조언·후보 분류 순수 함수를 제공한다. 규칙은 docs/PHASE2_DEMO_SPEC.md의 [A]이며 의료 판정이 아니다. 기기·영상·거래 모델은 미구현이다.

Phase 3의 brushing.ts가 양치 기록/이벤트 검증·중복 제거·KST 기간 집계·null/0 분리를, video.ts가 파일 형식·크기·헤더 검사 규칙을 담당한다. 상기 미구현 표기는 Phase 2 당시 상태이며 현재 거래 모델만 미구현이다. PHASE3_DEMO_SPEC의 [A]이고 실제 기기/판독 근거가 아니다.

Phase 4 catalog.ts는 자사몰 출처의 상품명/모델/URL·주소 검증을 담당한다. 가상 구독 Draft/Intent 계약은 services/subscriptionService.ts에 있으며 실제 거래 모델이 아니다. PHASE4_DEMO_SPEC 및 D-037~042를 따른다. 앞 절의 미구현 표기는 당시 이력이다.

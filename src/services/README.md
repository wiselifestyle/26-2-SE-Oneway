# 서비스 경계

SSAD DCOM-01~05의 업무 흐름을 조정할 위치다. Phase 2의 assessmentService.ts는 AnalysisAdapter 인터페이스를 사용해 비영속 데모 응답·revision·요청 token·결과 상태를 관리한다. React/브라우저 저장소/외부 API에 의존하지 않는다. 중복/늦은 응답/수정·확인 철회를 처리하며, src/state/assessmentStore.ts가 UI와 실제 Mock 어댑터를 조립한다. 양치·구독·개인정보 운영 서비스는 미구현이다.

Phase 3에서 brushingService.ts는 DeviceAdapter와 재시도·취소·최종 정상 시각을, videoService.ts는 별도 동의·임시 메타·검사/분석 token·이탈 정리를 관리한다. wait.ts는 취소 가능한 지연이다. 파일 원본/이름·영상 결과는 영속 저장하지 않는다. 구독·개인정보 운영 삭제는 여전히 미구현이다.

Phase 4 subscriptionService.ts는 가상 요청·필수 검사·중복/취소/철회, privacyService.ts는 로컬 대상별 실제 삭제 결과를 담당한다. 세 전역 서비스 reset은 진행 작업과 메모리를 함께 무효화한다. 외부 서버/계정 삭제·주문 연동은 구현하지 않는다. 앞 절의 미구현 표기는 Phase 3 당시 이력이다.

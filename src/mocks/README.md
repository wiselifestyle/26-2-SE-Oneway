# Mock 어댑터 경계

SSAD DCOM-06 어댑터 대응 위치다. Phase 2의 analysisAdapter.ts는 450ms 가상 지연 뒤 정상·실패·저신뢰·일부 결과 누락·조언 실패를 재현한다. 실제 BLE/AI/결제/서버를 호출하지 않는다. 선택한 가상 응답을 사전 정의 규칙으로 변환하며 실측·영상 판독이라고 주장하지 않는다. 기기·판매 어댑터는 미구현이다.

Phase 3에서 deviceAdapter.ts는 고정 예시 6건과 연결·동기화 오류를, videoAdapter.ts는 파일 내용 없이 정상/실패/저품질/저신뢰 상태만 반환한다. 지연은 AbortSignal로 취소한다. 실제 Bluetooth/권한·영상 추론·거래 어댑터 호출은 없으며 판매 어댑터는 미구현이다.

Phase 4 subscriptionAdapter.ts는 550ms 취소 가능한 지연 뒤 demo_requested/unconfirmed 또는 예외만 반환한다. 실제 거래를 호출하지 않는다. 외부 판매 링크는 확인된 자사몰 페이지를 사용자 클릭으로 여는 경계이며 접속·주문 상태를 감지하는 어댑터는 없다.

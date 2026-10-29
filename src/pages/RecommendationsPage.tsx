import { Link } from 'react-router';
import { categories, recommendationsFor } from '../domain/assessment';
import { useAssessment } from '../state/assessmentStore';
import { DemoNotice } from '../components/DemoNotice';
import { StateNotice } from '../components/StateNotice';
import { catalog } from '../domain/catalog';
import { ProductCard } from '../components/ProductCard';

export function RecommendationsPage() {
  const state = useAssessment();
  const result = state.result?.revision === state.revision ? state.result : null;
  const candidates = result ? recommendationsFor(result) : [];
  return <div className="content-page assessment-page">
    <div className="page-eyebrow">CURATION · 추천 흐름 데모</div><h1>교체용 팁 4종</h1>
    <p className="page-description">원안의 4종 팁 개념을 임시 후보 A~D로 구분했어요. 명칭·사양·호환성·제품별 효능은 미확정입니다.</p>
    <DemoNotice />
    {!result ? <StateNotice kind="empty" title="추천할 결과가 없어요" description="테스트를 완료하면 가상 응답에 연결된 데모 후보를 볼 수 있어요. 이전 결과가 무효화되면 추천도 보류됩니다." /> : result.adviceStatus === 'failed' ? <StateNotice kind="error" title="맞춤 추천을 보류했어요" description="조언 조회에 실패해 개별 후보를 추천하지 않았어요. 결과에서 다시 요청할 수 있어요." /> : candidates.length === 0 ? <StateNotice kind="empty" title="맞춤 추천을 하지 않았어요" description="불편감 선택이 없거나 평가 가능한 항목이 없어요. 아래에서 일반 팁 개념만 확인하세요." /> : <section className="candidate-list" aria-label="데모 추천 후보">
      <h2>가상 응답으로 분류한 후보</h2>
      {candidates.map(candidate => <article className="candidate-card" key={candidate.candidate}><span className="candidate-mark" aria-hidden="true">{candidate.candidate}</span><div><h3>데모 후보 {candidate.candidate}</h3><p>{candidate.reason}</p><Link className="inline-link" to="/products">자사몰 상품과 기기 모델 확인</Link></div></article>)}
    </section>}
    <section className="general-tips" aria-label="팁 4종 일반 정보"><h2>팁 4종 개념 안내</h2><p>아래 분류는 화면 체험용입니다. 실제 구강 상태에 맞는 팁을 정한 것이 아니며, 제품 정보 확인이 필요해요.</p><div className="tip-grid">{categories.map(({ candidate }) => <div className="tip-tile" key={candidate}><span>{candidate}</span><strong>임시 후보 {candidate}</strong><small>사양 미확정</small></div>)}</div></section>
    <section className="product-list"><h2>자사몰에서 살펴볼 소모품</h2><p className="source-note">아래는 기기 모델별 판매 상품입니다. 데모 후보 A~D와의 대응·개별 구강 상태 적합성은 확인되지 않아 맞춤 상품으로 지정하지 않았어요.</p>{catalog.map(product => <ProductCard key={product.id} product={product} />)}</section>
    {result && <Link className="secondary-link" to={`/assessment/${result.id}`}>결과로 돌아가기</Link>}
    <Link className="primary-link full-width" to="/assessment">{result ? '응답 수정하기' : '테스트 시작하기'}</Link>
  </div>;
}

import { Link, useParams, useSearchParams } from 'react-router';
import { Package, ArrowUpRight } from 'lucide-react';
import { catalog, productFor, shopUrl } from '../domain/catalog';
import { ProductCard } from '../components/ProductCard';
import { ShopLink } from '../components/ShopLink';
import { StateNotice } from '../components/StateNotice';

export function ProductsPage() {
  return <div className="content-page commerce-page"><div className="page-eyebrow">ONEWAY SHOP</div><h1>매일 쓰는 케어도구</h1><p className="page-description">사용 중인 기기 모델을 먼저 확인하고 교체용 소모품을 살펴보세요.</p>
    <div className="commerce-banner"><Package size={28} aria-hidden="true" /><div><strong>내 기기에 맞는 교체 팁</strong><p>원웨이 자사몰의 상품으로 연결해요.</p></div></div>
    <section className="product-list" aria-label="자사몰 상품"><h2>교체용 소모품</h2>{catalog.map(product => <ProductCard key={product.id} product={product} />)}</section>
    <p className="source-note">2026.10.30 자사몰 자료 조회. 실시간 가격·재고·배송 조건은 판매처에서 확인하세요. 기획서의 맞춤 팁 4종과 아래 판매 상품의 대응·구강 상태별 적합성은 확인되지 않았어요.</p>
    <Link className="secondary-link full-width" to="/recommendations">데모 추천 근거 보기</Link><Link className="primary-link full-width" to="/subscription">구독 구성 체험<ArrowUpRight size={17} aria-hidden="true" /></Link><Link className="inline-link" to="/sales-channels">판매 경로 안내</Link>
  </div>;
}

export function ProductDetailPage() {
  const { productId } = useParams();
  const product = productFor(productId);
  if (!product) return <div className="content-page"><h1>상품 정보</h1><StateNotice kind="empty" title="확인된 상품이 아니에요" description="이전 데모 후보는 실제 판매 상품과 연결되지 않습니다. 상품 목록에서 기기 모델을 확인하세요." /><Link className="primary-link full-width" to="/products">상품 목록 보기</Link></div>;
  return <div className="content-page commerce-page"><div className="page-eyebrow">REPLACEMENT CARE</div><div className="product-hero" aria-hidden="true"><Package size={64} strokeWidth={1} /><span>ONEWAY · 소모품 안내</span></div><h1>{product.name}</h1><p className="page-description">상품명에 표시된 기기 · {product.model}</p>
    <dl className="commerce-facts"><div><dt>판매처</dt><dd>원웨이 자사몰</dd></div><div><dt>가격·재고</dt><dd>판매처에서 확인</dd></div><div><dt>옵션·호환성</dt><dd>구매 전 상세 안내 확인</dd></div></dl>
    <p className="source-note">상품명은 자사몰 자료에서 확인했어요(조회 2026.10.30). 다른 모델과의 호환성·효능·교체 권장 주기를 추정하지 않습니다. 아이콘은 제품 실물 이미지가 아닙니다.</p>
    <ShopLink url={product.source} /><p className="source-note">새 탭으로 이동해요. 이동만으로 주문·결제가 완료되지 않습니다.</p>
    <Link className="primary-link full-width" to={`/subscription?product=${product.id}`}>이 상품으로 구독 체험</Link><Link className="inline-link" to="/sales-channels">판매 페이지가 열리지 않나요?</Link>
  </div>;
}

export function SalesChannelsPage() {
  const [params] = useSearchParams();
  const debug = import.meta.env.DEV && params.get('demoDebug') === '1';
  return <div className="content-page commerce-page"><div className="page-eyebrow">OFFICIAL CHANNEL</div><h1>판매 경로 안내</h1><p className="page-description">알려주신 원웨이 자사몰에서 상품과 최신 판매 조건을 확인하세요.</p><div className="commerce-banner"><Package aria-hidden="true" /><div><strong>원웨이 자사몰</strong><p>oneway.or.kr</p></div></div>
    <ShopLink url={shopUrl} label="자사몰 홈 열기" />
    <p className="source-note">이 프로토타입에서는 외부 페이지의 접속·재고·결제 상태를 감지할 수 없어요. 열리지 않으면 네트워크를 확인한 뒤 다시 열거나 아래 상품 목록으로 돌아가세요. 외부 주문·회원정보는 판매처에서 관리합니다.</p>
    <Link className="secondary-link full-width" to="/products">상품 목록으로 돌아가기</Link>
    {debug && <details className="debug-panel"><summary>개발용 판매 주소 예외</summary><ShopLink url={undefined} /><ShopLink url={shopUrl} unavailable /></details>}
  </div>;
}

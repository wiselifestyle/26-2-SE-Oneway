import { ExternalLink } from 'lucide-react';
import { safeShopUrl } from '../domain/catalog';
export function ShopLink({ url, label = '자사몰에서 상품 확인', unavailable = false }: { url?: string; label?: string; unavailable?: boolean }) {
  const href = unavailable ? null : safeShopUrl(url);
  return href ? <a className="secondary-link full-width" href={href} target="_blank" rel="noopener noreferrer">{label}<ExternalLink size={16} aria-hidden="true" /><span className="sr-only"> (새 탭)</span></a> : <p className="form-error" role="status">판매 주소를 사용할 수 없어요. 판매 경로에서 자사몰 홈을 확인하세요.</p>;
}

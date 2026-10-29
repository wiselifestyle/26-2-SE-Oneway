import { Link } from 'react-router';
import { Package, ChevronRight } from 'lucide-react';
import type { catalog } from '../domain/catalog';
export function ProductCard({ product }: { product: typeof catalog[number] }) {
  return <Link className="product-card" to={`/products/${product.id}`}><span className="product-symbol" aria-hidden="true"><Package size={28} strokeWidth={1.3} /></span><div><small>{product.model} · 소모품</small><h3>{product.name}</h3><p>가격·옵션은 자사몰에서 확인</p></div><ChevronRight size={16} aria-hidden="true" /></Link>;
}

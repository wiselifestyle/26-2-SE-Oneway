// RQ-04/09: identity and model names checked against the owner's shop, 2026-10-30.
// Prices, availability and medical suitability are deliberately not cached.
export const shopUrl = 'https://oneway.or.kr/';
export const catalog = [
  { id: 'tip-532', name: '원웨이 치아관리기 V2 팁 3종 세트', model: '치아관리기 V2', source: 'https://oneway.or.kr/product/소모품-원웨이-치아관리기-v2-팁-3종-세트/532/category/24/display/1/' },
  { id: 'tip-518', name: '원웨이 구강세정기 V4 TIP 3종세트', model: '구강세정기 V4', source: 'https://oneway.or.kr/product/소모품-원웨이-구강세정기-v4-tip-3종세트/518/category/24/display/1/' },
  { id: 'tip-364', name: '원웨이 구강세정기 V3 TIP 3종세트', model: '구강세정기 V3', source: 'https://oneway.or.kr/product/소모품-원웨이-구강세정기-v3-tip-3종세트/364/category/24/display/1/' },
  { id: 'tip-363', name: '원웨이 치아관리기 V1 칫솔팁', model: '치아관리기 V1', source: 'https://oneway.or.kr/product/소모품-원웨이-치아관리기-v1-칫솔팁/363/category/24/display/1/' },
] as const;
export function productFor(id: string | undefined) { return catalog.find(product => product.id === id); }
export function safeShopUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'oneway.or.kr' && !url.port && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

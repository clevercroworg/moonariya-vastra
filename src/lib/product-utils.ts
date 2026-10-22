import type { ProductSummary } from "./types";

export const productHref = (slug: string) => `/products/${slug}`;

export const discountPercent = (p: { price: number; mrp: number }) =>
  p.mrp > 0 ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;

/** Other pieces to show alongside a product: same category first, then same collection. */
export function relatedProducts<T extends ProductSummary>(product: T, all: T[], limit = 4) {
  const others = all.filter((p) => p.slug !== product.slug);
  const sameCategory = others.filter((p) => p.categorySlug === product.categorySlug);
  const sameCollection = others.filter((p) => !sameCategory.includes(p) && p.collections[0] === product.collections[0]);
  const rest = others.filter((p) => !sameCategory.includes(p) && !sameCollection.includes(p));
  return [...sameCategory, ...sameCollection, ...rest].slice(0, limit);
}

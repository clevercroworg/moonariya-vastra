"use client";

import { useEffect } from "react";
import { getProduct, type Product } from "@/data/products";
import { useStore } from "@/components/providers/StoreProvider";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";

/** Records the current product and shows the other recently viewed ones. */
export function RecentlyViewed({ current }: { current: string }) {
  const { recent, markViewed, hydrated } = useStore();

  useEffect(() => {
    if (hydrated) markViewed(current);
  }, [current, hydrated, markViewed]);

  const items = recent
    .filter((s) => s !== current)
    .map(getProduct)
    .filter((p): p is Product => Boolean(p))
    .slice(0, 4);

  if (!hydrated || items.length === 0) return null;

  return (
    <section aria-labelledby="recent-title" className="container-x pb-20">
      <Reveal className="flex items-end justify-between border-b border-ivory-200 pb-4">
        <h2 id="recent-title" className="font-display text-h2 text-maroon-950">
          Recently <em className="text-gold-600">viewed</em>
        </h2>
      </Reveal>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
        {items.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} sizes="(min-width: 768px) 22vw, 48vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}

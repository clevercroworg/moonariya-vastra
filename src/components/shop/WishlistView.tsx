"use client";

import { AnimatePresence, motion } from "motion/react";
import { Heart } from "lucide-react";
import { getProduct, type Product } from "@/data/products";
import { useStore } from "@/components/providers/StoreProvider";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";

export function WishlistView() {
  const { wishlist, hydrated } = useStore();

  if (!hydrated) {
    return (
      <div className="container-x grid grid-cols-2 gap-6 py-12 md:grid-cols-4" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-sm bg-ivory-100" />
        ))}
      </div>
    );
  }

  const items = wishlist.map(getProduct).filter((p): p is Product => Boolean(p));

  if (items.length === 0) {
    return (
      <div className="container-x flex flex-col items-center py-16 text-center sm:py-24">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-ivory-100 text-gold-700">
          <Heart className="h-8 w-8" strokeWidth={1.2} aria-hidden />
        </span>
        <h2 className="mt-6 font-display text-h2 text-maroon-950">
          Nothing saved <em className="text-gold-600">yet.</em>
        </h2>
        <p className="mt-3 max-w-md text-ink-700">Tap the heart on any saree to keep it here for later.</p>
        <ButtonLink href="/collections/all" variant="solid-dark" className="mt-8">
          Browse sarees
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="container-x py-10 sm:py-12">
      <p className="text-sm text-ink-500">
        {items.length} saved {items.length === 1 ? "saree" : "sarees"}
      </p>
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((p) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={p} sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 48vw" />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

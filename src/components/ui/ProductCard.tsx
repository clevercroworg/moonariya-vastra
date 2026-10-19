"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Heart, ShoppingBag } from "lucide-react";
import { discountPercent, productHref, type Product } from "@/data/products";
import { cn, formatINR } from "@/lib/utils";
import { useStore } from "@/components/providers/StoreProvider";

export function ProductCard({ product, sizes }: { product: Product; sizes: string }) {
  const { addToBag, toggleWishlist, isWishlisted } = useStore();
  const off = discountPercent(product);
  const liked = isWishlisted(product.slug);
  const href = productHref(product.slug);

  return (
    <article className="group/pc relative flex h-full flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2px] bg-ivory-200">
        <Link href={href} aria-label={product.name} className="absolute inset-0 block">
          <Image
            src={product.image}
            alt={`${product.name} — folded`}
            fill
            sizes={sizes}
            className="object-cover transition-[opacity,transform] duration-[900ms] ease-[var(--ease-silk)] group-hover/pc:scale-[1.03] group-hover/pc:opacity-0"
          />
          <Image
            src={product.hoverImage}
            alt=""
            fill
            sizes={sizes}
            className="scale-110 object-cover opacity-0 transition-[opacity,transform] duration-[900ms] ease-[var(--ease-silk)] group-hover/pc:scale-100 group-hover/pc:opacity-100"
          />
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {product.badge && (
            <span className="bg-maroon-950 px-2.5 py-1 text-[0.62rem] font-medium tracking-[0.18em] text-gold-300 uppercase">
              {product.badge}
            </span>
          )}
          {off > 0 && (
            <span className="bg-rani-600 px-2.5 py-1 text-[0.62rem] font-medium tracking-[0.12em] text-ivory-50 uppercase">
              {off}% off
            </span>
          )}
        </div>

        {/* Wishlist */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={() => toggleWishlist(product.slug, product.name)}
          aria-pressed={liked}
          aria-label={liked ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute top-2 right-2 grid h-11 w-11 place-items-center rounded-full bg-ivory-50/85 text-maroon-950 shadow-sm backdrop-blur transition-colors hover:bg-ivory-50"
        >
          <Heart className={cn("h-[18px] w-[18px] transition-all", liked && "fill-rani-600 text-rani-600")} strokeWidth={1.5} />
        </motion.button>

        {/* Add to bag */}
        <div className="absolute inset-x-3 bottom-3 translate-y-0 opacity-100 transition-all duration-500 ease-[var(--ease-silk)] lg:translate-y-3 lg:opacity-0 lg:group-focus-within/pc:translate-y-0 lg:group-focus-within/pc:opacity-100 lg:group-hover/pc:translate-y-0 lg:group-hover/pc:opacity-100">
          <button
            type="button"
            onClick={() => addToBag(product.slug, product.name)}
            className="flex h-11 w-full items-center justify-center gap-2 bg-maroon-950/92 text-[0.7rem] font-medium tracking-[0.2em] text-gold-200 uppercase backdrop-blur transition-colors hover:bg-maroon-950"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Add to bag
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-3 w-3 rounded-full ring-1 ring-ink-900/15 ring-offset-1 ring-offset-ivory-50"
            style={{ background: product.swatch }}
          />
          <p className="eyebrow text-[0.62rem] text-gold-700">{product.fabric}</p>
          {product.code && <p className="ml-auto text-[0.7rem] tracking-wider text-ink-500">Code {product.code}</p>}
        </div>
        <h3 className="mt-2 font-display text-[1.3rem] leading-snug text-maroon-950">
          <Link href={href} className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_1px]">
            {product.name}
          </Link>
        </h3>
        <p className="mt-auto flex flex-wrap items-baseline gap-x-2.5 pt-2">
          <span className="text-[1.05rem] font-medium text-ink-900">{formatINR(product.price)}</span>
          {product.mrp > product.price && (
            <>
              <span className="text-sm text-ink-500 line-through">
                <span className="sr-only">MRP </span>
                {formatINR(product.mrp)}
              </span>
              <span className="text-sm font-medium text-emerald-700">Save {formatINR(product.mrp - product.price)}</span>
            </>
          )}
        </p>
      </div>
    </article>
  );
}

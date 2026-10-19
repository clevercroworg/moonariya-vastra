"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { addonById, addonsTotal } from "@/data/addons";
import { getProduct, productHref, products, type Product } from "@/data/products";
import { paymentMethods } from "@/data/site";
import { formatINR } from "@/lib/utils";
import { MAX_QTY, useStore, type BagItem } from "@/components/providers/StoreProvider";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { whatsappLink } from "@/components/layout/SocialLinks";

type Line = BagItem & { product: Product; unit: number; unitMrp: number };

export function CartView() {
  const { bag, hydrated, setQty, removeFromBag, toggleWishlist, isWishlisted } = useStore();

  if (!hydrated) {
    return (
      <div className="container-x grid gap-10 py-12 lg:grid-cols-12" aria-busy="true">
        <div className="space-y-4 lg:col-span-8">
          {[0, 1].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-sm bg-ivory-100" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-sm bg-ivory-100 lg:col-span-4" />
      </div>
    );
  }

  const lines: Line[] = bag.flatMap((b) => {
    const product = getProduct(b.slug);
    if (!product) return [];
    const extra = addonsTotal(b.addons);
    return [{ ...b, product, unit: product.price + extra, unitMrp: product.mrp + extra }];
  });

  if (lines.length === 0) return <EmptyBag />;

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const mrpTotal = lines.reduce((s, l) => s + l.product.mrp * l.qty, 0);
  const priceTotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const addonTotal = lines.reduce((s, l) => s + addonsTotal(l.addons) * l.qty, 0);
  const total = priceTotal + addonTotal;
  const savings = mrpTotal - priceTotal;

  const orderText = [
    "Hi Monaariya Vastra! I'd like to order:",
    ...lines.map((l) => {
      const extras = l.addons.map((a) => addonById(a)?.name).filter(Boolean).join(", ");
      return `• ${l.product.name}${l.product.code ? ` (${l.product.code})` : ""} × ${l.qty}${extras ? ` — with ${extras}` : ""} — ${formatINR(l.unit * l.qty)}`;
    }),
    `Total: ${formatINR(total)}`,
  ].join("\n");
  const orderHref = whatsappLink(orderText);

  return (
    <div className="container-x grid gap-10 py-10 sm:py-12 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-8">
        <div className="flex items-center gap-3 rounded-sm bg-emerald-700/8 px-4 py-3 text-sm text-emerald-700">
          <Truck className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} aria-hidden />
          Your order ships free anywhere in India.
        </div>

        <ul className="mt-6 divide-y divide-ivory-200 border-y border-ivory-200">
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <motion.li
                key={l.key}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-4 overflow-hidden py-6 sm:gap-6"
              >
                <Link href={productHref(l.slug)} className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-[2px] bg-ivory-200 sm:w-28">
                  <Image src={l.product.image} alt={l.product.name} fill sizes="112px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="eyebrow text-[0.6rem] text-gold-700">
                        {l.product.fabric} · {l.product.colour}
                      </p>
                      <Link href={productHref(l.slug)} className="mt-1 block font-display text-xl leading-snug text-maroon-950 hover:text-maroon-700 sm:text-2xl">
                        {l.product.name}
                      </Link>
                    </div>
                    <p className="text-right font-medium whitespace-nowrap text-ink-900">{formatINR(l.unit * l.qty)}</p>
                  </div>

                  {l.addons.length > 0 && (
                    <ul className="mt-2 space-y-0.5 text-[0.82rem] text-ink-500">
                      {l.addons.map((a) => {
                        const ad = addonById(a);
                        return ad ? (
                          <li key={a}>
                            + {ad.name} <span className="text-ink-700">({formatINR(ad.price)})</span>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  )}
                  <p className="mt-2 text-[0.82rem] text-ink-500">
                    {formatINR(l.unit)} each
                    {l.unitMrp > l.unit && <span className="ml-2 line-through">{formatINR(l.unitMrp)}</span>}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-4">
                    <div className="flex h-10 items-center rounded-full border border-maroon-950/25" role="group" aria-label={`Quantity of ${l.product.name}`}>
                      <button
                        type="button"
                        onClick={() => setQty(l.key, l.qty - 1)}
                        disabled={l.qty <= 1}
                        aria-label="Decrease quantity"
                        className="grid h-10 w-10 place-items-center text-maroon-950 disabled:opacity-30"
                      >
                        <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                      <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(l.key, l.qty + 1)}
                        disabled={l.qty >= MAX_QTY}
                        aria-label="Increase quantity"
                        className="grid h-10 w-10 place-items-center text-maroon-950 disabled:opacity-30"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                    {!isWishlisted(l.slug) && (
                      <button
                        type="button"
                        onClick={() => {
                          toggleWishlist(l.slug, l.product.name);
                          removeFromBag(l.key);
                        }}
                        className="flex items-center gap-1.5 text-xs tracking-wider text-ink-700 hover:text-maroon-700"
                      >
                        <Heart className="h-4 w-4" strokeWidth={1.5} aria-hidden /> Move to wishlist
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFromBag(l.key)}
                      className="flex items-center gap-1.5 text-xs tracking-wider text-ink-700 hover:text-rani-600"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} aria-hidden /> Remove
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <Link href="/collections/all" className="mt-6 inline-block text-sm text-maroon-700 underline underline-offset-4">
          Continue shopping
        </Link>
      </div>

      {/* Summary */}
      <aside className="lg:col-span-4" aria-labelledby="summary-title">
        <div className="rounded-sm bg-maroon-950 p-6 text-ivory-50 lg:sticky lg:top-[100px] sm:p-7">
          <h2 id="summary-title" className="font-display text-2xl">
            Order summary
          </h2>
          <dl className="mt-6 space-y-3 text-[0.92rem]">
            <div className="flex justify-between">
              <dt className="text-ivory-100/70">Bag MRP ({count} {count === 1 ? "item" : "items"})</dt>
              <dd>{formatINR(mrpTotal)}</dd>
            </div>
            {savings > 0 && (
              <div className="flex justify-between">
                <dt className="text-ivory-100/70">Discount on MRP</dt>
                <dd className="text-gold-300">− {formatINR(savings)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ivory-100/70">Finishing add-ons</dt>
              <dd>{addonTotal ? formatINR(addonTotal) : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ivory-100/70">Shipping</dt>
              <dd className="text-gold-300">Free</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-gold-400/20 pt-4">
              <dt className="font-medium">Total</dt>
              <dd className="font-display text-3xl text-gold-200">{formatINR(total)}</dd>
            </div>
          </dl>
          {savings > 0 && (
            <p className="mt-3 rounded-sm bg-gold-400/10 px-3 py-2 text-center text-sm text-gold-200">
              You save {formatINR(savings)} on this order
            </p>
          )}
          <div className="mt-6 space-y-3">
            <ButtonLink href="/checkout" className="w-full">
              Proceed to checkout
            </ButtonLink>
            <a
              href={orderHref}
              {...(orderHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-none border border-gold-400/50 text-[0.78rem] font-medium tracking-[0.2em] text-gold-200 uppercase transition-colors hover:bg-gold-400/10"
            >
              <WhatsAppIcon className="h-4 w-4" /> Order on WhatsApp
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {paymentMethods.map((m) => (
              <span key={m} className="rounded-sm border border-gold-400/25 px-2.5 py-1 text-[0.65rem] tracking-[0.12em] text-gold-300 uppercase">
                {m}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function EmptyBag() {
  const picks = products.slice(0, 4);
  return (
    <div className="container-x py-14 sm:py-20">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-ivory-100 text-gold-700">
          <ShoppingBag className="h-8 w-8" strokeWidth={1.2} aria-hidden />
        </span>
        <h2 className="mt-6 font-display text-h2 text-maroon-950">
          Your bag is <em className="text-gold-600">empty.</em>
        </h2>
        <p className="mt-3 text-ink-700">Find a drape you love — it&rsquo;ll wait for you here.</p>
        <ButtonLink href="/collections/new-arrivals" variant="solid-dark" className="mt-8">
          Shop new arrivals
        </ButtonLink>
      </div>
      <div className="mt-16">
        <p className="eyebrow text-center text-ink-500">You might like</p>
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
          {picks.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} sizes="(min-width: 768px) 22vw, 48vw" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

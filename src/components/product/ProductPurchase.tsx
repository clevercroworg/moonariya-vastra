"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { addonsTotal as sumAddons, whatsappLink } from "@/lib/settings-defaults";
import type { Product } from "@/lib/types";
import { useSiteSettings } from "@/components/providers/SiteDataProvider";
import { cn, formatINR } from "@/lib/utils";
import { MAX_QTY, useStore } from "@/components/providers/StoreProvider";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

export function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const { addons, contact } = useSiteSettings();
  const { addToBag, toggleWishlist, isWishlisted } = useStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);

  const extras = sumAddons(addons, selected);
  const unit = product.price + extras;
  const total = unit * qty;
  const liked = isWishlisted(product.slug);

  // Sticky buy bar (mobile/tablet) once the main buttons scroll above the viewport.
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const html = document.documentElement;
    if (showBar) html.dataset.buybar = "1";
    else delete html.dataset.buybar;
    return () => {
      delete html.dataset.buybar;
    };
  }, [showBar]);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 2200);
    return () => window.clearTimeout(t);
  }, [added]);

  const add = () => {
    addToBag(product.slug, product.name, { qty, addons: selected });
    setAdded(true);
  };
  const buyNow = () => {
    addToBag(product.slug, product.name, { qty, addons: selected, silent: true });
    router.push("/cart");
  };

  const enquiry = whatsappLink(
    contact.whatsapp,
    `Hi Monaariya Vastra! I'm interested in the ${product.name}${product.code ? ` (code ${product.code})` : ""}. ${site.url}/products/${product.slug}`,
  );

  if (!product.inStock) {
    return (
      <div className="mt-8 rounded-sm border border-ivory-200 bg-ivory-100 p-6">
        <p className="eyebrow text-rani-600">Sold out</p>
        <p className="mt-2 font-display text-2xl text-maroon-950">This saree has found its home.</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">
          Message us — we may be able to source it again, or suggest a similar weave.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={enquiry}
            {...(enquiry.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="flex h-12 items-center gap-2 rounded-full bg-maroon-950 px-6 text-[0.72rem] font-medium tracking-[0.18em] text-gold-200 uppercase"
          >
            <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => toggleWishlist(product.slug, product.name)}
            aria-pressed={liked}
            className="flex h-12 items-center gap-2 rounded-full border border-maroon-950/25 px-5 text-[0.72rem] font-medium tracking-[0.16em] text-maroon-950 uppercase"
          >
            <Heart className={cn("h-4 w-4", liked && "fill-rani-600 text-rani-600")} strokeWidth={1.5} aria-hidden />
            {liked ? "Saved" : "Save for later"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Add-ons */}
      <fieldset className="mt-8">
        <legend className="flex w-full items-baseline justify-between">
          <span className="font-display text-2xl text-maroon-950">Make it ready to wear</span>
          <span className="text-xs text-ink-500">Optional</span>
        </legend>
        <p className="mt-1 text-sm text-ink-500">Finishing touches done for you before dispatch.</p>
        <div className="mt-4 space-y-2.5">
          {addons.map((a) => {
            const on = selected.includes(a.id);
            return (
              <label
                key={a.id}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-sm border px-4 py-3.5 transition-colors duration-300",
                  on ? "border-gold-500 bg-gold-200/30" : "border-ivory-200 bg-ivory-50 hover:border-gold-500/50",
                )}
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={on}
                  onChange={() => setSelected((s) => (on ? s.filter((x) => x !== a.id) : [...s, a.id]))}
                />
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[4px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-400",
                    on ? "border-maroon-950 bg-maroon-950 text-gold-200" : "border-ink-500/40 bg-ivory-50",
                  )}
                >
                  {on && <Check className="h-3.5 w-3.5" strokeWidth={2.2} />}
                </span>
                <span className="flex-1">
                  <span className="block text-[0.95rem] font-medium text-ink-900">{a.name}</span>
                  <span className="mt-0.5 block text-[0.82rem] leading-snug text-ink-500">{a.note}</span>
                </span>
                <span className="text-[0.95rem] font-medium whitespace-nowrap text-maroon-700">+ {formatINR(a.price)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Price summary */}
      <dl className="mt-6 space-y-2 rounded-sm bg-ivory-100 px-5 py-4 text-[0.92rem]">
        <div className="flex justify-between">
          <dt className="text-ink-700">Saree</dt>
          <dd className="text-ink-900">{formatINR(product.price)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-700">Finishing add-ons</dt>
          <dd className="text-ink-900">{extras ? `+ ${formatINR(extras)}` : "—"}</dd>
        </div>
        {qty > 1 && (
          <div className="flex justify-between">
            <dt className="text-ink-700">Quantity</dt>
            <dd className="text-ink-900">× {qty}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between border-t border-ivory-200 pt-3">
          <dt className="font-medium text-maroon-950">Grand total</dt>
          <dd className="font-display text-2xl text-maroon-950" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={total}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="inline-block"
              >
                {formatINR(total)}
              </motion.span>
            </AnimatePresence>
          </dd>
        </div>
      </dl>

      {/* Quantity + actions */}
      <div ref={buyRef} className="mt-6 space-y-3">
        <div className="flex gap-3">
          <div className="flex h-14 items-center rounded-full border border-maroon-950/25" role="group" aria-label="Quantity">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              className="grid h-14 w-12 place-items-center text-maroon-950 disabled:opacity-30"
            >
              <Minus className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <span className="w-8 text-center font-medium tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
              disabled={qty >= MAX_QTY}
              aria-label="Increase quantity"
              className="grid h-14 w-12 place-items-center text-maroon-950 disabled:opacity-30"
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <button
            type="button"
            onClick={add}
            className="group/add relative flex h-14 flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gold-gradient text-[0.78rem] font-medium tracking-[0.2em] text-maroon-950 uppercase shadow-[0_10px_30px_-12px_rgb(221_180_106/0.7)] transition-transform active:scale-[0.98]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={added ? "added" : "add"}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2.5"
              >
                {added ? <Check className="h-4 w-4" strokeWidth={2} aria-hidden /> : <ShoppingBag className="h-4 w-4" strokeWidth={1.5} aria-hidden />}
                {added ? "Added to bag" : "Add to bag"}
              </motion.span>
            </AnimatePresence>
          </button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={() => toggleWishlist(product.slug, product.name)}
            aria-pressed={liked}
            aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-maroon-950/25 text-maroon-950 transition-colors hover:border-maroon-950"
          >
            <Heart className={cn("h-5 w-5", liked && "fill-rani-600 text-rani-600")} strokeWidth={1.5} />
          </motion.button>
        </div>
        <button
          type="button"
          onClick={buyNow}
          className="flex h-14 w-full items-center justify-center rounded-full bg-maroon-950 text-[0.78rem] font-medium tracking-[0.2em] text-gold-200 uppercase transition-colors hover:bg-maroon-800"
        >
          Buy now
        </button>
        <a
          href={enquiry}
          {...(enquiry.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="flex items-center justify-center gap-2 py-2 text-sm text-ink-700 transition-colors hover:text-maroon-700"
        >
          <WhatsAppIcon className="h-[18px] w-[18px] text-[#1f8f55]" />
          Ask about this saree on WhatsApp
        </a>
      </div>

      {/* Sticky buy bar */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[55] border-t border-ivory-200 bg-ivory-50/95 px-4 py-3 shadow-[0_-12px_30px_-12px_rgb(23_3_4/0.25)] backdrop-blur lg:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-[2px] bg-ivory-200">
                <Image src={product.image} alt="" fill sizes="36px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink-900">{product.name}</p>
                <p className="text-sm font-medium text-maroon-950">{formatINR(total)}</p>
              </div>
              <button
                type="button"
                onClick={add}
                className="flex h-12 items-center gap-2 rounded-full bg-gold-gradient px-5 text-[0.7rem] font-medium tracking-[0.18em] text-maroon-950 uppercase"
              >
                {added ? <Check className="h-4 w-4" aria-hidden /> : <ShoppingBag className="h-4 w-4" strokeWidth={1.5} aria-hidden />}
                {added ? "Added" : "Add to bag"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

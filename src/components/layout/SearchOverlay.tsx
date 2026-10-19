"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { popularSearches } from "@/data/site";
import { productHref, products } from "@/data/products";
import { formatINR } from "@/lib/utils";
import { useScrollLock } from "@/components/providers/SmoothScroll";
import { LotusMark } from "@/components/ui/Ornaments";

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  useScrollLock(true);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const go = (term: string) => {
    if (!term.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  const matches = q.trim()
    ? products.filter((p) => `${p.name} ${p.fabric} ${p.colour}`.toLowerCase().includes(q.trim().toLowerCase()))
    : products.slice(0, 4);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Search the store"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[80] overflow-y-auto bg-maroon-950/97 backdrop-blur-md"
      data-lenis-prevent
    >
      <div className="bg-lattice min-h-full">
        <div className="container-x flex justify-end pt-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="grid h-12 w-12 place-items-center rounded-full border border-gold-400/30 text-gold-300 transition-colors hover:bg-gold-400/10"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="container-x mx-auto max-w-4xl pt-8 pb-20 sm:pt-16"
        >
          <div className="flex items-center gap-3 text-gold-400">
            <LotusMark className="h-5" />
            <span className="eyebrow text-gold-300">Search Monaariya Vastra</span>
          </div>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              go(q);
            }}
            className="mt-6 flex items-center gap-4 border-b border-gold-400/40 pb-4 focus-within:border-gold-300"
          >
            <Search className="h-7 w-7 shrink-0 text-gold-400" strokeWidth={1.25} aria-hidden />
            <label htmlFor="site-search" className="sr-only">
              Search sarees
            </label>
            <input
              ref={inputRef}
              id="site-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sarees, fabrics, colours…"
              autoComplete="off"
              className="w-full bg-transparent font-display text-3xl text-ivory-50 placeholder:text-ivory-100/30 focus:outline-none sm:text-5xl"
            />
            <button
              type="submit"
              aria-label="Search"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-gradient text-maroon-950"
            >
              <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </form>

          <div className="mt-8 flex flex-wrap gap-2">
            <span className="eyebrow mr-2 self-center text-ivory-100/50">Popular</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => go(term)}
                className="rounded-full border border-gold-400/25 px-4 py-2 text-sm text-ivory-100/85 transition-colors hover:border-gold-300 hover:text-gold-200"
              >
                {term}
              </button>
            ))}
          </div>

          <p className="eyebrow mt-14 mb-5 text-gold-400">
            {q.trim() ? `${matches.length} matching ${matches.length === 1 ? "saree" : "sarees"}` : "Trending now"}
          </p>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {matches.slice(0, 8).map((p) => (
              <li key={p.slug}>
                <Link href={productHref(p.slug)} onClick={onClose} className="group/sr block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-maroon-900">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width: 640px) 200px, 45vw"
                      className="object-cover transition-transform duration-700 group-hover/sr:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-sm leading-snug text-ivory-50">{p.name}</p>
                  <p className="mt-1 text-sm text-gold-300">{formatINR(p.price)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}

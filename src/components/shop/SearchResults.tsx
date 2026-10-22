"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { buildCollections, type Collection } from "@/data/collections";
import { popularSearches } from "@/data/site";
import type { ProductSummary } from "@/lib/types";
import { useCatalog } from "@/components/providers/SiteDataProvider";
import { ProductCard } from "@/components/ui/ProductCard";

const haystack = (p: ProductSummary, collections: Collection[]) =>
  [
    p.name,
    p.fabric,
    p.colour,
    p.code ?? "",
    ...p.collections.map((c) => collections.find((x) => x.slug === c)?.name ?? c),
  ]
    .join(" ")
    .toLowerCase();

export function SearchResults() {
  const { products, categories } = useCatalog();
  const collections = buildCollections(products, categories);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const q = (params.get("q") ?? "").trim();
  const [draft, setDraft] = useState(q);
  const [lastQ, setLastQ] = useState(q);
  // keep the field in sync when the URL query changes (e.g. from the header search)
  if (q !== lastQ) {
    setLastQ(q);
    setDraft(q);
  }

  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const results = terms.length ? products.filter((p) => terms.every((t) => haystack(p, collections).includes(t.replace(/s$/, "")))) : [];
  const go = (term: string) => router.replace(`${pathname}?q=${encodeURIComponent(term.trim())}`);

  return (
    <div className="container-x py-10 sm:py-12">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.trim()) go(draft);
        }}
        className="flex max-w-2xl items-center gap-3 border-b-2 border-maroon-950/20 pb-3 focus-within:border-maroon-950"
      >
        <Search className="h-6 w-6 shrink-0 text-gold-700" strokeWidth={1.4} aria-hidden />
        <label htmlFor="search-page-input" className="sr-only">
          Search sarees
        </label>
        <input
          id="search-page-input"
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search sarees, fabrics, colours…"
          className="w-full bg-transparent font-display text-2xl text-maroon-950 placeholder:text-ink-500/50 focus:outline-none sm:text-3xl"
        />
        <button type="submit" className="h-11 shrink-0 rounded-full bg-maroon-950 px-5 text-[0.72rem] font-medium tracking-[0.16em] text-gold-200 uppercase">
          Search
        </button>
      </form>

      {q && (
        <p className="mt-8 text-sm text-ink-500" aria-live="polite">
          {results.length} {results.length === 1 ? "result" : "results"} for{" "}
          <span className="font-medium text-ink-900">&ldquo;{q}&rdquo;</span>
        </p>
      )}

      {results.length > 0 ? (
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 48vw" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10">
          {q && <p className="font-display text-3xl text-maroon-950">We couldn&rsquo;t find a match — try one of these.</p>}
          <p className="eyebrow mt-8 text-ink-500">Popular searches</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {popularSearches.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => go(t)}
                className="rounded-full border border-ivory-200 px-4 py-2 text-sm text-ink-700 transition-colors hover:border-maroon-950/40 hover:text-maroon-950"
              >
                {t}
              </button>
            ))}
          </div>
          <p className="eyebrow mt-10 text-ink-500">Browse collections</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {collections
              .filter((c) => c.products.length > 0)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/collections/${c.slug}`}
                  className="rounded-full bg-ivory-100 px-4 py-2 text-sm text-maroon-950 transition-colors hover:bg-maroon-950 hover:text-gold-200"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

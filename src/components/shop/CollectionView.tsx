"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, LayoutGrid, Rows3, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { discountPercent } from "@/lib/product-utils";
import type { ProductSummary as Product } from "@/lib/types";
import { cn, formatINR } from "@/lib/utils";
import { ProductCard } from "@/components/ui/ProductCard";
import { useScrollLock } from "@/components/providers/SmoothScroll";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest first" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "savings", label: "Biggest savings" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

const PRICE_BUCKETS = [
  { id: "u1000", label: `Under ${formatINR(1000)}`, test: (p: number) => p < 1000 },
  { id: "1-2k", label: `${formatINR(1000)} – ${formatINR(2000)}`, test: (p: number) => p >= 1000 && p < 2000 },
  { id: "2-5k", label: `${formatINR(2000)} – ${formatINR(5000)}`, test: (p: number) => p >= 2000 && p < 5000 },
  { id: "5k+", label: `${formatINR(5000)} & above`, test: (p: number) => p >= 5000 },
];

type Filters = { fabrics: string[]; colours: string[]; prices: string[]; onSale: boolean };
const EMPTY: Filters = { fabrics: [], colours: [], prices: [], onSale: false };

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

function applyFilters(list: Product[], f: Filters, ignore?: keyof Filters) {
  return list.filter(
    (p) =>
      (ignore === "fabrics" || !f.fabrics.length || f.fabrics.includes(p.fabric)) &&
      (ignore === "colours" || !f.colours.length || f.colours.includes(p.colour)) &&
      (ignore === "prices" || !f.prices.length || PRICE_BUCKETS.some((b) => f.prices.includes(b.id) && b.test(p.price))) &&
      (ignore === "onSale" || !f.onSale || p.mrp > p.price),
  );
}

export function CollectionView({ products }: { products: Product[] }) {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState<SortId>("featured");
  const [dense, setDense] = useState(false);
  const [sheet, setSheet] = useState(false);

  const facets = useMemo(() => {
    const count = (key: keyof Filters, pred: (p: Product) => boolean) =>
      applyFilters(products, filters, key).filter(pred).length;
    const fabrics = [...new Set(products.map((p) => p.fabric))].map((v) => ({ v, n: count("fabrics", (p) => p.fabric === v) }));
    const colours = [...new Map(products.map((p) => [p.colour, p.swatch])).entries()].map(([v, swatch]) => ({
      v,
      swatch,
      n: count("colours", (p) => p.colour === v),
    }));
    const prices = PRICE_BUCKETS.filter((b) => products.some((p) => b.test(p.price))).map((b) => ({
      ...b,
      n: count("prices", (p) => b.test(p.price)),
    }));
    const sale = count("onSale", (p) => p.mrp > p.price);
    return { fabrics, colours, prices, sale };
  }, [products, filters]);

  const results = useMemo(() => {
    const list = applyFilters(products, filters);
    const sorted = [...list];
    if (sort === "newest") sorted.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "savings") sorted.sort((a, b) => discountPercent(b) - discountPercent(a));
    return sorted;
  }, [products, filters, sort]);

  const active = [
    ...filters.fabrics.map((v) => ({ k: "fabrics" as const, v, label: v })),
    ...filters.colours.map((v) => ({ k: "colours" as const, v, label: v })),
    ...filters.prices.map((v) => ({ k: "prices" as const, v, label: PRICE_BUCKETS.find((b) => b.id === v)?.label ?? v })),
    ...(filters.onSale ? [{ k: "onSale" as const, v: "sale", label: "On sale" }] : []),
  ];
  const clearOne = (k: keyof Filters, v: string) =>
    setFilters((f) => (k === "onSale" ? { ...f, onSale: false } : { ...f, [k]: toggle(f[k] as string[], v) }));

  const panel = (
    <FilterPanel
      facets={facets}
      filters={filters}
      onToggle={(k, v) => setFilters((f) => ({ ...f, [k]: toggle(f[k] as string[], v) }))}
      onSale={(on) => setFilters((f) => ({ ...f, onSale: on }))}
    />
  );

  return (
    <div className="container-x py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-12">
        {/* Sidebar */}
        <aside className="hidden lg:col-span-3 lg:block" aria-label="Filters">
          <div className="sticky top-[100px]">
            <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
              <p className="eyebrow text-maroon-950">Refine</p>
              {active.length > 0 && (
                <button type="button" onClick={() => setFilters(EMPTY)} className="text-xs tracking-wider text-maroon-700 underline-offset-4 hover:underline">
                  Clear all
                </button>
              )}
            </div>
            {panel}
          </div>
        </aside>

        <div className="lg:col-span-9">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ivory-200 pb-4">
            <p className="text-sm text-ink-500" aria-live="polite">
              Showing <span className="font-medium text-ink-900">{results.length}</span> of {products.length}{" "}
              {products.length === 1 ? "saree" : "sarees"}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSheet(true)}
                className="flex h-11 items-center gap-2 rounded-full border border-maroon-950/25 px-4 text-[0.72rem] font-medium tracking-[0.16em] text-maroon-950 uppercase lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                Filter
                {active.length > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-maroon-950 px-1 text-[0.65rem] text-gold-200">
                    {active.length}
                  </span>
                )}
              </button>
              <label className="relative">
                <span className="sr-only">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortId)}
                  className="h-11 cursor-pointer appearance-none rounded-full border border-maroon-950/25 bg-transparent pr-10 pl-4 text-[0.72rem] font-medium tracking-[0.12em] text-maroon-950 uppercase focus:border-maroon-950 focus:outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-maroon-950" strokeWidth={1.5} />
              </label>
              <div className="hidden items-center rounded-full border border-maroon-950/25 p-1 lg:flex" role="group" aria-label="Grid density">
                {[
                  { on: !dense, set: false, Icon: Rows3, label: "3 per row" },
                  { on: dense, set: true, Icon: LayoutGrid, label: "4 per row" },
                ].map(({ on, set, Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={on}
                    aria-label={label}
                    onClick={() => setDense(set)}
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-full transition-colors",
                      on ? "bg-maroon-950 text-gold-200" : "text-maroon-950 hover:bg-maroon-950/5",
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active chips */}
          <AnimatePresence initial={false}>
            {active.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-2 pt-4">
                  {active.map((a) => (
                    <button
                      key={`${a.k}-${a.v}`}
                      type="button"
                      onClick={() => clearOne(a.k, a.v)}
                      className="group/chip flex items-center gap-1.5 rounded-full bg-maroon-950 py-1.5 pr-2.5 pl-3.5 text-xs text-gold-200"
                    >
                      {a.label}
                      <X className="h-3.5 w-3.5 opacity-70 group-hover/chip:opacity-100" aria-hidden />
                      <span className="sr-only">Remove filter</span>
                    </button>
                  ))}
                  <button type="button" onClick={() => setFilters(EMPTY)} className="px-2 text-xs text-maroon-700 underline underline-offset-4">
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid */}
          {results.length > 0 ? (
            <motion.ul
              layout
              className={cn(
                "mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3",
                dense && "lg:grid-cols-4",
              )}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((p, i) => (
                  <motion.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: Math.min(i, 8) * 0.04 }}
                  >
                    <ProductCard
                      product={p}
                      sizes={dense ? "(min-width: 1024px) 20vw, (min-width: 768px) 30vw, 48vw" : "(min-width: 1024px) 26vw, (min-width: 768px) 30vw, 48vw"}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <div className="mt-10 flex flex-col items-center rounded-sm border border-dashed border-ivory-200 px-6 py-16 text-center">
              <p className="font-display text-3xl text-maroon-950">No sarees match these filters</p>
              <p className="mt-2 text-ink-500">Try removing a filter or two.</p>
              <button
                type="button"
                onClick={() => setFilters(EMPTY)}
                className="mt-6 h-11 rounded-full bg-maroon-950 px-6 text-[0.72rem] font-medium tracking-[0.18em] text-gold-200 uppercase"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {sheet && (
          <FilterSheet onClose={() => setSheet(false)} count={results.length} onClear={() => setFilters(EMPTY)} hasActive={active.length > 0}>
            {panel}
          </FilterSheet>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type Facets = {
  fabrics: { v: string; n: number }[];
  colours: { v: string; swatch: string; n: number }[];
  prices: { id: string; label: string; n: number }[];
  sale: number;
};

function FilterPanel({
  facets,
  filters,
  onToggle,
  onSale,
}: {
  facets: Facets;
  filters: Filters;
  onToggle: (k: "fabrics" | "colours" | "prices", v: string) => void;
  onSale: (on: boolean) => void;
}) {
  return (
    <div className="divide-y divide-ivory-200">
      {facets.fabrics.length > 1 && (
        <FilterGroup title="Fabric">
          {facets.fabrics.map((f) => (
            <CheckRow key={f.v} checked={filters.fabrics.includes(f.v)} onChange={() => onToggle("fabrics", f.v)} label={f.v} count={f.n} />
          ))}
        </FilterGroup>
      )}
      {facets.colours.length > 1 && (
        <FilterGroup title="Colour">
          <div className="flex flex-wrap gap-2.5">
            {facets.colours.map((c) => {
              const on = filters.colours.includes(c.v);
              return (
                <button
                  key={c.v}
                  type="button"
                  aria-pressed={on}
                  disabled={!on && c.n === 0}
                  onClick={() => onToggle("colours", c.v)}
                  className={cn(
                    "group/sw flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-xs transition-colors disabled:opacity-35",
                    on ? "border-maroon-950 bg-maroon-950 text-gold-200" : "border-ivory-200 text-ink-700 hover:border-maroon-950/40",
                  )}
                >
                  <span className="h-6 w-6 rounded-full ring-1 ring-black/10" style={{ background: c.swatch }} aria-hidden />
                  {c.v}
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}
      {facets.prices.length > 0 && (
        <FilterGroup title="Price">
          {facets.prices.map((b) => (
            <CheckRow key={b.id} checked={filters.prices.includes(b.id)} onChange={() => onToggle("prices", b.id)} label={b.label} count={b.n} />
          ))}
        </FilterGroup>
      )}
      <FilterGroup title="Offers">
        <CheckRow checked={filters.onSale} onChange={() => onSale(!filters.onSale)} label="On sale" count={facets.sale} />
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="py-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left font-display text-xl text-maroon-950"
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} strokeWidth={1.5} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-1 pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckRow({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count: number }) {
  const disabled = !checked && count === 0;
  return (
    <label className={cn("flex cursor-pointer items-center gap-3 py-1.5 text-[0.92rem]", disabled && "cursor-not-allowed opacity-40")}>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} disabled={disabled} />
      <span
        aria-hidden
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-[4px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-400",
          checked ? "border-maroon-950 bg-maroon-950 text-gold-200" : "border-ink-500/40 bg-ivory-50",
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={2.2} />}
      </span>
      <span className="flex-1 text-ink-900">{label}</span>
      <span className="text-xs text-ink-500">{count}</span>
    </label>
  );
}

function FilterSheet({
  children,
  onClose,
  onClear,
  count,
  hasActive,
}: {
  children: React.ReactNode;
  onClose: () => void;
  onClear: () => void;
  count: number;
  hasActive: boolean;
}) {
  useScrollLock(true);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[85] lg:hidden" role="dialog" aria-modal="true" aria-label="Filter sarees">
      <motion.button
        type="button"
        aria-label="Close filters"
        tabIndex={-1}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/55"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-ivory-50"
        data-lenis-prevent
      >
        <div className="flex items-center justify-between border-b border-ivory-200 px-5 py-4">
          <p className="font-display text-2xl text-maroon-950">Refine</p>
          <button type="button" onClick={onClose} aria-label="Close filters" className="grid h-11 w-11 place-items-center rounded-full border border-ivory-200">
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5">{children}</div>
        <div className="flex gap-3 border-t border-ivory-200 p-4">
          <button
            type="button"
            onClick={onClear}
            disabled={!hasActive}
            className="h-12 flex-1 rounded-full border border-maroon-950/30 text-[0.72rem] font-medium tracking-[0.16em] text-maroon-950 uppercase disabled:opacity-40"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-[2] rounded-full bg-maroon-950 text-[0.72rem] font-medium tracking-[0.16em] text-gold-200 uppercase"
          >
            Show {count} {count === 1 ? "saree" : "sarees"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

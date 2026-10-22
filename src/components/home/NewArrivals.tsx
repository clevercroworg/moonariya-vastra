"use client";

import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCatalog } from "@/components/providers/SiteDataProvider";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function NewArrivals() {
  const { products, categories } = useCatalog();
  // Tabs: "All" plus the four categories with the most sarees.
  const filters = useMemo(() => {
    const counted = categories
      .map((c) => ({ c, n: products.filter((p) => p.categorySlug === c.slug).length }))
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n)
      .slice(0, 4)
      .map((x) => ({ key: x.c.slug, label: x.c.name }));
    return [{ key: "all", label: "All" }, ...counted];
  }, [products, categories]);
  const [filter, setFilter] = useState("all");
  const list = useMemo(
    () =>
      [...products]
        .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
        .filter((p) => filter === "all" || p.categorySlug === filter)
        .slice(0, 12),
    [products, filter],
  );

  const [emblaRef, embla] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", dragFree: false });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [progress, setProgress] = useState(0);

  const sync = useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
    setProgress(Math.max(0, Math.min(1, embla.scrollProgress())));
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", sync).on("reInit", sync).on("scroll", sync);
    const raf = requestAnimationFrame(sync);
    return () => {
      cancelAnimationFrame(raf);
      embla.off("select", sync).off("reInit", sync).off("scroll", sync);
    };
  }, [embla, sync]);

  useEffect(() => {
    embla?.reInit();
    embla?.scrollTo(0, true);
  }, [embla, filter]);

  return (
    <section aria-labelledby="new-arrivals-title" className="relative bg-ivory-100 py-20 sm:py-28">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="new-arrivals-title"
            align="left"
            eyebrow="Just off the loom"
            title={["New", "arrivals."]}
            intro="Fresh from our latest drop — pure kora tissues, embroidered raw silks, zari georgettes and everyday cotton blends, photographed just as they arrived."
            rule={false}
          />

          <div className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between lg:w-auto lg:justify-end">
            <div role="tablist" aria-label="Filter new arrivals" className="flex flex-wrap gap-1 sm:gap-2">
              {filters.map((f) => (
                <button
                  key={f.key}
                  role="tab"
                  type="button"
                  aria-selected={filter === f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "relative h-10 rounded-full px-4 text-[0.7rem] font-medium tracking-[0.14em] whitespace-nowrap uppercase transition-colors duration-300 sm:px-5",
                    filter === f.key ? "text-gold-200" : "text-maroon-950 hover:bg-maroon-950/5",
                  )}
                >
                  {filter === f.key && (
                    <motion.span
                      layoutId="arrivals-pill"
                      className="absolute inset-0 rounded-full bg-maroon-950"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative">{f.label}</span>
                </button>
              ))}
            </div>
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => embla?.scrollPrev()}
                disabled={!canPrev}
                aria-label="Previous products"
                className="grid h-11 w-11 place-items-center rounded-full border border-maroon-950/25 text-maroon-950 transition-all hover:bg-maroon-950 hover:text-gold-300 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.4} />
              </button>
              <button
                type="button"
                onClick={() => embla?.scrollNext()}
                disabled={!canNext}
                aria-label="Next products"
                className="grid h-11 w-11 place-items-center rounded-full border border-maroon-950/25 text-maroon-950 transition-all hover:bg-maroon-950 hover:text-gold-300 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 overflow-hidden" ref={emblaRef} aria-roledescription="carousel" aria-label="New arrivals">
          <div className="-ml-4 flex touch-pan-y sm:-ml-6">
            <AnimatePresence initial={false} mode="popLayout">
              {list.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
                  className="min-w-0 shrink-0 grow-0 basis-[72%] pl-4 sm:basis-[44%] sm:pl-6 md:basis-[34%] lg:basis-1/4"
                  role="group"
                  aria-roledescription="slide"
                >
                  <ProductCard product={p} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 44vw, 72vw" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <div className="relative h-px w-full max-w-xs overflow-hidden bg-maroon-950/15 sm:max-w-sm">
            <span
              className="absolute inset-y-0 left-0 w-1/4 bg-maroon-950 transition-transform duration-200"
              style={{ transform: `translateX(${progress * 300}%)` }}
            />
          </div>
          <ButtonLink href="/collections/new-arrivals" variant="outline-dark">
            View all new arrivals
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

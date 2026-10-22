"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Droplets, Feather, Sparkles, Waves } from "lucide-react";
import { useRef, useState } from "react";
import { useCatalog } from "@/components/providers/SiteDataProvider";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;



export function FabricGuide() {
  const { products, categories } = useCatalog();
  // The client's own categories, shown only when they have stock (and real photos).
  const fabrics = categories.filter((c) => products.some((p) => p.categorySlug === c.slug));
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  if (fabrics.length === 0) return null;
  const f = fabrics[Math.min(active, fabrics.length - 1)];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (e.key in keys) {
      e.preventDefault();
      const next = (active + keys[e.key] + fabrics.length) % fabrics.length;
      setActive(next);
      tabs.current[next]?.focus();
    }
  };

  const details = [
    { Icon: Feather, label: "Feels like", value: f.feel },
    { Icon: Sparkles, label: "Best for", value: f.bestFor },
    { Icon: Waves, label: "The drape", value: f.drape },
    { Icon: Droplets, label: "Care", value: f.care },
  ];

  return (
    <section id="fabric-guide" aria-labelledby="fabric-title" className="relative overflow-hidden bg-ivory-50 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          id="fabric-title"
          eyebrow="The Fabric Guide"
          title={["Know your weave,", "love your drape."]}
          intro="Every fabric falls, breathes and shines differently. Here's how to choose the one that suits your moment."
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* Tabs */}
          <div
            role="tablist"
            aria-label="Fabrics"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
          >
            {fabrics.map((fab, i) => {
              const on = i === active;
              return (
                <button
                  key={fab.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`fabric-tab-${fab.id}`}
                  aria-selected={on}
                  aria-controls="fabric-panel"
                  tabIndex={on ? 0 : -1}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "group/ft relative flex shrink-0 items-baseline gap-4 rounded-full border px-5 py-2.5 text-left transition-colors duration-300 lg:rounded-none lg:border-0 lg:border-b lg:border-ivory-200 lg:px-0 lg:py-5",
                    on ? "border-maroon-950 bg-maroon-950 text-gold-200 lg:bg-transparent" : "border-ivory-200 text-ink-700",
                  )}
                >
                  <span
                    className={cn(
                      "hidden font-sans text-xs tracking-widest lg:inline",
                      on ? "text-gold-600" : "text-ink-500",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-display text-lg transition-all duration-500 ease-[var(--ease-silk)] lg:text-[2.1rem] lg:leading-none",
                      on ? "lg:translate-x-2 lg:text-maroon-950 lg:italic" : "lg:group-hover/ft:translate-x-1 lg:group-hover/ft:text-maroon-950",
                    )}
                  >
                    {fab.name}
                  </span>
                  <span
                    className={cn(
                      "ml-auto hidden text-[0.68rem] tracking-[0.18em] uppercase transition-opacity duration-300 lg:inline",
                      on ? "text-gold-700 opacity-100" : "opacity-0",
                    )}
                  >
                    {fab.tagline}
                  </span>
                  {on && (
                    <motion.span
                      layoutId="fabric-underline"
                      className="absolute -bottom-px left-0 hidden h-[2px] w-full bg-gold-gradient lg:block"
                      transition={{ type: "spring", stiffness: 260, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div
            id="fabric-panel"
            role="tabpanel"
            aria-labelledby={`fabric-tab-${f.id}`}
            className="grid items-center gap-8 sm:grid-cols-2 lg:col-span-8 lg:gap-12"
          >
            <div className="relative mx-auto w-full max-w-[420px]">
              <span aria-hidden className="arch absolute -inset-3 border border-gold-500/50" />
              <span aria-hidden className="arch absolute -inset-6 border border-gold-500/20" />
              <div className="arch relative aspect-[4/5] overflow-hidden bg-maroon-900">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={f.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease }}
                  >
                    <Image src={f.image} alt={f.alt} fill sizes="(min-width: 1024px) 420px, (min-width: 640px) 45vw, 90vw" className="object-cover" />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-linear-to-t from-maroon-950/60 to-transparent" />
                <p className="absolute inset-x-0 bottom-6 text-center font-display text-4xl text-ivory-50 italic">{f.name}</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease }}
              >
                <p className="eyebrow text-gold-700">{f.tagline}</p>
                <h3 className="mt-3 font-display text-h2 text-maroon-950">{f.name} sarees</h3>
                <dl className="mt-7 space-y-5">
                  {details.map(({ Icon, label, value }) => (
                    <div key={label} className="flex gap-4 border-b border-ivory-200 pb-5 last:border-0">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ivory-100 text-gold-700">
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.4} aria-hidden />
                      </span>
                      <div>
                        <dt className="eyebrow text-[0.62rem] text-ink-500">{label}</dt>
                        <dd className="mt-1 text-[0.98rem] text-ink-900">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <ButtonLink href={f.href} variant="solid-dark" className="mt-8">
                  Shop {f.name} sarees
                </ButtonLink>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

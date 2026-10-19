"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { testimonials } from "@/data/home";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials() {
  const [[i, dir], setState] = useState<[number, number]>([0, 1]);
  const [hold, setHold] = useState(false);
  const reduce = useReducedMotion();
  const n = testimonials.length;
  const go = useCallback((d: number) => setState(([cur]) => [(cur + d + n) % n, d]), [n]);

  useEffect(() => {
    if (hold || reduce) return;
    const t = window.setInterval(() => go(1), 6500);
    return () => window.clearInterval(t);
  }, [hold, reduce, go]);

  const t = testimonials[i];

  return (
    <section
      aria-labelledby="reviews-title"
      className="relative overflow-hidden bg-ivory-100 py-20 sm:py-28"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocusCapture={() => setHold(true)}
      onBlurCapture={() => setHold(false)}
    >
      <Image
        src="/brand/emblem.png"
        alt=""
        aria-hidden
        width={292}
        height={271}
        className="pointer-events-none absolute top-1/2 left-1/2 w-[560px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.06] [filter:brightness(0.3)_sepia(1)]"
      />

      <div className="container-x relative">
        <SectionHeading id="reviews-title" eyebrow="Kind words" title={["Loved by the women", "who wear them."]} />

        <div className="relative mx-auto mt-12 max-w-3xl text-center">
          <span aria-hidden className="block font-display text-[7rem] leading-[0.6] text-gold-500/60 select-none">
            &ldquo;
          </span>
          <div className="relative min-h-[250px] sm:min-h-[220px]" aria-live="polite">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={i}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex justify-center gap-1 text-gold-500" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-6 font-display text-[1.55rem] leading-snug text-maroon-950 italic sm:text-[2rem]">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8">
                  <p className="eyebrow text-gold-700">
                    {t.name} · {t.city}
                  </p>
                  <p className="mt-1 text-sm text-ink-500">Purchased: {t.product}</p>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous review"
              className="grid h-11 w-11 place-items-center rounded-full border border-maroon-950/25 text-maroon-950 transition-all hover:bg-maroon-950 hover:text-gold-300"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.4} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setState([k, k > i ? 1 : -1])}
                  aria-label={`Show review ${k + 1}`}
                  aria-current={k === i}
                  className="grid h-11 w-6 place-items-center"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-500",
                      k === i ? "w-6 bg-maroon-950" : "w-1.5 bg-maroon-950/25",
                    )}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next review"
              className="grid h-11 w-11 place-items-center rounded-full border border-maroon-950/25 text-maroon-950 transition-all hover:bg-maroon-950 hover:text-gold-300"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

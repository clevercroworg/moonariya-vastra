"use client";

import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { heroSlides } from "@/data/home";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { FrameCorners, LotusMark } from "@/components/ui/Ornaments";

const AUTOPLAY = 7; // seconds
const ease = [0.22, 1, 0.36, 1] as const;
const drape = [0.65, 0, 0.35, 1] as const;

export function HeroSlider() {
  const reduce = useReducedMotion();
  const [{ index, prev, dir }, setState] = useState({ index: 0, prev: -1, dir: 1 });
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const progress = useMotionValue(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const count = heroSlides.length;

  const goTo = useCallback(
    (next: number, direction?: number) => {
      setState((s) => {
        const target = (next + count) % count;
        if (target === s.index) return s;
        return { index: target, prev: s.index, dir: direction ?? (target > s.index ? 1 : -1) };
      });
    },
    [count],
  );
  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const previous = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  // Autoplay with a visible progress bar.
  useEffect(() => {
    progress.set(0);
    if (reduce) return;
    controls.current = animate(progress, 1, {
      duration: AUTOPLAY,
      ease: "linear",
      onComplete: () => goTo(index + 1, 1),
    });
    return () => controls.current?.stop();
  }, [index, reduce, progress, goTo]);

  useEffect(() => {
    if (paused || hovering) controls.current?.pause();
    else controls.current?.play();
  }, [paused, hovering, index]);

  const slide = heroSlides[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative isolate h-[calc(100svh-108px)] max-h-[960px] min-h-[600px] overflow-hidden bg-maroon-950 lg:h-[calc(100svh-132px)]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") previous();
      }}
    >
      <h1 className="sr-only">Monaariya Vastra — sarees in silk, cotton, organza, tissue and more</h1>

      {/* Slides */}
      <motion.div
        className="absolute inset-0"
        style={{ touchAction: "pan-y" }}
        onPanEnd={(_, info) => {
          if (info.offset.x < -60) next();
          else if (info.offset.x > 60) previous();
        }}
      >
        {heroSlides.map((s, i) => {
          const status = i === index ? "active" : i === prev ? "prev" : "idle";
          const hidden = dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";
          return (
            <motion.div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${s.label}`}
              aria-hidden={status !== "active"}
              className="absolute inset-0"
              initial={false}
              animate={{
                clipPath: status === "idle" ? hidden : "inset(0% 0% 0% 0%)",
                zIndex: status === "active" ? 2 : status === "prev" ? 1 : 0,
              }}
              transition={{
                clipPath: { duration: status === "active" ? 1.25 : 0, ease: drape },
                zIndex: { duration: 0 },
              }}
            >
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{ scale: status === "idle" ? 1.14 : 1 }}
                transition={{ duration: status === "active" ? 9 : 0, ease: "easeOut" }}
              >
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  sizes="100vw"
                  quality={85}
                  preload={i === 0}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  className="object-cover object-[var(--focus)] lg:object-center"
                  style={{ ["--focus" as string]: s.mobileFocus }}
                />
              </motion.div>
            </motion.div>
          );
        })}

        {/* Legibility overlays */}
        <div className="pointer-events-none absolute inset-0 z-[3] bg-linear-to-t from-maroon-950 via-maroon-950/55 to-maroon-950/10 lg:bg-linear-to-r lg:from-maroon-950/95 lg:via-maroon-950/50 lg:to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-40 bg-linear-to-t from-maroon-950/90 to-transparent" />
      </motion.div>

      {/* Frame */}
      <FrameCorners className="inset-3 z-[4] text-gold-400/70 sm:inset-5 lg:inset-7" />

      {/* Vertical tagline */}
      <p
        aria-hidden
        className="eyebrow absolute top-1/2 right-10 z-[5] hidden origin-center translate-x-1/2 -translate-y-1/2 rotate-90 text-[0.65rem] whitespace-nowrap text-gold-300/70 xl:block"
      >
        Timeless Drapes · Modern Grace
      </p>

      {/* Copy */}
      <div className="pointer-events-none relative z-[5] flex h-full items-end pb-36 sm:pb-40 lg:items-center lg:pb-0">
        <div className="container-x">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              className="pointer-events-auto max-w-[46rem] lg:pl-10"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.35 } }}
            >
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.35 }}
                className="flex items-center gap-3 text-gold-400"
              >
                <LotusMark className="h-4" />
                <span className="eyebrow text-gold-300">{slide.eyebrow}</span>
              </motion.div>

              <h2 className="mt-5 font-display text-display font-medium text-ivory-50">
                <HeroTitle lines={slide.title} />
              </h2>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.75 }}
                className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-ivory-100/80 sm:text-[1.05rem]"
              >
                {slide.copy}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.9 }}
                className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
              >
                <ButtonLink href={slide.cta.href}>{slide.cta.label}</ButtonLink>
                <ButtonLink href={slide.secondary.href} variant="outline-light">
                  {slide.secondary.label}
                </ButtonLink>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 z-[6] pb-8 sm:pb-10 lg:pb-12">
        <div className="container-x flex items-end justify-between gap-6 pr-20 sm:pr-24 lg:pl-[calc(3rem+2.5rem)]">
          <div className="flex items-end gap-4">
            <p className="font-display leading-none text-ivory-50" aria-live="polite" aria-atomic>
              <span className="sr-only">Slide </span>
              <span className="text-4xl sm:text-5xl">{String(index + 1).padStart(2, "0")}</span>
              <span className="ml-1 text-lg text-gold-300/70"> / {String(count).padStart(2, "0")}</span>
            </p>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              className="mb-1 grid h-9 w-9 place-items-center rounded-full border border-gold-400/40 text-gold-300 transition-colors hover:bg-gold-400/10"
            >
              {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
            </button>
          </div>

          {/* Tabs with progress */}
          <div className="hidden flex-1 grid-cols-4 gap-5 lg:grid lg:max-w-3xl">
            {heroSlides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${s.label}`}
                aria-current={i === index}
                className="group/tab text-left"
              >
                <span
                  className={cn(
                    "eyebrow block truncate text-[0.64rem] tracking-[0.2em] whitespace-nowrap transition-colors duration-300",
                    i === index ? "text-gold-200" : "text-ivory-100/50 group-hover/tab:text-ivory-100/80",
                  )}
                >
                  {String(i + 1).padStart(2, "0")} — {s.label}
                </span>
                <span className="relative mt-3 block h-px w-full overflow-hidden bg-ivory-100/20">
                  {i === index ? (
                    <motion.span className="absolute inset-0 origin-left bg-gold-400" style={{ scaleX: reduce ? 1 : progress }} />
                  ) : (
                    i < index && <span className="absolute inset-0 bg-gold-400/40" />
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous slide"
              className="grid h-12 w-12 place-items-center rounded-full border border-gold-400/40 text-gold-200 backdrop-blur-sm transition-all duration-300 hover:border-gold-300 hover:bg-gold-400/15"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.4} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="grid h-12 w-12 place-items-center rounded-full border border-gold-400/40 text-gold-200 backdrop-blur-sm transition-all duration-300 hover:border-gold-300 hover:bg-gold-400/15"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>
        </div>

        {/* Mobile progress */}
        <div className="container-x mt-5 flex gap-2 pr-20 sm:pr-24 lg:hidden">
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${s.label}`}
              className="relative h-6 flex-1"
            >
              <span className="absolute inset-x-0 top-1/2 block h-[2px] -translate-y-1/2 overflow-hidden bg-ivory-100/20">
                {i === index && (
                  <motion.span className="absolute inset-0 origin-left bg-gold-400" style={{ scaleX: reduce ? 1 : progress }} />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroTitle({ lines }: { lines: [string, string] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <motion.span
            className={cn("block", i === 1 && "text-gold-gradient italic font-normal")}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, ease, delay: 0.45 + i * 0.12 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { categories, collectionHref, type Category } from "@/data/categories";
import { wrap } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/Button";

const N = categories.length;
const spring = { type: "spring", stiffness: 90, damping: 20, mass: 1 } as const;

const GLIDE_SPEED = 0.32; // cards per second when idle
const GLIDE_EASE = 0.7; // seconds for speed changes to settle (scroll → glide hand-off)
const IDLE_AFTER_INTERACTION = 2500; // ms of stillness after a click / drag / arrow
const MAX_SCROLL_STEP = 0.6; // cards per frame cap, so anchor jumps never whip the wheel
const pxPerCard = () => (window.innerWidth >= 768 ? 340 : 240); // page scroll per card
const dragPxPerCard = () => (window.innerWidth >= 768 ? 300 : 215);

/**
 * How the wheel moves — one integrator, no competing timers:
 *  • page scroll rotates it directly (scroll down → turns forward, up → back);
 *  • when scrolling stops, speed eases into a gentle auto-glide in the last direction;
 *  • drag / arrows / clicking a side card take over, then the glide eases back in;
 *  • whichever input happens last wins (scrolling interrupts a settle, a drag stops everything).
 */
export function CategoryArc() {
  const pos = useMotionValue(0);
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { margin: "80px 0px" });
  const reduce = useReducedMotion();

  const phys = useRef({
    v: 0, // glide velocity, cards/s
    dir: 1, // glide direction (follows the last scroll / drag)
    lastScroll: null as number | null,
    wheelX: 0, // horizontal trackpad delta waiting to be applied
    resumeAt: 0, // performance.now() before which the glide stays at rest
    settling: false,
    settleToken: 0,
    keyboardFocus: false,
  });
  const settleCtl = useRef<AnimationPlaybackControls | null>(null);
  const drag = useRef<{ x: number; start: number; moved: boolean; t: number; lastX: number } | null>(null);
  const suppressClick = useRef(false);
  const inViewRef = useRef(inView);
  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  useMotionValueEvent(pos, "change", (p) => {
    const a = wrap(0, N, Math.round(p));
    setActive((cur) => (cur === a ? cur : a));
  });

  const stopSettle = useCallback(() => {
    const s = phys.current;
    s.settleToken++;
    s.settling = false;
    settleCtl.current?.stop();
    settleCtl.current = null;
  }, []);

  /** Spring to an exact card position, then rest briefly before gliding again. */
  const settleTo = useCallback(
    (target: number) => {
      const s = phys.current;
      stopSettle();
      const token = s.settleToken;
      s.settling = true;
      s.v = 0;
      s.resumeAt = performance.now() + IDLE_AFTER_INTERACTION;
      const ctl = animate(pos, target, reduce ? { duration: 0 } : spring);
      settleCtl.current = ctl;
      ctl.then(() => {
        if (token === s.settleToken) s.settling = false;
      });
    },
    [pos, reduce, stopSettle],
  );

  /** Bring card `i` to the front along the shortest way round. */
  const selectIndex = useCallback(
    (i: number) => {
      const p = pos.get();
      settleTo(Math.round(p + wrap(-N / 2, N / 2, i - p)));
    },
    [pos, settleTo],
  );

  const step = useCallback(
    (d: number) => {
      phys.current.dir = d > 0 ? 1 : -1;
      settleTo(Math.round(pos.get()) + d);
    },
    [pos, settleTo],
  );

  // The single integrator.
  useAnimationFrame((_, delta) => {
    const s = phys.current;
    const y = window.scrollY;
    if (s.lastScroll === null) s.lastScroll = y;
    const dy = y - s.lastScroll;
    s.lastScroll = y;
    const dx = s.wheelX;
    s.wheelX = 0;

    if (reduce || !inViewRef.current) {
      s.v = 0;
      return;
    }
    if (drag.current) return; // the pointer owns the wheel

    const dt = Math.min(delta, 50) / 1000;
    let move = 0;

    const input = (dy + dx) / pxPerCard();
    if (input !== 0) {
      if (s.settling) stopSettle(); // scrolling wins over a running settle
      move += Math.max(-MAX_SCROLL_STEP, Math.min(MAX_SCROLL_STEP, input));
      // sub-pixel jitter from smooth scrolling shouldn't flip the glide direction
      if (Math.abs(dy + dx) >= 2) s.dir = input > 0 ? 1 : -1;
    }
    if (s.settling) return;

    const resting = performance.now() < s.resumeAt || s.keyboardFocus;
    const target = resting ? 0 : s.dir * GLIDE_SPEED;
    s.v += (target - s.v) * (1 - Math.exp(-dt / GLIDE_EASE));
    move += s.v * dt;

    if (move !== 0) pos.set(pos.get() + move);
  });

  // Pointer drag (horizontal); vertical touch swipes still scroll the page.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, start: pos.get(), moved: false, t: performance.now(), lastX: e.clientX };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      d.moved = true;
      stopSettle();
      phys.current.v = 0;
      d.start = pos.get();
      d.x = e.clientX;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      return;
    }
    pos.set(d.start - (e.clientX - d.x) / dragPxPerCard());
    d.lastX = e.clientX;
    d.t = performance.now();
  };
  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return; // a tap or a page scroll — leave the wheel alone
    suppressClick.current = true;
    window.setTimeout(() => (suppressClick.current = false), 60);
    const vx = (e.clientX - d.lastX) / Math.max(16, performance.now() - d.t); // px per ms
    phys.current.dir = e.clientX < d.x ? 1 : -1;
    settleTo(Math.round(pos.get() - vx * 6));
  };

  // Horizontal trackpad swipes feed the same integrator as page scroll.
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) phys.current.wheelX += e.deltaX;
  };

  const current = categories[active];

  return (
    <section
      aria-labelledby="categories-title"
      className="relative overflow-hidden bg-ivory-50 pt-20 pb-16 sm:pt-28 sm:pb-24"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
    >
      {/* soft paper glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(60%_60%_at_50%_0%,rgb(221_180_106/0.16),transparent_70%)]"
      />

      <div className="container-x relative">
        <SectionHeading
          id="categories-title"
          eyebrow="Shop by Category"
          title={["Eleven ways", "to drape a story."]}
          intro="From heirloom silks to breezy everyday cottons — scroll to turn the wheel and find the weave that feels like you."
        />
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        aria-roledescription="carousel"
        aria-label="Saree categories"
        className="relative isolate z-0 mt-10 h-[400px] cursor-grab touch-pan-y overscroll-x-contain select-none [--card-h:282px] [--card-w:200px] [--r:950px] [--step:13.5] active:cursor-grabbing sm:mt-14 sm:h-[470px] sm:[--card-h:325px] sm:[--card-w:230px] sm:[--r:1250px] sm:[--step:12] md:h-[560px] md:[--card-h:380px] md:[--card-w:270px] md:[--r:1650px] md:[--step:10.6]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        onFocus={(e) => {
          // keep a keyboard user's card still; mouse focus doesn't count
          if ((e.target as HTMLElement).matches(":focus-visible")) phys.current.keyboardFocus = true;
        }}
        onBlur={() => {
          phys.current.keyboardFocus = false;
        }}
      >
        {/* orbit guide */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full border border-dashed border-gold-500/35"
          style={{
            top: "calc(36px + var(--card-h) / 2)",
            width: "calc((var(--r) - var(--card-h) / 2) * 2)",
            height: "calc((var(--r) - var(--card-h) / 2) * 2)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full border border-gold-500/15"
          style={{
            top: "calc(16px + var(--card-h) / 2)",
            width: "calc((var(--r) - var(--card-h) / 2 + 20px) * 2)",
            height: "calc((var(--r) - var(--card-h) / 2 + 20px) * 2)",
          }}
        />

        {categories.map((c, i) => (
          <ArcCard
            key={c.slug}
            category={c}
            index={i}
            pos={pos}
            isActive={i === active}
            onSelect={selectIndex}
            suppressClick={suppressClick}
          />
        ))}
      </div>

      {/* Active info + controls */}
      <div className="container-x relative -mt-6 flex flex-col items-center text-center sm:-mt-2">
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous category"
            className="grid h-12 w-12 place-items-center rounded-full border border-maroon-950/25 text-maroon-950 transition-all duration-300 hover:border-maroon-950 hover:bg-maroon-950 hover:text-gold-300"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.4} />
          </button>
          <p className="min-w-20 font-display text-xl text-ink-500">
            <span className="text-2xl text-maroon-950">{String(active + 1).padStart(2, "0")}</span> / {N}
          </p>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next category"
            className="grid h-12 w-12 place-items-center rounded-full border border-maroon-950/25 text-maroon-950 transition-all duration-300 hover:border-maroon-950 hover:bg-maroon-950 hover:text-gold-300"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.4} />
          </button>
        </div>

        {/* Cross-fade (no queueing), so fast scrolling never lags behind the wheel */}
        <div className="relative mt-6 h-[150px] w-full max-w-lg sm:h-[140px]">
          <AnimatePresence initial={false}>
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-0 flex flex-col items-center"
            >
              <h3 className="font-display text-h2 text-maroon-950">{current.name}</h3>
              <p className="mt-2 max-w-md text-ink-700">{current.blurb}</p>
              <TextLink href={collectionHref(current.slug)} className="mt-4">
                Explore {current.short}
              </TextLink>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

const ArcCard = memo(function ArcCard({
  category,
  index,
  pos,
  isActive,
  onSelect,
  suppressClick,
}: {
  category: Category;
  index: number;
  pos: MotionValue<number>;
  isActive: boolean;
  onSelect: (i: number) => void;
  suppressClick: React.RefObject<boolean>;
}) {
  const o = useTransform(pos, (p) => wrap(-N / 2, N / 2, index - p));
  const abs = useTransform(o, (v) => Math.abs(v));
  const opacity = useTransform(abs, [0, 2, 3.2], [1, 1, 0]);
  const scale = useTransform(abs, [0, 1, 3], [1.06, 0.97, 0.88]);
  const shade = useTransform(abs, [0, 1, 2.5], [0, 0.28, 0.5]);
  const zIndex = useTransform(abs, (v) => 20 - Math.round(v * 2)); // changes rarely → no per-frame restacking
  const outline = useTransform(abs, [0, 0.45], [1, 0]);
  const visibility = useTransform(abs, (v) => (v > 3.3 ? "hidden" : "visible"));

  return (
    <motion.div
      className="absolute top-9 left-1/2 w-[var(--card-w)] will-change-transform"
      style={
        {
          "--o": o,
          opacity,
          zIndex,
          visibility,
          marginLeft: "calc(var(--card-w) / -2)",
          transform: "rotate(calc(var(--step) * var(--o) * 1deg))",
          transformOrigin: "50% var(--r)",
        } as unknown as CSSProperties
      }
    >
      <motion.div style={{ scale }} className="origin-bottom will-change-transform">
        <Link
          href={collectionHref(category.slug)}
          draggable={false}
          aria-label={`${category.name} — ${category.blurb}`}
          onClick={(e) => {
            if (suppressClick.current) {
              e.preventDefault();
              return;
            }
            // Mouse/touch on a side card turns it to the front; keyboard (detail 0) always navigates.
            if (!isActive && e.detail !== 0) {
              e.preventDefault();
              onSelect(index);
            }
          }}
          onFocus={(e) => {
            // only keyboard focus brings a card forward (mouse focus would race the click)
            if (e.currentTarget.matches(":focus-visible")) onSelect(index);
          }}
          className="group/arc relative block"
        >
          {/* outer arch outline */}
          <motion.span
            aria-hidden
            style={{ opacity: outline }}
            className="arch absolute -inset-2.5 border border-gold-500/60"
          />
          <span className="arch relative block aspect-[27/38] overflow-hidden bg-maroon-900 shadow-[0_30px_60px_-30px_rgb(23_3_4/0.6)]">
            <Image
              src={category.image}
              alt=""
              fill
              draggable={false}
              sizes="(min-width: 768px) 290px, 220px"
              className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover/arc:scale-105"
            />
            <span className="absolute inset-0 bg-linear-to-t from-maroon-950/90 via-maroon-950/10 to-transparent" />
            <motion.span className="absolute inset-0 bg-ivory-50" style={{ opacity: shade }} />
            <span className="absolute inset-x-0 bottom-0 flex flex-col items-center p-5 text-center">
              <span className="eyebrow text-[0.6rem] text-gold-300">{String(index + 1).padStart(2, "0")}</span>
              <span className="mt-1 font-display text-[1.6rem] leading-tight text-ivory-50 md:text-[1.85rem]">
                {category.short}
              </span>
            </span>
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
});

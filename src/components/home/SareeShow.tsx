"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { looks, type Look } from "@/data/home";
import { LotusMark } from "@/components/ui/Ornaments";
import { TextLink } from "@/components/ui/Button";

/**
 * "The Saree Show" — a runway of looks.
 *  • Desktop (fine pointer, ≥1024px): the section pins and the track walks sideways as you scroll.
 *  • Touch / smaller screens: an endless runway that glides on its own once it's in view,
 *    follows your finger when you swipe, and eases back into the glide afterwards.
 */
export function SareeShow() {
  const reduce = useReducedMotion();
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setPinned(mq.matches && !reduce);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduce]);

  return pinned ? <PinnedShow /> : <GlideShow />;
}

function Backdrop() {
  return (
    <>
      <div aria-hidden className="bg-lattice pointer-events-none absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgb(221_180_106/0.18),transparent_70%)]"
      />
    </>
  );
}

function Intro({ hint }: { hint: string }) {
  return (
    <>
      <div className="flex items-center gap-3 text-gold-400">
        <LotusMark className="h-5" />
        <span className="eyebrow text-gold-300">The Saree Show · Season 01</span>
      </div>
      <h2 id="saree-show-title" className="mt-5 font-display text-h1 font-medium">
        Six drapes.
        <br />
        <em className="text-gold-gradient font-normal">Six moods.</em>
      </h2>
      <p className="mt-6 max-w-sm leading-relaxed text-ivory-100/70">
        Step onto our ramp — from temple brides to monsoon muses, see how each weave moves, catches light and tells
        its own story.
      </p>
      <p className="eyebrow mt-8 flex items-center gap-3 text-[0.65rem] text-gold-300/80">
        <span className="h-px w-10 bg-gold-400/60" /> {hint}
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop: pinned, scroll-driven runway                              */
/* ------------------------------------------------------------------ */

function PinnedShow() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, (v) => -v * distance);

  return (
    <section
      id="saree-show"
      ref={sectionRef}
      aria-labelledby="saree-show-title"
      className="relative bg-maroon-950 text-ivory-50"
      style={{ height: `calc(100vh - 77px + ${distance}px)` }}
    >
      <div className="sticky top-[77px] flex h-[calc(100vh-77px)] flex-col justify-center overflow-hidden">
        <Backdrop />
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="relative flex w-max items-center gap-10 pr-[12vw] pl-12 will-change-transform"
        >
          <div className="w-[34vw] max-w-[520px] shrink-0 self-center pr-6">
            <Intro hint="Scroll to walk the ramp" />
          </div>

          {looks.map((look, i) => (
            <LookCard
              key={look.id}
              look={look}
              index={i}
              reveal
              className={`w-[min(26vw,380px,calc((100vh_-_270px)/1.5))] ${i % 2 === 1 ? "mt-16" : "-mt-6"}`}
              sizes="380px"
            />
          ))}

          <div className="flex w-[24vw] shrink-0 flex-col items-start justify-center">
            <p className="font-display text-h2 leading-tight text-ivory-50">
              Find the drape
              <br />
              <em className="text-gold-gradient">made for your moment.</em>
            </p>
            <Link
              href="/collections/all"
              className="group/o mt-8 inline-flex items-center gap-3 text-[0.78rem] font-medium tracking-[0.2em] text-gold-300 uppercase"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full border border-gold-400/50 transition-all duration-500 group-hover/o:bg-gold-400 group-hover/o:text-maroon-950">
                <ArrowUpRight className="h-5 w-5" strokeWidth={1.4} />
              </span>
              Shop all sarees
            </Link>
          </div>
        </motion.div>

        <div className="container-x relative mt-10 flex items-center gap-5 pr-24">
          <span className="eyebrow text-[0.62rem] text-gold-300/70">Ramp</span>
          <div className="relative h-px flex-1 bg-ivory-100/15">
            <motion.span className="absolute inset-0 origin-left bg-gold-400" style={{ scaleX: smooth }} />
          </div>
          <span className="eyebrow text-[0.62rem] text-gold-300/70">{String(looks.length).padStart(2, "0")} looks</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Touch / small screens: endless auto-gliding runway                 */
/* ------------------------------------------------------------------ */

const GLIDE_PX_PER_SEC = 38; // calm runway pace
const SPEED_EASE = 0.6; // seconds for speed changes (fling → rest → glide) to settle
const RESUME_AFTER = 2500; // ms after a swipe before gliding again
const MAX_FLING = 2400; // px/s

const wrapX = (v: number, w: number) => (w > 0 ? ((((v % w) + w) % w) - w) : v); // → [-w, 0)

function GlideShow() {
  const reduce = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const inView = useInView(viewportRef, { amount: 0.35 });
  const inViewRef = useRef(inView);
  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  const st = useRef({
    setW: 0, // width of one copy of the looks (incl. trailing gap)
    v: 0, // px/s (negative = moving left)
    resumeAt: 0,
    drag: null as null | { startX: number; startY: number; startTx: number; lastX: number; lastT: number; vel: number; moved: boolean },
  });
  const suppressClick = useRef(false);
  const progress = useTransform(x, (v) => (st.current.setW ? -v / st.current.setW : 0));

  useEffect(() => {
    const el = setRef.current;
    if (!el) return;
    const measure = () => {
      st.current.setW = el.offsetWidth;
      x.set(wrapX(x.get(), st.current.setW));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [x]);

  useAnimationFrame((_, delta) => {
    const s = st.current;
    if (!s.setW || s.drag?.moved) return;
    const dt = Math.min(delta, 50) / 1000;
    const resting = reduce || !inViewRef.current || performance.now() < s.resumeAt;
    const target = resting ? 0 : -GLIDE_PX_PER_SEC;
    s.v += (target - s.v) * (1 - Math.exp(-dt / SPEED_EASE));
    if (Math.abs(s.v) < 0.01 && target === 0) return;
    x.set(wrapX(x.get() + s.v * dt, s.setW));
  });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    st.current.drag = {
      startX: e.clientX,
      startY: e.clientY,
      startTx: x.get(),
      lastX: e.clientX,
      lastT: performance.now(),
      vel: 0,
      moved: false,
    };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = st.current;
    const d = s.drag;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (!d.moved) {
      // only claim clearly horizontal gestures; vertical ones scroll the page
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(e.clientY - d.startY)) return;
      d.moved = true;
      d.startX = e.clientX;
      d.startTx = x.get();
      s.v = 0;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      return;
    }
    const now = performance.now();
    const step = Math.max(1, now - d.lastT);
    d.vel = d.vel * 0.6 + ((e.clientX - d.lastX) / step) * 1000 * 0.4; // smoothed px/s
    d.lastX = e.clientX;
    d.lastT = now;
    x.set(wrapX(d.startTx + (e.clientX - d.startX), s.setW));
  };
  const endDrag = () => {
    const s = st.current;
    const d = s.drag;
    s.drag = null;
    if (!d?.moved) return; // a tap (navigates) or a page scroll
    suppressClick.current = true;
    window.setTimeout(() => (suppressClick.current = false), 60);
    const stale = performance.now() - d.lastT > 90; // finger rested before lifting
    s.v = stale ? 0 : Math.max(-MAX_FLING, Math.min(MAX_FLING, d.vel));
    s.resumeAt = performance.now() + RESUME_AFTER;
  };

  const renderSet = (copy: number) => (
    <div
      ref={copy === 0 ? setRef : undefined}
      aria-hidden={copy > 0 || undefined}
      className="flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6"
    >
      {looks.map((look, i) => (
        <LookCard
          key={`${look.id}-${copy}`}
          look={look}
          index={i}
          reveal={false}
          tabIndex={copy > 0 ? -1 : undefined}
          suppressClick={suppressClick}
          className="w-[68vw] sm:w-[42vw] md:w-[32vw]"
          sizes="(min-width: 768px) 32vw, (min-width: 640px) 42vw, 68vw"
        />
      ))}
    </div>
  );

  return (
    <section
      id="saree-show"
      aria-labelledby="saree-show-title"
      className="relative overflow-hidden bg-maroon-950 py-20 text-ivory-50 sm:py-24"
    >
      <Backdrop />
      <div className="container-x relative">
        <Intro hint={reduce ? "Swipe to walk the ramp" : "The ramp is moving — swipe to explore"} />
      </div>

      <motion.div
        ref={viewportRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-10 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        aria-roledescription="carousel"
        aria-label="The Saree Show looks"
      >
        <motion.div style={{ x }} className="flex w-max pl-4 will-change-transform sm:pl-6">
          {renderSet(0)}
          {renderSet(1)}
        </motion.div>
      </motion.div>

      <div className="container-x relative mt-8 flex items-center gap-5">
        <div className="relative h-px flex-1 bg-ivory-100/15">
          <motion.span className="absolute inset-0 origin-left bg-gold-400" style={{ scaleX: progress }} />
        </div>
        <TextLink href="/collections/all" tone="light">
          Shop all
        </TextLink>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function LookCard({
  look,
  index,
  reveal,
  className,
  sizes,
  tabIndex,
  suppressClick,
}: {
  look: Look;
  index: number;
  reveal: boolean;
  className: string;
  sizes: string;
  tabIndex?: number;
  suppressClick?: React.RefObject<boolean>;
}) {
  return (
    <motion.article
      initial={reveal ? { opacity: 0, y: 40 } : false}
      whileInView={reveal ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.08 }}
      className={`group/look relative shrink-0 ${className}`}
    >
      <Link
        href={look.href}
        draggable={false}
        tabIndex={tabIndex}
        onClick={(e) => {
          if (suppressClick?.current) e.preventDefault();
        }}
        className="block"
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={look.image}
            alt={look.alt}
            fill
            draggable={false}
            sizes={sizes}
            className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-silk)] group-hover/look:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-maroon-950/85 via-transparent to-transparent" />
          <div className="absolute inset-3 border border-gold-300/0 transition-colors duration-700 group-hover/look:border-gold-300/45" />
          <span className="absolute top-4 left-4 font-display text-6xl leading-none text-ivory-50/90 italic">
            {look.number}
          </span>
          <span className="absolute top-5 right-4 rounded-full border border-gold-300/50 px-3 py-1 text-[0.62rem] font-medium tracking-[0.18em] text-gold-200 uppercase backdrop-blur-sm">
            {look.fabric}
          </span>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="font-display text-[1.75rem] leading-tight text-ivory-50">{look.title}</h3>
            <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-ivory-100/80 opacity-0 transition-all duration-700 ease-[var(--ease-silk)] group-hover/look:max-h-24 group-hover/look:opacity-100 max-lg:max-h-24 max-lg:opacity-100">
              {look.mood}
            </p>
            <span className="mt-3 inline-flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.2em] text-gold-300 uppercase">
              Shop the look <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

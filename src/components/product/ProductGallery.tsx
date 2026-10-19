"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollLock } from "@/components/providers/SmoothScroll";

type Img = { src: string; alt: string };
const ease = [0.22, 1, 0.36, 1] as const;

export function ProductGallery({ images, badge }: { images: Img[]; badge?: string }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [open, setOpen] = useState(false);
  const zoomRef = useRef<HTMLDivElement>(null);
  const panned = useRef(false);
  const n = images.length;

  const go = useCallback(
    (i: number) => {
      const next = (i + n) % n;
      setDir(next > index || (index === n - 1 && next === 0) ? 1 : -1);
      setIndex(next);
    },
    [index, n],
  );

  // Hover zoom (fine pointers only) — updates CSS vars directly, no re-render per move.
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !zoomRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    zoomRef.current.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`);
    zoomRef.current.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`);
    zoomRef.current.dataset.zoom = "1";
  };
  const onLeave = () => {
    if (zoomRef.current) zoomRef.current.dataset.zoom = "0";
  };

  return (
    <div className="flex flex-col-reverse gap-4 lg:grid lg:grid-cols-[84px_1fr]">
      {/* Thumbnails */}
      <div className="no-scrollbar flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible" role="tablist" aria-label="Product images">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show image ${i + 1} of ${n}`}
            onClick={() => go(i)}
            className={cn(
              "relative aspect-[3/4] w-[72px] shrink-0 overflow-hidden rounded-[2px] bg-ivory-200 transition-all duration-300 lg:w-full",
              i === index ? "ring-2 ring-gold-500 ring-offset-2 ring-offset-ivory-50" : "opacity-60 hover:opacity-100",
            )}
          >
            <Image src={img.src} alt="" fill sizes="84px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative">
        <motion.div
          className="group/main relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-[2px] bg-ivory-200"
          style={{ touchAction: "pan-y" }}
          onPanStart={() => {
            panned.current = true;
          }}
          onPanEnd={(_, info) => {
            if (info.offset.x < -50) go(index + 1);
            else if (info.offset.x > 50) go(index - 1);
          }}
          onPointerDown={() => {
            panned.current = false;
          }}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onClick={() => {
            if (!panned.current) setOpen(true);
          }}
          role="button"
          tabIndex={0}
          aria-label="Open full-screen gallery"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(true);
            }
            if (e.key === "ArrowRight") go(index + 1);
            if (e.key === "ArrowLeft") go(index - 1);
          }}
        >
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={images[index].src}
              custom={dir}
              className="absolute inset-0"
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.5, ease }}
            >
              <div
                ref={zoomRef}
                data-zoom="0"
                className="absolute inset-0 origin-[var(--zx,50%)_var(--zy,50%)] transition-transform duration-300 ease-out data-[zoom=1]:scale-[2]"
              >
                <Image
                  src={images[index].src}
                  alt={images[index].alt}
                  fill
                  preload={index === 0}
                  quality={85}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {badge && (
            <span className="pointer-events-none absolute top-4 left-4 bg-maroon-950 px-3 py-1.5 text-[0.65rem] font-medium tracking-[0.2em] text-gold-300 uppercase">
              {badge}
            </span>
          )}
          <span className="pointer-events-none absolute right-4 bottom-4 grid h-10 w-10 place-items-center rounded-full bg-ivory-50/85 text-maroon-950 opacity-0 shadow transition-opacity group-hover/main:opacity-100 max-lg:opacity-100">
            <Expand className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </span>
        </motion.div>

        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ivory-50/90 text-maroon-950 shadow transition hover:bg-ivory-50 sm:grid"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next image"
              className="absolute top-1/2 right-3 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ivory-50/90 text-maroon-950 shadow transition hover:bg-ivory-50 sm:grid"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <div className="mt-3 flex justify-center gap-1.5 sm:hidden" aria-hidden>
              {images.map((img, i) => (
                <span key={img.src} className={cn("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-maroon-950" : "w-1.5 bg-maroon-950/25")} />
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {open && <Lightbox images={images} index={index} onIndex={go} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: Img[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  useScrollLock(true);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex(index + 1);
      if (e.key === "ArrowLeft") onIndex(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onIndex, onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[90] flex flex-col bg-maroon-950/97"
      data-lenis-prevent
    >
      <div className="flex items-center justify-between px-4 py-4 text-gold-200 sm:px-6">
        <p className="font-display text-xl">
          {String(index + 1).padStart(2, "0")} <span className="text-gold-300/60">/ {String(images.length).padStart(2, "0")}</span>
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="grid h-12 w-12 place-items-center rounded-full border border-gold-400/30 transition-colors hover:bg-gold-400/10"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>
      <motion.div
        className="relative flex-1"
        style={{ touchAction: "pan-y" }}
        onPanEnd={(_, info) => {
          if (info.offset.x < -50) onIndex(index + 1);
          else if (info.offset.x > 50) onIndex(index - 1);
        }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={images[index].src}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="absolute inset-4 sm:inset-8"
          >
            <Image src={images[index].src} alt={images[index].alt} fill sizes="100vw" quality={85} className="object-contain" />
          </motion.div>
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => onIndex(index - 1)}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-gold-400/30 bg-maroon-950/60 text-gold-200 sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => onIndex(index + 1)}
              aria-label="Next image"
              className="absolute top-1/2 right-3 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-gold-400/30 bg-maroon-950/60 text-gold-200 sm:right-6"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </>
        )}
      </motion.div>
      <div className="flex justify-center gap-3 px-4 py-5">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => onIndex(i)}
            aria-label={`Show image ${i + 1}`}
            className={cn(
              "relative aspect-[3/4] w-14 overflow-hidden rounded-[2px] transition-opacity",
              i === index ? "ring-2 ring-gold-400 ring-offset-2 ring-offset-maroon-950" : "opacity-50 hover:opacity-90",
            )}
          >
            <Image src={img.src} alt="" fill sizes="56px" className="object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

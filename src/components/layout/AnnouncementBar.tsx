"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { announcements } from "@/data/site";
import { Sparkle } from "@/components/ui/Ornaments";

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % announcements.length), 4000);
    return () => window.clearInterval(t);
  }, [paused]);

  return (
    <div
      className="relative z-50 bg-maroon-800 text-gold-200"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-x flex h-9 items-center justify-center gap-3 overflow-hidden">
        <Sparkle className="h-2.5 w-2.5 shrink-0 text-gold-400" />
        <div className="relative h-5 w-full max-w-md overflow-hidden text-center" aria-live="off">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={i}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 truncate text-[0.7rem] leading-5 font-medium tracking-[0.22em] uppercase"
            >
              {announcements[i]}
            </motion.p>
          </AnimatePresence>
        </div>
        <Sparkle className="h-2.5 w-2.5 shrink-0 text-gold-400" />
      </div>
    </div>
  );
}

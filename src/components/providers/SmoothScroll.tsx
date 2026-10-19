"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {enabled && (
        <ReactLenis
          root
          options={{
            lerp: 0.1,
            anchors: { offset: -96 },
            allowNestedScroll: true,
            stopInertiaOnNavigate: true,
          }}
        />
      )}
      {children}
    </MotionConfig>
  );
}

/** Locks page scroll (native and Lenis) while an overlay is open. */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis();
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      html.style.overflow = prev;
      lenis?.start();
    };
  }, [locked, lenis]);
}

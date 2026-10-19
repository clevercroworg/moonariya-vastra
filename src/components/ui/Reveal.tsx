"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type RevealProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  y?: number;
  amount?: number;
};

/** Fade + rise into view once. */
export function Reveal({ children, delay = 0, y = 24, amount = 0.25, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.8, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const lineVariants = {
  hidden: { y: "105%" },
  show: ({ i, delay }: { i: number; delay: number }) => ({
    y: "0%",
    transition: { duration: 1, ease, delay: delay + i * 0.12 },
  }),
};

/**
 * Lines slide up out of an overflow mask — used for headlines.
 * The (unclipped) wrapper is what's observed; a clipped child would never
 * register as "in view".
 */
export function MaskLines({
  lines,
  className,
  delay = 0,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      className={`block ${className ?? ""}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
    >
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
          <motion.span className="block" custom={{ i, delay }} variants={lineVariants}>
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

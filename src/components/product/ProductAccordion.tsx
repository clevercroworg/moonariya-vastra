"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ProductAccordion({ items }: { items: { id: string; title: string; content: ReactNode }[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return (
    <div className="divide-y divide-ivory-200 border-y border-ivory-200">
      {items.map((it) => {
        const on = open === it.id;
        return (
          <div key={it.id}>
            <h3>
              <button
                type="button"
                id={`acc-${it.id}`}
                aria-expanded={on}
                aria-controls={`acc-panel-${it.id}`}
                onClick={() => setOpen(on ? null : it.id)}
                className="flex w-full items-center justify-between py-5 text-left font-display text-[1.35rem] text-maroon-950"
              >
                {it.title}
                <Plus className={cn("h-4 w-4 transition-transform duration-300", on && "rotate-45")} strokeWidth={1.5} aria-hidden />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  id={`acc-panel-${it.id}`}
                  role="region"
                  aria-labelledby={`acc-${it.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 text-[0.95rem] leading-relaxed text-ink-700">{it.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

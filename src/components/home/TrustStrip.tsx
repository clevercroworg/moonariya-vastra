"use client";

import { motion } from "motion/react";
import { BadgePercent, Headset, ShieldCheck, Truck } from "lucide-react";
import { trustFeatures } from "@/data/home";

const icons = { shipping: Truck, payment: ShieldCheck, offers: BadgePercent, support: Headset } as const;

export function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="relative bg-maroon-950 text-ivory-50">
      <div className="hairline-gold h-px w-full opacity-40" />
      <div className="bg-lattice">
        <ul className="container-x grid grid-cols-2 gap-y-10 py-12 sm:py-14 lg:grid-cols-4">
          {trustFeatures.map((f, i) => {
            const Icon = icons[f.id];
            return (
              <motion.li
                key={f.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                className="group/tf flex flex-col items-center gap-4 px-3 text-center lg:border-l lg:border-gold-400/15 lg:first:border-l-0"
              >
                <span className="relative grid h-16 w-16 place-items-center rounded-full border border-gold-400/40 text-gold-300 transition-all duration-500 group-hover/tf:border-gold-300 group-hover/tf:bg-gold-400/10">
                  <span className="absolute -inset-1.5 rounded-full border border-dashed border-gold-400/25 transition-transform duration-[1.5s] group-hover/tf:rotate-90" />
                  <Icon className="h-6 w-6" strokeWidth={1.3} aria-hidden />
                </span>
                <div>
                  <p className="font-display text-xl text-ivory-50 sm:text-2xl">{f.title}</p>
                  <p className="mt-1 text-[0.85rem] text-ivory-100/65">{f.copy}</p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
      <div className="hairline-gold h-px w-full opacity-40" />
    </section>
  );
}

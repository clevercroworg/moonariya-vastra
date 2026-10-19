"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { occasions, type Occasion } from "@/data/home";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/Button";

const layout: Record<Occasion["layout"], string> = {
  feature: "col-span-2 aspect-square md:row-span-2 md:aspect-auto",
  wide: "col-span-2 aspect-[2/1] md:aspect-auto",
  tile: "col-span-1 aspect-square md:aspect-auto",
};

const sizes: Record<Occasion["layout"], string> = {
  feature: "(min-width: 768px) 50vw, 100vw",
  wide: "(min-width: 768px) 50vw, 100vw",
  tile: "(min-width: 768px) 25vw, 50vw",
};

export function OccasionBento() {
  return (
    <section aria-labelledby="occasion-title" className="relative bg-ivory-100 py-20 sm:py-28">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="occasion-title"
            align="left"
            eyebrow="Shop by Occasion"
            title={["Dressed for", "every occasion."]}
            rule={false}
          />
          <TextLink href="/collections/all" className="md:mb-3">
            Browse all sarees
          </TextLink>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:grid-rows-[repeat(2,minmax(260px,32vh))] lg:gap-5">
          {occasions.map((o, i) => (
            // The unclipped wrapper is observed; a fully clip-path'd element never counts as in view.
            <motion.div
              key={o.id}
              className={cn("relative", layout[o.layout])}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              <motion.div
                className="absolute inset-0 overflow-hidden"
                variants={{
                  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
                  show: {
                    clipPath: "inset(0% 0% 0% 0%)",
                    transition: { duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: i * 0.1 },
                  },
                }}
              >
                <Link href={o.href} className="group/oc absolute inset-0 block">
                  <motion.div
                    className="absolute inset-0"
                    variants={{
                      hidden: { scale: 1.25 },
                      show: { scale: 1, transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 } },
                    }}
                  >
                    <Image
                      src={o.image}
                      alt={o.alt}
                      fill
                      sizes={sizes[o.layout]}
                      className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover/oc:scale-[1.07]"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-linear-to-t from-maroon-950/85 via-maroon-950/15 to-transparent transition-opacity duration-500 group-hover/oc:opacity-90" />
                  <div className="absolute inset-3 border border-gold-300/0 transition-colors duration-700 group-hover/oc:border-gold-300/50 sm:inset-4" />
  
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6 lg:p-8">
                    <div className="transition-transform duration-500 ease-[var(--ease-silk)] group-hover/oc:-translate-y-1">
                      <p className="eyebrow text-[0.6rem] text-gold-300">{String(i + 1).padStart(2, "0")} · Occasion</p>
                      <h3
                        className={cn(
                          "mt-2 font-display leading-tight text-ivory-50",
                          o.layout === "feature" ? "text-3xl sm:text-[2.6rem]" : o.layout === "wide" ? "text-2xl sm:text-3xl" : "text-xl sm:text-3xl",
                        )}
                      >
                        {o.title}
                      </h3>
                      <p className="mt-1 hidden text-sm text-ivory-100/75 sm:block">{o.copy}</p>
                    </div>
                    <span
                      className={cn(
                        "h-11 w-11 shrink-0 place-items-center rounded-full border border-gold-300/50 text-gold-200 transition-all duration-500 group-hover/oc:rotate-45 group-hover/oc:bg-gold-400 group-hover/oc:text-maroon-950",
                        o.layout === "tile" ? "hidden sm:grid" : "grid",
                      )}
                    >
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                    </span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

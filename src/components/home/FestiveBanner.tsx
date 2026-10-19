"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { FrameCorners, LotusMark } from "@/components/ui/Ornaments";
import { MaskLines, Reveal } from "@/components/ui/Reveal";
import { RotatingSeal } from "@/components/ui/RotatingSeal";

export function FestiveBanner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.08, 1.18]);
  const cardY = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -40]);

  return (
    <section
      ref={ref}
      aria-labelledby="festive-title"
      className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-maroon-950 py-24 sm:min-h-[680px] lg:min-h-[78vh]"
    >
      <motion.div className="absolute inset-0 -z-10" style={{ y, scale }}>
        <Image
          src="/images/banners/festive-edit.jpg"
          alt="Folded silk sarees with gold zari beside glowing brass diyas and marigold flowers"
          fill
          sizes="100vw"
          quality={85}
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_50%_50%,rgb(23_3_4/0.82),rgb(23_3_4/0.45)_70%,rgb(23_3_4/0.75))]" />

      <div className="container-x relative">
        <motion.div
          style={{ y: cardY }}
          className="relative mx-auto max-w-3xl px-6 py-14 text-center text-gold-400 sm:px-14 sm:py-20"
        >
          <FrameCorners className="inset-0 text-gold-400/80" />
          <div className="absolute inset-0 -z-10 bg-maroon-950/55 backdrop-blur-[3px]" />

          <Reveal className="flex flex-col items-center gap-3">
            <LotusMark className="h-6" />
            <span className="eyebrow text-gold-300">The Festive Edit · Limited pieces</span>
          </Reveal>
          <h2 id="festive-title" className="mt-6 font-display text-h1 font-medium text-ivory-50">
            <MaskLines
              lines={[
                "Light up the season",
                <em key="e" className="text-gold-gradient font-normal">
                  in silk &amp; tissue.
                </em>,
              ]}
            />
          </h2>
          <Reveal delay={0.25}>
            <p className="mx-auto mt-6 max-w-lg leading-relaxed text-ivory-100/80">
              Jewel-toned silks and shimmering semi tissues chosen for Deepavali, poojas and every celebration in
              between — with festive savings across the edit.
            </p>
          </Reveal>
          <Reveal delay={0.4} className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/collections/festive-edit">Shop the Festive Edit</ButtonLink>
            <ButtonLink href="/collections/silk-sarees" variant="outline-light">
              Silk Sarees
            </ButtonLink>
          </Reveal>
        </motion.div>

        <RotatingSeal
          text="Festive Edit · Monaariya Vastra · 2026 · "
          className="absolute -top-16 right-2 hidden h-32 w-32 text-gold-300 md:block lg:-top-20 lg:right-10 lg:h-40 lg:w-40"
        />
      </div>
    </section>
  );
}

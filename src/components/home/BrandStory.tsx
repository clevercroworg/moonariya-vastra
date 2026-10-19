"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { story } from "@/data/home";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { RotatingSeal } from "@/components/ui/RotatingSeal";

export function BrandStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mainY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const insetY = useTransform(scrollYProgress, [0, 1], [120, -100]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  return (
    <section ref={ref} aria-labelledby="story-title" className="relative overflow-hidden bg-ivory-50 py-20 sm:py-28 lg:py-36">
      <div className="container-x grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        {/* Collage */}
        <div className="relative mx-auto w-full max-w-[520px] lg:col-span-6">
          <motion.div style={{ y: mainY }} className="relative w-[82%]">
            <span aria-hidden className="arch absolute -inset-3 border border-gold-500/45" />
            <div className="arch relative aspect-[4/5] overflow-hidden bg-maroon-900">
              <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
                <Image src={story.images.main} alt={story.images.mainAlt} fill sizes="(min-width: 1024px) 420px, 80vw" className="object-cover" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            style={{ y: insetY }}
            className="absolute right-0 bottom-[-8%] w-[46%] border-[6px] border-ivory-50 shadow-[0_30px_60px_-25px_rgb(23_3_4/0.55)] sm:border-8"
          >
            <div className="relative aspect-square overflow-hidden bg-maroon-900">
              <Image src={story.images.inset} alt={story.images.insetAlt} fill sizes="(min-width: 1024px) 240px, 45vw" className="object-cover" />
            </div>
          </motion.div>

          <RotatingSeal
            text="Timeless Drapes · Modern Grace · "
            className="absolute -top-6 right-[8%] h-28 w-28 text-gold-600 sm:h-36 sm:w-36"
          />
        </div>

        {/* Copy */}
        <div className="lg:col-span-6 lg:col-start-7 xl:pl-6">
          <SectionHeading id="story-title" align="left" eyebrow={story.eyebrow} title={story.title as [string, string]} />
          {story.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.15 + i * 0.1}>
              <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-ink-700">{p}</p>
            </Reveal>
          ))}

          <ul className="mt-10 space-y-0 border-t border-ivory-200">
            {story.promises.map((item, i) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
                className="group/pr flex items-baseline gap-5 border-b border-ivory-200 py-5"
              >
                <span className="font-display text-2xl text-gold-600 italic">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-display text-[1.45rem] leading-tight text-maroon-950 transition-transform duration-500 group-hover/pr:translate-x-1">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[0.95rem] text-ink-500">{item.copy}</p>
                </div>
              </motion.li>
            ))}
          </ul>

          <Reveal delay={0.2} className="mt-10">
            <ButtonLink href="/about" variant="solid-dark">
              Read our story
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

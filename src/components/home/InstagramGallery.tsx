"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { instagramPosts } from "@/data/home";
import { site } from "@/data/site";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function InstagramGallery() {
  const href = site.social.instagram || "/contact";
  const external = href.startsWith("http");
  const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <section aria-labelledby="insta-title" className="relative bg-ivory-50 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          id="insta-title"
          eyebrow={site.instagramHandle}
          title={["Draped in", "Monaariya."]}
          intro="New arrivals, styling ideas and the stories behind every weave — follow along and tag us in your drape."
        />

        <ul className="mt-12 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
          {instagramPosts.map((post, i) => (
            <motion.li
              key={post.image}
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (i % 6) * 0.07 }}
              className={i % 2 === 1 ? "lg:mt-10" : undefined}
            >
              <a
                href={href}
                {...linkProps}
                aria-label={`${post.alt} — view on Instagram`}
                className="group/ig relative block aspect-square overflow-hidden bg-ivory-200"
              >
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  sizes="(min-width: 1024px) 16vw, 33vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-silk)] group-hover/ig:scale-110"
                />
                <span className="absolute inset-0 grid place-items-center bg-maroon-950/0 transition-colors duration-500 group-hover/ig:bg-maroon-950/55">
                  <InstagramIcon className="h-7 w-7 scale-75 text-gold-200 opacity-0 transition-all duration-500 group-hover/ig:scale-100 group-hover/ig:opacity-100" />
                </span>
              </a>
            </motion.li>
          ))}
        </ul>

        <div className="mt-16 flex justify-center lg:mt-20">
          <a
            href={href}
            {...linkProps}
            className="group/f inline-flex h-12 items-center gap-3 rounded-full border border-maroon-950/70 px-7 text-[0.78rem] font-medium tracking-[0.2em] text-maroon-950 uppercase transition-colors duration-300 hover:bg-maroon-950 hover:text-gold-300"
          >
            <InstagramIcon className="h-[18px] w-[18px]" />
            Follow {site.instagramHandle}
          </a>
        </div>
      </div>
    </section>
  );
}

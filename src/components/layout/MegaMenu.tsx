"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { discoverLinks, fabricLinks, occasionLinks, styleLinks, type NavLink } from "@/data/site";
import { LotusMark } from "@/components/ui/Ornaments";

const features = [
  {
    eyebrow: "Just arrived",
    title: "Semi Tissue Silk",
    href: "/collections/tissue-sarees",
    image: "/images/products/violet-semi-tissue-silk-saree-detail.jpg",
    alt: "Violet semi tissue silk saree with geometric gold zari",
  },
  {
    eyebrow: "Everyday edit",
    title: "Cotton Blend",
    href: "/collections/cotton-sarees",
    image: "/images/products/teal-green-cotton-blend-saree-detail.jpg",
    alt: "Teal cotton blend saree with a printed floral border",
  },
];

function Column({ title, links, onNavigate }: { title: string; links: NavLink[]; onNavigate: () => void }) {
  return (
    <div>
      <p className="eyebrow mb-5 text-gold-400">{title}</p>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              onClick={onNavigate}
              className="group/ml inline-flex items-center gap-2 font-display text-[1.2rem] leading-tight text-ivory-100/85 transition-colors hover:text-gold-300"
            >
              <span className="h-px w-0 bg-gold-400 transition-all duration-300 group-hover/ml:w-4" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MegaMenu({
  id,
  onNavigate,
  onMouseEnter,
  onMouseLeave,
}: {
  id: string;
  onNavigate: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute inset-x-0 top-full hidden border-t border-gold-400/15 bg-maroon-950 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] lg:block"
    >
      <div className="bg-lattice">
        <div className="container-x grid grid-cols-12 gap-10 py-12">
          <div className="col-span-3">
            <Column title="Shop by Fabric" links={fabricLinks} onNavigate={onNavigate} />
          </div>
          <div className="col-span-2 space-y-10">
            <Column title="By Style" links={styleLinks} onNavigate={onNavigate} />
            <Column title="By Occasion" links={occasionLinks} onNavigate={onNavigate} />
          </div>
          <div className="col-span-2">
            <Column title="Discover" links={discoverLinks} onNavigate={onNavigate} />
          </div>
          <div className="col-span-5 grid grid-cols-2 gap-5">
            {features.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                onClick={onNavigate}
                className="group/fc relative block aspect-[4/5] overflow-hidden"
              >
                <Image
                  src={f.image}
                  alt={f.alt}
                  fill
                  sizes="220px"
                  className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-silk)] group-hover/fc:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-maroon-950/95 via-maroon-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <LotusMark className="mb-2 h-4 text-gold-400" />
                  <p className="eyebrow text-gold-300">{f.eyebrow}</p>
                  <p className="mt-1 font-display text-2xl text-ivory-50">{f.title}</p>
                </div>
                <div className="absolute inset-3 border border-gold-300/0 transition-colors duration-500 group-hover/fc:border-gold-300/40" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="hairline-gold h-px w-full opacity-60" />
    </motion.div>
  );
}

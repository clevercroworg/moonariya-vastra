"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { discoverLinks, fabricLinks, occasionLinks, site, styleLinks, type NavLink } from "@/data/site";
import { useScrollLock } from "@/components/providers/SmoothScroll";
import { SocialLinks } from "./SocialLinks";

const groups: { title: string; links: NavLink[] }[] = [
  { title: "Shop by Fabric", links: fabricLinks },
  { title: "Style & Occasion", links: [...styleLinks, ...occasionLinks] },
  { title: "Discover", links: discoverLinks },
];

const simple: NavLink[] = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Festive Edit", href: "/collections/festive-edit" },
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function MobileMenu({ onClose }: { onClose: () => void }) {
  const [openGroup, setOpenGroup] = useState<string | null>("Shop by Fabric");
  const closeRef = useRef<HTMLButtonElement>(null);
  useScrollLock(true);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <motion.button
        type="button"
        aria-label="Close menu"
        tabIndex={-1}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
      />
      <motion.nav
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-y-0 left-0 flex w-[88vw] max-w-sm flex-col bg-maroon-950 text-ivory-50"
        data-lenis-prevent
      >
        <div className="flex items-center justify-between border-b border-gold-400/15 px-5 py-4">
          <Image src="/brand/logo-nav.png" alt={site.name} width={934} height={271} className="h-11 w-auto" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-gold-400/30 text-gold-300"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="bg-lattice flex-1 overflow-y-auto px-5 py-4">
          {groups.map((g) => {
            const open = openGroup === g.title;
            return (
              <div key={g.title} className="border-b border-gold-400/10">
                <button
                  type="button"
                  onClick={() => setOpenGroup(open ? null : g.title)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between py-4 text-left font-display text-2xl text-ivory-50"
                >
                  {g.title}
                  {open ? (
                    <Minus className="h-4 w-4 text-gold-400" aria-hidden />
                  ) : (
                    <Plus className="h-4 w-4 text-gold-400" aria-hidden />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      {g.links.map((l) => (
                        <li key={l.href}>
                          <Link
                            href={l.href}
                            onClick={onClose}
                            className="block py-2.5 pl-3 text-[0.95rem] text-ivory-100/80 transition-colors hover:text-gold-300"
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                      <li className="h-3" />
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <ul className="mt-4 space-y-1">
            {simple.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={onClose}
                  className="eyebrow block py-3 text-gold-300 transition-colors hover:text-gold-200"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gold-400/15 px-5 py-5">
          <p className="text-sm text-ivory-100/60">{site.tagline}</p>
          <SocialLinks className="mt-3" />
        </div>
      </motion.nav>
    </div>
  );
}

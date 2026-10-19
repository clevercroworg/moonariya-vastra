"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { primaryNav, site } from "@/data/site";
import { cn } from "@/lib/utils";
import { useStore } from "@/components/providers/StoreProvider";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";

const MEGA_ID = "mega-menu-shop";

function IconButton({
  label,
  count,
  children,
  href,
  onClick,
  className,
}: {
  label: string;
  count?: number;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const inner = (
    <>
      {children}
      <AnimatePresence>
        {!!count && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            className="absolute top-1 right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold-gradient px-1 text-[10px] font-semibold text-maroon-950"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
  const cls = cn(
    "relative grid h-11 w-11 place-items-center rounded-full text-gold-300 transition-colors duration-300 hover:bg-gold-400/10 hover:text-gold-200",
    className,
  );
  const aria = count ? `${label} (${count})` : label;
  return href ? (
    <Link href={href} aria-label={aria} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" aria-label={aria} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function Header() {
  const { bag, wishlist } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  const openMega = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }, []);
  const closeMegaSoon = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 140);
  }, []);
  const closeMega = useCallback(() => setMegaOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMegaOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  const leftNav = primaryNav.slice(0, 4);
  const rightNav = primaryNav.slice(4);
  // Progressive disclosure so the centred logo never collides with the links.
  const leftVisibility = ["", "", "hidden xl:block", "hidden min-[1400px]:block"];

  return (
    <>
      {/* Fixed-height sticky slot: the bar shrinks visually on scroll without
          moving the page (no layout shift, no scroll-anchoring jumps). */}
      <div className="pointer-events-none sticky top-0 z-40 h-[73px] lg:h-[97px]">
        <header
          className={cn(
            "pointer-events-auto relative bg-maroon-950 text-gold-300 transition-shadow duration-500",
            scrolled && "shadow-[0_12px_40px_-12px_rgb(0_0_0/0.65)]",
          )}
        >
          <div
            className={cn(
              "container-x grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-500 ease-[var(--ease-silk)]",
              scrolled ? "h-[68px] lg:h-[76px]" : "h-[72px] lg:h-[96px]",
            )}
          >
            {/* Left */}
            <div className="flex items-center gap-1">
              <IconButton label="Open menu" onClick={() => setMenuOpen(true)} className="lg:hidden">
                <Menu className="h-[22px] w-[22px]" strokeWidth={1.4} />
              </IconButton>
              <IconButton label="Search" onClick={() => setSearchOpen(true)} className="lg:hidden">
                <Search className="h-5 w-5" strokeWidth={1.4} />
              </IconButton>

              <nav aria-label="Primary" className="hidden lg:block">
                <ul className="flex items-center gap-1 xl:gap-3">
                  {leftNav.map((item, idx) =>
                    "mega" in item && item.mega ? (
                      <li key={item.label} onMouseEnter={openMega} onMouseLeave={closeMegaSoon}>
                        <button
                          type="button"
                          aria-expanded={megaOpen}
                          aria-controls={MEGA_ID}
                          onClick={() => setMegaOpen((v) => !v)}
                          className="group/nav relative flex h-11 items-center gap-1.5 px-3 text-[0.75rem] font-medium tracking-[0.2em] uppercase transition-colors hover:text-gold-200"
                        >
                          {item.label}
                          <ChevronDown
                            className={cn("h-3.5 w-3.5 transition-transform duration-300", megaOpen && "rotate-180")}
                            strokeWidth={1.5}
                            aria-hidden
                          />
                          <span
                            className={cn(
                              "absolute right-3 bottom-1.5 left-3 h-px origin-left bg-gold-400 transition-transform duration-500 ease-[var(--ease-silk)]",
                              megaOpen ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100",
                            )}
                          />
                        </button>
                      </li>
                    ) : (
                      <li key={item.label} className={leftVisibility[idx]}>
                        <Link
                          href={item.href}
                          className="group/nav relative flex h-11 items-center px-3 text-[0.75rem] font-medium tracking-[0.2em] whitespace-nowrap uppercase transition-colors hover:text-gold-200"
                        >
                          {item.label}
                          <span className="absolute right-3 bottom-1.5 left-3 h-px origin-left scale-x-0 bg-gold-400 transition-transform duration-500 ease-[var(--ease-silk)] group-hover/nav:scale-x-100" />
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            </div>

            {/* Logo */}
            <Link href="/" aria-label={`${site.name} — home`} className="relative block">
              <Image
                src="/brand/logo-nav.png"
                alt={site.name}
                width={934}
                height={271}
                preload
                sizes="240px"
                className={cn(
                  "w-auto transition-[height] duration-500 ease-[var(--ease-silk)]",
                  scrolled ? "h-10 lg:h-[52px]" : "h-10 sm:h-12 lg:h-[68px]",
                )}
              />
            </Link>

            {/* Right */}
            <div className="flex items-center justify-end gap-0.5 sm:gap-1">
              <nav aria-label="Secondary" className="mr-2 hidden xl:block">
                {rightNav.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group/nav relative flex h-11 items-center px-3 text-[0.75rem] font-medium tracking-[0.2em] uppercase transition-colors hover:text-gold-200"
                  >
                    {item.label}
                    <span className="absolute right-3 bottom-1.5 left-3 h-px origin-left scale-x-0 bg-gold-400 transition-transform duration-500 ease-[var(--ease-silk)] group-hover/nav:scale-x-100" />
                  </Link>
                ))}
              </nav>
              <IconButton label="Search" onClick={() => setSearchOpen(true)} className="hidden lg:grid">
                <Search className="h-5 w-5" strokeWidth={1.4} />
              </IconButton>
              <IconButton label="Account" href="/account" className="hidden sm:grid">
                <User className="h-5 w-5" strokeWidth={1.4} />
              </IconButton>
              <IconButton label="Wishlist" href="/wishlist" count={wishlist.length}>
                <Heart className="h-5 w-5" strokeWidth={1.4} />
              </IconButton>
              <IconButton label="Shopping bag" href="/cart" count={bag.length}>
                <ShoppingBag className="h-5 w-5" strokeWidth={1.4} />
              </IconButton>
            </div>
          </div>

          <div className="hairline-gold h-px w-full opacity-50" />

          <AnimatePresence>
            {megaOpen && (
              <MegaMenu id={MEGA_ID} onNavigate={closeMega} onMouseEnter={openMega} onMouseLeave={closeMegaSoon} />
            )}
          </AnimatePresence>
        </header>
      </div>

      <AnimatePresence>{searchOpen && <SearchOverlay key="search" onClose={closeSearch} />}</AnimatePresence>
      <AnimatePresence>{menuOpen && <MobileMenu key="menu" onClose={closeMenu} />}</AnimatePresence>
    </>
  );
}

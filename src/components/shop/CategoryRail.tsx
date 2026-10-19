"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type RailItem = { slug: string; label: string; image: string; href: string; count: number };

/** Scrollable row of collections with round thumbnails; the active one is centred on load. */
export function CategoryRail({ items, active }: { items: RailItem[]; active: string }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = ref.current;
    const el = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !el) return;
    list.scrollLeft = el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2;
  }, [active]);

  return (
    <nav aria-label="Collections" className="border-b border-ivory-200 bg-ivory-50">
      <ul
        ref={ref}
        className="no-scrollbar container-x flex gap-5 overflow-x-auto scroll-smooth py-5 sm:gap-7"
      >
        {items.map((it) => {
          const on = it.slug === active;
          return (
            <li key={it.slug} className="shrink-0">
              <Link
                href={it.href}
                aria-current={on ? "page" : undefined}
                className="group/rail flex w-[76px] flex-col items-center gap-2 text-center"
              >
                <span
                  className={cn(
                    "relative grid h-[68px] w-[68px] place-items-center rounded-full p-[3px] transition-all duration-500",
                    on ? "bg-gold-gradient" : "bg-ivory-200 group-hover/rail:bg-gold-400/60",
                  )}
                >
                  <span className="relative h-full w-full overflow-hidden rounded-full border-2 border-ivory-50 bg-maroon-900">
                    <Image
                      src={it.image}
                      alt=""
                      fill
                      sizes="68px"
                      className="object-cover object-top transition-transform duration-700 group-hover/rail:scale-110"
                    />
                  </span>
                </span>
                <span
                  className={cn(
                    "text-[0.72rem] leading-tight font-medium tracking-[0.06em] transition-colors",
                    on ? "text-maroon-950" : "text-ink-500 group-hover/rail:text-maroon-700",
                  )}
                >
                  {it.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

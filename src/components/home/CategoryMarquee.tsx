import Link from "next/link";
import { categories, collectionHref } from "@/data/categories";
import { LotusMark } from "@/components/ui/Ornaments";

/** A woven "zari border" ribbon of every category, scrolling endlessly. */
export function CategoryMarquee() {
  const items = [...categories, ...categories];
  return (
    <section aria-label="Saree categories" className="relative overflow-hidden bg-gold-gradient text-maroon-950">
      <div className="absolute inset-x-0 top-1.5 h-px bg-maroon-950/30" />
      <div className="absolute inset-x-0 bottom-1.5 h-px bg-maroon-950/30" />
      <div className="group/mq flex w-max animate-marquee py-4 hover:[animation-play-state:paused] sm:py-5">
        {items.map((c, i) => (
          <Link
            key={`${c.slug}-${i}`}
            href={collectionHref(c.slug)}
            tabIndex={i >= categories.length ? -1 : undefined}
            aria-hidden={i >= categories.length ? true : undefined}
            className="flex items-center gap-6 px-6 font-display text-2xl whitespace-nowrap italic transition-opacity hover:opacity-70 sm:text-3xl"
          >
            {c.short}
            <LotusMark className="h-4 text-maroon-950/70 not-italic" />
          </Link>
        ))}
      </div>
    </section>
  );
}

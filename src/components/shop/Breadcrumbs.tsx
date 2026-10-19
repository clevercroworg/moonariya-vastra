import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/** Visible breadcrumb trail + BreadcrumbList structured data. */
export function Breadcrumbs({ items, tone = "dark", className }: { items: Crumb[]; tone?: "dark" | "light"; className?: string }) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: new URL(c.href, site.url).toString() } : {}),
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[0.78rem] tracking-wide">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className={cn(
                    "transition-colors",
                    tone === "light" ? "text-ivory-100/60 hover:text-gold-300" : "text-ink-500 hover:text-maroon-700",
                  )}
                >
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={tone === "light" ? "text-gold-300" : "text-maroon-950"}>
                  {c.label}
                </span>
              )}
              {!last && (
                <ChevronRight
                  aria-hidden
                  className={cn("h-3 w-3", tone === "light" ? "text-ivory-100/35" : "text-ink-500/60")}
                />
              )}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}

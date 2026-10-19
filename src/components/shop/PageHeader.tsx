import type { ReactNode } from "react";
import { LotusMark } from "@/components/ui/Ornaments";
import { Breadcrumbs } from "./Breadcrumbs";

/** Compact light header for utility pages (bag, wishlist, search). */
export function PageHeader({ title, italic, eyebrow, crumb, children }: { title: string; italic: string; eyebrow: string; crumb: string; children?: ReactNode }) {
  return (
    <section className="border-b border-ivory-200 bg-ivory-100">
      <div className="container-x py-8 sm:py-10">
        <Breadcrumbs items={[{ label: crumb }]} />
        <div className="mt-6 flex items-center gap-3 text-gold-600">
          <LotusMark className="h-5" />
          <span className="eyebrow text-gold-700">{eyebrow}</span>
        </div>
        <h1 className="mt-3 font-display text-h1 font-medium text-maroon-950">
          {title} <em className="font-normal text-gold-600">{italic}</em>
        </h1>
        {children}
      </div>
    </section>
  );
}

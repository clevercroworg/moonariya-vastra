import Image from "next/image";
import { Banknote, Truck } from "lucide-react";
import type { Collection } from "@/data/collections";
import { LotusMark } from "@/components/ui/Ornaments";
import { MaskLines, Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs } from "./Breadcrumbs";

export function CollectionHero({ collection }: { collection: Collection }) {
  const count = collection.products.length;
  return (
    <section className="relative overflow-hidden bg-maroon-950 text-ivory-50">
      <div aria-hidden className="bg-lattice absolute inset-0 opacity-80" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_70%_at_80%_40%,rgb(221_180_106/0.16),transparent_70%)]"
      />
      <div className="container-x relative grid items-center gap-10 py-10 sm:py-14 md:grid-cols-12 lg:py-16">
        <div className="md:col-span-7 lg:col-span-7">
          <Breadcrumbs
            tone="light"
            items={
              collection.slug === "all"
                ? [{ label: "Shop" }]
                : [{ label: "Shop", href: "/collections/all" }, { label: collection.name }]
            }
          />
          <Reveal className="mt-8 flex items-center gap-3 text-gold-400">
            <LotusMark className="h-5" />
            <span className="eyebrow text-gold-300">{collection.eyebrow}</span>
          </Reveal>
          <h1 className="mt-4 font-display text-h1 font-medium">
            <MaskLines
              lines={[
                collection.title[0],
                <em key="i" className="text-gold-gradient font-normal">
                  {collection.title[1]}
                </em>,
              ]}
            />
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-lg leading-relaxed text-ivory-100/75">{collection.blurb}</p>
          </Reveal>
          <Reveal delay={0.3} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ivory-100/70">
            <span className="rounded-full border border-gold-400/40 px-4 py-1.5 text-gold-200">
              {count === 0 ? "Arriving soon" : `${count} ${count === 1 ? "saree" : "sarees"}`}
            </span>
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-gold-400" strokeWidth={1.4} aria-hidden /> Free shipping across India
            </span>
            <span className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-gold-400" strokeWidth={1.4} aria-hidden /> Cash on delivery
            </span>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative mx-auto hidden w-full max-w-[300px] md:col-span-5 md:block lg:max-w-[340px]">
          <span aria-hidden className="arch absolute -inset-3 border border-gold-400/50" />
          <span aria-hidden className="arch absolute -inset-6 border border-gold-400/20" />
          <div className="arch relative aspect-[4/5] overflow-hidden bg-maroon-900">
            <Image
              src={collection.image}
              alt={collection.imageAlt}
              fill
              preload
              sizes="340px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-maroon-950/50 to-transparent" />
          </div>
        </Reveal>
      </div>
      <div className="hairline-gold h-px w-full opacity-50" />
    </section>
  );
}

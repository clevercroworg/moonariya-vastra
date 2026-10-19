import Image from "next/image";
import { Droplets, Feather, Sparkles, Waves } from "lucide-react";
import type { Fabric } from "@/data/home";
import { Reveal } from "@/components/ui/Reveal";

/** "Know the fabric" band shown under fabric collections. */
export function FabricNote({ fabric }: { fabric: Fabric }) {
  const rows = [
    { Icon: Feather, label: "Feels like", value: fabric.feel },
    { Icon: Sparkles, label: "Best for", value: fabric.bestFor },
    { Icon: Waves, label: "The drape", value: fabric.drape },
    { Icon: Droplets, label: "Care", value: fabric.care },
  ];
  return (
    <section aria-labelledby="fabric-note" className="bg-ivory-100 py-16 sm:py-20">
      <div className="container-x grid items-center gap-10 md:grid-cols-12">
        <Reveal className="relative mx-auto w-full max-w-[300px] md:col-span-4">
          <span aria-hidden className="arch absolute -inset-3 border border-gold-500/45" />
          <div className="arch relative aspect-[4/5] overflow-hidden bg-maroon-900">
            <Image src={fabric.image} alt={fabric.alt} fill sizes="300px" className="object-cover" />
          </div>
        </Reveal>
        <div className="md:col-span-8 md:pl-6">
          <Reveal>
            <p className="eyebrow text-gold-700">Know the fabric</p>
            <h2 id="fabric-note" className="mt-3 font-display text-h2 text-maroon-950">
              {fabric.name}, <em className="text-gold-600">{fabric.tagline.toLowerCase()}.</em>
            </h2>
          </Reveal>
          <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {rows.map(({ Icon, label, value }, i) => (
              <Reveal key={label} delay={0.08 * i} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold-500/40 text-gold-700">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.4} aria-hidden />
                </span>
                <div>
                  <dt className="eyebrow text-[0.62rem] text-ink-500">{label}</dt>
                  <dd className="mt-1 text-ink-900">{value}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

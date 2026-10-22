import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/data/collections";
import { ButtonLink } from "@/components/ui/Button";
import { FlourishRule } from "@/components/ui/Ornaments";
import { getSettings } from "@/lib/catalog";
import { whatsappLink } from "@/lib/settings-defaults";

/** Shown while a category is still being stocked — never a blank grid. */
export async function EmptyCollection({ collection, suggestions }: { collection: Collection; suggestions: Collection[] }) {
  const { contact } = await getSettings();
  const whatsappHref = whatsappLink(contact.whatsapp, `Hi Monaariya Vastra! I'm looking for ${collection.name.toLowerCase()}.`);
  const external = whatsappHref.startsWith("http");
  return (
    <section className="container-x py-16 sm:py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="eyebrow text-gold-700">On the loom</p>
        <h2 className="mt-4 font-display text-h2 text-maroon-950">
          New {collection.name.toLowerCase()} are <em className="text-gold-600">being curated.</em>
        </h2>
        <FlourishRule className="mt-5 text-gold-500" />
        <p className="mt-5 leading-relaxed text-ink-700">
          We&rsquo;re hand-picking the first pieces for this collection. Message us and we&rsquo;ll share the latest
          designs with you before they go live.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={whatsappHref} variant="solid-dark" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            Ask on WhatsApp
          </ButtonLink>
          <ButtonLink href="/collections/all" variant="outline-dark">
            Shop all sarees
          </ButtonLink>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-16">
          <p className="eyebrow text-center text-ink-500">Available now</p>
          <ul className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {suggestions.map((s) => (
              <li key={s.slug}>
                <Link href={`/collections/${s.slug}`} className="group/sg block text-center">
                  <span className="arch relative block aspect-[3/4] overflow-hidden bg-maroon-900">
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 220px, 45vw"
                      className="object-cover transition-transform duration-700 group-hover/sg:scale-105"
                    />
                  </span>
                  <span className="mt-3 block font-display text-xl text-maroon-950">{s.name}</span>
                  <span className="text-xs text-ink-500">
                    {s.products.length} {s.products.length === 1 ? "saree" : "sarees"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

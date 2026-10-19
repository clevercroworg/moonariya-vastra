import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { FlourishRule } from "@/components/ui/Ornaments";

type Props = { title?: string; missing?: boolean };

/** Branded placeholder for inner pages that are not built yet (and for 404s). */
export function ComingSoon({ title, missing = false }: Props) {
  return (
    <section className="relative flex min-h-[72vh] items-center overflow-hidden bg-maroon-950 py-24 text-center text-ivory-50">
      <div aria-hidden className="bg-lattice absolute inset-0" />
      <div className="container-x relative flex flex-col items-center">
        <Image src="/brand/emblem.png" alt="" width={292} height={271} className="h-24 w-auto sm:h-28" />
        <p className="eyebrow mt-8 text-gold-300">{missing ? "Page not found" : title ? `${title} · On the loom` : "On the loom"}</p>
        <h1 className="mt-4 font-display text-h1 font-medium">
          {missing ? "This thread" : "This page is still"}
          <br />
          <em className="text-gold-gradient font-normal">{missing ? "seems to have slipped." : "being woven."}</em>
        </h1>
        <FlourishRule className="mt-6 text-gold-400" />
        <p className="mt-6 max-w-md leading-relaxed text-ivory-100/75">
          {missing
            ? "We couldn’t find the page you were looking for. Let’s take you back to the collection."
            : "We’re putting the finishing touches on this part of Monaariya Vastra. In the meantime, explore the collection from our homepage."}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/#fabric-guide" variant="outline-light">
            Fabric guide
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

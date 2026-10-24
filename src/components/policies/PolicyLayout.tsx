import Link from "next/link";
import type { ReactNode } from "react";
import { FlourishRule } from "@/components/ui/Ornaments";
import { site } from "@/data/site";
import { getSettings } from "@/lib/catalog";
import { whatsappLink } from "@/lib/settings-defaults";
import { cn } from "@/lib/utils";

export const LAST_UPDATED = "24 October 2026";

export const policies = [
  { href: "/policies/privacy", label: "Privacy Policy" },
  { href: "/policies/terms", label: "Terms & Conditions" },
  { href: "/policies/refund", label: "Cancellation & Refund Policy" },
  { href: "/policies/shipping", label: "Shipping & Delivery Policy" },
] as const;

/** Maroon page header shared by the policy and contact pages. */
export function PageHero({ eyebrow, title, intro, meta }: { eyebrow: string; title: string; intro: string; meta?: string }) {
  return (
    <section className="relative overflow-hidden bg-maroon-950 pt-16 pb-14 text-center text-ivory-50 sm:pt-20 sm:pb-16">
      <div aria-hidden className="bg-lattice absolute inset-0" />
      <div className="container-x relative flex flex-col items-center">
        <p className="eyebrow text-gold-300">{eyebrow}</p>
        <h1 className="mt-4 font-display text-h1 font-medium">{title}</h1>
        <FlourishRule className="mt-5 text-gold-400" />
        <p className="mt-5 max-w-2xl leading-relaxed text-ivory-100/75">{intro}</p>
        {meta && <p className="mt-4 text-xs tracking-[0.2em] text-gold-300/80 uppercase">{meta}</p>}
      </div>
    </section>
  );
}

/** Business identity block — Razorpay reviewers look for the name, address, email and phone. */
export async function BusinessDetails({ className }: { className?: string }) {
  const { contact } = await getSettings();
  const rows = [
    ["Business name", site.name],
    ["Address", contact.address],
    ["Email", contact.email],
    ["Phone", contact.phone],
    ["WhatsApp", contact.whatsapp ? `+${contact.whatsapp}` : ""],
    ["Hours", contact.hours],
    ["Website", site.url.replace(/^https?:\/\//, "")],
  ].filter(([, v]) => v);
  return (
    <dl className={cn("grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[140px_1fr]", className)}>
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="font-medium text-ink-900">{k}</dt>
          <dd className="whitespace-pre-line text-ink-700 max-sm:mb-2">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PolicySection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-ivory-200 pt-8 first:border-0 first:pt-0">
      <h2 className="font-display text-[1.75rem] leading-tight text-maroon-950">{title}</h2>
      <div className="mt-3 space-y-4 leading-relaxed text-ink-700 [&_a]:text-maroon-700 [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-1 [&_strong]:font-medium [&_strong]:text-ink-900 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

export async function PolicyLayout({
  current,
  title,
  intro,
  children,
}: {
  current: (typeof policies)[number]["href"];
  title: string;
  intro: string;
  children: ReactNode;
}) {
  const { contact } = await getSettings();
  return (
    <>
      <PageHero eyebrow="Policies" title={title} intro={intro} meta={`Last updated · ${LAST_UPDATED}`} />
      <div className="container-x grid gap-10 py-14 sm:py-20 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav aria-label="Policies" className="rounded-xl border border-ivory-200 bg-white p-2">
            {policies.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                aria-current={p.href === current ? "page" : undefined}
                className={cn(
                  "block rounded-lg px-4 py-3 text-sm transition-colors",
                  p.href === current ? "bg-maroon-950 text-gold-200" : "text-ink-700 hover:bg-ivory-100 hover:text-maroon-950",
                )}
              >
                {p.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 rounded-xl border border-ivory-200 bg-ivory-50 p-5 text-sm">
            <p className="font-display text-lg text-maroon-950">Questions?</p>
            <p className="mt-1 text-ink-500">We’re happy to help with any order or policy.</p>
            <div className="mt-3 flex flex-col gap-1.5">
              {contact.whatsapp && (
                <a href={whatsappLink(contact.whatsapp, "Hello Monaariya Vastra, I have a question.")} className="text-maroon-700 hover:underline">
                  Chat on WhatsApp
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="text-maroon-700 hover:underline">
                  {contact.email}
                </a>
              )}
              <Link href="/contact" className="text-maroon-700 hover:underline">
                All contact details
              </Link>
            </div>
          </div>
        </aside>
        <article className="max-w-3xl space-y-10">{children}</article>
      </div>
    </>
  );
}

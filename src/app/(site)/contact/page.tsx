import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BusinessDetails, PageHero, policies } from "@/components/policies/PolicyLayout";
import { getSettings } from "@/lib/catalog";
import { whatsappLink } from "@/lib/settings-defaults";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Reach Monaariya Vastra on WhatsApp, phone or email for orders, sarees and support.",
};

export default async function ContactPage() {
  const { contact } = await getSettings();
  const cards = [
    contact.whatsapp && {
      Icon: MessageCircle,
      title: "WhatsApp",
      text: "The quickest way to ask about a saree, place an order or check on a delivery.",
      cta: "Chat with us",
      href: whatsappLink(contact.whatsapp, "Hello Monaariya Vastra, I would like to know more."),
    },
    contact.phone && {
      Icon: Phone,
      title: "Call us",
      text: contact.phone,
      cta: "Call now",
      href: `tel:${contact.phone.replace(/[^\d+]/g, "")}`,
    },
    contact.email && {
      Icon: Mail,
      title: "Email",
      text: contact.email,
      cta: "Send an email",
      href: `mailto:${contact.email}`,
    },
    contact.address && {
      Icon: MapPin,
      title: "Visit us",
      text: contact.address,
      cta: "Get directions",
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`,
    },
  ].filter(Boolean) as { Icon: typeof Phone; title: string; text: string; cta: string; href: string }[];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We’d love to hear from you"
        intro="Questions about a saree, an order or a delivery? Reach us on WhatsApp, phone or email — we usually reply within a few hours."
      />

      <div className="container-x py-14 sm:py-20">
        {cards.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ Icon, title, text, cta, href }) => (
              <a
                key={title}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex flex-col rounded-xl border border-ivory-200 bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-maroon-950 text-gold-300">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h2 className="mt-5 font-display text-2xl text-maroon-950">{title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed whitespace-pre-line break-words text-ink-700">{text}</p>
                <span className="mt-5 text-sm font-medium text-maroon-700 group-hover:underline">{cta} →</span>
              </a>
            ))}
          </div>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section className="rounded-xl border border-ivory-200 bg-white p-6 sm:p-8">
            <h2 className="font-display text-[1.75rem] text-maroon-950">Business details</h2>
            <BusinessDetails className="mt-5" />
            {contact.hours && (
              <p className="mt-6 flex items-center gap-2 text-sm text-ink-500">
                <Clock className="h-4 w-4" /> We respond to messages during {contact.hours}.
              </p>
            )}
          </section>
          <section className="rounded-xl border border-ivory-200 bg-ivory-50 p-6 sm:p-8">
            <h2 className="font-display text-[1.75rem] text-maroon-950">Orders &amp; policies</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              Everything you need to know about payments, delivery, cancellations and refunds.
            </p>
            <ul className="mt-5 divide-y divide-ivory-200 border-y border-ivory-200">
              {policies.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="flex items-center justify-between py-3 text-sm text-ink-900 hover:text-maroon-700">
                    {p.label} <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

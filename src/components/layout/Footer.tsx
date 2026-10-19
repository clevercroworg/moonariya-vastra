import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { footerColumns, paymentMethods, site } from "@/data/site";
import { FlourishRule } from "@/components/ui/Ornaments";
import { CurrentYear } from "./CurrentYear";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const { contact } = site;
  const contactRows = [
    { Icon: Phone, label: contact.phone || "Phone number coming soon", href: contact.phone ? `tel:${contact.phone.replace(/\s/g, "")}` : undefined },
    { Icon: Mail, label: contact.email || "Email coming soon", href: contact.email ? `mailto:${contact.email}` : undefined },
    { Icon: MapPin, label: contact.address || "Store address coming soon" },
    { Icon: Clock, label: contact.hours || "Store hours coming soon" },
  ];

  return (
    <footer className="relative overflow-hidden bg-maroon-950 text-ivory-100" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="hairline-gold h-px w-full opacity-60" />
      <div className="bg-lattice">
        {/* Brand row */}
        <div className="container-x flex flex-col items-center pt-16 pb-12 text-center sm:pt-20">
          <Image
            src="/brand/logo-full.png"
            alt={`${site.name} — ${site.tagline}`}
            width={934}
            height={271}
            sizes="(min-width: 640px) 360px, 280px"
            className="h-auto w-[280px] sm:w-[360px]"
          />
          <p className="mt-6 max-w-2xl text-[0.98rem] leading-relaxed text-ivory-100/70">
            Celebrating the timeless elegance of Indian textiles. We curate sarees with rich designs,
            quality fabrics and fine craftsmanship for every occasion — and every day in between.
          </p>
          <FlourishRule className="mt-8 text-gold-400" />
        </div>

        {/* Columns */}
        <div className="container-x grid grid-cols-2 gap-x-6 gap-y-12 pb-14 md:grid-cols-4 lg:grid-cols-12">
          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="lg:col-span-2">
              <p className="eyebrow mb-5 text-gold-400">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[0.95rem] text-ivory-100/70 transition-colors duration-300 hover:text-gold-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 md:col-span-1 lg:col-span-3 lg:col-start-8">
            <p className="eyebrow mb-5 text-gold-400">Get in touch</p>
            <ul className="space-y-4">
              {contactRows.map(({ Icon, label, href }) => (
                <li key={label} className="flex gap-3 text-[0.95rem] text-ivory-100/70">
                  <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold-400" strokeWidth={1.4} aria-hidden />
                  {href ? (
                    <a href={href} className="transition-colors hover:text-gold-300">
                      {label}
                    </a>
                  ) : (
                    <span>{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <p className="eyebrow mb-5 text-gold-400">Follow us</p>
            <SocialLinks className="flex-wrap" />
            <p className="mt-5 text-sm text-ivory-100/55">{site.instagramHandle}</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gold-400/15">
          <div className="container-x flex flex-col items-center justify-between gap-5 pt-6 pb-24 text-center md:flex-row md:pb-6 md:text-left lg:pr-24">
            <p className="text-[0.8rem] text-ivory-100/55">
              © <CurrentYear /> {site.name}. All rights reserved. Designed for elegance.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="eyebrow mr-1 text-[0.62rem] text-ivory-100/50">100% secure payment</span>
              {paymentMethods.map((m) => (
                <span
                  key={m}
                  className="rounded-sm border border-gold-400/25 px-2.5 py-1 text-[0.68rem] font-medium tracking-[0.12em] text-gold-300 uppercase"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

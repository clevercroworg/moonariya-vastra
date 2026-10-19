import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YoutubeIcon } from "@/components/ui/BrandIcons";

// Falls back to the contact page until the client shares real profile links.
const fallback = "/contact";

export const whatsappHref = site.contact.whatsapp
  ? `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent("Hi Monaariya Vastra! I'd like to know more about your sarees.")}`
  : fallback;

export function SocialLinks({ className }: { className?: string }) {
  const items = [
    { label: "Instagram", href: site.social.instagram || fallback, Icon: InstagramIcon },
    { label: "Facebook", href: site.social.facebook || fallback, Icon: FacebookIcon },
    { label: "YouTube", href: site.social.youtube || fallback, Icon: YoutubeIcon },
    { label: "WhatsApp", href: whatsappHref, Icon: WhatsAppIcon },
  ];
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {items.map(({ label, href, Icon }) => {
        const external = href.startsWith("http");
        return (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="grid h-11 w-11 place-items-center rounded-full border border-gold-400/25 text-gold-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:bg-gold-400/10"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

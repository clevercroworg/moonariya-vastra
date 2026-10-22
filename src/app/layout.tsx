import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { site } from "@/data/site";
import { introScript } from "@/components/layout/IntroCurtain";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "sarees",
    "silk sarees",
    "cotton sarees",
    "semi silk saree",
    "tussar saree",
    "windy crush saree",
    "organza sarees",
    "georgette sarees",
    "handloom sarees",
    "party wear sarees",
    "Monaariya Vastra",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#170304",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen">
        <Script id="intro-curtain" strategy="beforeInteractive">
          {introScript}
        </Script>
        <a
          href="#main"
          className="sr-only z-[200] rounded-full bg-gold-400 px-5 py-3 text-sm font-medium text-maroon-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

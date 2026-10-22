import { getCatalog, getSettings } from "@/lib/catalog";
import { toSummary } from "@/lib/types";
import { SiteDataProvider } from "@/components/providers/SiteDataProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { IntroCurtain } from "@/components/layout/IntroCurtain";

// Storefront chrome. Catalogue and settings come from the database through
// cached functions, refreshed whenever the admin saves a change.
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [{ products, categories }, settings] = await Promise.all([getCatalog(), getSettings()]);
  return (
    <SiteDataProvider value={{ products: products.map(toSummary), categories, settings }}>
      <IntroCurtain />
      <SmoothScroll>
        <StoreProvider>
          <AnnouncementBar />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppButton />
        </StoreProvider>
      </SmoothScroll>
    </SiteDataProvider>
  );
}

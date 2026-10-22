"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Category, ProductSummary, SiteSettings } from "@/lib/types";
import { whatsappLink } from "@/lib/settings-defaults";

type SiteData = { products: ProductSummary[]; categories: Category[]; settings: SiteSettings };

const SiteDataContext = createContext<SiteData | null>(null);

/** Catalogue + settings loaded once by the shop layout (from the database, cached). */
export function SiteDataProvider({ value, children }: { value: SiteData; children: ReactNode }) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData must be used inside <SiteDataProvider>");
  return ctx;
}

export const useCatalog = () => {
  const { products, categories } = useSiteData();
  return { products, categories };
};

export const useSiteSettings = () => useSiteData().settings;

export function useWhatsApp(message = "Hi Monaariya Vastra! I'd like to know more about your sarees.") {
  return whatsappLink(useSiteSettings().contact.whatsapp, message);
}

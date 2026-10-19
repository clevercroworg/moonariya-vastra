import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { ComingSoon } from "@/components/layout/ComingSoon";

// Temporary: every inner page linked from the homepage renders a branded
// "coming soon" screen until it is built. Delete each path from this list as
// the real route (e.g. app/collections/[slug]/page.tsx) is added.
const planned: Record<string, string> = {
  ...Object.fromEntries(categories.map((c) => [`collections/${c.slug}`, c.name])),
  "collections/new-arrivals": "New Arrivals",
  "collections/festive-edit": "The Festive Edit",
  "collections/all": "All Sarees",
  ...Object.fromEntries(products.map((p) => [`products/${p.slug}`, p.name])),
  about: "Our Story",
  contact: "Contact",
  faqs: "FAQs",
  "track-order": "Track Your Order",
  cart: "Shopping Bag",
  wishlist: "Wishlist",
  account: "Account",
  search: "Search",
  "policies/shipping": "Shipping Policy",
  "policies/returns": "Returns & Exchanges",
  "policies/privacy": "Privacy Policy",
  "policies/terms": "Terms of Service",
};

export function generateStaticParams() {
  return Object.keys(planned).map((path) => ({ slug: path.split("/") }));
}

export async function generateMetadata({ params }: PageProps<"/[...slug]">): Promise<Metadata> {
  const { slug } = await params;
  const title = planned[slug.join("/")];
  return title ? { title, robots: { index: false } } : {};
}

export default async function PlannedPage({ params }: PageProps<"/[...slug]">) {
  const { slug } = await params;
  const title = planned[slug.join("/")];
  if (!title) notFound();
  return <ComingSoon title={title} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { PlainSkeleton } from "@/components/shop/Skeletons";

// Temporary: inner pages that are linked but not built yet render a branded
// "coming soon" screen. Delete each path from this list as its real route is added.
const planned: Record<string, string> = {
  about: "Our Story",
  contact: "Contact",
  faqs: "FAQs",
  "track-order": "Track Your Order",
  checkout: "Checkout",
  account: "Account",
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

export default function PlannedPage({ params }: PageProps<"/[...slug]">) {
  return (
    <Suspense fallback={<PlainSkeleton />}>
      <PlannedContent params={params} />
    </Suspense>
  );
}

async function PlannedContent({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const title = planned[slug.join("/")];
  if (!title) notFound();
  return <ComingSoon title={title} />;
}

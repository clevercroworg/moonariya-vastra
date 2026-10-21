import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { collections, getCollection } from "@/data/collections";
import { fabrics } from "@/data/home";
import { CollectionHero } from "@/components/shop/CollectionHero";
import { CategoryRail, type RailItem } from "@/components/shop/CategoryRail";
import { CollectionView } from "@/components/shop/CollectionView";
import { EmptyCollection } from "@/components/shop/EmptyCollection";
import { FabricNote } from "@/components/shop/FabricNote";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CollectionSkeleton } from "@/components/shop/Skeletons";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return {};
  return {
    title: c.name,
    description: c.blurb,
    alternates: { canonical: `/collections/${c.slug}` },
    openGraph: { title: c.name, description: c.blurb, images: [{ url: c.image }] },
  };
}

const rail: RailItem[] = collections.map((c) => ({
  slug: c.slug,
  label: c.slug === "all" ? "All" : c.name.replace(/ Sarees$/, "").replace(/^The /, ""),
  image: c.image,
  href: `/collections/${c.slug}`,
  count: c.products.length,
}));

// The URL-dependent part streams inside <Suspense> so client navigations show the
// skeleton instantly; every known slug is still fully prerendered at build time.
export default function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  return (
    <Suspense fallback={<CollectionSkeleton />}>
      <CollectionContent params={params} />
    </Suspense>
  );
}

async function CollectionContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const fabric = fabrics.find((f) => f.id === collection.fabricId);
  const suggestions = collections.filter((c) => c.slug !== "all" && c.slug !== collection.slug && c.products.length > 0).slice(0, 4);

  return (
    <>
      <CollectionHero collection={collection} />
      <CategoryRail items={rail} active={collection.slug} />
      {collection.products.length > 0 ? (
        <CollectionView products={collection.products} />
      ) : (
        <EmptyCollection collection={collection} suggestions={suggestions} />
      )}
      {fabric && collection.products.length > 0 && <FabricNote fabric={fabric} />}
      <TrustStrip />
    </>
  );
}

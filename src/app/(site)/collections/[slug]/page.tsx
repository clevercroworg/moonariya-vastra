import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { buildCollections } from "@/data/collections";
import { fabrics, type Fabric } from "@/data/home";
import { getCatalog } from "@/lib/catalog";
import { toSummary } from "@/lib/types";
import { CollectionHero } from "@/components/shop/CollectionHero";
import { CategoryRail, type RailItem } from "@/components/shop/CategoryRail";
import { CollectionView } from "@/components/shop/CollectionView";
import { EmptyCollection } from "@/components/shop/EmptyCollection";
import { FabricNote } from "@/components/shop/FabricNote";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CollectionSkeleton } from "@/components/shop/Skeletons";

async function loadCollections() {
  const { products, categories } = await getCatalog();
  return { collections: buildCollections(products.map(toSummary), categories), categories };
}

export async function generateStaticParams() {
  const { collections } = await loadCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { collections } = await loadCollections();
  const c = collections.find((x) => x.slug === slug);
  if (!c) return {};
  return {
    title: c.name,
    description: c.blurb,
    alternates: { canonical: `/collections/${c.slug}` },
    openGraph: { title: c.name, description: c.blurb, images: [{ url: c.image }] },
  };
}

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
  const { collections, categories } = await loadCollections();
  const collection = collections.find((x) => x.slug === slug);
  if (!collection) notFound();

  const rail: RailItem[] = collections.map((c) => ({
    slug: c.slug,
    label: c.slug === "all" ? "All" : c.name.replace(/ Sarees$/, "").replace(/^The /, ""),
    image: c.image,
    href: `/collections/${c.slug}`,
    count: c.products.length,
  }));

  // "Know the fabric": the client's category, or the generic guide for menu categories
  const guide: Fabric[] = [
    ...categories.map((c) => ({ id: c.slug, name: c.name, tagline: c.tagline, feel: c.feel, bestFor: c.bestFor, drape: c.drape, care: c.care, image: c.image, alt: c.alt, href: c.href })),
    ...fabrics,
  ];
  const fabric = guide.find((f) => f.id === collection.fabricId);
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

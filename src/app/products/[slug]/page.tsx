import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Banknote, PackageCheck, ShieldCheck, Star, Truck } from "lucide-react";
import { getCollection } from "@/data/collections";
import { discountPercent, getProduct, productHref, products, relatedProducts } from "@/data/products";
import { site } from "@/data/site";
import { cn, formatINR } from "@/lib/utils";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { ShareRow } from "@/components/product/ShareRow";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { TextLink } from "@/components/ui/Button";
import { whatsappLink } from "@/components/layout/SocialLinks";
import { ProductSkeleton } from "@/components/shop/Skeletons";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.summary,
    alternates: { canonical: productHref(p.slug) },
    openGraph: { title: p.name, description: p.summary, images: [{ url: p.image }] },
  };
}

// URL-dependent content streams inside <Suspense> (instant client navigation);
// every product is still fully prerendered at build time.
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const primary = getCollection(product.collections[0]);
  const off = discountPercent(product);
  const siblings = products.filter((p) => p.fabric === product.fabric);
  const related = relatedProducts(product, 4);
  const reviewLink = whatsappLink(`Hi Monaariya Vastra! I'd like to share a review of the ${product.name}.`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => new URL(i.src, site.url).toString()),
    description: product.summary,
    sku: product.code ?? product.slug,
    brand: { "@type": "Brand", name: site.name },
    color: product.colour,
    material: product.fabric,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: new URL(productHref(product.slug), site.url).toString(),
    },
  };

  const accordion = [
    {
      id: "description",
      title: "Description",
      content: (
        <div className="space-y-3">
          {product.description.map((d, i) => (
            <p key={i}>{d}</p>
          ))}
        </div>
      ),
    },
    {
      id: "details",
      title: "Saree details",
      content: (
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5">
          {product.code && (
            <div className="contents">
              <dt className="text-ink-500">Product code</dt>
              <dd className="text-ink-900">{product.code}</dd>
            </div>
          )}
          {product.details.map((d) => (
            <div key={d.label} className="contents">
              <dt className="text-ink-500">{d.label}</dt>
              <dd className="text-ink-900">{d.value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    { id: "care", title: "Fabric & care", content: <p>{product.care}</p> },
    {
      id: "shipping",
      title: "Shipping & returns",
      content: (
        <ul className="space-y-2.5">
          <li>Delivered in 7–15 working days, with free standard shipping across India.</li>
          <li>Cash on delivery, UPI, cards and net banking accepted.</li>
          <li>Finishing add-ons (falls, pico, tassels) are completed before dispatch.</li>
          <li>
            <strong className="font-medium text-ink-900">A full unpacking video is mandatory</strong> for any damage
            claim. We don&rsquo;t accept returns or exchanges for any other reason.
          </li>
          <li>Colours may vary slightly from what you see, depending on your screen.</li>
        </ul>
      ),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-x pt-6 sm:pt-8">
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/collections/all" },
            ...(primary ? [{ label: primary.name, href: `/collections/${primary.slug}` }] : []),
            { label: product.name },
          ]}
        />
      </div>

      <section className="container-x grid gap-10 pt-6 pb-16 sm:pt-8 lg:grid-cols-12 lg:gap-14 lg:pb-24">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-[100px]">
            <ProductGallery images={product.images} badge={product.badge} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="eyebrow text-gold-700">{product.fabric}</span>
              {product.code && <span className="text-xs tracking-wider text-ink-500">· Code {product.code}</span>}
            </div>
            <h1 className="mt-3 font-display text-[2.4rem] leading-[1.08] font-medium text-maroon-950 sm:text-[2.9rem]">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span className="font-display text-[2.2rem] leading-none text-ink-900">{formatINR(product.price)}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-lg text-ink-500 line-through">
                    <span className="sr-only">MRP </span>
                    {formatINR(product.mrp)}
                  </span>
                  <span className="rounded-full bg-emerald-700/10 px-3 py-1 text-sm font-medium text-emerald-700">
                    Save {formatINR(product.mrp - product.price)} ({off}% off)
                  </span>
                </>
              )}
            </div>
            <p className="mt-2 text-xs text-ink-500">Inclusive of all taxes · Free shipping across India</p>

            <p className="mt-6 leading-relaxed text-ink-700">{product.summary}</p>

            {/* Colours in the same fabric */}
            {siblings.length > 1 && (
              <div className="mt-7">
                <p className="text-sm text-ink-700">
                  Colour: <span className="font-medium text-ink-900">{product.colour}</span>
                </p>
                <ul className="mt-3 flex flex-wrap gap-2.5">
                  {siblings.map((s) => {
                    const on = s.slug === product.slug;
                    return (
                      <li key={s.slug}>
                        <Link
                          href={productHref(s.slug)}
                          aria-label={`${s.colour}${on ? " (selected)" : ""}`}
                          aria-current={on ? "true" : undefined}
                          title={s.colour}
                          className={cn(
                            "block h-9 w-9 rounded-full ring-offset-2 ring-offset-ivory-50 transition-all",
                            on ? "ring-2 ring-maroon-950" : "ring-1 ring-black/10 hover:ring-2 hover:ring-gold-500",
                          )}
                          style={{ background: s.swatch }}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </Reveal>

          <ProductPurchase product={product} />

          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-4 text-[0.85rem] text-ink-700">
            {[
              { Icon: Truck, text: "Free shipping across India" },
              { Icon: Banknote, text: "Cash on delivery available" },
              { Icon: ShieldCheck, text: "Secure UPI, card & net banking" },
              { Icon: PackageCheck, text: "Checked & packed with care" },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5">
                <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold-700" strokeWidth={1.4} aria-hidden />
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <ProductAccordion items={accordion} />
          </div>
          <div className="mt-6">
            <ShareRow name={product.name} />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section aria-labelledby="reviews-title" className="bg-ivory-100 py-16 sm:py-20">
        <div className="container-x grid items-center gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow text-gold-700">Reviews</p>
            <h2 id="reviews-title" className="mt-3 font-display text-h2 text-maroon-950">
              No reviews <em className="text-gold-600">yet.</em>
            </h2>
            <div className="mt-4 flex gap-1 text-gold-500/40" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5" strokeWidth={1.4} />
              ))}
            </div>
          </div>
          <div className="md:col-span-7">
            <p className="leading-relaxed text-ink-700">
              Bought the {product.name}? We&rsquo;d love to hear how it draped — and see a photo if you&rsquo;re happy
              to share one.
            </p>
            <TextLink
              href={reviewLink}
              className="mt-5"
              {...(reviewLink.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              Share your review
            </TextLink>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="container-x py-16 sm:py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-4 border-b border-ivory-200 pb-4">
            <h2 id="related-title" className="font-display text-h2 text-maroon-950">
              You may <em className="text-gold-600">also love</em>
            </h2>
            {primary && <TextLink href={`/collections/${primary.slug}`}>View {primary.name}</TextLink>}
          </Reveal>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
            {related.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} sizes="(min-width: 768px) 22vw, 48vw" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <RecentlyViewed current={product.slug} />
    </>
  );
}

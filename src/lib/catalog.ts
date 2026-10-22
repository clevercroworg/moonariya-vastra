import "server-only";
import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { getDb, schema } from "@/db";
import type { CategoryRow, ProductRow } from "@/db/schema";
import type { Badge, Category, Product, SiteSettings } from "./types";
import { DEFAULT_SETTINGS } from "./settings-defaults";

// Cache tags — admin Server Actions call updateTag() with these after every save.
export const CATALOG_TAG = "catalog";
export const SETTINGS_TAG = "settings";

export const mapCategory = (c: CategoryRow): Category => ({
  id: c.id,
  slug: c.slug,
  name: c.name,
  tagline: c.tagline,
  summary: c.summary,
  feel: c.feel,
  bestFor: c.bestFor,
  drape: c.drape,
  care: c.care,
  image: c.image,
  alt: c.imageAlt || c.name,
  href: `/collections/${c.slug}`,
  sortOrder: c.sortOrder,
});

const PLACEHOLDER_IMAGE = "/brand/emblem.png";

export const mapProduct = (p: ProductRow, category: CategoryRow | undefined): Product => {
  const images = p.images.length ? p.images : [{ src: PLACEHOLDER_IMAGE, alt: p.name }];
  return {
    id: p.id,
    slug: p.slug,
    code: p.code ?? undefined,
    name: p.name,
    fabric: category?.name ?? "Saree",
    categorySlug: category?.slug ?? "",
    collections: p.collections,
    colour: p.colour,
    swatch: p.swatch,
    price: p.price,
    mrp: p.mrp,
    images,
    image: images[0].src,
    hoverImage: (images[1] ?? images[0]).src,
    badge: p.badge === "New" || p.badge === "Bestseller" ? (p.badge as Badge) : undefined,
    inStock: p.inStock,
    addedAt: p.createdAt.toISOString().slice(0, 10),
    summary: p.summary,
    description: p.description,
    details: p.details,
    care: p.care,
  };
};

/** Every published saree and every category, cached until an admin edit. */
export async function getCatalog(): Promise<{ products: Product[]; categories: Category[] }> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("weeks");

  const db = getDb();
  const [cats, prods] = await Promise.all([
    db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder), asc(schema.categories.id)),
    db
      .select()
      .from(schema.products)
      .where(eq(schema.products.status, "published"))
      .orderBy(asc(schema.products.sortOrder), asc(schema.products.id)),
  ]);
  const byId = new Map(cats.map((c) => [c.id, c]));
  return {
    products: prods.map((p) => mapProduct(p, byId.get(p.categoryId))),
    categories: cats.map(mapCategory),
  };
}

export async function getProductBySlug(slug: string) {
  const { products } = await getCatalog();
  return products.find((p) => p.slug === slug);
}

/** Site settings (contact details, socials, announcements, add-ons). */
export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag(SETTINGS_TAG);
  cacheLife("weeks");

  const rows = await getDb()
    .select()
    .from(schema.settings)
    .where(eq(schema.settings.key, "site"));
  const saved = (rows[0]?.value ?? {}) as Partial<SiteSettings>;
  return {
    contact: { ...DEFAULT_SETTINGS.contact, ...saved.contact },
    social: { ...DEFAULT_SETTINGS.social, ...saved.social },
    instagramHandle: saved.instagramHandle ?? DEFAULT_SETTINGS.instagramHandle,
    announcements: saved.announcements?.length ? saved.announcements : DEFAULT_SETTINGS.announcements,
    addons: saved.addons ?? DEFAULT_SETTINGS.addons,
  };
}

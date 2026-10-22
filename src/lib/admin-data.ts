import "server-only";
import { asc, desc, eq, sql } from "drizzle-orm";
import { connection } from "next/server";
import { getDb, schema } from "@/db";
import type { ProductRow } from "@/db/schema";
import { DEFAULT_SETTINGS } from "./settings-defaults";
import type { SiteSettings } from "./types";

// Admin reads are always fresh (no cache) — the admin must see exactly what's saved.

export type AdminProduct = Omit<ProductRow, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  categoryName: string;
};

export async function listAdminProducts(): Promise<AdminProduct[]> {
  await connection();
  const db = getDb();
  const rows = await db
    .select({ p: schema.products, categoryName: schema.categories.name })
    .from(schema.products)
    .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
    .orderBy(desc(schema.products.updatedAt));
  return rows.map(({ p, categoryName }) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    categoryName: categoryName ?? "—",
  }));
}

export async function getAdminProduct(id: number): Promise<AdminProduct | null> {
  await connection();
  const db = getDb();
  const rows = await db
    .select({ p: schema.products, categoryName: schema.categories.name })
    .from(schema.products)
    .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
    .where(eq(schema.products.id, id));
  const r = rows[0];
  return r
    ? { ...r.p, createdAt: r.p.createdAt.toISOString(), updatedAt: r.p.updatedAt.toISOString(), categoryName: r.categoryName ?? "—" }
    : null;
}

export type AdminCategory = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  feel: string;
  bestFor: string;
  drape: string;
  care: string;
  image: string;
  imageAlt: string;
  sortOrder: number;
  productCount: number;
};

export async function listAdminCategories(): Promise<AdminCategory[]> {
  await connection();
  const db = getDb();
  const rows = await db
    .select({
      c: schema.categories,
      productCount: sql<number>`(select count(*)::int from ${schema.products} where ${schema.products.categoryId} = ${schema.categories.id})`,
    })
    .from(schema.categories)
    .orderBy(asc(schema.categories.sortOrder), asc(schema.categories.id));
  return rows.map(({ c, productCount }) => ({
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
    imageAlt: c.imageAlt,
    sortOrder: c.sortOrder,
    productCount,
  }));
}

export async function getAdminSettings(): Promise<SiteSettings> {
  await connection();
  const rows = await getDb().select().from(schema.settings).where(eq(schema.settings.key, "site"));
  const saved = (rows[0]?.value ?? {}) as Partial<SiteSettings>;
  return {
    contact: { ...DEFAULT_SETTINGS.contact, ...saved.contact },
    social: { ...DEFAULT_SETTINGS.social, ...saved.social },
    instagramHandle: saved.instagramHandle ?? DEFAULT_SETTINGS.instagramHandle,
    announcements: saved.announcements ?? DEFAULT_SETTINGS.announcements,
    addons: saved.addons ?? DEFAULT_SETTINGS.addons,
  };
}

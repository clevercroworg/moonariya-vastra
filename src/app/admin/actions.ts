"use server";

import { del } from "@vercel/blob";
import { and, eq, ne, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { requireAdmin } from "@/lib/admin-auth";
import { CATALOG_TAG, SETTINGS_TAG } from "@/lib/catalog";
import { isBlobUrl, slugify, SLUG_PATTERN } from "@/lib/slug";

export type ActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
};

const fieldErrors = (issues: z.core.$ZodIssue[]) => {
  const errors: Record<string, string> = {};
  for (const i of issues) {
    const key = i.path.map(String).join(".") || "form";
    if (!errors[key]) errors[key] = i.message;
  }
  return errors;
};

const parsePayload = (formData: FormData) => {
  try {
    return JSON.parse(String(formData.get("payload") ?? "{}"));
  } catch {
    return {};
  }
};

const deleteBlobs = async (urls: string[]) => {
  const blobs = urls.filter(isBlobUrl);
  if (blobs.length) await del(blobs).catch(() => undefined);
};

const authFailure = (e: unknown): ActionState => ({
  ok: false,
  message: e instanceof Error ? e.message : "Something went wrong.",
});

/* ------------------------------------------------------------------ */
/*  Products                                                           */
/* ------------------------------------------------------------------ */

const imageSchema = z.object({
  src: z.string().trim().min(1),
  alt: z.string().trim().max(200).default(""),
});

const productSchema = z
  .object({
    id: z.number().int().positive().optional(),
    name: z.string().trim().min(3, "Give the saree a name (at least 3 characters).").max(120),
    slug: z.string().trim().toLowerCase().max(120).regex(SLUG_PATTERN, "Use lowercase letters, numbers and hyphens only."),
    code: z.string().trim().max(20).default(""),
    categoryId: z.number({ error: "Choose a category." }).int().positive("Choose a category."),
    collections: z.array(z.string()).default([]),
    colour: z.string().trim().min(1, "Enter the colour.").max(40),
    swatch: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Pick a swatch colour."),
    price: z.number({ error: "Enter the selling price." }).int("Use whole rupees.").min(1, "Enter the selling price."),
    mrp: z.number({ error: "Enter the MRP." }).int("Use whole rupees.").min(1, "Enter the MRP."),
    badge: z.enum(["", "New", "Bestseller"]).default(""),
    status: z.enum(["published", "draft"]),
    inStock: z.boolean(),
    summary: z.string().trim().max(300, "Keep the summary under 300 characters.").default(""),
    description: z.string().trim().max(4000).default(""),
    care: z.string().trim().max(500).default(""),
    details: z
      .array(z.object({ label: z.string().trim().max(40), value: z.string().trim().max(200) }))
      .max(20)
      .default([]),
    images: z.array(imageSchema).max(12, "Up to 12 photos per saree.").default([]),
  })
  .refine((d) => d.mrp >= d.price, { path: ["mrp"], message: "MRP can't be lower than the selling price." })
  .refine((d) => d.status === "draft" || d.images.length > 0, {
    path: ["images"],
    message: "Add at least one photo before publishing (or save as draft).",
  });

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return authFailure(e);
  }

  const parsed = productSchema.safeParse(parsePayload(formData));
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error.issues) };
  }
  const d = parsed.data;
  const db = getDb();

  const clash = await db
    .select({ id: schema.products.id })
    .from(schema.products)
    .where(d.id ? and(eq(schema.products.slug, d.slug), ne(schema.products.id, d.id)) : eq(schema.products.slug, d.slug));
  if (clash.length) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: { slug: "Another saree already uses this web address." } };
  }

  const category = await db.select({ id: schema.categories.id }).from(schema.categories).where(eq(schema.categories.id, d.categoryId));
  if (!category.length) return { ok: false, errors: { categoryId: "That category no longer exists." }, message: "Please fix the highlighted fields." };

  const values = {
    slug: d.slug,
    code: d.code || null,
    name: d.name,
    categoryId: d.categoryId,
    collections: [...new Set(d.collections)],
    colour: d.colour,
    swatch: d.swatch.toLowerCase(),
    price: d.price,
    mrp: d.mrp,
    badge: d.badge || null,
    status: d.status,
    inStock: d.inStock,
    summary: d.summary,
    description: d.description
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
      .filter(Boolean),
    care: d.care,
    details: d.details.filter((x) => x.label && x.value),
    images: d.images.map((i) => ({ src: i.src, alt: i.alt || `${d.name}` })),
  };

  let id = d.id;
  try {
    if (id) {
      const before = await db.select({ images: schema.products.images }).from(schema.products).where(eq(schema.products.id, id));
      if (!before.length) return { ok: false, message: "This saree was deleted by someone else." };
      await db.update(schema.products).set({ ...values, updatedAt: new Date() }).where(eq(schema.products.id, id));
      const kept = new Set(values.images.map((i) => i.src));
      await deleteBlobs(before[0].images.map((i) => i.src).filter((src) => !kept.has(src)));
    } else {
      const [row] = await db.insert(schema.products).values(values).returning({ id: schema.products.id });
      id = row.id;
    }
  } catch (e) {
    console.error("saveProduct", e);
    return { ok: false, message: "Couldn't save — please try again." };
  }

  updateTag(CATALOG_TAG);
  redirect(`/admin/products/${id}?saved=1`);
}

export async function deleteProduct(id: number): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return authFailure(e);
  }
  const db = getDb();
  const rows = await db.delete(schema.products).where(eq(schema.products.id, id)).returning({ images: schema.products.images });
  if (rows.length) await deleteBlobs(rows[0].images.map((i) => i.src));
  updateTag(CATALOG_TAG);
  redirect("/admin/products?deleted=1");
}

/** Copies a saree as a draft for another colour (photos are not copied). */
export async function duplicateProduct(id: number): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return authFailure(e);
  }
  const db = getDb();
  const [src] = await db.select().from(schema.products).where(eq(schema.products.id, id));
  if (!src) return { ok: false, message: "That saree no longer exists." };

  const base = `${src.slug}-new-colour`;
  const taken = await db
    .select({ slug: schema.products.slug })
    .from(schema.products)
    .where(sql`${schema.products.slug} like ${base + "%"}`);
  const slugs = new Set(taken.map((t) => t.slug));
  let slug = base;
  for (let n = 2; slugs.has(slug); n++) slug = `${base}-${n}`;

  const [row] = await db
    .insert(schema.products)
    .values({
      slug,
      code: src.code,
      name: src.colour
        ? src.name.replace(new RegExp(`^${src.colour.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+`, "i"), "New colour ")
        : `${src.name} (new colour)`,
      categoryId: src.categoryId,
      collections: src.collections,
      colour: "",
      swatch: src.swatch,
      price: src.price,
      mrp: src.mrp,
      badge: src.badge,
      status: "draft",
      inStock: true,
      summary: src.summary,
      description: src.description,
      details: src.details,
      care: src.care,
      images: [],
      sortOrder: src.sortOrder,
    })
    .returning({ id: schema.products.id });
  updateTag(CATALOG_TAG);
  redirect(`/admin/products/${row.id}?duplicated=1`);
}

/** Quick toggles from the saree list. */
export async function setProductFlags(id: number, flags: { status?: "published" | "draft"; inStock?: boolean }): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return authFailure(e);
  }
  const db = getDb();
  if (flags.status === "published") {
    const [p] = await db.select({ images: schema.products.images }).from(schema.products).where(eq(schema.products.id, id));
    if (!p?.images.length) return { ok: false, message: "Add at least one photo before publishing." };
  }
  await db
    .update(schema.products)
    .set({ ...flags, updatedAt: new Date() })
    .where(eq(schema.products.id, id));
  updateTag(CATALOG_TAG);
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/*  Categories                                                         */
/* ------------------------------------------------------------------ */

const categorySchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().trim().min(2, "Enter a category name.").max(60),
  slug: z.string().trim().toLowerCase().max(80).regex(SLUG_PATTERN, "Use lowercase letters, numbers and hyphens only."),
  tagline: z.string().trim().max(60).default(""),
  summary: z.string().trim().max(300).default(""),
  feel: z.string().trim().max(120).default(""),
  bestFor: z.string().trim().max(120).default(""),
  drape: z.string().trim().max(120).default(""),
  care: z.string().trim().max(200).default(""),
  image: z.string().trim().default(""),
  imageAlt: z.string().trim().max(200).default(""),
});

// Slugs used by fixed shop pages — a category can't take these.
const RESERVED = new Set(["all", "new-arrivals", "festive-edit"]);

export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return authFailure(e);
  }
  const raw = parsePayload(formData);
  if (raw && typeof raw === "object" && !raw.slug && raw.name) raw.slug = slugify(String(raw.name));
  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error.issues) };
  }
  const d = parsed.data;
  if (RESERVED.has(d.slug)) return { ok: false, message: "Please fix the highlighted fields.", errors: { slug: "This address is reserved — choose another." } };

  const db = getDb();
  const clash = await db
    .select({ id: schema.categories.id })
    .from(schema.categories)
    .where(d.id ? and(eq(schema.categories.slug, d.slug), ne(schema.categories.id, d.id)) : eq(schema.categories.slug, d.slug));
  if (clash.length) return { ok: false, message: "Please fix the highlighted fields.", errors: { slug: "Another category already uses this address." } };

  const values = {
    name: d.name,
    slug: d.slug,
    tagline: d.tagline,
    summary: d.summary,
    feel: d.feel,
    bestFor: d.bestFor,
    drape: d.drape,
    care: d.care,
    image: d.image,
    imageAlt: d.imageAlt || d.name,
  };
  try {
    if (d.id) {
      const [before] = await db.select({ image: schema.categories.image }).from(schema.categories).where(eq(schema.categories.id, d.id));
      await db.update(schema.categories).set({ ...values, updatedAt: new Date() }).where(eq(schema.categories.id, d.id));
      if (before && before.image !== d.image) await deleteBlobs([before.image]);
    } else {
      const [{ max }] = await db.select({ max: sql<number>`coalesce(max(${schema.categories.sortOrder}), 0)::int` }).from(schema.categories);
      await db.insert(schema.categories).values({ ...values, sortOrder: max + 10 });
    }
  } catch (e) {
    console.error("saveCategory", e);
    return { ok: false, message: "Couldn't save — please try again." };
  }
  updateTag(CATALOG_TAG);
  return { ok: true, message: d.id ? "Category updated." : "Category added." };
}

export async function deleteCategory(id: number): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return authFailure(e);
  }
  const db = getDb();
  const [{ n }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(schema.products)
    .where(eq(schema.products.categoryId, id));
  if (n > 0) return { ok: false, message: `Move or delete its ${n} saree${n === 1 ? "" : "s"} first.` };
  const rows = await db.delete(schema.categories).where(eq(schema.categories.id, id)).returning({ image: schema.categories.image });
  if (rows.length) await deleteBlobs([rows[0].image]);
  updateTag(CATALOG_TAG);
  return { ok: true, message: "Category deleted." };
}

/** Moves a category one place up or down (order used across the shop). */
export async function moveCategory(id: number, direction: -1 | 1): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return authFailure(e);
  }
  const db = getDb();
  const all = await db
    .select({ id: schema.categories.id })
    .from(schema.categories)
    .orderBy(schema.categories.sortOrder, schema.categories.id);
  const i = all.findIndex((c) => c.id === id);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= all.length) return { ok: true };
  const order = all.map((c) => c.id);
  [order[i], order[j]] = [order[j], order[i]];
  for (const [index, cid] of order.entries()) {
    await db.update(schema.categories).set({ sortOrder: (index + 1) * 10 }).where(eq(schema.categories.id, cid));
  }
  updateTag(CATALOG_TAG);
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/*  Settings                                                           */
/* ------------------------------------------------------------------ */

const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^https?:\/\/\S+$/.test(v), "Paste the full link, starting with https://");

const settingsSchema = z.object({
  contact: z.object({
    phone: z.string().trim().max(30),
    whatsapp: z
      .string()
      .trim()
      .transform((v) => v.replace(/[^\d]/g, ""))
      .refine((v) => v === "" || (v.length >= 10 && v.length <= 15), "Enter the number with country code, e.g. 919876543210"),
    email: z.string().trim().max(120).refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email."),
    address: z.string().trim().max(300),
    hours: z.string().trim().max(80),
  }),
  social: z.object({ instagram: optionalUrl, facebook: optionalUrl, youtube: optionalUrl }),
  instagramHandle: z.string().trim().max(40),
  announcements: z.array(z.string().trim().min(1).max(90)).max(8),
  addons: z
    .array(
      z.object({
        id: z.string().trim().max(60).default(""),
        name: z.string().trim().min(2, "Name the add-on.").max(60),
        price: z.number({ error: "Enter a price." }).int().min(0, "Price can't be negative.").max(100000),
        note: z.string().trim().max(160).default(""),
      }),
    )
    .max(10),
});

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (e) {
    return authFailure(e);
  }
  const parsed = settingsSchema.safeParse(parsePayload(formData));
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error.issues) };
  }
  const value = {
    ...parsed.data,
    instagramHandle: parsed.data.instagramHandle && !parsed.data.instagramHandle.startsWith("@") ? `@${parsed.data.instagramHandle}` : parsed.data.instagramHandle,
    // keep ids stable — bag lines reference add-ons by id
    addons: parsed.data.addons.map((a) => ({ ...a, id: a.id || slugify(a.name) })),
  };
  await getDb()
    .insert(schema.settings)
    .values({ key: "site", value })
    .onConflictDoUpdate({ target: schema.settings.key, set: { value, updatedAt: new Date() } });
  updateTag(SETTINGS_TAG);
  return { ok: true, message: "Settings saved — the shop is updated." };
}

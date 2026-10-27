// Imports the original catalogue into an empty database (runs on every Vercel build via
// `npm run db:setup`, but does nothing once sarees exist, so admin edits are never touched).
//   npm run db:seed              → only if the database is empty
//   npm run db:seed -- --force   → re-import, overwriting the 64 original sarees by slug
import { neon } from "@neondatabase/serverless";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { products } from "../src/db/seed/products";
import { weaves } from "../src/db/seed/weaves";
import { DEFAULT_SETTINGS } from "../src/lib/settings-defaults";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const db = drizzle(neon(url), { schema });

  const [{ n: existing }] = await db.select({ n: sql<number>`count(*)::int` }).from(schema.products);
  if (existing > 0 && !process.argv.includes("--force")) {
    console.log(`seed: skipped — ${existing} sarees already in the database`);
    await db.insert(schema.settings).values({ key: "site", value: DEFAULT_SETTINGS }).onConflictDoNothing();
    await syncTestProduct(db);
    return;
  }

  // Categories (the client's own saree categories)
  for (const [i, w] of weaves.entries()) {
    const values = {
      slug: w.id,
      name: w.name,
      tagline: w.tagline,
      summary: w.summary,
      feel: w.feel,
      bestFor: w.bestFor,
      drape: w.drape,
      care: w.care,
      image: w.image,
      imageAlt: w.alt,
      sortOrder: (i + 1) * 10,
    };
    await db
      .insert(schema.categories)
      .values(values)
      .onConflictDoUpdate({ target: schema.categories.slug, set: { ...values, updatedAt: sql`now()` } });
  }
  const cats = await db.select().from(schema.categories);
  const catBySlug = new Map(cats.map((c) => [c.slug, c.id]));
  console.log(`categories: ${cats.length}`);

  // Products
  for (const [i, p] of products.entries()) {
    const weave = weaves.find((w) => w.fabric === p.fabric);
    const categoryId = weave ? catBySlug.get(weave.id) : undefined;
    if (!categoryId) throw new Error(`No category for ${p.slug} (${p.fabric})`);
    const values = {
      slug: p.slug,
      code: p.code ?? null,
      name: p.name,
      categoryId,
      collections: p.collections,
      colour: p.colour,
      swatch: p.swatch,
      price: p.price,
      mrp: p.mrp,
      badge: p.badge ?? null,
      status: "published",
      inStock: true,
      summary: p.summary,
      description: p.description,
      details: p.details,
      care: p.care,
      images: p.images,
      sortOrder: (i + 1) * 10,
      createdAt: new Date(`${p.addedAt}T10:00:00+05:30`),
    };
    await db
      .insert(schema.products)
      .values(values)
      .onConflictDoUpdate({ target: schema.products.slug, set: { ...values, updatedAt: sql`now()` } });
  }
  const count = await db.select({ n: sql<number>`count(*)::int` }).from(schema.products);
  console.log(`products: ${count[0].n}`);

  // Settings — only created if missing, so re-running never overwrites admin edits
  await db.insert(schema.settings).values({ key: "site", value: DEFAULT_SETTINGS }).onConflictDoNothing();
  console.log("settings: ok");
  await syncTestProduct(db);
}

const TEST_SLUG = "razorpay-test-saree";

/**
 * TEST_PRODUCT=on adds a ₹1 saree for testing live payments; without it the saree is removed.
 * Set or remove the variable in Vercel and redeploy.
 */
async function syncTestProduct(db: ReturnType<typeof drizzle<typeof schema>>) {
  if (process.env.TEST_PRODUCT !== "on") {
    const removed = await db.delete(schema.products).where(eq(schema.products.slug, TEST_SLUG)).returning({ id: schema.products.id });
    if (removed.length) console.log("test product: removed");
    return;
  }
  const [model] = await db.select().from(schema.products).where(eq(schema.products.status, "published")).limit(1);
  if (!model) return;
  const values = {
    slug: TEST_SLUG,
    code: "TEST",
    name: "Razorpay Test Saree (₹1)",
    categoryId: model.categoryId,
    collections: [],
    colour: "Test",
    swatch: model.swatch,
    price: 1,
    mrp: 1,
    badge: null,
    status: "published",
    inStock: true,
    summary: "For payment testing only — not a real product.",
    description: ["This listing exists only to test online payments and will be removed."],
    details: [],
    care: "",
    images: model.images.slice(0, 1),
    sortOrder: 999999,
    createdAt: new Date("2020-01-01T00:00:00Z"),
  };
  await db.insert(schema.products).values(values).onConflictDoUpdate({ target: schema.products.slug, set: { ...values, updatedAt: sql`now()` } });
  console.log("test product: ready at /products/" + TEST_SLUG);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

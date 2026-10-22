// One-time import of the original catalogue into the database. Safe to re-run:
// rows are matched by slug and updated in place.
//   npm run db:seed
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { products } from "../src/db/seed/products";
import { weaves } from "../src/db/seed/weaves";
import { DEFAULT_SETTINGS } from "../src/lib/settings-defaults";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const db = drizzle(neon(url), { schema });

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
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

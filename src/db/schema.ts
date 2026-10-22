import { sql } from "drizzle-orm";
import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import type { ProductDetail, ProductImage } from "@/lib/types";

/** The client's own saree categories (Pure Kora Tissue, Raw Silk, …). */
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  summary: text("summary").notNull().default(""),
  feel: text("feel").notNull().default(""),
  bestFor: text("best_for").notNull().default(""),
  drape: text("drape").notNull().default(""),
  care: text("care").notNull().default(""),
  image: text("image").notNull().default(""),
  imageAlt: text("image_alt").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  code: text("code"),
  name: text("name").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  collections: text("collections").array().notNull().default(sql`'{}'::text[]`),
  colour: text("colour").notNull(),
  swatch: text("swatch").notNull().default("#c4964a"),
  price: integer("price").notNull(),
  mrp: integer("mrp").notNull(),
  badge: text("badge"),
  status: text("status").notNull().default("published"),
  inStock: boolean("in_stock").notNull().default(true),
  summary: text("summary").notNull().default(""),
  description: text("description").array().notNull().default(sql`'{}'::text[]`),
  details: jsonb("details").$type<ProductDetail[]>().notNull().default([]),
  care: text("care").notNull().default(""),
  images: jsonb("images").$type<ProductImage[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Key/value site settings (contact details, social links, announcements, add-ons). */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CategoryRow = typeof categories.$inferSelect;
export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;

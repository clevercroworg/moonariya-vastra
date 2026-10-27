import { sql } from "drizzle-orm";
import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import type { OrderCustomer, OrderItem, ProductDetail, ProductImage } from "@/lib/types";

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

/** Customer orders. Amounts are whole rupees, always calculated on the server. */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),
  /** pending → paid → shipped → delivered; or failed / cancelled / refunded */
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method").notNull().default("razorpay"),
  customer: jsonb("customer").$type<OrderCustomer>().notNull(),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  subtotal: integer("subtotal").notNull(),
  addonsTotal: integer("addons_total").notNull().default(0),
  shipping: integer("shipping").notNull().default(0),
  discount: integer("discount").notNull().default(0),
  total: integer("total").notNull(),
  razorpayOrderId: text("razorpay_order_id").unique(),
  razorpayPaymentId: text("razorpay_payment_id"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  /** Secret for the customer's order-confirmation link. */
  accessToken: text("access_token").notNull(),
  tracking: text("tracking").notNull().default(""),
  adminNote: text("admin_note").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CategoryRow = typeof categories.$inferSelect;
export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;
export type OrderRow = typeof orders.$inferSelect;

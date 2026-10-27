// Shared shapes for catalogue data. The database is the source of truth;
// these are what the storefront and admin work with.

export type ProductImage = { src: string; alt: string };
export type ProductDetail = { label: string; value: string };
export type Badge = "New" | "Bestseller";

export type Product = {
  id: number;
  slug: string;
  code?: string;
  name: string;
  /** display name of the product's category (e.g. "Pure Kora Tissue") */
  fabric: string;
  categorySlug: string;
  /** navigation collections the saree also appears in (e.g. "silk-sarees", "festive-edit") */
  collections: string[];
  colour: string;
  swatch: string;
  price: number;
  mrp: number;
  images: ProductImage[];
  image: string;
  hoverImage: string;
  badge?: Badge;
  inStock: boolean;
  /** ISO date the piece was added — drives "Newest" sorting */
  addedAt: string;
  summary: string;
  description: string[];
  details: ProductDetail[];
  care: string;
};

/** The slim version sent to client components (cards, bag, search). */
export type ProductSummary = Pick<
  Product,
  | "id"
  | "slug"
  | "code"
  | "name"
  | "fabric"
  | "categorySlug"
  | "collections"
  | "colour"
  | "swatch"
  | "price"
  | "mrp"
  | "image"
  | "hoverImage"
  | "badge"
  | "inStock"
  | "addedAt"
>;

/** One of the client's own saree categories (also used by the Fabric Guide). */
export type Category = {
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
  alt: string;
  href: string;
  sortOrder: number;
};

export type Addon = { id: string; name: string; price: number; note: string };

export type SiteSettings = {
  contact: { phone: string; whatsapp: string; email: string; address: string; hours: string };
  social: { instagram: string; facebook: string; youtube: string };
  instagramHandle: string;
  announcements: string[];
  addons: Addon[];
};

export type OrderCustomer = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type OrderItem = {
  productId: number;
  slug: string;
  name: string;
  code: string | null;
  colour: string;
  image: string;
  price: number;
  qty: number;
  addons: { id: string; name: string; price: number }[];
};

export const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered", "failed", "cancelled", "refunded"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const toSummary = (p: Product): ProductSummary => ({
  id: p.id,
  slug: p.slug,
  code: p.code,
  name: p.name,
  fabric: p.fabric,
  categorySlug: p.categorySlug,
  collections: p.collections,
  colour: p.colour,
  swatch: p.swatch,
  price: p.price,
  mrp: p.mrp,
  image: p.image,
  hoverImage: p.hoverImage,
  badge: p.badge,
  inStock: p.inStock,
  addedAt: p.addedAt,
});

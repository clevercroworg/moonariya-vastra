import "server-only";
import { randomBytes } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { getDb, schema } from "@/db";
import type { OrderRow } from "@/db/schema";
import { after } from "next/server";
import { getSettings } from "./catalog";
import { sendOrderConfirmation } from "./email";
import { ensureCaptured, type RazorpayPayment } from "./razorpay";
import type { OrderItem } from "./types";

export type CartLine = { slug: string; qty: number; addons: string[] };

export const MAX_LINES = 20;
export const MAX_QTY = 10;
export const SHIPPING_FEE = 0; // free shipping across India

/**
 * Prices the bag from the database — the browser only says *which* sarees and how many.
 * Unavailable sarees are reported back instead of being charged.
 */
export async function priceCart(lines: CartLine[]) {
  const db = getDb();
  const slugs = [...new Set(lines.map((l) => l.slug))];
  const [rows, settings] = await Promise.all([
    slugs.length
      ? db
          .select()
          .from(schema.products)
          .where(and(inArray(schema.products.slug, slugs), eq(schema.products.status, "published")))
      : Promise.resolve([]),
    getSettings(),
  ]);
  const bySlug = new Map(rows.map((r) => [r.slug, r]));

  const items: OrderItem[] = [];
  const unavailable: string[] = [];
  for (const line of lines) {
    const p = bySlug.get(line.slug);
    if (!p || !p.inStock) {
      unavailable.push(p?.name ?? line.slug);
      continue;
    }
    const addons = [...new Set(line.addons)]
      .map((id) => settings.addons.find((a) => a.id === id))
      .filter((a): a is NonNullable<typeof a> => Boolean(a))
      .map((a) => ({ id: a.id, name: a.name, price: a.price }));
    items.push({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      code: p.code,
      colour: p.colour,
      image: p.images[0]?.src ?? "/brand/emblem.png",
      price: p.price,
      qty: Math.max(1, Math.min(MAX_QTY, Math.floor(line.qty))),
      addons,
    });
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const addonsTotal = items.reduce((s, i) => s + i.addons.reduce((a, x) => a + x.price, 0) * i.qty, 0);
  const shipping = items.length ? SHIPPING_FEE : 0;
  const discount = 0;
  const total = subtotal + addonsTotal + shipping - discount;
  return { items, unavailable, subtotal, addonsTotal, shipping, discount, total };
}

export const newAccessToken = () => randomBytes(18).toString("base64url");
export const orderNumberFor = (id: number) => `MV${String(10000 + id)}`;

/**
 * Marks an order paid once Razorpay confirms the payment. Safe to call more than once
 * (the checkout handler and the webhook may both arrive) — only a pending/failed order changes.
 */
export async function markOrderPaid(razorpayOrderId: string, payment: RazorpayPayment): Promise<OrderRow | null> {
  const db = getDb();
  const [order] = await db.select().from(schema.orders).where(eq(schema.orders.razorpayOrderId, razorpayOrderId));
  if (!order) return null;
  if (order.status !== "pending" && order.status !== "failed") return order;

  // Only capture a payment that belongs to this order and is for exactly its amount.
  const matches = payment.order_id === razorpayOrderId && payment.currency === "INR" && payment.amount === order.total * 100;
  if (matches && payment.status === "authorized") payment = await ensureCaptured(payment);
  const paid = matches && payment.status === "captured";
  if (!paid) {
    await db
      .update(schema.orders)
      .set({ adminNote: `Payment ${payment.id} not accepted: status ${payment.status}, amount ${payment.amount / 100} ${payment.currency}.`, updatedAt: new Date() })
      .where(eq(schema.orders.id, order.id));
    return null;
  }

  const [updated] = await db
    .update(schema.orders)
    .set({ status: "paid", razorpayPaymentId: payment.id, paidAt: new Date(), updatedAt: new Date() })
    .where(and(eq(schema.orders.id, order.id), inArray(schema.orders.status, ["pending", "failed"])))
    .returning();
  // Only the call that actually flipped the order to paid sends the email (checkout and webhook may both arrive).
  if (updated) after(() => sendOrderConfirmation(updated));
  return updated ?? order;
}

export async function markOrderFailed(razorpayOrderId: string, paymentId: string) {
  await getDb()
    .update(schema.orders)
    .set({ status: "failed", razorpayPaymentId: paymentId, updatedAt: new Date() })
    .where(and(eq(schema.orders.razorpayOrderId, razorpayOrderId), eq(schema.orders.status, "pending")));
}

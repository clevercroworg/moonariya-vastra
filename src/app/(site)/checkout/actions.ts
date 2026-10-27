"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { MAX_LINES, MAX_QTY, markOrderPaid, newAccessToken, orderNumberFor, priceCart } from "@/lib/orders";
import { createRazorpayOrder, fetchPayment, razorpayKeys, verifyPaymentSignature } from "@/lib/razorpay";
import { INDIAN_STATES } from "@/lib/indian-states";

const customerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(80),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, ""))
    .refine((v) => /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit mobile number."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(120),
  address: z.string().trim().min(8, "Please enter your full address.").max(300),
  city: z.string().trim().min(2, "Please enter your city.").max(60),
  state: z.enum(INDIAN_STATES, { error: "Please choose your state." }),
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit pin code."),
});

const startSchema = z.object({
  customer: customerSchema,
  lines: z
    .array(z.object({ slug: z.string().max(200), qty: z.number().int().min(1).max(MAX_QTY), addons: z.array(z.string().max(60)).max(10) }))
    .min(1, "Your bag is empty.")
    .max(MAX_LINES),
});

export type StartResult =
  | {
      ok: true;
      keyId: string;
      razorpayOrderId: string;
      amount: number;
      orderNumber: string;
      customer: { name: string; email: string; phone: string };
    }
  | { ok: false; message: string; errors?: Record<string, string>; unavailable?: string[] };

/** Creates the order (priced on the server) and a matching Razorpay order. */
export async function startCheckout(input: unknown): Promise<StartResult> {
  const keys = razorpayKeys();
  if (!keys) return { ok: false, message: "Online payment is not available right now. Please order on WhatsApp." };

  const parsed = startSchema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.filter((p) => p !== "customer").join(".");
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, message: "Please check the highlighted details.", errors };
  }
  const { customer, lines } = parsed.data;

  const priced = await priceCart(lines);
  if (priced.unavailable.length) {
    return {
      ok: false,
      message: `Sorry, ${priced.unavailable.join(", ")} ${priced.unavailable.length === 1 ? "is" : "are"} no longer available. Please remove ${priced.unavailable.length === 1 ? "it" : "them"} from your bag.`,
      unavailable: priced.unavailable,
    };
  }
  if (!priced.items.length || priced.total < 1) return { ok: false, message: "Your bag is empty." };

  const db = getDb();
  const [created] = await db
    .insert(schema.orders)
    .values({
      number: `TMP-${newAccessToken()}`,
      customer,
      items: priced.items,
      subtotal: priced.subtotal,
      addonsTotal: priced.addonsTotal,
      shipping: priced.shipping,
      discount: priced.discount,
      total: priced.total,
      accessToken: newAccessToken(),
    })
    .returning({ id: schema.orders.id });
  const number = orderNumberFor(created.id);

  try {
    const rz = await createRazorpayOrder(priced.total * 100, number, { order_number: number, customer_phone: customer.phone });
    await db.update(schema.orders).set({ number, razorpayOrderId: rz.id }).where(eq(schema.orders.id, created.id));
    return {
      ok: true,
      keyId: keys.keyId,
      razorpayOrderId: rz.id,
      amount: rz.amount,
      orderNumber: number,
      customer: { name: customer.name, email: customer.email, phone: customer.phone },
    };
  } catch (e) {
    await db.update(schema.orders).set({ number, status: "failed", adminNote: "Could not start payment." }).where(eq(schema.orders.id, created.id));
    console.error("Razorpay order creation failed", e);
    return { ok: false, message: "We couldn’t start the payment. Please try again in a moment." };
  }
}

const confirmSchema = z.object({
  razorpay_order_id: z.string().min(1).max(100),
  razorpay_payment_id: z.string().min(1).max(100),
  razorpay_signature: z.string().min(1).max(200),
});

export type ConfirmResult = { ok: true; orderNumber: string; token: string } | { ok: false; message: string };

/** Called by the checkout after Razorpay's success callback — verifies before trusting it. */
export async function confirmPayment(input: unknown): Promise<ConfirmResult> {
  const parsed = confirmSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid payment response." };
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = parsed.data;

  if (!verifyPaymentSignature(orderId, paymentId, signature)) {
    return { ok: false, message: "We couldn’t verify this payment. If money was deducted, please contact us with your payment ID." };
  }

  try {
    const payment = await fetchPayment(paymentId);
    if (payment.order_id !== orderId) return { ok: false, message: "Payment does not match this order." };
    const order = await markOrderPaid(orderId, payment);
    if (!order || order.status === "pending" || order.status === "failed") {
      return { ok: false, message: "Your payment is being confirmed. We’ll update you on WhatsApp shortly." };
    }
    return { ok: true, orderNumber: order.number, token: order.accessToken };
  } catch (e) {
    console.error("Payment confirmation failed", e);
    return { ok: false, message: "Your payment is being confirmed. We’ll update you on WhatsApp shortly." };
  }
}

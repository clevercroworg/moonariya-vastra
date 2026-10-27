import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Razorpay REST API, called directly from the server. Keys live only in Vercel
// environment variables (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET).

const API = "https://api.razorpay.com/v1";

export function razorpayKeys() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return keyId && keySecret ? { keyId, keySecret } : null;
}

async function call<T>(path: string, init: { method: "GET" | "POST"; body?: unknown }): Promise<T> {
  const keys = razorpayKeys();
  if (!keys) throw new Error("Online payments are not configured.");
  const res = await fetch(`${API}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${keys.keyId}:${keys.keySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: { description?: string } };
  if (!res.ok) throw new Error(data.error?.description || `Razorpay request failed (${res.status})`);
  return data;
}

export type RazorpayOrder = { id: string; amount: number; currency: string; status: string };
export type RazorpayPayment = { id: string; order_id: string; amount: number; currency: string; status: string; method?: string };

export const createRazorpayOrder = (amountPaise: number, receipt: string, notes: Record<string, string>) =>
  call<RazorpayOrder>("/orders", { method: "POST", body: { amount: amountPaise, currency: "INR", receipt, notes } });

export const fetchPayment = (paymentId: string) => call<RazorpayPayment>(`/payments/${encodeURIComponent(paymentId)}`, { method: "GET" });

/** Captures an authorised payment (in case the account isn't set to auto-capture). */
export async function ensureCaptured(payment: RazorpayPayment): Promise<RazorpayPayment> {
  if (payment.status !== "authorized") return payment;
  return call<RazorpayPayment>(`/payments/${encodeURIComponent(payment.id)}/capture`, {
    method: "POST",
    body: { amount: payment.amount, currency: payment.currency },
  });
}

function safeEqualHex(expected: string, received: string) {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Checkout handler signature: HMAC-SHA256(order_id|payment_id, key secret). */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const keys = razorpayKeys();
  if (!keys) return false;
  const expected = createHmac("sha256", keys.keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqualHex(expected, signature);
}

/** Webhook signature: HMAC-SHA256(raw body, webhook secret). */
export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}

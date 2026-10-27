import "server-only";
import type { OrderRow } from "@/db/schema";
import { site } from "@/data/site";

// Order confirmation emails, sent through Resend's API (RESEND_API_KEY).
// The sender domain must be verified in Resend; EMAIL_FROM overrides the default sender.

const FROM = process.env.EMAIL_FROM || "Monaariya Vastra <orders@monaariyavastra.in>";
const SITE = (process.env.SITE_URL || "https://www.monaariyavastra.in").replace(/\/$/, "");

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const abs = (src: string) => (src.startsWith("http") ? src : `${SITE}${src}`);

function confirmationHtml(order: OrderRow) {
  const c = order.customer;
  const link = `${SITE}/order/${order.number}?t=${encodeURIComponent(order.accessToken)}`;
  const rows = order.items
    .map((i) => {
      const addons = i.addons.map((a) => `<div style="color:#7c6a61;font-size:13px">+ ${esc(a.name)} (${inr(a.price)})</div>`).join("");
      const line = (i.price + i.addons.reduce((s, a) => s + a.price, 0)) * i.qty;
      return `<tr>
        <td style="padding:12px 0;border-bottom:1px solid #efe2cc;width:64px;vertical-align:top"><img src="${abs(i.image)}" width="56" height="75" alt="" style="display:block;object-fit:cover;border-radius:2px"></td>
        <td style="padding:12px;border-bottom:1px solid #efe2cc;vertical-align:top;font-size:14px;color:#22130f">
          <div style="font-weight:600">${esc(i.name)}</div>
          <div style="color:#7c6a61;font-size:13px">Qty ${i.qty}${i.code ? ` · ${esc(i.code)}` : ""}</div>${addons}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #efe2cc;vertical-align:top;text-align:right;font-size:14px;white-space:nowrap">${inr(line)}</td>
      </tr>`;
    })
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#f8f0e3;font-family:Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f0e3;padding:24px 12px"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:6px;overflow:hidden">
      <tr><td style="background:#170304;padding:28px 24px;text-align:center">
        <img src="${SITE}/brand/logo-nav.png" alt="${site.name}" width="180" style="display:inline-block;max-width:180px">
      </td></tr>
      <tr><td style="padding:28px 24px 8px">
        <p style="margin:0;color:#9c7130;font-size:12px;letter-spacing:2px;text-transform:uppercase">Order ${order.number}</p>
        <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-weight:normal;color:#3a0a12;font-size:26px">Thank you, ${esc(c.name.split(" ")[0])}!</h1>
        <p style="margin:12px 0 0;color:#4a3730;font-size:15px;line-height:1.6">We’ve received your payment and are preparing your order. We’ll let you know as soon as it ships — delivery is usually within 7–15 working days.</p>
      </td></tr>
      <tr><td style="padding:16px 24px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}
          <tr><td></td><td style="padding:12px;font-size:14px;color:#7c6a61">Shipping</td><td style="padding:12px 0;text-align:right;font-size:14px">${order.shipping ? inr(order.shipping) : "Free"}</td></tr>
          <tr><td></td><td style="padding:4px 12px;font-size:16px;font-weight:600;color:#22130f">Total paid</td><td style="padding:4px 0;text-align:right;font-size:16px;font-weight:600">${inr(order.total)}</td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:8px 24px 0">
        <div style="background:#fdf9f3;border:1px solid #efe2cc;border-radius:4px;padding:14px 16px;font-size:14px;color:#4a3730;line-height:1.6">
          <strong style="color:#22130f">Delivering to</strong><br>
          ${esc(c.name)}<br>${esc(c.address).replace(/\n/g, "<br>")}<br>${esc(c.city)}, ${esc(c.state)} ${esc(c.pincode)}<br>${esc(c.phone)}
        </div>
      </td></tr>
      <tr><td style="padding:24px;text-align:center">
        <a href="${link}" style="display:inline-block;background:#5c1222;color:#f6e6bf;text-decoration:none;padding:13px 28px;border-radius:2px;font-size:13px;letter-spacing:2px;text-transform:uppercase">View your order</a>
        <p style="margin:16px 0 0;color:#7c6a61;font-size:12px">Payment ID: ${esc(order.razorpayPaymentId ?? "")}</p>
      </td></tr>
      <tr><td style="background:#fdf9f3;padding:18px 24px;text-align:center;color:#7c6a61;font-size:12px;line-height:1.6">
        Questions? Reply to this email or visit <a href="${SITE}/contact" style="color:#5c1222">${SITE.replace(/^https?:\/\//, "")}/contact</a><br>
        ${site.name} · ${site.tagline}
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

/** Sends the customer's order confirmation. Never throws — a failed email must not affect the order. */
export async function sendOrderConfirmation(order: OrderRow) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !order.customer.email) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [order.customer.email],
        reply_to: process.env.EMAIL_REPLY_TO || undefined,
        subject: `Order confirmed — ${order.number} · ${site.name}`,
        html: confirmationHtml(order),
      }),
    });
    if (!res.ok) console.error("Order email failed", res.status, await res.text().catch(() => ""));
  } catch (e) {
    console.error("Order email failed", e);
  }
}

import { markOrderFailed, markOrderPaid } from "@/lib/orders";
import { verifyWebhookSignature, type RazorpayPayment } from "@/lib/razorpay";

// Razorpay → server notifications. Confirms payments even if the customer closed the
// browser before the checkout finished. Set up in Razorpay: Settings → Webhooks.

type Event = {
  event: string;
  payload?: { payment?: { entity?: RazorpayPayment } };
};

export async function POST(request: Request) {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return Response.json({ error: "Webhook not configured" }, { status: 503 });

  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(raw, signature)) return Response.json({ error: "Invalid signature" }, { status: 401 });

  let event: Event;
  try {
    event = JSON.parse(raw) as Event;
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const payment = event.payload?.payment?.entity;
  if (!payment?.order_id) return Response.json({ ok: true, ignored: event.event });

  try {
    if (event.event === "payment.authorized" || event.event === "payment.captured" || event.event === "order.paid") {
      await markOrderPaid(payment.order_id, payment);
    } else if (event.event === "payment.failed") {
      await markOrderFailed(payment.order_id, payment.id);
    }
  } catch (e) {
    console.error("Razorpay webhook handling failed", e);
    return Response.json({ error: "Temporary failure" }, { status: 500 }); // Razorpay retries
  }
  return Response.json({ ok: true });
}

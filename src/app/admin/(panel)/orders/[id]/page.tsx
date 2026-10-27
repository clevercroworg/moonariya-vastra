import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminOrder } from "@/lib/admin-data";
import { Card } from "@/components/admin/ui";
import { ToastProvider } from "@/components/admin/Flash";
import { OrderStatusPill } from "@/components/admin/OrderStatusPill";
import { OrderActions } from "@/components/admin/OrderActions";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Order" };

const dateFmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function OrderDetailPage({ params }: PageProps<"/admin/orders/[id]">) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const order = await getAdminOrder(id);
  if (!order) notFound();
  const c = order.customer;
  const waNumber = `91${c.phone}`;

  return (
    <ToastProvider>
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-maroon-700">
        <ArrowLeft className="h-4 w-4" /> All orders
      </Link>
      <div className="mt-2 mb-6 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-[2rem] leading-tight text-maroon-950 sm:text-[2.4rem]">Order {order.number}</h1>
        <OrderStatusPill status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Card title="Items" bodyClassName="px-0 py-0 sm:px-0">
            <ul className="divide-y divide-ivory-200/70">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex gap-3 px-5 py-4 sm:px-6">
                  <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-ivory-100">
                    <Image src={i.image} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    <a href={`/products/${i.slug}`} target="_blank" rel="noreferrer" className="font-medium text-ink-900 hover:text-maroon-700">
                      {i.name}
                    </a>
                    <span className="block text-ink-500">
                      {i.code ? `${i.code} · ` : ""}
                      {i.colour} · Qty {i.qty} · {formatINR(i.price)} each
                    </span>
                    {i.addons.map((a) => (
                      <span key={a.id} className="block text-ink-500">
                        + {a.name} ({formatINR(a.price)})
                      </span>
                    ))}
                  </span>
                  <span className="text-sm font-medium whitespace-nowrap">{formatINR((i.price + i.addons.reduce((s, a) => s + a.price, 0)) * i.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-1.5 border-t border-ivory-200 px-5 py-4 text-sm sm:px-6">
              <Row k="Sarees" v={formatINR(order.subtotal)} />
              {order.addonsTotal > 0 && <Row k="Add-ons" v={formatINR(order.addonsTotal)} />}
              <Row k="Shipping" v={order.shipping ? formatINR(order.shipping) : "Free"} />
              {order.discount > 0 && <Row k="Discount" v={`− ${formatINR(order.discount)}`} />}
              <div className="flex justify-between pt-1 text-base font-medium text-ink-900">
                <dt>Total</dt>
                <dd>{formatINR(order.total)}</dd>
              </div>
            </dl>
          </Card>

          <Card title="Payment">
            <dl className="space-y-1.5 text-sm">
              <Row k="Method" v="Razorpay (online)" />
              <Row k="Payment ID" v={order.razorpayPaymentId ?? "—"} />
              <Row k="Razorpay order" v={order.razorpayOrderId ?? "—"} />
              <Row k="Placed" v={dateFmt.format(new Date(order.createdAt))} />
              <Row k="Paid" v={order.paidAt ? dateFmt.format(new Date(order.paidAt)) : "Not paid"} />
            </dl>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Customer">
            <p className="text-sm leading-relaxed whitespace-pre-line text-ink-700">
              <strong className="text-ink-900">{c.name}</strong>
              {"\n"}
              {c.address}
              {"\n"}
              {c.city}, {c.state} {c.pincode}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <a href={`tel:+${waNumber}`} className="rounded-md border border-ivory-200 px-3 py-2 hover:bg-ivory-50">
                Call {c.phone}
              </a>
              <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className="rounded-md border border-ivory-200 px-3 py-2 hover:bg-ivory-50">
                WhatsApp
              </a>
              <a href={`mailto:${c.email}`} className="rounded-md border border-ivory-200 px-3 py-2 hover:bg-ivory-50">
                Email
              </a>
            </div>
          </Card>
          <OrderActions key={order.updatedAt} order={{ id: order.id, status: order.status, tracking: order.tracking, adminNote: order.adminNote }} />
        </div>
      </div>
    </ToastProvider>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-500">{k}</dt>
      <dd className="text-right break-all text-ink-900">{v}</dd>
    </div>
  );
}

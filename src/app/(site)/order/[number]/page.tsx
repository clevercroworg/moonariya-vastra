import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { and, eq } from "drizzle-orm";
import { CheckCircle2, Clock } from "lucide-react";
import { getDb, schema } from "@/db";
import { PageHero } from "@/components/policies/PolicyLayout";
import { PlainSkeleton } from "@/components/shop/Skeletons";
import { ButtonLink } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Your order", robots: { index: false, follow: false } };

export default function OrderPage({ params, searchParams }: PageProps<"/order/[number]">) {
  return (
    <Suspense fallback={<PlainSkeleton />}>
      <OrderContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function OrderContent({ params, searchParams }: Pick<PageProps<"/order/[number]">, "params" | "searchParams">) {
  await connection();
  const [{ number }, sp] = await Promise.all([params, searchParams]);
  const token = typeof sp.t === "string" ? sp.t : "";
  if (!token || !/^MV\d+$/.test(number)) notFound();

  const [order] = await getDb()
    .select()
    .from(schema.orders)
    .where(and(eq(schema.orders.number, number), eq(schema.orders.accessToken, token)));
  if (!order) notFound();

  const paid = ["paid", "shipped", "delivered"].includes(order.status);
  const statusText: Record<string, string> = {
    paid: "Payment received — we’re preparing your order.",
    shipped: "Your order is on its way.",
    delivered: "Your order has been delivered.",
    pending: "We’re confirming your payment. This page will update shortly.",
    failed: "Payment was not completed.",
    cancelled: "This order was cancelled.",
    refunded: "This order has been refunded.",
  };

  return (
    <>
      <PageHero
        eyebrow={`Order ${order.number}`}
        title={paid ? "Thank you for your order" : "Order status"}
        intro={statusText[order.status] ?? ""}
      />
      <div className="container-x grid gap-8 py-12 sm:py-16 lg:grid-cols-12">
        <section className="rounded-xl border border-ivory-200 bg-white p-6 sm:p-8 lg:col-span-7">
          <p className="flex items-center gap-2 text-sm font-medium text-ink-900">
            {paid ? <CheckCircle2 className="h-5 w-5 text-emerald-700" /> : <Clock className="h-5 w-5 text-gold-700" />}
            {paid ? `Paid ${formatINR(order.total)}` : `Total ${formatINR(order.total)}`}
            {order.razorpayPaymentId && <span className="font-normal text-ink-500">· Payment ID {order.razorpayPaymentId}</span>}
          </p>
          {order.tracking && (
            <p className="mt-3 rounded-md bg-ivory-50 px-4 py-3 text-sm whitespace-pre-line text-ink-700">
              <strong className="text-ink-900">Tracking:</strong> {order.tracking}
            </p>
          )}
          <ul className="mt-6 divide-y divide-ivory-200 border-y border-ivory-200">
            {order.items.map((i, idx) => (
              <li key={idx} className="flex gap-4 py-4">
                <span className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-[2px] bg-ivory-100">
                  <Image src={i.image} alt="" fill sizes="64px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <Link href={`/products/${i.slug}`} className="font-display text-lg leading-snug text-maroon-950 hover:underline">
                    {i.name}
                  </Link>
                  <span className="mt-0.5 block text-ink-500">
                    Qty {i.qty}
                    {i.code && ` · ${i.code}`}
                  </span>
                  {i.addons.map((a) => (
                    <span key={a.id} className="block text-ink-500">
                      + {a.name} ({formatINR(a.price)})
                    </span>
                  ))}
                </span>
                <span className="text-sm whitespace-nowrap">
                  {formatINR((i.price + i.addons.reduce((s, a) => s + a.price, 0)) * i.qty)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-500">Shipping</dt>
              <dd>{order.shipping ? formatINR(order.shipping) : "Free"}</dd>
            </div>
            <div className="flex justify-between text-base font-medium">
              <dt>Total</dt>
              <dd>{formatINR(order.total)}</dd>
            </div>
          </dl>
        </section>

        <aside className="space-y-6 lg:col-span-5">
          <section className="rounded-xl border border-ivory-200 bg-ivory-50 p-6">
            <h2 className="font-display text-2xl text-maroon-950">Delivering to</h2>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-ink-700">
              {order.customer.name}
              {"\n"}
              {order.customer.address}
              {"\n"}
              {order.customer.city}, {order.customer.state} {order.customer.pincode}
              {"\n"}
              {order.customer.phone} · {order.customer.email}
            </p>
          </section>
          <p className="text-sm leading-relaxed text-ink-700">
            Please save this page — it shows the latest status of your order. Need help? Visit our{" "}
            <Link href="/contact" className="text-maroon-700 underline">
              contact page
            </Link>
            .
          </p>
          <ButtonLink href="/collections/all" variant="solid-dark">
            Continue shopping
          </ButtonLink>
        </aside>
      </div>
    </>
  );
}

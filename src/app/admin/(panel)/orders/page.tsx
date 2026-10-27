import type { Metadata } from "next";
import Link from "next/link";
import { listAdminOrders } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/ui";
import { OrderStatusPill } from "@/components/admin/OrderStatusPill";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders" };

const FILTERS = [
  { id: "to-ship", label: "To ship", match: (s: string) => s === "paid" },
  { id: "shipped", label: "Shipped", match: (s: string) => s === "shipped" },
  { id: "completed", label: "Delivered", match: (s: string) => s === "delivered" },
  { id: "all-paid", label: "All paid", match: (s: string) => ["paid", "shipped", "delivered", "refunded", "cancelled"].includes(s) },
  { id: "unpaid", label: "Unpaid / failed", match: (s: string) => s === "pending" || s === "failed" },
] as const;

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

export default async function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const [orders, sp] = await Promise.all([listAdminOrders(), searchParams]);
  const filter = FILTERS.find((f) => f.id === sp.show) ?? FILTERS[0];
  const visible = orders.filter((o) => filter.match(o.status));
  const toShip = orders.filter((o) => o.status === "paid").length;

  return (
    <>
      <PageHeader
        title="Orders"
        description={toShip ? `${toShip} paid ${toShip === 1 ? "order is" : "orders are"} waiting to be shipped.` : "Online orders paid through Razorpay."}
      />
      <nav className="no-scrollbar mb-4 flex gap-2 overflow-x-auto" aria-label="Order filters">
        {FILTERS.map((f) => (
          <Link
            key={f.id}
            href={`/admin/orders?show=${f.id}`}
            aria-current={f.id === filter.id ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors",
              f.id === filter.id ? "border-maroon-950 bg-maroon-950 text-gold-200" : "border-ivory-200 bg-white text-ink-700 hover:border-maroon-950/30",
            )}
          >
            {f.label} <span className="opacity-60">({orders.filter((o) => f.match(o.status)).length})</span>
          </Link>
        ))}
      </nav>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ivory-200 bg-white px-6 py-14 text-center">
          <p className="font-display text-2xl text-maroon-950">No orders here</p>
          <p className="mt-1 text-sm text-ink-500">New online orders appear here as soon as they are paid.</p>
        </div>
      ) : (
        <ul className="divide-y divide-ivory-200/70 overflow-hidden rounded-xl border border-ivory-200 bg-white">
          {visible.map((o) => (
            <li key={o.id}>
              <Link href={`/admin/orders/${o.id}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-4 hover:bg-ivory-50 sm:grid-cols-[120px_minmax(0,1fr)_120px_110px] sm:px-5">
                <span className="font-medium text-ink-900">{o.number}</span>
                <span className="text-right sm:order-last">
                  <OrderStatusPill status={o.status} />
                </span>
                <span className="min-w-0 truncate text-sm text-ink-700">
                  {o.customer.name} · {o.customer.city}
                  <span className="block text-xs text-ink-500">
                    {o.items.reduce((n, i) => n + i.qty, 0)} item(s) · {dateFmt.format(new Date(o.createdAt))}
                  </span>
                </span>
                <span className="text-right text-sm font-medium text-ink-900 sm:text-left">{formatINR(o.total)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

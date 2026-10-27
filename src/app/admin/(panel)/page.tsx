import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight, FolderTree, ImageOff, Package, PackageX, Plus, Settings, Shirt, Store, Tag } from "lucide-react";
import { listAdminCategories, listAdminOrders, listAdminProducts } from "@/lib/admin-data";
import { formatINR } from "@/lib/utils";
import { Card, PageHeader, Pill, buttonCls } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Dashboard" };

const greeting = () => {
  const hour = Number(new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
};

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

export default async function DashboardPage() {
  const [products, categories, orders] = await Promise.all([listAdminProducts(), listAdminCategories(), listAdminOrders()]);
  const toShip = orders.filter((o) => o.status === "paid").length;

  const live = products.filter((p) => p.status === "published");
  const drafts = products.filter((p) => p.status === "draft");
  const soldOut = live.filter((p) => !p.inStock);
  const noPhotos = products.filter((p) => p.images.length === 0);
  const noSummary = products.filter((p) => !p.summary.trim());
  const prices = live.map((p) => p.price);
  const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const maxCount = Math.max(1, ...categories.map((c) => c.productCount));
  const recent = products.slice(0, 6);

  const stats = [
    { label: "Orders to ship", value: toShip, Icon: Package, href: "/admin/orders", tone: "text-maroon-700 bg-maroon-700/10" },
    { label: "Sarees live", value: live.length, Icon: Shirt, href: "/admin/products?status=published", tone: "text-emerald-700 bg-emerald-700/10" },
    { label: "Drafts", value: drafts.length, Icon: Tag, href: "/admin/products?status=draft", tone: "text-gold-700 bg-gold-400/20" },
    { label: "Sold out", value: soldOut.length, Icon: PackageX, href: "/admin/products?status=soldout", tone: "text-rani-600 bg-rani-600/10" },
  ];

  const attention = [
    ...noPhotos.map((p) => ({ p, text: "No photos yet" })),
    ...noSummary.filter((p) => !noPhotos.includes(p)).map((p) => ({ p, text: "Missing short summary" })),
    ...drafts.filter((p) => !noPhotos.includes(p) && !noSummary.includes(p)).map((p) => ({ p, text: "Draft — not visible in the shop" })),
  ].slice(0, 6);

  return (
    <>
      <PageHeader
        title={`${greeting()}.`}
        description="Here's how the Monaariya Vastra shop looks right now."
        actions={
          <>
            <Link href="/" target="_blank" className={buttonCls("secondary")}>
              <Store className="h-4 w-4" /> View shop
            </Link>
            <Link href="/admin/products/new" className={buttonCls("primary")}>
              <Plus className="h-4 w-4" /> Add saree
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, href, tone }) => (
          <Link key={label} href={href} className="group rounded-xl border border-ivory-200 bg-white p-4 shadow-[0_1px_2px_rgb(34_19_15/0.04)] transition-shadow hover:shadow-md sm:p-5">
            <span className={`grid h-10 w-10 place-items-center rounded-lg ${tone}`}>
              <Icon className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <p className="mt-4 font-display text-[2.2rem] leading-none text-maroon-950">{value}</p>
            <p className="mt-1.5 flex items-center justify-between text-sm text-ink-500">
              {label}
              <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card title="Sarees by category" description={`Average live price ${formatINR(avg)}`} className="lg:col-span-3">
          <ul className="space-y-3.5">
            {categories.map((c) => (
              <li key={c.id}>
                <div className="flex items-baseline justify-between text-sm">
                  <Link href={`/admin/products?category=${c.id}`} className="text-ink-900 hover:text-maroon-700">
                    {c.name}
                  </Link>
                  <span className="text-ink-500">{c.productCount}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ivory-100">
                  <div className="h-full rounded-full bg-gold-gradient" style={{ width: `${(c.productCount / maxCount) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Needs attention" className="lg:col-span-2">
          {attention.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-emerald-700">All sarees have photos, summaries and are live. Lovely!</p>
          ) : (
            <ul className="divide-y divide-ivory-200/70">
              {attention.map(({ p, text }) => (
                <li key={`${p.id}-${text}`}>
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 py-2.5 hover:text-maroon-700">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold-400/15 text-gold-700">
                      {text.startsWith("No photos") ? <ImageOff className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-ink-900">{p.name}</span>
                      <span className="block text-xs text-ink-500">{text}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card
          title="Recently updated"
          className="lg:col-span-3"
          actions={
            <Link href="/admin/products" className="text-sm text-maroon-700 hover:underline">
              All sarees
            </Link>
          }
          bodyClassName="px-0 py-0 sm:px-0"
        >
          <ul className="divide-y divide-ivory-200/70">
            {recent.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-ivory-50 sm:px-6">
                  <span className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-ivory-100">
                    {p.images[0] && <Image src={p.images[0].src} alt="" fill sizes="36px" className="object-cover" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-ink-900">{p.name}</span>
                    <span className="block text-xs text-ink-500">
                      {p.categoryName} · {formatINR(p.price)}
                    </span>
                  </span>
                  <span className="hidden text-right sm:block">
                    {p.status === "draft" ? <Pill tone="amber">Draft</Pill> : !p.inStock ? <Pill tone="red">Sold out</Pill> : <Pill tone="green">Live</Pill>}
                    <span className="mt-1 block text-[0.7rem] text-ink-500">{dateFmt.format(new Date(p.updatedAt))}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Quick actions" className="lg:col-span-2">
          <div className="grid gap-2.5">
            {[
              { href: "/admin/products/new", label: "Add a new saree", Icon: Plus },
              { href: "/admin/categories", label: "Add or edit categories", Icon: FolderTree },
              { href: "/admin/settings", label: "Contact details, offers & add-ons", Icon: Settings },
            ].map(({ href, label, Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 rounded-lg border border-ivory-200 px-4 py-3 text-sm text-ink-900 transition-colors hover:border-maroon-950/30 hover:bg-ivory-50">
                <Icon className="h-4 w-4 text-gold-700" /> {label}
                <ArrowRight className="ml-auto h-4 w-4 text-ink-500" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, ExternalLink, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { AdminProduct } from "@/lib/admin-data";
import { discountPercent } from "@/lib/product-utils";
import { cn, formatINR } from "@/lib/utils";
import { deleteProduct, duplicateProduct, setProductFlags } from "@/app/admin/actions";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Flash";
import { Pill, Switch, inputCls } from "./ui";

type Sort = "updated" | "name" | "price-asc" | "price-desc" | "code";

export function ProductTable({
  products,
  categories,
  initial,
}: {
  products: AdminProduct[];
  categories: { id: number; name: string }[];
  initial: { status: string; category: string };
}) {
  const router = useRouter();
  const toast = useToast();
  const [rows, setRows] = useState(products);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initial.category);
  const [status, setStatus] = useState(initial.status);
  const [sort, setSort] = useState<Sort>("updated");
  const [confirm, setConfirm] = useState<AdminProduct | null>(null);
  const [pending, startTransition] = useTransition();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- keep local rows in sync after a refresh
  useEffect(() => setRows(products), [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = rows.filter(
      (p) =>
        (category === "all" || String(p.categoryId) === category) &&
        (status === "all" ||
          (status === "published" && p.status === "published") ||
          (status === "draft" && p.status === "draft") ||
          (status === "soldout" && !p.inStock)) &&
        (!q || `${p.name} ${p.code ?? ""} ${p.colour} ${p.categoryName}`.toLowerCase().includes(q)),
    );
    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "code") sorted.sort((a, b) => (a.code ?? "~").localeCompare(b.code ?? "~", undefined, { numeric: true }));
    return sorted;
  }, [rows, query, category, status, sort]);

  const updateFlags = (p: AdminProduct, flags: { status?: "published" | "draft"; inStock?: boolean }) => {
    const before = rows;
    setRows((r) => r.map((x) => (x.id === p.id ? { ...x, ...flags } : x)));
    startTransition(async () => {
      const res = await setProductFlags(p.id, flags);
      if (!res.ok) {
        setRows(before);
        toast(res.message ?? "Couldn't update.", "error");
        return;
      }
      toast(
        flags.status
          ? flags.status === "published"
            ? `${p.name} is live in the shop.`
            : `${p.name} moved to drafts.`
          : flags.inStock
            ? `${p.name} is back in stock.`
            : `${p.name} marked sold out.`,
      );
      router.refresh();
    });
  };

  const runDelete = () => {
    if (!confirm) return;
    const target = confirm;
    startTransition(async () => {
      const res = await deleteProduct(target.id);
      if (res && !res.ok) toast(res.message ?? "Couldn't delete.", "error");
      setConfirm(null);
    });
  };

  const runDuplicate = (p: AdminProduct) =>
    startTransition(async () => {
      const res = await duplicateProduct(p.id);
      if (res && !res.ok) toast(res.message ?? "Couldn't duplicate.", "error");
    });

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-[1fr_200px_170px_190px]">
        <label className="relative col-span-2 lg:col-span-1">
          <span className="sr-only">Search sarees</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, code or colour"
            className={cn(inputCls, "h-10 pl-10")}
          />
        </label>
        <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)} className={cn(inputCls, "h-10")}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
        <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className={cn(inputCls, "h-10")}>
          <option value="all">All statuses</option>
          <option value="published">Live</option>
          <option value="draft">Drafts</option>
          <option value="soldout">Sold out</option>
        </select>
        <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={cn(inputCls, "col-span-2 h-10 lg:col-span-1")}>
          <option value="updated">Recently updated</option>
          <option value="name">Name A–Z</option>
          <option value="code">Code</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <p className="mb-3 text-sm text-ink-500" aria-live="polite">
        Showing {visible.length} of {rows.length}
      </p>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ivory-200 bg-white px-6 py-14 text-center">
          <p className="font-display text-2xl text-maroon-950">No sarees match</p>
          <p className="mt-1 text-sm text-ink-500">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-ivory-200 bg-white shadow-[0_1px_2px_rgb(34_19_15/0.04)]">
          {/* Header (desktop) */}
          <div className="hidden grid-cols-[minmax(0,1fr)_140px_130px_120px_110px_44px] gap-4 border-b border-ivory-200 bg-ivory-50 px-5 py-3 text-xs font-medium tracking-wider text-ink-500 uppercase md:grid">
            <span>Saree</span>
            <span>Category</span>
            <span>Price</span>
            <span>Status</span>
            <span>In stock</span>
            <span />
          </div>
          <ul className="divide-y divide-ivory-200/70">
            {visible.map((p) => {
              const off = discountPercent(p);
              return (
                <li
                  key={p.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-4 py-3.5 md:grid-cols-[minmax(0,1fr)_140px_130px_120px_110px_44px] md:px-5"
                >
                  <Link href={`/admin/products/${p.id}`} className="flex min-w-0 items-center gap-3">
                    <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-md bg-ivory-100">
                      {p.images[0] ? (
                        <Image src={p.images[0].src} alt="" fill sizes="44px" className="object-cover" />
                      ) : (
                        <span className="grid h-full place-items-center text-[0.6rem] text-ink-500">No photo</span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[0.95rem] font-medium text-ink-900 hover:text-maroon-700">{p.name}</span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-ink-500">
                        <span className="h-3 w-3 shrink-0 rounded-full ring-1 ring-black/10" style={{ background: p.swatch }} />
                        {p.colour || "No colour"}
                        {p.code && <span>· {p.code}</span>}
                      </span>
                    </span>
                  </Link>

                  <RowMenu
                    className="md:order-last"
                    product={p}
                    onDuplicate={() => runDuplicate(p)}
                    onDelete={() => setConfirm(p)}
                  />

                  <span className="text-sm text-ink-700 max-md:hidden">{p.categoryName}</span>

                  <span className="text-sm max-md:col-span-2 max-md:flex max-md:items-center max-md:gap-2">
                    <span className="font-medium text-ink-900">{formatINR(p.price)}</span>
                    {p.mrp > p.price && (
                      <span className="block text-xs text-ink-500 max-md:inline">
                        <span className="line-through">{formatINR(p.mrp)}</span> · {off}% off
                      </span>
                    )}
                    <span className="text-xs text-ink-500 md:hidden">· {p.categoryName}</span>
                  </span>

                  <span className="col-span-2 flex items-center justify-between gap-4 rounded-lg bg-ivory-50 px-3 py-2 md:hidden">
                    <span className="flex items-center gap-2.5 text-xs text-ink-700">
                      <Switch checked={p.status === "published"} disabled={pending} label={`${p.name} live in shop`} onChange={(v) => updateFlags(p, { status: v ? "published" : "draft" })} />
                      {p.status === "published" ? "Live in shop" : "Draft"}
                    </span>
                    <span className="flex items-center gap-2.5 text-xs text-ink-700">
                      {p.inStock ? "In stock" : "Sold out"}
                      <Switch checked={p.inStock} disabled={pending} label={`${p.name} in stock`} onChange={(v) => updateFlags(p, { inStock: v })} />
                    </span>
                  </span>

                  <span className="max-md:hidden">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => updateFlags(p, { status: p.status === "published" ? "draft" : "published" })}
                      title={p.status === "published" ? "Click to hide (move to drafts)" : "Click to publish"}
                      className="disabled:opacity-60"
                    >
                      {p.status === "published" ? <Pill tone="green">● Live</Pill> : <Pill tone="amber">Draft</Pill>}
                    </button>
                  </span>

                  <span className="max-md:hidden">
                    <Switch checked={p.inStock} disabled={pending} label={`${p.name} in stock`} onChange={(v) => updateFlags(p, { inStock: v })} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        title="Delete this saree?"
        busy={pending}
        onCancel={() => setConfirm(null)}
        onConfirm={runDelete}
      >
        <strong className="text-ink-900">{confirm?.name}</strong> will be removed from the shop and its uploaded photos
        deleted. This can&rsquo;t be undone — to hide it temporarily, switch it to Draft instead.
      </ConfirmDialog>
    </div>
  );
}

function RowMenu({
  product,
  onDuplicate,
  onDelete,
  className,
}: {
  product: AdminProduct;
  onDuplicate: () => void;
  onDelete: () => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const item = "flex w-full items-center gap-2.5 px-3.5 py-3 text-left sm:py-2 text-sm text-ink-900 hover:bg-ivory-50";
  return (
    <div ref={ref} className={cn("relative justify-self-end", className)}>
      <button
        type="button"
        onClick={(e) => {
          setUp(window.innerHeight - e.currentTarget.getBoundingClientRect().bottom < 280);
          setOpen((o) => !o);
        }}
        aria-label={`Actions for ${product.name}`}
        aria-expanded={open}
        className="grid h-9 w-9 place-items-center rounded-full text-ink-500 hover:bg-ivory-100 hover:text-maroon-950"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
      {open && (
        <div role="menu" className={cn("absolute right-0 z-20 w-56 overflow-hidden rounded-lg border border-ivory-200 bg-white py-1 shadow-xl", up ? "bottom-full mb-1" : "mt-1")}>
          <Link role="menuitem" href={`/admin/products/${product.id}`} className={item}>
            <Pencil className="h-4 w-4 text-ink-500" /> Edit
          </Link>
          {product.status === "published" && (
            <a role="menuitem" href={`/products/${product.slug}`} target="_blank" rel="noreferrer" className={item}>
              <ExternalLink className="h-4 w-4 text-ink-500" /> View in shop
            </a>
          )}
          <button role="menuitem" type="button" onClick={() => { setOpen(false); onDuplicate(); }} className={item}>
            <Copy className="h-4 w-4 text-ink-500" /> Add another colour
          </button>
          <button role="menuitem" type="button" onClick={() => { setOpen(false); onDelete(); }} className={cn(item, "text-rani-600")}>
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

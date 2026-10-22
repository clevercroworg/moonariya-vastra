"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Copy, ExternalLink, Plus, Save, Trash2, Wand2, X } from "lucide-react";
import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { AdminProduct } from "@/lib/admin-data";
import { discountPercent } from "@/lib/product-utils";
import { slugify } from "@/lib/slug";
import type { ProductDetail, ProductImage } from "@/lib/types";
import { cn, formatINR } from "@/lib/utils";
import { deleteProduct, duplicateProduct, saveProduct, type ActionState } from "@/app/admin/actions";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Flash";
import { ImageManager } from "./ImageManager";
import { Button, Card, Field, Pill, Switch, buttonCls, inputCls } from "./ui";

type FormState = {
  name: string;
  slug: string;
  code: string;
  categoryId: string;
  collections: string[];
  colour: string;
  swatch: string;
  price: string;
  mrp: string;
  badge: "" | "New" | "Bestseller";
  status: "published" | "draft";
  inStock: boolean;
  summary: string;
  description: string;
  care: string;
  details: ProductDetail[];
  images: ProductImage[];
};

const fromProduct = (p?: AdminProduct): FormState => ({
  name: p?.name ?? "",
  slug: p?.slug ?? "",
  code: p?.code ?? "",
  categoryId: p ? String(p.categoryId) : "",
  collections: p?.collections ?? [],
  colour: p?.colour ?? "",
  swatch: p?.swatch ?? "#c4964a",
  price: p ? String(p.price) : "",
  mrp: p ? String(p.mrp) : "",
  badge: p?.badge === "New" || p?.badge === "Bestseller" ? p.badge : "",
  status: p ? (p.status === "draft" ? "draft" : "published") : "draft",
  inStock: p?.inStock ?? true,
  summary: p?.summary ?? "",
  description: (p?.description ?? []).join("\n\n"),
  care: p?.care ?? "Dry clean only.",
  details: p?.details ?? [],
  images: p?.images ?? [],
});

const STANDARD_DETAILS = (fabric: string): ProductDetail[] => [
  { label: "Fabric", value: fabric },
  { label: "Work", value: "" },
  { label: "Saree length", value: "5.5 metres" },
  { label: "Blouse piece", value: "1 metre (unstitched)" },
  { label: "Occasion", value: "Wedding, festive, party wear & traditional functions" },
  { label: "Delivery", value: "7–15 working days" },
];

export function ProductForm({
  product,
  categories,
  collections,
}: {
  product?: AdminProduct;
  categories: { id: number; name: string }[];
  collections: { slug: string; name: string }[];
}) {
  const toast = useToast();
  const initial = useMemo(() => fromProduct(product), [product]);
  const [form, setForm] = useState<FormState>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [state, formAction, saving] = useActionState<ActionState, FormData>(saveProduct, { ok: false });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, startTransition] = useTransition();
  const topRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));
  const errors = state.errors ?? {};
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  // Fresh data after a save → reset the form to what's stored.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with the saved product after redirect
    setForm(initial);
  }, [initial]);

  useEffect(() => {
    if (!state.ok && state.message) {
      toast(state.message, "error");
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state, toast]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const price = Number(form.price) || 0;
  const mrp = Number(form.mrp) || 0;
  const off = price && mrp > price ? discountPercent({ price, mrp }) : 0;
  const categoryName = categories.find((c) => String(c.id) === form.categoryId)?.name ?? "";

  const payload = JSON.stringify({
    id: product?.id,
    ...form,
    categoryId: form.categoryId ? Number(form.categoryId) : undefined,
    price: form.price === "" ? undefined : Number(form.price),
    mrp: form.mrp === "" ? undefined : Number(form.mrp),
    details: form.details.filter((d) => d.label.trim() || d.value.trim()),
  });

  const onName = (name: string) =>
    setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));

  return (
    <div ref={topRef}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-maroon-700">
            <ArrowLeft className="h-4 w-4" /> All sarees
          </Link>
          <h1 className="mt-2 truncate font-display text-[2rem] leading-tight text-maroon-950 sm:text-[2.4rem]">
            {product ? form.name || "Untitled saree" : "Add a saree"}
          </h1>
          {product && (
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-500">
              {product.status === "published" ? <Pill tone="green">● Live</Pill> : <Pill tone="amber">Draft</Pill>}
              {!product.inStock && <Pill tone="red">Sold out</Pill>}
              Last saved {new Date(product.updatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          )}
        </div>
        {product && (
          <div className="flex flex-wrap gap-2">
            {product.status === "published" && (
              <a href={`/products/${product.slug}`} target="_blank" rel="noreferrer" className={buttonCls("secondary")}>
                <ExternalLink className="h-4 w-4" /> View in shop
              </a>
            )}
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() =>
                startTransition(async () => {
                  const res = await duplicateProduct(product.id);
                  if (res && !res.ok) toast(res.message ?? "Couldn't duplicate.", "error");
                })
              }
            >
              <Copy className="h-4 w-4" /> Add another colour
            </Button>
          </div>
        )}
      </div>

      <form action={formAction} className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_340px]">
        <input type="hidden" name="payload" value={payload} />

        {/* On phones both columns dissolve (display: contents) so `order` can put photos right after Basics. */}
        <div className="contents lg:block lg:space-y-6">
          <Card title="Basics" className="order-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Saree name" required htmlFor="name" error={errors.name} className="sm:col-span-2" hint="Shown on the card and product page, e.g. “Violet Pure Raw Silk Saree with Cut Work”.">
                <input id="name" value={form.name} onChange={(e) => onName(e.target.value)} aria-invalid={!!errors.name} className={cn(inputCls, "h-11")} maxLength={120} />
              </Field>
              <Field label="Web address" htmlFor="slug" error={errors.slug} className="sm:col-span-2" hint={product ? "Changing this breaks old links to the saree." : "Filled in from the name."}>
                <div className="flex items-center overflow-hidden rounded-md border border-ivory-200 bg-ivory-50 focus-within:border-maroon-700 focus-within:ring-2 focus-within:ring-gold-400/40">
                  <span className="pl-3.5 text-sm whitespace-nowrap text-ink-500">/products/</span>
                  <input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                    }}
                    aria-invalid={!!errors.slug}
                    className="h-11 w-full bg-white px-2 text-base text-ink-900 focus:outline-none sm:text-[0.95rem]"
                  />
                </div>
              </Field>
              <Field label="Category" required htmlFor="category" error={errors.categoryId}>
                <select id="category" value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} aria-invalid={!!errors.categoryId} className={cn(inputCls, "h-11")}>
                  <option value="">Choose…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Product code" htmlFor="code" error={errors.code} hint="From the price tag, e.g. B162.">
                <input id="code" value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} className={cn(inputCls, "h-11")} maxLength={20} />
              </Field>
              <Field label="Colour" required htmlFor="colour" error={errors.colour}>
                <input id="colour" value={form.colour} onChange={(e) => set("colour", e.target.value)} aria-invalid={!!errors.colour} placeholder="e.g. Rani Pink" className={cn(inputCls, "h-11")} maxLength={40} />
              </Field>
              <Field label="Swatch" htmlFor="swatch" error={errors.swatch} hint="The dot shown on cards and colour pickers.">
                <div className="flex items-center gap-2">
                  <input id="swatch" type="color" value={form.swatch} onChange={(e) => set("swatch", e.target.value)} className="h-11 w-14 cursor-pointer rounded-md border border-ivory-200 bg-white p-1" />
                  <input value={form.swatch} onChange={(e) => set("swatch", e.target.value)} aria-label="Swatch hex code" className={cn(inputCls, "h-11 font-mono")} maxLength={7} />
                </div>
              </Field>
            </div>
          </Card>

          <Card title="Pricing" description="Whole rupees, inclusive of all taxes." className="order-3">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Selling price (₹)" required htmlFor="price" error={errors.price}>
                <input id="price" inputMode="numeric" value={form.price} onChange={(e) => set("price", e.target.value.replace(/[^\d]/g, ""))} aria-invalid={!!errors.price} className={cn(inputCls, "h-11")} placeholder="4999" />
              </Field>
              <Field label="MRP (₹)" required htmlFor="mrp" error={errors.mrp} hint="Shown struck through.">
                <input id="mrp" inputMode="numeric" value={form.mrp} onChange={(e) => set("mrp", e.target.value.replace(/[^\d]/g, ""))} aria-invalid={!!errors.mrp} className={cn(inputCls, "h-11")} placeholder="6249" />
              </Field>
              <div className="col-span-2 rounded-lg bg-ivory-50 px-4 py-3 text-sm sm:col-span-1">
                <p className="text-ink-500">Customers see</p>
                <p className="mt-1 font-display text-2xl text-maroon-950">{price ? formatINR(price) : "—"}</p>
                {off > 0 && (
                  <p className="text-xs text-emerald-700">
                    {off}% off · save {formatINR(mrp - price)}
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card title="Description" className="order-5">
            <div className="space-y-4">
              <Field label="Short summary" htmlFor="summary" error={errors.summary} hint={`${form.summary.length}/300 · one line under the price.`}>
                <textarea id="summary" rows={2} value={form.summary} onChange={(e) => set("summary", e.target.value)} className={cn(inputCls, "py-2.5")} maxLength={300} />
              </Field>
              <Field label="Full description" htmlFor="description" error={errors.description} hint="Leave an empty line between paragraphs.">
                <textarea id="description" rows={6} value={form.description} onChange={(e) => set("description", e.target.value)} className={cn(inputCls, "py-2.5")} />
              </Field>
              <Field label="Care instructions" htmlFor="care" error={errors.care}>
                <textarea id="care" rows={2} value={form.care} onChange={(e) => set("care", e.target.value)} className={cn(inputCls, "py-2.5")} />
              </Field>
            </div>
          </Card>

          <Card
            title="Saree details"
            description="Shown as a list on the product page."
            className="order-6"
            actions={
              <Button size="sm" variant="secondary" onClick={() => set("details", STANDARD_DETAILS(categoryName))}>
                <Wand2 className="h-3.5 w-3.5" /> Use standard details
              </Button>
            }
          >
            {form.details.length === 0 && <p className="mb-3 text-sm text-ink-500">No details yet.</p>}
            <ul className="space-y-3 sm:space-y-2">
              {form.details.map((d, i) => (
                <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 max-sm:rounded-lg max-sm:bg-ivory-50 max-sm:p-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto]">
                  <input value={d.label} onChange={(e) => set("details", form.details.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} placeholder="Label" aria-label={`Detail ${i + 1} label`} className={cn(inputCls, "h-10")} />
                  <input value={d.value} onChange={(e) => set("details", form.details.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} placeholder="Value" aria-label={`Detail ${i + 1} value`} className={cn(inputCls, "h-10 max-sm:col-span-2 max-sm:row-start-2")} />
                  <button type="button" onClick={() => set("details", form.details.filter((_, j) => j !== i))} aria-label={`Remove detail ${i + 1}`} className="grid h-10 w-10 place-items-center rounded-md text-ink-500 hover:bg-ivory-100 hover:text-rani-600 max-sm:col-start-2 max-sm:row-start-1">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <Button size="sm" variant="ghost" className="mt-3" onClick={() => set("details", [...form.details, { label: "", value: "" }])}>
              <Plus className="h-3.5 w-3.5" /> Add detail
            </Button>
          </Card>

          <Card title="Also show in" description="Menu sections and the Festive Edit (the saree always appears in its category)." className="order-7">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((c) => {
                const on = form.collections.includes(c.slug);
                return (
                  <label key={c.slug} className={cn("flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2.5 text-sm transition-colors", on ? "border-maroon-950/40 bg-maroon-950/5 text-ink-900" : "border-ivory-200 text-ink-700 hover:bg-ivory-50")}>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => set("collections", on ? form.collections.filter((x) => x !== c.slug) : [...form.collections, c.slug])}
                      className="h-4 w-4 accent-maroon-950"
                    />
                    {c.name}
                  </label>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Side column */}
        <div className="contents lg:sticky lg:top-6 lg:block lg:space-y-6 lg:self-start">
          <Card title="Publish" className="order-4">
            <div className="space-y-4">
              <div role="radiogroup" aria-label="Visibility" className="grid grid-cols-2 gap-2">
                {(["published", "draft"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={form.status === s}
                    onClick={() => set("status", s)}
                    className={cn("rounded-md border px-3 py-2.5 text-sm font-medium transition-colors", form.status === s ? "border-maroon-950 bg-maroon-950 text-gold-200" : "border-ivory-200 text-ink-700 hover:bg-ivory-50")}
                  >
                    {s === "published" ? "Live in shop" : "Draft"}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3 rounded-md bg-ivory-50 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-ink-900">In stock</p>
                  <p className="text-xs text-ink-500">Off shows “Sold out” in the shop.</p>
                </div>
                <Switch checked={form.inStock} onChange={(v) => set("inStock", v)} label="In stock" />
              </div>
              <Field label="Badge" htmlFor="badge">
                <select id="badge" value={form.badge} onChange={(e) => set("badge", e.target.value as FormState["badge"])} className={cn(inputCls, "h-10")}>
                  <option value="">None</option>
                  <option value="New">New</option>
                  <option value="Bestseller">Bestseller</option>
                </select>
              </Field>
              <button type="submit" disabled={saving} className={cn(buttonCls("primary"), "h-11 w-full max-lg:hidden")}>
                <Save className="h-4 w-4" /> {saving ? "Saving…" : product ? "Save changes" : "Create saree"}
              </button>
              {dirty && !saving && <p className="text-center text-xs text-gold-700 max-lg:hidden">You have unsaved changes</p>}
            </div>
          </Card>

          <Card title="Photos" description="First photo is the cover. Drag or use the arrows to reorder." className="order-2">
            <ImageManager images={form.images} onChange={(imgs) => set("images", imgs)} folder="products" baseName={form.slug || form.name} error={errors.images} />
          </Card>

          {form.images[0] && (
            <Card title="Preview" className="max-lg:hidden">
              <div className="mx-auto max-w-[200px]">
                <div className="relative aspect-[3/4] overflow-hidden rounded bg-ivory-100">
                  <Image src={form.images[0].src} alt="" fill sizes="200px" className="object-cover" />
                  {!form.inStock && <span className="absolute top-2 left-2 bg-ink-900 px-2 py-0.5 text-[0.6rem] tracking-widest text-white uppercase">Sold out</span>}
                </div>
                <p className="mt-2 text-[0.6rem] tracking-[0.2em] text-gold-700 uppercase">{categoryName}</p>
                <p className="font-display text-lg leading-snug text-maroon-950">{form.name || "Saree name"}</p>
                <p className="text-sm">
                  <span className="font-medium">{price ? formatINR(price) : "₹—"}</span>
                  {off > 0 && <span className="ml-2 text-xs text-ink-500 line-through">{formatINR(mrp)}</span>}
                </p>
              </div>
            </Card>
          )}

          {product && (
            <Button variant="danger" className="order-8 w-full" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="h-4 w-4" /> Delete saree
            </Button>
          )}
        </div>

        {/* Phone save bar — takes the tab bar's place on this page */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ivory-200 bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgb(34_19_15/0.06)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
            <p className={cn("text-sm", dirty ? "text-gold-700" : "text-ink-500")}>
              {dirty ? "Unsaved changes" : product ? "All changes saved" : "New saree"}
            </p>
            <button type="submit" disabled={saving} className={cn(buttonCls("primary"), "h-11 px-6")}>
              <Save className="h-4 w-4" /> {saving ? "Saving…" : product ? "Save" : "Create saree"}
            </button>
          </div>
        </div>
      </form>

      {product && (
        <ConfirmDialog
          open={confirmDelete}
          title="Delete this saree?"
          busy={busy}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() =>
            startTransition(async () => {
              const res = await deleteProduct(product.id);
              if (res && !res.ok) toast(res.message ?? "Couldn't delete.", "error");
            })
          }
        >
          <strong className="text-ink-900">{product.name}</strong> will be removed from the shop and its uploaded photos deleted. This can&rsquo;t be undone — to hide it temporarily, set it to Draft instead.
        </ConfirmDialog>
      )}
    </div>
  );
}

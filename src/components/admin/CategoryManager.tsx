"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Trash2, X } from "lucide-react";
import { useActionState, useEffect, useState, useTransition } from "react";
import type { AdminCategory } from "@/lib/admin-data";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { deleteCategory, moveCategory, saveCategory, type ActionState } from "@/app/admin/actions";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Flash";
import { ImageManager } from "./ImageManager";
import { Button, Field, buttonCls, inputCls } from "./ui";

type Draft = Omit<AdminCategory, "productCount" | "sortOrder" | "id"> & { id?: number };

const empty: Draft = { name: "", slug: "", tagline: "", summary: "", feel: "", bestFor: "", drape: "", care: "Dry clean only.", image: "", imageAlt: "" };

export function CategoryManager({ categories }: { categories: AdminCategory[] }) {
  const router = useRouter();
  const toast = useToast();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [confirm, setConfirm] = useState<AdminCategory | null>(null);
  const [pending, startTransition] = useTransition();

  const move = (c: AdminCategory, dir: -1 | 1) =>
    startTransition(async () => {
      const res = await moveCategory(c.id, dir);
      if (!res.ok) toast(res.message ?? "Couldn't reorder.", "error");
      router.refresh();
    });

  const remove = () => {
    if (!confirm) return;
    const target = confirm;
    startTransition(async () => {
      const res = await deleteCategory(target.id);
      toast(res.message ?? (res.ok ? "Deleted." : "Couldn't delete."), res.ok ? "ok" : "error");
      setConfirm(null);
      router.refresh();
    });
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setEditing({ ...empty })}>
          <Plus className="h-4 w-4" /> Add category
        </Button>
      </div>

      <ul className="space-y-3">
        {categories.map((c, i) => (
          <li key={c.id} className="rounded-xl border border-ivory-200 bg-white p-3 shadow-[0_1px_2px_rgb(34_19_15/0.04)] sm:flex sm:items-center sm:gap-4 sm:p-4">
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-ivory-100">
              {c.image && <Image src={c.image} alt="" fill sizes="48px" className="object-cover" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-xl leading-tight text-maroon-950">{c.name}</p>
              <p className="truncate text-sm text-ink-500">
                {c.tagline || "No tagline"} · /collections/{c.slug}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-ivory-100 px-3 py-1 text-sm text-ink-700">
              {c.productCount} {c.productCount === 1 ? "saree" : "sarees"}
            </span>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1 border-t border-ivory-200/70 pt-2 sm:mt-0 sm:border-0 sm:pt-0">
              <button type="button" disabled={pending || i === 0} onClick={() => move(c, -1)} aria-label={`Move ${c.name} up`} className="grid h-10 w-10 place-items-center rounded-md sm:h-9 sm:w-9 text-ink-500 hover:bg-ivory-100 disabled:opacity-30">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button type="button" disabled={pending || i === categories.length - 1} onClick={() => move(c, 1)} aria-label={`Move ${c.name} down`} className="grid h-10 w-10 place-items-center rounded-md sm:h-9 sm:w-9 text-ink-500 hover:bg-ivory-100 disabled:opacity-30">
                <ArrowDown className="h-4 w-4" />
              </button>
              {c.productCount > 0 && (
                <a href={`/collections/${c.slug}`} target="_blank" rel="noreferrer" aria-label={`View ${c.name} in the shop`} className="grid h-10 w-10 place-items-center rounded-md sm:h-9 sm:w-9 text-ink-500 hover:bg-ivory-100">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <button type="button" onClick={() => setEditing({ ...c })} aria-label={`Edit ${c.name}`} className="grid h-10 w-10 place-items-center rounded-md sm:h-9 sm:w-9 text-ink-500 hover:bg-ivory-100 hover:text-maroon-950">
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setConfirm(c)} aria-label={`Delete ${c.name}`} className="grid h-10 w-10 place-items-center rounded-md sm:h-9 sm:w-9 text-ink-500 hover:bg-rani-600/10 hover:text-rani-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {editing && (
          <CategoryDrawer
            key={editing.id ?? "new"}
            draft={editing}
            onClose={() => setEditing(null)}
            onSaved={(msg) => {
              toast(msg);
              setEditing(null);
              router.refresh();
            }}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!confirm}
        title={confirm && confirm.productCount > 0 ? "This category still has sarees" : "Delete this category?"}
        confirmLabel={confirm && confirm.productCount > 0 ? "OK" : "Delete"}
        busy={pending}
        onCancel={() => setConfirm(null)}
        onConfirm={() => (confirm && confirm.productCount > 0 ? setConfirm(null) : remove())}
      >
        {confirm && confirm.productCount > 0 ? (
          <>
            <strong className="text-ink-900">{confirm.name}</strong> has {confirm.productCount} saree{confirm.productCount === 1 ? "" : "s"}.{" "}
            Move them to another category (or delete them) first —{" "}
            <Link href={`/admin/products?category=${confirm.id}`} className="text-maroon-700 underline">
              see its sarees
            </Link>
            .
          </>
        ) : (
          <>
            <strong className="text-ink-900">{confirm?.name}</strong> will be removed from the shop and the Fabric Guide.
          </>
        )}
      </ConfirmDialog>
    </div>
  );
}

function CategoryDrawer({ draft, onClose, onSaved }: { draft: Draft; onClose: () => void; onSaved: (msg: string) => void }) {
  const [form, setForm] = useState<Draft>(draft);
  const [slugTouched, setSlugTouched] = useState(Boolean(draft.id));
  const [state, action, saving] = useActionState<ActionState, FormData>(saveCategory, { ok: false });
  const errors = state.errors ?? {};
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (state.ok) onSaved(state.message ?? "Saved.");
  }, [state, onSaved]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const text = (key: keyof Draft, label: string, hint?: string, rows = 0, max = 120) => (
    <Field label={label} htmlFor={`cat-${key}`} hint={hint} error={errors[key]}>
      {rows ? (
        <textarea id={`cat-${key}`} rows={rows} value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value as never)} maxLength={max} className={cn(inputCls, "py-2.5")} />
      ) : (
        <input id={`cat-${key}`} value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value as never)} maxLength={max} className={cn(inputCls, "h-10")} />
      )}
    </Field>
  );

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={draft.id ? "Edit category" : "Add category"}>
      <motion.button type="button" aria-label="Close" className="absolute inset-0 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.form
        action={action}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-white shadow-2xl"
      >
        <input type="hidden" name="payload" value={JSON.stringify(form)} />
        <div className="flex items-center justify-between border-b border-ivory-200 px-5 py-4 sm:px-6">
          <h2 className="font-display text-2xl text-maroon-950">{draft.id ? "Edit category" : "Add category"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full hover:bg-ivory-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
          {state.message && !state.ok && <p className="rounded-md bg-rani-600/10 px-3 py-2 text-sm text-rani-600">{state.message}</p>}
          <Field label="Name" htmlFor="cat-name" error={errors.name}>
            <input
              id="cat-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugTouched ? f.slug : slugify(e.target.value) }))}
              maxLength={60}
              className={cn(inputCls, "h-10")}
            />
          </Field>
          <Field label="Web address" htmlFor="cat-slug" error={errors.slug} hint={draft.id ? "Changing this breaks old links." : "Filled in from the name."}>
            <div className="flex items-center overflow-hidden rounded-md border border-ivory-200 bg-ivory-50">
              <span className="pl-3 text-sm whitespace-nowrap text-ink-500">/collections/</span>
              <input
                id="cat-slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                }}
                className="h-10 w-full bg-white px-2 text-base focus:outline-none sm:text-[0.95rem]"
              />
            </div>
          </Field>
          {text("tagline", "Tagline", "A short phrase, e.g. “The heirloom”.", 0, 60)}
          {text("summary", "Summary", "Shown at the top of the category page.", 3, 300)}
          <div className="rounded-lg border border-ivory-200 p-4">
            <p className="mb-3 text-sm font-medium text-ink-900">Fabric Guide</p>
            <div className="space-y-3">
              {text("feel", "Feels like")}
              {text("bestFor", "Best for")}
              {text("drape", "The drape")}
              {text("care", "Care", undefined, 0, 200)}
            </div>
          </div>
          <Field label="Guide photo" error={errors.image} hint="A close-up of the fabric works best.">
            <ImageManager
              images={form.image ? [{ src: form.image, alt: form.imageAlt }] : []}
              onChange={(imgs) => setForm((f) => ({ ...f, image: imgs[0]?.src ?? "", imageAlt: imgs[0]?.alt ?? "" }))}
              folder="categories"
              baseName={form.slug || form.name}
              max={1}
            />
          </Field>
        </div>
        <div className="flex justify-end gap-2 border-t border-ivory-200 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
          <button type="button" onClick={onClose} className={buttonCls("secondary")}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className={buttonCls("primary")}>
            {saving ? "Saving…" : draft.id ? "Save category" : "Add category"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}

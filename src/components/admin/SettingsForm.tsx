"use client";

import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus, Save, X } from "lucide-react";
import { useActionState, useEffect, useMemo, useState } from "react";
import type { Addon, SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { saveSettings, type ActionState } from "@/app/admin/actions";
import { useToast } from "./Flash";
import { Button, Card, Field, buttonCls, inputCls } from "./ui";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const toast = useToast();
  const router = useRouter();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [state, action, saving] = useActionState<ActionState, FormData>(saveSettings, { ok: false });
  const errors = state.errors ?? {};
  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(settings), [form, settings]);

  useEffect(() => {
    if (state.message) toast(state.message, state.ok ? "ok" : "error");
    if (state.ok) router.refresh();
  }, [state, toast, router]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const contact = (k: keyof SiteSettings["contact"], v: string) => setForm((f) => ({ ...f, contact: { ...f.contact, [k]: v } }));
  const social = (k: keyof SiteSettings["social"], v: string) => setForm((f) => ({ ...f, social: { ...f.social, [k]: v } }));
  const setAddons = (addons: Addon[]) => setForm((f) => ({ ...f, addons }));
  const setAnnouncements = (announcements: string[]) => setForm((f) => ({ ...f, announcements }));

  const move = <T,>(list: T[], i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return list;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  };

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="payload" value={JSON.stringify(form)} />

      <Card title="Contact details" description="Shown in the footer and used by every WhatsApp button.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="WhatsApp number" htmlFor="wa" error={errors["contact.whatsapp"]} hint="With country code, digits only — e.g. 919876543210.">
            <input id="wa" inputMode="tel" value={form.contact.whatsapp} onChange={(e) => contact("whatsapp", e.target.value)} placeholder="91XXXXXXXXXX" className={cn(inputCls, "h-11")} />
          </Field>
          <Field label="Phone (as shown)" htmlFor="phone" error={errors["contact.phone"]}>
            <input id="phone" value={form.contact.phone} onChange={(e) => contact("phone", e.target.value)} placeholder="+91 98765 43210" className={cn(inputCls, "h-11")} />
          </Field>
          <Field label="Email" htmlFor="email" error={errors["contact.email"]}>
            <input id="email" type="email" value={form.contact.email} onChange={(e) => contact("email", e.target.value)} className={cn(inputCls, "h-11")} />
          </Field>
          <Field label="Store hours" htmlFor="hours" error={errors["contact.hours"]}>
            <input id="hours" value={form.contact.hours} onChange={(e) => contact("hours", e.target.value)} placeholder="Mon – Sat, 10 am – 7 pm" className={cn(inputCls, "h-11")} />
          </Field>
          <Field label="Store address" htmlFor="address" error={errors["contact.address"]} className="sm:col-span-2">
            <textarea id="address" rows={2} value={form.contact.address} onChange={(e) => contact("address", e.target.value)} className={cn(inputCls, "py-2.5")} />
          </Field>
        </div>
      </Card>

      <Card title="Social media">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Instagram link" htmlFor="ig" error={errors["social.instagram"]}>
            <input id="ig" value={form.social.instagram} onChange={(e) => social("instagram", e.target.value)} placeholder="https://instagram.com/…" className={cn(inputCls, "h-11")} />
          </Field>
          <Field label="Instagram handle" htmlFor="handle" error={errors.instagramHandle}>
            <input id="handle" value={form.instagramHandle} onChange={(e) => setForm((f) => ({ ...f, instagramHandle: e.target.value }))} placeholder="@monaariyavastra" className={cn(inputCls, "h-11")} />
          </Field>
          <Field label="Facebook link" htmlFor="fb" error={errors["social.facebook"]}>
            <input id="fb" value={form.social.facebook} onChange={(e) => social("facebook", e.target.value)} placeholder="https://facebook.com/…" className={cn(inputCls, "h-11")} />
          </Field>
          <Field label="YouTube link" htmlFor="yt" error={errors["social.youtube"]}>
            <input id="yt" value={form.social.youtube} onChange={(e) => social("youtube", e.target.value)} placeholder="https://youtube.com/…" className={cn(inputCls, "h-11")} />
          </Field>
        </div>
      </Card>

      <Card title="Announcement bar" description="The rotating messages at the very top of the shop.">
        <ul className="space-y-2">
          {form.announcements.map((a, i) => (
            <li key={i} className="flex items-center gap-2">
              <input value={a} onChange={(e) => setAnnouncements(form.announcements.map((x, j) => (j === i ? e.target.value : x)))} maxLength={90} aria-label={`Message ${i + 1}`} className={cn(inputCls, "h-10")} />
              <IconBtn label="Move up" onClick={() => setAnnouncements(move(form.announcements, i, -1))} disabled={i === 0}>
                <ArrowUp className="h-4 w-4" />
              </IconBtn>
              <IconBtn label="Move down" onClick={() => setAnnouncements(move(form.announcements, i, 1))} disabled={i === form.announcements.length - 1}>
                <ArrowDown className="h-4 w-4" />
              </IconBtn>
              <IconBtn label="Remove" onClick={() => setAnnouncements(form.announcements.filter((_, j) => j !== i))}>
                <X className="h-4 w-4" />
              </IconBtn>
            </li>
          ))}
        </ul>
        {errors.announcements && <p className="mt-2 text-[0.8rem] text-rani-600">{errors.announcements}</p>}
        {form.announcements.length < 8 && (
          <Button size="sm" variant="ghost" className="mt-3" onClick={() => setAnnouncements([...form.announcements, ""])}>
            <Plus className="h-3.5 w-3.5" /> Add message
          </Button>
        )}
      </Card>

      <Card title="Finishing add-ons" description="Optional services customers can add on every product page.">
        <ul className="space-y-3">
          {form.addons.map((a, i) => (
            <li key={a.id || i} className="grid grid-cols-[100px_minmax(0,1fr)_auto] gap-2 rounded-lg border border-ivory-200 p-3 sm:grid-cols-[minmax(0,1fr)_120px_auto]">
              <input value={a.name} onChange={(e) => setAddons(form.addons.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} placeholder="Name, e.g. Falls & Pico Stitching" aria-label={`Add-on ${i + 1} name`} className={cn(inputCls, "col-span-2 h-10 sm:col-span-1")} />
              <IconBtn label="Remove add-on" className="sm:order-1" onClick={() => setAddons(form.addons.filter((_, j) => j !== i))}>
                <X className="h-4 w-4" />
              </IconBtn>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-ink-500">₹</span>
                <input
                  inputMode="numeric"
                  value={String(a.price)}
                  onChange={(e) => setAddons(form.addons.map((x, j) => (j === i ? { ...x, price: Number(e.target.value.replace(/[^\d]/g, "")) || 0 } : x)))}
                  aria-label={`Add-on ${i + 1} price`}
                  className={cn(inputCls, "h-10 pl-7")}
                />
              </div>
              <input value={a.note} onChange={(e) => setAddons(form.addons.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)))} placeholder="Short note shown to customers" aria-label={`Add-on ${i + 1} note`} className={cn(inputCls, "col-span-2 h-10 sm:order-2 sm:col-span-3")} />
              {(errors[`addons.${i}.name`] || errors[`addons.${i}.price`]) && (
                <p className="col-span-3 text-[0.8rem] text-rani-600 sm:order-3">{errors[`addons.${i}.name`] ?? errors[`addons.${i}.price`]}</p>
              )}
            </li>
          ))}
        </ul>
        {form.addons.length < 10 && (
          <Button size="sm" variant="ghost" className="mt-3" onClick={() => setAddons([...form.addons, { id: "", name: "", price: 0, note: "" }])}>
            <Plus className="h-3.5 w-3.5" /> Add an add-on
          </Button>
        )}
      </Card>

      <div className="sticky bottom-[calc(var(--admin-bottom,0px)+1rem)] z-10 flex items-center justify-end gap-3 rounded-xl border border-ivory-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
        {dirty && <span className="mr-auto text-sm text-gold-700">You have unsaved changes</span>}
        <button type="submit" disabled={saving || !dirty} className={buttonCls("primary")}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}

function IconBtn({ label, onClick, disabled, className, children }: { label: string; onClick: () => void; disabled?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-md text-ink-500 hover:bg-ivory-100 hover:text-maroon-950 disabled:opacity-30", className)}>
      {children}
    </button>
  );
}

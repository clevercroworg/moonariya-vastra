"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Lock, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { confirmPayment, startCheckout } from "@/app/(site)/checkout/actions";
import { useCatalog, useSiteSettings } from "@/components/providers/SiteDataProvider";
import { useStore } from "@/components/providers/StoreProvider";
import { ButtonLink } from "@/components/ui/Button";
import { INDIAN_STATES } from "@/lib/indian-states";
import { addonsTotal as sumAddons, whatsappLink } from "@/lib/settings-defaults";
import type { OrderCustomer } from "@/lib/types";
import { cn, formatINR } from "@/lib/utils";

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void; on: (event: "payment.failed", cb: (r: { error?: { description?: string } }) => void) => void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

const DETAILS_KEY = "mv-checkout-details";
const EMPTY: OrderCustomer = { name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" };

function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const field =
  "h-12 w-full rounded-sm border border-ivory-200 bg-white px-4 text-base text-ink-900 transition-colors placeholder:text-ink-500/60 focus:border-maroon-700 focus:ring-2 focus:ring-gold-400/30 focus:outline-none aria-[invalid=true]:border-rani-600";

export function CheckoutView() {
  const router = useRouter();
  const { bag, hydrated, clearBag } = useStore();
  const { products } = useCatalog();
  const settings = useSiteSettings();
  const [form, setForm] = useState<OrderCustomer>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [stage, setStage] = useState<"idle" | "starting" | "paying" | "confirming">("idle");

  // Remember the customer's details on this device for next time.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DETAILS_KEY);
      if (saved) setForm({ ...EMPTY, ...(JSON.parse(saved) as Partial<OrderCustomer>) });
    } catch {
      // storage unavailable
    }
  }, []);

  if (!hydrated) return <div className="container-x h-96 animate-pulse py-12" aria-busy="true" />;

  const lines = bag.flatMap((b) => {
    const product = products.find((p) => p.slug === b.slug);
    return product ? [{ ...b, product, unit: product.price + sumAddons(settings.addons, b.addons) }] : [];
  });
  const available = lines.filter((l) => l.product.inStock);
  const soldOut = lines.length - available.length;
  const total = available.reduce((s, l) => s + l.unit * l.qty, 0);
  const busy = stage !== "idle";

  if (available.length === 0) {
    return (
      <div className="container-x flex flex-col items-center py-20 text-center">
        <p className="font-display text-h2 text-maroon-950">Your bag is empty.</p>
        <p className="mt-3 text-ink-700">Add a saree to your bag to check out.</p>
        <ButtonLink href="/collections/all" variant="solid-dark" className="mt-8">
          Shop sarees
        </ButtonLink>
      </div>
    );
  }

  const set = (k: keyof OrderCustomer, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setErrors({});
    setStage("starting");
    try {
      localStorage.setItem(DETAILS_KEY, JSON.stringify(form));
    } catch {
      // ignore
    }

    const [res, loaded] = await Promise.all([
      startCheckout({ customer: form, lines: available.map((l) => ({ slug: l.slug, qty: l.qty, addons: l.addons })) }),
      loadRazorpay(),
    ]);
    if (!res.ok) {
      setErrors(res.errors ?? {});
      setMessage(res.message);
      setStage("idle");
      return;
    }
    if (!loaded || !window.Razorpay) {
      setMessage("We couldn’t load the payment window. Please check your connection and try again.");
      setStage("idle");
      return;
    }

    const rzp = new window.Razorpay({
      key: res.keyId,
      amount: res.amount,
      currency: "INR",
      order_id: res.razorpayOrderId,
      name: "Monaariya Vastra",
      description: `Order ${res.orderNumber}`,
      image: `${window.location.origin}/brand/emblem.png`,
      prefill: { name: res.customer.name, email: res.customer.email, contact: `+91${res.customer.phone}` },
      notes: { order_number: res.orderNumber },
      theme: { color: "#5c1222" },
      handler: async (response: RazorpayResponse) => {
        setStage("confirming");
        const done = await confirmPayment(response);
        if (done.ok) {
          clearBag();
          router.replace(`/order/${done.orderNumber}?t=${encodeURIComponent(done.token)}`);
        } else {
          setMessage(`${done.message} Payment ID: ${response.razorpay_payment_id}`);
          setStage("idle");
        }
      },
      modal: {
        ondismiss: () => {
          setStage((s) => (s === "confirming" ? s : "idle"));
          setMessage((m) => m || "Payment was not completed. Your bag is saved — you can try again.");
        },
      },
    });
    rzp.on("payment.failed", (r) => setMessage(r.error?.description ? `Payment failed: ${r.error.description}` : "Payment failed. Please try again."));
    setStage("paying");
    rzp.open();
  };

  const input = (k: keyof OrderCustomer, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, className = "") => (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink-900">{label}</span>
      <input value={form[k]} onChange={(e) => set(k, e.target.value)} aria-invalid={!!errors[k]} required className={field} {...props} />
      {errors[k] && <span className="mt-1 block text-[0.8rem] text-rani-600">{errors[k]}</span>}
    </label>
  );

  return (
    <form onSubmit={onSubmit} className="container-x grid gap-10 py-10 sm:py-12 lg:grid-cols-12 lg:gap-14" noValidate>
      <div className="lg:col-span-7">
        <h2 className="font-display text-3xl text-maroon-950">Delivery details</h2>
        <p className="mt-1 text-sm text-ink-500">We’ll share order and delivery updates on this phone number and email.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {input("name", "Full name", { autoComplete: "name" }, "sm:col-span-2")}
          {input("phone", "Mobile number", { autoComplete: "tel-national", inputMode: "tel", placeholder: "10-digit mobile number" })}
          {input("email", "Email", { autoComplete: "email", type: "email", inputMode: "email" })}
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-ink-900">Address</span>
            <textarea
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              aria-invalid={!!errors.address}
              autoComplete="street-address"
              rows={3}
              required
              placeholder="House / flat number, street, area, landmark"
              className={cn(field, "h-auto py-3")}
            />
            {errors.address && <span className="mt-1 block text-[0.8rem] text-rani-600">{errors.address}</span>}
          </label>
          {input("city", "City", { autoComplete: "address-level2" })}
          {input("pincode", "Pin code", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 6 })}
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-ink-900">State</span>
            <select value={form.state} onChange={(e) => set("state", e.target.value)} aria-invalid={!!errors.state} required autoComplete="address-level1" className={field}>
              <option value="">Choose your state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {errors.state && <span className="mt-1 block text-[0.8rem] text-rani-600">{errors.state}</span>}
          </label>
        </div>

        <p className="mt-6 flex items-start gap-2 text-sm text-ink-500">
          <Truck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} /> Free delivery across India, usually within 7–15 working days.
          See our <Link href="/policies/shipping" className="underline">shipping</Link> and{" "}
          <Link href="/policies/refund" className="underline">refund</Link> policies.
        </p>
      </div>

      <aside className="lg:col-span-5">
        <div className="rounded-sm bg-maroon-950 p-6 text-ivory-50 sm:p-7 lg:sticky lg:top-[100px]">
          <h2 className="font-display text-2xl">Your order</h2>
          <ul className="mt-5 space-y-4">
            {available.map((l) => (
              <li key={l.key} className="flex gap-3">
                <span className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-[2px] bg-ivory-200">
                  <Image src={l.product.image} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block leading-snug">{l.product.name}</span>
                  <span className="mt-0.5 block text-ivory-100/60">
                    Qty {l.qty}
                    {l.addons.length > 0 && ` · ${l.addons.length} add-on${l.addons.length > 1 ? "s" : ""}`}
                  </span>
                </span>
                <span className="text-sm whitespace-nowrap">{formatINR(l.unit * l.qty)}</span>
              </li>
            ))}
          </ul>
          {soldOut > 0 && <p className="mt-4 text-xs text-gold-300">{soldOut} sold-out item{soldOut > 1 ? "s are" : " is"} not included.</p>}
          <dl className="mt-6 space-y-2 border-t border-gold-400/20 pt-4 text-[0.92rem]">
            <div className="flex justify-between">
              <dt className="text-ivory-100/70">Shipping</dt>
              <dd className="text-gold-300">Free</dd>
            </div>
            <div className="flex items-baseline justify-between pt-2">
              <dt className="font-medium">Total</dt>
              <dd className="font-display text-3xl text-gold-200">{formatINR(total)}</dd>
            </div>
          </dl>

          {message && (
            <p role="alert" className="mt-5 rounded-sm bg-rani-600/15 px-3 py-2.5 text-sm text-ivory-50">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-6 flex h-13 w-full items-center justify-center gap-2 bg-gold-gradient py-4 text-[0.8rem] font-medium tracking-[0.2em] text-maroon-950 uppercase transition-opacity disabled:opacity-70"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {stage === "confirming" ? "Confirming payment…" : stage === "idle" ? `Pay ${formatINR(total)} securely` : "Opening payment…"}
          </button>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ivory-100/60">
            <ShieldCheck className="h-3.5 w-3.5" /> Secured by Razorpay · UPI, cards, net banking & wallets
          </p>
          {settings.contact.whatsapp && (
            <a href={whatsappLink(settings.contact.whatsapp, "Hi, I need help with my order.")} className="mt-3 block text-center text-xs text-gold-300 underline">
              Prefer to order on WhatsApp?
            </a>
          )}
        </div>
      </aside>
    </form>
  );
}

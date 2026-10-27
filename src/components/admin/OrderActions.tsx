"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateOrder } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import { useToast } from "./Flash";
import { Button, Card, Field, inputCls } from "./ui";

const FLOW = [
  { status: "paid", label: "To ship" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
  { status: "cancelled", label: "Cancelled" },
  { status: "refunded", label: "Refunded" },
] as const;

type Props = { order: { id: number; status: string; tracking: string; adminNote: string } };

export function OrderActions({ order }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [status, setStatus] = useState(order.status);
  const [tracking, setTracking] = useState(order.tracking);
  const [note, setNote] = useState(order.adminNote);
  const [pending, start] = useTransition();
  const paid = !["pending", "failed"].includes(order.status);

  const save = () =>
    start(async () => {
      const res = await updateOrder({
        id: order.id,
        ...(paid && status !== order.status ? { status: status as (typeof FLOW)[number]["status"] } : {}),
        tracking,
        adminNote: note,
      });
      toast(res.message ?? (res.ok ? "Saved." : "Couldn’t save."), res.ok ? "ok" : "error");
      if (res.ok) router.refresh();
    });

  return (
    <Card title="Fulfilment">
      <div className="space-y-4">
        {paid ? (
          <div role="radiogroup" aria-label="Order status" className="grid grid-cols-2 gap-2">
            {FLOW.map((f) => (
              <button
                key={f.status}
                type="button"
                role="radio"
                aria-checked={status === f.status}
                onClick={() => setStatus(f.status)}
                className={cn(
                  "rounded-md border px-3 py-2.5 text-sm font-medium transition-colors",
                  status === f.status ? "border-maroon-950 bg-maroon-950 text-gold-200" : "border-ivory-200 text-ink-700 hover:bg-ivory-50",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-md bg-ivory-50 px-3 py-2.5 text-sm text-ink-700">
            This order hasn’t been paid. It updates automatically if Razorpay confirms the payment.
          </p>
        )}
        <Field label="Courier & tracking" htmlFor="tracking" hint="Shown to the customer on their order page.">
          <textarea id="tracking" rows={2} value={tracking} onChange={(e) => setTracking(e.target.value)} maxLength={300} placeholder="e.g. Delhivery · AWB 1234567890" className={cn(inputCls, "py-2.5")} />
        </Field>
        <Field label="Private note" htmlFor="note" hint="Only visible in the admin.">
          <textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} className={cn(inputCls, "py-2.5")} />
        </Field>
        <Button className="h-11 w-full" disabled={pending} onClick={save}>
          {pending ? "Saving…" : "Save"}
        </Button>
        {status === "refunded" && status !== order.status && (
          <p className="text-xs text-ink-500">Marking as refunded does not send money — issue the refund from the Razorpay dashboard first.</p>
        )}
      </div>
    </Card>
  );
}

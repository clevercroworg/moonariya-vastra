import { Pill } from "./ui";

const tone = {
  paid: ["amber", "To ship"],
  shipped: ["maroon", "Shipped"],
  delivered: ["green", "Delivered"],
  pending: ["neutral", "Awaiting payment"],
  failed: ["red", "Payment failed"],
  cancelled: ["neutral", "Cancelled"],
  refunded: ["neutral", "Refunded"],
} as const;

export function OrderStatusPill({ status }: { status: string }) {
  const [t, label] = tone[status as keyof typeof tone] ?? (["neutral", status] as const);
  return <Pill tone={t}>{label}</Pill>;
}

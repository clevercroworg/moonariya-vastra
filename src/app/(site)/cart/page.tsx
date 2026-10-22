import type { Metadata } from "next";
import { PageHeader } from "@/components/shop/PageHeader";
import { CartView } from "@/components/shop/CartView";

export const metadata: Metadata = { title: "Your bag", robots: { index: false } };

export default function CartPage() {
  return (
    <>
      <PageHeader crumb="Bag" eyebrow="Shopping bag" title="Your" italic="bag." />
      <CartView />
    </>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/shop/PageHeader";
import { CheckoutView } from "@/components/shop/CheckoutView";

export const metadata: Metadata = { title: "Secure checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader crumb="Checkout" eyebrow="Secure checkout" title="Almost" italic="yours." />
      <CheckoutView />
    </>
  );
}

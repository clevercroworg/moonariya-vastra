import type { Metadata } from "next";
import { PageHeader } from "@/components/shop/PageHeader";
import { WishlistView } from "@/components/shop/WishlistView";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default function WishlistPage() {
  return (
    <>
      <PageHeader crumb="Wishlist" eyebrow="Saved for later" title="Your" italic="wishlist." />
      <WishlistView />
    </>
  );
}

import type { Metadata } from "next";
import { assignableCollections } from "@/data/collections";
import { listAdminCategories } from "@/lib/admin-data";
import { ToastProvider } from "@/components/admin/Flash";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Add saree" };

export default async function NewProductPage() {
  const categories = await listAdminCategories();
  return (
    <ToastProvider>
      <ProductForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} collections={assignableCollections} />
    </ToastProvider>
  );
}

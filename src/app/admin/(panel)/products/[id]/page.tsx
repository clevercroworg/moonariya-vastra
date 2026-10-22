import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { assignableCollections } from "@/data/collections";
import { getAdminProduct, listAdminCategories } from "@/lib/admin-data";
import { ToastProvider } from "@/components/admin/Flash";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Edit saree" };

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/products/[id]">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  const [product, categories] = await Promise.all([getAdminProduct(numericId), listAdminCategories()]);
  if (!product) notFound();

  const flash = sp.saved ? "Saved — the shop is updated." : sp.duplicated ? "Copied as a draft. Add the new colour and photos." : undefined;

  return (
    <ToastProvider initial={flash}>
      <ProductForm
        key={product.updatedAt}
        product={product}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        collections={assignableCollections}
      />
    </ToastProvider>
  );
}

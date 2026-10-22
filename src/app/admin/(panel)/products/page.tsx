import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listAdminCategories, listAdminProducts } from "@/lib/admin-data";
import { PageHeader, buttonCls } from "@/components/admin/ui";
import { ToastProvider } from "@/components/admin/Flash";
import { ProductTable } from "@/components/admin/ProductTable";

export const metadata: Metadata = { title: "Sarees" };

export default async function ProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const [products, categories, sp] = await Promise.all([listAdminProducts(), listAdminCategories(), searchParams]);
  const flash = sp.deleted ? "Saree deleted." : undefined;
  const initial = {
    status: typeof sp.status === "string" ? sp.status : "all",
    category: typeof sp.category === "string" ? sp.category : "all",
  };

  return (
    <ToastProvider initial={flash}>
      <PageHeader
        title="Sarees"
        description={`${products.length} sarees · ${products.filter((p) => p.status === "published").length} live in the shop`}
        actions={
          <Link href="/admin/products/new" className={buttonCls("primary")}>
            <Plus className="h-4 w-4" /> Add saree
          </Link>
        }
      />
      <ProductTable products={products} categories={categories.map((c) => ({ id: c.id, name: c.name }))} initial={initial} />
    </ToastProvider>
  );
}

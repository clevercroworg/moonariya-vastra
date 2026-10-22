import type { Metadata } from "next";
import { listAdminCategories } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/ui";
import { ToastProvider } from "@/components/admin/Flash";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const categories = await listAdminCategories();
  return (
    <ToastProvider>
      <PageHeader
        title="Categories"
        description="Your saree categories — each gets its own shop page and a Fabric Guide entry once it has sarees."
      />
      <CategoryManager categories={categories} />
    </ToastProvider>
  );
}

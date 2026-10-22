import type { Metadata } from "next";
import { getAdminSettings } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/ui";
import { ToastProvider } from "@/components/admin/Flash";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await getAdminSettings();
  return (
    <ToastProvider>
      <PageHeader title="Settings" description="Contact details, social links, the announcement bar and add-on prices." />
      <SettingsForm key={JSON.stringify(settings)} settings={settings} />
    </ToastProvider>
  );
}

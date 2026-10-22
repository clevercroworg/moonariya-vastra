import type { Metadata } from "next";
import { Suspense } from "react";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · Monaariya Vastra" },
  robots: { index: false, follow: false },
};

// Clerk only loads in the admin area — the shop never ships its scripts.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-maroon-950" />}>
      <ClerkProvider
        signInUrl="/admin/login"
        signInFallbackRedirectUrl="/admin"
        signUpFallbackRedirectUrl="/admin"
        afterSignOutUrl="/admin/login"
        appearance={{
          variables: {
            colorPrimary: "#5c1222",
            colorPrimaryForeground: "#f6e6bf",
            colorForeground: "#22130f",
            colorMutedForeground: "#7c6a61",
            colorBackground: "#ffffff",
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            borderRadius: "8px",
          },
        }}
      >
        {children}
      </ClerkProvider>
    </Suspense>
  );
}

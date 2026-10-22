import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { getAdminState } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { buttonCls } from "@/components/admin/ui";

// Every admin page renders behind this gate: signed in + email on the allowlist.
export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}

async function Gate({ children }: { children: React.ReactNode }) {
  const state = await getAdminState();
  if (state.status === "signed-out") redirect("/admin/login");
  if (state.status === "forbidden") return <AccessDenied email={state.email} configured={state.configured} />;
  return <AdminShell user={{ name: state.name, email: state.email, imageUrl: state.imageUrl }}>{children}</AdminShell>;
}

function AdminLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-ivory-100/60" aria-busy="true">
      <Image src="/brand/emblem.png" alt="Loading" width={292} height={271} className="h-16 w-auto animate-pulse rounded-full bg-maroon-950 p-2" />
    </div>
  );
}

function AccessDenied({ email, configured }: { email: string | null; configured: boolean }) {
  return (
    <div className="grid min-h-screen place-items-center bg-ivory-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-ivory-200 bg-white p-8 text-center shadow-sm">
        <Image src="/brand/emblem.png" alt="" width={292} height={271} className="mx-auto h-16 w-auto rounded-full bg-maroon-950 p-2" />
        <h1 className="mt-6 font-display text-3xl text-maroon-950">Access not approved</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-700">
          {email ? (
            <>
              You&rsquo;re signed in as <strong className="text-ink-900">{email}</strong>, but this email isn&rsquo;t on the admin list.
            </>
          ) : (
            "Your account has no verified email address."
          )}{" "}
          {configured
            ? "Ask the shop owner to add your email to ADMIN_EMAILS."
            : "No admin emails are configured yet — add them to the ADMIN_EMAILS environment variable."}
        </p>
        <div className="mt-6 flex justify-center">
          <SignOutButton redirectUrl="/admin/login">
            <button type="button" className={buttonCls("secondary")}>
              Sign out and use another account
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}

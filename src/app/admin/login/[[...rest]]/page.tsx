import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { FlourishRule } from "@/components/ui/Ornaments";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-maroon-950 lg:block">
        <div aria-hidden className="bg-lattice absolute inset-0" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgb(221_180_106/0.18),transparent_70%)]" />
        <div className="relative flex h-full flex-col items-center justify-center px-12 text-center">
          <Image src="/brand/logo-full.png" alt="Monaariya Vastra — Timeless Drapes, Modern Grace" width={934} height={271} className="h-auto w-[380px]" preload />
          <FlourishRule className="mt-10 text-gold-400" />
          <p className="mt-6 max-w-sm leading-relaxed text-ivory-100/70">
            Manage your sarees, categories, prices and shop details — every change goes live on the website instantly.
          </p>
        </div>
      </div>

      {/* Sign-in */}
      <div className="flex flex-col bg-ivory-50">
        <div className="flex items-center justify-between bg-maroon-950 px-5 py-4 lg:bg-transparent lg:px-6 lg:py-5">
          <Image src="/brand/logo-nav.png" alt="Monaariya Vastra" width={934} height={271} className="h-9 w-auto lg:hidden" preload />
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gold-300 hover:text-gold-200 lg:text-ink-500 lg:hover:text-maroon-700">
            <ArrowLeft className="h-4 w-4" /> Back to the shop
          </Link>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-4 pt-10 pb-16 lg:pt-0">
          <div className="mb-8 text-center">
            <p className="text-[0.7rem] font-medium tracking-[0.32em] text-gold-700 uppercase">Monaariya Vastra</p>
            <h1 className="mt-2 font-display text-[2.4rem] leading-tight text-maroon-950">Admin sign in</h1>
            <p className="mt-1 text-sm text-ink-500">Only approved team members can access the dashboard.</p>
          </div>
          <SignIn routing="path" path="/admin/login" withSignUp fallbackRedirectUrl="/admin" />
        </div>
      </div>
    </div>
  );
}

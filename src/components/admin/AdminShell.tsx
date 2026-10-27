"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { ExternalLink, FolderTree, LayoutDashboard, LogOut, Menu, Package, Settings, Shirt, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", Icon: Package },
  { href: "/admin/products", label: "Sarees", Icon: Shirt },
  { href: "/admin/categories", label: "Categories", Icon: FolderTree },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

export function AdminShell({ user, children }: { user: { name: string; email: string; imageUrl: string }; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The saree editor has its own save bar on phones, so the tab bar steps aside there.
  const editing = /^\/admin\/products\/(new|\d+)\/?$/.test(pathname);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the drawer after navigating
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const sidebar = (
    <div className="flex h-full flex-col bg-maroon-950 text-ivory-100">
      <div className="bg-lattice flex items-center justify-between px-5 pt-6 pb-5">
        <Link href="/admin" className="block" aria-label="Admin dashboard">
          <Image src="/brand/logo-nav.png" alt="Monaariya Vastra" width={934} height={271} className="h-11 w-auto" preload />
          <span className="mt-2 block text-[0.62rem] font-medium tracking-[0.32em] text-gold-400 uppercase">Admin</span>
        </Link>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-full text-gold-300 lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="hairline-gold h-px w-full opacity-40" />
      <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Admin">
        {nav.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[0.95rem] transition-colors",
                active ? "bg-gold-400/15 text-gold-200" : "text-ivory-100/75 hover:bg-white/5 hover:text-ivory-50",
              )}
            >
              <Icon className={cn("h-[18px] w-[18px]", active ? "text-gold-300" : "text-ivory-100/50")} strokeWidth={1.6} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-3 border-t border-gold-400/15 px-4 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-ivory-100/75 hover:text-gold-200"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.6} /> View the shop
        </Link>
        <div className="flex items-center gap-3 rounded-lg bg-white/5 p-2.5">
          {user.imageUrl ? (
            <Image src={user.imageUrl} alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" unoptimized />
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-400 text-sm font-medium text-maroon-950">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-ivory-50">{user.name}</p>
            <p className="truncate text-[0.72rem] text-ivory-100/50">{user.email}</p>
          </div>
          <SignOutButton redirectUrl="/admin/login">
            <button type="button" aria-label="Sign out" title="Sign out" className="grid h-9 w-9 place-items-center rounded-full text-ivory-100/60 hover:bg-white/10 hover:text-gold-200">
              <LogOut className="h-4 w-4" strokeWidth={1.6} />
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory-100/60 [--admin-bottom:calc(4rem+env(safe-area-inset-bottom))] lg:[--admin-bottom:0px]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>

      {/* Mobile top bar + drawer */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-maroon-950 px-4 lg:hidden">
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full text-gold-300">
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/admin" aria-label="Admin dashboard">
          <Image src="/brand/logo-nav.png" alt="Monaariya Vastra" width={934} height={271} className="h-8 w-auto" />
        </Link>
        <a href="/" target="_blank" rel="noreferrer" aria-label="View the shop" className="grid h-10 w-10 place-items-center rounded-full text-gold-300">
          <ExternalLink className="h-5 w-5" strokeWidth={1.6} />
        </a>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">{sidebar}</aside>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-[calc(var(--admin-bottom)+1.5rem)] sm:px-6 sm:pt-8 lg:px-10 lg:py-10">{children}</div>
      </main>

      {/* Phone tab bar */}
      {!editing && (
        <nav aria-label="Admin sections" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-gold-400/15 bg-maroon-950 pb-[env(safe-area-inset-bottom)] lg:hidden">
          {nav.map(({ href, label, Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn("relative flex h-16 flex-col items-center justify-center gap-1 text-[0.7rem]", active ? "text-gold-200" : "text-ivory-100/60")}
              >
                {active && <span className="absolute top-0 h-0.5 w-10 rounded-full bg-gold-400" />}
                <Icon className="h-5 w-5" strokeWidth={1.6} />
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}

"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

export function ShareRow({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — nothing to do
    }
  };
  const shareWhatsApp = () => {
    const text = `${name} — Monaariya Vastra ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const btn =
    "flex h-10 items-center gap-2 rounded-full border border-ivory-200 px-4 text-xs tracking-wider text-ink-700 transition-colors hover:border-maroon-950/40 hover:text-maroon-950";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-1 text-[0.62rem] text-ink-500">Share</span>
      <button type="button" onClick={shareWhatsApp} className={btn}>
        <WhatsAppIcon className="h-4 w-4 text-[#1f8f55]" /> WhatsApp
      </button>
      <button type="button" onClick={copy} className={btn} aria-live="polite">
        {copied ? <Check className="h-4 w-4 text-emerald-700" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}

"use client";

import { motion } from "motion/react";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { whatsappHref } from "./SocialLinks";

export function WhatsAppButton() {
  const external = whatsappHref.startsWith("http");
  return (
    <motion.a
      href={whatsappHref}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group/wa fixed right-4 bottom-4 z-[60] flex items-center transition-[bottom] duration-300 sm:right-6 sm:bottom-6 max-lg:[html[data-buybar]_&]:bottom-24"
    >
      <span className="pointer-events-none mr-3 hidden translate-x-2 rounded-full bg-maroon-950 px-4 py-2 text-xs font-medium tracking-[0.12em] text-gold-200 uppercase opacity-0 shadow-xl transition-all duration-300 group-hover/wa:translate-x-0 group-hover/wa:opacity-100 sm:block">
        Chat with us
      </span>
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#1f8f55] text-white shadow-[0_12px_30px_-8px_rgb(0_0_0/0.5)] ring-2 ring-gold-300/70 transition-transform duration-300 group-hover/wa:scale-105">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#1f8f55]/40 [animation-duration:2.6s]" />
        <WhatsAppIcon className="relative h-7 w-7" />
      </span>
    </motion.a>
  );
}

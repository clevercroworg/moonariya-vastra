"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { FrameCorners, LotusMark } from "@/components/ui/Ornaments";
import { MaskLines, Reveal } from "@/components/ui/Reveal";

// TODO(content): connect to the email provider (e.g. via a Server Action) when the backend is ready.
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState("error");
      return;
    }
    setState("done");
  };

  return (
    <section aria-labelledby="newsletter-title" className="relative overflow-hidden bg-maroon-950 py-20 text-ivory-50 sm:py-28">
      <div aria-hidden className="bg-lattice absolute inset-0" />
      <Image
        src="/brand/emblem.png"
        alt=""
        aria-hidden
        width={292}
        height={271}
        className="pointer-events-none absolute -bottom-24 -left-24 w-[420px] max-w-none opacity-[0.07]"
      />
      <Image
        src="/brand/emblem.png"
        alt=""
        aria-hidden
        width={292}
        height={271}
        className="pointer-events-none absolute -top-24 -right-24 w-[420px] max-w-none -scale-x-100 opacity-[0.07]"
      />

      <div className="container-x relative">
        <div className="relative mx-auto max-w-3xl px-6 py-14 text-center sm:px-14 sm:py-16">
          <FrameCorners className="inset-0 text-gold-400/70" />
          <Reveal className="flex flex-col items-center gap-3 text-gold-400">
            <LotusMark className="h-6" />
            <span className="eyebrow text-gold-300">The Monaariya Circle</span>
          </Reveal>
          <h2 id="newsletter-title" className="mt-6 font-display text-h1 font-medium">
            <MaskLines
              lines={[
                "First to see",
                <em key="e" className="text-gold-gradient font-normal">
                  every new weave.
                </em>,
              ]}
            />
          </h2>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-5 max-w-md leading-relaxed text-ivory-100/75">
              Join our circle for new arrivals, festive edits and members-only offers. No spam — just beautiful sarees.
            </p>
          </Reveal>

          <Reveal delay={0.3} className="mx-auto mt-9 max-w-lg">
            <AnimatePresence mode="wait" initial={false}>
              {state === "done" ? (
                <motion.p
                  key="done"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-3 rounded-full border border-gold-400/40 px-6 py-4 text-gold-200"
                  role="status"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-gradient text-maroon-950">
                    <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </span>
                  Thank you — welcome to the Monaariya circle.
                </motion.p>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={submit}
                  noValidate
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state === "error") setState("idle");
                    }}
                    aria-invalid={state === "error"}
                    aria-describedby={state === "error" ? "newsletter-error" : undefined}
                    placeholder="Your email address"
                    className="h-13 w-full rounded-full sm:flex-1 border border-gold-400/35 bg-maroon-900/60 px-6 text-ivory-50 placeholder:text-ivory-100/40 transition-colors focus:border-gold-300 focus:outline-none aria-[invalid=true]:border-rani-600"
                  />
                  <button
                    type="submit"
                    className="group/nl inline-flex h-13 items-center justify-center gap-2 rounded-full bg-gold-gradient px-7 text-[0.78rem] font-medium tracking-[0.2em] text-maroon-950 uppercase shadow-[0_10px_30px_-12px_rgb(221_180_106/0.6)] transition-shadow hover:shadow-[0_14px_36px_-10px_rgb(221_180_106/0.8)]"
                  >
                    Subscribe
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/nl:translate-x-1" strokeWidth={1.5} aria-hidden />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
            {state === "error" && (
              <p id="newsletter-error" className="mt-3 text-sm text-gold-200" role="alert">
                Please enter a valid email address.
              </p>
            )}
            <p className="mt-5 text-xs text-ivory-100/45">We respect your inbox. Unsubscribe anytime.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Toast = { id: number; text: string; tone: "ok" | "error" };
const ToastContext = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});

export const useToast = () => useContext(ToastContext);

/** Small toast system for admin feedback. `initial` shows a message on page load (e.g. after a redirect). */
export function ToastProvider({ children, initial }: { children: ReactNode; initial?: string }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const show = useCallback((text: string, tone: Toast["tone"] = "ok") => setToast({ id: Date.now(), text, tone }), []);

  useEffect(() => {
    if (!initial) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show the flash message once after redirect
    show(initial);
    // drop ?saved=1 etc. from the address bar so a refresh doesn't repeat it
    const url = new URL(window.location.href);
    ["saved", "deleted", "duplicated"].forEach((k) => url.searchParams.delete(k));
    window.history.replaceState(null, "", url.toString());
  }, [initial, show]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-[4.25rem] z-[90] flex justify-center px-4 lg:top-auto lg:bottom-6">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-2.5 rounded-full bg-maroon-950 px-5 py-3 text-sm text-ivory-50 shadow-2xl"
            >
              {toast.tone === "ok" ? (
                <CheckCircle2 className="h-4 w-4 text-gold-300" aria-hidden />
              ) : (
                <XCircle className="h-4 w-4 text-rani-600" aria-hidden />
              )}
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

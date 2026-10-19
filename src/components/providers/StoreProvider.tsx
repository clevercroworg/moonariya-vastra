"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

// Lightweight client-side bag + wishlist so the homepage feels alive.
// TODO(cart): replace with the real cart/checkout backend when inner pages are built.

type StoreValue = {
  bag: string[];
  wishlist: string[];
  addToBag: (slug: string, name: string) => void;
  toggleWishlist: (slug: string, name: string) => void;
  isWishlisted: (slug: string) => boolean;
};

const StoreContext = createContext<StoreValue | null>(null);
const KEY = "mv-store-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [{ bag, wishlist }, setStore] = useState<{ bag: string[]; wishlist: string[] }>({
    bag: [],
    wishlist: [],
  });
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw) as { bag?: string[]; wishlist?: string[] };
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
        setStore({
          bag: Array.isArray(data.bag) ? data.bag : [],
          wishlist: Array.isArray(data.wishlist) ? data.wishlist : [],
        });
      }
    } catch {
      // storage unavailable — start empty
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ bag, wishlist }));
    } catch {
      // ignore
    }
  }, [bag, wishlist]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const addToBag = useCallback((slug: string, name: string) => {
    setStore((s) => ({ ...s, bag: [...s.bag, slug] }));
    setToast({ id: Date.now(), text: `${name} added to your bag` });
  }, []);

  const toggleWishlist = useCallback(
    (slug: string, name: string) => {
      const has = wishlist.includes(slug);
      setStore((s) => ({
        ...s,
        wishlist: has ? s.wishlist.filter((x) => x !== slug) : [...s.wishlist, slug],
      }));
      setToast({
        id: Date.now(),
        text: has ? `${name} removed from your wishlist` : `${name} saved to your wishlist`,
      });
    },
    [wishlist],
  );

  const value = useMemo<StoreValue>(
    () => ({
      bag,
      wishlist,
      addToBag,
      toggleWishlist,
      isWishlisted: (slug) => wishlist.includes(slug),
    }),
    [bag, wishlist, addToBag, toggleWishlist],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4"
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex max-w-md items-center gap-3 rounded-full border border-gold-400/40 bg-maroon-950/95 py-3 pr-6 pl-3 text-sm text-ivory-50 shadow-2xl backdrop-blur"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-gradient text-maroon-950">
                <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
              </span>
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

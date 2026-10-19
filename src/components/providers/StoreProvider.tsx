"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Client-side bag, wishlist and recently-viewed, persisted in localStorage.
// TODO(cart): replace with the real cart/checkout backend.

export type BagItem = {
  /** slug + sorted add-ons — the same saree with different finishing is a separate line */
  key: string;
  slug: string;
  qty: number;
  addons: string[];
};

type State = { bag: BagItem[]; wishlist: string[]; recent: string[] };

type StoreValue = State & {
  bagCount: number;
  addToBag: (slug: string, name: string, opts?: { qty?: number; addons?: string[]; silent?: boolean }) => void;
  setQty: (key: string, qty: number) => void;
  removeFromBag: (key: string) => void;
  toggleWishlist: (slug: string, name: string) => void;
  isWishlisted: (slug: string) => boolean;
  markViewed: (slug: string) => void;
  hydrated: boolean;
};

const StoreContext = createContext<StoreValue | null>(null);
const KEY = "mv-store-v2";
const LEGACY_KEY = "mv-store-v1";
export const MAX_QTY = 10;

const lineKey = (slug: string, addons: string[]) => [slug, ...[...addons].sort()].join("|");

function readStored(): State | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw) as Partial<State>;
      return {
        bag: Array.isArray(d.bag) ? d.bag.filter((i) => i && typeof i.slug === "string") : [],
        wishlist: Array.isArray(d.wishlist) ? d.wishlist : [],
        recent: Array.isArray(d.recent) ? d.recent : [],
      };
    }
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const d = JSON.parse(legacy) as { bag?: string[]; wishlist?: string[] };
      const bag: BagItem[] = [];
      for (const slug of d.bag ?? []) {
        const line = bag.find((b) => b.slug === slug);
        if (line) line.qty = Math.min(MAX_QTY, line.qty + 1);
        else bag.push({ key: lineKey(slug, []), slug, qty: 1, addons: [] });
      }
      return { bag, wishlist: d.wishlist ?? [], recent: [] };
    }
  } catch {
    // storage unavailable or corrupt — start empty
  }
  return null;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ bag: [], wishlist: [], recent: [] });
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    const stored = readStored();
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from storage */
    if (stored) setState(stored);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persist only after hydration has landed in state — writing the empty initial
  // state first (twice under StrictMode) would wipe the saved bag.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const addToBag = useCallback<StoreValue["addToBag"]>((slug, name, opts) => {
    const qty = Math.max(1, Math.min(MAX_QTY, opts?.qty ?? 1));
    const addons = opts?.addons ?? [];
    const key = lineKey(slug, addons);
    setState((s) => {
      const existing = s.bag.find((b) => b.key === key);
      const bag = existing
        ? s.bag.map((b) => (b.key === key ? { ...b, qty: Math.min(MAX_QTY, b.qty + qty) } : b))
        : [...s.bag, { key, slug, qty, addons: [...addons].sort() }];
      return { ...s, bag };
    });
    if (!opts?.silent) setToast({ id: Date.now(), text: `${name} added to your bag` });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setState((s) => ({
      ...s,
      bag: s.bag.map((b) => (b.key === key ? { ...b, qty: Math.max(1, Math.min(MAX_QTY, qty)) } : b)),
    }));
  }, []);

  const removeFromBag = useCallback((key: string) => {
    setState((s) => ({ ...s, bag: s.bag.filter((b) => b.key !== key) }));
  }, []);

  const toggleWishlist = useCallback(
    (slug: string, name: string) => {
      const has = state.wishlist.includes(slug);
      setState((s) => ({
        ...s,
        wishlist: has ? s.wishlist.filter((x) => x !== slug) : [...s.wishlist, slug],
      }));
      setToast({
        id: Date.now(),
        text: has ? `${name} removed from your wishlist` : `${name} saved to your wishlist`,
      });
    },
    [state.wishlist],
  );

  const markViewed = useCallback((slug: string) => {
    setState((s) => (s.recent[0] === slug ? s : { ...s, recent: [slug, ...s.recent.filter((r) => r !== slug)].slice(0, 12) }));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      bagCount: state.bag.reduce((n, b) => n + b.qty, 0),
      addToBag,
      setQty,
      removeFromBag,
      toggleWishlist,
      isWishlisted: (slug) => state.wishlist.includes(slug),
      markViewed,
      hydrated,
    }),
    [state, addToBag, setQty, removeFromBag, toggleWishlist, markViewed, hydrated],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-4 sm:bottom-6"
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

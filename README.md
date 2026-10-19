# Monaariya Vastra — website

*Timeless Drapes, Modern Grace.* E-commerce site for the Monaariya Vastra saree brand.
Built with Next.js 16 (App Router, Cache Components), Tailwind CSS v4, Motion, Embla and Lenis.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (homepage is fully static)
npm run start
```

## Where things live

| Path | What |
|---|---|
| `DESIGN.md` | Design system: colours, type, motion, components. Read before building inner pages. |
| `src/data/` | **All editable content**: brand/contact info (`site.ts`), categories, products, homepage copy (`home.ts`). |
| `src/components/home/` | One file per homepage section (hero, arc carousel, saree show, …). |
| `src/components/layout/` | Header, mega menu, search, mobile menu, footer, intro curtain. |
| `src/components/ui/` | Shared pieces: buttons, product card, section heading, ornaments, reveal animations. |
| `src/app/[...slug]/page.tsx` | Temporary "coming soon" page for every inner link until those pages are built. |
| `public/brand/` | Logo (navbar / full / emblem), cut from the client's banner. |
| `public/images/` | Product photos (real) and generated images (placeholders until replaced). |
| `client-assets/` | Original files sent by the client. |

## Images

Generated images replace placeholders by **file name** — no code changes needed.

- `IMAGE_PROMPTS.txt` — every image slot, its size and prompt.
- `IMAGE_AGENT_PROMPT_BATCH1/2/3.txt` — paste one batch at a time into an AI agent (≤ 13 images each).

After an image is replaced, refresh the page twice in dev (the first load may still show the cached copy).

## Before launch — content to confirm

Search the code for `TODO(content)`:

- Prices: only **A63** (₹1,379 → ₹1,199) is confirmed; others are placeholders.
- Phone, WhatsApp number, email, address, store hours, social links and Instagram handle.
- Testimonials are **sample text** — replace with real customer reviews.
- Newsletter form and bag/wishlist are front-end only; connect to the store backend.
- Production domain in `src/data/site.ts`.

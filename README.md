# Monaariya Vastra — website

*Timeless Drapes, Modern Grace.* E-commerce site for the Monaariya Vastra saree brand.
Built with Next.js 16 (App Router, Cache Components), Tailwind CSS v4, Motion, Embla and Lenis.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (needs DATABASE_URL)
npm run start
```

## Where things live

| Path | What |
|---|---|
| `DESIGN.md` | Design system: colours, type, motion, components. Read before building inner pages. |
| `src/data/` | Fixed content: brand info and menus (`site.ts`), homepage copy (`home.ts`), collection rules (`collections.ts`). Sarees, categories and contact details live in the database and are edited in `/admin`. |
| `src/components/home/` | One file per homepage section (hero, arc carousel, saree show, …). |
| `src/components/layout/` | Header, mega menu, search, mobile menu, footer, intro curtain. |
| `src/components/ui/` | Shared pieces: buttons, product card, section heading, ornaments, reveal animations. |
| `src/app/(site)/` — `collections/[slug]`, `products/[slug]`, `cart`, `wishlist`, `search` | Shop pages (collection listing with filters, product page with add-ons, bag, wishlist, search). |
| `src/components/shop/`, `src/components/product/` | Shop and product page components. |
| `src/app/(site)/[...slug]/page.tsx` | Temporary "coming soon" page for links not built yet (about, contact, FAQs, policies, checkout, account). |
| `public/brand/` | Logo (navbar / full / emblem), cut from the client's banner. |
| `public/images/` | Product photos (real) and generated images (placeholders until replaced). |
| `client-assets/` | Original files sent by the client (`drive/` = per-category product photos and price sheets from Google Drive). |

## Images

Generated images replace placeholders by **file name** — no code changes needed.

- `IMAGE_PROMPTS.txt` — every image slot, its size and prompt.
- `IMAGE_AGENT_PROMPT_BATCH1/2/3.txt` — paste one batch at a time into an AI agent (≤ 13 images each).

After an image is replaced, refresh the page twice in dev (the first load may still show the cached copy).

## Before launch — content to confirm

Search the code for `TODO(content)`:

- Prices and specs come from the client's product sheets (`client-assets/drive/**/*.rtf`); A63 (semi tissue) has no sheet yet.
- Drive folders not yet downloaded (Google rate limit): Semi Silk, Thread Work Sarees, Viscose Tussar, Windy Crush.
- Phone, WhatsApp number, email, address, store hours, social links and Instagram handle.
- Testimonials are **sample text** — replace with real customer reviews.
- Newsletter form, bag and wishlist are saved in the browser; checkout and payments go through Razorpay (see below).
- Production domain in `src/data/site.ts`.

## Admin panel (`/admin`)

The shop owner signs in at `/admin` to add, edit or remove sarees (photos, prices, descriptions, stock),
manage categories, and change contact details, announcements and add-on prices. Changes go live instantly.

| Piece | Service (all from the Vercel dashboard) | Code |
|---|---|---|
| Database — sarees, categories, settings | **Neon** (Vercel Marketplace) | `src/db/`, `src/lib/catalog.ts`, `src/app/admin/actions.ts` |
| Photo uploads | **Vercel Blob** (Storage → Blob, public) | `src/app/api/admin/upload/route.ts` |
| Admin login | **Clerk** (Vercel Marketplace) | `src/proxy.ts`, `src/lib/admin-auth.ts` |

### Setting up a new Vercel project

1. Import the repo. Under **Integrations** add **Neon** and **Clerk**; under **Storage** create a **Blob** store and connect it.
2. Add the environment variable `ADMIN_EMAILS` = the email(s) allowed into the admin (comma-separated).
3. Deploy. The build runs `npm run db:setup` first (see `vercel.json`): it creates the tables and imports the
   original 64 sarees **only when the database is empty**, so it never overwrites admin edits.
4. Open `/admin`, sign up with an email from `ADMIN_EMAILS`, done. To add another admin later, edit
   `ADMIN_EMAILS` and redeploy. Tip: in the Clerk dashboard, set sign-ups to *Restricted*.

### Online payments (Razorpay)

Checkout at `/checkout` takes payment through Razorpay; paid orders appear in **Admin → Orders**.

- Amounts are calculated on the server from the database — the browser only sends which sarees and how many.
- Every payment is verified with Razorpay's signature and amount before the order is marked paid.
- `POST /api/razorpay/webhook` confirms payments even if the customer closes the browser early.
- The customer gets a private order page: `/order/<number>?t=<token>`.

Environment variables (Vercel → Settings → Environment Variables, **Production**, marked *Sensitive*; never commit them):

| Variable | From |
|---|---|
| `RAZORPAY_KEY_ID` | Razorpay → Account & Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | same |
| `RAZORPAY_WEBHOOK_SECRET` | the secret you enter when creating the webhook |

Webhook (Razorpay → Account & Settings → Webhooks → Add): URL `https://<your-domain>/api/razorpay/webhook`,
events `payment.authorized`, `payment.captured`, `payment.failed`, `order.paid`.

### Local development

```bash
vercel link && vercel env pull .env.local --yes   # DATABASE_URL, Clerk keys, BLOB_READ_WRITE_TOKEN
echo "ADMIN_EMAILS=you@example.com" > .env.development.local
npm run db:push && npm run db:seed   # tables + original catalogue (skipped if not empty)
npm run dev
```

`npm run db:studio` opens a database browser. `npm run db:seed -- --force` re-imports the original catalogue.

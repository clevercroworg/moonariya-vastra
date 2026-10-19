# Monaariya Vastra — Design System

> **Timeless Drapes, Modern Grace.**
> A heritage saree house with a contemporary voice. The site should feel like
> unfolding a silk saree from a muslin wrap: dark, warm, gold-lit and unhurried.

This file is the source of truth for every page. New inner pages (collection,
product, cart, about, contact) must reuse these tokens, components and motion
rules instead of inventing new ones.

---

## 1. Brand foundations

| Element | Value |
|---|---|
| Name | **Monaariya Vastra** (always two words, capital M and V) |
| Tagline | Timeless Drapes, Modern Grace |
| Personality | Regal, warm, crafted, welcoming. Never loud, never "discount-store". |
| Voice | Short, sensory sentences. Speak about fabric, feel and occasion. Use "you", not "customers". |
| Logo | Gold emblem (woman in saree inside a circle) + wordmark. Used **only on dark maroon**. Files: `public/brand/logo-nav.png` (no tagline, header), `logo-full.png` (with tagline, footer/intro), `emblem.png` (icon, watermark, loader). |

---

## 2. Colour

All colours are defined once as Tailwind v4 theme tokens in `src/app/globals.css`.

### Core palette

| Token | Hex | Use |
|---|---|---|
| `maroon-950` | `#170304` | **Exact logo background.** Header, footer, intro, dark sections. |
| `maroon-900` | `#240609` | Dark section alternates, overlays |
| `maroon-800` | `#3a0a12` | Announcement bar, hover fills on dark |
| `maroon-700` | `#5c1222` | Wine accent, focus rings on light |
| `maroon-600` | `#7d1a2f` | Links on light backgrounds |
| `gold-200` | `#f6e6bf` | Highlights in gradients |
| `gold-300` | `#ecd193` | Body text on dark (small) |
| `gold-400` | `#ddb46a` | **Primary gold** — headings on dark, icons, rules |
| `gold-500` | `#c4964a` | Buttons, active states |
| `gold-600` | `#9c7130` | Gold text on ivory (AA for large text) |
| `gold-700` | `#7a5520` | Gold text on ivory (AA for body) |
| `ivory-50` | `#fdf9f3` | **Page background** |
| `ivory-100` | `#f8f0e3` | Alternate light sections |
| `ivory-200` | `#efe2cc` | Borders, dividers on light |
| `ink-900` | `#22130f` | Body text on light |
| `ink-700` | `#4a3730` | Secondary text |
| `ink-500` | `#7c6a61` | Muted / captions |
| `emerald-700` | `#0f5040` | "You save" and success, used sparingly (echoes the green saree in the brand banner) |
| `rani-600` | `#a3195b` | Sale badges and rare accents only |

### Gold gradient (signature)
`linear-gradient(100deg, #8a5a1f 0%, #d9b064 28%, #f6e3ad 50%, #c99a4e 72%, #8a5a1f 100%)`
Used for: primary button fill, hairline rules, the header bottom border, active indicators.
Never fill a large area with it; it is a thread, not a fabric.

### Rhythm
Sections alternate **ivory → dark maroon → ivory**. Never place two dark
sections back to back without a gold hairline or ribbon between them.

### Contrast rules
- Gold-400 on maroon-950 = 10.3:1 and gold-300 on maroon-950 = 13.4:1 (fine at any size).
- Ink-900 on ivory-50 = 17.1:1; ink-500 (muted) on ivory-50 = 4.9:1.
- Gold-600 on ivory-50 = 4.2:1, so use it only for text 18px and up; use gold-700 (6.4:1) for smaller gold text on light.
- Maroon-950 text on the gold-500 button = 7.4:1.

---

## 3. Typography

| Role | Family | Settings |
|---|---|---|
| Display / headings | **Cormorant Garamond** (variable, with italics) | weight 500, tight leading (1.0–1.1), slight negative tracking (-0.01em). Italic for the emotional half of a headline. |
| Body / UI | **Jost** (variable) | 400 body, 500 UI, uppercase eyebrows at 500 with 0.28–0.32em tracking (echoes the logo tagline). |

Both load through `next/font/google` (self-hosted, no layout shift) and are exposed as `font-display` and `font-sans`.

### Scale (fluid)
| Token | Size | Use |
|---|---|---|
| `text-display` | clamp(2.6rem, 5.4vw, 5.4rem) | Hero headline |
| `text-h1` | clamp(2.4rem, 4.8vw, 4.25rem) | Section titles |
| `text-h2` | clamp(1.9rem, 3.2vw, 3rem) | Sub-sections, cards on dark |
| `text-h3` | 1.5rem | Card titles |
| body | 1rem / 1.7 | Paragraphs (max 60ch) |
| small | 0.875rem | Meta, prices |
| eyebrow | 0.72rem, uppercase, 0.3em tracking | Labels above headings |

**Headline pattern:** one plain line plus one *italic gold* line.
`Woven in gold, / *worn for generations.*`

---

## 4. Shape, space and layout

- **Container:** `max-w-[1440px]`, side padding 16px (mobile) → 24px → 48px (desktop).
- **Section spacing:** `py-20` mobile, `py-28` desktop. Hero and pinned sections are full-bleed.
- **Grid:** 12 columns, 24px gutter on desktop.
- **Radii:** buttons and inputs are **pill** or **square-cut**; images use the **temple arch** (`rounded-t-[999px]`) for category and editorial images, and a 2px radius for product photos (fabric is honest; don't round it).
- **Hairlines:** 1px gold at 30–40% opacity on dark, ivory-200 on light.
- **Frames:** inset gold frames with corner flourishes (taken from the logo border) on hero and banners.

---

## 5. Ornament library (`src/components/ui/Ornaments.tsx`)

| Ornament | Where |
|---|---|
| `LotusMark` | Above section titles; separators in marquees |
| `FlourishRule` | Under titles — line, diamond and leaf (from the "Vastra" rule in the logo) |
| `FrameCorners` | Inset frame on hero, festive banner, newsletter |
| Rotating text seal | Story section, around the emblem |

Ornaments are always gold, thin (1–1.5px) and decorative (`aria-hidden`).

---

## 6. Motion

Motion should feel like fabric: eased, weighted, never bouncy.

| Token | Value |
|---|---|
| Ease (standard) | `cubic-bezier(0.22, 1, 0.36, 1)` (easeOutQuint) |
| Ease (drape) | `cubic-bezier(0.65, 0, 0.35, 1)` for curtains/wipes |
| Durations | 200ms UI, 700ms reveals, 1.2s hero text, 7s hero autoplay, 9s Ken Burns |
| Smooth scroll | Lenis (`lerp 0.1`). Disabled with reduced motion. |

Patterns:
1. **Reveal:** fade + 24px rise, staggered 80ms, once per element.
2. **Headline mask:** lines slide up from an overflow-hidden mask.
3. **Ken Burns:** hero images scale 1.12 → 1.0 while active.
4. **Arc carousel:** categories rotate on a large circle; spring `stiffness 120, damping 22`.
5. **Pinned runway:** the Saree Show scrolls sideways while the page scrolls down.
6. **Image hover:** product photo cross-fades to the border close-up; arch images scale 1.06.

`prefers-reduced-motion: reduce` → autoplay stops, Ken Burns, marquee and parallax off, reveals become simple fades.

---

## 7. Components

| Component | Notes |
|---|---|
| **Header** | Solid `maroon-950` (matches the logo exactly). Centred logo, links left, icons right. Shrinks 88 → 72px on scroll. Gold gradient hairline at the bottom. |
| **Mega menu** | Full width on dark: Fabric · Style · Occasion · Discover columns + 2 feature cards. Opens on hover or focus; Esc closes. |
| **Buttons** | `primary` gold gradient with maroon text; `outline` 1px gold border; `ghost-light` ivory text with underline animation. Height 48px; uppercase Jost 500 with 0.2em tracking. |
| **Product card** | 3:4 photo, hover swap to detail, wishlist heart, "Add to bag" slides up, fabric label, price with MRP struck through and % off. |
| **Section heading** | Lotus → eyebrow → title (plain + italic) → optional flourish rule and intro. Centre or left aligned. |
| **Badges** | Small uppercase; "New" ivory on maroon, "% Off" rani. |

---

## 8. Imagery

- **Mood:** warm, golden-hour or soft studio light; deep backgrounds (maroon, teak, brass, temple stone). No harsh flash, no white seamless backgrounds for editorial (product photos are the exception).
- **Models:** Indian women of varied ages, skin tones and body types; natural poses; jewellery minimal and traditional.
- **Focus:** the saree first — zari, borders and pallu should be crisp.
- **Composition:** hero images keep the subject in the **right third** with space on the left for text.
- **Formats:** JPG/WebP, sRGB, ≤ 600KB before Next.js optimisation. Every image slot and its prompt is listed in `IMAGE_PROMPTS.txt`.

---

## 9. Accessibility and quality

- All interactive elements reachable by keyboard with a visible gold focus ring (`outline-gold-400`, 2px offset).
- Carousels have pause on hover/focus, labelled prev/next buttons and `aria-roledescription="carousel"`.
- Images carry descriptive `alt`; decorative ornaments use `aria-hidden`.
- Minimum tap target 44×44px.
- No horizontal page scroll at 360px width.
- LCP: the first hero image is `preload`ed; every other image lazy loads with `sizes`.

---

## 10. Content rules

- Prices in INR with Indian grouping: `₹1,199`. Always show MRP struck through when discounted.
- Category names exactly: Silk, Cotton, Linen, Organza, Georgette, Chiffon, Tissue, Designer, Handloom, Daily Wear and Party Wear Sarees.
- URL patterns: `/collections/{slug}`, `/products/{slug}`, `/policies/{slug}`, plus `/about`, `/contact`, `/faqs`, `/track-order`, `/cart`, `/wishlist`, `/account`, `/search`.
- Never invent stats. Testimonials must be real customer words before launch.
- Anything still awaiting real data (prices, contact details, reviews, social handles) is marked `// TODO(content)` in `src/data` — search for it before going live.

---

## 11. Inner pages (shop)

| Page | Pattern |
|---|---|
| **Collection** `/collections/{slug}` | Dark maroon hero (breadcrumb, lotus eyebrow, two-line title, count + shipping/COD chips, arch image) → collection rail (round thumbnails, active ring in gold) → filters (sidebar ≥1024px, bottom sheet on mobile: fabric, colour swatches, price buckets, on sale) + sort + 3/4-column density → "Know the fabric" band → trust strip. Empty categories show an "On the loom" state with WhatsApp CTA and in-stock collections — never a blank grid. |
| **Product** `/products/{slug}` | Gallery (thumbs, hover-zoom, swipe, full-screen lightbox) left and sticky; right: fabric eyebrow, title, price/MRP/savings, colour swatches linking sibling sarees, **finishing add-ons** (Falls & Pico ₹150, Pico/Zigzag ₹100, Tassels ₹150) with a live Saree / Add-ons / Quantity / Grand total summary, qty stepper, Add to bag, Buy now, wishlist, WhatsApp enquiry, accordions (description, details, care, shipping), share. Below: reviews, "You may also love", recently viewed. Sticky buy bar on mobile. |
| **Bag** `/cart` | Lines with add-ons, qty, move to wishlist, remove; dark summary card (MRP, discount, add-ons, free shipping, total, savings), checkout + "Order on WhatsApp". |
| **Wishlist / Search** | Light page header + product grid; helpful empty states with popular searches and collections. |

Loading: URL-dependent routes stream inside `<Suspense>` with skeletons (`src/components/shop/Skeletons.tsx`) so client navigation is instant.


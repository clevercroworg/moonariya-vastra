import type { Category, ProductSummary } from "@/lib/types";
import { categories as navCategories } from "./categories";
import { fabrics } from "./home";

export type Collection = {
  slug: string;
  name: string;
  /** headline split into plain + italic parts */
  title: [string, string];
  eyebrow: string;
  blurb: string;
  image: string;
  imageAlt: string;
  /** fabric-guide entry to show as "Know the fabric" (a category slug or a generic fabric id) */
  fabricId?: string;
  products: ProductSummary[];
};

// Navigation categories → generic fabric guide entries in data/home.ts
const fabricFor: Record<string, string> = {
  "silk-sarees": "silk",
  "tissue-sarees": "tissue",
  "organza-sarees": "organza",
  "georgette-sarees": "georgette",
  "chiffon-sarees": "chiffon",
  "linen-sarees": "linen",
  "cotton-sarees": "cotton",
};

const byNewest = (a: ProductSummary, b: ProductSummary) => b.addedAt.localeCompare(a.addedAt);

/** All shop collections, built from the live catalogue. */
export function buildCollections(products: ProductSummary[], categories: Category[]): Collection[] {
  const inCollection = (slug: string) => products.filter((p) => p.collections.includes(slug));

  const special: Collection[] = [
    {
      slug: "all",
      name: "All Sarees",
      title: ["Every drape,", "in one place."],
      eyebrow: "The full collection",
      blurb: "Silks, tissues, tussars, cottons and more — browse every saree in the Monaariya Vastra collection.",
      image: "/images/saree-show/look-01-temple-bride.jpg",
      imageAlt: "Bride in a maroon and gold silk saree in a lamp-lit temple corridor",
      products: [...products],
    },
    {
      slug: "new-arrivals",
      name: "New Arrivals",
      title: ["Just off", "the loom."],
      eyebrow: "New this season",
      blurb: "The latest weaves to join the collection, photographed just as they arrived.",
      image: "/images/saree-show/look-02-golden-hour.jpg",
      imageAlt: "Woman in a violet tissue saree on a terrace at sunset",
      products: [...products].sort(byNewest),
    },
    {
      slug: "festive-edit",
      name: "The Festive Edit",
      title: ["Light up", "the season."],
      eyebrow: "Deepavali & celebrations",
      blurb: "Embroidered pure tissues, raw silks and Paithani borders chosen for poojas, receptions and every celebration in between.",
      image: "/images/occasions/wedding-festive.jpg",
      imageAlt: "Women in silk sarees celebrating at a festive wedding",
      products: inCollection("festive-edit"),
    },
  ];

  // The client's own categories — one page each, shown once they have stock.
  const fromCategories: Collection[] = categories
    .map((c) => {
      const list = products.filter((p) => p.categorySlug === c.slug).sort(byNewest);
      return {
        slug: c.slug,
        name: c.name,
        title: [c.name, "sarees."] as [string, string],
        eyebrow: c.tagline || "Shop by category",
        blurb: c.summary,
        image: list[0]?.image ?? c.image,
        imageAlt: list[0] ? `${list[0].name}` : c.alt,
        fabricId: c.slug,
        products: list,
      };
    })
    .filter((c) => c.products.length > 0);

  // Navigation categories from the menu (silk, cotton, party wear, …)
  const fromNav: Collection[] = navCategories.map((c) => ({
    slug: c.slug,
    name: c.name,
    title: [c.short, "sarees."] as [string, string],
    eyebrow: fabrics.find((f) => f.id === fabricFor[c.slug])?.tagline ?? "Shop by category",
    blurb: c.blurb,
    image: c.image,
    imageAlt: `Woman wearing a ${c.short.toLowerCase()} saree`,
    fabricId: fabricFor[c.slug],
    products: inCollection(c.slug),
  }));

  // A category slug could clash with a navigation slug; the category page wins.
  const taken = new Set([...special, ...fromCategories].map((c) => c.slug));
  return [...special, ...fromCategories, ...fromNav.filter((c) => !taken.has(c.slug))];
}

/** Slugs the admin can tick for a saree (navigation categories + the festive edit). */
export const assignableCollections = [
  ...navCategories.map((c) => ({ slug: c.slug, name: c.name })),
  { slug: "festive-edit", name: "The Festive Edit" },
];

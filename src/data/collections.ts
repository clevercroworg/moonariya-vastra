import { categories } from "./categories";
import { fabrics } from "./home";
import { products, type Product } from "./products";
import { weaves } from "./weaves";

export type Collection = {
  slug: string;
  name: string;
  /** headline split into plain + italic parts */
  title: [string, string];
  eyebrow: string;
  blurb: string;
  image: string;
  imageAlt: string;
  /** fabric-guide entry to show as "Know the fabric" */
  fabricId?: string;
  products: Product[];
};

const fabricFor: Record<string, string> = {
  "silk-sarees": "silk",
  "tissue-sarees": "tissue",
  "organza-sarees": "organza",
  "georgette-sarees": "georgette",
  "chiffon-sarees": "chiffon",
  "linen-sarees": "linen",
  "cotton-sarees": "cotton",
};

const inCollection = (slug: string) => products.filter((p) => p.collections.includes(slug));

const byNewest = (a: Product, b: Product) => b.addedAt.localeCompare(a.addedAt);

const special: Collection[] = [
  {
    slug: "all",
    name: "All Sarees",
    title: ["Every drape,", "in one place."],
    eyebrow: "The full collection",
    blurb: "Silks, tissues, cottons and more — browse every saree in the Monaariya Vastra collection.",
    image: "/images/saree-show/look-01-temple-bride.jpg",
    imageAlt: "Bride in a maroon and gold silk saree in a lamp-lit temple corridor",
    products: [...products],
  },
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    title: ["Just off", "the loom."],
    eyebrow: "New this season",
    blurb: "The latest weaves to join the collection — pure kora tissues, embroidered raw silks, zari georgettes and everyday cotton blends.",
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

const fromCategories: Collection[] = categories.map((c) => {
  const fab = fabrics.find((f) => f.id === fabricFor[c.slug]);
  return {
    slug: c.slug,
    name: c.name,
    title: [c.short, "sarees."] as [string, string],
    eyebrow: fab ? fab.tagline : "Shop by category",
    blurb: c.blurb,
    image: c.image,
    imageAlt: `Woman wearing a ${c.short.toLowerCase()} saree`,
    fabricId: fabricFor[c.slug],
    products: inCollection(c.slug),
  };
});

// The client's own categories (Drive folders), one page per weave that has stock.
const fromWeaves: Collection[] = weaves
  .map((w) => {
    const list = products.filter((p) => p.fabric === w.fabric).sort(byNewest);
    return {
      slug: w.id,
      name: w.name,
      title: [w.name, "sarees."] as [string, string],
      eyebrow: w.tagline,
      blurb: w.summary,
      image: list[0]?.image ?? w.image,
      imageAlt: list[0]?.images[0].alt ?? w.alt,
      fabricId: w.id,
      products: list,
    };
  })
  .filter((c) => c.products.length > 0);

export const collections: Collection[] = [...special, ...fromWeaves, ...fromCategories];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);

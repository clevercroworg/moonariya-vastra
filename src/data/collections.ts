import { categories } from "./categories";
import { fabrics } from "./home";
import { products, type Product } from "./products";

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
    image: "/images/hero/hero-festive-silk.jpg",
    imageAlt: "Woman in a maroon silk saree with a gold zari border",
    products: [...products],
  },
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    title: ["Just off", "the loom."],
    eyebrow: "New this season",
    blurb: "The latest weaves to join the collection — semi tissue silks with geometric zari and everyday cotton blends.",
    image: "/images/hero/hero-semi-tissue.jpg",
    imageAlt: "Woman in a violet semi tissue silk saree beside brass lamps",
    products: [...products].sort(byNewest),
  },
  {
    slug: "festive-edit",
    name: "The Festive Edit",
    title: ["Light up", "the season."],
    eyebrow: "Deepavali & celebrations",
    blurb: "Jewel-toned silks and shimmering semi tissues chosen for poojas, receptions and every celebration in between.",
    image: "/images/banners/festive-edit.jpg",
    imageAlt: "Folded silk sarees with gold zari beside glowing brass diyas",
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

export const collections: Collection[] = [...special, ...fromCategories];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);

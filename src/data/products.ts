export type Fabric = "Semi Tissue Silk" | "Cotton Blend";

export type Product = {
  slug: string;
  code?: string;
  name: string;
  fabric: Fabric;
  /** collection slugs this saree appears in (first one is its primary collection) */
  collections: string[];
  colour: string;
  swatch: string;
  price: number;
  mrp: number;
  /** gallery, first image is the cover */
  images: { src: string; alt: string }[];
  image: string;
  hoverImage: string;
  badge?: "New" | "Bestseller";
  /** ISO date the piece was added — drives "Newest" sorting */
  addedAt: string;
  summary: string;
  description: string[];
  details: { label: string; value: string }[];
  care: string;
};

const photo = (slug: string, variant = "") =>
  `/images/products/${slug}${variant ? `-${variant}` : ""}.jpg`;

const COTTON_COLLECTIONS = ["cotton-sarees", "daily-wear-sarees"];
const TISSUE_COLLECTIONS = ["tissue-sarees", "silk-sarees", "party-wear-sarees", "festive-edit"];

function cottonBlend(p: {
  slug: string;
  name: string;
  colour: string;
  swatch: string;
  borderNote: string;
  badge?: Product["badge"];
  addedAt: string;
}): Product {
  return {
    slug: p.slug,
    name: p.name,
    fabric: "Cotton Blend",
    collections: COTTON_COLLECTIONS,
    colour: p.colour,
    swatch: p.swatch,
    // TODO(content): placeholder price — confirm with the client
    price: 899,
    mrp: 1099,
    images: [
      { src: photo(p.slug), alt: `${p.name}, folded to show the body and border` },
      { src: photo(p.slug, "detail"), alt: `Close-up of the printed border and zari band on the ${p.name}` },
    ],
    image: photo(p.slug),
    hoverImage: photo(p.slug, "detail"),
    badge: p.badge,
    addedAt: p.addedAt,
    summary: `A breathable ${p.colour.toLowerCase()} cotton blend saree with a printed border and a slim gold zari band — easy to drape, easy to love.`,
    description: [
      `Soft, breathable and easy to wear all day, this ${p.colour.toLowerCase()} cotton blend saree is finished with ${p.borderNote} and a slim gold zari band along the edge.`,
      "The plain body keeps it versatile — pair it with a contrast blouse for the office, or dress it up with jhumkas for a family function.",
    ],
    details: [
      { label: "Fabric", value: "Cotton blend" },
      { label: "Colour", value: p.colour },
      { label: "Border", value: "Printed floral and geometric border with gold zari band" },
      { label: "Occasion", value: "Daily wear, office, casual functions" },
      // TODO(content): saree length, blouse piece and weight from the client
    ],
    care: "Hand wash in cold water, separately for the first few washes. Dry in the shade and iron on medium heat.",
  };
}

function semiTissue(p: {
  slug: string;
  code?: string;
  name: string;
  colour: string;
  swatch: string;
  images: Product["images"];
  badge?: Product["badge"];
  addedAt: string;
}): Product {
  return {
    slug: p.slug,
    code: p.code,
    name: p.name,
    fabric: "Semi Tissue Silk",
    collections: TISSUE_COLLECTIONS,
    colour: p.colour,
    swatch: p.swatch,
    price: 1199,
    mrp: 1379,
    images: p.images,
    image: p.images[0].src,
    hoverImage: p.images[1].src,
    badge: p.badge,
    addedAt: p.addedAt,
    summary: `A light, lustrous ${p.colour.toLowerCase()} semi tissue silk saree with geometric gold zari — made to glow at every celebration.`,
    description: [
      `Clusters of small woven gold squares scatter across this ${p.colour.toLowerCase()} semi tissue silk, gathering into a broad patchwork-square border and a rich zari pallu.`,
      "It carries the sheen of a festive silk while staying light enough to wear through a long pooja, a reception or an evening of celebrations.",
    ],
    details: [
      { label: "Fabric", value: "Semi tissue silk" },
      { label: "Colour", value: p.colour },
      { label: "Zari", value: "Geometric gold weave on body, border and pallu" },
      { label: "Occasion", value: "Festive, poojas, receptions, parties" },
      // TODO(content): saree length, blouse piece and weight from the client
    ],
    care: "Dry clean only. Store folded in a muslin or cotton cloth and refold along new lines every few months to protect the zari.",
  };
}

// Real product photos supplied by the client (client-assets/).
// TODO(content): only A63 has a confirmed price (MRP ₹1,379 / offer ₹1,199, from the
// product tag). The magenta saree uses the same price; all cotton blend prices are placeholders.
export const products: Product[] = [
  semiTissue({
    slug: "violet-semi-tissue-silk-saree",
    code: "A63",
    name: "Violet Semi Tissue Silk Saree",
    colour: "Violet",
    swatch: "#8a1fb0",
    badge: "New",
    addedAt: "2026-10-18",
    images: [
      { src: photo("violet-semi-tissue-silk-saree"), alt: "Violet semi tissue silk saree, folded to show the zari border" },
      { src: photo("violet-semi-tissue-silk-saree", "detail"), alt: "Close-up of the geometric gold zari border" },
      { src: photo("violet-semi-tissue-silk-saree", "pallu"), alt: "The saree unfolded to show the pallu and zari" },
    ],
  }),
  cottonBlend({
    slug: "olive-green-cotton-blend-saree",
    name: "Olive Green Cotton Blend Saree",
    colour: "Olive Green",
    swatch: "#3f4a1e",
    borderNote: "a maroon floral border and a green diamond band",
    badge: "New",
    addedAt: "2026-10-18",
  }),
  semiTissue({
    slug: "magenta-semi-tissue-silk-saree",
    name: "Magenta Semi Tissue Silk Saree",
    colour: "Magenta",
    swatch: "#8e1150",
    badge: "New",
    addedAt: "2026-10-18",
    images: [
      { src: photo("magenta-semi-tissue-silk-saree"), alt: "Magenta semi tissue silk saree, folded to show the zari border" },
      { src: photo("magenta-semi-tissue-silk-saree", "detail"), alt: "Close-up of the patchwork-square zari border" },
    ],
  }),
  cottonBlend({
    slug: "mustard-cotton-blend-saree",
    name: "Mustard Cotton Blend Saree",
    colour: "Mustard",
    swatch: "#d07a12",
    borderNote: "a maroon floral border and a deep red diamond band",
    addedAt: "2026-10-17",
  }),
  cottonBlend({
    slug: "crimson-red-cotton-blend-saree",
    name: "Crimson Red Cotton Blend Saree",
    colour: "Crimson Red",
    swatch: "#b0161c",
    borderNote: "an orange floral border on teal",
    badge: "Bestseller",
    addedAt: "2026-10-17",
  }),
  cottonBlend({
    slug: "teal-green-cotton-blend-saree",
    name: "Teal Green Cotton Blend Saree",
    colour: "Teal Green",
    swatch: "#0e4d45",
    borderNote: "a maroon floral border and a green diamond band",
    addedAt: "2026-10-16",
  }),
  cottonBlend({
    slug: "coffee-brown-cotton-blend-saree",
    name: "Coffee Brown Cotton Blend Saree",
    colour: "Coffee Brown",
    swatch: "#3a2420",
    borderNote: "a red floral border and a green diamond band",
    addedAt: "2026-10-16",
  }),
  cottonBlend({
    slug: "maroon-cotton-blend-saree",
    name: "Maroon Cotton Blend Saree",
    colour: "Maroon",
    swatch: "#5e1a17",
    borderNote: "an orange floral border on teal",
    addedAt: "2026-10-15",
  }),
];

export const productHref = (slug: string) => `/products/${slug}`;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const discountPercent = (p: Pick<Product, "price" | "mrp">) =>
  Math.round(((p.mrp - p.price) / p.mrp) * 100);

/** Other pieces to show alongside a product: same primary collection first. */
export function relatedProducts(product: Product, limit = 4) {
  const same = products.filter((p) => p.slug !== product.slug && p.collections[0] === product.collections[0]);
  const rest = products.filter((p) => p.slug !== product.slug && !same.includes(p));
  return [...same, ...rest].slice(0, limit);
}

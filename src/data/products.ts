export type Product = {
  slug: string;
  code?: string;
  name: string;
  fabric: "Semi Tissue Silk" | "Cotton Blend";
  collection: string;
  colour: string;
  swatch: string;
  price: number;
  mrp: number;
  image: string;
  hoverImage: string;
  badge?: "New" | "Bestseller";
};

const photo = (slug: string, variant = "") =>
  `/images/products/${slug}${variant ? `-${variant}` : ""}.jpg`;

// Real product photos supplied by the client (client-assets/).
// TODO(content): only A63 has a confirmed price (MRP ₹1,379 / offer ₹1,199 from the
// product tag). Every other price and code below is a placeholder to confirm.
export const products: Product[] = [
  {
    slug: "violet-semi-tissue-silk-saree",
    code: "A63",
    name: "Violet Semi Tissue Silk Saree",
    fabric: "Semi Tissue Silk",
    collection: "tissue-sarees",
    colour: "Violet",
    swatch: "#8a1fb0",
    price: 1199,
    mrp: 1379,
    image: photo("violet-semi-tissue-silk-saree"),
    hoverImage: photo("violet-semi-tissue-silk-saree", "detail"),
    badge: "New",
  },
  {
    slug: "olive-green-cotton-blend-saree",
    name: "Olive Green Cotton Blend Saree",
    fabric: "Cotton Blend",
    collection: "cotton-sarees",
    colour: "Olive Green",
    swatch: "#3f4a1e",
    price: 899,
    mrp: 1099,
    image: photo("olive-green-cotton-blend-saree"),
    hoverImage: photo("olive-green-cotton-blend-saree", "detail"),
    badge: "New",
  },
  {
    slug: "magenta-semi-tissue-silk-saree",
    name: "Magenta Semi Tissue Silk Saree",
    fabric: "Semi Tissue Silk",
    collection: "tissue-sarees",
    colour: "Magenta",
    swatch: "#8e1150",
    price: 1199,
    mrp: 1379,
    image: photo("magenta-semi-tissue-silk-saree"),
    hoverImage: photo("magenta-semi-tissue-silk-saree", "detail"),
    badge: "New",
  },
  {
    slug: "mustard-cotton-blend-saree",
    name: "Mustard Cotton Blend Saree",
    fabric: "Cotton Blend",
    collection: "cotton-sarees",
    colour: "Mustard",
    swatch: "#d07a12",
    price: 899,
    mrp: 1099,
    image: photo("mustard-cotton-blend-saree"),
    hoverImage: photo("mustard-cotton-blend-saree", "detail"),
  },
  {
    slug: "crimson-red-cotton-blend-saree",
    name: "Crimson Red Cotton Blend Saree",
    fabric: "Cotton Blend",
    collection: "cotton-sarees",
    colour: "Crimson Red",
    swatch: "#b0161c",
    price: 899,
    mrp: 1099,
    image: photo("crimson-red-cotton-blend-saree"),
    hoverImage: photo("crimson-red-cotton-blend-saree", "detail"),
    badge: "Bestseller",
  },
  {
    slug: "teal-green-cotton-blend-saree",
    name: "Teal Green Cotton Blend Saree",
    fabric: "Cotton Blend",
    collection: "cotton-sarees",
    colour: "Teal Green",
    swatch: "#0e4d45",
    price: 899,
    mrp: 1099,
    image: photo("teal-green-cotton-blend-saree"),
    hoverImage: photo("teal-green-cotton-blend-saree", "detail"),
  },
  {
    slug: "coffee-brown-cotton-blend-saree",
    name: "Coffee Brown Cotton Blend Saree",
    fabric: "Cotton Blend",
    collection: "cotton-sarees",
    colour: "Coffee Brown",
    swatch: "#3a2420",
    price: 899,
    mrp: 1099,
    image: photo("coffee-brown-cotton-blend-saree"),
    hoverImage: photo("coffee-brown-cotton-blend-saree", "detail"),
  },
  {
    slug: "maroon-cotton-blend-saree",
    name: "Maroon Cotton Blend Saree",
    fabric: "Cotton Blend",
    collection: "cotton-sarees",
    colour: "Maroon",
    swatch: "#5e1a17",
    price: 899,
    mrp: 1099,
    image: photo("maroon-cotton-blend-saree"),
    hoverImage: photo("maroon-cotton-blend-saree", "detail"),
  },
];

export const productHref = (slug: string) => `/products/${slug}`;

export const discountPercent = (p: Pick<Product, "price" | "mrp">) =>
  Math.round(((p.mrp - p.price) / p.mrp) * 100);

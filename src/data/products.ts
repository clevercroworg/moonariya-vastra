export type Fabric =
  | "Pure Kora Tissue"
  | "Pure Tissue"
  | "Pure Raw Silk"
  | "Raw Silk"
  | "Semi Tissue Silk"
  | "Georgette"
  | "Cotton Blend";

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

const img = (file: string, alt: string) => ({ src: `/images/products/${file}.jpg`, alt });
const numbered = (slug: string, count: number, name: string, captions: string[] = []) =>
  Array.from({ length: count }, (_, i) =>
    img(`${slug}-${i + 1}`, captions[i] ?? (i === 0 ? `${name}, folded` : `${name} — detail ${i + 1}`)),
  );

// Specs from the client's product sheets (client-assets/drive/**/*.rtf).
const SHEET_OCCASION = "Wedding, festive, party wear & traditional functions";
const sheetDetails = (fabricLine: string, work: string, occasion = SHEET_OCCASION) => [
  { label: "Fabric", value: fabricLine },
  { label: "Work", value: work },
  { label: "Saree length", value: "5.5 metres" },
  { label: "Blouse piece", value: "1 metre (unstitched)" },
  { label: "Occasion", value: occasion },
  { label: "Delivery", value: "7–15 working days" },
];
const DRY_CLEAN = "Dry clean only. Store folded in a muslin or cotton cloth and refold along new lines every few months to protect the work.";

function make(p: Omit<Product, "image" | "hoverImage">): Product {
  return { ...p, image: p.images[0].src, hoverImage: (p.images[1] ?? p.images[0]).src };
}

/* ------------------------------------------------------------------ */
/*  Pure Kora Tissue — B122                                            */
/* ------------------------------------------------------------------ */

const kora = make({
  slug: "rose-gold-pure-kora-tissue-saree",
  code: "B122",
  name: "Rose & Gold Pure Kora Tissue Saree",
  fabric: "Pure Kora Tissue",
  collections: ["tissue-sarees", "designer-sarees", "festive-edit", "party-wear-sarees"],
  colour: "Rose & Gold",
  swatch: "#d9a3a0",
  price: 8599,
  mrp: 10749,
  badge: "New",
  addedAt: "2026-10-21",
  images: numbered("rose-gold-pure-kora-tissue-saree", 6, "Rose and gold pure kora tissue saree", [
    "Rose and gold pure kora tissue saree with a chevron border and leaping deer motifs",
    "The saree in its gold shade with the deer and chevron border",
    "Rose pallu with soft floral embroidery",
    "Deer motifs along the rose chevron border",
    "Floral cross-stitch embroidery on the pallu",
    "The saree folded to show both rose and gold tones",
  ]),
  summary: "A luminous pure kora tissue in rose and gold, embroidered with leaping deer, a chevron border and soft florals.",
  description: [
    "Woven in pure kora tissue with a gentle metallic sheen, this saree pairs a rose chevron border with a pale gold body. Leaping deer run along the border and delicate florals bloom across the pallu — all finished with Korean machine embroidery.",
    "Light to wear yet unmistakably festive — made for weddings, receptions and celebrations.",
  ],
  details: sheetDetails("Pure kora tissue", "Korean machinery embroidery — deer, chevron and floral motifs"),
  care: DRY_CLEAN,
});

/* ------------------------------------------------------------------ */
/*  Pure Tissue with lotus embroidery — B153                           */
/* ------------------------------------------------------------------ */

const lotus = (slug: string, colour: string, swatch: string, count: number, captions: string[]) =>
  make({
    slug,
    code: "B153",
    name: `${colour} Pure Tissue Saree with Lotus Embroidery`,
    fabric: "Pure Tissue",
    collections: ["tissue-sarees", "designer-sarees", "festive-edit"],
    colour,
    swatch,
    price: 7999,
    mrp: 9999,
    badge: "New",
    addedAt: "2026-10-21",
    images: numbered(slug, count, `${colour} pure tissue saree with lotus embroidery`, captions),
    summary: `A ${colour.toLowerCase()} pure tissue saree with a border of hand-shaded lotus embroidery and a soft metallic glow.`,
    description: [
      `Pure tissue in ${colour.toLowerCase()} catches the light with every fold, while a border of embroidered lotuses — blush, coral and sage — frames the drape.`,
      "An elegant choice for weddings, poojas and evening functions.",
    ],
    details: sheetDetails("Pure tissue", "Embroidery work — lotus border and pallu"),
    care: DRY_CLEAN,
  });

/* ------------------------------------------------------------------ */
/*  Pure Raw Silk — B192 (embroidery) and B162 (cut work)              */
/* ------------------------------------------------------------------ */

const rawEmb = (slug: string, colour: string, swatch: string, count: number, captions: string[]) =>
  make({
    slug,
    code: "B192",
    name: `${colour} Pure Raw Silk Saree with Embroidery`,
    fabric: "Pure Raw Silk",
    collections: ["silk-sarees", "designer-sarees", "festive-edit"],
    colour,
    swatch,
    price: 6099,
    mrp: 7649,
    badge: "New",
    addedAt: "2026-10-20",
    images: numbered(slug, count, `${colour} pure raw silk saree with embroidery`, captions),
    summary: `A ${colour.toLowerCase()} pure raw silk saree with blooming rose embroidery and a scalloped cut-work border.`,
    description: [
      `Rich ${colour.toLowerCase()} pure raw silk with a natural texture, embroidered with clusters of roses and edged with an intricate cut-work border.`,
      "A statement drape for weddings and festive celebrations.",
    ],
    details: sheetDetails("Pure raw silk", "Embroidery with cut-work border"),
    care: DRY_CLEAN,
  });

const rawCut = (slug: string, colour: string, swatch: string, count: number, captions: string[]) =>
  make({
    slug,
    code: "B162",
    name: `${colour} Pure Raw Silk Saree with Cut Work`,
    fabric: "Pure Raw Silk",
    collections: ["silk-sarees", "designer-sarees", "party-wear-sarees"],
    colour,
    swatch,
    price: 4999,
    mrp: 6249,
    badge: "New",
    addedAt: "2026-10-20",
    images: numbered(slug, count, `${colour} pure raw silk saree with cut work`, captions),
    summary: `A ${colour.toLowerCase()} pure raw silk saree with lace-like cut-work medallions, embroidered deer and blossoms.`,
    description: [
      `${colour} pure raw silk scattered with tiny sequins, finished with lace-like cut-work medallions, a golden deer and soft pink blossoms.`,
      "Graceful enough for a wedding, easy enough for a festive evening.",
    ],
    details: sheetDetails("Pure raw silk", "Cut work with embroidered deer and florals"),
    care: DRY_CLEAN,
  });

/* ------------------------------------------------------------------ */
/*  Premium Georgette with zari — A46                                  */
/* ------------------------------------------------------------------ */

const georgette = (slug: string, colour: string, swatch: string) =>
  make({
    slug,
    code: "A46",
    name: `${colour} Premium Georgette Saree with Zari Work`,
    fabric: "Georgette",
    collections: ["georgette-sarees", "party-wear-sarees"],
    colour,
    swatch,
    price: 2399,
    mrp: 2759,
    addedAt: "2026-10-19",
    images: numbered(slug, 2, `${colour} premium georgette saree with zari work`, [
      `${colour} premium georgette saree with geometric zari blocks, folded`,
      `Close-up of the zari border on the ${colour.toLowerCase()} georgette saree`,
    ]),
    summary: `A fluid ${colour.toLowerCase()} premium georgette saree woven with geometric gold zari blocks and a rich border.`,
    description: [
      `Soft, fluid premium georgette in ${colour.toLowerCase()}, patterned with geometric blocks of gold zari and finished with a rich zari border.`,
      "It moves beautifully and stays light — made for parties, receptions and festive evenings.",
    ],
    details: sheetDetails("Premium georgette", "Zari work with rich border"),
    care: DRY_CLEAN,
  });

/* ------------------------------------------------------------------ */
/*  Semi Tissue Silk — A63 (WhatsApp photos)                           */
/* ------------------------------------------------------------------ */

const semiTissue = (p: { slug: string; name: string; colour: string; swatch: string; files: [string, string][] }) =>
  make({
    slug: p.slug,
    code: "A63",
    name: p.name,
    fabric: "Semi Tissue Silk",
    collections: ["tissue-sarees", "silk-sarees", "party-wear-sarees", "festive-edit"],
    colour: p.colour,
    swatch: p.swatch,
    price: 1199,
    mrp: 1379,
    addedAt: "2026-10-18",
    images: p.files.map(([f, alt]) => img(f, alt)),
    summary: `A light, lustrous ${p.colour.toLowerCase()} semi tissue silk saree with geometric gold zari — made to glow at every celebration.`,
    description: [
      `Clusters of small woven gold squares scatter across this ${p.colour.toLowerCase()} semi tissue silk, gathering into a broad patchwork-square border and a rich zari pallu.`,
      "It carries the sheen of a festive silk while staying light enough to wear through a long pooja, a reception or an evening of celebrations.",
    ],
    // TODO(content): A63 sheet not received — length/blouse assumed to match the range
    details: [
      { label: "Fabric", value: "Semi tissue silk" },
      { label: "Work", value: "Geometric gold zari on body, border and pallu" },
      { label: "Occasion", value: "Festive, poojas, receptions, parties" },
      { label: "Delivery", value: "7–15 working days" },
    ],
    care: DRY_CLEAN,
  });

/* ------------------------------------------------------------------ */
/*  Cotton Blend — A61 (six colours)                                   */
/* ------------------------------------------------------------------ */

const cotton = (slug: string, colour: string, swatch: string, borderNote: string, badge?: Product["badge"]) =>
  make({
    slug,
    code: "A61",
    name: `${colour} Cotton Blend Saree`,
    fabric: "Cotton Blend",
    collections: ["cotton-sarees", "daily-wear-sarees"],
    colour,
    swatch,
    price: 1299,
    mrp: 1499,
    badge,
    addedAt: "2026-10-17",
    images: [
      img(slug, `${colour} cotton blend saree, folded to show the body and border`),
      img(`${slug}-detail`, `Close-up of the printed border and zari band on the ${colour.toLowerCase()} saree`),
      img("cotton-blend-pallu-1", "Printed floral pallu of the cotton blend range"),
      img("cotton-blend-blouse-1", "Printed blouse piece of the cotton blend range"),
    ],
    summary: `A breathable ${colour.toLowerCase()} cotton blend saree with a printed border, a slim gold zari band and a printed floral pallu.`,
    description: [
      `Soft and breathable, this ${colour.toLowerCase()} cotton blend saree is finished with ${borderNote} and a slim gold zari band, with a printed floral pallu and a printed blouse piece.`,
      "Easy to drape and easy to wear all day — for the office, family visits and festive functions alike.",
    ],
    details: sheetDetails("Cotton blend", "Woven design with rich printed border"),
    care: DRY_CLEAN,
  });

/* ------------------------------------------------------------------ */
/*  Second drop — pure tissue & raw silk designs (one entry per colour) */
/* ------------------------------------------------------------------ */

type Design = {
  code: string;
  fabric: Fabric;
  label: string; // e.g. "Pure Tissue Saree with Korean Embroidery"
  fabricLine: string;
  work: string;
  price: number;
  mrp: number;
  collections: string[];
  addedAt: string;
  summary: (colour: string) => string;
  description: (colour: string) => string[];
};

const variant = (d: Design, slug: string, colour: string, swatch: string, captions: string[]) =>
  make({
    slug,
    code: d.code,
    name: `${colour} ${d.label}`,
    fabric: d.fabric,
    collections: d.collections,
    colour,
    swatch,
    price: d.price,
    mrp: d.mrp,
    badge: "New",
    addedAt: d.addedAt,
    images: numbered(slug, captions.length, `${colour} ${d.label.toLowerCase()}`, captions),
    summary: d.summary(colour),
    description: d.description(colour),
    details: sheetDetails(d.fabricLine, d.work),
    care: DRY_CLEAN,
  });

const B82: Design = {
  code: "B82", fabric: "Pure Tissue", label: "Pure Tissue Saree with Floral Embroidery",
  fabricLine: "Pure tissue", work: "Korean machinery embroidery — floral vines with sequins",
  price: 5899, mrp: 7399, collections: ["tissue-sarees", "designer-sarees", "party-wear-sarees"], addedAt: "2026-10-21",
  summary: (c) => `A ${c.toLowerCase()} pure tissue saree with a trailing border of embroidered roses and vines, scattered with sequins.`,
  description: (c) => [
    `Deep ${c.toLowerCase()} pure tissue sets off a border of embroidered roses, violets and leafy vines in soft pastels, with sequins scattered across the body.`,
    "Dramatic yet light — perfect for evening functions and receptions.",
  ],
};
const B92: Design = {
  code: "B92", fabric: "Pure Tissue", label: "Pure Tissue Saree with Bird & Tree Embroidery",
  fabricLine: "Pure tissue", work: "Korean machinery embroidery — birds, branches and blossoms",
  price: 8199, mrp: 10299, collections: ["tissue-sarees", "designer-sarees", "festive-edit"], addedAt: "2026-10-21",
  summary: (c) => `A ${c.toLowerCase()} pure tissue saree embroidered with songbirds perched among blossoming branches.`,
  description: (c) => [
    `Soft ${c.toLowerCase()} pure tissue becomes a garden in bloom — songbirds, branches and pastel blossoms are embroidered across the pallu and border, finished with a zari edge.`,
    "A graceful, painterly drape for weddings and festive mornings.",
  ],
};
const B52: Design = {
  code: "B52", fabric: "Pure Tissue", label: "Pure Tissue Saree with Cut Work & Cross-Stitch",
  fabricLine: "Pure tissue", work: "Lotus cut work with cross-stitch birds and florals",
  price: 8399, mrp: 10499, collections: ["tissue-sarees", "designer-sarees", "festive-edit"], addedAt: "2026-10-21",
  summary: (c) => `A ${c.toLowerCase()} pure tissue saree with lace-like lotus cut work and cross-stitched birds.`,
  description: (c) => [
    `Airy ${c.toLowerCase()} pure tissue is finished with large lotus motifs in lace-like cut work, cross-stitched cranes and tiny florals, with a scalloped edge.`,
    "Delicate and heirloom-worthy — made for weddings and special occasions.",
  ],
};
const B132: Design = {
  code: "B132", fabric: "Pure Tissue", label: "Pure Tissue Saree with Multicolour Pallu",
  fabricLine: "Pure tissue", work: "Multicolour pallu and shoulder work with embroidered edge",
  price: 4999, mrp: 6429, collections: ["tissue-sarees", "party-wear-sarees", "festive-edit"], addedAt: "2026-10-20",
  summary: (c) => `A ${c.toLowerCase()} pure tissue saree with a bold multicolour petal pallu across the shoulder.`,
  description: (c) => [
    `Glowing ${c.toLowerCase()} pure tissue meets a statement pallu of layered petals in coral, turquoise and indigo, finished with an embroidered scalloped edge.`,
    "Bright, modern and festive — made to be noticed.",
  ],
};
const B182: Design = {
  code: "B182", fabric: "Raw Silk", label: "Raw Silk Saree with Blue Jay Embroidery",
  fabricLine: "Raw silk", work: "Korean embroidery — blue jays, roses and lace motifs",
  price: 5499, mrp: 6849, collections: ["silk-sarees", "designer-sarees", "party-wear-sarees"], addedAt: "2026-10-20",
  summary: (c) => `A ${c.toLowerCase()} raw silk saree embroidered with blue jays, roses and lace-like motifs.`,
  description: (c) => [
    `Smooth ${c.toLowerCase()} raw silk is embroidered with blue jays among roses and lilies, with lace-like corner motifs and a scalloped border.`,
    "Soft, elegant and modern — lovely for day weddings and festive gatherings.",
  ],
};
const B142: Design = {
  code: "B142", fabric: "Raw Silk", label: "Raw Silk Paithani Saree with German Silver Work",
  fabricLine: "Raw silk", work: "German silver Paithani border with parrot and lotus motifs",
  price: 5499, mrp: 6899, collections: ["silk-sarees", "festive-edit", "party-wear-sarees"], addedAt: "2026-10-20",
  summary: (c) => `A ${c.toLowerCase()} raw silk saree with a German silver Paithani border of parrots and lotus vines.`,
  description: (c) => [
    `${c} raw silk dotted with silver buttis and edged with a Paithani-style border in German silver, woven with parrots, lotuses and vines in jewel colours.`,
    "A classic Maharashtrian look with a lighter, everyday-festive feel.",
  ],
};

// All prices and specs come from the client's product sheets / tags.
export const products: Product[] = [
  kora,
  variant(B92, "mauve-pure-tissue-korean-embroidery-saree", "Mauve", "#b08a96", [
    "Mauve pure tissue saree with bird and tree embroidery, folded",
    "Songbirds and blossoms on the pallu",
    "Embroidered branch with a grey-blue panel",
    "Floral embroidery on the body",
  ]),
  variant(B92, "beige-pure-tissue-korean-embroidery-saree", "Beige", "#d8c3a0", [
    "Beige pure tissue saree with bird and tree embroidery, folded",
    "Close-up of the bird and blossom embroidery",
  ]),
  variant(B52, "mint-pure-tissue-cutwork-saree", "Mint", "#a8c7b0", [
    "Mint pure tissue saree with lotus cut work and cross-stitch, folded",
    "Cross-stitched cranes above the lotus cut work",
    "Cut-work lotus panel",
    "Lotus cut work along the border",
    "Mint and lilac colourways together",
  ]),
  variant(B52, "lilac-pure-tissue-cutwork-saree", "Lilac", "#b9a0c4", [
    "Lilac pure tissue saree with lotus cut work and cross-stitch, folded",
    "Lilac and mint colourways together",
  ]),
  variant(B82, "black-pure-tissue-korean-embroidery-saree", "Black", "#1d1a1c", [
    "Black pure tissue saree with floral embroidery border, folded",
    "Sequins scattered across the black body",
    "Rose and vine embroidery border",
    "Close-up of the embroidered roses and violets",
  ]),
  variant(B132, "mustard-pure-tissue-multicolour-pallu-saree", "Mustard", "#d39a22", [
    "Mustard pure tissue saree with multicolour petal pallu, folded",
    "The multicolour petal pallu",
    "Embroidered scalloped edge on the mustard body",
    "Mustard and lilac colourways together",
  ]),
  variant(B132, "lilac-pure-tissue-multicolour-pallu-saree", "Lilac", "#c7b3cf", [
    "Lilac pure tissue saree with multicolour petal pallu, folded",
    "Lilac and mustard colourways together",
  ]),
  variant(B182, "mint-raw-silk-korean-work-saree", "Mint", "#9fc9b8", [
    "Mint raw silk saree with blue jay embroidery, folded",
    "Blue jay and roses embroidered on the pallu",
    "Embroidery with lace-like corner motif",
    "Rose sprigs on the body",
    "Mint and lilac-grey colourways together",
  ]),
  variant(B182, "lilac-grey-raw-silk-korean-work-saree", "Lilac Grey", "#a49aa8", [
    "Lilac grey raw silk saree with blue jay embroidery, folded",
    "Lilac grey and mint colourways together",
  ]),
  variant(B142, "black-raw-silk-paithani-saree", "Black", "#1f1b1b", [
    "Black raw silk saree with German silver Paithani border, folded",
    "Paithani border with parrots and lotuses",
    "Wave-pattern pallu with Paithani border",
    "Silver buttis on the black body",
  ]),
  variant(B142, "rani-pink-raw-silk-paithani-saree", "Rani Pink", "#c2185b", [
    "Rani pink raw silk saree with German silver Paithani border, folded",
    "Close-up of the Paithani border",
  ]),
  lotus("gold-pure-tissue-lotus-saree", "Gold", "#c9a65a", 5, [
    "Gold pure tissue saree with a lotus embroidery border, folded",
    "Lotus embroidery flowing across the pallu",
    "The gold tissue saree with its lotus border",
    "Lotus border detail",
    "Embroidered lotus cluster on the pallu",
  ]),
  lotus("blush-pink-pure-tissue-lotus-saree", "Blush Pink", "#c99a9a", 2, [
    "Blush pink pure tissue saree with a lotus embroidery border, folded",
    "Close-up of the lotus embroidery border",
  ]),
  rawEmb("mustard-pure-raw-silk-embroidery-saree", "Mustard", "#d4a017", 3, [
    "Mustard pure raw silk saree with rose embroidery and cut-work border, folded",
    "Rose embroidery and scalloped cut-work border",
    "Cut-work border running along the pallu",
  ]),
  rawEmb("ivory-pure-raw-silk-embroidery-saree", "Ivory", "#efe6cf", 2, [
    "Ivory pure raw silk saree with rose embroidery and cut-work border, folded",
    "Close-up of the rose embroidery and cut work",
  ]),
  rawCut("violet-pure-raw-silk-cutwork-saree", "Violet", "#5b2bb5", 5, [
    "Violet pure raw silk saree with cut-work medallion and embroidered deer, folded",
    "Embroidered deer, blossoms and cut-work medallion",
    "Cut-work medallion detail",
    "Sequin-scattered violet body",
    "Violet and ivory colourways together",
  ]),
  rawCut("ivory-pure-raw-silk-cutwork-saree", "Ivory", "#efe6cf", 2, [
    "Ivory pure raw silk saree with cut-work medallion and embroidered deer, folded",
    "Ivory and violet colourways together",
  ]),
  georgette("wine-georgette-zari-saree", "Wine", "#5b1a2a"),
  georgette("rani-red-georgette-zari-saree", "Rani Red", "#a3163f"),
  georgette("mustard-georgette-zari-saree", "Mustard", "#d79a1f"),
  semiTissue({
    slug: "violet-semi-tissue-silk-saree",
    name: "Violet Semi Tissue Silk Saree",
    colour: "Violet",
    swatch: "#8a1fb0",
    files: [
      ["violet-semi-tissue-silk-saree", "Violet semi tissue silk saree, folded to show the zari border"],
      ["violet-semi-tissue-silk-saree-detail", "Close-up of the geometric gold zari border"],
      ["violet-semi-tissue-silk-saree-pallu", "The saree unfolded to show the pallu and zari"],
    ],
  }),
  semiTissue({
    slug: "magenta-semi-tissue-silk-saree",
    name: "Magenta Semi Tissue Silk Saree",
    colour: "Magenta",
    swatch: "#8e1150",
    files: [
      ["magenta-semi-tissue-silk-saree", "Magenta semi tissue silk saree, folded to show the zari border"],
      ["magenta-semi-tissue-silk-saree-detail", "Close-up of the patchwork-square zari border"],
    ],
  }),
  cotton("teal-green-cotton-blend-saree", "Teal Green", "#0e4d45", "a maroon floral border and a green diamond band"),
  cotton("crimson-red-cotton-blend-saree", "Crimson Red", "#b0161c", "an orange floral border on teal", "Bestseller"),
  cotton("mustard-cotton-blend-saree", "Mustard", "#d07a12", "a maroon floral border and a deep red diamond band"),
  cotton("olive-green-cotton-blend-saree", "Olive Green", "#3f4a1e", "a maroon floral border and a green diamond band"),
  cotton("coffee-brown-cotton-blend-saree", "Coffee Brown", "#3a2420", "a red floral border and a green diamond band"),
  cotton("maroon-cotton-blend-saree", "Maroon", "#5e1a17", "an orange floral border on teal"),
];

export const productHref = (slug: string) => `/products/${slug}`;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const discountPercent = (p: Pick<Product, "price" | "mrp">) =>
  Math.round(((p.mrp - p.price) / p.mrp) * 100);

/** Other pieces to show alongside a product: same fabric first, then same collection. */
export function relatedProducts(product: Product, limit = 4) {
  const others = products.filter((p) => p.slug !== product.slug);
  const sameFabric = others.filter((p) => p.fabric === product.fabric);
  const sameCollection = others.filter((p) => !sameFabric.includes(p) && p.collections[0] === product.collections[0]);
  const rest = others.filter((p) => !sameFabric.includes(p) && !sameCollection.includes(p));
  return [...sameFabric, ...sameCollection, ...rest].slice(0, limit);
}

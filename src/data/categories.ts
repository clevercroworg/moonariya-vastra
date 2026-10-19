export type Category = {
  slug: string;
  name: string;
  short: string;
  blurb: string;
  image: string;
};

const img = (slug: string) => `/images/categories/${slug}.jpg`;

export const categories: Category[] = [
  {
    slug: "silk-sarees",
    name: "Silk Sarees",
    short: "Silk",
    blurb: "Lustrous weaves and gleaming zari for weddings and festivals.",
    image: img("silk-sarees"),
  },
  {
    slug: "tissue-sarees",
    name: "Tissue Sarees",
    short: "Tissue",
    blurb: "A metallic sheen that catches every festive light.",
    image: img("tissue-sarees"),
  },
  {
    slug: "organza-sarees",
    name: "Organza Sarees",
    short: "Organza",
    blurb: "Sheer, structured and luminous — made for celebrations.",
    image: img("organza-sarees"),
  },
  {
    slug: "designer-sarees",
    name: "Designer Sarees",
    short: "Designer",
    blurb: "Statement embellishment with a contemporary silhouette.",
    image: img("designer-sarees"),
  },
  {
    slug: "party-wear-sarees",
    name: "Party Wear Sarees",
    short: "Party Wear",
    blurb: "Shimmer, sheen and drama for evenings out.",
    image: img("party-wear-sarees"),
  },
  {
    slug: "georgette-sarees",
    name: "Georgette Sarees",
    short: "Georgette",
    blurb: "Fluid drapes that move beautifully from day to evening.",
    image: img("georgette-sarees"),
  },
  {
    slug: "chiffon-sarees",
    name: "Chiffon Sarees",
    short: "Chiffon",
    blurb: "Featherlight and flowing for warm-weather occasions.",
    image: img("chiffon-sarees"),
  },
  {
    slug: "linen-sarees",
    name: "Linen Sarees",
    short: "Linen",
    blurb: "Crisp texture and a relaxed drape for workdays and brunches.",
    image: img("linen-sarees"),
  },
  {
    slug: "cotton-sarees",
    name: "Cotton Sarees",
    short: "Cotton",
    blurb: "Breathable and easy — made for everyday living.",
    image: img("cotton-sarees"),
  },
  {
    slug: "handloom-sarees",
    name: "Handloom Sarees",
    short: "Handloom",
    blurb: "Hand-woven heritage, crafted thread by thread.",
    image: img("handloom-sarees"),
  },
  {
    slug: "daily-wear-sarees",
    name: "Daily Wear Sarees",
    short: "Daily Wear",
    blurb: "Comfortable, low-fuss drapes you'll reach for every day.",
    image: img("daily-wear-sarees"),
  },
];

export const collectionHref = (slug: string) => `/collections/${slug}`;

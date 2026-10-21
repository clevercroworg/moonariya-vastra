// Homepage content. Image paths match the file names in IMAGE_PROMPTS.txt —
// drop the generated images into /public/images/... with the same names.

export type HeroSlide = {
  id: string;
  label: string;
  eyebrow: string;
  title: [string, string];
  copy: string;
  cta: { label: string; href: string };
  secondary: { label: string; href: string };
  image: string;
  alt: string;
  /** object-position used on narrow screens, where the wide image is cropped */
  mobileFocus: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "festive-silk",
    label: "The Festive Edit",
    eyebrow: "The Festive Edit · 2026",
    title: ["Woven in gold,", "worn for generations."],
    copy: "Rich silks with gleaming zari borders and pallus made for weddings, festivals and every moment worth remembering.",
    cta: { label: "Shop Silk Sarees", href: "/collections/silk-sarees" },
    secondary: { label: "View the Festive Edit", href: "/collections/festive-edit" },
    image: "/images/hero/hero-festive-silk.jpg",
    alt: "Woman in a deep maroon silk saree with a wide gold zari border, standing in a softly lit heritage hall",
    mobileFocus: "72% 30%",
  },
  {
    id: "semi-tissue",
    label: "Semi Tissue Silk",
    eyebrow: "New Arrival",
    title: ["Light as air,", "lit like a festival."],
    copy: "Featherlight semi tissue silks with geometric zari woven across jewel tones of magenta and violet.",
    cta: { label: "Shop Semi Tissue", href: "/collections/tissue-sarees" },
    secondary: { label: "See New Arrivals", href: "/collections/new-arrivals" },
    image: "/images/hero/hero-semi-tissue.jpg",
    alt: "Woman draping a violet semi tissue silk saree with a geometric gold zari pallu beside brass lamps",
    mobileFocus: "70% 30%",
  },
  {
    id: "everyday-cotton",
    label: "Everyday Cotton",
    eyebrow: "Cotton Blend Collection",
    title: ["Effortless drapes", "for every day."],
    copy: "Breathable cotton blend sarees with printed floral borders and a soft zari edge — made for long days and easy grace.",
    cta: { label: "Shop Cotton Sarees", href: "/collections/cotton-sarees" },
    secondary: { label: "Daily Wear Edit", href: "/collections/daily-wear-sarees" },
    image: "/images/hero/hero-everyday-cotton.jpg",
    alt: "Woman in a mustard cotton blend saree with a printed border walking through a sunlit courtyard",
    mobileFocus: "70% 30%",
  },
  {
    id: "party-wear",
    label: "Party Wear",
    eyebrow: "Evening Edit",
    title: ["Make every", "entrance unforgettable."],
    copy: "Organza, georgette and designer drapes that catch the light — and every eye in the room.",
    cta: { label: "Shop Party Wear", href: "/collections/party-wear-sarees" },
    secondary: { label: "Designer Sarees", href: "/collections/designer-sarees" },
    image: "/images/hero/hero-party-wear.jpg",
    alt: "Woman in a shimmering emerald organza saree at an evening celebration with warm bokeh lights",
    mobileFocus: "70% 30%",
  },
];

export type Look = {
  id: string;
  number: string;
  title: string;
  fabric: string;
  mood: string;
  image: string;
  alt: string;
  href: string;
};

export const looks: Look[] = [
  {
    id: "temple-bride",
    number: "01",
    title: "The Temple Bride",
    fabric: "Silk",
    mood: "Maroon and antique gold, worn with temple jewellery and jasmine.",
    image: "/images/saree-show/look-01-temple-bride.jpg",
    alt: "Bride in a maroon and gold silk saree with temple jewellery",
    href: "/collections/silk-sarees",
  },
  {
    id: "golden-hour",
    number: "02",
    title: "Golden Hour",
    fabric: "Tissue",
    mood: "A violet semi tissue drape that glows as the sun goes down.",
    image: "/images/saree-show/look-02-golden-hour.jpg",
    alt: "Woman in a violet tissue saree at sunset on a terrace",
    href: "/collections/tissue-sarees",
  },
  {
    id: "garden-soiree",
    number: "03",
    title: "Garden Soirée",
    fabric: "Organza",
    mood: "Blush organza with delicate florals for an afternoon celebration.",
    image: "/images/saree-show/look-03-garden-soiree.jpg",
    alt: "Woman in a blush pink floral organza saree in a garden",
    href: "/collections/organza-sarees",
  },
  {
    id: "city-poise",
    number: "04",
    title: "City Poise",
    fabric: "Linen",
    mood: "Crisp sage linen, a sleeveless blouse and a structured tote.",
    image: "/images/saree-show/look-04-city-poise.jpg",
    alt: "Woman in a sage green linen saree in a modern office lobby",
    href: "/collections/linen-sarees",
  },
  {
    id: "monsoon-muse",
    number: "05",
    title: "Monsoon Muse",
    fabric: "Georgette",
    mood: "Fluid emerald georgette that moves with every breeze.",
    image: "/images/saree-show/look-05-monsoon-muse.jpg",
    alt: "Woman in a flowing emerald georgette saree on a rain-washed balcony",
    href: "/collections/georgette-sarees",
  },
  {
    id: "everyday-grace",
    number: "06",
    title: "Everyday Grace",
    fabric: "Cotton",
    mood: "A teal cotton blend with a printed border, ready for the day.",
    image: "/images/saree-show/look-06-everyday-grace.jpg",
    alt: "Woman in a teal cotton blend saree with a printed border at a sunlit doorway",
    href: "/collections/cotton-sarees",
  },
];

export type Fabric = {
  id: string;
  name: string;
  tagline: string;
  feel: string;
  bestFor: string;
  drape: string;
  care: string;
  image: string;
  alt: string;
  href: string;
};

export const fabrics: Fabric[] = [
  {
    id: "silk",
    name: "Silk",
    tagline: "The heirloom",
    feel: "Rich, smooth and lustrous",
    bestFor: "Weddings, festivals, heirloom moments",
    drape: "Structured; holds pleats beautifully",
    care: "Dry clean only. Store wrapped in muslin.",
    image: "/images/products/mustard-pure-raw-silk-embroidery-saree-3.jpg",
    alt: "Close-up of mustard pure raw silk with a cut-work border",
    href: "/collections/silk-sarees",
  },
  {
    id: "tissue",
    name: "Tissue",
    tagline: "The festive glow",
    feel: "Light and crisp with a metallic sheen",
    bestFor: "Poojas, receptions, festive evenings",
    drape: "Crisp and lightly structured",
    care: "Dry clean. Refold along new lines to protect the zari.",
    image: "/images/products/violet-semi-tissue-silk-saree-detail.jpg",
    alt: "Close-up of violet semi tissue silk with geometric gold zari",
    href: "/collections/tissue-sarees",
  },
  {
    id: "organza",
    name: "Organza",
    tagline: "The light-catcher",
    feel: "Sheer, crisp and airy",
    bestFor: "Engagements, parties, day weddings",
    drape: "Voluminous; holds its shape",
    care: "Dry clean. Steam on low heat.",
    image: "/images/fabrics/organza.jpg",
    alt: "Close-up of sheer blush organza with floral embroidery",
    href: "/collections/organza-sarees",
  },
  {
    id: "georgette",
    name: "Georgette",
    tagline: "The free spirit",
    feel: "Soft, grainy and fluid",
    bestFor: "Cocktails, evening events, travel",
    drape: "Flowing and figure-skimming",
    care: "Gentle hand wash in cold water, or dry clean.",
    image: "/images/products/wine-georgette-zari-saree-2.jpg",
    alt: "Close-up of wine georgette with geometric gold zari",
    href: "/collections/georgette-sarees",
  },
  {
    id: "chiffon",
    name: "Chiffon",
    tagline: "The featherweight",
    feel: "Sheer, soft and featherlight",
    bestFor: "Summer occasions, day parties",
    drape: "Floaty and effortless",
    care: "Hand wash cold. Dry flat in the shade.",
    image: "/images/fabrics/chiffon.jpg",
    alt: "Close-up of sheer ivory chiffon with soft folds",
    href: "/collections/chiffon-sarees",
  },
  {
    id: "linen",
    name: "Linen",
    tagline: "The modern classic",
    feel: "Textured, breathable and cool",
    bestFor: "Workdays, brunches, summer",
    drape: "Relaxed with a crisp edge",
    care: "Gentle wash. Iron while slightly damp.",
    image: "/images/fabrics/linen.jpg",
    alt: "Close-up of textured sage linen with a thin zari stripe",
    href: "/collections/linen-sarees",
  },
  {
    id: "cotton",
    name: "Cotton",
    tagline: "The everyday companion",
    feel: "Soft, breathable and easy",
    bestFor: "Daily wear, office, warm weather",
    drape: "Crisp at first, softer with every wash",
    care: "Hand wash cold and separately for the first few washes.",
    image: "/images/products/teal-green-cotton-blend-saree-detail.jpg",
    alt: "Close-up of a teal cotton blend saree with a printed floral border and zari edge",
    href: "/collections/cotton-sarees",
  },
];

export type Occasion = {
  id: string;
  title: string;
  copy: string;
  image: string;
  alt: string;
  href: string;
  layout: "feature" | "wide" | "tile";
};

export const occasions: Occasion[] = [
  {
    id: "wedding-festive",
    title: "Weddings & Festivals",
    copy: "Silks and tissues with heirloom zari.",
    image: "/images/occasions/wedding-festive.jpg",
    alt: "Women in silk sarees at a festive wedding ceremony with marigold decor",
    href: "/collections/silk-sarees",
    layout: "feature",
  },
  {
    id: "party-wear",
    title: "Party Nights",
    copy: "Organza, georgette and shimmer.",
    image: "/images/occasions/party-wear.jpg",
    alt: "Woman in a shimmering georgette saree at an evening party",
    href: "/collections/party-wear-sarees",
    layout: "wide",
  },
  {
    id: "daily-wear",
    title: "Everyday Ease",
    copy: "Cottons made for real life.",
    image: "/images/products/cotton-blend-pallu-1.jpg",
    alt: "Printed floral pallu of a cotton blend saree",
    href: "/collections/daily-wear-sarees",
    layout: "tile",
  },
  {
    id: "work-wear",
    title: "Work Wear",
    copy: "Easy cotton blends for the 9-to-6.",
    image: "/images/products/teal-green-cotton-blend-saree.jpg",
    alt: "Teal green cotton blend saree with a printed border",
    href: "/collections/cotton-sarees",
    layout: "tile",
  },
];

export const story = {
  eyebrow: "Our Story",
  title: ["Where timeless drapes", "meet modern grace."],
  paragraphs: [
    "Monaariya Vastra celebrates the timeless elegance of Indian textiles. We curate sarees with rich designs, quality fabrics and fine craftsmanship — for the festivals you plan for and the ordinary days you want to feel special.",
    "Every piece is chosen for how it feels against the skin, how it falls when you walk, and how long it will stay in your wardrobe.",
  ],
  promises: [
    { title: "Handpicked fabrics", copy: "Each saree is checked for weave, colour and finish." },
    { title: "Honest pricing", copy: "Clear MRP and offer price on every piece." },
    { title: "Delivered across India", copy: "Packed with care and shipped to your door." },
  ],
  images: {
    main: "/images/story/story-drape.jpg",
    mainAlt: "Woman adjusting the pallu of a gold-bordered silk saree",
    inset: "/images/story/story-weave.jpg",
    insetAlt: "Hands guiding gold zari threads on a wooden handloom",
  },
};

export const trustFeatures = [
  { id: "shipping", title: "Free Shipping", copy: "Standard shipping across India" },
  { id: "payment", title: "Secure Payment", copy: "UPI, cards, net banking & COD" },
  { id: "offers", title: "Festive Offers", copy: "Guaranteed savings every season" },
  { id: "support", title: "Here to Help", copy: "Styling and order support, every day" },
] as const;

export type Testimonial = {
  quote: string;
  name: string;
  city: string;
  product: string;
};

// TODO(content): SAMPLE REVIEWS FOR LAYOUT ONLY — replace with real customer
// reviews (with permission) before the site goes live.
export const testimonials: Testimonial[] = [
  {
    quote:
      "The semi tissue saree looked even richer in person. The zari catches the light beautifully and it was so light to wear through a long pooja.",
    name: "Sample review",
    city: "Bengaluru",
    product: "Violet Semi Tissue Silk Saree",
  },
  {
    quote:
      "I bought two cotton blend sarees for office and they've become my favourites. Soft, easy to drape and the border prints are lovely.",
    name: "Sample review",
    city: "Mangaluru",
    product: "Teal Green Cotton Blend Saree",
  },
  {
    quote:
      "Packed with so much care, and the colour was exactly like the photos. I've already shared the site with my sister.",
    name: "Sample review",
    city: "Chennai",
    product: "Crimson Red Cotton Blend Saree",
  },
];

// Real product photos for now — swap for the brand's actual Instagram posts later.
export const instagramPosts = [
  { image: "/images/products/rose-gold-pure-kora-tissue-saree-4.jpg", alt: "Deer motifs on a rose pure kora tissue border" },
  { image: "/images/products/mustard-pure-raw-silk-embroidery-saree-2.jpg", alt: "Rose embroidery on mustard pure raw silk" },
  { image: "/images/products/gold-pure-tissue-lotus-saree-5.jpg", alt: "Lotus embroidery on a gold pure tissue saree" },
  { image: "/images/products/violet-pure-raw-silk-cutwork-saree-2.jpg", alt: "Embroidered deer on violet pure raw silk" },
  { image: "/images/products/cotton-blend-pallu-1.jpg", alt: "Printed floral pallu of a cotton blend saree" },
  { image: "/images/products/rani-red-georgette-zari-saree-1.jpg", alt: "Rani red georgette saree with gold zari" },
];

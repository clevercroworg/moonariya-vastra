type Site = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  contact: { phone: string; whatsapp: string; email: string; address: string; hours: string };
  social: { instagram: string; facebook: string; youtube: string };
  instagramHandle: string;
};

export const site: Site = {
  name: "Monaariya Vastra",
  tagline: "Timeless Drapes, Modern Grace",
  description:
    "Celebrating the timeless elegance of Indian textiles. Shop silk, cotton, linen, organza, georgette, chiffon, tissue, designer and handloom sarees from Monaariya Vastra.",
  url: "https://monaariyavastra.com", // TODO(content): confirm the production domain
  contact: {
    // TODO(content): real phone, WhatsApp, email and address from the client
    phone: "",
    whatsapp: "", // digits only with country code, e.g. 919876543210
    email: "",
    address: "",
    hours: "", // e.g. "Mon – Sat, 10 am – 7 pm"
  },
  social: {
    // TODO(content): real profile URLs
    instagram: "",
    facebook: "",
    youtube: "",
  },
  instagramHandle: "@monaariyavastra", // TODO(content): confirm handle
};

export const announcements = [
  "Free shipping across India",
  "Cash on delivery available",
  "New arrivals — Semi Tissue Silk sarees",
  "Secure payments · UPI · Cards · Net Banking",
];

export type NavLink = { label: string; href: string };

export const fabricLinks: NavLink[] = [
  { label: "Silk Sarees", href: "/collections/silk-sarees" },
  { label: "Cotton Sarees", href: "/collections/cotton-sarees" },
  { label: "Linen Sarees", href: "/collections/linen-sarees" },
  { label: "Organza Sarees", href: "/collections/organza-sarees" },
  { label: "Georgette Sarees", href: "/collections/georgette-sarees" },
  { label: "Chiffon Sarees", href: "/collections/chiffon-sarees" },
  { label: "Tissue Sarees", href: "/collections/tissue-sarees" },
];

export const styleLinks: NavLink[] = [
  { label: "Designer Sarees", href: "/collections/designer-sarees" },
  { label: "Handloom Sarees", href: "/collections/handloom-sarees" },
];

export const occasionLinks: NavLink[] = [
  { label: "Daily Wear Sarees", href: "/collections/daily-wear-sarees" },
  { label: "Party Wear Sarees", href: "/collections/party-wear-sarees" },
];

export const discoverLinks: NavLink[] = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "The Festive Edit", href: "/collections/festive-edit" },
  { label: "The Saree Show", href: "/#saree-show" },
  { label: "Fabric Guide", href: "/#fabric-guide" },
  { label: "Shop All Sarees", href: "/collections/all" },
];

export const primaryNav = [
  { label: "Shop", href: "/collections/all", mega: true },
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Festive Edit", href: "/collections/festive-edit" },
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      ...fabricLinks.slice(0, 5),
      { label: "Party Wear Sarees", href: "/collections/party-wear-sarees" },
      { label: "Shop All", href: "/collections/all" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
      { label: "Track Your Order", href: "/track-order" },
      { label: "Shipping Policy", href: "/policies/shipping" },
      { label: "Returns & Exchanges", href: "/policies/returns" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "The Saree Show", href: "/#saree-show" },
      { label: "Fabric Guide", href: "/#fabric-guide" },
      { label: "Privacy Policy", href: "/policies/privacy" },
      { label: "Terms of Service", href: "/policies/terms" },
    ],
  },
];

export const popularSearches = [
  "Silk sarees",
  "Semi tissue silk",
  "Organza",
  "Cotton blend",
  "Party wear",
  "Handloom",
];

export const paymentMethods = ["UPI", "Cards", "Net Banking", "COD"];

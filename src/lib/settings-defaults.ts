import type { Addon, SiteSettings } from "./types";

// Used until the client saves their own values in Admin → Settings.
export const DEFAULT_ADDONS: Addon[] = [
  {
    id: "falls-pico",
    name: "Falls & Pico Stitching",
    price: 150,
    note: "Fall attached and edges finished — ready to drape the day it arrives.",
  },
  {
    id: "pico-zigzag",
    name: "Pico / Zigzag Border",
    price: 100,
    note: "Neat machine-finished edge along the length of the saree.",
  },
  {
    id: "tassels",
    name: "Tassels on Pallu",
    price: 150,
    note: "Hand-knotted tassels (kuchu) along the pallu end.",
  },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  contact: { phone: "", whatsapp: "", email: "", address: "", hours: "" },
  social: { instagram: "", facebook: "", youtube: "" },
  instagramHandle: "@monaariyavastra",
  announcements: [
    "Free shipping across India",
    "Cash on delivery available",
    "New arrivals — pure raw silk & tissue sarees",
    "Secure payments · UPI · Cards · Net Banking",
  ],
  addons: DEFAULT_ADDONS,
};

export const addonById = (addons: Addon[], id: string) => addons.find((a) => a.id === id);

export const addonsTotal = (addons: Addon[], ids: string[]) =>
  ids.reduce((sum, id) => sum + (addonById(addons, id)?.price ?? 0), 0);

/** WhatsApp chat link with a pre-filled message (contact page until a number is set). */
export const whatsappLink = (number: string, message: string) =>
  number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : "/contact";

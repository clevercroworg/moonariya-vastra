// Finishing services offered on every saree (carried over from the original store).
export type Addon = {
  id: string;
  name: string;
  price: number;
  note: string;
};

export const addons: Addon[] = [
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

export const addonById = (id: string) => addons.find((a) => a.id === id);

export const addonsTotal = (ids: string[]) =>
  ids.reduce((sum, id) => sum + (addonById(id)?.price ?? 0), 0);

/** "Rose & Gold Pure Kora Tissue Saree" → "rose-gold-pure-kora-tissue-saree" */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** True for photos uploaded through the admin (stored in Vercel Blob). */
export const isBlobUrl = (src: string) => {
  try {
    return new URL(src).hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
};

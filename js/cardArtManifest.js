/** Auto-generated card art manifest — run scripts/split-card-sheet.py */

/** @type {Record<string, string>} */
export const CARD_ART_URLS = {};

/** @param {string} id */
export function cardArtUrl(id) {
  return CARD_ART_URLS[id] || null;
}

/** @param {string} id */
export function hasCardArt(id) {
  return id in CARD_ART_URLS;
}

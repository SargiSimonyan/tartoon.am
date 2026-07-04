/**
 * Central site configuration — single source of truth for business info.
 *
 * ▸ REPLACE the placeholder values below with the real ones before launch.
 *   Everything on the site (header, footer, contact widget, order form,
 *   WhatsApp/Telegram deep-links, SEO metadata) reads from here.
 */

export const site = {
  name: "Tartoon",
  /** Legal / full name shown in footer & structured data */
  legalName: "Tartoon — custom furniture workshop",
  domain: "tartoon.am",
  url: "https://tartoon.am",

  /** Contact — REPLACE with real values */
  phone: "+374 00 000000", // display + tel: link
  email: "info@tartoon.am",

  /** Messengers — REPLACE handles/numbers. Empty string hides the channel. */
  whatsapp: "37400000000", // digits only, no + or spaces (used in wa.me/<number>)
  telegram: "tartoon_am", // username without @ (used in t.me/<username>)
  instagram: "tartoon.am", // username without @
  facebook: "", // page slug, e.g. "tartoon.am" — empty hides it

  /** Physical location — REPLACE */
  address: {
    hy: "Երևան, Հայաստան",
    ru: "Ереван, Армения",
    en: "Yerevan, Armenia",
  },
  /** Google Maps link for the address (optional) */
  mapUrl: "https://maps.google.com/?q=Yerevan+Armenia",

  currency: "AMD",
} as const;

/** tel: href with no spaces */
export const telHref = `tel:${site.phone.replace(/\s+/g, "")}`;
export const mailHref = `mailto:${site.email}`;

/** wa.me deep link, optionally pre-filled with a message */
export function whatsappHref(text?: string) {
  if (!site.whatsapp) return "";
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** t.me deep link, optionally pre-filled with a message */
export function telegramHref(text?: string) {
  if (!site.telegram) return "";
  const base = `https://t.me/${site.telegram}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function instagramHref() {
  return site.instagram ? `https://instagram.com/${site.instagram}` : "";
}

export function facebookHref() {
  return site.facebook ? `https://facebook.com/${site.facebook}` : "";
}

/** Format an integer amount as Armenian Dram, e.g. 530000 → "530 000 ֏" */
export function formatAMD(amount: number): string {
  const rounded = Math.round(amount);
  const grouped = rounded.toLocaleString("fr-FR").replace(/ |,/g, " ");
  return `${grouped} ֏`;
}

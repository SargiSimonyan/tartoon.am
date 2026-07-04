# Tartoon — tartoon.am

Marketing + lead-generation site for **Tartoon**, a custom-furniture workshop in
Yerevan. Trilingual (Armenian / Russian / English), built with Next.js App Router.

## Stack

- **Next.js 16** (App Router, React 19, React Compiler)
- **next-intl** — locales `hy` (default), `ru`, `en`
- **Tailwind CSS v4** with a custom "blueprint / spec-sheet" design system

## Features

- **Calculator** (`/calculator`) — live cost estimate from product, dimensions,
  material and hardware, in AMD (֏).
- **Configurator** (`/configurator`) — parametric front-elevation preview (SVG)
  that redraws with size / sections / material / hardware, plus live price.
- **Request form** (`/order`) — validated, posts to `/api/order`, with a
  guaranteed WhatsApp / Telegram deep-link fallback.
- **Portfolio** (`/portfolio`) — filterable gallery; real photos or generated
  blueprint drawings.
- **Reviews** (`/reviews`) — testimonials with ratings.
- Floating quick-contact widget (WhatsApp / Telegram / call / email).

## Configure before launch

1. **`src/lib/site.ts`** — replace phone, email, address, map URL and the
   WhatsApp / Telegram / Instagram / Facebook handles.
2. **`src/lib/pricing.ts`** — tune base prices, material rates and hardware
   tiers to match real workshop rates.
3. **`src/lib/portfolio.ts` / `src/lib/reviews.ts`** — real projects & reviews.
4. Add real project photos to `/public` and reference them in `portfolio.ts`.

### Optional: deliver leads to Telegram

Set these env vars (e.g. in Vercel) — no code change needed:

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

Without them, the form still succeeds and users fall back to the WhatsApp /
Telegram deep links.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

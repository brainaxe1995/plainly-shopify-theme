# Plainly — Shopify Theme

Pixel-perfect Shopify port of the Plainly React app. Dark near-black surface, acid-green accent, Anton display + Archivo body.

## Structure

```
assets/          theme.css + theme.js + product/lifestyle jpgs + favicon
config/          settings_schema.json + settings_data.json
layout/          theme.liquid (site shell)
locales/         en.default.json
sections/        home-*, product-*, header, footer, page-main, product-main, collection-main
snippets/        advisor-card, guarantee, support-note, faq
templates/       index.json, product.json, page.json, page.plainly-buy.json, collection.json, cart.liquid, article.liquid, blog.liquid, 404.liquid, search.liquid, list-collections.liquid
```

## Install

1. Zip the whole folder: `plainly-shopify-theme.zip`.
2. Shopify Admin → **Online Store → Themes** → *Add theme* → **Upload zip file**.
3. Preview / publish.

## Products

Import `plainly-products.csv` (in repo root, one level up from theme):

1. Shopify Admin → **Products → Import** → upload CSV.
2. 6 products land: Plainly · 1 week / 2 weeks / 4 weeks / 8 weeks / 12 weeks / 24 weeks.
3. Add all 6 to a new collection called **"Bundles"** (or whichever handle you pick).
4. On the theme customizer, open the **product page** for `page.plainly-buy` template → **Bundle selector** section → pick the "Bundles" collection.

### Product metafields (optional, powers the bundle selector badges)

Create these on the `products` resource, namespace `plainly`:

| Key          | Type              | Example        |
|--------------|-------------------|----------------|
| `weeks`      | Integer           | 1, 2, 4, 8, 12, 24 |
| `tablets`    | Integer           | 7, 14, 28, 56, 84, 168 |
| `badge`      | Single line text  | "Try it", "Most people start here", ... |
| `tone`       | Single line text  | forest / moss / ink / lime / muted |

Without them the selector still renders — just no coloured corner badges.

## Landing page (long-form buy page)

1. Shopify Admin → **Online Store → Pages** → *Add page*.
2. Title: `Buy`. Handle: `buy`.
3. Template: **page.plainly-buy** (dropdown on the right).
4. Save. Visit `/pages/buy`.
5. Header nav's "What we send" link — set in **Header** section settings to `/pages/buy`.

## Legal pages

Create Shopify pages with these handles (template auto-picks `page`):
- `/pages/privacy`
- `/pages/terms`
- `/pages/refunds`
- `/pages/shipping`
- `/pages/imprint`

Paste your legal copy into the page body — theme renders it in the same column layout as the React source.

## Tailwind

Tailwind is loaded via the Play CDN (`https://cdn.tailwindcss.com`) in `layout/theme.liquid` for zero-build convenience. For production polish, compile once locally and swap the `<script>` line for a compiled `assets/tailwind.css` link.

## Design tokens

All colours, fonts, radii, spacing live as CSS custom properties in `assets/theme.css`. Change once, propagates everywhere. Never hardcode hex values in Liquid.

## Fonts

Google Fonts: Anton (display) + Archivo 400/500/600/700/800 (body). Preconnected in `theme.liquid`.

## Ported from

React / TanStack Start source at `../placeholder-dream-weaver/`. Original at https://github.com/brainaxe1995/placeholder-dream-weaver

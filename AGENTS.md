# AGENTS.md — working notes for this repository

Non-obvious facts a new session needs. Product/stack overview lives in `README.md`.

## Run & verify

```bash
docker compose -f docker-compose.base44.yml up -d        # first boot: install → migrate → seed → next dev
docker compose -f docker-compose.base44.yml logs -f app
docker compose -f docker-compose.base44.yml exec -T app npx tsc --noEmit   # type check (no host runtime needed)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/shop
```

The container runs `npm ci && prisma generate && prisma migrate deploy && prisma db seed && next dev`.
`npm ci` needs a lockfile that matches `package.json` — run `npm install` locally after editing deps.
Prisma prints an `libssl … Defaulting to openssl-1.1.x` warning in `node:22-bookworm-slim`; it is
noise, the engine works (queries and seeding succeed).

## Data model rules

- **Money is integer Toman.** Never store floats for money. Rial is a display option (`lib/format.ts`).
- **Prices are never stored on products.** Always derive them with
  `getPricingContext()` + `computePrice()` from `lib/pricing.ts`; pages use `lib/catalog.ts`
  helpers (`searchProducts`, `getFeaturedProducts`, `getProductBySlug`, `getProductsByIds`).
  Rendering a raw product row's price would ignore the gold rate.
- `Product.searchText` is a Persian-normalised haystack built with `buildSearchText()`.
  **Keep it in sync** whenever a product is created/edited (seed + `actions/admin.ts` do this),
  otherwise the product becomes unfindable in search.
- Order items snapshot `goldRate` and `unitPrice`; never re-price an existing order.

## Code layout

- `app/(store)/…` — storefront pages with the public chrome (`SiteHeader`/`SiteFooter`).
- `app/admin/…` — dashboard with its own chrome; deliberately outside the store group.
- `app/layout.tsx` — only `<html>/<body>`, fonts and JSON-LD. Do not add storefront chrome here.
- `actions/*.ts` — all Server Actions (`"use server"`). Form actions used with `useActionState`
  take `(prevState, formData)`; actions used directly by `<form action={fn}>` take `formData` only.
- Admin forms all use the `AdminForm` client wrapper (`components/admin/admin-form.tsx`) which
  renders `useActionState` state, field errors and the pending button. Delete buttons use a
  bound action: `deleteXAction.bind(null, id)`.
- Auth: `getCurrentUser()` (request-memoised) for reads, `requireUser()` / `requireAdmin()` for
  guarded pages and every admin action. Sessions are hashed tokens in the `Session` table.
- Rate limiting is in-process (`lib/rate-limit.ts`) — fine for one instance only.

## Sandbox/preview quirks

- Preview overrides are gated on `BASE44_PREVIEW_MODE === "1"` in `next.config.ts`
  (`allowedDevOrigins`, Server Action allowed origins, CSP frame-ancestors). Without the flag
  the config behaves like a normal Next app.
- In the preview harness the browser drops cookies between calls, so any cart → checkout →
  order flow must run inside **one** script.
- `window.__base44_preview.navigate()` only renders routes that have a matching link on the
  current page (it falls back to clicking that link). `/checkout` has no header link — drive it
  by clicking the cart page's «ادامه و پرداخت» link instead of navigating directly.

## Seeding

`prisma/seed.ts` is idempotent (upserts by slug / unique key) and runs on every boot. It creates
the two demo accounts, gold rates, 15 products, categories, collections, shipping methods,
coupons (`ZARRIN10`, `GOLD500`), ads, banners, testimonials, reviews and blog posts. It never
overwrites edited product rows with new ids, but it *does* reset product fields to the seed
values — treat the seed as demo data, not a migration.

## Tests

No test framework is configured. Verification is: `npx tsc --noEmit`, a curl sweep of every
route (expect 200, 307 for auth-gated, 404 for missing records), and driving the real flows in
the preview (add to cart → cart → checkout → order; admin login → products/pricing/ads).

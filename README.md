# زرّین — ZARRIN · فروشگاه طلا و جواهرات

A production-shaped luxury gold & jewellery e-commerce site for the Iranian market:
Persian/RTL storefront, gold-rate pricing engine, full checkout, customer accounts,
and an admin dashboard with a self-serve advertising module.

**Stack:** Next.js 15 (App Router, React Server Components, Server Actions) · TypeScript ·
Tailwind CSS v4 · PostgreSQL 16 + Prisma · session auth with bcrypt · self-hosted fonts.

---

## 1. Run it

### Sandbox / development (Docker Compose)

```bash
docker compose -f docker-compose.base44.yml up -d
```

Open http://localhost:3000. The `app` service installs dependencies (`npm ci`), generates the
Prisma client, applies migrations, seeds sample data, then runs `next dev` with hot reload
against the bind-mounted source. Postgres runs as the `db` service.

Seeded accounts (override with `SEED_ADMIN_PASSWORD` / `SEED_DEMO_PASSWORD`):

| Role     | Email                | Password     |
| -------- | -------------------- | ------------ |
| Admin    | `admin@zarrin.ir`    | `Zarrin@1404` |
| Customer | `customer@zarrin.ir` | `Zarrin@1404` |

### Local (no Docker)

```bash
npm ci
cp .env.example .env      # then set DATABASE_URL
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

## 2. Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical origin for SEO/canonical URLs and sitemap (e.g. `https://zarrin.ir`) |
| `BASE44_PREVIEW_MODE` | preview only | `1` enables sandbox-only overrides (allowed dev origins, CSP frame ancestors). Unset = original behaviour |
| `BASE44_PUBLIC_HOST_SUFFIX` / `BASE44_SANDBOX_HOST_DOMAIN` | preview only | Used to build the allowed preview origins |
| `SEED_ADMIN_PASSWORD` / `SEED_DEMO_PASSWORD` | optional | Override the seeded demo passwords |

No third-party credentials are required to boot. The payment gateway is configured from the
admin dashboard (Settings → درگاه پرداخت) and defaults to manual mode.

## 3. Feature map

**Storefront** — hero, featured collections, product grid, editorial craftsmanship section,
testimonial carousel, newsletter, footer with policies. Sticky header, search overlay, mobile
drawer, wishlist/cart counters. Every section is fed from the database.

**Commerce** — catalogue with category/purity/price/stock filters, sorting, pagination and
Persian-normalised search; product pages with gallery + zoom, variant (size) selection, live
price breakdown, reviews, related products; cart; checkout with address form, shipping methods,
coupons; order history, order detail with status timeline and tracking code; public order
tracking (order number **and** phone required); account dashboard, addresses, wishlist.

**Pricing engine** (`lib/pricing.ts`) — every price derives from the admin-managed gold rate:

```
goldValue = weight × rate[purity]
making    = goldValue × makingCharge%
profit    = (goldValue + making) × profit%
subtotal  = goldValue + making + profit
tax       = subtotal × tax%
listPrice = subtotal + tax
final     = listPrice − discount%
```

Rates are edited in **Admin → نرخ طلا**; the last update time is shown on the storefront.
`manualPrice` (or `autoCalculate = false`) overrides the calculator for individual pieces.

**Admin dashboard** (`/admin`, ADMIN/STAFF only) — overview KPIs, orders + status workflow,
products (pricing fields, specs, SEO, flags), categories, collections, customers & roles,
coupons, banners, ads, testimonials, product-review moderation, blog, site settings, shipping
methods, audit log.

**Advertising module** — campaigns per placement (`HOME_TOP`, `HOME_MIDDLE`, `CATEGORY`,
`PRODUCT_LIST`, `SIDEBAR`, `FOOTER`) with schedule, priority, desktop/mobile creatives, click
tracking and impression tracking. Empty placements render nothing (no gap, no layout shift),
creatives reserve space via a fixed aspect ratio, images are lazy-loaded, and every placement is
labelled «تبلیغ».

**SEO** — per-page metadata, canonical URLs, Open Graph, JSON-LD (JewelryStore, WebSite +
SearchAction, Product with offers/aggregateRating, BreadcrumbList), `sitemap.xml`, `robots.txt`,
semantic headings, descriptive alt text.

## 4. Database

PostgreSQL via Prisma (`prisma/schema.prisma`, migration in `prisma/migrations`).

`User`, `Session`, `Address`, `Category`, `Collection`, `Product`, `ProductVariant`, `GoldRate`,
`PricingConfig`, `Cart`, `CartItem`, `WishlistItem`, `ShippingMethod`, `Coupon`, `Order`,
`OrderItem`, `OrderEvent`, `Review`, `Testimonial`, `Banner`, `Ad`, `AdStat`, `BlogPost`,
`Setting`, `NewsletterSubscriber`, `ContactMessage`, `AuditLog`.

Money is stored as **integer Toman** (no floating point). Rial display is a ×10 presentation
option in pricing settings. Order items snapshot the gold rate and unit price at purchase time.

## 5. Security

- Passwords hashed with bcrypt (cost 12); sessions are random 256-bit tokens stored **hashed**
  in the database and delivered in an `httpOnly`, `SameSite=Lax`, `Secure`-in-production cookie.
- Server-side validation with Zod on every mutation (never trust client input); Prisma
  parameterises all SQL (no string concatenation).
- Authorisation: `requireUser` / `requireAdmin` guards on every account and admin page and on
  every admin Server Action; role checks are enforced server-side.
- Brute-force protection: per-IP and per-email login rate limits plus account lockout after 5
  failed attempts; rate limits on register, reviews, contact, newsletter, order placement and
  ad beacons.
- CSRF: mutations run as Server Actions (Next validates the request Origin) and session cookies
  are `SameSite=Lax`; no state-changing GET endpoints except tracked ad click-through, which
  only redirects and counts.
- XSS: React escaping everywhere; the only `dangerouslySetInnerHTML` is JSON-LD built from
  server data with `<` escaped. Strict-ish CSP, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, HSTS and frame-ancestors set in `next.config.ts`.
- File uploads are not accepted from end users (images are referenced by path); admin-entered
  ad URLs are validated to `http(s)://` or a same-site path to prevent open redirects.
- Audit log records every administrative mutation with actor, entity and IP.

## 6. Iran compatibility

- Persian-first UI, `dir="rtl"`, Vazirmatn + Cormorant Garamond **self-hosted** in
  `public/fonts` — no Google Fonts, no external CDN at runtime.
- Jalali dates via the built-in `fa-IR` ICU calendar; Persian numerals everywhere.
- Search normalises Arabic/Persian variants (ي/ی، ك/ک، آ/ا، ۀ/ه، Persian digits).
- Toman/Rial display switch; Iranian provinces, postal-code and mobile validation; shipping
  methods are data, not code.
- No third-party analytics/trackers, so nothing depends on a blocked external service.

## 7. Deployment notes

`npm run build` then `npm start` (both bind `0.0.0.0:3000`). Terminate TLS in front of the app
(HSTS is already sent), set `NEXT_PUBLIC_SITE_URL`, run `prisma migrate deploy`, and keep
`DATABASE_URL` out of the repository. Remember:

- Move rate limiting to a shared store (Redis) when running more than one instance.
- Replace the `'unsafe-inline'` script CSP with a nonce-based policy.
- Wire the payment gateway (below) and transactional email before going live.

## 8. Payment gateway integration point

Checkout creates a real order (`PENDING` / `UNPAID`) with a payment record on the order, then
shows the payment instructions for the configured mode. `Settings.paymentGateway` is
`manual | zarinpal | idpay` and `gatewayMerchantId` holds the public merchant id. To go live:

1. Store the provider secret as an environment secret (never in the database or repo).
2. Add `POST /api/payments/start` that calls the provider's *payment request* endpoint with the
   order amount (Rial) and a callback URL, then redirects to the returned gateway URL.
3. Add `GET /api/payments/callback` that verifies the authority/token with the provider,
   marks the order `PAID` + `paymentStatus = PAID`, stores `paymentRef`, and appends an
   `OrderEvent`.

Until then the site runs in manual mode and never presents a non-functional payment button.

## 9. Known limitations

- Product photography ships as **licensed stock photographs** (`public/products/*.jpg`, Pexels
  licence) mapped in `prisma/seed.ts`. They are demo imagery, not photographs of the actual
  pieces; upload real product photos from the admin panel and they take precedence.
- Visual system: pearl white, icy turquoise, seafoam, aqua and metallic silver surfaces, with
  champagne gold reserved for accents (see the tokens in `app/globals.css`).
- Price sorting and price-range filtering are computed in-app over the filtered set (capped at
  500 rows per query) — add a denormalised price column if the catalogue grows beyond that.
- Rate limiting is in-process (single instance).
- Single locale (fa-IR). Copy for shared chrome lives in `lib/site.ts`; per-page copy lives with
  the page, ready to be extracted into a locale dictionary.
- No transactional email/SMS (order notifications are surfaced in the UI only).

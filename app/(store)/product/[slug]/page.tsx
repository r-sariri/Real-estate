import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { formatDate, formatMoney, formatPurity, formatWeight } from "@/lib/format";
import { absoluteUrl, jsonLdScript, productJsonLd } from "@/lib/seo";
import { ProductGallery } from "@/components/product-gallery";
import { AddToCart, WishlistButton, type ProductDTO } from "@/components/product-actions";
import { ProductCard } from "@/components/product-card";
import { ReviewForm } from "@/components/review-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Rating } from "@/components/ui";
import { Icon } from "@/components/icons";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) return { title: "محصول یافت نشد" };
  const { product } = data;
  const title = product.metaTitle ?? product.name;
  const description = product.metaDescription ?? product.shortDescription ?? product.description.slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl(`/product/${product.slug}`),
      images: product.images.map((image) => ({ url: image, alt: product.name })),
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
  if (!data) notFound();

  const { product, price, ratingValue, ratingCount, currency } = data;
  const [user, settings, related, wishlisted] = await Promise.all([
    getCurrentUser(),
    getSettings(),
    getRelatedProducts(product.categoryId, product.id, 4),
    getCurrentUser().then((current) =>
      current
        ? prisma.wishlistItem
            .findUnique({ where: { userId_productId: { userId: current.id, productId: product.id } } })
            .then(Boolean)
        : false,
    ),
  ]);

  const specs = (product.specs ?? {}) as Record<string, string>;
  const inStock = product.variants.length > 0 ? product.variants.some((variant) => variant.stock > 0) : product.stock > 0;

  const dto: ProductDTO = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    purity: product.purity,
    weightGrams: product.weightGrams,
    images: product.images,
    stock: product.stock,
    inStock,
    price: price.finalPrice,
    compareAt: price.discount > 0 ? price.listPrice : null,
    perGram: price.perGram,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      stock: variant.stock,
      priceDelta: variant.priceDelta,
    })),
  };

  const breakdown = [
    { label: `ارزش طلا (${formatWeight(product.weightGrams)} × نرخ روز)`, value: price.goldValue },
    { label: `اجرت ساخت (${price.manual ? "قیمت دستی" : `${product.makingChargePercent}٪`})`, value: price.making },
    { label: `سود فروشگاه (${product.profitPercent}٪)`, value: price.profit },
    { label: `مالیات بر ارزش افزوده (${product.taxPercent}٪)`, value: price.tax },
  ];

  return (
    <div className="container-lux py-8 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          productJsonLd({
            name: product.name,
            slug: product.slug,
            description: product.shortDescription ?? product.description,
            images: product.images,
            price: price.finalPrice,
            inStock,
            purity: product.purity,
            weightGrams: product.weightGrams,
            ratingValue: ratingValue || undefined,
            reviewCount: ratingCount || undefined,
            brandName: settings.brandName,
          }),
        )}
      />
      <Breadcrumbs
        items={[
          { name: "فروشگاه", href: "/shop" },
          { name: product.category.name, href: `/shop?category=${product.category.slug}` },
          { name: product.name, href: `/product/${product.slug}` },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/shop?category=${product.category.slug}`} className="text-[11px] tracking-[0.18em] text-gold-deep uppercase hover:underline">
              {product.category.name}
            </Link>
            {product.isNew ? <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] text-pearl">جدید</span> : null}
            {price.discountPercent > 0 ? (
              <span className="rounded-full bg-danger px-2 py-0.5 text-[10px] text-white">{price.discountPercent}٪ تخفیف</span>
            ) : null}
          </div>

          <h1 className="mt-2.5 text-2xl leading-snug font-semibold sm:text-3xl">{product.name}</h1>
          {ratingCount > 0 ? (
            <div className="mt-2.5">
              <Rating value={ratingValue} count={ratingCount} />
            </div>
          ) : (
            <p className="mt-2 text-[11.5px] text-muted">هنوز امتیازی ثبت نشده است</p>
          )}

          <p className="mt-4 text-[13.5px] leading-7 text-ink-soft">{product.shortDescription}</p>

          <div className="mt-5 flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-white/70 px-4 py-3.5">
            <div>
              <p className="text-[10.5px] text-muted">قیمت نهایی</p>
              <p className="text-xl font-semibold sm:text-2xl">{formatMoney(price.finalPrice, currency)}</p>
              {price.discount > 0 ? (
                <p className="text-[11.5px] text-muted">
                  <span className="line-through">{formatMoney(price.listPrice, currency)}</span>
                  <span className="ms-2 text-danger">−{formatMoney(price.discount, currency)}</span>
                </p>
              ) : null}
            </div>
            <div className="ms-auto text-end">
              <p className="text-[10.5px] text-muted">نرخ هر گرم پس از اجرت</p>
              <p className="text-[12.5px] font-medium">{formatMoney(price.perGram, currency)}</p>
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "عیار", value: formatPurity(product.purity) },
              { label: "وزن", value: formatWeight(product.weightGrams) },
              { label: "سنگ", value: specs.stone ?? "بدون سنگ" },
              { label: "ساخت", value: specs.madeIn ?? "ایران" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-line bg-white px-3 py-2">
                <dt className="text-[10px] text-muted">{item.label}</dt>
                <dd className="mt-0.5 text-[12px] font-medium text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>

          <p className={`mt-4 flex items-center gap-1.5 text-[12px] ${inStock ? "text-success" : "text-danger"}`}>
            <span className={`inline-block size-1.5 rounded-full ${inStock ? "bg-success" : "bg-danger"}`} aria-hidden />
            {inStock ? (product.stock <= 3 ? `تنها ${product.stock} عدد در انبار` : "موجود در انبار — آماده ارسال") : "این محصول فعلاً موجود نیست"}
          </p>

          <div className="mt-5">
            <AddToCart product={dto} showQty />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <WishlistButton productId={product.id} initial={wishlisted} variant="inline" />
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${product.name} — ${absoluteUrl(`/product/${product.slug}`)}`)}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3.5 text-sm text-ink-soft transition-colors hover:border-gold hover:text-gold-deep"
            >
              <Icon name="whatsapp" size={17} />
              مشورت با کارشناس
            </a>
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {[
              { icon: "truck" as const, title: "ارسال بیمه‌شده", text: settings.shippingNote },
              { icon: "shield" as const, title: "اصالت تضمینی", text: specs.warranty ?? "گواهی اصالت زرّین" },
              { icon: "receipt" as const, title: "فاکتور رسمی", text: "همراه با ریز قیمت طلا و اجرت" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-line bg-white/60 p-3">
                <p className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink">
                  <Icon name={item.icon} size={14} className="text-gold-deep" />
                  {item.title}
                </p>
                <p className="mt-1 text-[10.5px] leading-5 text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Description + breakdown ---------- */}
      <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="description-heading">
          <h2 id="description-heading" className="text-lg font-semibold">درباره این قطعه</h2>
          <div className="mt-3 space-y-3 text-[13.5px] leading-8 text-ink-soft">
            {product.description.split("\n").filter(Boolean).map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <h3 className="mt-8 text-sm font-semibold">مشخصات</h3>
          <dl className="mt-3 divide-y divide-line rounded-2xl border border-line bg-white/70">
            {Object.entries(specs).map(([key, value]) => {
              const labels: Record<string, string> = {
                material: "جنس",
                stone: "سنگ",
                size: "اندازه",
                warranty: "گارانتی",
                madeIn: "محل ساخت",
              };
              return (
                <div key={key} className="flex items-center justify-between gap-4 px-4 py-2.5 text-[12.5px]">
                  <dt className="text-muted">{labels[key] ?? key}</dt>
                  <dd className="text-end text-ink">{value}</dd>
                </div>
              );
            })}
          </dl>
        </section>

        <aside aria-labelledby="breakdown-heading" className="h-fit rounded-3xl border border-line bg-white/70 p-5">
          <h2 id="breakdown-heading" className="flex items-center gap-2 text-sm font-semibold">
            <Icon name="scale" size={16} className="text-gold-deep" />
            ریز قیمت این قطعه
          </h2>
          <p className="mt-1 text-[10.5px] text-muted">
            نرخ پایه هر گرم طلای {product.purity} عیار: {formatMoney(price.goldRate, currency)}
          </p>
          <dl className="mt-4 space-y-2.5 text-[12.5px]">
            {breakdown.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-soft">{row.label}</dt>
                <dd className="shrink-0 font-medium">{formatMoney(row.value, currency)}</dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-3 border-t border-line pt-2.5">
              <dt className="text-ink-soft">جمع</dt>
              <dd className="font-medium">{formatMoney(price.listPrice, currency)}</dd>
            </div>
            {price.discount > 0 ? (
              <div className="flex items-baseline justify-between gap-3 text-danger">
                <dt>تخفیف ({price.discountPercent}٪)</dt>
                <dd className="font-medium">−{formatMoney(price.discount, currency)}</dd>
              </div>
            ) : null}
            <div className="flex items-baseline justify-between gap-3 border-t border-line pt-2.5 text-[14px]">
              <dt className="font-semibold">مبلغ قابل پرداخت</dt>
              <dd className="font-semibold">{formatMoney(price.finalPrice, currency)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-[10.5px] leading-5 text-muted">
            قیمت‌ها بر اساس نرخ روز طلا محاسبه شده و تا زمان ثبت سفارش ممکن است تغییر کند.
          </p>
        </aside>
      </div>

      {/* ---------- Reviews ---------- */}
      <section aria-labelledby="reviews-heading" className="mt-14">
        <h2 id="reviews-heading" className="text-lg font-semibold">نظرات مشتریان</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            {product.reviews.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-line bg-white/60 px-4 py-8 text-center text-[12.5px] text-muted">
                هنوز نظری برای این محصول ثبت نشده است. اولین نفر باشید.
              </p>
            ) : (
              product.reviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-line bg-white/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[12.5px] font-medium">{review.authorName}</p>
                    <Rating value={review.rating} size={12} />
                  </div>
                  {review.title ? <h3 className="mt-2 text-[13px] font-medium">{review.title}</h3> : null}
                  <p className="mt-1.5 text-[12.5px] leading-7 text-ink-soft">{review.body}</p>
                  <p className="mt-2 text-[10.5px] text-muted">{formatDate(review.createdAt)}</p>
                </article>
              ))
            )}
          </div>
          <ReviewForm productId={product.id} canReview={Boolean(user)} />
        </div>
      </section>

      {/* ---------- Related ---------- */}
      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="mt-14">
          <h2 id="related-heading" className="text-lg font-semibold">قطعه‌های مرتبط</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} currency={currency} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

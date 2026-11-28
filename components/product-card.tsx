import Link from "next/link";
import { faNum, formatMoney, formatPurity, formatWeight } from "@/lib/format";
import { Icon } from "./icons";
import { AddToCart, QuickView, WishlistButton, type ProductDTO } from "./product-actions";

export type CardProduct = ProductDTO & {
  isNew: boolean;
  discountPercent: number;
  categoryName?: string;
};

export function ProductCard({
  product,
  wishlisted = false,
  currency = "TOMAN",
}: {
  product: CardProduct;
  wishlisted?: boolean;
  currency?: "TOMAN" | "RIAL";
}) {
  const lowStock = product.inStock && product.stock <= 3;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-silver/70 bg-white/70 p-2.5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:bg-white/90 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-white via-cream to-ice/70">
        <Link href={`/product/${product.slug}`} className="block h-full w-full" aria-label={product.name}>
          <img
            src={product.images[0] ?? "/hero.jpg"}
            alt={`${product.name} — ${formatPurity(product.purity)}، ${formatWeight(product.weightGrams)}`}
            width={600}
            height={600}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
          />
          {product.images[1] ? (
            <img
              src={product.images[1]}
              alt=""
              aria-hidden
              width={600}
              height={600}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          ) : null}
        </Link>

        <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
          <div className="flex flex-col items-start gap-1.5">
            {product.discountPercent > 0 ? (
              <span className="rounded-full bg-danger px-2 py-0.5 text-[10px] font-semibold text-white">
                {product.discountPercent}٪ تخفیف
              </span>
            ) : null}
            {product.isNew ? (
              <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium text-pearl">جدید</span>
            ) : null}
            {!product.inStock ? (
              <span className="rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-medium text-white">ناموجود</span>
            ) : null}
          </div>
          <div className="pointer-events-auto flex flex-col gap-1.5 opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
            <WishlistButton productId={product.id} initial={wishlisted} />
            <QuickView product={product} />
          </div>
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,.55)_0%,transparent_38%,transparent_62%,rgba(169,220,221,.35)_100%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        />

        <div className="absolute inset-x-2.5 bottom-2.5 flex justify-end">
          <AddToCart product={product} compact />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1.5 pt-3.5 pb-1.5">
        {product.categoryName ? (
          <p className="text-[10px] tracking-[0.16em] text-muted uppercase">{product.categoryName}</p>
        ) : null}
        <h3 className="mt-1 text-[13.5px] leading-6 font-medium">
          <Link href={`/product/${product.slug}`} className="transition-colors hover:text-gold-deep">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted">
          <span>{formatPurity(product.purity)}</span>
          <span aria-hidden className="inline-block size-1 rounded-full bg-line" />
          <span>{formatWeight(product.weightGrams)}</span>
        </p>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-[15px] font-semibold text-ink">{formatMoney(product.price, currency)}</p>
            {product.compareAt ? (
              <p className="text-[11px] text-muted line-through">{formatMoney(product.compareAt, currency)}</p>
            ) : null}
          </div>
          <span
            className={`flex items-center gap-1 text-[10.5px] ${product.inStock ? (lowStock ? "text-gold-deep" : "text-success") : "text-danger"}`}
          >
            <span className={`inline-block size-1.5 rounded-full ${product.inStock ? (lowStock ? "bg-gold" : "bg-success") : "bg-danger"}`} aria-hidden />
            {product.inStock ? (lowStock ? `تنها ${faNum(product.stock)} عدد` : "موجود") : "ناموجود"}
          </span>
        </div>
      </div>
    </article>
  );
}

export function CollectionCard({
  collection,
  count,
}: {
  collection: { slug: string; name: string; description: string | null; image: string | null };
  count?: number;
}) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-silver/70 bg-white/70 p-2.5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:bg-white/90 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-white via-cream to-ice/70">
        <img
          src={collection.image ?? "/hero.jpg"}
          alt={collection.name}
          width={800}
          height={600}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-80" aria-hidden />
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white drop-shadow-sm">{collection.name}</h3>
            {typeof count === "number" ? (
              <p className="mt-0.5 text-[11px] text-white/85">{count} قطعه</p>
            ) : null}
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/90 text-ink transition-transform duration-300 group-hover:-translate-x-1">
            <Icon name="arrowLeft" size={16} />
          </span>
        </div>
      </div>
      {collection.description ? (
        <p className="px-2 pt-3 pb-2 text-[12.5px] leading-6 text-ink-soft">{collection.description}</p>
      ) : null}
    </Link>
  );
}

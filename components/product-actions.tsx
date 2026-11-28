"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { addToCartAction } from "@/actions/cart";
import { toggleWishlistAction } from "@/actions/wishlist";
import { emptyFormState } from "@/lib/action-types";
import { formatMoney, formatPurity, formatWeight } from "@/lib/format";
import { Icon } from "./icons";

export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string;
  purity: number;
  weightGrams: number;
  images: string[];
  stock: number;
  inStock: boolean;
  price: number;
  compareAt: number | null;
  perGram: number;
  variants: { id: string; name: string; stock: number; priceDelta: number }[];
};

function Toast({ message, ok }: { message?: string; ok?: boolean }) {
  const [visible, setVisible] = useState(Boolean(message));
  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 3200);
    return () => window.clearTimeout(timer);
  }, [message]);
  if (!message || !visible) return null;
  return (
    <div
      role="status"
      className={`fixed inset-x-4 bottom-6 z-[60] mx-auto flex w-fit max-w-sm items-center gap-2 rounded-full px-4 py-2.5 text-xs shadow-lift ${
        ok ? "bg-ink text-pearl" : "bg-danger text-white"
      }`}
    >
      <Icon name={ok ? "check" : "alert"} size={14} />
      {message}
    </div>
  );
}

export function AddToCart({
  product,
  compact = false,
  showQty = false,
}: {
  product: Pick<ProductDTO, "id" | "name" | "variants" | "stock" | "inStock">;
  compact?: boolean;
  showQty?: boolean;
}) {
  const [state, formAction, pending] = useActionState(addToCartAction, emptyFormState);
  const inStockVariants = product.variants.filter((variant) => variant.stock > 0);
  const [variantId, setVariantId] = useState(inStockVariants[0]?.id ?? "none");
  const [qty, setQty] = useState(1);
  const disabled = !product.inStock;

  if (compact) {
    return (
      <form action={formAction}>
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="variantId" value={variantId} />
        <input type="hidden" name="qty" value={1} />
        <button
          type="submit"
          disabled={disabled || pending}
          aria-label={`افزودن ${product.name} به سبد خرید`}
          className="grid size-10 place-items-center rounded-full border border-gold/45 bg-white/80 text-gold-deep shadow-soft backdrop-blur transition-all hover:border-gold hover:bg-gold-soft disabled:opacity-40"
        >
          <Icon name="cart" size={17} />
        </button>
        <Toast message={state.message} ok={state.ok} />
      </form>
    );
  }

  return (
    <div className="space-y-3">
      {product.variants.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-xs font-medium text-ink-soft">انتخاب گزینه</legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => {
              const soldOut = variant.stock <= 0;
              return (
                <label
                  key={variant.id}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-xs transition-colors ${
                    variantId === variant.id
                      ? "border-ink bg-ink text-pearl"
                      : soldOut
                        ? "cursor-not-allowed border-line bg-cream text-muted line-through"
                        : "border-line bg-white text-ink-soft hover:border-gold"
                  }`}
                >
                  <input
                    type="radio"
                    name="variantChoice"
                    value={variant.id}
                    checked={variantId === variant.id}
                    disabled={soldOut}
                    onChange={() => setVariantId(variant.id)}
                    className="sr-only"
                  />
                  {variant.name}
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <form action={formAction} className="flex flex-col gap-3 sm:flex-row">
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="variantId" value={variantId} />
        {showQty ? (
          <div className="flex items-center justify-between gap-2 rounded-full border border-line bg-white px-2 py-1.5">
            <button
              type="button"
              onClick={() => setQty((value) => Math.max(1, value - 1))}
              className="grid size-8 place-items-center rounded-full hover:bg-cream"
              aria-label="کاهش تعداد"
            >
              <Icon name="minus" size={15} />
            </button>
            <span className="min-w-6 text-center text-sm" aria-live="polite">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((value) => Math.min(10, value + 1))}
              className="grid size-8 place-items-center rounded-full hover:bg-cream"
              aria-label="افزایش تعداد"
            >
              <Icon name="plus" size={15} />
            </button>
          </div>
        ) : null}
        <input type="hidden" name="qty" value={qty} />
        <button
          type="submit"
          disabled={disabled || pending}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-pearl transition-all hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="cart" size={18} />
          {disabled ? "ناموجود" : pending ? "در حال افزودن…" : "افزودن به سبد خرید"}
        </button>
        <WishlistButton productId={product.id} />
      </form>
      <Toast message={state.message} ok={state.ok} />
    </div>
  );
}

export function WishlistButton({
  productId,
  initial = false,
  variant = "icon",
}: {
  productId: string;
  initial?: boolean;
  variant?: "icon" | "inline";
}) {
  const router = useRouter();
  const [active, setActive] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();

  const toggle = async () => {
    setBusy(true);
    const result = await toggleWishlistAction(productId);
    setBusy(false);
    if (result.needsAuth) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (result.ok) setActive(Boolean(result.inWishlist));
    setMessage(result.message);
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-3.5 text-sm text-ink-soft transition-colors hover:border-gold hover:text-gold-deep disabled:opacity-60"
      >
        <Icon name="heart" size={18} filled={active} className={active ? "text-gold-deep" : ""} />
        {active ? "در علاقه‌مندی‌ها" : "علاقه‌مندی"}
        <Toast message={message} ok />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={active}
      aria-label={active ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      className={`grid size-9 place-items-center rounded-full border backdrop-blur transition-all ${
        active ? "border-gold bg-white text-gold-deep" : "border-white/70 bg-white/80 text-ink-soft hover:border-gold hover:text-gold-deep"
      }`}
    >
      <Icon name="heart" size={16} filled={active} />
      <Toast message={message} ok />
    </button>
  );
}

export function QuickView({ product }: { product: ProductDTO }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`نمایش سریع ${product.name}`}
        className="grid size-9 place-items-center rounded-full border border-white/70 bg-white/80 text-ink-soft backdrop-blur transition-all hover:border-gold hover:text-gold-deep"
      >
        <Icon name="eye" size={16} />
      </button>
      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`نمایش سریع ${product.name}`}>
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative grid w-full max-w-2xl gap-5 overflow-hidden rounded-3xl border border-line bg-pearl p-5 shadow-lift sm:grid-cols-2">
            <button type="button" onClick={() => setOpen(false)} className="absolute end-4 top-4 z-10 grid size-8 place-items-center rounded-full bg-white/90 hover:bg-white" aria-label="بستن">
              <Icon name="close" size={16} />
            </button>
            <img src={product.images[0] ?? "/hero.jpg"} alt={product.name} width={600} height={600} className="aspect-square w-full rounded-2xl bg-white object-cover" />
            <div className="flex flex-col">
              <p className="text-[11px] tracking-[0.2em] text-gold-deep uppercase">نمایش سریع</p>
              <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
              <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-ink-soft">{product.shortDescription}</p>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-white px-3 py-2"><dt className="text-muted">عیار</dt><dd className="mt-0.5">{formatPurity(product.purity)}</dd></div>
                <div className="rounded-xl bg-white px-3 py-2"><dt className="text-muted">وزن</dt><dd className="mt-0.5">{formatWeight(product.weightGrams)}</dd></div>
              </dl>
              <p className="mt-4 text-base font-semibold">{formatMoney(product.price)}</p>
              <div className="mt-auto space-y-2 pt-4">
                <AddToCart product={product} />
                <Link href={`/product/${product.slug}`} className="block text-center text-xs text-gold-deep hover:underline">
                  مشاهده جزئیات کامل محصول
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { removeCartLine, setCartQty } from "@/actions/cart";
import { getCartTotals } from "@/lib/cart-totals";
import { formatMoney, formatPurity, formatWeight } from "@/lib/format";
import { EmptyState, buttonStyles } from "@/components/ui";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "سبد خرید",
  description: "بازبینی و ویرایش سبد خرید زرّین.",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const { lines, subtotal, count, currency } = await getCartTotals();

  if (lines.length === 0) {
    return (
      <div className="container-lux py-12">
        <h1 className="mb-6 text-2xl font-semibold">سبد خرید</h1>
        <EmptyState
          icon="cart"
          title="سبد خرید شما خالی است"
          description="محصولی انتخاب نکرده‌اید. از کالکشن‌های زرّین شروع کنید."
          action={
            <Link href="/shop" className={buttonStyles.gold}>
              مشاهده محصولات
              <Icon name="arrowLeft" size={16} />
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-lux py-8 sm:py-10">
      <h1 className="text-2xl font-semibold">سبد خرید</h1>
      <p className="mt-1.5 text-[12.5px] text-muted">{count} کالا در سبد شما</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <ul className="space-y-3">
          {lines.map(({ item, unit, lineTotal }) => {
            const available = item.variant ? item.variant.stock : item.product.stock;
            return (
              <li key={item.id} className="flex gap-3 rounded-3xl border border-line bg-white/70 p-3 sm:gap-4 sm:p-4">
                <Link href={`/product/${item.product.slug}`} className="shrink-0">
                  <img
                    src={item.product.images[0] ?? "/hero.jpg"}
                    alt={item.product.name}
                    width={160}
                    height={160}
                    loading="lazy"
                    className="size-20 rounded-2xl border border-line object-cover sm:size-24"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-[13px] font-medium">
                        <Link href={`/product/${item.product.slug}`} className="hover:text-gold-deep">{item.product.name}</Link>
                      </h2>
                      <p className="mt-1 text-[11px] text-muted">
                        {formatPurity(item.product.purity)} · {formatWeight(item.product.weightGrams)}
                        {item.variant ? ` · ${item.variant.name}` : ""}
                      </p>
                      <p className="mt-1 text-[11px] text-muted">{formatMoney(unit, currency)} × {item.qty}</p>
                    </div>
                    <form action={removeCartLine}>
                      <input type="hidden" name="itemId" value={item.id} />
                      <button type="submit" className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-danger/10 hover:text-danger" aria-label={`حذف ${item.product.name} از سبد`}>
                        <Icon name="trash" size={15} />
                      </button>
                    </form>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                    <div className="flex items-center gap-1.5 rounded-full border border-line bg-white px-1.5 py-1">
                      <form action={setCartQty}>
                        <input type="hidden" name="itemId" value={item.id} />
                        <input type="hidden" name="qty" value={Math.max(0, item.qty - 1)} />
                        <button type="submit" className="grid size-7 place-items-center rounded-full hover:bg-cream" aria-label="کاهش تعداد">
                          <Icon name="minus" size={13} />
                        </button>
                      </form>
                      <span className="min-w-5 text-center text-[12px]" aria-live="polite">{item.qty}</span>
                      <form action={setCartQty}>
                        <input type="hidden" name="itemId" value={item.id} />
                        <input type="hidden" name="qty" value={Math.min(available, item.qty + 1)} />
                        <button type="submit" className="grid size-7 place-items-center rounded-full hover:bg-cream disabled:opacity-40" disabled={item.qty >= available} aria-label="افزایش تعداد">
                          <Icon name="plus" size={13} />
                        </button>
                      </form>
                    </div>
                    <p className="text-[13.5px] font-semibold">{formatMoney(lineTotal, currency)}</p>
                  </div>
                  {item.qty >= available ? (
                    <p className="mt-1.5 text-[10.5px] text-gold-deep">بیشتر از موجودی انبار قابل سفارش نیست.</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="rounded-3xl border border-line bg-white/80 p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold">خلاصه سفارش</h2>
          <dl className="mt-4 space-y-2.5 text-[12.5px]">
            <div className="flex justify-between">
              <dt className="text-ink-soft">جمع کالاها</dt>
              <dd className="font-medium">{formatMoney(subtotal, currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">هزینه ارسال</dt>
              <dd className="text-muted">در مرحله پرداخت</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2.5 text-[14px]">
              <dt className="font-semibold">مبلغ قابل پرداخت</dt>
              <dd className="font-semibold">{formatMoney(subtotal, currency)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-[10.5px] leading-5 text-muted">قیمت‌ها شامل مالیات بر ارزش افزوده است.</p>

          <Link href="/checkout" className={`${buttonStyles.gold} mt-4 w-full`}>
            ادامه و پرداخت
            <Icon name="arrowLeft" size={16} />
          </Link>
          <Link href="/shop" className="mt-3 block text-center text-[11.5px] text-muted hover:text-gold-deep">
            ادامه خرید
          </Link>

          <div className="mt-5 space-y-2 border-t border-line pt-4">
            {[
              { icon: "shield" as const, text: "گواهی اصالت همراه سفارش" },
              { icon: "truck" as const, text: "ارسال بیمه‌شده به سراسر ایران" },
              { icon: "lock" as const, text: "پرداخت امن و رمزنگاری‌شده" },
            ].map((row) => (
              <p key={row.text} className="flex items-center gap-2 text-[11px] text-muted">
                <Icon name={row.icon} size={13} className="text-gold-deep" />
                {row.text}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

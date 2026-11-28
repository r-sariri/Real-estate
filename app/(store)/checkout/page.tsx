import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCartTotals } from "@/lib/cart-totals";
import { getCurrentUser } from "@/lib/auth";
import { validateCoupon } from "@/lib/coupon";
import { formatMoney } from "@/lib/format";
import { CheckoutForm } from "@/components/checkout-form";
import { CouponForm } from "@/components/coupon-form";
import { EmptyState, buttonStyles } from "@/components/ui";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "تکمیل سفارش",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ coupon?: string }>;

export default async function CheckoutPage({ searchParams }: { searchParams: SearchParams }) {
  const { coupon } = await searchParams;
  const { lines, subtotal, currency, count } = await getCartTotals();
  const [methods, user] = await Promise.all([
    prisma.shippingMethod.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    getCurrentUser(),
  ]);

  if (count === 0 || !lines.length) {
    return (
      <div className="container-lux py-12">
        <EmptyState
          icon="cart"
          title="برای تکمیل سفارش، سبد خرید نباید خالی باشد"
          description="یک قطعه انتخاب کنید و دوباره به این صفحه بازگردید."
          action={<Link href="/shop" className={buttonStyles.gold}>مشاهده محصولات</Link>}
        />
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <div className="container-lux py-12">
        <EmptyState
          icon="truck"
          title="روش ارسال فعالی ثبت نشده است"
          description="در حال حاضر امکان ثبت سفارش وجود ندارد. لطفاً با پشتیبانی تماس بگیرید."
          action={<Link href="/contact" className={buttonStyles.outline}>تماس با پشتیبانی</Link>}
        />
      </div>
    );
  }

  const defaultAddress = user
    ? await prisma.address.findFirst({ where: { userId: user.id }, orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] })
    : null;

  const couponResult = coupon ? await validateCoupon(coupon, subtotal) : null;
  const discount = couponResult?.ok ? couponResult.discount : 0;
  const appliedCode = couponResult?.ok ? couponResult.coupon.code : "";

  return (
    <div className="container-lux py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">تکمیل سفارش</h1>
          <p className="mt-1 text-[12px] text-muted">
            {count} کالا — جمع {formatMoney(subtotal, currency)}
          </p>
        </div>
        <Link href="/cart" className="flex items-center gap-1.5 text-[12px] text-muted hover:text-gold-deep">
          <Icon name="arrowRight" size={14} />
          بازگشت به سبد
        </Link>
      </div>

      <div className="mb-6 rounded-3xl border border-line bg-white/60 p-4">
        <ul className="flex flex-wrap gap-3">
          {lines.map(({ item, lineTotal }) => (
            <li key={item.id} className="flex items-center gap-2 rounded-2xl border border-line bg-white px-2.5 py-2">
              <img src={item.product.images[0] ?? "/hero.svg"} alt="" width={80} height={80} className="size-10 rounded-lg object-cover" loading="lazy" />
              <div className="max-w-[150px]">
                <p className="truncate text-[11px] font-medium">{item.product.name}</p>
                <p className="text-[10px] text-muted">{item.qty} × {formatMoney(lineTotal / item.qty, currency)}</p>
              </div>
            </li>
          ))}
        </ul>

        <CouponForm initial={coupon} />
        {coupon ? (
          <Link href="/checkout" className="mt-2 inline-block text-[11px] text-muted hover:text-danger">حذف کد</Link>
        ) : null}
        {couponResult && !couponResult.ok ? (
          <p role="alert" className="mt-2 flex items-center gap-1.5 text-[11.5px] text-danger">
            <Icon name="alert" size={13} /> {couponResult.message}
          </p>
        ) : null}
        {discount > 0 ? (
          <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-success">
            <Icon name="check" size={13} /> کد {appliedCode} اعمال شد — {formatMoney(discount, currency)} تخفیف
          </p>
        ) : null}
      </div>

      <CheckoutForm
        methods={methods}
        defaults={{
          fullName: defaultAddress?.fullName ?? user?.name ?? "",
          phone: defaultAddress?.phone ?? user?.phone ?? "",
          email: user?.email ?? "",
          province: defaultAddress?.province ?? "",
          city: defaultAddress?.city ?? "",
          postalCode: defaultAddress?.postalCode ?? "",
          line1: defaultAddress?.line1 ?? "",
        }}
        subtotal={subtotal}
        discount={discount}
        coupon={appliedCode}
        currency={currency}
        isLoggedIn={Boolean(user)}
      />
    </div>
  );
}

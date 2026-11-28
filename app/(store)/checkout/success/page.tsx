import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { formatMoney } from "@/lib/format";
import { buttonStyles } from "@/components/ui";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "سفارش ثبت شد",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ order?: string }>;

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const { order: orderNumber } = await searchParams;
  if (!orderNumber) notFound();

  const [order, settings] = await Promise.all([
    prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, events: { orderBy: { createdAt: "asc" } } },
    }),
    getSettings(),
  ]);
  if (!order) notFound();

  const address = order.shippingAddress as { province?: string; city?: string; postalCode?: string; line1?: string };

  return (
    <div className="container-lux py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[2rem] border border-line bg-white/80 p-6 text-center sm:p-9">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/10 text-success">
            <Icon name="check" size={26} />
          </span>
          <h1 className="mt-4 text-2xl font-semibold">سفارش شما ثبت شد</h1>
          <p className="mt-2 text-[13px] leading-7 text-ink-soft">
            شماره سفارش: <span className="font-semibold text-ink" dir="ltr">{order.orderNumber}</span>
          </p>
          <p className="mt-1 text-[12px] text-muted">همکاران ما برای هماهنگی پرداخت و ارسال با شما تماس می‌گیرند.</p>

          <dl className="mt-6 space-y-2 rounded-2xl border border-line bg-cream/40 p-4 text-start text-[12.5px]">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-3">
                <dt className="text-ink-soft">{item.name} × {item.qty}</dt>
                <dd className="shrink-0 font-medium">{formatMoney(item.unitPrice * item.qty)}</dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-line pt-2"><dt className="text-ink-soft">ارسال ({order.shippingMethod})</dt><dd>{order.shippingCost === 0 ? "رایگان" : formatMoney(order.shippingCost)}</dd></div>
            {order.discount > 0 ? <div className="flex justify-between text-danger"><dt>تخفیف</dt><dd>−{formatMoney(order.discount)}</dd></div> : null}
            <div className="flex justify-between border-t border-line pt-2 text-[14px] font-semibold"><dt>مبلغ نهایی</dt><dd>{formatMoney(order.total)}</dd></div>
          </dl>

          <div className="mt-5 rounded-2xl border border-ice-deep/50 bg-ice/40 p-4 text-start">
            <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ink">
              <Icon name="creditCard" size={15} className="text-gold-deep" />
              مرحله بعد: پرداخت
            </p>
            {settings.paymentGateway === "manual" ? (
              <p className="mt-1.5 text-[11.5px] leading-6 text-ink-soft">
                درگاه پرداخت آنلاین در حال حاضر در حالت دستی است. برای تکمیل پرداخت با شماره{" "}
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="font-medium text-gold-deep hover:underline" dir="ltr">{settings.phone}</a>{" "}
                تماس بگیرید یا منتظر تماس کارشناس بمانید. سفارش شما رزرو شده است.
              </p>
            ) : (
              <p className="mt-1.5 text-[11.5px] leading-6 text-ink-soft">
                لینک پرداخت آنلاین برای شما ارسال می‌شود. در صورت بروز مشکل با پشتیبانی تماس بگیرید.
              </p>
            )}
            <p className="mt-2 text-[11px] text-muted">
              نشانی: {address.province}، {address.city}، {address.line1} — کد پستی {address.postalCode}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link href={`/pages/tracking?order=${order.orderNumber}`} className={buttonStyles.primary}>
              پیگیری سفارش
            </Link>
            <Link href="/shop" className={buttonStyles.outline}>
              ادامه خرید
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-[11px] text-muted">
          این شماره سفارش را نگه دارید. با آن می‌توانید وضعیت سفارش را پیگیری کنید.
        </p>
      </div>
    </div>
  );
}

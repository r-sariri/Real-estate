import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { digitsToLatin, formatDateTime, formatMoney } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from "@/lib/orders";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge, buttonStyles, inputClass } from "@/components/ui";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "پیگیری سفارش",
  description: "با شماره سفارش و شماره موبایل، وضعیت سفارش خود را ببینید.",
  alternates: { canonical: "/pages/tracking" },
};

type SearchParams = Promise<{ order?: string; phone?: string }>;

export default async function TrackingPage({ searchParams }: { searchParams: SearchParams }) {
  const { order, phone } = await searchParams;
  const orderNumber = (order ?? "").trim().toUpperCase();
  const normalizedPhone = digitsToLatin((phone ?? "").replace(/[\s-]/g, ""));

  // Lookup requires BOTH the order number and the phone on the order, so a
  // guessed order number alone never exposes customer data.
  const found =
    orderNumber && normalizedPhone
      ? await prisma.order.findFirst({
          where: { orderNumber, customerPhone: normalizedPhone },
          include: { items: { select: { name: true, qty: true } }, events: { orderBy: { createdAt: "desc" }, take: 5 } },
        })
      : null;

  const searched = Boolean(orderNumber && normalizedPhone);

  return (
    <div className="container-lux py-8 sm:py-10">
      <Breadcrumbs items={[{ name: "پیگیری سفارش", href: "/pages/tracking" }]} />
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold sm:text-3xl">پیگیری سفارش</h1>
        <p className="mt-2 text-[13px] leading-7 text-ink-soft">
          شماره سفارش و شماره موبایلی که هنگام ثبت سفارش وارد کرده‌اید را وارد کنید.
        </p>

        <form action="/pages/tracking" method="get" className="mt-6 rounded-3xl border border-line bg-white/70 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="order" className="mb-1.5 block text-xs font-medium text-ink-soft">شماره سفارش</label>
              <input id="order" name="order" defaultValue={order ?? ""} placeholder="ZR-XXXXXX" className={inputClass} dir="ltr" required />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-ink-soft">شماره موبایل</label>
              <input id="phone" name="phone" defaultValue={phone ?? ""} placeholder="09121234567" className={inputClass} dir="ltr" required />
            </div>
          </div>
          <button type="submit" className={`${buttonStyles.primary} mt-4`}>
            <Icon name="search" size={16} />
            جستجوی سفارش
          </button>
        </form>

        {searched ? (
          found ? (
            <section className="mt-5 rounded-3xl border border-line bg-white/80 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[12px] font-medium" dir="ltr">{found.orderNumber}</p>
                  <p className="text-[10.5px] text-muted">{formatDateTime(found.createdAt)}</p>
                </div>
                <Badge tone={ORDER_STATUS_TONE[found.status]}>{ORDER_STATUS_LABELS[found.status]}</Badge>
              </div>

              <dl className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl bg-cream/50 px-3 py-2">
                  <dt className="text-[10px] text-muted">مبلغ سفارش</dt>
                  <dd className="text-[12px] font-medium">{formatMoney(found.total)}</dd>
                </div>
                <div className="rounded-xl bg-cream/50 px-3 py-2">
                  <dt className="text-[10px] text-muted">روش ارسال</dt>
                  <dd className="text-[12px] font-medium">{found.shippingMethod}</dd>
                </div>
                {found.trackingCode ? (
                  <div className="rounded-xl bg-cream/50 px-3 py-2 sm:col-span-2">
                    <dt className="text-[10px] text-muted">کد رهگیری مرسوله</dt>
                    <dd className="text-[12px] font-medium" dir="ltr">{found.trackingCode}</dd>
                  </div>
                ) : null}
              </dl>

              <ul className="mt-4 space-y-1.5 border-t border-line pt-3">
                {found.events.map((event) => (
                  <li key={event.id} className="flex items-center gap-2 text-[11.5px]">
                    <span className="size-1.5 rounded-full bg-gold" aria-hidden />
                    <span className="font-medium">{ORDER_STATUS_LABELS[event.status]}</span>
                    <span className="text-muted">— {formatDateTime(event.createdAt)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <p role="status" className="mt-5 flex items-center gap-2 rounded-2xl border border-danger/25 bg-danger/8 px-4 py-3 text-[12px] text-danger">
              <Icon name="alert" size={15} />
              سفارشی با این مشخصات پیدا نشد. شماره سفارش و موبایل را بررسی کنید.
            </p>
          )
        ) : null}

        <p className="mt-6 text-[11px] text-muted">
          برای مشاهده همه سفارش‌ها، <Link href="/account/orders" className="text-gold-deep hover:underline">وارد حساب خود</Link> شوید.
        </p>
      </div>
    </div>
  );
}

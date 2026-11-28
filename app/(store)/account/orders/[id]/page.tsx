import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatDateTime, formatMoney } from "@/lib/format";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, ORDER_STATUS_TONE, PAYMENT_STATUS_LABELS, orderProgress } from "@/lib/orders";
import { Badge } from "@/components/ui";
import { Icon } from "@/components/icons";

export const metadata: Metadata = { title: "جزئیات سفارش", robots: { index: false, follow: false } };

type Params = Promise<{ id: string }>;

export default async function OrderDetailPage({ params }: { params: Params }) {
  const user = await requireUser("/account/orders");
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { items: true, events: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) notFound();

  const address = order.shippingAddress as { province?: string; city?: string; postalCode?: string; line1?: string };
  const progress = orderProgress(order.status);
  const cancelled = order.status === "CANCELLED" || order.status === "REFUNDED";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/account/orders" className="text-[11px] text-muted hover:text-gold-deep">← بازگشت به سفارش‌ها</Link>
          <h1 className="mt-1 text-lg font-semibold" dir="ltr">{order.orderNumber}</h1>
          <p className="text-[11px] text-muted">{formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
          <Badge tone={order.paymentStatus === "PAID" ? "success" : "neutral"}>{PAYMENT_STATUS_LABELS[order.paymentStatus]}</Badge>
        </div>
      </div>

      {/* Tracking */}
      <section className="rounded-3xl border border-line bg-white/70 p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <Icon name="truck" size={16} className="text-gold-deep" />
          پیگیری سفارش
        </h2>

        {cancelled ? (
          <p className="rounded-2xl bg-danger/8 px-4 py-3 text-[12px] text-danger">
            این سفارش {ORDER_STATUS_LABELS[order.status]} است.
          </p>
        ) : (
          <>
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-gradient-to-l from-gold-deep to-gold transition-all" style={{ width: `${progress}%` }} />
            </div>
            <ol className="mt-3 grid grid-cols-5 gap-1 text-center">
              {ORDER_STATUS_FLOW.map((status, index) => {
                const reached = ORDER_STATUS_FLOW.indexOf(order.status) >= index;
                return (
                  <li key={status} className={`text-[10px] ${reached ? "text-ink" : "text-muted"}`}>
                    <span className={`mx-auto mb-1 block size-2 rounded-full ${reached ? "bg-gold-deep" : "bg-line"}`} aria-hidden />
                    {ORDER_STATUS_LABELS[status]}
                  </li>
                );
              })}
            </ol>
          </>
        )}

        {order.trackingCode ? (
          <p className="mt-4 rounded-xl bg-cream/60 px-3 py-2 text-[11.5px]">
            کد رهگیری مرسوله: <span className="font-medium" dir="ltr">{order.trackingCode}</span>
          </p>
        ) : null}

        {order.events.length > 0 ? (
          <ul className="mt-4 space-y-2 border-t border-line pt-3">
            {order.events.map((event) => (
              <li key={event.id} className="flex items-start gap-2 text-[11.5px]">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                <div>
                  <p className="font-medium text-ink">{ORDER_STATUS_LABELS[event.status]}</p>
                  {event.note ? <p className="text-muted">{event.note}</p> : null}
                  <p className="text-[10px] text-muted">{formatDateTime(event.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {/* Items */}
      <section className="rounded-3xl border border-line bg-white/70 p-5">
        <h2 className="mb-3 text-sm font-semibold">اقلام سفارش</h2>
        <ul className="divide-y divide-line">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <img src={item.image ?? "/hero.svg"} alt="" width={80} height={80} loading="lazy" className="size-12 rounded-xl border border-line object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-medium">{item.name}</p>
                <p className="text-[10.5px] text-muted">
                  {item.purity} عیار · {item.weightGrams} گرم · {item.qty} عدد
                </p>
              </div>
              <p className="shrink-0 text-[12px] font-medium">{formatMoney(item.unitPrice * item.qty)}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-3 space-y-2 border-t border-line pt-3 text-[12px]">
          <div className="flex justify-between"><dt className="text-ink-soft">جمع کالاها</dt><dd>{formatMoney(order.subtotal)}</dd></div>
          {order.discount > 0 ? <div className="flex justify-between text-danger"><dt>تخفیف {order.couponCode ? `(${order.couponCode})` : ""}</dt><dd>−{formatMoney(order.discount)}</dd></div> : null}
          <div className="flex justify-between"><dt className="text-ink-soft">ارسال ({order.shippingMethod})</dt><dd>{order.shippingCost === 0 ? "رایگان" : formatMoney(order.shippingCost)}</dd></div>
          <div className="flex justify-between border-t border-line pt-2 text-[13.5px] font-semibold"><dt>مبلغ نهایی</dt><dd>{formatMoney(order.total)}</dd></div>
        </dl>
      </section>

      {/* Address */}
      <section className="rounded-3xl border border-line bg-white/70 p-5">
        <h2 className="mb-2 text-sm font-semibold">نشانی تحویل</h2>
        <p className="text-[12px] leading-6 text-ink-soft">
          {order.customerName} — <span dir="ltr">{order.customerPhone}</span>
          <br />
          {address.province}، {address.city}، {address.line1} — کد پستی {address.postalCode}
        </p>
        {order.note ? <p className="mt-2 rounded-xl bg-cream/60 px-3 py-2 text-[11px] text-ink-soft">یادداشت: {order.note}</p> : null}
      </section>
    </div>
  );
}

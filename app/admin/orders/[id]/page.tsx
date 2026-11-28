import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateOrderAction } from "@/actions/admin";
import { formatDateTime, formatMoney } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE, PAYMENT_STATUS_LABELS } from "@/lib/orders";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminHeader, Card } from "@/components/admin/admin-ui";
import { Badge, Field, inputClass } from "@/components/ui";

type Params = Promise<{ id: string }>;

export default async function AdminOrderDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      events: { orderBy: { createdAt: "desc" } },
      user: { select: { id: true, name: true, email: true } },
    },
  });
  if (!order) notFound();

  const address = order.shippingAddress as { province?: string; city?: string; postalCode?: string; line1?: string };

  return (
    <div className="space-y-4">
      <AdminHeader
        title={`سفارش ${order.orderNumber}`}
        description={`ثبت‌شده در ${formatDateTime(order.createdAt)}`}
        action={<Link href="/admin/orders" className="text-[11.5px] text-muted hover:text-gold-deep">← فهرست سفارش‌ها</Link>}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
        <Badge tone={order.paymentStatus === "PAID" ? "success" : "neutral"}>{PAYMENT_STATUS_LABELS[order.paymentStatus]}</Badge>
        <span className="text-[11.5px] text-muted">
          {order.user ? `کاربر: ${order.user.name} (${order.user.email})` : "سفارش مهمان"}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card title="اقلام سفارش">
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-2.5">
                <img src={item.image ?? "/hero.svg"} alt="" width={64} height={64} className="size-10 rounded-lg border border-line object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium">{item.name}</p>
                  <p className="text-[10.5px] text-muted">
                    {item.purity} عیار · {item.weightGrams} گرم · نرخ خرید {formatMoney(item.goldRate)}
                  </p>
                </div>
                <p className="shrink-0 text-[11.5px]">{item.qty} × {formatMoney(item.unitPrice)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-[11.5px]">
            <div className="flex justify-between"><dt className="text-muted">جمع کالاها</dt><dd>{formatMoney(order.subtotal)}</dd></div>
            {order.discount > 0 ? <div className="flex justify-between text-danger"><dt>تخفیف {order.couponCode ? `(${order.couponCode})` : ""}</dt><dd>−{formatMoney(order.discount)}</dd></div> : null}
            <div className="flex justify-between"><dt className="text-muted">ارسال ({order.shippingMethod})</dt><dd>{formatMoney(order.shippingCost)}</dd></div>
            <div className="flex justify-between border-t border-line pt-1.5 text-[13px] font-semibold"><dt>مبلغ نهایی</dt><dd>{formatMoney(order.total)}</dd></div>
          </dl>
        </Card>

        <div className="space-y-4">
          <Card title="به‌روزرسانی وضعیت">
            <AdminForm action={updateOrderAction} submitLabel="ثبت وضعیت">
              <input type="hidden" name="orderId" value={order.id} />
              <Field label="وضعیت جدید" name="o-status">
                <select id="o-status" name="status" defaultValue={order.status} className={inputClass}>
                  {(Object.keys(ORDER_STATUS_LABELS) as (keyof typeof ORDER_STATUS_LABELS)[]).map((status) => (
                    <option key={status} value={status}>{ORDER_STATUS_LABELS[status]}</option>
                  ))}
                </select>
              </Field>
              <Field label="کد رهگیری مرسوله" name="o-tracking" hint="در صفحه پیگیری سفارش نمایش داده می‌شود">
                <input id="o-tracking" name="trackingCode" defaultValue={order.trackingCode ?? ""} className={inputClass} dir="ltr" />
              </Field>
              <Field label="یادداشت رویداد (اختیاری)" name="o-note">
                <input id="o-note" name="note" className={inputClass} placeholder="مثلاً: تحویل به پست پیشتاز" />
              </Field>
            </AdminForm>
          </Card>

          <Card title="نشانی و تماس">
            <p className="text-[12px] leading-6 text-ink-soft">
              {order.customerName} — <span dir="ltr">{order.customerPhone}</span>
              {order.customerEmail ? <><br /><span dir="ltr">{order.customerEmail}</span></> : null}
              <br />
              {address.province}، {address.city}، {address.line1}
              <br />
              کد پستی {address.postalCode}
            </p>
            {order.note ? <p className="mt-2 rounded-xl bg-cream/60 px-3 py-2 text-[11px]">یادداشت مشتری: {order.note}</p> : null}
          </Card>
        </div>
      </div>

      <Card title="تاریخچه رویدادها">
        <ul className="space-y-2">
          {order.events.map((event) => (
            <li key={event.id} className="flex items-start gap-2 text-[11.5px]">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
              <div>
                <p className="font-medium">{ORDER_STATUS_LABELS[event.status]}</p>
                {event.note ? <p className="text-muted">{event.note}</p> : null}
                <p className="text-[10px] text-muted">{formatDateTime(event.createdAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

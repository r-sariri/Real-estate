import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatDateTime, formatMoney } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE, PAYMENT_STATUS_LABELS } from "@/lib/orders";
import { Badge, EmptyState, buttonStyles } from "@/components/ui";

export const metadata: Metadata = { title: "سفارش‌های من", robots: { index: false, follow: false } };

export default async function OrdersPage() {
  const user = await requireUser("/account/orders");
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { select: { name: true, qty: true, image: true } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">سفارش‌های من</h1>
        <span className="text-[11.5px] text-muted">{orders.length} سفارش</span>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon="package"
          title="هنوز سفارشی ندارید"
          description="اولین قطعه خود را انتخاب کنید؛ وضعیت سفارش از همین‌جا قابل پیگیری است."
          action={<Link href="/shop" className={buttonStyles.gold}>مشاهده محصولات</Link>}
        />
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="rounded-3xl border border-line bg-white/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Link href={`/account/orders/${order.id}`} className="text-[13px] font-medium hover:text-gold-deep" dir="ltr">
                    {order.orderNumber}
                  </Link>
                  <p className="mt-0.5 text-[10.5px] text-muted">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                  <Badge tone={order.paymentStatus === "PAID" ? "success" : "neutral"}>{PAYMENT_STATUS_LABELS[order.paymentStatus]}</Badge>
                  <span className="text-[12.5px] font-semibold">{formatMoney(order.total)}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                <div className="flex gap-1.5">
                  {order.items.slice(0, 4).map((item, index) => (
                    <img
                      key={`${order.id}-${index}`}
                      src={item.image ?? "/hero.svg"}
                      alt=""
                      width={80}
                      height={80}
                      loading="lazy"
                      className="size-10 rounded-lg border border-line object-cover"
                    />
                  ))}
                </div>
                <p className="text-[11px] text-muted">
                  {order.items.reduce((sum, item) => sum + item.qty, 0)} کالا
                </p>
                <Link href={`/account/orders/${order.id}`} className="ms-auto text-[11.5px] text-gold-deep hover:underline">
                  جزئیات سفارش
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatDateTime, formatMoney } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from "@/lib/orders";
import { ProfileForm } from "@/components/profile-form";
import { Badge, buttonStyles } from "@/components/ui";
import { Icon } from "@/components/icons";

export const metadata: Metadata = { title: "داشبورد من", robots: { index: false, follow: false } };

type SearchParams = Promise<{ denied?: string }>;

export default async function AccountPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireUser();
  const { denied } = await searchParams;

  const [orders, wishlistCount, addressCount] = await Promise.all([
    prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.wishlistItem.count({ where: { userId: user.id } }),
    prisma.address.count({ where: { userId: user.id } }),
  ]);

  return (
    <div className="space-y-6">
      {denied ? (
        <div role="alert" className="flex items-center gap-2 rounded-2xl border border-danger/25 bg-danger/8 px-4 py-3 text-[12px] text-danger">
          <Icon name="lock" size={15} />
          دسترسی به پنل مدیریت برای این حساب مجاز نیست.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "سفارش‌ها", value: orders.length, href: "/account/orders", icon: "package" as const },
          { label: "علاقه‌مندی‌ها", value: wishlistCount, href: "/account/wishlist", icon: "heart" as const },
          { label: "نشانی‌ها", value: addressCount, href: "/account/addresses", icon: "mapPin" as const },
        ].map((card) => (
          <Link key={card.label} href={card.href} className="rounded-2xl border border-line bg-white/70 p-4 transition-colors hover:border-gold/50">
            <span className="flex items-center gap-2 text-[11.5px] text-muted">
              <Icon name={card.icon} size={14} className="text-gold-deep" />
              {card.label}
            </span>
            <span className="mt-2 block text-xl font-semibold">{card.value}</span>
          </Link>
        ))}
      </div>

      <section className="rounded-3xl border border-line bg-white/70 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">آخرین سفارش‌ها</h2>
          <Link href="/account/orders" className="text-[11.5px] text-gold-deep hover:underline">همه سفارش‌ها</Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line px-4 py-8 text-center">
            <p className="text-[12.5px] text-muted">هنوز سفارشی ثبت نکرده‌اید.</p>
            <Link href="/shop" className={`${buttonStyles.outline} mt-3`}>شروع خرید</Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {orders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <Link href={`/account/orders/${order.id}`} className="text-[12.5px] font-medium hover:text-gold-deep" dir="ltr">
                    {order.orderNumber}
                  </Link>
                  <p className="text-[10.5px] text-muted">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                  <span className="text-[12.5px] font-semibold">{formatMoney(order.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl border border-line bg-white/70 p-5">
        <h2 className="mb-4 text-sm font-semibold">اطلاعات حساب</h2>
        <ProfileForm defaults={{ name: user.name, phone: user.phone ?? "", email: user.email }} />
      </section>
    </div>
  );
}

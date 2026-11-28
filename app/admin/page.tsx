import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatAgo, formatDateTime, formatMoney } from "@/lib/format";
import { getPricingContext } from "@/lib/pricing";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from "@/lib/orders";
import { AdminHeader, Card, Stat, Table } from "@/components/admin/admin-ui";
import { Badge, buttonStyles } from "@/components/ui";
import { Icon } from "@/components/icons";

export default async function AdminOverviewPage() {
  const [orders, paidAgg, customers, products, pendingOrders, lowStock, recentOrders, ads, { rates, pricingConfig }] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.findMany({ where: { isActive: true, stock: { lte: 2 } }, select: { id: true, name: true, stock: true, slug: true }, take: 5 }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { id: true, orderNumber: true, total: true, status: true, createdAt: true, customerName: true } }),
    prisma.ad.findMany({ orderBy: { impressions: "desc" }, take: 4, select: { id: true, title: true, impressions: true, clicks: true, isActive: true } }),
    getPricingContext(),
  ]);

  const revenue = paidAgg._sum.total ?? 0;
  const mainRate = rates.find((rate) => rate.purity === 18) ?? rates[0];

  return (
    <div className="space-y-5">
      <AdminHeader
        title="نمای کلی"
        description="وضعیت فروش، موجودی و نرخ طلا در یک نگاه."
        action={
          <Link href="/admin/products/new" className={buttonStyles.primary}>
            <Icon name="plus" size={15} />
            محصول جدید
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="درآمد پرداخت‌شده" value={formatMoney(revenue, pricingConfig.currency)} icon="creditCard" tone="success" hint={`${orders} سفارش ثبت‌شده`} />
        <Stat label="سفارش‌های در انتظار" value={String(pendingOrders)} icon="clock" tone="gold" hint="نیازمند پیگیری" />
        <Stat label="مشتریان" value={String(customers)} icon="users" />
        <Stat label="محصولات فعال" value={String(products)} icon="diamond" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="نرخ طلا" description="مبنای محاسبه همه قیمت‌ها" action={<Link href="/admin/pricing" className="text-[11px] text-gold-deep hover:underline">ویرایش نرخ</Link>}>
          {mainRate ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-gold-soft/40 px-3 py-2.5">
                <span className="text-[12px]">طلای {mainRate.purity} عیار</span>
                <span className="text-[13px] font-semibold">{formatMoney(mainRate.pricePerGram, pricingConfig.currency)}</span>
              </div>
              <p className="flex items-center gap-1.5 text-[10.5px] text-muted">
                <Icon name="clock" size={12} />
                آخرین به‌روزرسانی: {formatAgo(mainRate.updatedAt)}
              </p>
              <p className="text-[10.5px] text-muted">
                محاسبه خودکار: {pricingConfig.autoCalculate ? "فعال" : "غیرفعال (قیمت دستی)"} — مالیات پیش‌فرض {pricingConfig.taxPercent}٪
              </p>
            </div>
          ) : (
            <p className="text-[12px] text-danger">نرخی ثبت نشده است. از بخش قیمت‌گذاری نرخ را وارد کنید.</p>
          )}
        </Card>

        <Card title="کمبود موجودی" description="محصولاتی با موجودی ۲ عدد یا کمتر">
          {lowStock.length === 0 ? (
            <p className="text-[12px] text-muted">موجودی همه محصولات مناسب است.</p>
          ) : (
            <ul className="space-y-1.5">
              {lowStock.map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-2 text-[12px]">
                  <Link href={`/admin/products/${product.id}`} className="truncate hover:text-gold-deep">{product.name}</Link>
                  <Badge tone={product.stock === 0 ? "danger" : "gold"}>{product.stock === 0 ? "ناموجود" : `${product.stock} عدد`}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="آخرین سفارش‌ها" action={<Link href="/admin/orders" className="text-[11px] text-gold-deep hover:underline">همه سفارش‌ها</Link>}>
        <Table head={["شماره", "مشتری", "مبلغ", "وضعیت", "تاریخ"]}>
          {recentOrders.map((order) => (
            <tr key={order.id}>
              <td className="px-2 py-2">
                <Link href={`/admin/orders/${order.id}`} className="font-medium hover:text-gold-deep" dir="ltr">{order.orderNumber}</Link>
              </td>
              <td className="px-2 py-2 text-ink-soft">{order.customerName}</td>
              <td className="px-2 py-2">{formatMoney(order.total, pricingConfig.currency)}</td>
              <td className="px-2 py-2"><Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge></td>
              <td className="px-2 py-2 text-muted">{formatDateTime(order.createdAt)}</td>
            </tr>
          ))}
          {recentOrders.length === 0 ? (
            <tr><td colSpan={5} className="px-2 py-6 text-center text-muted">هنوز سفارشی ثبت نشده است.</td></tr>
          ) : null}
        </Table>
      </Card>

      <Card title="عملکرد تبلیغات" action={<Link href="/admin/ads" className="text-[11px] text-gold-deep hover:underline">مدیریت تبلیغات</Link>}>
        <Table head={["کمپین", "نمایش", "کلیک", "نرخ کلیک", "وضعیت"]}>
          {ads.map((ad) => (
            <tr key={ad.id}>
              <td className="px-2 py-2">{ad.title}</td>
              <td className="px-2 py-2">{ad.impressions}</td>
              <td className="px-2 py-2">{ad.clicks}</td>
              <td className="px-2 py-2">{ad.impressions > 0 ? `${((ad.clicks / ad.impressions) * 100).toFixed(1)}٪` : "—"}</td>
              <td className="px-2 py-2"><Badge tone={ad.isActive ? "success" : "neutral"}>{ad.isActive ? "فعال" : "غیرفعال"}</Badge></td>
            </tr>
          ))}
          {ads.length === 0 ? <tr><td colSpan={5} className="px-2 py-6 text-center text-muted">کمپینی ثبت نشده است.</td></tr> : null}
        </Table>
      </Card>
    </div>
  );
}

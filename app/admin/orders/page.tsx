import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDateTime, formatMoney } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE, PAYMENT_STATUS_LABELS } from "@/lib/orders";
import { AdminHeader, Card, Table } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui";
import type { OrderStatus } from "@prisma/client";

type SearchParams = Promise<{ status?: string }>;

const FILTERS: { value: string; label: string }[] = [
  { value: "", label: "همه" },
  { value: "PENDING", label: "در انتظار پرداخت" },
  { value: "PAID", label: "پرداخت شده" },
  { value: "PROCESSING", label: "در حال آماده‌سازی" },
  { value: "SHIPPED", label: "ارسال شده" },
  { value: "DELIVERED", label: "تحویل شده" },
  { value: "CANCELLED", label: "لغو شده" },
];

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const { status } = await searchParams;
  const where = status && FILTERS.some((filter) => filter.value === status) ? { status: status as OrderStatus } : {};

  const [orders, counts] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, take: 100, include: { items: { select: { qty: true } } } }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
  ]);

  const countFor = (value: string) => (value ? counts.find((row) => row.status === value)?._count ?? 0 : counts.reduce((sum, row) => sum + row._count, 0));

  return (
    <div className="space-y-4">
      <AdminHeader title="سفارش‌ها" description="پیگیری، تغییر وضعیت و ثبت کد رهگیری." />

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((filter) => {
          const active = (status ?? "") === filter.value;
          return (
            <Link
              key={filter.value || "all"}
              href={filter.value ? `/admin/orders?status=${filter.value}` : "/admin/orders"}
              className={`rounded-full border px-3 py-1.5 text-[11px] transition-colors ${
                active ? "border-ink bg-ink text-pearl" : "border-line bg-white text-ink-soft hover:border-gold"
              }`}
            >
              {filter.label} ({countFor(filter.value)})
            </Link>
          );
        })}
      </div>

      <Card>
        <Table head={["شماره", "مشتری", "اقلام", "مبلغ", "پرداخت", "وضعیت", "تاریخ", ""]}>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-2 py-2 font-medium" dir="ltr">{order.orderNumber}</td>
              <td className="px-2 py-2 text-ink-soft">{order.customerName}</td>
              <td className="px-2 py-2">{order.items.reduce((sum, item) => sum + item.qty, 0)}</td>
              <td className="px-2 py-2">{formatMoney(order.total)}</td>
              <td className="px-2 py-2">
                <Badge tone={order.paymentStatus === "PAID" ? "success" : "neutral"}>{PAYMENT_STATUS_LABELS[order.paymentStatus]}</Badge>
              </td>
              <td className="px-2 py-2"><Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge></td>
              <td className="px-2 py-2 text-muted">{formatDateTime(order.createdAt)}</td>
              <td className="px-2 py-2 text-end">
                <Link href={`/admin/orders/${order.id}`} className="text-[11px] text-gold-deep hover:underline">مدیریت</Link>
              </td>
            </tr>
          ))}
          {orders.length === 0 ? <tr><td colSpan={8} className="px-2 py-6 text-center text-muted">سفارشی با این وضعیت وجود ندارد.</td></tr> : null}
        </Table>
      </Card>
    </div>
  );
}

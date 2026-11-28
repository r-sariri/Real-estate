import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { AdminHeader, Card, Table } from "@/components/admin/admin-ui";

const ACTION_LABELS: Record<string, string> = {
  "product.create": "ایجاد محصول",
  "product.update": "ویرایش محصول",
  "product.archive": "آرشیو محصول",
  "category.create": "ایجاد دسته",
  "category.update": "ویرایش دسته",
  "category.delete": "حذف دسته",
  "category.archive": "غیرفعال‌سازی دسته",
  "collection.create": "ایجاد کالکشن",
  "collection.update": "ویرایش کالکشن",
  "collection.delete": "حذف کالکشن",
  "pricing.update": "به‌روزرسانی نرخ طلا",
  "order.status": "تغییر وضعیت سفارش",
  "customer.update": "تغییر نقش مشتری",
  "coupon.create": "ایجاد کد تخفیف",
  "coupon.update": "ویرایش کد تخفیف",
  "coupon.delete": "حذف کد تخفیف",
  "ad.create": "ایجاد کمپین تبلیغاتی",
  "ad.update": "ویرایش کمپین",
  "ad.delete": "حذف کمپین",
  "banner.create": "ایجاد بنر",
  "banner.update": "ویرایش بنر",
  "banner.delete": "حذف بنر",
  "testimonial.create": "افزودن نظر مشتری",
  "testimonial.update": "ویرایش نظر مشتری",
  "testimonial.delete": "حذف نظر مشتری",
  "blog.create": "ایجاد مقاله",
  "blog.update": "ویرایش مقاله",
  "blog.delete": "حذف مقاله",
  "review.approve": "تأیید نظر محصول",
  "review.reject": "رد نظر محصول",
  "shipping.create": "افزودن روش ارسال",
  "shipping.update": "ویرایش روش ارسال",
  "shipping.delete": "حذف روش ارسال",
  "settings.update": "به‌روزرسانی تنظیمات",
};

export default async function AdminAuditPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 150,
    include: { actor: { select: { name: true, email: true } } },
  });

  return (
    <div className="space-y-4">
      <AdminHeader title="گزارش رویدادها" description="ثبت تغییرات مهم مدیریتی برای پیگیری و حسابرسی." />

      <Card>
        <Table head={["زمان", "کاربر", "عملیات", "موجودیت", "شناسه", "IP"]}>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="px-2 py-2 text-muted">{formatDateTime(log.createdAt)}</td>
              <td className="px-2 py-2">{log.actor?.name ?? "سیستم"}</td>
              <td className="px-2 py-2 font-medium">{ACTION_LABELS[log.action] ?? log.action}</td>
              <td className="px-2 py-2 text-ink-soft" dir="ltr">{log.entity}</td>
              <td className="px-2 py-2 text-muted" dir="ltr">{log.entityId?.slice(0, 10) ?? "—"}</td>
              <td className="px-2 py-2 text-muted" dir="ltr">{log.ip ?? "—"}</td>
            </tr>
          ))}
          {logs.length === 0 ? <tr><td colSpan={6} className="px-2 py-6 text-center text-muted">رویدادی ثبت نشده است.</td></tr> : null}
        </Table>
      </Card>
    </div>
  );
}

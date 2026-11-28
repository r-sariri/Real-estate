import { prisma } from "@/lib/db";
import { updateCustomerAction } from "@/actions/admin";
import { formatDate, formatMoney } from "@/lib/format";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminHeader, Card, Table } from "@/components/admin/admin-ui";
import { Badge, inputClass } from "@/components/ui";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      _count: { select: { orders: true } },
      orders: { where: { paymentStatus: "PAID" }, select: { total: true } },
    },
  });

  return (
    <div className="space-y-4">
      <AdminHeader title="مشتریان" description="نقش‌ها و دسترسی‌ها را مدیریت کنید. حساب مدیر را نمی‌توان تنزل داد." />

      <Card>
        <Table head={["نام", "ایمیل", "موبایل", "سفارش‌ها", "خرید موفق", "نقش", "عضویت", ""]}>
          {customers.map((customer) => {
            const spent = customer.orders.reduce((sum, order) => sum + order.total, 0);
            return (
              <tr key={customer.id}>
                <td className="px-2 py-2">
                  <details>
                    <summary className="cursor-pointer font-medium hover:text-gold-deep">{customer.name}</summary>
                    <div className="mt-2 w-full max-w-sm rounded-2xl border border-line bg-cream/30 p-3">
                      <AdminForm action={updateCustomerAction} submitLabel="ذخیره">
                        <input type="hidden" name="userId" value={customer.id} />
                        <label htmlFor={`role-${customer.id}`} className="mb-1 block text-[11px] text-muted">نقش</label>
                        <select id={`role-${customer.id}`} name="role" defaultValue={customer.role} className={inputClass}>
                          <option value="CUSTOMER">مشتری</option>
                          <option value="STAFF">کارشناس</option>
                          <option value="ADMIN">مدیر</option>
                        </select>
                        <label className="mt-2 flex items-center gap-2 text-[11.5px] text-ink-soft">
                          <input type="checkbox" name="isBlocked" defaultChecked={customer.isBlocked} className="accent-gold-deep" />
                          مسدود کردن ورود
                        </label>
                      </AdminForm>
                    </div>
                  </details>
                </td>
                <td className="px-2 py-2 text-muted" dir="ltr">{customer.email}</td>
                <td className="px-2 py-2 text-muted" dir="ltr">{customer.phone ?? "—"}</td>
                <td className="px-2 py-2">{customer._count.orders}</td>
                <td className="px-2 py-2">{formatMoney(spent)}</td>
                <td className="px-2 py-2">
                  <Badge tone={customer.role === "CUSTOMER" ? "neutral" : "gold"}>
                    {customer.role === "ADMIN" ? "مدیر" : customer.role === "STAFF" ? "کارشناس" : "مشتری"}
                  </Badge>
                  {customer.isBlocked ? <Badge tone="danger" className="ms-1">مسدود</Badge> : null}
                </td>
                <td className="px-2 py-2 text-muted">{formatDate(customer.createdAt)}</td>
                <td />
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}

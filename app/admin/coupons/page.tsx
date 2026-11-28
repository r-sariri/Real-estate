import { prisma } from "@/lib/db";
import { deleteCouponAction, saveCouponAction } from "@/actions/admin";
import { formatMoney } from "@/lib/format";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminHeader, Card, Table } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, Field, inputClass } from "@/components/ui";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-4">
      <AdminHeader title="کدهای تخفیف" description="اعتبار کدها در سرور بررسی می‌شود؛ درصد و سقف استفاده قابل کنترل است." />

      <Card title="کد جدید">
        <AdminForm action={saveCouponAction} submitLabel="ایجاد کد" fieldLabels={{ code: "کد", value: "مقدار" }}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="کد" name="cp-code" required>
              <input id="cp-code" name="code" required className={inputClass} dir="ltr" placeholder="ZARRIN10" />
            </Field>
            <Field label="نوع" name="cp-type">
              <select id="cp-type" name="type" className={inputClass} defaultValue="PERCENT">
                <option value="PERCENT">درصدی</option>
                <option value="FIXED">مبلغ ثابت (تومان)</option>
              </select>
            </Field>
            <Field label="مقدار" name="cp-value" required>
              <input id="cp-value" name="value" type="number" min="1" required className={inputClass} dir="ltr" />
            </Field>
            <Field label="حداقل مبلغ سفارش" name="cp-min">
              <input id="cp-min" name="minSubtotal" type="number" min="0" defaultValue={0} className={inputClass} dir="ltr" />
            </Field>
            <Field label="حداکثر دفعات استفاده (۰ = نامحدود)" name="cp-max">
              <input id="cp-max" name="maxUses" type="number" min="0" defaultValue={0} className={inputClass} dir="ltr" />
            </Field>
            <Field label="شروع (اختیاری)" name="cp-start">
              <input id="cp-start" name="startsAt" type="datetime-local" className={inputClass} dir="ltr" />
            </Field>
            <Field label="پایان (اختیاری)" name="cp-end">
              <input id="cp-end" name="expiresAt" type="datetime-local" className={inputClass} dir="ltr" />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-[12px] text-ink-soft">
            <input type="checkbox" name="isActive" defaultChecked className="accent-gold-deep" /> فعال
          </label>
        </AdminForm>
      </Card>

      <Card title={`کدها (${coupons.length})`}>
        <Table head={["کد", "نوع", "مقدار", "حداقل سفارش", "استفاده", "انقضا", "وضعیت", ""]}>
          {coupons.map((coupon) => (
            <tr key={coupon.id}>
              <td className="px-2 py-2 font-medium" dir="ltr">{coupon.code}</td>
              <td className="px-2 py-2">{coupon.type === "PERCENT" ? "درصدی" : "ثابت"}</td>
              <td className="px-2 py-2">{coupon.type === "PERCENT" ? `${coupon.value}٪` : formatMoney(coupon.value)}</td>
              <td className="px-2 py-2">{coupon.minSubtotal ? formatMoney(coupon.minSubtotal) : "—"}</td>
              <td className="px-2 py-2">{coupon.usedCount}{coupon.maxUses ? ` / ${coupon.maxUses}` : ""}</td>
              <td className="px-2 py-2 text-muted" dir="ltr">{coupon.expiresAt ? coupon.expiresAt.toISOString().slice(0, 10) : "—"}</td>
              <td className="px-2 py-2"><Badge tone={coupon.isActive ? "success" : "neutral"}>{coupon.isActive ? "فعال" : "غیرفعال"}</Badge></td>
              <td className="px-2 py-2 text-end">
                <DeleteButton action={deleteCouponAction.bind(null, coupon.id)} confirmText="این کد حذف شود؟" />
              </td>
            </tr>
          ))}
          {coupons.length === 0 ? <tr><td colSpan={8} className="px-2 py-6 text-center text-muted">کدی ثبت نشده است.</td></tr> : null}
        </Table>
      </Card>
    </div>
  );
}

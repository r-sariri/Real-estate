import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { deleteShippingMethodAction, saveSettingsAction, saveShippingMethodAction } from "@/actions/admin";
import { formatMoney } from "@/lib/format";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminHeader, Card, Table } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, Field, inputClass } from "@/components/ui";

export default async function AdminSettingsPage() {
  const [settings, methods] = await Promise.all([
    getSettings(),
    prisma.shippingMethod.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-4">
      <AdminHeader title="تنظیمات سایت" description="اطلاعات برند، تماس، درگاه پرداخت و روش‌های ارسال." />

      <Card title="اطلاعات برند و تماس">
        <AdminForm action={saveSettingsAction} submitLabel="ذخیره تنظیمات">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="نام برند" name="st-brand">
              <input id="st-brand" name="brandName" defaultValue={settings.brandName} className={inputClass} />
            </Field>
            <Field label="نام لاتین (لوگو)" name="st-latin">
              <input id="st-latin" name="brandLatin" defaultValue={settings.brandLatin} className={inputClass} dir="ltr" />
            </Field>
            <Field label="شعار" name="st-tagline">
              <input id="st-tagline" name="tagline" defaultValue={settings.tagline} className={inputClass} />
            </Field>
            <Field label="متن نوار اطلاعیه بالای سایت" name="st-announce">
              <input id="st-announce" name="announcement" defaultValue={settings.announcement} className={inputClass} />
            </Field>
            <Field label="تلفن" name="st-phone">
              <input id="st-phone" name="phone" defaultValue={settings.phone} className={inputClass} />
            </Field>
            <Field label="ایمیل" name="st-email">
              <input id="st-email" name="email" defaultValue={settings.email} className={inputClass} dir="ltr" />
            </Field>
            <Field label="نشانی" name="st-address" className="sm:col-span-2">
              <input id="st-address" name="address" defaultValue={settings.address} className={inputClass} />
            </Field>
            <Field label="اینستاگرام" name="st-ig">
              <input id="st-ig" name="instagram" defaultValue={settings.instagram} className={inputClass} dir="ltr" />
            </Field>
            <Field label="تلگرام" name="st-tg">
              <input id="st-tg" name="telegram" defaultValue={settings.telegram} className={inputClass} dir="ltr" />
            </Field>
            <Field label="واتس‌اپ" name="st-wa">
              <input id="st-wa" name="whatsapp" defaultValue={settings.whatsapp} className={inputClass} dir="ltr" />
            </Field>
            <Field label="یادداشت ارسال" name="st-shipnote">
              <input id="st-shipnote" name="shippingNote" defaultValue={settings.shippingNote} className={inputClass} />
            </Field>
            <Field label="توضیح متای سایت (SEO)" name="st-meta" className="sm:col-span-2">
              <textarea id="st-meta" name="metaDescription" rows={2} defaultValue={settings.metaDescription} className={`${inputClass} resize-y`} />
            </Field>
          </div>

          <fieldset className="rounded-2xl border border-line p-3">
            <legend className="px-1 text-[11px] font-medium text-ink-soft">درگاه پرداخت</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="درگاه" name="st-gateway" hint="در حالت «دستی»، سفارش ثبت و هماهنگی پرداخت با پشتیبانی انجام می‌شود.">
                <select id="st-gateway" name="paymentGateway" defaultValue={settings.paymentGateway} className={inputClass}>
                  <option value="manual">دستی (بدون درگاه آنلاین)</option>
                  <option value="zarinpal">زرین‌پال</option>
                  <option value="idpay">آیدی‌پی</option>
                </select>
              </Field>
              <Field label="شناسه پذیرنده / مرچنت" name="st-merchant" hint="کلید در تنظیمات سرور نگهداری می‌شود؛ اینجا فقط شناسه عمومی">
                <input id="st-merchant" name="gatewayMerchantId" defaultValue={settings.gatewayMerchantId} className={inputClass} dir="ltr" />
              </Field>
            </div>
          </fieldset>
        </AdminForm>
      </Card>

      <Card title="روش‌های ارسال" description="در صفحه پرداخت به مشتری نمایش داده می‌شوند.">
        <AdminForm action={saveShippingMethodAction} submitLabel="افزودن روش ارسال">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="نام" name="sm-name" required>
              <input id="sm-name" name="name" required className={inputClass} />
            </Field>
            <Field label="هزینه (تومان)" name="sm-price">
              <input id="sm-price" name="price" type="number" min="0" defaultValue={0} className={inputClass} dir="ltr" />
            </Field>
            <Field label="توضیح" name="sm-desc">
              <input id="sm-desc" name="description" className={inputClass} />
            </Field>
            <Field label="حداقل روز" name="sm-min">
              <input id="sm-min" name="minDays" type="number" min="0" defaultValue={2} className={inputClass} dir="ltr" />
            </Field>
            <Field label="حداکثر روز" name="sm-max">
              <input id="sm-max" name="maxDays" type="number" min="0" defaultValue={4} className={inputClass} dir="ltr" />
            </Field>
            <Field label="ترتیب" name="sm-sort">
              <input id="sm-sort" name="sortOrder" type="number" defaultValue={methods.length + 1} className={inputClass} dir="ltr" />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-[12px] text-ink-soft">
            <input type="checkbox" name="isActive" defaultChecked className="accent-gold-deep" /> فعال
          </label>
        </AdminForm>

        <div className="mt-4">
          <Table head={["روش", "هزینه", "بازه", "وضعیت", ""]}>
            {methods.map((method) => (
              <tr key={method.id}>
                <td className="px-2 py-2 font-medium">{method.name}</td>
                <td className="px-2 py-2">{method.price === 0 ? "رایگان" : formatMoney(method.price)}</td>
                <td className="px-2 py-2 text-muted">{method.minDays} تا {method.maxDays} روز</td>
                <td className="px-2 py-2"><Badge tone={method.isActive ? "success" : "neutral"}>{method.isActive ? "فعال" : "غیرفعال"}</Badge></td>
                <td className="px-2 py-2 text-end">
                  <DeleteButton action={deleteShippingMethodAction.bind(null, method.id)} confirmText="این روش ارسال حذف شود؟" />
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </Card>
    </div>
  );
}

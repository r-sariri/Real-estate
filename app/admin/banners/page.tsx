import { prisma } from "@/lib/db";
import { deleteBannerAction, saveBannerAction } from "@/actions/admin";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminHeader, Card, Table } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, Field, inputClass } from "@/components/ui";

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-4">
      <AdminHeader title="بنرهای صفحه اصلی" description="بنرهای داخلی سایت (نوار پیشنهاد ویژه)." />

      <Card title="بنر جدید">
        <AdminForm action={saveBannerAction} submitLabel="افزودن بنر">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="عنوان" name="b-title" required>
              <input id="b-title" name="title" required className={inputClass} />
            </Field>
            <Field label="زیرعنوان" name="b-sub">
              <input id="b-sub" name="subtitle" className={inputClass} />
            </Field>
            <Field label="متن دکمه" name="b-cta">
              <input id="b-cta" name="ctaLabel" className={inputClass} placeholder="مشاهده کالکشن" />
            </Field>
            <Field label="لینک دکمه" name="b-url">
              <input id="b-url" name="ctaUrl" className={inputClass} dir="ltr" placeholder="/collections/special" />
            </Field>
            <Field label="تصویر (اختیاری)" name="b-img">
              <input id="b-img" name="image" className={inputClass} dir="ltr" />
            </Field>
            <Field label="جایگاه" name="b-place">
              <select id="b-place" name="placement" className={inputClass} defaultValue="HOME_STRIP">
                <option value="HOME_STRIP">نوار صفحه اصلی</option>
                <option value="HOME_HERO">هیرو</option>
              </select>
            </Field>
            <Field label="ترتیب" name="b-sort">
              <input id="b-sort" name="sortOrder" type="number" defaultValue={banners.length + 1} className={inputClass} dir="ltr" />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-[12px] text-ink-soft">
            <input type="checkbox" name="isActive" defaultChecked className="accent-gold-deep" /> فعال
          </label>
        </AdminForm>
      </Card>

      <Card title={`بنرها (${banners.length})`}>
        <Table head={["عنوان", "جایگاه", "دکمه", "ترتیب", "وضعیت", ""]}>
          {banners.map((banner) => (
            <tr key={banner.id}>
              <td className="px-2 py-2">
                <details>
                  <summary className="cursor-pointer font-medium hover:text-gold-deep">{banner.title}</summary>
                  <div className="mt-2 w-full max-w-lg rounded-2xl border border-line bg-cream/30 p-3">
                    <AdminForm action={saveBannerAction} submitLabel="ذخیره">
                      <input type="hidden" name="id" value={banner.id} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="عنوان" name={`bt-${banner.id}`}>
                          <input id={`bt-${banner.id}`} name="title" defaultValue={banner.title} className={inputClass} />
                        </Field>
                        <Field label="زیرعنوان" name={`bs-${banner.id}`}>
                          <input id={`bs-${banner.id}`} name="subtitle" defaultValue={banner.subtitle ?? ""} className={inputClass} />
                        </Field>
                        <Field label="متن دکمه" name={`bc-${banner.id}`}>
                          <input id={`bc-${banner.id}`} name="ctaLabel" defaultValue={banner.ctaLabel ?? ""} className={inputClass} />
                        </Field>
                        <Field label="لینک دکمه" name={`bu-${banner.id}`}>
                          <input id={`bu-${banner.id}`} name="ctaUrl" defaultValue={banner.ctaUrl ?? ""} className={inputClass} dir="ltr" />
                        </Field>
                        <Field label="ترتیب" name={`bo-${banner.id}`}>
                          <input id={`bo-${banner.id}`} name="sortOrder" type="number" defaultValue={banner.sortOrder} className={inputClass} dir="ltr" />
                        </Field>
                      </div>
                      <label className="flex items-center gap-2 text-[12px] text-ink-soft">
                        <input type="checkbox" name="isActive" defaultChecked={banner.isActive} className="accent-gold-deep" /> فعال
                      </label>
                    </AdminForm>
                  </div>
                </details>
              </td>
              <td className="px-2 py-2 text-muted">{banner.placement === "HOME_HERO" ? "هیرو" : "نوار صفحه اصلی"}</td>
              <td className="px-2 py-2 text-muted">{banner.ctaLabel ?? "—"}</td>
              <td className="px-2 py-2">{banner.sortOrder}</td>
              <td className="px-2 py-2"><Badge tone={banner.isActive ? "success" : "neutral"}>{banner.isActive ? "فعال" : "غیرفعال"}</Badge></td>
              <td className="px-2 py-2 text-end">
                <DeleteButton action={deleteBannerAction.bind(null, banner.id)} confirmText="این بنر حذف شود؟" />
              </td>
            </tr>
          ))}
          {banners.length === 0 ? <tr><td colSpan={6} className="px-2 py-6 text-center text-muted">بنری ثبت نشده است.</td></tr> : null}
        </Table>
      </Card>
    </div>
  );
}

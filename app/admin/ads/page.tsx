import { prisma } from "@/lib/db";
import { deleteAdAction, saveAdAction } from "@/actions/admin";
import { formatDate } from "@/lib/format";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminHeader, Card, Table } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, Field, inputClass } from "@/components/ui";

const PLACEMENTS = [
  { value: "HOME_TOP", label: "بالای صفحه اصلی" },
  { value: "HOME_MIDDLE", label: "میان بخش‌های صفحه اصلی" },
  { value: "CATEGORY", label: "صفحه کالکشن/دسته" },
  { value: "PRODUCT_LIST", label: "فهرست محصولات" },
  { value: "SIDEBAR", label: "ستون کنار (سایدبار)" },
  { value: "FOOTER", label: "فوتر" },
] as const;

const placementLabel = (value: string) => PLACEMENTS.find((item) => item.value === value)?.label ?? value;

export default async function AdminAdsPage() {
  const ads = await prisma.ad.findMany({ orderBy: [{ placement: "asc" }, { priority: "desc" }] });
  const totals = ads.reduce((acc, ad) => ({ impressions: acc.impressions + ad.impressions, clicks: acc.clicks + ad.clicks }), { impressions: 0, clicks: 0 });

  return (
    <div className="space-y-4">
      <AdminHeader
        title="مدیریت تبلیغات"
        description="کمپین‌های اسپانسر بدون تغییر کد منتشر می‌شوند. جایگاه خالی به‌صورت خودکار پنهان می‌شود."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "کمپین‌های فعال", value: String(ads.filter((ad) => ad.isActive).length) },
          { label: "کل نمایش", value: totals.impressions.toLocaleString("fa-IR") },
          { label: "کل کلیک", value: `${totals.clicks.toLocaleString("fa-IR")} (${totals.impressions ? ((totals.clicks / totals.impressions) * 100).toFixed(1) : "0"}٪)` },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-line bg-white/75 p-4">
            <p className="text-[11px] text-muted">{item.label}</p>
            <p className="mt-1 text-base font-semibold">{item.value}</p>
          </div>
        ))}
      </div>

      <Card title="کمپین جدید">
        <AdminForm action={saveAdAction} submitLabel="ایجاد کمپین" fieldLabels={{ title: "عنوان", imageDesktop: "تصویر", targetUrl: "نشانی مقصد" }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="عنوان" name="ad-title" required>
              <input id="ad-title" name="title" required className={inputClass} />
            </Field>
            <Field label="نام تبلیغ‌دهنده" name="ad-advertiser">
              <input id="ad-advertiser" name="advertiser" className={inputClass} />
            </Field>
            <Field label="توضیح کوتاه" name="ad-desc">
              <input id="ad-desc" name="description" className={inputClass} />
            </Field>
            <Field label="نشانی مقصد" name="ad-target" required hint="https://… یا مسیر داخلی مانند /shop">
              <input id="ad-target" name="targetUrl" required className={inputClass} dir="ltr" placeholder="https://example.com" />
            </Field>
            <Field label="تصویر دسکتاپ" name="ad-img-d" required>
              <input id="ad-img-d" name="imageDesktop" required className={inputClass} dir="ltr" placeholder="/ad-wide.svg" />
            </Field>
            <Field label="تصویر موبایل (اختیاری)" name="ad-img-m">
              <input id="ad-img-m" name="imageMobile" className={inputClass} dir="ltr" placeholder="/ad-mobile.svg" />
            </Field>
            <Field label="جایگاه" name="ad-placement">
              <select id="ad-placement" name="placement" className={inputClass} defaultValue="HOME_MIDDLE">
                {PLACEMENTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </Field>
            <Field label="اولویت نمایش" name="ad-priority" hint="عدد بزرگ‌تر = بالاتر">
              <input id="ad-priority" name="priority" type="number" defaultValue={0} className={inputClass} dir="ltr" />
            </Field>
            <Field label="شروع" name="ad-start">
              <input id="ad-start" name="startsAt" type="datetime-local" className={inputClass} dir="ltr" />
            </Field>
            <Field label="پایان" name="ad-end">
              <input id="ad-end" name="endsAt" type="datetime-local" className={inputClass} dir="ltr" />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-[12px] text-ink-soft">
            <input type="checkbox" name="isActive" defaultChecked className="accent-gold-deep" /> فعال
          </label>
        </AdminForm>
      </Card>

      <Card title={`کمپین‌ها (${ads.length})`}>
        <Table head={["کمپین", "جایگاه", "اولویت", "نمایش", "کلیک", "نرخ کلیک", "بازه", "وضعیت", ""]}>
          {ads.map((ad) => (
            <tr key={ad.id}>
              <td className="px-2 py-2">
                <details>
                  <summary className="cursor-pointer font-medium hover:text-gold-deep">{ad.title}</summary>
                  <div className="mt-2 w-full max-w-lg rounded-2xl border border-line bg-cream/30 p-3">
                    <AdminForm action={saveAdAction} submitLabel="ذخیره">
                      <input type="hidden" name="id" value={ad.id} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="عنوان" name={`at-${ad.id}`}>
                          <input id={`at-${ad.id}`} name="title" defaultValue={ad.title} className={inputClass} />
                        </Field>
                        <Field label="تبلیغ‌دهنده" name={`aa-${ad.id}`}>
                          <input id={`aa-${ad.id}`} name="advertiser" defaultValue={ad.advertiser ?? ""} className={inputClass} />
                        </Field>
                        <Field label="نشانی مقصد" name={`au-${ad.id}`}>
                          <input id={`au-${ad.id}`} name="targetUrl" defaultValue={ad.targetUrl} className={inputClass} dir="ltr" />
                        </Field>
                        <Field label="اولویت" name={`ap-${ad.id}`}>
                          <input id={`ap-${ad.id}`} name="priority" type="number" defaultValue={ad.priority} className={inputClass} dir="ltr" />
                        </Field>
                        <Field label="تصویر دسکتاپ" name={`ad-${ad.id}`}>
                          <input id={`ad-${ad.id}`} name="imageDesktop" defaultValue={ad.imageDesktop} className={inputClass} dir="ltr" />
                        </Field>
                        <Field label="تصویر موبایل" name={`am-${ad.id}`}>
                          <input id={`am-${ad.id}`} name="imageMobile" defaultValue={ad.imageMobile ?? ""} className={inputClass} dir="ltr" />
                        </Field>
                        <Field label="جایگاه" name={`apl-${ad.id}`}>
                          <select id={`apl-${ad.id}`} name="placement" defaultValue={ad.placement} className={inputClass}>
                            {PLACEMENTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                          </select>
                        </Field>
                        <Field label="توضیح" name={`ads-${ad.id}`}>
                          <input id={`ads-${ad.id}`} name="description" defaultValue={ad.description ?? ""} className={inputClass} />
                        </Field>
                      </div>
                      <label className="flex items-center gap-2 text-[12px] text-ink-soft">
                        <input type="checkbox" name="isActive" defaultChecked={ad.isActive} className="accent-gold-deep" /> فعال
                      </label>
                    </AdminForm>
                  </div>
                </details>
              </td>
              <td className="px-2 py-2 text-ink-soft">{placementLabel(ad.placement)}</td>
              <td className="px-2 py-2">{ad.priority}</td>
              <td className="px-2 py-2">{ad.impressions.toLocaleString("fa-IR")}</td>
              <td className="px-2 py-2">{ad.clicks.toLocaleString("fa-IR")}</td>
              <td className="px-2 py-2">{ad.impressions ? `${((ad.clicks / ad.impressions) * 100).toFixed(1)}٪` : "—"}</td>
              <td className="px-2 py-2 text-[10.5px] text-muted">
                {ad.startsAt ? formatDate(ad.startsAt) : "—"} تا {ad.endsAt ? formatDate(ad.endsAt) : "نامحدود"}
              </td>
              <td className="px-2 py-2"><Badge tone={ad.isActive ? "success" : "neutral"}>{ad.isActive ? "فعال" : "غیرفعال"}</Badge></td>
              <td className="px-2 py-2 text-end">
                <DeleteButton action={deleteAdAction.bind(null, ad.id)} confirmText="این کمپین حذف شود؟" />
              </td>
            </tr>
          ))}
          {ads.length === 0 ? <tr><td colSpan={9} className="px-2 py-6 text-center text-muted">کمپینی ثبت نشده است.</td></tr> : null}
        </Table>
      </Card>
    </div>
  );
}

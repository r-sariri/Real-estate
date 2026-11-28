import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { saveProductAction } from "@/actions/admin";
import { computePrice, getPricingContext } from "@/lib/pricing";
import { formatMoney } from "@/lib/format";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminHeader, Card } from "@/components/admin/admin-ui";
import { Field, inputClass } from "@/components/ui";

type Params = Promise<{ id: string }>;

const FIELD_LABELS = {
  name: "نام محصول",
  categoryId: "دسته‌بندی",
  weightGrams: "وزن",
  description: "توضیحات",
  slug: "شناسه",
};

const checkbox = "flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-[12px] text-ink-soft";

export default async function AdminProductFormPage({ params }: { params: Params }) {
  const { id } = await params;
  const isNew = id === "new";

  const [categories, product, { rateMap, pricingConfig }] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    isNew ? null : prisma.product.findUnique({ where: { id }, include: { variants: true } }),
    getPricingContext(),
  ]);

  if (!isNew && !product) notFound();
  const specs = (product?.specs ?? {}) as Record<string, string>;
  const price = product ? computePrice(product, rateMap, pricingConfig) : null;

  return (
    <div className="space-y-4">
      <AdminHeader
        title={isNew ? "محصول جدید" : `ویرایش: ${product!.name}`}
        description="قیمت نمایشی از نرخ طلا، وزن و درصدهای همین فرم محاسبه می‌شود."
        action={<Link href="/admin/products" className="text-[11.5px] text-muted hover:text-gold-deep">← بازگشت به فهرست</Link>}
      />

      {price ? (
        <div className="rounded-2xl border border-gold/30 bg-gold-soft/40 px-4 py-3 text-[12px]">
          قیمت فعلی محاسبه‌شده: <span className="font-semibold">{formatMoney(price.finalPrice, pricingConfig.currency)}</span>
          <span className="ms-2 text-[10.5px] text-muted">
            (طلای {formatMoney(price.goldValue, pricingConfig.currency)} + اجرت {formatMoney(price.making, pricingConfig.currency)} + سود {formatMoney(price.profit, pricingConfig.currency)} + مالیات {formatMoney(price.tax, pricingConfig.currency)})
          </span>
        </div>
      ) : null}

      <Card>
        <AdminForm action={saveProductAction} submitLabel={isNew ? "ایجاد محصول" : "ذخیره تغییرات"} fieldLabels={FIELD_LABELS}>
          {product ? <input type="hidden" name="id" value={product.id} /> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام محصول" name="p-name" required>
              <input id="p-name" name="name" defaultValue={product?.name} required className={inputClass} />
            </Field>
            <Field label="شناسه URL (اختیاری)" name="p-slug" hint="لاتین؛ خالی بگذارید تا خودکار ساخته شود">
              <input id="p-slug" name="slug" defaultValue={product?.slug} className={inputClass} dir="ltr" />
            </Field>
            <Field label="دسته‌بندی" name="p-category" required>
              <select id="p-category" name="categoryId" defaultValue={product?.categoryId} required className={inputClass}>
                <option value="">انتخاب…</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </Field>
            <Field label="توضیح کوتاه" name="p-short">
              <input id="p-short" name="shortDescription" defaultValue={product?.shortDescription ?? ""} className={inputClass} />
            </Field>
          </div>

          <Field label="توضیحات کامل" name="p-description" required>
            <textarea id="p-description" name="description" rows={5} defaultValue={product?.description} required className={`${inputClass} resize-y`} />
          </Field>

          <fieldset className="rounded-2xl border border-line p-3">
            <legend className="px-1 text-[11px] font-medium text-ink-soft">مشخصات و قیمت‌گذاری</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="عیار" name="p-purity">
                <select id="p-purity" name="purity" defaultValue={product?.purity ?? 18} className={inputClass}>
                  {[18, 21, 24].map((karat) => <option key={karat} value={karat}>{karat} عیار</option>)}
                </select>
              </Field>
              <Field label="وزن (گرم)" name="p-weight" required>
                <input id="p-weight" name="weightGrams" type="number" step="0.1" min="0.1" defaultValue={product?.weightGrams ?? 3} required className={inputClass} dir="ltr" />
              </Field>
              <Field label="موجودی انبار" name="p-stock">
                <input id="p-stock" name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} className={inputClass} dir="ltr" />
              </Field>
              <Field label="اجرت ساخت (٪)" name="p-making">
                <input id="p-making" name="makingChargePercent" type="number" step="0.5" min="0" defaultValue={product?.makingChargePercent ?? 12} className={inputClass} dir="ltr" />
              </Field>
              <Field label="سود (٪)" name="p-profit">
                <input id="p-profit" name="profitPercent" type="number" step="0.5" min="0" defaultValue={product?.profitPercent ?? 8} className={inputClass} dir="ltr" />
              </Field>
              <Field label="مالیات (٪)" name="p-tax">
                <input id="p-tax" name="taxPercent" type="number" step="0.5" min="0" defaultValue={product?.taxPercent ?? 9} className={inputClass} dir="ltr" />
              </Field>
              <Field label="تخفیف (٪)" name="p-discount">
                <input id="p-discount" name="discountPercent" type="number" min="0" max="90" defaultValue={product?.discountPercent ?? 0} className={inputClass} dir="ltr" />
              </Field>
              <Field label="قیمت دستی (تومان)" name="p-manual" hint="خالی = محاسبه خودکار">
                <input id="p-manual" name="manualPrice" type="number" min="0" defaultValue={product?.manualPrice ?? ""} className={inputClass} dir="ltr" />
              </Field>
              <Field label="امتیاز محبوبیت" name="p-popularity">
                <input id="p-popularity" name="popularity" type="number" min="0" defaultValue={product?.popularity ?? 50} className={inputClass} dir="ltr" />
              </Field>
            </div>
          </fieldset>

          <Field label="تصاویر (هر خط یک نشانی)" name="p-images" hint="مثلاً /products/ring-classic.jpg">
            <textarea id="p-images" name="images" rows={3} defaultValue={(product?.images ?? []).join("\n")} className={`${inputClass} resize-y`} dir="ltr" />
          </Field>

          <fieldset className="rounded-2xl border border-line p-3">
            <legend className="px-1 text-[11px] font-medium text-ink-soft">مشخصات نمایشی</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="جنس" name="p-material">
                <input id="p-material" name="specMaterial" defaultValue={specs.material ?? ""} className={inputClass} />
              </Field>
              <Field label="سنگ" name="p-stone">
                <input id="p-stone" name="specStone" defaultValue={specs.stone ?? ""} className={inputClass} />
              </Field>
              <Field label="اندازه" name="p-size">
                <input id="p-size" name="specSize" defaultValue={specs.size ?? ""} className={inputClass} />
              </Field>
              <Field label="گارانتی" name="p-warranty">
                <input id="p-warranty" name="specWarranty" defaultValue={specs.warranty ?? ""} className={inputClass} />
              </Field>
              <Field label="محل ساخت" name="p-made">
                <input id="p-made" name="specMadeIn" defaultValue={specs.madeIn ?? ""} className={inputClass} />
              </Field>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-line p-3">
            <legend className="px-1 text-[11px] font-medium text-ink-soft">SEO</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="عنوان متا" name="p-metatitle">
                <input id="p-metatitle" name="metaTitle" defaultValue={product?.metaTitle ?? ""} className={inputClass} />
              </Field>
              <Field label="توضیح متا" name="p-metadesc">
                <input id="p-metadesc" name="metaDescription" defaultValue={product?.metaDescription ?? ""} className={inputClass} />
              </Field>
            </div>
          </fieldset>

          <div className="grid gap-2 sm:grid-cols-3">
            <label className={checkbox}>
              <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} className="accent-gold-deep" />
              فعال و قابل نمایش
            </label>
            <label className={checkbox}>
              <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? false} className="accent-gold-deep" />
              نمایش در محصولات ویژه
            </label>
            <label className={checkbox}>
              <input type="checkbox" name="isNew" defaultChecked={product?.isNew ?? false} className="accent-gold-deep" />
              برچسب «جدید»
            </label>
          </div>

          {product && product.variants.length > 0 ? (
            <p className="rounded-xl bg-cream/60 px-3 py-2 text-[11px] text-ink-soft">
              این محصول {product.variants.length} گزینه (سایز) دارد: {product.variants.map((variant) => `${variant.name} (${variant.stock})`).join("، ")}
            </p>
          ) : null}
        </AdminForm>
      </Card>
    </div>
  );
}

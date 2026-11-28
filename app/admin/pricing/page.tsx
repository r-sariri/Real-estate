import { getPricingContext, computePrice } from "@/lib/pricing";
import { updatePricingAction } from "@/actions/admin";
import { formatAgo, formatDateTime, formatMoney } from "@/lib/format";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminHeader, Card } from "@/components/admin/admin-ui";
import { Field, inputClass } from "@/components/ui";
import { Icon } from "@/components/icons";

export default async function AdminPricingPage() {
  const { rates, rateMap, pricingConfig } = await getPricingContext();
  const main = rates.find((rate) => rate.purity === 18) ?? rates[0];

  const sample = computePrice(
    { purity: 18, weightGrams: 3, makingChargePercent: pricingConfig.defaultMakingChargePercent, profitPercent: pricingConfig.defaultProfitPercent, taxPercent: pricingConfig.taxPercent, discountPercent: 0 },
    rateMap,
    pricingConfig,
  );

  return (
    <div className="space-y-4">
      <AdminHeader title="نرخ طلا و قیمت‌گذاری" description="همه قیمت‌های سایت از این تنظیمات محاسبه می‌شوند." />

      {main ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-gold-soft/40 px-4 py-3">
          <p className="flex items-center gap-2 text-[12px]">
            <Icon name="clock" size={14} className="text-gold-deep" />
            آخرین به‌روزرسانی نرخ: <span className="font-medium">{formatDateTime(main.updatedAt)}</span>
            <span className="text-[10.5px] text-muted">({formatAgo(main.updatedAt)})</span>
          </p>
          <p className="text-[11px] text-muted">حالت فعلی: {pricingConfig.autoCalculate ? "محاسبه خودکار" : "قیمت دستی محصولات"}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-danger/30 bg-danger/8 px-4 py-3 text-[12px] text-danger">
          نرخی ثبت نشده است. تا زمانی که نرخ وارد نشود قیمت محصولات صفر محاسبه می‌شود.
        </div>
      )}

      <Card title="ویرایش نرخ و قواعد">
        <AdminForm action={updatePricingAction} submitLabel="ذخیره نرخ و تنظیمات" variant="gold" fieldLabels={{ rate_18: "نرخ ۱۸ عیار" }}>
          <div className="grid gap-3 sm:grid-cols-3">
            {[18, 21, 24].map((purity) => {
              const rate = rates.find((item) => item.purity === purity);
              return (
                <Field key={purity} label={`نرخ هر گرم طلای ${purity} عیار (تومان)`} name={`rate_${purity}`}>
                  <input
                    id={`rate_${purity}`}
                    name={`rate_${purity}`}
                    type="number"
                    min="0"
                    step="1000"
                    defaultValue={rate?.pricePerGram ?? ""}
                    className={inputClass}
                    dir="ltr"
                  />
                </Field>
              );
            })}
          </div>

          <fieldset className="rounded-2xl border border-line p-3">
            <legend className="px-1 text-[11px] font-medium text-ink-soft">قواعد پیش‌فرض محصولات جدید</legend>
            <div className="grid gap-3 sm:grid-cols-4">
              <Field label="اجرت ساخت (٪)" name="pr-making">
                <input id="pr-making" name="defaultMakingChargePercent" type="number" step="0.5" min="0" defaultValue={pricingConfig.defaultMakingChargePercent} className={inputClass} dir="ltr" />
              </Field>
              <Field label="سود (٪)" name="pr-profit">
                <input id="pr-profit" name="defaultProfitPercent" type="number" step="0.5" min="0" defaultValue={pricingConfig.defaultProfitPercent} className={inputClass} dir="ltr" />
              </Field>
              <Field label="مالیات (٪)" name="pr-tax">
                <input id="pr-tax" name="taxPercent" type="number" step="0.5" min="0" defaultValue={pricingConfig.taxPercent} className={inputClass} dir="ltr" />
              </Field>
              <Field label="واحد پول" name="pr-currency">
                <select id="pr-currency" name="currency" defaultValue={pricingConfig.currency} className={inputClass}>
                  <option value="TOMAN">تومان</option>
                  <option value="RIAL">ریال</option>
                </select>
              </Field>
            </div>
            <label className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-[12px] text-ink-soft">
              <input type="checkbox" name="autoCalculate" defaultChecked={pricingConfig.autoCalculate} className="accent-gold-deep" />
              محاسبه خودکار قیمت محصولات از نرخ طلا (در صورت غیرفعال بودن، قیمت دستی محصولات استفاده می‌شود)
            </label>
          </fieldset>

          <div className="rounded-2xl bg-cream/60 px-4 py-3 text-[11.5px] leading-6 text-ink-soft">
            <p className="font-medium text-ink">نمونه محاسبه: انگشتر ۳ گرمی ۱۸ عیار</p>
            <p className="mt-1">
              ارزش طلا {formatMoney(sample.goldValue)} + اجرت {formatMoney(sample.making)} + سود {formatMoney(sample.profit)} + مالیات {formatMoney(sample.tax)} ={" "}
              <span className="font-semibold">{formatMoney(sample.finalPrice)}</span>
            </p>
          </div>
        </AdminForm>
      </Card>

      <Card title="نرخ‌های ثبت‌شده">
        <ul className="divide-y divide-line">
          {rates.map((rate) => (
            <li key={rate.id} className="flex items-center justify-between py-2 text-[12px]">
              <span>طلای {rate.purity} عیار</span>
              <span className="font-medium">{formatMoney(rate.pricePerGram, pricingConfig.currency)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

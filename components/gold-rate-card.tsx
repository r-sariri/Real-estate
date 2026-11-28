import { formatAgo, formatMoney } from "@/lib/format";
import { getPricingContext } from "@/lib/pricing";
import { Icon } from "./icons";

/** Live gold-rate card — proves the price engine and shows the last update. */
export async function GoldRateCard() {
  const { rates, pricingConfig } = await getPricingContext();
  const main = rates.find((rate) => rate.purity === 18) ?? rates[0];
  if (!main) return null;

  return (
    <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-soft">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-soft to-champagne text-gold-deep">
        <Icon name="gold" size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] tracking-wide text-muted">نرخ روز طلای {main.purity} عیار</p>
        <p className="text-[13px] font-semibold text-ink">
          {formatMoney(main.pricePerGram, pricingConfig.currency)}
          <span className="text-[10px] font-normal text-muted"> / گرم</span>
        </p>
      </div>
      <div className="ms-auto text-end">
        <p className="flex items-center justify-end gap-1 text-[10px] text-muted">
          <Icon name="clock" size={11} />
          به‌روزرسانی
        </p>
        <p className="text-[10px] text-ink-soft">{formatAgo(main.updatedAt)}</p>
      </div>
    </div>
  );
}

import "server-only";
import { cache } from "react";
import { prisma } from "./db";

/**
 * Gold pricing engine — the single source of truth for every price shown on
 * the site. No price is hardcoded: everything derives from GoldRate rows plus
 * PricingConfig, both editable in the admin dashboard.
 *
 *   goldValue = weight × rate[purity]
 *   making    = goldValue × makingCharge%
 *   profit    = (goldValue + making) × profit%
 *   subtotal  = goldValue + making + profit
 *   tax       = subtotal × tax%
 *   listPrice = subtotal + tax
 *   final     = listPrice − discount%
 */

export type PricingConfigData = {
  autoCalculate: boolean;
  defaultMakingChargePercent: number;
  defaultProfitPercent: number;
  taxPercent: number;
  currency: "TOMAN" | "RIAL";
  lastUpdatedAt: Date;
};

export type PriceInput = {
  purity: number;
  weightGrams: number;
  makingChargePercent?: number | null;
  profitPercent?: number | null;
  taxPercent?: number | null;
  manualPrice?: number | null;
  discountPercent?: number | null;
};

export type PriceBreakdown = {
  goldValue: number;
  making: number;
  profit: number;
  subtotal: number;
  tax: number;
  listPrice: number;
  discount: number;
  finalPrice: number;
  discountPercent: number;
  perGram: number;
  goldRate: number;
  manual: boolean;
};

const roundTo = (value: number, step = 1000) => Math.round(value / step) * step;

export const getPricingContext = cache(async () => {
  const [rates, config] = await Promise.all([
    prisma.goldRate.findMany({ orderBy: { purity: "asc" } }),
    prisma.pricingConfig.findUnique({ where: { id: "singleton" } }),
  ]);

  const rateMap: Record<number, number> = {};
  for (const rate of rates) rateMap[rate.purity] = rate.pricePerGram;

  const pricingConfig: PricingConfigData = {
    autoCalculate: config?.autoCalculate ?? true,
    defaultMakingChargePercent: config?.defaultMakingChargePercent ?? 12,
    defaultProfitPercent: config?.defaultProfitPercent ?? 8,
    taxPercent: config?.taxPercent ?? 9,
    currency: (config?.currency as "TOMAN" | "RIAL") ?? "TOMAN",
    lastUpdatedAt: config?.lastUpdatedAt ?? new Date(0),
  };

  return { rateMap, pricingConfig, rates };
});

/** Rate for a karat; falls back to a linear derivation from 18K. */
export function rateFor(rateMap: Record<number, number>, purity: number): number {
  if (rateMap[purity]) return rateMap[purity];
  if (rateMap[18]) return Math.round((rateMap[18] * purity) / 18);
  const any = Object.values(rateMap)[0];
  return any ?? 0;
}

export function computePrice(
  product: PriceInput,
  rateMap: Record<number, number>,
  config: PricingConfigData,
): PriceBreakdown {
  const goldRate = rateFor(rateMap, product.purity);
  const weight = Number(product.weightGrams) || 0;
  const makingPct = product.makingChargePercent ?? config.defaultMakingChargePercent;
  const profitPct = product.profitPercent ?? config.defaultProfitPercent;
  const taxPct = product.taxPercent ?? config.taxPercent;
  const discountPct = Math.min(100, Math.max(0, product.discountPercent ?? 0));

  const goldValue = Math.round(weight * goldRate);
  const making = Math.round((goldValue * makingPct) / 100);
  const profit = Math.round(((goldValue + making) * profitPct) / 100);
  const subtotal = goldValue + making + profit;
  const tax = Math.round((subtotal * taxPct) / 100);

  const manual = !config.autoCalculate || product.manualPrice != null;
  const listPrice = manual
    ? roundTo(product.manualPrice ?? subtotal + tax)
    : roundTo(subtotal + tax);

  const finalPrice = discountPct > 0 ? roundTo(listPrice * (1 - discountPct / 100)) : listPrice;

  return {
    goldValue,
    making,
    profit,
    subtotal,
    tax,
    listPrice,
    discount: listPrice - finalPrice,
    finalPrice,
    discountPercent: discountPct,
    perGram: weight > 0 ? Math.round(finalPrice / weight) : finalPrice,
    goldRate,
    manual,
  };
}

export type PricedProduct<T extends PriceInput> = T & { price: PriceBreakdown };

export function withPrice<T extends PriceInput>(
  products: T[],
  rateMap: Record<number, number>,
  config: PricingConfigData,
): PricedProduct<T>[] {
  return products.map((product) => ({ ...product, price: computePrice(product, rateMap, config) }));
}

import "server-only";
import { getCart } from "./cart";
import { computePrice, getPricingContext } from "./pricing";

/** Cart totals derived from the pricing engine — never stored client-side. */
export async function getCartTotals() {
  const [cart, { rateMap, pricingConfig }] = await Promise.all([getCart(), getPricingContext()]);

  const lines = (cart?.items ?? []).map((item) => {
    const price = computePrice(item.product, rateMap, pricingConfig);
    const unit = price.finalPrice + (item.variant?.priceDelta ?? 0);
    return { item, price, unit, lineTotal: unit * item.qty };
  });

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const tax = lines.reduce((sum, line) => sum + line.price.tax * line.item.qty, 0);
  const count = lines.reduce((sum, line) => sum + line.item.qty, 0);

  return { cart, lines, subtotal, tax, count, currency: pricingConfig.currency };
}

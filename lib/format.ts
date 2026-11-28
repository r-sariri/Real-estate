/** Display helpers — Persian numerals, Toman/Rial, Jalali dates. */

const faNumber = new Intl.NumberFormat("fa-IR");

export function faNum(value: number | string): string {
  return faNumber.format(Number(value));
}

export type Currency = "TOMAN" | "RIAL";

/** Stored amounts are Toman. Rial display is 10× the stored value. */
export function toDisplayAmount(amountToman: number, currency: Currency = "TOMAN"): number {
  return currency === "RIAL" ? amountToman * 10 : amountToman;
}

export function currencyLabel(currency: Currency = "TOMAN"): string {
  return currency === "RIAL" ? "ریال" : "تومان";
}

export function formatMoney(amountToman: number, currency: Currency = "TOMAN"): string {
  return `${faNum(toDisplayAmount(amountToman, currency))} ${currencyLabel(currency)}`;
}

export function formatWeight(grams: number): string {
  return `${faNum(Number(grams.toFixed(2)))} گرم`;
}

export function formatPurity(karat: number): string {
  return `${faNum(karat)} عیار`;
}

const jalaliDate = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const jalaliDateTime = new Intl.DateTimeFormat("fa-IR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDate(date: Date | string): string {
  return jalaliDate.format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return jalaliDateTime.format(new Date(date));
}

/** Relative "last updated" label used next to the gold rate. */
export function formatAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "همین حالا";
  if (minutes < 60) return `${faNum(minutes)} دقیقه پیش`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${faNum(hours)} ساعت پیش`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${faNum(days)} روز پیش`;
  return formatDate(date);
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function digitsToLatin(input: string): string {
  return input.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}

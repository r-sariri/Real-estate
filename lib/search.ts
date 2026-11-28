/**
 * Persian/Arabic text normalisation for search.
 * Stored alongside each product so "انگشتر" also matches "انگشتر", "ي" matches
 * "ی", "ك" matches "ک" and Persian digits match Latin ones.
 */
export function normalizeFa(input: string): string {
  return input
    .toLowerCase()
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ؤ/g, "و")
    .replace(/[ةۀ]/g, "ه")
    .replace(/[\u064B-\u0652\u0640]/g, "")
    .replace(/\u200c/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSearchText(parts: (string | null | undefined)[]): string {
  return normalizeFa(parts.filter(Boolean).join(" "));
}

import "server-only";
import { cache } from "react";
import { prisma } from "./db";

/** Editable site settings (admin → Settings). Stored as key/value strings. */
export const DEFAULT_SETTINGS = {
  brandName: "زرّین",
  brandLatin: "ZARRIN",
  tagline: "جواهرات دست‌ساز با طلای ۱۸ عیار",
  announcement: "ارسال بیمه‌شده رایگان برای سفارش‌های بالای ۱۰ میلیون تومان",
  phone: "۰۲۱-۹۱۰۰۲۲۳۳",
  email: "hello@zarrin.ir",
  address: "تهران، خیابان ولیعصر، برج نگین، طبقه ۴",
  instagram: "https://instagram.com/zarrin",
  telegram: "https://t.me/zarrin",
  whatsapp: "https://wa.me/989120000000",
  metaDescription:
    "زرّین؛ فروشگاه آنلاین جواهرات و طلای ۱۸ عیار با طراحی دست‌ساز، گارانتی اصالت و ارسال بیمه‌شده به سراسر ایران.",
  shippingNote: "ارسال بیمه‌شده با پست پیشتاز یا پیک اختصاصی در تهران.",
  paymentGateway: "manual", // manual | zarinpal | idpay
  gatewayMerchantId: "",
};

export type SiteSettings = typeof DEFAULT_SETTINGS;

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await prisma.setting.findMany();
  const merged = { ...DEFAULT_SETTINGS } as Record<string, string>;
  for (const row of rows) {
    if (row.key in merged && row.value !== "") merged[row.key] = row.value;
  }
  return merged as SiteSettings;
});

export async function updateSettings(patch: Partial<Record<keyof SiteSettings, string>>): Promise<void> {
  const entries = Object.entries(patch).filter(([key]) => key in DEFAULT_SETTINGS);
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        create: { key, value: String(value ?? "") },
        update: { value: String(value ?? "") },
      }),
    ),
  );
}

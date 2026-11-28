import "server-only";
import { prisma } from "./db";
import { formatMoney } from "./format";
import type { Coupon } from "@prisma/client";

export type CouponResult =
  | { ok: true; coupon: Coupon; discount: number }
  | { ok: false; message: string };

/** Server-side coupon validation — the client never decides the discount. */
export async function validateCoupon(code: string | undefined | null, subtotal: number): Promise<CouponResult> {
  const normalized = (code ?? "").trim().toUpperCase();
  if (!normalized) return { ok: false, message: "کد تخفیف را وارد کنید." };

  const coupon = await prisma.coupon.findUnique({ where: { code: normalized } });
  if (!coupon || !coupon.isActive) return { ok: false, message: "کد تخفیف معتبر نیست." };

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) return { ok: false, message: "این کد هنوز فعال نشده است." };
  if (coupon.expiresAt && coupon.expiresAt < now) return { ok: false, message: "این کد منقضی شده است." };
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    return { ok: false, message: "ظرفیت استفاده از این کد تکمیل شده است." };
  }
  if (subtotal < coupon.minSubtotal) {
    return { ok: false, message: `حداقل مبلغ سفارش برای این کد ${formatMoney(coupon.minSubtotal)} است.` };
  }

  const discount =
    coupon.type === "PERCENT"
      ? Math.round((subtotal * Math.min(100, coupon.value)) / 100)
      : Math.min(coupon.value, subtotal);

  return { ok: true, coupon, discount };
}

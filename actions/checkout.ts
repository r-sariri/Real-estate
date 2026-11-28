"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCart, type CartWithItems } from "@/lib/cart";
import { computePrice, getPricingContext, type PriceBreakdown } from "@/lib/pricing";
import { validateCoupon } from "@/lib/coupon";
import { addressSchema } from "@/lib/validation";
import { fieldErrors } from "@/lib/validation";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { clientIp } from "@/lib/auth";
import type { FormState } from "@/lib/action-types";

export async function placeOrderAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const h = await headers();
  if (!rateLimit(`order:${clientIp(h)}`, 10, 10 * 60_000).ok) {
    return { ok: false, message: "تعداد سفارش‌های ثبت‌شده زیاد است. لطفاً کمی بعد تلاش کنید." };
  }

  const parsed = addressSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    province: formData.get("province"),
    city: formData.get("city"),
    postalCode: formData.get("postalCode"),
    line1: formData.get("line1"),
    label: "سفارش",
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const shippingMethodId = String(formData.get("shippingMethodId") ?? "");
  const note = String(formData.get("note") ?? "").slice(0, 500);
  const couponCode = String(formData.get("coupon") ?? "");
  const email = String(formData.get("email") ?? "").slice(0, 200);

  const [cart, shippingMethod] = await Promise.all([
    getCart(),
    prisma.shippingMethod.findUnique({ where: { id: shippingMethodId } }),
  ]);

  if (!cart || cart.items.length === 0) return { ok: false, message: "سبد خرید شما خالی است." };
  if (!shippingMethod || !shippingMethod.isActive) return { ok: false, message: "روش ارسال را انتخاب کنید." };

  const { rateMap, pricingConfig } = await getPricingContext();

  // Re-price server-side and re-check stock before writing anything.
  type Line = { item: CartWithItems["items"][number]; price: PriceBreakdown; unitPrice: number };
  const lines: Line[] = [];
  for (const item of cart.items) {
    const available = item.variant ? item.variant.stock : item.product.stock;
    if (!item.product.isActive || available < item.qty) {
      return { ok: false, message: `«${item.product.name}» به اندازه کافی موجود نیست. سبد خود را به‌روز کنید.` };
    }
    const price = computePrice(item.product, rateMap, pricingConfig);
    const unitPrice = price.finalPrice + (item.variant?.priceDelta ?? 0);
    lines.push({ item, price, unitPrice });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.item.qty, 0);
  const tax = lines.reduce((sum, line) => sum + line.price.tax * line.item.qty, 0);

  let discount = 0;
  let appliedCoupon: string | null = null;
  if (couponCode) {
    const result = await validateCoupon(couponCode, subtotal);
    if (!result.ok) return { ok: false, message: result.message };
    discount = result.discount;
    appliedCoupon = result.coupon.code;
  }

  const shippingCost = subtotal >= 10_000_000 ? 0 : shippingMethod.price;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const user = await getCurrentUser();
  const orderNumber = `ZR-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId: user?.id ?? null,
        customerName: parsed.data.fullName,
        customerPhone: parsed.data.phone,
        customerEmail: email || user?.email || null,
        shippingAddress: {
          province: parsed.data.province,
          city: parsed.data.city,
          postalCode: parsed.data.postalCode,
          line1: parsed.data.line1,
        },
        shippingMethod: shippingMethod.name,
        shippingCost,
        subtotal,
        discount,
        tax,
        total,
        couponCode: appliedCoupon,
        note: note || null,
        paymentGateway: "manual",
        status: "PENDING",
        paymentStatus: "UNPAID",
        items: {
          create: lines.map(({ item, unitPrice, price }) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.product.name + (item.variant ? ` — ${item.variant.name}` : ""),
            purity: item.product.purity,
            weightGrams: item.product.weightGrams,
            goldRate: price.goldRate,
            unitPrice,
            qty: item.qty,
            image: item.product.images[0] ?? null,
          })),
        },
        events: { create: { status: "PENDING", note: "سفارش ثبت شد و در انتظار پرداخت است." } },
      },
      select: { id: true, orderNumber: true },
    });

    for (const { item } of lines) {
      if (item.variantId) {
        await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { decrement: item.qty } } });
      }
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.qty }, popularity: { increment: item.qty } },
      });
    }

    if (appliedCoupon) {
      await tx.coupon.updateMany({ where: { code: appliedCoupon }, data: { usedCount: { increment: 1 } } });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return created;
  });

  revalidatePath("/", "layout");
  redirect(`/checkout/success?order=${order.orderNumber}`);
}

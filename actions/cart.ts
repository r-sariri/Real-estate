"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ensureCart, getCart } from "@/lib/cart";
import type { FormState } from "@/lib/action-types";

function refresh() {
  revalidatePath("/", "layout");
}

export async function addToCartAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const productId = String(formData.get("productId") ?? "");
  const variantIdRaw = String(formData.get("variantId") ?? "");
  const variantId = variantIdRaw && variantIdRaw !== "none" ? variantIdRaw : null;
  const qty = Math.min(10, Math.max(1, Number(formData.get("qty") ?? 1) || 1));

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });
  if (!product || !product.isActive) {
    return { ok: false, message: "این محصول در دسترس نیست." };
  }

  const variant = variantId ? product.variants.find((item) => item.id === variantId) : null;
  if (variantId && !variant) return { ok: false, message: "گزینه انتخاب‌شده معتبر نیست." };
  if (product.variants.length > 0 && !variant) return { ok: false, message: "گزینه مورد نظر را انتخاب کنید." };

  const available = variant ? variant.stock : product.stock;
  if (available < qty) {
    return { ok: false, message: available === 0 ? "این محصول موجود نیست." : `فقط ${available} عدد در انبار موجود است.` };
  }

  const cart = await ensureCart();
  const existing = cart.items.find((item) => item.productId === productId && (item.variantId ?? null) === variantId);

  if (existing && existing.qty + qty > available) {
    return { ok: false, message: `حداکثر ${available} عدد از این محصول قابل سفارش است.` };
  }

  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { qty: existing.qty + qty } });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, variantId, qty } });
  }

  refresh();
  return { ok: true, message: "به سبد خرید اضافه شد." };
}

/** Plain form action: set an absolute quantity for one cart line. */
export async function setCartQty(formData: FormData): Promise<void> {
  const itemId = String(formData.get("itemId") ?? "");
  const requested = Number(formData.get("qty") ?? 0);
  if (!itemId || !Number.isFinite(requested)) return;

  const cart = await getCart();
  const item = cart?.items.find((row) => row.id === itemId);
  if (!cart || !item) return;

  const available = item.variant ? item.variant.stock : item.product.stock;
  const qty = Math.max(0, Math.min(10, Math.floor(requested)));

  if (qty === 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
  } else {
    await prisma.cartItem.update({ where: { id: item.id }, data: { qty: Math.min(qty, available) } });
  }
  refresh();
}

/** Plain form action: remove one cart line. */
export async function removeCartLine(formData: FormData): Promise<void> {
  const itemId = String(formData.get("itemId") ?? "");
  const cart = await getCart();
  if (!cart || !itemId) return;
  await prisma.cartItem.deleteMany({ where: { id: itemId, cartId: cart.id } });
  refresh();
}

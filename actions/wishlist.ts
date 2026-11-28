"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export type WishlistResult = {
  ok: boolean;
  inWishlist?: boolean;
  needsAuth?: boolean;
  message?: string;
};

export async function toggleWishlistAction(productId: string): Promise<WishlistResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, needsAuth: true, message: "برای افزودن به علاقه‌مندی‌ها وارد حساب خود شوید." };

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (!product) return { ok: false, message: "محصول یافت نشد." };

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/account/wishlist");
    return { ok: true, inWishlist: false, message: "از علاقه‌مندی‌ها حذف شد." };
  }

  await prisma.wishlistItem.create({ data: { userId: user.id, productId } });
  revalidatePath("/account/wishlist");
  return { ok: true, inWishlist: true, message: "به علاقه‌مندی‌ها اضافه شد." };
}

"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { clientIp, getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { fieldErrors, reviewSchema } from "@/lib/validation";
import type { FormState } from "@/lib/action-types";

export async function submitReviewAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "برای ثبت نظر ابتدا وارد حساب خود شوید." };

  const h = await headers();
  if (!rateLimit(`review:${user.id}:${clientIp(h)}`, 5, 60 * 60_000).ok) {
    return { ok: false, message: "تعداد نظرات ارسالی زیاد است. لطفاً بعداً تلاش کنید." };
  }

  const parsed = reviewSchema.safeParse({
    productId: formData.get("productId"),
    rating: formData.get("rating"),
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
    select: { id: true, slug: true },
  });
  if (!product) return { ok: false, message: "محصول یافت نشد." };

  const duplicate = await prisma.review.findFirst({
    where: { productId: product.id, userId: user.id },
  });
  if (duplicate) return { ok: false, message: "شما قبلاً برای این محصول نظر ثبت کرده‌اید." };

  await prisma.review.create({
    data: {
      productId: product.id,
      userId: user.id,
      authorName: user.name,
      rating: parsed.data.rating,
      title: parsed.data.title || null,
      body: parsed.data.body,
      isApproved: false,
    },
  });

  revalidatePath(`/product/${product.slug}`);
  return { ok: true, message: "نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود." };
}

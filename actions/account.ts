"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { addressSchema, fieldErrors, nameSchema, phoneSchema } from "@/lib/validation";
import type { FormState } from "@/lib/action-types";

export async function updateProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const name = nameSchema.safeParse(formData.get("name"));
  const phone = phoneSchema.safeParse(formData.get("phone"));

  const errors: Record<string, string> = {};
  if (!name.success) errors.name = name.error.issues[0].message;
  if (!phone.success) errors.phone = phone.error.issues[0].message;
  if (Object.keys(errors).length) return { ok: false, errors };

  await prisma.user.update({
    where: { id: user.id },
    data: { name: name.data, phone: phone.data },
  });

  revalidatePath("/account");
  return { ok: true, message: "اطلاعات حساب به‌روزرسانی شد." };
}

export async function saveAddressAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");

  const parsed = addressSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    province: formData.get("province"),
    city: formData.get("city"),
    postalCode: formData.get("postalCode"),
    line1: formData.get("line1"),
    label: formData.get("label") || undefined,
    isDefault: formData.get("isDefault") === "on",
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
  }

  if (id) {
    const owned = await prisma.address.findFirst({ where: { id, userId: user.id }, select: { id: true } });
    if (!owned) return { ok: false, message: "نشانی یافت نشد." };
    await prisma.address.update({ where: { id }, data: { ...parsed.data, isDefault: Boolean(parsed.data.isDefault) } });
  } else {
    const count = await prisma.address.count({ where: { userId: user.id } });
    await prisma.address.create({
      data: { ...parsed.data, userId: user.id, isDefault: parsed.data.isDefault || count === 0 },
    });
  }

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  return { ok: true, message: "نشانی ذخیره شد." };
}

export async function deleteAddressAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.address.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/account/addresses");
}

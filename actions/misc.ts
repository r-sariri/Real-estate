"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { clientIp } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema, fieldErrors, newsletterSchema } from "@/lib/validation";
import type { FormState } from "@/lib/action-types";

export async function subscribeNewsletterAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const h = await headers();
  if (!rateLimit(`newsletter:${clientIp(h)}`, 5, 60 * 60_000).ok) {
    return { ok: false, message: "تعداد درخواست‌ها زیاد است. لطفاً بعداً تلاش کنید." };
  }

  const parsed = newsletterSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    create: { email: parsed.data.email },
    update: {},
  });

  return { ok: true, message: "عضویت شما ثبت شد. از این پس خبرنامه زرّین را دریافت می‌کنید." };
}

export async function sendContactAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const h = await headers();
  if (!rateLimit(`contact:${clientIp(h)}`, 5, 60 * 60_000).ok) {
    return { ok: false, message: "تعداد پیام‌های ارسالی زیاد است. لطفاً بعداً تلاش کنید." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    subject: formData.get("subject"),
    body: formData.get("body"),
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject,
      body: parsed.data.body,
    },
  });

  return { ok: true, message: "پیام شما ثبت شد. همکاران ما در اولین فرصت پاسخ می‌دهند." };
}

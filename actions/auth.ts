"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  clientIp,
  createSession,
  destroySession,
  hashPassword,
  registerFailedLogin,
  verifyPassword,
} from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { fieldErrors, loginSchema, registerSchema } from "@/lib/validation";
import type { FormState } from "@/lib/action-types";

/** Only allow same-site relative redirects. */
function safeNext(value: unknown): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const h = await headers();
  const ip = clientIp(h);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  const byIp = rateLimit(`login:ip:${ip}`, 15, 5 * 60_000);
  const byEmail = rateLimit(`login:email:${email}`, 6, 15 * 60_000);
  if (!byIp.ok || !byEmail.ok) {
    return { ok: false, message: "تلاش‌های ورود بیش از حد مجاز است. چند دقیقه بعد دوباره امتحان کنید." };
  }

  const parsed = loginSchema.safeParse({ email, password: formData.get("password") });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  // Generic message on purpose: never reveal whether the account exists.
  const invalid = { ok: false as const, message: "ایمیل یا رمز عبور نادرست است." };

  if (!user) return invalid;
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return { ok: false, message: "حساب شما موقتاً قفل شده است. لطفاً بعداً تلاش کنید." };
  }
  if (user.isBlocked) return { ok: false, message: "این حساب غیرفعال شده است." };

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    await registerFailedLogin(user.id);
    return invalid;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLogins: 0, lockedUntil: null },
  });
  await createSession(user.id);

  const next = safeNext(formData.get("next"));
  redirect(user.role === "ADMIN" || user.role === "STAFF" ? (next === "/account" ? "/admin" : next) : next);
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const h = await headers();
  const ip = clientIp(h);
  if (!rateLimit(`register:ip:${ip}`, 5, 30 * 60_000).ok) {
    return { ok: false, message: "ثبت‌نام بیش از حد مجاز است. لطفاً بعداً تلاش کنید." };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return { ok: false, errors: { email: "این ایمیل قبلاً ثبت شده است." } };

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash: await hashPassword(parsed.data.password),
      role: "CUSTOMER",
    },
    select: { id: true },
  });

  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

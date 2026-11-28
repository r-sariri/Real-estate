import { z } from "zod";
import { digitsToLatin } from "./format";

const clean = (v: unknown) => (typeof v === "string" ? digitsToLatin(v).trim() : v);

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, "ایمیل را وارد کنید")
  .max(200, "ایمیل بیش از حد طولانی است")
  .email("ایمیل معتبر نیست");

export const passwordSchema = z
  .string()
  .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
  .max(100, "رمز عبور بیش از حد طولانی است");

export const phoneSchema = z.preprocess(
  clean,
  z.string().regex(/^09\d{9}$/, "شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد"),
);

export const nameSchema = z.string().trim().min(2, "نام را کامل وارد کنید").max(80);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "رمز عبور را وارد کنید").max(100),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

export const addressSchema = z.object({
  fullName: nameSchema,
  phone: phoneSchema,
  province: z.string().trim().min(2, "استان را انتخاب کنید"),
  city: z.string().trim().min(2, "شهر را وارد کنید"),
  postalCode: z.preprocess(clean, z.string().regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد")),
  line1: z.string().trim().min(10, "نشانی را کامل وارد کنید").max(300),
  label: z.string().trim().max(40).optional(),
  isDefault: z.boolean().optional(),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1, "امتیاز را انتخاب کنید").max(5),
  title: z.string().trim().max(80).optional(),
  body: z.string().trim().min(10, "متن نظر حداقل ۱۰ کاراکتر باشد").max(1200),
});

export const newsletterSchema = z.object({ email: emailSchema });

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: z.preprocess(clean, z.string().max(15).optional().or(z.literal(""))),
  subject: z.string().trim().min(3, "موضوع را وارد کنید").max(120),
  body: z.string().trim().min(10, "متن پیام حداقل ۱۰ کاراکتر باشد").max(2000),
});

/** Convert a ZodError into a flat field→message map for form rendering. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

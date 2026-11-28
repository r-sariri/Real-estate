import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "ثبت‌نام",
  description: "ساخت حساب کاربری در زرّین.",
  robots: { index: false, follow: true },
};

type SearchParams = Promise<{ next?: string }>;

export default async function RegisterPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  if (user) redirect("/account");
  const { next } = await searchParams;

  return (
    <AuthShell eyebrow="عضویت" title="ساخت حساب جدید" subtitle="چند ثانیه وقت می‌گیرد و بعد از آن خرید سریع‌تر است.">
      <RegisterForm next={next && next.startsWith("/") ? next : "/account"} />
    </AuthShell>
  );
}

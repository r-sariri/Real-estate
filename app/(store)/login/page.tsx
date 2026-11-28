import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "ورود به حساب",
  description: "ورود به حساب کاربری زرّین برای پیگیری سفارش‌ها و علاقه‌مندی‌ها.",
  robots: { index: false, follow: true },
};

type SearchParams = Promise<{ next?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  if (user) redirect("/account");
  const { next } = await searchParams;

  return (
    <AuthShell eyebrow="حساب کاربری" title="خوش آمدید" subtitle="برای ادامه وارد حساب خود شوید.">
      <LoginForm next={next && next.startsWith("/") ? next : "/account"} />
    </AuthShell>
  );
}

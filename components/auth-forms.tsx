"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction } from "@/actions/auth";
import { emptyFormState } from "@/lib/action-types";
import { Alert, Field, inputClass } from "./ui";
import { Icon } from "./icons";

function Submit({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-pearl transition-colors hover:bg-gold-deep disabled:opacity-60"
    >
      {pending ? "لطفاً صبر کنید…" : label}
      <Icon name="arrowLeft" size={16} />
    </button>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, emptyFormState);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {state.message ? <Alert tone="error">{state.message}</Alert> : null}

      <Field label="ایمیل" name="email" required error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} placeholder="you@example.com" dir="ltr" />
      </Field>
      <Field label="رمز عبور" name="password" required error={errors.password}>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>

      <Submit pending={pending} label="ورود به حساب" />

      <p className="text-center text-[12px] text-muted">
        حساب کاربری ندارید؟{" "}
        <Link href="/register" className="font-medium text-gold-deep hover:underline">ثبت‌نام کنید</Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(registerAction, emptyFormState);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {state.message ? <Alert tone="error">{state.message}</Alert> : null}

      <Field label="نام و نام خانوادگی" name="name" required error={errors.name}>
        <input id="name" name="name" autoComplete="name" required className={inputClass} />
      </Field>
      <Field label="ایمیل" name="email" required error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} dir="ltr" />
      </Field>
      <Field label="شماره موبایل" name="phone" required error={errors.phone} hint="با ۰۹ شروع شود">
        <input id="phone" name="phone" inputMode="tel" autoComplete="tel" required className={inputClass} placeholder="09121234567" dir="ltr" />
      </Field>
      <Field label="رمز عبور" name="password" required error={errors.password} hint="حداقل ۸ کاراکتر">
        <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} className={inputClass} />
      </Field>

      <Submit pending={pending} label="ساخت حساب" />

      <p className="text-center text-[12px] text-muted">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link href="/login" className="font-medium text-gold-deep hover:underline">ورود</Link>
      </p>
      <p className="text-center text-[10.5px] leading-5 text-muted">
        با ثبت‌نام، <Link href="/pages/terms" className="underline">قوانین</Link> و{" "}
        <Link href="/pages/privacy" className="underline">حریم خصوصی</Link> زرّین را می‌پذیرید.
      </p>
    </form>
  );
}

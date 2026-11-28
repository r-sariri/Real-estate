"use client";

import { useActionState } from "react";
import { sendContactAction } from "@/actions/misc";
import { emptyFormState } from "@/lib/action-types";
import { Field, inputClass } from "./ui";
import { Icon } from "./icons";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactAction, emptyFormState);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="نام و نام خانوادگی" name="contact-name" required error={errors.name}>
          <input id="contact-name" name="name" autoComplete="name" required className={inputClass} />
        </Field>
        <Field label="ایمیل" name="contact-email" required error={errors.email}>
          <input id="contact-email" name="email" type="email" autoComplete="email" required className={inputClass} dir="ltr" />
        </Field>
        <Field label="شماره تماس (اختیاری)" name="contact-phone" error={errors.phone}>
          <input id="contact-phone" name="phone" inputMode="tel" className={inputClass} dir="ltr" placeholder="09121234567" />
        </Field>
        <Field label="موضوع" name="contact-subject" required error={errors.subject}>
          <input id="contact-subject" name="subject" required className={inputClass} placeholder="سؤال درباره سفارش، سفارش خاص…" />
        </Field>
      </div>
      <Field label="متن پیام" name="contact-body" required error={errors.body}>
        <textarea id="contact-body" name="body" rows={5} required className={`${inputClass} resize-y`} />
      </Field>

      {state.message ? (
        <p role="status" className={`flex items-center gap-1.5 text-[11.5px] ${state.ok ? "text-success" : "text-danger"}`}>
          <Icon name={state.ok ? "check" : "alert"} size={13} />
          {state.message}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-pearl transition-colors hover:bg-gold-deep disabled:opacity-60">
        {pending ? "در حال ارسال…" : "ارسال پیام"}
        <Icon name="arrowLeft" size={16} />
      </button>
    </form>
  );
}

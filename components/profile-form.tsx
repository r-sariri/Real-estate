"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/actions/account";
import { emptyFormState } from "@/lib/action-types";
import { Field, inputClass } from "./ui";
import { Icon } from "./icons";

export function ProfileForm({ defaults }: { defaults: { name: string; phone: string; email: string } }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, emptyFormState);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="نام و نام خانوادگی" name="name" required error={errors.name}>
          <input id="name" name="name" defaultValue={defaults.name} autoComplete="name" required className={inputClass} />
        </Field>
        <Field label="شماره موبایل" name="phone" required error={errors.phone}>
          <input id="phone" name="phone" defaultValue={defaults.phone} inputMode="tel" autoComplete="tel" required className={inputClass} dir="ltr" />
        </Field>
        <Field label="ایمیل (غیرقابل تغییر)" name="email" className="sm:col-span-2">
          <input id="email" value={defaults.email} disabled className={inputClass} dir="ltr" />
        </Field>
      </div>

      {state.message ? (
        <p role="status" className={`flex items-center gap-1.5 text-[11.5px] ${state.ok ? "text-success" : "text-danger"}`}>
          <Icon name={state.ok ? "check" : "alert"} size={13} />
          {state.message}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="rounded-full bg-ink px-6 py-2.5 text-sm text-pearl transition-colors hover:bg-gold-deep disabled:opacity-60">
        {pending ? "در حال ذخیره…" : "ذخیره تغییرات"}
      </button>
    </form>
  );
}

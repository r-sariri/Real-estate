"use client";

import { useActionState } from "react";
import { subscribeNewsletterAction } from "@/actions/misc";
import { emptyFormState } from "@/lib/action-types";
import { inputClass } from "./ui";
import { Icon } from "./icons";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [state, formAction, pending] = useActionState(subscribeNewsletterAction, emptyFormState);

  return (
    <form action={formAction} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={compact ? "newsletter-footer" : "newsletter-main"} className="sr-only">
          نشانی ایمیل
        </label>
        <input
          id={compact ? "newsletter-footer" : "newsletter-main"}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="نشانی ایمیل شما"
          aria-describedby={state.errors?.email ? "newsletter-error" : undefined}
          className={`${inputClass} bg-white/95`}
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-2.5 text-sm font-medium text-pearl transition-colors hover:bg-gold-deep disabled:opacity-60"
        >
          {pending ? "در حال ثبت…" : "عضویت"}
          <Icon name="arrowLeft" size={16} />
        </button>
      </div>
      {state.errors?.email ? (
        <p id="newsletter-error" role="alert" className="mt-2 text-xs text-danger">{state.errors.email}</p>
      ) : null}
      {state.message ? (
        <p role="status" className={`mt-2 flex items-center gap-1.5 text-xs ${state.ok ? "text-success" : "text-danger"}`}>
          <Icon name={state.ok ? "check" : "alert"} size={13} />
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

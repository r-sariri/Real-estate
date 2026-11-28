"use client";

import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { emptyFormState, type FormState } from "@/lib/action-types";
import { Icon } from "../icons";

type ServerAction = (prev: FormState, formData: FormData) => Promise<FormState>;

export function SubmitButton({ label = "ذخیره", variant = "primary" }: { label?: string; variant?: "primary" | "gold" }) {
  const { pending } = useFormStatus();
  const classes =
    variant === "gold"
      ? "bg-gradient-to-l from-gold-deep via-gold to-champagne text-ink shadow-gold"
      : "bg-ink text-pearl hover:bg-gold-deep";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12.5px] font-medium transition-colors disabled:opacity-60 ${classes}`}
    >
      {pending ? "در حال ذخیره…" : label}
      {!pending ? <Icon name="check" size={14} /> : null}
    </button>
  );
}

/**
 * One client wrapper for every admin form: wires useActionState, renders the
 * server action's message + field errors, and disables the submit while saving.
 */
export function AdminForm({
  action,
  children,
  submitLabel = "ذخیره",
  variant = "primary",
  className = "space-y-4",
  fieldLabels,
  footer,
}: {
  action: ServerAction;
  children: ReactNode;
  submitLabel?: string;
  variant?: "primary" | "gold";
  className?: string;
  fieldLabels?: Record<string, string>;
  footer?: ReactNode;
}) {
  const [state, formAction] = useActionState(action, emptyFormState);
  const errors = Object.entries(state.errors ?? {});

  return (
    <form action={formAction} className={className}>
      {children}

      {errors.length > 0 ? (
        <ul role="alert" className="space-y-1 rounded-xl border border-danger/25 bg-danger/8 px-3 py-2 text-[11.5px] text-danger">
          {errors.map(([field, message]) => (
            <li key={field}>
              <span className="font-medium">{fieldLabels?.[field] ?? field}:</span> {message}
            </li>
          ))}
        </ul>
      ) : null}

      {state.message ? (
        <p role="status" className={`flex items-center gap-1.5 text-[11.5px] ${state.ok ? "text-success" : "text-danger"}`}>
          <Icon name={state.ok ? "check" : "alert"} size={13} />
          {state.message}
        </p>
      ) : null}

      <div className="flex items-center gap-2">
        <SubmitButton label={submitLabel} variant={variant} />
        {footer}
      </div>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { saveAddressAction } from "@/actions/account";
import { emptyFormState } from "@/lib/action-types";
import { IRAN_PROVINCES } from "@/lib/provinces";
import { Field, inputClass } from "./ui";
import { Icon } from "./icons";

type AddressDefaults = {
  id?: string;
  label?: string | null;
  fullName?: string;
  phone?: string;
  province?: string;
  city?: string;
  postalCode?: string;
  line1?: string;
  isDefault?: boolean;
};

export function AddressForm({ address, compact = false }: { address?: AddressDefaults; compact?: boolean }) {
  const [state, formAction, pending] = useActionState(saveAddressAction, emptyFormState);
  const errors = state.errors ?? {};
  const key = address?.id ?? "new";
  const field = (name: string) => ({ id: `${name}-${key}`, name });

  return (
    <form action={formAction} className="space-y-4">
      {address?.id ? <input type="hidden" name="id" value={address.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="نام گیرنده" name={`fullName-${key}`} required error={errors.fullName}>
          <input {...field("fullName")} defaultValue={address?.fullName} autoComplete="name" required className={inputClass} />
        </Field>
        <Field label="شماره موبایل" name={`phone-${key}`} required error={errors.phone}>
          <input {...field("phone")} defaultValue={address?.phone} inputMode="tel" required className={inputClass} dir="ltr" placeholder="09121234567" />
        </Field>
        <Field label="استان" name={`province-${key}`} required error={errors.province}>
          <select {...field("province")} defaultValue={address?.province} required className={inputClass}>
            <option value="">انتخاب استان…</option>
            {IRAN_PROVINCES.map((province) => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
        </Field>
        <Field label="شهر" name={`city-${key}`} required error={errors.city}>
          <input {...field("city")} defaultValue={address?.city} required className={inputClass} />
        </Field>
        <Field label="کد پستی" name={`postalCode-${key}`} required error={errors.postalCode}>
          <input {...field("postalCode")} defaultValue={address?.postalCode} inputMode="numeric" required className={inputClass} />
        </Field>
        {!compact ? (
          <Field label="برچسب (اختیاری)" name={`label-${key}`}>
            <input {...field("label")} defaultValue={address?.label ?? ""} className={inputClass} placeholder="خانه، محل کار…" />
          </Field>
        ) : null}
        <Field label="نشانی کامل" name={`line1-${key}`} required error={errors.line1} className="sm:col-span-2">
          <textarea {...field("line1")} defaultValue={address?.line1} rows={2} required className={`${inputClass} resize-y`} />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-[12px] text-ink-soft">
        <input type="checkbox" name="isDefault" defaultChecked={address?.isDefault} className="accent-gold-deep" />
        تنظیم به‌عنوان نشانی پیش‌فرض
      </label>

      {state.message ? (
        <p role="status" className={`flex items-center gap-1.5 text-[11.5px] ${state.ok ? "text-success" : "text-danger"}`}>
          <Icon name={state.ok ? "check" : "alert"} size={13} />
          {state.message}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="rounded-full bg-ink px-6 py-2.5 text-sm text-pearl transition-colors hover:bg-gold-deep disabled:opacity-60">
        {pending ? "در حال ذخیره…" : address?.id ? "ذخیره نشانی" : "افزودن نشانی"}
      </button>
    </form>
  );
}

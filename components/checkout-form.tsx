"use client";

import { useActionState, useState } from "react";
import { placeOrderAction } from "@/actions/checkout";
import { emptyFormState } from "@/lib/action-types";
import { formatMoney } from "@/lib/format";
import { IRAN_PROVINCES } from "@/lib/provinces";
import { Field, inputClass } from "./ui";
import { Icon } from "./icons";

type Method = { id: string; name: string; description: string | null; price: number; minDays: number; maxDays: number };

const FREE_SHIPPING_THRESHOLD = 10_000_000;

export function CheckoutForm({
  methods,
  defaults,
  subtotal,
  discount,
  coupon,
  currency,
  isLoggedIn,
}: {
  methods: Method[];
  defaults: { fullName: string; phone: string; email: string; province: string; city: string; postalCode: string; line1: string };
  subtotal: number;
  discount: number;
  coupon: string;
  currency: "TOMAN" | "RIAL";
  isLoggedIn: boolean;
}) {
  const [state, formAction, pending] = useActionState(placeOrderAction, emptyFormState);
  const [methodId, setMethodId] = useState(methods[0]?.id ?? "");
  const selected = methods.find((method) => method.id === methodId);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : (selected?.price ?? 0);
  const total = Math.max(0, subtotal - discount + shipping);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
      <input type="hidden" name="coupon" value={coupon} />

      <div className="space-y-5">
        <section className="rounded-3xl border border-line bg-white/70 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Icon name="mapPin" size={16} className="text-gold-deep" />
            نشانی تحویل
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام و نام خانوادگی" name="fullName" required error={errors.fullName}>
              <input id="fullName" name="fullName" defaultValue={defaults.fullName} autoComplete="name" required className={inputClass} />
            </Field>
            <Field label="شماره موبایل" name="phone" required error={errors.phone} hint="با ۰۹ شروع شود؛ برای هماهنگی ارسال">
              <input id="phone" name="phone" defaultValue={defaults.phone} inputMode="tel" autoComplete="tel" required className={inputClass} placeholder="09121234567" />
            </Field>
            <Field label="استان" name="province" required error={errors.province}>
              <select id="province" name="province" defaultValue={defaults.province} required className={inputClass}>
                <option value="">انتخاب استان…</option>
                {IRAN_PROVINCES.map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </Field>
            <Field label="شهر" name="city" required error={errors.city}>
              <input id="city" name="city" defaultValue={defaults.city} autoComplete="address-level2" required className={inputClass} />
            </Field>
            <Field label="کد پستی" name="postalCode" required error={errors.postalCode} hint="۱۰ رقم">
              <input id="postalCode" name="postalCode" defaultValue={defaults.postalCode} inputMode="numeric" autoComplete="postal-code" required className={inputClass} />
            </Field>
            <Field label="ایمیل (اختیاری)" name="email" error={errors.email}>
              <input id="email" name="email" type="email" defaultValue={defaults.email} autoComplete="email" className={inputClass} />
            </Field>
            <Field label="نشانی کامل پستی" name="line1" required error={errors.line1} className="sm:col-span-2">
              <textarea id="line1" name="line1" defaultValue={defaults.line1} rows={3} required autoComplete="street-address" className={`${inputClass} resize-y`} placeholder="خیابان، کوچه، پلاک، واحد" />
            </Field>
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-white/70 p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Icon name="truck" size={16} className="text-gold-deep" />
            روش ارسال
          </h2>
          <div className="space-y-2">
            {methods.map((method) => (
              <label
                key={method.id}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition-colors ${
                  methodId === method.id ? "border-gold bg-gold-soft/30" : "border-line bg-white hover:border-gold/50"
                }`}
              >
                <input
                  type="radio"
                  name="shippingMethodId"
                  value={method.id}
                  checked={methodId === method.id}
                  onChange={() => setMethodId(method.id)}
                  className="mt-1 accent-gold-deep"
                />
                <span className="flex-1">
                  <span className="block text-[12.5px] font-medium">{method.name}</span>
                  <span className="block text-[11px] text-muted">{method.description}</span>
                  <span className="mt-0.5 block text-[10.5px] text-muted">
                    {method.minDays === 0 ? "تحویل همان روز" : `${method.minDays} تا ${method.maxDays} روز کاری`}
                  </span>
                </span>
                <span className="text-[12px] font-medium">
                  {subtotal >= FREE_SHIPPING_THRESHOLD || method.price === 0 ? "رایگان" : formatMoney(method.price, currency)}
                </span>
              </label>
            ))}
          </div>
          {errors.shippingMethodId ? <p className="mt-2 text-[11px] text-danger">{errors.shippingMethodId}</p> : null}
          {subtotal >= FREE_SHIPPING_THRESHOLD ? (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-success">
              <Icon name="gift" size={13} /> ارسال این سفارش رایگان است.
            </p>
          ) : null}
        </section>

        <section className="rounded-3xl border border-line bg-white/70 p-5">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Icon name="receipt" size={16} className="text-gold-deep" />
            یادداشت سفارش
          </h2>
          <label htmlFor="note" className="sr-only">یادداشت سفارش</label>
          <textarea id="note" name="note" rows={2} maxLength={500} className={`${inputClass} resize-y`} placeholder="مثلاً: حکاکی نام، ساعت تحویل مورد نظر…" />
        </section>
      </div>

      <aside className="rounded-3xl border border-line bg-white/85 p-5 lg:sticky lg:top-24">
        <h2 className="text-sm font-semibold">خلاصه پرداخت</h2>
        <dl className="mt-4 space-y-2.5 text-[12.5px]">
          <div className="flex justify-between"><dt className="text-ink-soft">جمع کالاها</dt><dd>{formatMoney(subtotal, currency)}</dd></div>
          {discount > 0 ? (
            <div className="flex justify-between text-danger"><dt>تخفیف {coupon ? `(${coupon})` : ""}</dt><dd>−{formatMoney(discount, currency)}</dd></div>
          ) : null}
          <div className="flex justify-between"><dt className="text-ink-soft">ارسال</dt><dd>{shipping === 0 ? "رایگان" : formatMoney(shipping, currency)}</dd></div>
          <div className="flex justify-between border-t border-line pt-2.5 text-[14px] font-semibold"><dt>مبلغ نهایی</dt><dd>{formatMoney(total, currency)}</dd></div>
        </dl>

        <div className="mt-4 rounded-2xl border border-line bg-cream/60 p-3 text-[11px] leading-5 text-ink-soft">
          <p className="flex items-center gap-1.5 font-medium text-ink"><Icon name="lock" size={13} className="text-gold-deep" /> پرداخت امن</p>
          <p className="mt-1">پس از ثبت سفارش، روش پرداخت و شماره سفارش برای شما نمایش داده می‌شود.</p>
        </div>

        {state.message ? (
          <p role="alert" className="mt-3 flex items-start gap-1.5 rounded-xl bg-danger/8 px-3 py-2 text-[11.5px] text-danger">
            <Icon name="alert" size={13} className="mt-0.5 shrink-0" />
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-l from-gold-deep via-gold to-champagne px-6 py-3.5 text-sm font-medium text-ink shadow-gold transition-all hover:brightness-105 disabled:opacity-60"
        >
          {pending ? "در حال ثبت سفارش…" : "ثبت سفارش"}
          <Icon name="arrowLeft" size={16} />
        </button>
        {!isLoggedIn ? (
          <p className="mt-2 text-center text-[10.5px] text-muted">
            با ثبت سفارش مهمان، امکان پیگیری آسان‌تر با ورود به حساب وجود دارد.
          </p>
        ) : null}
      </aside>
    </form>
  );
}

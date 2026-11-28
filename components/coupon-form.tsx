"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "./icons";

/**
 * Coupon entry. Applies the code through a client-side navigation so the
 * checkout page re-renders without a full document reload; the GET form action
 * still works if JavaScript is unavailable.
 */
export function CouponForm({ initial }: { initial?: string }) {
  const router = useRouter();
  const [code, setCode] = useState(initial ?? "");

  return (
    <form
      action="/checkout"
      method="get"
      onSubmit={(event) => {
        event.preventDefault();
        const value = code.trim();
        router.push(value ? `/checkout?coupon=${encodeURIComponent(value)}` : "/checkout");
      }}
      className="mt-4 flex flex-wrap items-end gap-2 border-t border-line pt-4"
    >
      <div className="flex-1">
        <label htmlFor="coupon" className="mb-1 block text-[11px] font-medium text-ink-soft">کد تخفیف</label>
        <input
          id="coupon"
          name="coupon"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="مثلاً ZARRIN10"
          autoComplete="off"
          className="w-full max-w-xs rounded-xl border border-line bg-white px-3 py-2 text-[12px] uppercase focus:border-gold focus:outline-none"
        />
      </div>
      <button type="submit" className="rounded-xl border border-line bg-white px-4 py-2 text-[12px] hover:border-gold">
        <span className="flex items-center gap-1.5">
          <Icon name="tag" size={13} />
          اعمال کد
        </span>
      </button>
    </form>
  );
}

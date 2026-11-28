"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log for the operator; never surface internals to the visitor.
    console.error("[app error]", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="container-lux flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-[11px] tracking-[0.22em] text-muted uppercase">خطای غیرمنتظره</p>
      <h1 className="mt-2 text-2xl font-semibold">مشکلی پیش آمد</h1>
      <p className="mt-3 max-w-md text-[13px] leading-7 text-ink-soft">
        لطفاً دوباره تلاش کنید. اگر مشکل ادامه داشت با پشتیبانی تماس بگیرید.
      </p>
      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-ink px-6 py-3 text-sm text-pearl hover:bg-gold-deep"
        >
          تلاش دوباره
        </button>
        <a href="/" className="rounded-full border border-line bg-white px-6 py-3 text-sm hover:border-gold">
          بازگشت به خانه
        </a>
      </div>
    </div>
  );
}

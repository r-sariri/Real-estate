"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitReviewAction } from "@/actions/reviews";
import { emptyFormState } from "@/lib/action-types";
import { inputClass } from "./ui";
import { Icon } from "./icons";

export function ReviewForm({ productId, canReview }: { productId: string; canReview: boolean }) {
  const [state, formAction, pending] = useActionState(submitReviewAction, emptyFormState);
  const [rating, setRating] = useState(5);

  if (!canReview) {
    return (
      <div className="rounded-2xl border border-line bg-white/70 p-5 text-center text-[12.5px] text-ink-soft">
        برای ثبت نظر{" "}
        <Link href={`/login?next=/product`} className="font-medium text-gold-deep hover:underline">
          وارد حساب خود شوید
        </Link>
        .
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-3xl border border-line bg-white/70 p-5">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />
      <fieldset>
        <legend className="mb-2 text-xs font-medium text-ink-soft">امتیاز شما</legend>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`${star} ستاره`}
              aria-pressed={rating === star}
              className={`transition-transform hover:scale-110 ${star <= rating ? "text-gold" : "text-line"}`}
            >
              <Icon name="star" size={22} filled={star <= rating} />
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="review-title" className="mb-1.5 block text-xs font-medium text-ink-soft">عنوان (اختیاری)</label>
        <input id="review-title" name="title" maxLength={80} className={inputClass} placeholder="خلاصه تجربه شما" />
      </div>
      <div>
        <label htmlFor="review-body" className="mb-1.5 block text-xs font-medium text-ink-soft">متن نظر</label>
        <textarea
          id="review-body"
          name="body"
          rows={4}
          required
          minLength={10}
          maxLength={1200}
          aria-describedby={state.errors?.body ? "review-body-error" : undefined}
          className={`${inputClass} resize-y`}
          placeholder="کیفیت، وزن، بسته‌بندی و تجربه خرید خود را بنویسید…"
        />
        {state.errors?.body ? (
          <p id="review-body-error" role="alert" className="mt-1 text-[11px] text-danger">{state.errors.body}</p>
        ) : null}
      </div>

      {state.message ? (
        <p role="status" className={`flex items-center gap-1.5 text-xs ${state.ok ? "text-success" : "text-danger"}`}>
          <Icon name={state.ok ? "check" : "alert"} size={13} />
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm text-pearl transition-colors hover:bg-gold-deep disabled:opacity-60"
      >
        {pending ? "در حال ارسال…" : "ثبت نظر"}
      </button>
      <p className="text-[10.5px] text-muted">نظر شما پس از بررسی تیم پشتیبانی منتشر می‌شود.</p>
    </form>
  );
}

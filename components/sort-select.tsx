"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/site";

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-xs text-muted">
      <span className="hidden sm:inline">مرتب‌سازی:</span>
      <select
        value={value}
        onChange={(event) => {
          const next = new URLSearchParams(params.toString());
          next.set("sort", event.target.value);
          next.delete("page");
          router.push(`/shop?${next.toString()}`);
        }}
        className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-ink focus:border-gold focus:outline-none"
        aria-label="مرتب‌سازی محصولات"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

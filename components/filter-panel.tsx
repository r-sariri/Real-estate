"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "./icons";

/**
 * Collapsible filter panel: expanded on desktop, collapsed on phones so the
 * product grid comes first. Server-rendered open, then collapsed after mount on
 * small screens (no hydration mismatch).
 */
export function FilterPanel({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) setOpen(false);
  }, []);

  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="rounded-3xl border border-line bg-white/70 p-4 lg:p-5"
    >
      <summary className="cursor-pointer text-sm font-semibold marker:content-none lg:cursor-default">
        <span className="flex items-center gap-2">
          <Icon name="filter" size={16} className="text-gold-deep" />
          فیلتر محصولات
        </span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { formatMoney, faNum } from "@/lib/format";
import { Icon } from "./icons";

/* ---------- Layout ---------- */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "start",
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "start" | "center";
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={`mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${
        align === "center" ? "text-center sm:flex-col sm:items-center" : ""
      }`}
    >
      <div className={align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        {eyebrow ? (
          <p className="mb-2 flex items-center gap-2 text-[11px] font-medium tracking-[0.22em] text-gold-deep uppercase">
            <span className="inline-block h-px w-6 bg-gold/70" aria-hidden />
            {eyebrow}
          </p>
        ) : null}
        <Heading className="text-2xl leading-tight font-semibold sm:text-3xl lg:text-[2rem]">{title}</Heading>
        {description ? <p className="mt-3 text-sm leading-7 text-ink-soft sm:text-[15px]">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ---------- Buttons / links ---------- */

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60";

export const buttonStyles = {
  primary: `${buttonBase} bg-ink px-6 py-3 text-pearl hover:bg-gold-deep hover:shadow-[0_18px_40px_-20px_rgba(168,132,63,.8)]`,
  gold: `${buttonBase} bg-[linear-gradient(100deg,#dcc48f_0%,#c6a45c_46%,#b3904c_100%)] px-6 py-3 text-ink shadow-gold ring-1 ring-white/60 hover:brightness-105`,
  outline: `${buttonBase} border border-line bg-white/70 px-6 py-3 text-ink hover:border-gold hover:bg-gold-soft/50`,
  ghost: `${buttonBase} px-4 py-2 text-ink-soft hover:text-gold-deep`,
  danger: `${buttonBase} border border-danger/30 bg-danger/5 px-4 py-2 text-danger hover:bg-danger/10`,
} as const;

export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = "",
  ...rest
}: {
  href: string;
  variant?: keyof typeof buttonStyles;
  children: ReactNode;
  className?: string;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link href={href} className={`${buttonStyles[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}

/* ---------- Badges & ratings ---------- */

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "gold" | "success" | "danger" | "ice";
  className?: string;
}) {
  const tones = {
    neutral: "bg-ink/5 text-ink-soft",
    gold: "bg-gold-soft text-gold-deep",
    success: "bg-success/10 text-success",
    danger: "bg-danger/10 text-danger",
    ice: "bg-ice text-ink-soft",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function Rating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className="inline-flex items-center gap-1.5" dir="ltr">
      <span className="inline-flex items-center gap-0.5 text-gold" aria-hidden>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon key={star} name="star" size={size} filled={rounded >= star} className={rounded >= star ? "" : "opacity-35"} />
        ))}
      </span>
      <span className="text-xs text-muted">
        {faNum(value.toFixed(1))}
        {typeof count === "number" ? ` (${faNum(count)})` : ""}
      </span>
      <span className="sr-only">{`امتیاز ${faNum(value.toFixed(1))} از ۵`}</span>
    </span>
  );
}

/* ---------- Price ---------- */

export function Price({
  amount,
  compareAt,
  currency = "TOMAN",
  size = "md",
}: {
  amount: number;
  compareAt?: number | null;
  currency?: "TOMAN" | "RIAL";
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-2xl" } as const;
  return (
    <span className="inline-flex flex-wrap items-baseline gap-2">
      <span className={`font-semibold text-ink ${sizes[size]}`}>{formatMoney(amount, currency)}</span>
      {compareAt && compareAt > amount ? (
        <span className="text-xs text-muted line-through">{formatMoney(compareAt, currency)}</span>
      ) : null}
    </span>
  );
}

/* ---------- Feedback ---------- */

export function Alert({
  tone = "info",
  children,
  className = "",
}: {
  tone?: "info" | "success" | "error";
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    info: "border-ice-deep/50 bg-ice/60 text-ink-soft",
    success: "border-success/25 bg-success/8 text-success",
    error: "border-danger/25 bg-danger/8 text-danger",
  } as const;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm ${tones[tone]} ${className}`}>
      <Icon name={tone === "success" ? "check" : tone === "error" ? "alert" : "sparkle"} size={16} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function EmptyState({
  icon = "package",
  title,
  description,
  action,
}: {
  icon?: React.ComponentProps<typeof Icon>["name"];
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white/60 px-6 py-16 text-center">
      <span className="iridescent mb-4 grid size-14 place-items-center rounded-full text-gold-deep ring-1 ring-white/80">
        <Icon name={icon} size={24} />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm leading-7 text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

/* ---------- Form primitives ---------- */

export const inputClass =
  "w-full rounded-2xl border border-line bg-white px-4 py-2.5 text-sm text-ink shadow-[inset_0_1px_0_rgba(255,255,255,.6)] transition-colors placeholder:text-muted/70 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none disabled:bg-cream";

export function Field({
  label,
  name,
  error,
  hint,
  required,
  children,
  className = "",
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={name} className="block text-xs font-medium text-ink-soft">
        {label}
        {required ? <span className="ms-1 text-gold-deep" aria-hidden>*</span> : null}
      </label>
      {children}
      {hint ? <p id={`${name}-hint`} className="text-[11px] text-muted">{hint}</p> : null}
      {error ? (
        <p id={`${name}-error`} role="alert" className="text-[11px] font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* ---------- Pagination ---------- */

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );
  return (
    <nav aria-label="صفحه‌بندی" className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} rel="prev" className="grid size-9 place-items-center rounded-full border border-line bg-white text-ink-soft hover:border-gold" aria-label="صفحه قبل">
          <Icon name="chevronRight" size={16} />
        </Link>
      ) : null}
      {pages.map((p, index) => {
        const prev = pages[index - 1];
        return (
          <span key={p} className="flex items-center gap-1.5">
            {prev && p - prev > 1 ? <span className="px-1 text-muted">…</span> : null}
            <Link
              href={buildHref(p)}
              aria-current={p === page ? "page" : undefined}
              className={`grid size-9 place-items-center rounded-full border text-sm transition-colors ${
                p === page ? "border-ink bg-ink text-pearl" : "border-line bg-white text-ink-soft hover:border-gold"
              }`}
            >
              {faNum(p)}
            </Link>
          </span>
        );
      })}
      {page < totalPages ? (
        <Link href={buildHref(page + 1)} rel="next" className="grid size-9 place-items-center rounded-full border border-line bg-white text-ink-soft hover:border-gold" aria-label="صفحه بعد">
          <Icon name="chevronLeft" size={16} />
        </Link>
      ) : null}
    </nav>
  );
}

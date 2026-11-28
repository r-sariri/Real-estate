import type { ReactNode } from "react";
import { Icon } from "./icons";

export function AuthShell({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="container-lux py-10 sm:py-14">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[2rem] border border-line bg-white/80 shadow-soft lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-gold-soft/70 via-ice/60 to-white p-8 lg:flex">
          <div aria-hidden className="pointer-events-none absolute -top-16 -end-16 size-56 rounded-full bg-champagne/60 blur-3xl" />
          <div>
            <span className="grid size-10 place-items-center rounded-full border border-gold/40 bg-white/80 text-gold-deep">
              <Icon name="diamond" size={19} />
            </span>
            <h2 className="mt-6 font-display text-3xl leading-tight tracking-[0.12em]" dir="ltr">
              ZARRIN
            </h2>
            <p className="mt-2 text-[12.5px] leading-7 text-ink-soft">
              عضویت در زرّین: پیگیری سفارش‌ها، ذخیره نشانی‌ها و دسترسی به علاقه‌مندی‌ها.
            </p>
          </div>
          <ul className="space-y-3">
            {[
              { icon: "package" as const, text: "پیگیری وضعیت سفارش در هر مرحله" },
              { icon: "heart" as const, text: "ذخیره قطعه‌های مورد علاقه" },
              { icon: "gift" as const, text: "دسترسی به پیشنهادهای اعضا" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-2.5 text-[12px] text-ink-soft">
                <span className="grid size-7 place-items-center rounded-full bg-white/80 text-gold-deep">
                  <Icon name={item.icon} size={14} />
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-[11px] tracking-[0.22em] text-gold-deep uppercase">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
          <p className="mt-1.5 text-[12.5px] text-muted">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

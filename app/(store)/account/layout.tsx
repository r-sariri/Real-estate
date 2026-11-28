import type { ReactNode } from "react";
import { isStaff, requireUser } from "@/lib/auth";
import { AccountNav } from "@/components/account-nav";
import { Icon } from "@/components/icons";

export const metadata = { robots: { index: false, follow: false } };

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const user = await requireUser("/account");

  return (
    <div className="container-lux py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-line bg-white/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-gold-soft to-champagne text-base font-semibold text-gold-deep">
            {user.name.slice(0, 1)}
          </span>
          <div>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-[11.5px] text-muted" dir="ltr">{user.email}</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-gold-soft/60 px-3 py-1.5 text-[11px] text-gold-deep">
          <Icon name="shield" size={13} />
          {isStaff(user.role) ? "دسترسی مدیریت" : "مشتری زرّین"}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-start">
        <aside className="rounded-3xl border border-line bg-white/60 p-2.5">
          <AccountNav isAdmin={isStaff(user.role)} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/actions/auth";
import { getSettings } from "@/lib/settings";
import { AdminNav } from "@/components/admin/admin-nav";
import { Icon } from "@/components/icons";

export const metadata = {
  title: "پنل مدیریت",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();
  const settings = await getSettings();

  return (
    <div className="min-h-dvh bg-cream/40">
      <div className="container-lux py-5">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white/80 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full border border-gold/40 bg-gold-soft text-gold-deep">
              <Icon name="dashboard" size={17} />
            </span>
            <div>
              <p className="text-[13px] font-semibold">پنل مدیریت {settings.brandName}</p>
              <p className="text-[10.5px] text-muted">
                {user.name} — {user.role === "ADMIN" ? "مدیر کل" : "کارشناس"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] hover:border-gold">
              <Icon name="home" size={13} />
              مشاهده سایت
            </Link>
            <Link href="/account" className="hidden items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] hover:border-gold sm:flex">
              <Icon name="user" size={13} />
              حساب من
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[11px] text-pearl hover:bg-gold-deep">
                <Icon name="logout" size={13} />
                خروج
              </button>
            </form>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[235px_1fr] lg:items-start">
          <aside className="max-h-[65vh] overflow-y-auto rounded-2xl border border-line bg-white/60 p-2.5 lg:sticky lg:top-4 lg:max-h-none">
            <AdminNav />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { Icon } from "./icons";

const LINKS = [
  { href: "/account", label: "داشبورد", icon: "dashboard" as const },
  { href: "/account/orders", label: "سفارش‌ها", icon: "package" as const },
  { href: "/account/addresses", label: "نشانی‌ها", icon: "mapPin" as const },
  { href: "/account/wishlist", label: "علاقه‌مندی‌ها", icon: "heart" as const },
];

export function AccountNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="منوی حساب کاربری" className="space-y-1">
      {LINKS.map((link) => {
        const active = link.href === "/account" ? pathname === "/account" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-[12.5px] transition-colors ${
              active ? "bg-ink text-pearl" : "text-ink-soft hover:bg-white"
            }`}
          >
            <Icon name={link.icon} size={16} />
            {link.label}
          </Link>
        );
      })}

      {isAdmin ? (
        <Link href="/admin" className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-[12.5px] text-gold-deep hover:bg-white">
          <Icon name="settings" size={16} />
          پنل مدیریت
        </Link>
      ) : null}

      <form action={logoutAction} className="pt-1">
        <button type="submit" className="flex w-full items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-[12.5px] text-muted transition-colors hover:bg-danger/10 hover:text-danger">
          <Icon name="logout" size={16} />
          خروج از حساب
        </button>
      </form>
    </nav>
  );
}

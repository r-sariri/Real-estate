"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../icons";

const GROUPS: { title: string; items: { href: string; label: string; icon: React.ComponentProps<typeof Icon>["name"] }[] }[] = [
  {
    title: "فروش",
    items: [
      { href: "/admin", label: "نمای کلی", icon: "chart" },
      { href: "/admin/orders", label: "سفارش‌ها", icon: "package" },
      { href: "/admin/products", label: "محصولات", icon: "diamond" },
      { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: "tag" },
      { href: "/admin/collections", label: "کالکشن‌ها", icon: "image" },
      { href: "/admin/customers", label: "مشتریان", icon: "users" },
    ],
  },
  {
    title: "قیمت و بازاریابی",
    items: [
      { href: "/admin/pricing", label: "نرخ طلا و قیمت‌گذاری", icon: "gold" },
      { href: "/admin/coupons", label: "کدهای تخفیف", icon: "tag" },
      { href: "/admin/ads", label: "مدیریت تبلیغات", icon: "megaphone" },
      { href: "/admin/banners", label: "بنرهای صفحه اصلی", icon: "image" },
    ],
  },
  {
    title: "محتوا",
    items: [
      { href: "/admin/testimonials", label: "نظرات مشتریان", icon: "quote" },
      { href: "/admin/reviews", label: "بازبینی نظرات محصول", icon: "star" },
      { href: "/admin/blog", label: "مقالات", icon: "edit" },
    ],
  },
  {
    title: "سیستم",
    items: [
      { href: "/admin/settings", label: "تنظیمات سایت", icon: "settings" },
      { href: "/admin/audit", label: "گزارش رویدادها", icon: "receipt" },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="منوی مدیریت" className="space-y-4">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <p className="mb-1.5 px-3 text-[10px] tracking-[0.18em] text-muted uppercase">{group.title}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] transition-colors ${
                      active ? "bg-ink text-pearl" : "text-ink-soft hover:bg-white"
                    }`}
                  >
                    <Icon name={item.icon} size={15} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

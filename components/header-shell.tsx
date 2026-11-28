"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MAIN_NAV } from "@/lib/site";
import { faNum } from "@/lib/format";
import { Icon } from "./icons";

type HeaderProps = {
  brandName: string;
  brandLatin: string;
  announcement?: string;
  userName?: string | null;
  isAdmin?: boolean;
  cartCount: number;
  wishlistCount: number;
};

export function HeaderShell({ brandName, brandLatin, announcement, userName, isAdmin, cartCount, wishlistCount }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => searchInput.current?.focus(), 60);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(timer);
    };
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    setSearchOpen(false);
    setQuery("");
    router.push(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href.split("?")[0]}/`);

  return (
    <>
      {announcement ? (
        <div className="relative z-40 bg-ink text-pearl">
          <div className="container-lux flex items-center justify-center gap-2 py-2 text-center text-[11px] tracking-wide sm:text-xs">
            <Icon name="sparkle" size={13} className="text-champagne" />
            <span>{announcement}</span>
          </div>
        </div>
      ) : null}

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "border-b border-line/80 bg-pearl/85 shadow-[0_10px_30px_-24px_rgba(29,27,24,.6)] backdrop-blur-xl" : "bg-pearl/60 backdrop-blur-sm"
        }`}
      >
        <div className="container-lux flex h-16 items-center justify-between gap-3 lg:h-20">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={`${brandName} — صفحه اصلی`}>
            <span className="grid size-9 place-items-center rounded-full border border-gold/40 bg-gradient-to-br from-white to-gold-soft text-gold-deep transition-transform duration-500 group-hover:rotate-[18deg]">
              <Icon name="diamond" size={18} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl tracking-[0.22em] text-ink sm:text-[22px]" dir="ltr">
                {brandLatin}
              </span>
              <span className="mt-1 text-[10px] tracking-[0.3em] text-muted">{brandName}</span>
            </span>
          </Link>

          <nav aria-label="منوی اصلی" className="hidden items-center gap-0.5 lg:flex">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`relative rounded-full px-3 py-2 text-[13px] transition-colors ${
                  isActive(item.href) ? "text-gold-deep" : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-px origin-center bg-gold transition-transform duration-300 ${
                    isActive(item.href) ? "scale-x-100" : "scale-x-0"
                  }`}
                  aria-hidden
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid size-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-white hover:text-gold-deep"
              aria-label="جستجو در محصولات"
            >
              <Icon name="search" size={19} />
            </button>

            <Link
              href={userName ? "/account" : "/login"}
              className="hidden size-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-white hover:text-gold-deep sm:grid"
              aria-label={userName ? `حساب کاربری ${userName}` : "ورود به حساب"}
            >
              <Icon name="user" size={19} />
            </Link>

            <Link
              href="/account/wishlist"
              className="relative hidden size-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-white hover:text-gold-deep sm:grid"
              aria-label={`علاقه‌مندی‌ها${wishlistCount ? ` — ${wishlistCount} مورد` : ""}`}
            >
              <Icon name="heart" size={19} />
              {wishlistCount > 0 ? <Counter value={wishlistCount} /> : null}
            </Link>

            <Link
              href="/cart"
              className="relative grid size-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-white hover:text-gold-deep"
              aria-label={`سبد خرید${cartCount ? ` — ${cartCount} کالا` : ""}`}
            >
              <Icon name="cart" size={19} />
              {cartCount > 0 ? <Counter value={cartCount} /> : null}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid size-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-white hover:text-gold-deep lg:hidden"
              aria-label="باز کردن منو"
              aria-expanded={menuOpen}
            >
              <Icon name="menu" size={21} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-ink/35 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="منوی موبایل"
          className={`absolute inset-y-0 end-0 flex w-[86%] max-w-sm flex-col bg-pearl shadow-lift transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <span className="font-display text-lg tracking-[0.22em]" dir="ltr">{brandLatin}</span>
            <button type="button" onClick={() => setMenuOpen(false)} className="grid size-9 place-items-center rounded-full hover:bg-white" aria-label="بستن منو">
              <Icon name="close" size={20} />
            </button>
          </div>
          <nav aria-label="منوی موبایل" className="flex-1 overflow-y-auto px-3 py-4">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-ink-soft hover:bg-white hover:text-gold-deep"
              >
                {item.label}
                <Icon name="chevronLeft" size={16} className="opacity-40" />
              </Link>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
            <Link href={userName ? "/account" : "/login"} className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-white px-3 py-2.5 text-xs">
              <Icon name="user" size={16} /> {userName ? "حساب من" : "ورود"}
            </Link>
            <Link href="/account/wishlist" className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-white px-3 py-2.5 text-xs">
              <Icon name="heart" size={16} /> علاقه‌مندی‌ها
            </Link>
            {isAdmin ? (
              <Link href="/admin" className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-ink px-3 py-2.5 text-xs text-pearl">
                <Icon name="dashboard" size={16} /> پنل مدیریت
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24" role="dialog" aria-modal="true" aria-label="جستجو">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-xl rounded-3xl border border-line bg-pearl p-5 shadow-lift">
            <form onSubmit={submitSearch} className="flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3">
              <Icon name="search" size={18} className="text-muted" />
              <input
                ref={searchInput}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="نام محصول، دسته‌بندی یا کالکشن…"
                aria-label="عبارت جستجو"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted/70"
              />
              <button type="submit" className="rounded-full bg-ink px-4 py-1.5 text-xs text-pearl">جستجو</button>
            </form>
            <div className="mt-4">
              <p className="mb-2 text-[11px] tracking-[0.2em] text-muted uppercase">جستجوهای پرطرفدار</p>
              <div className="flex flex-wrap gap-2">
                {["گردنبند", "انگشتر الماس", "گوشواره", "النگو", "عروس"].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      router.push(`/shop?q=${encodeURIComponent(term)}`);
                    }}
                    className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-ink-soft hover:border-gold hover:text-gold-deep"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => setSearchOpen(false)} className="absolute end-4 top-4 grid size-8 place-items-center rounded-full hover:bg-white" aria-label="بستن جستجو">
              <Icon name="close" size={16} />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Counter({ value }: { value: number }) {
  return (
    <span className="absolute -end-0.5 -top-0.5 grid min-w-[18px] place-items-center rounded-full bg-gold-deep px-1 text-[10px] leading-[18px] font-semibold text-white">
      {faNum(value > 99 ? 99 : value)}
    </span>
  );
}

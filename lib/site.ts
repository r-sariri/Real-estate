/** Shared navigation / footer structure — one place to add a locale later. */

export const MAIN_NAV = [
  { href: "/", label: "خانه" },
  { href: "/shop", label: "فروشگاه" },
  { href: "/collections", label: "کالکشن‌ها" },
  { href: "/shop?sort=newest", label: "جدیدترین‌ها" },
  { href: "/shop?sort=popular", label: "پرفروش‌ترین‌ها" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس" },
] as const;

export const FOOTER_SUPPORT = [
  { href: "/contact", label: "تماس با ما" },
  { href: "/pages/shipping", label: "شیوه‌های ارسال" },
  { href: "/pages/returns", label: "بازگشت کالا" },
  { href: "/pages/faq", label: "پرسش‌های متداول" },
  { href: "/pages/tracking", label: "پیگیری سفارش" },
] as const;

export const FOOTER_SHOP = [
  { href: "/shop", label: "همه محصولات" },
  { href: "/collections", label: "کالکشن‌ها" },
  { href: "/shop?sort=newest", label: "تازه رسیده‌ها" },
  { href: "/shop?sort=popular", label: "محبوب‌ترین‌ها" },
  { href: "/blog", label: "مجله زرّین" },
] as const;

export const FOOTER_POLICIES = [
  { href: "/pages/authenticity", label: "اصالت و گارانتی" },
  { href: "/pages/privacy", label: "حریم خصوصی" },
  { href: "/pages/terms", label: "قوانین و مقررات" },
  { href: "/pages/pricing", label: "نحوه قیمت‌گذاری طلا" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "popular", label: "محبوب‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
] as const;

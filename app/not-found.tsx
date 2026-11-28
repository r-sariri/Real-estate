import Link from "next/link";
import { buttonStyles } from "@/components/ui";
import { Icon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="container-lux flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-gold-soft text-gold-deep">
        <Icon name="search" size={24} />
      </span>
      <p className="mt-5 text-[11px] tracking-[0.22em] text-muted uppercase">خطای ۴۰۴</p>
      <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">این صفحه پیدا نشد</h1>
      <p className="mt-3 max-w-md text-[13px] leading-7 text-ink-soft">
        ممکن است نشانی اشتباه باشد یا محصول از فروشگاه حذف شده باشد.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Link href="/" className={buttonStyles.primary}>بازگشت به خانه</Link>
        <Link href="/shop" className={buttonStyles.outline}>مشاهده محصولات</Link>
      </div>
    </div>
  );
}

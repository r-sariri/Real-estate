import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { Icon } from "@/components/icons";
import { buttonStyles } from "@/components/ui";
import Link from "next/link";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "راه‌های ارتباط با فروشگاه جواهرات زرّین: تلفن، ایمیل و پیام مستقیم.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="container-lux py-8 sm:py-10">
      <Breadcrumbs items={[{ name: "تماس با ما", href: "/contact" }]} />
      <header className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-semibold sm:text-3xl">تماس با زرّین</h1>
        <p className="mt-3 text-[13.5px] leading-7 text-ink-soft">
          برای مشاوره خرید، سفارش اختصاصی یا پیگیری سفارش با ما در ارتباط باشید. پاسخ‌گویی در روزهای
          کاری از ۱۰ تا ۱۹.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div className="space-y-3">
          {[
            { icon: "phone" as const, title: "تلفن", value: settings.phone, href: `tel:${settings.phone.replace(/[^\d+]/g, "")}` },
            { icon: "mail" as const, title: "ایمیل", value: settings.email, href: `mailto:${settings.email}` },
            { icon: "mapPin" as const, title: "نشانی", value: settings.address },
            { icon: "clock" as const, title: "ساعات پاسخ‌گویی", value: "شنبه تا پنجشنبه، ۱۰:۰۰ تا ۱۹:۰۰" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-line bg-white/70 p-4">
              <p className="flex items-center gap-2 text-[11.5px] font-medium text-ink">
                <Icon name={item.icon} size={15} className="text-gold-deep" />
                {item.title}
              </p>
              {item.href ? (
                <a href={item.href} className="mt-1 block text-[12.5px] text-ink-soft hover:text-gold-deep" dir={item.title === "تلفن" ? "ltr" : undefined}>
                  {item.value}
                </a>
              ) : (
                <p className="mt-1 text-[12.5px] leading-6 text-ink-soft">{item.value}</p>
              )}
            </div>
          ))}

          <div className="rounded-2xl border border-line bg-gradient-to-br from-gold-soft/50 to-ice/40 p-4">
            <p className="text-[12px] font-medium">پیگیری سریع سفارش</p>
            <p className="mt-1 text-[11px] leading-6 text-ink-soft">با شماره سفارش، وضعیت مرسوله را ببینید.</p>
            <Link href="/pages/tracking" className={`${buttonStyles.outline} mt-3 px-4 py-2 text-[11.5px]`}>
              پیگیری سفارش
            </Link>
          </div>
        </div>

        <section className="rounded-3xl border border-line bg-white/70 p-5 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold">ارسال پیام</h2>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}

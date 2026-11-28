import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { FOOTER_POLICIES, FOOTER_SHOP, FOOTER_SUPPORT } from "@/lib/site";
import { Icon } from "./icons";
import { NewsletterForm } from "./newsletter-form";

function Column({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold tracking-[0.18em] text-ink uppercase">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={`${title}-${link.href}`}>
            <Link href={link.href} className="text-[13px] text-ink-soft transition-colors hover:text-gold-deep">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function SiteFooter() {
  const settings = await getSettings();
  const socials = [
    { href: settings.instagram, label: "اینستاگرام", icon: "instagram" as const },
    { href: settings.telegram, label: "تلگرام", icon: "telegram" as const },
    { href: settings.whatsapp, label: "واتس‌اپ", icon: "whatsapp" as const },
  ].filter((item) => item.href);

  return (
    <footer className="mt-24 border-t border-silver/60 bg-gradient-to-b from-cream/70 via-pearl to-pearl">
      <div className="container-lux py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label={settings.brandName}>
              <span className="grid size-9 place-items-center rounded-full border border-gold/40 bg-white text-gold-deep">
                <Icon name="diamond" size={18} />
              </span>
              <span className="font-display text-xl tracking-[0.22em]" dir="ltr">{settings.brandLatin}</span>
            </Link>
            <p className="mt-4 max-w-sm text-[13px] leading-7 text-ink-soft">{settings.tagline}. هر قطعه در کارگاه زرّین با دست ساخته، کنترل کیفیت و با گواهی اصالت ارسال می‌شود.</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label={social.label}
                  className="grid size-9 place-items-center rounded-full border border-line bg-white text-ink-soft transition-colors hover:border-gold hover:text-gold-deep"
                >
                  <Icon name={social.icon} size={17} />
                </a>
              ))}
            </div>
          </div>

          <Column title="فروشگاه" links={FOOTER_SHOP} />
          <Column title="پشتیبانی" links={FOOTER_SUPPORT} />
          <Column title="قوانین و سیاست‌ها" links={FOOTER_POLICIES} />
        </div>

        <div className="liquid-glass mt-12 grid gap-8 rounded-3xl p-6 sm:p-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-lg font-semibold">عضویت در خبرنامه زرّین</h2>
            <p className="mt-2 text-[13px] leading-7 text-ink-soft">از کالکشن‌های جدید، پیشنهادهای ویژه و مقالات تخصصی طلا باخبر شوید.</p>
          </div>
          <NewsletterForm compact />
        </div>

        <div className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <ContactItem icon="phone" title="تلفن پشتیبانی" value={settings.phone} href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} />
          <ContactItem icon="mail" title="ایمیل" value={settings.email} href={`mailto:${settings.email}`} />
          <ContactItem icon="mapPin" title="نشانی" value={settings.address} />
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-ink">
              <Icon name="shield" size={15} className="text-gold-deep" />
              تضمین خرید امن
            </p>
            <p className="text-[12px] leading-6 text-ink-soft">گواهی اصالت، بازگشت ۷ روزه، ارسال بیمه‌شده و پرداخت امن.</p>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
              <Icon name="lock" size={13} /> درگاه پرداخت امن ایرانی
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-[11px] text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.brandName}. تمام حقوق محفوظ است.</p>
          <p className="flex items-center gap-2">
            <Icon name="globe" size={13} />
            طراحی و توسعه برای بازار ایران — قیمت‌ها بر اساس نرخ روز طلا محاسبه می‌شود.
          </p>
        </div>
      </div>
    </footer>
  );
}

function ContactItem({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ComponentProps<typeof Icon>["name"];
  title: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-ink">
        <Icon name={icon} size={15} className="text-gold-deep" />
        {title}
      </p>
      <p className="text-[12px] leading-6 text-ink-soft">{value}</p>
    </>
  );
  return href ? <a href={href} className="hover:text-gold-deep">{content}</a> : <div>{content}</div>;
}

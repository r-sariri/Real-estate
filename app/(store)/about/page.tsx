import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "درباره زرّین",
  description: "داستان کارگاه زرّین: دو دهه ساخت جواهرات دست‌ساز با طلای ۱۸ عیار، عیارسنجی مستقل و طراحی ایرانی.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="container-lux py-8 sm:py-10">
      <Breadcrumbs items={[{ name: "درباره ما", href: "/about" }]} />

      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-gold-deep uppercase">داستان ما</p>
          <h1 className="mt-3 text-3xl leading-tight font-semibold sm:text-4xl">
            بیست سال، یک وسواس: <span className="gold-text">دقت</span>
          </h1>
          <p className="mt-4 text-[13.5px] leading-8 text-ink-soft">
            {settings.brandName} در سال ۱۳۸۴ با یک میز کار کوچک در تهران شروع شد. از همان روز اول
            تصمیم گرفتیم چیزی بسازیم که سال‌ها بماند؛ نه فقط از نظر جنس، بلکه از نظر طراحی.
          </p>
          <p className="mt-3 text-[13.5px] leading-8 text-ink-soft">
            امروز هر قطعه پیش از رسیدن به دست شما از چهار مرحله کنترل می‌گذرد: کنترل عیار، کنترل وزن،
            کنترل پرداخت سطح و کنترل قفل و اتصالات. نتیجه، قطعه‌ای است که می‌توانید با خیال راحت هر روز
            بپوشید.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { value: "۲۰+", label: "سال تجربه" },
              { value: "۱۸", label: "عیار استاندارد" },
              { value: "۷", label: "روز ضمانت بازگشت" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-line bg-white/70 px-3 py-3 text-center">
                <p className="text-lg font-semibold text-gold-deep">{stat.value}</p>
                <p className="text-[10.5px] text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <img
          src="/craft.svg"
          alt="کارگاه ساخت جواهرات زرّین"
          width={900}
          height={700}
          className="w-full rounded-[2.5rem] border border-white/70 object-cover shadow-lift"
        />
      </section>

      <section className="mt-16">
        <Reveal>
          <SectionHeading eyebrow="اصول کار" title="چهار چیزی که هرگز از آن‌ها نمی‌گذریم" align="center" />
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "shield" as const, title: "عیار قابل اثبات", text: "هر قطعه با گواهی عیار و امکان عیارسنجی مستقل." },
            { icon: "scale" as const, title: "قیمت شفاف", text: "ریز قیمت طلا، اجرت، سود و مالیات روی صفحه محصول." },
            { icon: "hammer" as const, title: "ساخت دست‌ساز", text: "پرداخت نهایی با دست انجام می‌شود، نه فقط ماشین." },
            { icon: "leaf" as const, title: "تأمین مسئولانه", text: "طلای مصرفی از منابع شناسنامه‌دار تأمین می‌شود." },
          ].map((item) => (
            <Reveal key={item.title}>
              <div className="h-full rounded-3xl border border-line bg-white/70 p-5">
                <span className="grid size-10 place-items-center rounded-full bg-gold-soft text-gold-deep">
                  <Icon name={item.icon} size={18} />
                </span>
                <h3 className="mt-3 text-[13px] font-semibold">{item.title}</h3>
                <p className="mt-1.5 text-[11.5px] leading-6 text-muted">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[2rem] border border-line bg-gradient-to-l from-ice/60 via-white to-gold-soft/50 p-7 text-center sm:p-10">
        <h2 className="text-xl font-semibold sm:text-2xl">سفارش اختصاصی دارید؟</h2>
        <p className="mx-auto mt-2 max-w-xl text-[12.5px] leading-7 text-ink-soft">
          اگر طرحی در ذهن دارید، با ما در میان بگذارید. امکان ساخت سفارشی با انتخاب عیار، وزن و سنگ وجود دارد.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <ButtonLink href="/contact" variant="gold">مشاوره سفارش اختصاصی</ButtonLink>
          <ButtonLink href="/shop" variant="outline">مشاهده محصولات</ButtonLink>
        </div>
      </section>
    </div>
  );
}

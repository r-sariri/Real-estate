import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getFeaturedProducts, getWishlistIds } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { formatDate } from "@/lib/format";
import { AdSlot } from "@/components/ad-slot";
import { CollectionCard, ProductCard } from "@/components/product-card";
import { GoldRateCard } from "@/components/gold-rate-card";
import { TestimonialsCarousel } from "@/components/testimonials";
import { NewsletterForm } from "@/components/newsletter-form";
import { Reveal } from "@/components/reveal";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "زرّین | جواهرات دست‌ساز با طلای ۱۸ عیار",
  description:
    "زرّین؛ فروشگاه آنلاین جواهرات و طلای ۱۸ عیار با طراحی دست‌ساز، گارانتی اصالت و ارسال بیمه‌شده به سراسر ایران.",
  alternates: { canonical: "/" },
};

const TRUST = [
  { icon: "shield" as const, title: "گارانتی اصالت", text: "همراه با گواهی عیار و فاکتور رسمی" },
  { icon: "truck" as const, title: "ارسال بیمه‌شده", text: "تحویل امن به سراسر ایران" },
  { icon: "hammer" as const, title: "ساخت دست‌ساز", text: "در کارگاه اختصاصی زرّین" },
  { icon: "gift" as const, title: "بسته‌بندی هدیه", text: "جعبه چرمی و کارت دست‌نویس" },
];

export default async function HomePage() {
  const [settings, user, collections, featured, testimonials, banners] = await Promise.all([
    getSettings(),
    getCurrentUser(),
    prisma.collection.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { sortOrder: "asc" },
      take: 8,
      select: {
        slug: true,
        name: true,
        description: true,
        image: true,
        _count: { select: { products: true } },
      },
    }),
    getFeaturedProducts(8),
    prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, take: 8 }),
    prisma.banner.findMany({
      where: {
        isActive: true,
        placement: "HOME_STRIP",
        OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }],
      },
      orderBy: { sortOrder: "asc" },
      take: 1,
    }),
  ]);
  const wishlist = await getWishlistIds(user?.id);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="lux-backdrop relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="animate-float absolute -top-24 start-[-6rem] size-72 rounded-full bg-champagne/40 blur-3xl" />
          <span className="animate-float absolute top-1/3 end-[-8rem] size-80 rounded-full bg-ice/60 blur-3xl [animation-delay:-3s]" />
          <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-gold/30 to-transparent" />
        </div>

        <div className="container-lux relative grid gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/70 px-3.5 py-1.5 text-[11px] tracking-wide text-gold-deep backdrop-blur">
              <Icon name="sparkle" size={13} />
              کالکشن ۱۴۰۴ · ساخت دست در تهران
            </p>
            <h1 className="mt-5 text-[2.15rem] leading-[1.25] font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]">
              درخششی که
              <br />
              <span className="gold-text">به یادگار می‌ماند</span>
            </h1>
            <p className="mt-5 max-w-xl text-[13.5px] leading-7 text-ink-soft sm:text-[15px] sm:leading-8">
              {settings.tagline}. هر قطعه با نرخ روز طلا، اجرت شفاف و گواهی اصالت عرضه می‌شود؛
              برای روزهای خاص و روزهای ساده.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/shop" variant="gold" className="px-7 py-3.5">
                کاوش کالکشن
                <Icon name="arrowLeft" size={17} />
              </ButtonLink>
              <ButtonLink href="/about" variant="outline" className="px-7 py-3.5">
                داستان زرّین
              </ButtonLink>
            </div>
            <div className="mt-8 max-w-md">
              <GoldRateCard />
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-full max-w-[520px]">
              <div aria-hidden className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-white/70 via-gold-soft/40 to-ice/50 blur-2xl" />
              <img
                src="/hero.svg"
                alt="گردنبند طلای دست‌ساز زرّین با آویز قطره‌ای"
                width={900}
                height={900}
                fetchPriority="high"
                decoding="async"
                className="relative aspect-square w-full rounded-[2.5rem] border border-white/70 object-cover shadow-lift"
              />
              <div className="glass absolute -bottom-4 start-2 flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-soft sm:start-4">
                <span className="grid size-8 place-items-center rounded-full bg-success/10 text-success">
                  <Icon name="shield" size={16} />
                </span>
                <div>
                  <p className="text-[11px] font-medium text-ink">گواهی اصالت و عیار</p>
                  <p className="text-[10px] text-muted">همراه هر سفارش</p>
                </div>
              </div>
              <div className="glass absolute -top-3 end-2 hidden items-center gap-2 rounded-2xl px-3 py-2 shadow-soft sm:flex">
                <Icon name="diamond" size={14} className="text-gold-deep" />
                <span className="text-[11px] text-ink-soft">دست‌ساز</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Trust strip ---------- */}
      <section aria-label="مزیت‌های خرید" className="border-y border-line/70 bg-white/60">
        <div className="container-lux grid grid-cols-2 gap-4 py-6 lg:grid-cols-4">
          {TRUST.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-soft/70 text-gold-deep">
                <Icon name={item.icon} size={18} />
              </span>
              <div>
                <p className="text-[12.5px] font-medium text-ink">{item.title}</p>
                <p className="text-[11px] text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Sponsored (top) ---------- */}
      <div className="container-lux pt-10 empty:hidden">
        <AdSlot placement="HOME_TOP" ratio="wide" />
      </div>

      {/* ---------- Featured collections ---------- */}
      <section className="container-lux py-14 sm:py-16">
        <Reveal>
          <SectionHeading
            eyebrow="کالکشن‌ها"
            title="برای هر لحظه، یک انتخاب"
            description="از گردنبندهای ظریف روزمره تا ست‌های عروس؛ همه با طلای ۱۸ عیار و پرداخت دستی."
            action={
              <ButtonLink href="/collections" variant="ghost">
                همه کالکشن‌ها
                <Icon name="arrowLeft" size={15} />
              </ButtonLink>
            }
          />
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection, index) => (
            <Reveal key={collection.slug} delay={index * 60}>
              <CollectionCard collection={collection} count={collection._count.products} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Featured products ---------- */}
      <section className="bg-gradient-to-b from-white/70 to-transparent py-14 sm:py-16">
        <div className="container-lux">
          <Reveal>
            <SectionHeading
              eyebrow="منتخب زرّین"
              title="قطعه‌های محبوب این فصل"
              description="قیمت هر قطعه بر اساس نرخ روز طلا، وزن و اجرت ساخت به‌صورت شفاف محاسبه می‌شود."
              action={
                <ButtonLink href="/shop" variant="ghost">
                  همه محصولات
                  <Icon name="arrowLeft" size={15} />
                </ButtonLink>
              }
            />
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featured.map((product, index) => (
              <Reveal key={product.id} delay={index * 50}>
                <ProductCard product={product} wishlisted={wishlist.has(product.id)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Sponsored (middle) ---------- */}
      <div className="container-lux empty:hidden">
        <AdSlot placement="HOME_MIDDLE" ratio="wide" />
      </div>

      {/* ---------- Brand story ---------- */}
      <section className="container-lux py-14 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <img
                src="/craft.svg"
                alt="کارگاه ساخت جواهرات زرّین — حلقه طلا با نگین"
                width={900}
                height={700}
                loading="lazy"
                decoding="async"
                className="w-full rounded-[2.5rem] border border-white/70 object-cover shadow-lift"
              />
              <div className="glass absolute -bottom-5 end-4 rounded-2xl px-4 py-3 shadow-soft">
                <p className="text-[10px] tracking-wide text-muted">از سال ۱۳۸۴</p>
                <p className="text-[13px] font-semibold">۲۰ سال تجربه در ساخت</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="mb-2 flex items-center gap-2 text-[11px] tracking-[0.22em] text-gold-deep uppercase">
              <span className="inline-block h-px w-6 bg-gold/70" aria-hidden />
              هنر ساخت
            </p>
            <h2 className="text-2xl leading-tight font-semibold sm:text-3xl lg:text-[2rem]">
              هر قطعه، حاصل دقتِ دست و صبرِ چشم
            </h2>
            <p className="mt-4 text-[13.5px] leading-7 text-ink-soft sm:text-[15px] sm:leading-8">
              در کارگاه زرّین، طراحی از یک طرح دستی شروع می‌شود و با قالب‌گیری، پرداخت و کنترل کیفیت
              به پایان می‌رسد. طلای مصرفی از منابع معتبر تأمین می‌شود و عیار هر قطعه پیش از عرضه
              آزمایش می‌شود.
            </p>
            <ul className="mt-6 space-y-3.5">
              {[
                { title: "طلای ۱۸ عیار با عیارسنجی مستقل", text: "گواهی عیار همراه فاکتور رسمی ارسال می‌شود." },
                { title: "اجرت شفاف و قابل بررسی", text: "ریز قیمت طلا، اجرت، سود و مالیات در صفحه محصول نمایش داده می‌شود." },
                { title: "ضمانت بازگشت ۷ روزه", text: "اگر قطعه مطابق توضیحات نبود، بدون سؤال بازمی‌گردانیم." },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-deep">
                    <Icon name="check" size={13} />
                  </span>
                  <div>
                    <p className="text-[13px] font-medium">{item.title}</p>
                    <p className="text-[11.5px] leading-6 text-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <ButtonLink href="/about" variant="primary" className="mt-7">
              درباره کارگاه زرّین
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* ---------- Banner strip (admin managed) ---------- */}
      {banners[0] ? (
        <section className="container-lux">
          <Link
            href={banners[0].ctaUrl ?? "/shop"}
            className="group relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-[2rem] border border-gold/25 bg-gradient-to-l from-gold-soft/70 via-white to-ice/60 p-7 sm:flex-row sm:items-center sm:p-9"
          >
            <div>
              <p className="text-[11px] tracking-[0.2em] text-gold-deep uppercase">پیشنهاد ویژه</p>
              <h2 className="mt-2 text-xl font-semibold sm:text-2xl">{banners[0].title}</h2>
              {banners[0].subtitle ? <p className="mt-1.5 text-[13px] text-ink-soft">{banners[0].subtitle}</p> : null}
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-pearl transition-colors group-hover:bg-gold-deep">
              {banners[0].ctaLabel ?? "مشاهده"}
              <Icon name="arrowLeft" size={16} />
            </span>
          </Link>
        </section>
      ) : null}

      {/* ---------- Testimonials ---------- */}
      <section className="container-lux py-14 sm:py-16">
        <Reveal>
          <SectionHeading
            eyebrow="تجربه مشتریان"
            title="از زبان کسانی که انتخاب کردند"
            description="بازخوردهای واقعی مشتریان زرّین پس از دریافت سفارش."
            align="center"
          />
        </Reveal>
        <TestimonialsCarousel items={testimonials} />
      </section>

      {/* ---------- Newsletter ---------- */}
      <section className="container-lux pb-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-gradient-to-br from-ice/70 via-white to-gold-soft/70 p-8 sm:p-12">
            <div aria-hidden className="pointer-events-none absolute -top-16 end-[-4rem] size-64 rounded-full bg-champagne/50 blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <p className="text-[11px] tracking-[0.22em] text-gold-deep uppercase">خبرنامه زرّین</p>
                <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">اولین نفر از کالکشن‌های جدید باخبر شوید</h2>
                <p className="mt-3 max-w-xl text-[13.5px] leading-7 text-ink-soft">
                  ماهی یک ایمیل؛ معرفی قطعه‌های تازه، راهنمای نگهداری طلا و پیشنهادهای ویژه اعضا.
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
                  <Icon name="lock" size={12} /> ایمیل شما محفوظ می‌ماند و هر زمان قابل لغو است.
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </Reveal>
      </section>

      <div className="container-lux pb-4 text-center text-[11px] text-muted">
        <p>آخرین به‌روزرسانی محتوا: {formatDate(new Date())}</p>
      </div>
    </>
  );
}

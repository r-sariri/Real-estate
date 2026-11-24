import { PageHero } from '../components/layout/PageHero';
import { ServicesSection } from '../components/home/ServicesSection';
import { CtaBanner } from '../components/home/CtaBanner';
import { Reveal } from '../components/ui/Reveal';
import './pages.css';

const steps = [
  {
    title: 'یک گفت‌وگو',
    text: 'با این شروع می‌کنیم که می‌خواهید ملک چه کاری برای شما بکند — زندگی، سرمایه‌گذاری یا هر دو.',
  },
  {
    title: 'جستجو و انتخاب',
    text: 'فهرستی دست‌چین، شامل خانه‌هایی که به‌صورت عمومی عرضه نشده‌اند.',
  },
  {
    title: 'قرارداد و پس از آن',
    text: 'مذاکره، بررسی‌های حقوقی و معرفی‌ها، سال‌ها پس از تحویل کلید.',
  },
];

export function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="کار ما"
        title="مشاوره در هر مرحله"
        lede="چه نخستین خانه را می‌خرید و چه پرتفوی خود را بازآرایی می‌کنید، خدمات ما برای استفاده در کنار هم — یا دقیقاً همان‌جا که لازم دارید — طراحی شده‌اند."
        imageId="1600607687939-ce8a6c25118c"
        imageAlt="فضای داخلی مینیمال با پنجره‌های سرتاسری"
      />
      <ServicesSection />

      <section className="section section--sand process" aria-labelledby="process-title">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">شیوه کار ما</span>
            <h2 id="process-title" className="section-title">
              سه قدم، بدون غافلگیری
            </h2>
          </div>
          <div className="process__grid">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 80}>
                <article className="process__step">
                  <span className="process__index">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="process__title">{step.title}</h3>
                  <p className="process__text">{step.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

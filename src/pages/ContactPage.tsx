import { PageHero } from '../components/layout/PageHero';
import { InquiryForm } from '../components/forms/InquiryForm';
import { Icon } from '../components/ui/Icon';
import { CONTACT } from '../components/layout/nav';
import './contact.css';

export function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="تماس"
        title="گفت‌وگو را شروع کنیم"
        lede="چه در حال خرید باشید، چه فروش یا فقط سنجش بازار، یک مشاور حداکثر تا یک روز کاری شخصاً پاسخ می‌دهد."
        imageId="1600607688960-e095ff83135c"
        imageAlt="فضای داخلی آرام با نور طبیعی و جزئیات معماری"
      />

      <section className="section contact" aria-labelledby="contact-title">
        <div className="container contact__grid">
          <div className="contact__form">
            <span className="eyebrow">درخواست</span>
            <h2 id="contact-title" className="section-title contact__title">
              بگویید در ذهن چه دارید
            </h2>
            <p className="section-lede">
              چند جزئیات برای شروع کافی است. اگر ملکی در ذهن دارید، نامش را بگویید — بقیه‌اش با ما.
            </p>
            <InquiryForm mode="contact" submitLabel="ارسال درخواست" />
          </div>

          <aside className="contact__aside">
            <div className="contact-card">
              <h3 className="contact-card__title">دفتر</h3>
              <address className="contact-card__address">
                {CONTACT.address[0]}
                <br />
                {CONTACT.address[1]}
              </address>
              <p className="contact-card__meta">
                <Icon name="clock" size={15} strokeWidth={1.6} />
                {CONTACT.hours}
              </p>
              <a
                className="link-arrow contact-card__link"
                href="https://maps.google.com/?q=1420+Westlake+Drive+Austin+TX+78746"
                target="_blank"
                rel="noreferrer"
              >
                مسیریابی
                <Icon name="arrow-up-right" size={14} />
              </a>
            </div>

            <div className="contact-card contact-card--navy">
              <h3 className="contact-card__title">تماس مستقیم</h3>
              <a className="contact-card__line" href={CONTACT.phoneHref}>
                <Icon name="phone" size={16} strokeWidth={1.6} />
                <span dir="ltr">{CONTACT.phone}</span>
              </a>
              <a className="contact-card__line" href={CONTACT.emailHref}>
                <Icon name="mail" size={16} strokeWidth={1.6} />
                <span dir="ltr">{CONTACT.email}</span>
              </a>
              <p className="contact-card__note">
                <Icon name="clock" size={14} strokeWidth={1.6} />
                در ساعات کاری معمولاً تا ۲ ساعت پاسخ می‌دهیم.
              </p>
            </div>

            <div className="contact-card contact-card--quote">
              <p className="contact-card__quote">
                «خانه درست به‌ندرت نخستین خانه‌ای است که می‌بینید. همان است که مدام به آن فکر می‌کنید.»
              </p>
              <p className="contact-card__attribution">دانیل مورگان · مدیرعامل</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

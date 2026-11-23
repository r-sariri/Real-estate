import { PageHero } from '../components/layout/PageHero';
import { InquiryForm } from '../components/forms/InquiryForm';
import { Icon } from '../components/ui/Icon';
import { CONTACT } from '../components/layout/nav';
import './contact.css';

export function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s start a conversation"
        lede="Whether you are buying, selling or simply weighing up the market, an advisor will respond personally within one business day."
        imageId="1600607688960-e095ff83135c"
        imageAlt="Quiet interior with natural light and architectural detailing"
      />

      <section className="section contact" aria-labelledby="contact-title">
        <div className="container contact__grid">
          <div className="contact__form">
            <span className="eyebrow">Enquiry</span>
            <h2 id="contact-title" className="section-title contact__title">
              Tell us what you have in mind
            </h2>
            <p className="section-lede">
              A few details are enough to start. If you already have a property in mind, mention it — we will do the
              rest.
            </p>
            <InquiryForm mode="contact" submitLabel="Send Enquiry" />
          </div>

          <aside className="contact__aside">
            <div className="contact-card">
              <h3 className="contact-card__title">Office</h3>
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
                Get directions
                <Icon name="arrow-up-right" size={14} />
              </a>
            </div>

            <div className="contact-card contact-card--navy">
              <h3 className="contact-card__title">Direct</h3>
              <a className="contact-card__line" href={CONTACT.phoneHref}>
                <Icon name="phone" size={16} strokeWidth={1.6} />
                {CONTACT.phone}
              </a>
              <a className="contact-card__line" href={CONTACT.emailHref}>
                <Icon name="mail" size={16} strokeWidth={1.6} />
                {CONTACT.email}
              </a>
              <p className="contact-card__note">
                <Icon name="clock" size={14} strokeWidth={1.6} />
                Typically responds within 2 hours during office hours.
              </p>
            </div>

            <div className="contact-card contact-card--quote">
              <p className="contact-card__quote">
                “The right home is rarely the first one you see. It is the one you keep thinking about.”
              </p>
              <p className="contact-card__attribution">Daniel Morgan · Managing Director</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

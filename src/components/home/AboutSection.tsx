import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Reveal } from '../ui/Reveal';
import './AboutSection.css';

type AboutSectionProps = {
  ctaLabel?: string;
  ctaTo?: string;
};

export function AboutSection({ ctaLabel = 'Learn More', ctaTo = '/about' }: AboutSectionProps = {}) {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container about__grid">
        <Reveal className="about__copy">
          <span className="eyebrow">About Us</span>
          <h2 id="about-title" className="section-title about__title">
            Who We Are
          </h2>
          <div className="about__body">
            <p>
              At Horizon Properties, we connect people with extraordinary homes and smart investments. Integrity,
              transparency, and client satisfaction are at the heart of everything we do.
            </p>
            <p>
              For more than fifteen years, our advisors have guided buyers, sellers and investors through the most
              considered decisions of their lives — from first acquisitions to landmark estates.
            </p>
          </div>
          <Button to={ctaTo} variant="primary">
            {ctaLabel}
          </Button>
        </Reveal>

        <Reveal delay={120} className="about__media">
          <figure className="about__figure about__figure--main">
            <Img
              id="1600596542815-ffad4c1539a9"
              alt="Modern two-storey residence with a lit pool terrace at dusk"
              sizes="(max-width: 900px) 92vw, (max-width: 1440px) 42vw, 600px"
            />
          </figure>
          <figure className="about__figure about__figure--side">
            <Img
              id="1600585154340-be6161a56a0c"
              alt="Luxury home exterior with landscaped gardens"
              sizes="(max-width: 900px) 40vw, 24vw"
            />
          </figure>
          <Link to="/properties" className="about__badge" aria-label="Browse our properties">
            <Icon name="arrow-up-right" size={20} strokeWidth={1.6} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

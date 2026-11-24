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

export function AboutSection({ ctaLabel = 'بیشتر بدانید', ctaTo = '/about' }: AboutSectionProps = {}) {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container about__grid">
        <Reveal className="about__copy">
          <span className="eyebrow">درباره ما</span>
          <h2 id="about-title" className="section-title about__title">
            ما چه کسانی هستیم
          </h2>
          <div className="about__body">
            <p>
              در املاک افق، آدم‌ها را به خانه‌های استثنایی و سرمایه‌گذاری‌های هوشمند وصل می‌کنیم. صداقت، شفافیت و
              رضایت مشتری قلب هر کاری است که انجام می‌دهیم.
            </p>
            <p>
              بیش از پانزده سال است که مشاوران ما خریداران، فروشندگان و سرمایه‌گذاران را در سنجیده‌ترین تصمیم‌های
              زندگی‌شان همراهی می‌کنند — از نخستین خرید تا عمارت‌های شاخص.
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
              alt="اقامتگاه مدرن دو طبقه با تراس استخری روشن در گرگ‌ومیش"
              sizes="(max-width: 900px) 92vw, (max-width: 1440px) 42vw, 600px"
            />
          </figure>
          <figure className="about__figure about__figure--side">
            <Img
              id="1600585154340-be6161a56a0c"
              alt="نمای بیرونی خانه لوکس با باغ‌های طراحی‌شده"
              sizes="(max-width: 900px) 40vw, 24vw"
            />
          </figure>
          <Link to="/properties" className="about__badge" aria-label="مشاهده املاک ما">
            <Icon name="arrow-up-right" size={20} strokeWidth={1.6} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { services } from '../../data/services';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Reveal } from '../ui/Reveal';
import './ServicesSection.css';

export function ServicesSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="section services" id="services" aria-labelledby="services-title">
      <div className="container services__grid">
        <div className="services__aside">
          <Reveal className="services__head">
            <span className="eyebrow">خدمات</span>
            <h2 id="services-title" className="section-title">
              تخصص در تمام جزئیات
            </h2>
            <p className="section-lede">
              از خرید تا آخرین تکه مبلمان، کار ما تمام مسیر داشتن یک خانه استثنایی را در بر می‌گیرد — یا ساختن
              مجموعه‌ای از آن‌ها.
            </p>
          </Reveal>

          <Reveal delay={140} className="services__preview">
            <div className="services__frames">
              {services.map((service, index) => (
                <figure key={service.slug} className={`services__frame${index === active ? ' is-active' : ''}`}>
                  <Img
                    id={service.imageId}
                    alt={index === active ? service.imageAlt : ''}
                    sizes="(max-width: 900px) 92vw, 34vw"
                  />
                </figure>
              ))}
            </div>
            <p className="services__caption">
              <span aria-hidden="true" />
              {services[active].title}
            </p>
          </Reveal>
        </div>

        <div className="services__list">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 45}>
              <Link
                to="/services"
                className="service-row"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
              >
                <span className="service-row__index">{String(index + 1).padStart(2, '0')}</span>
                <span className="service-row__main">
                  <span className="service-row__title">{service.title}</span>
                  <span className="service-row__desc">{service.description}</span>
                </span>
                <span className="service-row__thumb" aria-hidden="true">
                  <Img id={service.imageId} alt="" sizes="72px" widths={[160, 240]} />
                </span>
                <span className="service-row__arrow" aria-hidden="true">
                  <Icon name="arrow-up-right" size={16} strokeWidth={1.6} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

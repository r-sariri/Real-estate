import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAgent } from '../data/agents';
import { PROPERTY_TYPE_LABELS, formatPrice, locationLabel } from '../data/properties';
import { listSimilar } from '../data/repository';
import type { InquiryMode, Property } from '../data/types';
import { useProperty } from '../hooks/useProperties';
import { useFavorites } from '../store/FavoritesContext';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Img } from '../components/ui/Img';
import { Reveal } from '../components/ui/Reveal';
import { PropertyCard } from '../components/property/PropertyCard';
import { PropertyGallery } from '../components/property/PropertyGallery';
import { InquiryModal } from '../components/property/InquiryModal';
import { NotFound } from './NotFound';
import './pages.css';
import './detail.css';

export function PropertyDetailPage() {
  const { slug } = useParams();
  const { property, loading } = useProperty(slug);
  const { isFavorite, toggle } = useFavorites();
  const [inquiry, setInquiry] = useState<InquiryMode | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    listSimilar(slug, 3).then((result) => {
      if (active) setSimilar(result);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (property) document.title = `${property.name} — املاک افق`;
  }, [property]);

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="container">
          <div className="skeleton detail-loading__bar" />
          <div className="skeleton detail-loading__hero" />
        </div>
      </div>
    );
  }

  if (!property) return <NotFound />;

  const agent = getAgent(property.agentId);
  const saved = isFavorite(property.slug);
  const listedDate = new Date(property.listedAt);
  const listed = `${listedDate.toLocaleDateString('fa-IR', { month: 'long' })} ${listedDate.toLocaleDateString('fa-IR', { year: 'numeric' })}`;
  const typeLabel = PROPERTY_TYPE_LABELS[property.type];

  const specs = [
    { icon: 'bed' as const, value: property.beds.toLocaleString('fa-IR'), label: 'اتاق خواب' },
    { icon: 'bath' as const, value: property.baths.toLocaleString('fa-IR'), label: 'سرویس بهداشتی' },
    {
      icon: 'area' as const,
      value: Math.round(property.sqft * 0.092903).toLocaleString('fa-IR'),
      label: 'متر مربع',
    },
    { icon: 'home' as const, value: property.lot, label: 'مساحت زمین' },
  ];

  return (
    <div className="detail-page">
      <header className="detail-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="مسیر صفحه">
            <Link to="/">خانه</Link>
            <span aria-hidden="true">/</span>
            <Link to="/properties">املاک</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{property.name}</span>
          </nav>

          <div className="detail-hero__row">
            <div className="detail-hero__main">
              <span className="detail-hero__type">
                {typeLabel} · آماده فروش
              </span>
              <h1 className="detail-hero__title">{property.name}</h1>
              <p className="detail-hero__loc">
                <Icon name="pin" size={15} strokeWidth={1.6} />
                {locationLabel(property)}
              </p>
            </div>
            <div className="detail-hero__aside">
              <p className="detail-hero__price">{formatPrice(property.price)}</p>
              <button
                type="button"
                className={`detail-hero__save${saved ? ' is-saved' : ''}`}
                aria-pressed={saved}
                onClick={() => toggle(property.slug)}
              >
                <Icon name="heart" size={16} strokeWidth={1.6} />
                {saved ? 'ذخیره‌شده' : 'ذخیره'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <PropertyGallery property={property} />
      </div>

      <div className="container detail-body">
        <div className="detail-main">
          <ul className="detail-specs">
            {specs.map((spec) => (
              <li key={spec.label} className="detail-spec">
                <span className="detail-spec__icon">
                  <Icon name={spec.icon} size={20} strokeWidth={1.4} />
                </span>
                <span className="detail-spec__value">{spec.value}</span>
                <span className="detail-spec__label">{spec.label}</span>
              </li>
            ))}
          </ul>

          <section className="detail-section" aria-labelledby="about-property">
            <h2 id="about-property" className="detail-section__title">
              درباره این ملک
            </h2>
            <p className="detail-meta">
              ساخت {property.year.toLocaleString('fa-IR', { useGrouping: false })} · فهرست‌شده {listed} · {typeLabel}
            </p>
            <div className="detail-copy">
              {property.description.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="detail-section" aria-labelledby="key-features">
            <h2 id="key-features" className="detail-section__title">
              ویژگی‌های کلیدی
            </h2>
            <ul className="detail-features">
              {property.highlights.map((feature) => (
                <li key={feature}>
                  <Icon name="check" size={16} strokeWidth={1.8} />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section className="detail-section" aria-labelledby="amenities">
            <h2 id="amenities" className="detail-section__title">
              امکانات
            </h2>
            <ul className="detail-amenities">
              {property.amenities.map((amenity) => (
                <li key={amenity}>{amenity}</li>
              ))}
            </ul>
          </section>

          <section className="detail-section" aria-labelledby="neighbourhood">
            <h2 id="neighbourhood" className="detail-section__title">
              محله
            </h2>
            <p className="detail-copy">{property.neighborhood.intro}</p>
            <dl className="detail-nearby">
              {property.neighborhood.nearby.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside className="detail-aside">
          <div className="agent-card">
            <p className="agent-card__eyebrow">مشاور این ملک</p>
            <div className="agent-card__head">
              <span className="agent-card__avatar">
                <Img id={agent.photoId} alt={`پرتره ${agent.name}`} sizes="64px" widths={[120, 240]} />
              </span>
              <div>
                <h2 className="agent-card__name">{agent.name}</h2>
                <p className="agent-card__title">{agent.role}</p>
              </div>
            </div>
            <p className="agent-card__focus">{agent.focus}</p>
            <a className="agent-card__line" href={`tel:${agent.phone.replace(/[^\d]/g, '')}`}>
              <Icon name="phone" size={15} strokeWidth={1.6} />
              <span dir="ltr">{agent.phone}</span>
            </a>
            <a className="agent-card__line" href={`mailto:${agent.email}`}>
              <Icon name="mail" size={15} strokeWidth={1.6} />
              <span dir="ltr">{agent.email}</span>
            </a>
            <Button block onClick={() => setInquiry('contact')}>
              تماس با مشاور
            </Button>
            <Button block variant="outline" onClick={() => setInquiry('viewing')}>
              تعیین وقت بازدید
            </Button>
            <p className="agent-card__note">
              <Icon name="clock" size={14} strokeWidth={1.6} />
              معمولاً تا ۲ ساعت پاسخ می‌دهد
            </p>
          </div>
        </aside>
      </div>

      {similar.length > 0 ? (
        <section className="section section--tight detail-similar" aria-labelledby="similar-title">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">ادامه کاوش</span>
              <h2 id="similar-title" className="section-title">
                املاک مشابه
              </h2>
            </div>
            <div className="properties-grid">
              {similar.map((item, index) => (
                <Reveal key={item.id} delay={index * 60}>
                  <PropertyCard property={item} variant="grid" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="detail-mobile-cta">
        <div className="detail-mobile-cta__price">
          <span>{typeLabel}</span>
          <strong>{formatPrice(property.price)}</strong>
        </div>
        <Button variant="primary" size="sm" onClick={() => setInquiry('viewing')}>
          رزرو بازدید
        </Button>
      </div>

      <InquiryModal
        open={inquiry !== null}
        mode={inquiry ?? 'contact'}
        property={property}
        onClose={() => setInquiry(null)}
      />
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { PROPERTY_TYPE_LABELS, formatPrice, locationLabel } from '../../data/properties';
import { useFavorites } from '../../store/FavoritesContext';
import type { Property } from '../../data/types';
import './PropertyCard.css';

type PropertyCardProps = {
  property: Property;
  variant?: 'carousel' | 'grid';
  lead?: boolean;
  priority?: boolean;
  sizes?: string;
};

export function PropertyCard({ property, variant = 'grid', lead = false, priority = false, sizes }: PropertyCardProps) {
  const { isFavorite, toggle } = useFavorites();
  const saved = isFavorite(property.slug);
  const cover = property.images[0];

  const defaultSizes =
    variant === 'carousel'
      ? '(max-width: 760px) 84vw, (max-width: 1200px) 46vw, 620px'
      : '(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw';

  return (
    <article className={`p-card p-card--${variant}${lead ? ' p-card--lead' : ''}`}>
      <Img
        id={cover.id}
        alt={cover.alt}
        priority={priority}
        sizes={sizes ?? defaultSizes}
        widths={[480, 768, 1080, 1440]}
        className="p-card__img"
      />
      <span className="p-card__scrim" aria-hidden="true" />

      <div className="p-card__top">
        <span className="p-card__type">{PROPERTY_TYPE_LABELS[property.type]}</span>
        <button
          type="button"
          className={`p-card__fav${saved ? ' is-saved' : ''}`}
          aria-pressed={saved}
          aria-label={saved ? `حذف ${property.name} از املاک ذخیره‌شده` : `ذخیره ${property.name}`}
          onClick={() => toggle(property.slug)}
        >
          <Icon name="heart" size={17} strokeWidth={1.6} />
        </button>
      </div>

      <div className="p-card__body">
        <div className="p-card__info">
          <h3 className="p-card__name">{property.name}</h3>
          <p className="p-card__loc">
            <Icon name="pin" size={13} strokeWidth={1.6} />
            {property.city}، {property.region}
          </p>
        </div>
        <span className="p-card__price">{formatPrice(property.price)}</span>
      </div>

      <Link to={`/properties/${property.slug}`} className="p-card__link">
        <span className="sr-only">
          مشاهده {property.name} در {locationLabel(property)}
        </span>
      </Link>
    </article>
  );
}

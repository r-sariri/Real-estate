import { Link } from 'react-router-dom';
import { useProperties } from '../../hooks/useProperties';
import { PropertyCarousel } from '../property/PropertyCarousel';
import { Icon } from '../ui/Icon';
import './FeaturedProperties.css';

export function FeaturedProperties() {
  const { properties, loading } = useProperties();
  const ordered = [
    ...properties.filter((property) => property.featured),
    ...properties.filter((property) => !property.featured),
  ].slice(0, 6);

  return (
    <section className="section featured" aria-labelledby="featured-title">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="eyebrow">Featured</span>
          <h2 id="featured-title" className="section-title">
            Featured Properties
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="container featured__skeleton" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <div key={index} className="skeleton featured__skeleton-card" />
          ))}
        </div>
      ) : (
        <PropertyCarousel properties={ordered} />
      )}

      <div className="container featured__foot">
        <Link to="/properties" className="link-arrow">
          View all properties
          <Icon name="arrow-right" size={15} />
        </Link>
      </div>
    </section>
  );
}

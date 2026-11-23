import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHero } from '../components/layout/PageHero';
import { PropertyCard } from '../components/property/PropertyCard';
import { PRICE_RANGES, PropertyFilters, type FilterState } from '../components/property/PropertyFilters';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Reveal } from '../components/ui/Reveal';
import { useProperties } from '../hooks/useProperties';
import { useFavorites } from '../store/FavoritesContext';
import type { Property } from '../data/types';
import './pages.css';

const SORT_KEYS = ['featured', 'price-desc', 'price-asc', 'size-desc', 'newest'] as const;

function readFilters(params: URLSearchParams): FilterState {
  const sort = params.get('sort') ?? '';
  return {
    q: params.get('q') ?? '',
    location: params.get('location') ?? 'all',
    type: params.get('type') ?? 'all',
    price: params.get('price') ?? 'all',
    beds: params.get('beds') ?? 'all',
    baths: params.get('baths') ?? 'all',
    sort: (SORT_KEYS as readonly string[]).includes(sort) ? sort : 'featured',
  };
}

export function PropertiesPage() {
  const [params, setParams] = useSearchParams();
  const { properties, loading } = useProperties();
  const { isFavorite, count: savedCount } = useFavorites();

  const filters = readFilters(params);
  const savedOnly = params.get('saved') === '1';

  function setFilter(key: keyof FilterState, value: string) {
    const next = new URLSearchParams(params);
    const isDefault =
      value === '' ||
      value === 'all' ||
      (key === 'sort' && value === 'featured');
    if (isDefault) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  }

  function toggleSaved() {
    const next = new URLSearchParams(params);
    if (savedOnly) next.delete('saved');
    else next.set('saved', '1');
    setParams(next, { replace: true });
  }

  function reset() {
    setParams(new URLSearchParams(), { replace: true });
  }

  const isDirty =
    filters.q !== '' ||
    filters.location !== 'all' ||
    filters.type !== 'all' ||
    filters.price !== 'all' ||
    filters.beds !== 'all' ||
    filters.baths !== 'all' ||
    filters.sort !== 'featured' ||
    savedOnly;

  const results = useMemo(() => {
    const needle = filters.q.trim().toLowerCase();
    const list = properties.filter((property) => {
      if (filters.location !== 'all' && `${property.city}, ${property.region}` !== filters.location) return false;
      if (filters.type !== 'all' && property.type !== filters.type) return false;
      if (filters.price !== 'all') {
        const [min, max] = PRICE_RANGES[filters.price] ?? [0, Number.POSITIVE_INFINITY];
        if (property.price < min || property.price >= max) return false;
      }
      if (filters.beds !== 'all' && property.beds < Number(filters.beds)) return false;
      if (filters.baths !== 'all' && property.baths < Number(filters.baths)) return false;
      if (savedOnly && !isFavorite(property.slug)) return false;
      if (needle) {
        const haystack = [
          property.name,
          property.city,
          property.region,
          property.type,
          property.summary,
          ...property.highlights,
          ...property.amenities,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });

    const sorted = [...list];
    switch (filters.sort) {
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'size-desc':
        sorted.sort((a, b) => b.sqft - a.sqft);
        break;
      case 'newest':
        sorted.sort((a, b) => Date.parse(b.listedAt) - Date.parse(a.listedAt));
        break;
      default:
        sorted.sort((a: Property, b: Property) => Number(b.featured) - Number(a.featured) || b.price - a.price);
    }
    return sorted;
  }, [properties, filters, savedOnly, isFavorite]);

  return (
    <>
      <PageHero
        eyebrow="The Collection"
        title="Find your place"
        lede="A curated portfolio of architecturally significant homes across the United States. Filter by what matters, or simply browse."
        imageId="1602343168117-bb8ffe3e2e9f"
        imageAlt="Contemporary estate with a reflecting pool at dusk"
      />

      <div className="container properties__filters">
        <PropertyFilters value={filters} onChange={setFilter} />
      </div>

      <section className="properties__results" aria-labelledby="results-title">
        <div className="container">
          <div className="results-bar">
            <h2 id="results-title" className="results-bar__count" aria-live="polite">
              {loading ? 'Loading residences' : (
                <>
                  <strong>{results.length}</strong> {results.length === 1 ? 'residence' : 'residences'}
                </>
              )}
            </h2>
            <div className="results-bar__actions">
              <button
                type="button"
                className={`results-chip${savedOnly ? ' is-active' : ''}`}
                aria-pressed={savedOnly}
                onClick={toggleSaved}
              >
                <Icon name="heart" size={15} strokeWidth={1.6} />
                Saved{savedCount ? ` (${savedCount})` : ''}
              </button>
              {isDirty ? (
                <button type="button" className="results-bar__clear" onClick={reset}>
                  Clear filters
                </button>
              ) : null}
            </div>
          </div>

          {loading ? (
            <div className="properties-grid" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="skeleton properties-grid__skeleton" />
              ))}
            </div>
          ) : results.length ? (
            <div className="properties-grid">
              {results.map((property, index) => (
                <Reveal key={property.id} delay={Math.min(index, 5) * 50}>
                  <PropertyCard property={property} variant="grid" sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw" />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="properties-empty">
              <span className="properties-empty__icon">
                <Icon name="search" size={22} strokeWidth={1.4} />
              </span>
              <h2 className="properties-empty__title">No residences match those filters</h2>
              <p className="properties-empty__text">
                Try widening the price range or clearing a location — our advisors can also search privately on your
                behalf.
              </p>
              <div className="properties-empty__actions">
                <Button variant="primary" onClick={reset} icon={null}>
                  Clear filters
                </Button>
                <Button to="/contact" variant="outline">
                  Ask an advisor
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

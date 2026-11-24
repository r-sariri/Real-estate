import { useState } from 'react';
import { Icon } from '../ui/Icon';
import { PROPERTY_TYPE_LABELS, locations, propertyTypes } from '../../data/properties';
import './PropertyFilters.css';

export type FilterState = {
  q: string;
  location: string;
  type: string;
  price: string;
  beds: string;
  baths: string;
  sort: string;
};

export const EMPTY_FILTERS: FilterState = {
  q: '',
  location: 'all',
  type: 'all',
  price: 'all',
  beds: 'all',
  baths: 'all',
  sort: 'featured',
};

export const PRICE_RANGES: Record<string, [number, number]> = {
  'under-2': [0, 2_000_000],
  '2-4': [2_000_000, 4_000_000],
  '4-6': [4_000_000, 6_000_000],
  '6-plus': [6_000_000, Number.POSITIVE_INFINITY],
};

type PropertyFiltersProps = {
  value: FilterState;
  onChange: (key: keyof FilterState, value: string) => void;
};

export function PropertyFilters({ value, onChange }: PropertyFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="filters">
      <div className="filters__top">
        <label className="filters__search">
          <Icon name="search" size={18} strokeWidth={1.6} />
          <span className="sr-only">جستجوی املاک</span>
          <input
            type="search"
            value={value.q}
            placeholder="جستجو بر اساس نام، شهر یا ویژگی"
            onChange={(event) => onChange('q', event.target.value)}
          />
        </label>
        <button
          type="button"
          className={`filters__toggle${open ? ' is-open' : ''}`}
          aria-expanded={open}
          aria-controls="filters-body"
          onClick={() => setOpen((current) => !current)}
        >
          <Icon name="sliders" size={17} strokeWidth={1.6} />
          فیلترها
        </button>
      </div>

      <div id="filters-body" className={`filters__body${open ? ' is-open' : ''}`}>
        <div className="field filters__field">
          <label className="field__label" htmlFor="filter-location">
            موقعیت
          </label>
          <select
            id="filter-location"
            className="select"
            value={value.location}
            onChange={(event) => onChange('location', event.target.value)}
          >
            <option value="all">همه موقعیت‌ها</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="field filters__field">
          <label className="field__label" htmlFor="filter-type">
            نوع ملک
          </label>
          <select
            id="filter-type"
            className="select"
            value={value.type}
            onChange={(event) => onChange('type', event.target.value)}
          >
            <option value="all">همه انواع</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {PROPERTY_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        <div className="field filters__field">
          <label className="field__label" htmlFor="filter-price">
            قیمت
          </label>
          <select
            id="filter-price"
            className="select"
            value={value.price}
            onChange={(event) => onChange('price', event.target.value)}
          >
            <option value="all">هر قیمتی</option>
            <option value="under-2">کمتر از ۲ میلیون دلار</option>
            <option value="2-4">۲ تا ۴ میلیون دلار</option>
            <option value="4-6">۴ تا ۶ میلیون دلار</option>
            <option value="6-plus">بیش از ۶ میلیون دلار</option>
          </select>
        </div>

        <div className="field filters__field">
          <label className="field__label" htmlFor="filter-beds">
            اتاق خواب
          </label>
          <select
            id="filter-beds"
            className="select"
            value={value.beds}
            onChange={(event) => onChange('beds', event.target.value)}
          >
            <option value="all">همه</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
            <option value="6">6+</option>
          </select>
        </div>

        <div className="field filters__field">
          <label className="field__label" htmlFor="filter-baths">
            سرویس بهداشتی
          </label>
          <select
            id="filter-baths"
            className="select"
            value={value.baths}
            onChange={(event) => onChange('baths', event.target.value)}
          >
            <option value="all">همه</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
            <option value="6">6+</option>
          </select>
        </div>

        <div className="field filters__field">
          <label className="field__label" htmlFor="filter-sort">
            مرتب‌سازی
          </label>
          <select
            id="filter-sort"
            className="select"
            value={value.sort}
            onChange={(event) => onChange('sort', event.target.value)}
          >
            <option value="featured">منتخب</option>
            <option value="price-desc">قیمت: زیاد به کم</option>
            <option value="price-asc">قیمت: کم به زیاد</option>
            <option value="size-desc">بزرگ‌ترین اول</option>
            <option value="newest">جدیدترین اول</option>
          </select>
        </div>
      </div>
    </div>
  );
}

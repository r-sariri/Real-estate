import { useCallback, useRef, useState } from 'react';
import { Icon } from '../ui/Icon';
import { PropertyCard } from './PropertyCard';
import type { Property } from '../../data/types';
import './PropertyCarousel.css';

type PropertyCarouselProps = {
  properties: Property[];
  label?: string;
};

const isRtl = (el: HTMLElement) => getComputedStyle(el).direction === 'rtl';

export function PropertyCarousel({ properties, label = 'املاک منتخب' }: PropertyCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const suppressClick = useRef(false);
  const [dragging, setDragging] = useState(false);

  const scrollByPage = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>('[data-carousel-item]');
    const step = item ? item.offsetWidth + 20 : el.clientWidth * 0.8;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 4) return;

    // In RTL the scroll origin is the right edge and scrollLeft runs negative.
    const rtl = isRtl(el);
    const position = rtl ? -el.scrollLeft : el.scrollLeft;

    let next = position + direction * step;
    if (direction > 0 && position >= max - 16) next = 0;
    if (direction < 0 && position <= 16) next = max;

    next = Math.max(0, Math.min(max, next));
    el.scrollTo({ left: rtl ? -next : next, behavior: 'smooth' });
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: event.clientX, startScroll: el.scrollLeft, moved: false };
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    const dx = event.clientX - drag.current.startX;
    if (!drag.current.moved && Math.abs(dx) > 6) drag.current.moved = true;
    if (!drag.current.moved) return;
    try {
      if (!el.hasPointerCapture(event.pointerId)) el.setPointerCapture(event.pointerId);
    } catch {
      /* pointer may already be released */
    }
    el.scrollLeft = drag.current.startScroll + (isRtl(el) ? dx : -dx);
    event.preventDefault();
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    suppressClick.current = drag.current.moved;
    drag.current.active = false;
    setDragging(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    const rtl = el ? isRtl(el) : false;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollByPage(rtl ? -1 : 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollByPage(rtl ? 1 : -1);
    }
  };

  return (
    <div className="p-carousel">
      <div
        ref={trackRef}
        className={`p-carousel__track${dragging ? ' is-dragging' : ''}`}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onKeyDown={onKeyDown}
        onClickCapture={(event) => {
          if (suppressClick.current) {
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
          }
        }}
      >
        {properties.map((property, index) => (
          <div
            key={property.id}
            className={`p-carousel__item${index === 0 ? ' p-carousel__item--lead' : ''}`}
            data-carousel-item
          >
            <PropertyCard
              property={property}
              variant="carousel"
              lead={index === 0}
              priority={index === 0}
              sizes={
                index === 0
                  ? '(max-width: 760px) 86vw, (max-width: 1200px) 46vw, 600px'
                  : '(max-width: 760px) 70vw, 320px'
              }
            />
          </div>
        ))}
      </div>

      <div className="p-carousel__bar">
        <span className="p-carousel__hint" aria-hidden="true">
          برای کاوش بکشید یا سوایپ کنید
        </span>
        <button
          type="button"
          className="p-carousel__nav"
          onClick={() => scrollByPage(-1)}
          aria-label="املاک قبلی"
        >
          <Icon name="arrow-left" size={18} />
        </button>
        <button
          type="button"
          className="p-carousel__nav"
          onClick={() => scrollByPage(1)}
          aria-label="املاک بعدی"
        >
          <Icon name="arrow-right" size={18} />
        </button>
      </div>
    </div>
  );
}

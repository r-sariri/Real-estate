import { useEffect, useRef } from 'react';
import { unsplashUrl } from '../ui/Img';
import { Icon } from '../ui/Icon';
import type { PropertyImage } from '../../data/types';
import './Lightbox.css';

type LightboxProps = {
  images: PropertyImage[];
  index: number;
  open: boolean;
  title: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function Lightbox({ images, index, open, title, onClose, onIndexChange }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const indexRef = useRef(index);
  const onCloseRef = useRef(onClose);
  const onIndexChangeRef = useRef(onIndexChange);
  indexRef.current = index;
  onCloseRef.current = onClose;
  onIndexChangeRef.current = onIndexChange;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
      } else if (event.key === 'ArrowRight') {
        onIndexChangeRef.current((indexRef.current + 1) % images.length);
      } else if (event.key === 'ArrowLeft') {
        onIndexChangeRef.current((indexRef.current - 1 + images.length) % images.length);
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(timer);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [open, images.length]);

  if (!open) return null;
  const image = images[index];
  const total = images.length;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`گالری تصاویر ${title}`}>
      <div className="lightbox__top">
        <p className="lightbox__counter">
          <span>{String(index + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
        </p>
        <p className="lightbox__title">{title}</p>
        <button ref={closeRef} type="button" className="lightbox__close" onClick={onClose} aria-label="بستن گالری">
          <Icon name="close" size={20} />
        </button>
      </div>

      <div className="lightbox__stage">
        <button
          type="button"
          className="lightbox__nav lightbox__nav--prev"
          onClick={() => onIndexChange((index - 1 + total) % total)}
          aria-label="تصویر قبلی"
        >
          <Icon name="arrow-left" size={20} />
        </button>

        <figure className="lightbox__figure">
          <img key={image.id} src={unsplashUrl(image.id, 1800)} alt={image.alt} />
          <figcaption>{image.alt}</figcaption>
        </figure>

        <button
          type="button"
          className="lightbox__nav lightbox__nav--next"
          onClick={() => onIndexChange((index + 1) % total)}
          aria-label="تصویر بعدی"
        >
          <Icon name="arrow-right" size={20} />
        </button>
      </div>

      <div className="lightbox__thumbs" role="group" aria-label="انتخاب تصویر">
        {images.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            className={`lightbox__thumb${itemIndex === index ? ' is-active' : ''}`}
            onClick={() => onIndexChange(itemIndex)}
            aria-label={`تصویر ${itemIndex + 1}: ${item.alt}`}
            aria-current={itemIndex === index}
          >
            <img src={unsplashUrl(item.id, 240)} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}

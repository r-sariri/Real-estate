import { useState } from 'react';
import { Img } from '../ui/Img';
import { Icon } from '../ui/Icon';
import { Lightbox } from './Lightbox';
import type { Property } from '../../data/types';
import './PropertyGallery.css';

export function PropertyGallery({ property }: { property: Property }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const images = property.images;

  function openAt(nextIndex: number) {
    setIndex(nextIndex);
    setOpen(true);
  }

  return (
    <>
      <div className="p-gallery">
        <button
          type="button"
          className="p-gallery__main"
          onClick={() => openAt(0)}
          aria-label={`باز کردن گالری تصاویر — ${images.length} تصویر از ${property.name}`}
        >
          <Img
            id={images[0].id}
            alt={images[0].alt}
            priority
            sizes="(max-width: 760px) 100vw, 64vw"
            widths={[768, 1080, 1440, 1920]}
          />
          <span className="p-gallery__pill">
            <Icon name="search" size={14} strokeWidth={1.6} />
            همه {images.length} تصویر
          </span>
        </button>

        <div className="p-gallery__side">
          {images.slice(1, 3).map((image, itemIndex) => (
            <button
              key={image.id}
              type="button"
              className="p-gallery__thumb"
              onClick={() => openAt(itemIndex + 1)}
              aria-label={`مشاهده تصویر ${itemIndex + 2} از ${images.length}`}
            >
              <Img id={image.id} alt={image.alt} sizes="(max-width: 760px) 46vw, 28vw" widths={[480, 768, 1080]} />
              {itemIndex === 1 ? <span className="p-gallery__more">+{Math.max(images.length - 3, 0)} تصویر دیگر</span> : null}
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        images={images}
        index={index}
        open={open}
        title={property.name}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
      />
    </>
  );
}

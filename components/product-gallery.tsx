"use client";

import { useState } from "react";
import { Icon } from "./icons";

/** Product gallery with pointer-follow zoom + thumbnails (keyboard friendly). */
export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const list = images.length > 0 ? images : ["/hero.svg"];

  return (
    <div>
      <div
        className="group relative aspect-square overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-cream to-ice/50"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          setOrigin(`${x}% ${y}%`);
        }}
      >
        <img
          src={list[active]}
          alt={`${name} — تصویر ${active + 1}`}
          width={900}
          height={900}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-300 ease-out"
          style={{ transformOrigin: origin, transform: zoom ? "scale(1.85)" : "none" }}
        />
        <span className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[10.5px] text-ink-soft opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <Icon name="search" size={12} /> برای بزرگ‌نمایی، نشانگر را روی تصویر حرکت دهید
        </span>
      </div>

      {list.length > 1 ? (
        <div className="mt-3 flex gap-2" role="tablist" aria-label="تصاویر محصول">
          {list.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`تصویر ${index + 1}`}
              onClick={() => setActive(index)}
              className={`size-16 shrink-0 overflow-hidden rounded-xl border transition-colors ${
                index === active ? "border-gold" : "border-line hover:border-gold/60"
              }`}
            >
              <img src={image} alt="" width={120} height={120} loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

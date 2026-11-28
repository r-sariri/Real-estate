"use client";

import { useRef, useState } from "react";
import { Icon } from "./icons";

type Testimonial = { id: string; name: string; city: string | null; rating: number; text: string };

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  if (items.length === 0) return null;

  const scrollTo = (next: number) => {
    const node = track.current;
    if (!node) return;
    const clamped = Math.max(0, Math.min(items.length - 1, next));
    const card = node.children[clamped] as HTMLElement | undefined;
    if (card) {
      node.scrollTo({ left: clamped === 0 ? 0 : card.offsetLeft - node.offsetLeft, behavior: "smooth" });
    }
    setIndex(clamped);
  };

  return (
    <div>
      <div
        ref={track}
        onScroll={(event) => {
          const node = event.currentTarget;
          const cardWidth = (node.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
          setIndex(Math.round(node.scrollLeft / (cardWidth + 16)));
        }}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2"
        role="region"
        aria-label="نظرات مشتریان"
        tabIndex={0}
      >
        {items.map((item) => (
          <figure
            key={item.id}
            className="w-[86%] shrink-0 snap-start rounded-[1.75rem] border border-line bg-white/80 p-6 backdrop-blur sm:w-[48%] lg:w-[32%]"
          >
            <Icon name="quote" size={26} className="text-gold/70" filled />
            <blockquote className="mt-3 text-[13.5px] leading-7 text-ink-soft">{item.text}</blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
              <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-gold-soft to-champagne text-sm font-semibold text-gold-deep">
                {item.name.slice(0, 1)}
              </span>
              <span className="flex-1">
                <span className="block text-[13px] font-medium text-ink">{item.name}</span>
                {item.city ? <span className="block text-[11px] text-muted">{item.city}</span> : null}
              </span>
              <span className="flex items-center gap-0.5 text-gold" aria-label={`امتیاز ${item.rating} از ۵`}>
                {Array.from({ length: 5 }).map((_, star) => (
                  <Icon key={star} name="star" size={12} filled={star < item.rating} className={star < item.rating ? "" : "opacity-30"} />
                ))}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollTo(index - 1)}
          disabled={index === 0}
          className="grid size-9 place-items-center rounded-full border border-line bg-white text-ink-soft transition-colors hover:border-gold disabled:opacity-40"
          aria-label="نظر قبلی"
        >
          <Icon name="chevronRight" size={16} />
        </button>
        <div className="flex items-center gap-1.5" role="tablist" aria-label="انتخاب نظر">
          {items.map((item, dot) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={dot === index}
              aria-label={`نظر ${dot + 1}`}
              onClick={() => scrollTo(dot)}
              className={`h-1.5 rounded-full transition-all ${dot === index ? "w-6 bg-gold-deep" : "w-1.5 bg-line"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollTo(index + 1)}
          disabled={index >= items.length - 1}
          className="grid size-9 place-items-center rounded-full border border-line bg-white text-ink-soft transition-colors hover:border-gold disabled:opacity-40"
          aria-label="نظر بعدی"
        >
          <Icon name="chevronLeft" size={16} />
        </button>
      </div>
    </div>
  );
}

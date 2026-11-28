import type { Ad } from "@prisma/client";
import type { AdPlacement } from "@prisma/client";
import { getAdsFor } from "@/lib/ads";
import { AdImpression } from "./ad-impression";

/**
 * Sponsored placement.
 * - Renders nothing when there is no live campaign (no empty gap).
 * - Fixed aspect ratio reserves space before the image loads (no CLS).
 * - Label is always visible: sponsored content is never disguised as product.
 */
export async function AdSlot({
  placement,
  ratio = "wide",
  className = "",
}: {
  placement: AdPlacement;
  ratio?: "wide" | "square" | "tall";
  className?: string;
}) {
  const [ad] = await getAdsFor(placement, 1);
  if (!ad) return null;

  const ratios = {
    wide: "aspect-[16/5]",
    square: "aspect-square",
    tall: "aspect-[4/3]",
  } as const;

  return <AdCreative ad={ad} ratioClass={ratios[ratio]} className={className} />;
}

function AdCreative({ ad, ratioClass, className }: { ad: Ad; ratioClass: string; className: string }) {
  return (
    <aside aria-label="محتوای تبلیغاتی" className={`relative ${className}`} data-ad-placement={ad.placement}>
      <p className="mb-1.5 flex items-center justify-end gap-1 text-[10px] tracking-wide text-muted">
        <span className="rounded-sm border border-line px-1 py-px">تبلیغ</span>
        {ad.advertiser ? <span>— {ad.advertiser}</span> : null}
      </p>
      <a
        href={`/api/ads/${ad.id}/click`}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className={`group relative block overflow-hidden rounded-2xl border border-line bg-cream ${ratioClass}`}
      >
        <picture>
          {ad.imageMobile ? <source media="(max-width: 640px)" srcSet={ad.imageMobile} /> : null}
          <img
            src={ad.imageDesktop}
            alt={ad.title}
            width={1200}
            height={380}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </picture>
        <span className="pointer-events-none absolute inset-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent p-4">
          <span className="max-w-[75%]">
            <span className="block text-sm font-semibold text-white">{ad.title}</span>
            {ad.description ? <span className="mt-1 block text-[11px] leading-5 text-white/85">{ad.description}</span> : null}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-ink">مشاهده</span>
        </span>
      </a>
      <AdImpression adId={ad.id} />
    </aside>
  );
}

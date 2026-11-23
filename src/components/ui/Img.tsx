const BASE = 'https://images.unsplash.com/photo-';

export function unsplashUrl(id: string, width: number): string {
  return `${BASE}${id}?auto=format&fit=crop&w=${width}&q=80`;
}

type ImgProps = {
  /** Unsplash photo id (the part after `photo-`). */
  id: string;
  alt: string;
  /** Responsive `sizes` hint — keep it accurate to avoid oversized downloads. */
  sizes?: string;
  widths?: number[];
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Responsive, lazy-by-default image. Above-the-fold images pass `priority`
 * so they load eagerly and are not deferred.
 */
export function Img({
  id,
  alt,
  sizes = '100vw',
  widths = [480, 768, 1080, 1440, 1920],
  priority = false,
  className,
  style,
}: ImgProps) {
  const srcSet = widths.map((w) => `${unsplashUrl(id, w)} ${w}w`).join(', ');
  const fallback = unsplashUrl(id, widths[Math.min(2, widths.length - 1)]);

  return (
    <img
      className={className}
      style={style}
      src={fallback}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}

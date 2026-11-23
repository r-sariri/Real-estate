import type { ReactNode } from 'react';
import { Img } from '../ui/Img';
import './PageHero.css';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lede?: string;
  imageId: string;
  imageAlt?: string;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, lede, imageId, imageAlt = '', children }: PageHeroProps) {
  return (
    <header className="page-hero">
      <div className="page-hero__media">
        <Img id={imageId} alt={imageAlt} priority sizes="100vw" widths={[768, 1080, 1440, 1920]} />
        <span className="page-hero__scrim" aria-hidden="true" />
      </div>
      <div className="container page-hero__inner">
        <span className="eyebrow eyebrow--light">{eyebrow}</span>
        <h1 className="page-hero__title">{title}</h1>
        {lede ? <p className="page-hero__lede">{lede}</p> : null}
        {children}
      </div>
    </header>
  );
}

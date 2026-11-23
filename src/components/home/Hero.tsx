import { useState } from 'react';
import { Img } from '../ui/Img';
import { useScrollScrubVideo } from './useScrollScrubVideo';
import './Hero.css';

const hasReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Phones get the 720p encode: same film, a third of the decode cost. */
const pickFilm = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches
    ? '/video/hero-mobile.mp4'
    : '/video/hero-desktop.mp4';

export function Hero() {
  const [reduced] = useState(hasReducedMotion);
  const [src] = useState(pickFilm);
  const { sectionRef, videoRef, ready, failed } = useScrollScrubVideo(!reduced);
  const film = !reduced && !failed;

  return (
    <section
      ref={sectionRef}
      className={`hero${reduced ? ' hero--static' : ''}`}
      aria-labelledby="hero-title"
    >
      <div className="hero__sticky">
        <div className="hero__media">
          {/* Last-resort still: carries the hero if the film never arrives. */}
          <Img
            id="1512917774080-9991f1c4c750"
            alt="Contemporary hillside villa with an illuminated infinity pool at blue hour"
            priority
            sizes="100vw"
            widths={[768, 1080, 1440, 1920, 2400]}
            className="hero__img"
          />

          {film && (
            <video
              ref={videoRef}
              className={`hero__video${ready ? ' is-ready' : ''}`}
              src={src}
              poster="/video/hero-poster.jpg"
              preload="auto"
              muted
              playsInline
              disablePictureInPicture
              tabIndex={-1}
              aria-hidden="true"
            />
          )}

          {reduced && <img className="hero__video is-ready" src="/video/hero-poster.jpg" alt="" />}

          <span className="hero__scrim" aria-hidden="true" />

          {film && !ready && (
            <div className="hero__loading" role="status">
              <span className="hero__loading-label">Preparing the walkthrough</span>
              <span className="hero__loading-track" aria-hidden="true">
                <span className="hero__loading-fill" />
              </span>
            </div>
          )}
        </div>

        <div className="hero__inner container">
          <h1 id="hero-title" className="hero__title">
            Discover Exceptional
            <br />
            Homes &amp; Investments
          </h1>
          <p className="hero__lede">
            Premium properties in prime locations. Find your dream home or the perfect investment with confidence.
          </p>
        </div>

        <div className="hero__foot container">
          <a className="hero__scroll" href="#about">
            <span className="hero__scroll-line" aria-hidden="true" />
            <span>Scroll to explore</span>
          </a>
          <p className="hero__cities">Austin · Malibu · Miami · Los Angeles</p>
        </div>
      </div>
    </section>
  );
}

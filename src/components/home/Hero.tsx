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
            alt="ویلای معاصر در دامنه کوه با استخر بی‌نهایت روشن در ساعت آبی"
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
              <span className="hero__loading-label">آماده‌سازی تور مجازی</span>
              <span className="hero__loading-track" aria-hidden="true">
                <span className="hero__loading-fill" />
              </span>
            </div>
          )}
        </div>

        <div className="hero__inner container">
          <h1 id="hero-title" className="hero__title">
            خانه‌ها و سرمایه‌گذاری‌های
            <br />
            شاخص را کشف کنید
          </h1>
          <p className="hero__lede">
            املاک ممتاز در بهترین موقعیت‌ها. خانه رؤیایی یا سرمایه‌گذاری درست خود را با اطمینان پیدا کنید.
          </p>
        </div>

        <div className="hero__foot container">
          <a className="hero__scroll" href="#about">
            <span className="hero__scroll-line" aria-hidden="true" />
            <span>برای گشت اسکرول کنید</span>
          </a>
          <p className="hero__cities">آستین · مالیبو · میامی · لس‌آنجلس</p>
        </div>
      </div>
    </section>
  );
}

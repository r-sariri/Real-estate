import { Img } from '../ui/Img';
import './Hero.css';

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <Img
          id="1512917774080-9991f1c4c750"
          alt="Contemporary hillside villa with an illuminated infinity pool at blue hour"
          priority
          sizes="100vw"
          widths={[768, 1080, 1440, 1920, 2400]}
          className="hero__img"
        />
        <span className="hero__scrim" aria-hidden="true" />
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
    </section>
  );
}

import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import './CtaBanner.css';

export function CtaBanner() {
  return (
    <section className="section section--tight cta-section">
      <div className="container">
        <div className="cta-banner">
          <span className="cta-banner__icon" aria-hidden="true">
            <Icon name="key" size={24} strokeWidth={1.4} />
          </span>
          <div className="cta-banner__copy">
            <h2 className="cta-banner__title">Ready to Find Your Perfect Property?</h2>
            <p className="cta-banner__text">Let our experts guide you to the right home or investment.</p>
          </div>
          <Button to="/contact" variant="primary" className="cta-banner__button">
            Get In Touch
          </Button>
        </div>
      </div>
    </section>
  );
}

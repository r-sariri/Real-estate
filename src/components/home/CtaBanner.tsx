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
            <h2 className="cta-banner__title">آماده پیدا کردن ملک دلخواهتان هستید؟</h2>
            <p className="cta-banner__text">بگذارید کارشناسان ما شما را به خانه یا سرمایه‌گذاری درست برسانند.</p>
          </div>
          <Button to="/contact" variant="primary" className="cta-banner__button">
            تماس با ما
          </Button>
        </div>
      </div>
    </section>
  );
}

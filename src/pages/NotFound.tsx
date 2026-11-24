import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

export function NotFound() {
  return (
    <section className="not-found">
      <div className="container not-found__inner">
        <span className="eyebrow">404</span>
        <h1 className="not-found__title">این نشانی از بازار خارج شده است.</h1>
        <p className="not-found__text">
          صفحه‌ای که دنبالش بودید جابه‌جا شده یا دیگر وجود ندارد. بگذارید شما را به مجموعه برگردانیم.
        </p>
        <div className="not-found__actions">
          <Button to="/properties" variant="primary">
            مشاهده املاک
          </Button>
          <Button to="/" variant="outline" icon={null}>
            بازگشت به خانه
          </Button>
        </div>
        <Link to="/contact" className="link-arrow not-found__link">
          تماس با مشاور
          <Icon name="arrow-right" size={15} />
        </Link>
      </div>
    </section>
  );
}

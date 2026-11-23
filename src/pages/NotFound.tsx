import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

export function NotFound() {
  return (
    <section className="not-found">
      <div className="container not-found__inner">
        <span className="eyebrow">404</span>
        <h1 className="not-found__title">This address is off the market.</h1>
        <p className="not-found__text">
          The page you were looking for has moved or no longer exists. Let us point you back to the collection.
        </p>
        <div className="not-found__actions">
          <Button to="/properties" variant="primary">
            Browse Properties
          </Button>
          <Button to="/" variant="outline" icon={null}>
            Return Home
          </Button>
        </div>
        <Link to="/contact" className="link-arrow not-found__link">
          Contact an advisor
          <Icon name="arrow-right" size={15} />
        </Link>
      </div>
    </section>
  );
}

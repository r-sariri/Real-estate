import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icon, LogoMark } from '../ui/Icon';
import { CONTACT, NAV_ITEMS } from './nav';
import { ThemeToggle } from './ThemeToggle';
import './Header.css';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header
        className={['site-header', scrolled ? 'is-solid' : '', open ? 'is-open' : ''].filter(Boolean).join(' ')}
      >
        <div className="site-header__inner container">
          <Link to="/" className="brand" aria-label="املاک افق — خانه">
            <span className="brand__mark">
              <LogoMark size={30} />
            </span>
            <span className="brand__text">
              <span className="brand__name">افق</span>
              <span className="brand__sub">املاک</span>
            </span>
          </Link>

          <nav className="site-nav" aria-label="اصلی">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `site-nav__link${isActive ? ' is-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <ThemeToggle />
            <a className="phone-pill" href={CONTACT.phoneHref}>
              <Icon name="phone" size={15} strokeWidth={1.6} />
              <span dir="ltr">{CONTACT.phone}</span>
            </a>
            <button
              type="button"
              className="nav-toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'بستن منو' : 'باز کردن منو'}
              onClick={() => setOpen((value) => !value)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <nav className="mobile-menu__links" aria-label="منوی موبایل">
          {NAV_ITEMS.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className="mobile-menu__link"
              style={{ '--i': index } as React.CSSProperties}
              tabIndex={open ? 0 : -1}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mobile-menu__foot">
          <a href={CONTACT.phoneHref} className="mobile-menu__contact">
            <Icon name="phone" size={17} />
            <span dir="ltr">{CONTACT.phone}</span>
          </a>
          <a href={CONTACT.emailHref} className="mobile-menu__contact">
            <Icon name="mail" size={17} />
            <span dir="ltr">{CONTACT.email}</span>
          </a>
          <div className="mobile-menu__socials">
            <a href="https://instagram.com" aria-label="املاک افق در اینستاگرام" target="_blank" rel="noreferrer">
              <Icon name="instagram" size={18} />
            </a>
            <a href="https://linkedin.com" aria-label="املاک افق در لینکدین" target="_blank" rel="noreferrer">
              <Icon name="linkedin" size={18} />
            </a>
            <a href="https://facebook.com" aria-label="املاک افق در فیسبوک" target="_blank" rel="noreferrer">
              <Icon name="facebook" size={18} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

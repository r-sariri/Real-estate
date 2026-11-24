import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, LogoMark } from '../ui/Icon';
import { subscribeToNewsletter } from '../../data/repository';
import { CONTACT, NAV_ITEMS } from './nav';
import './Footer.css';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    await subscribeToNewsletter(email);
    setStatus('done');
    setEmail('');
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link to="/" className="footer-brand" aria-label="املاک افق — خانه">
              <span className="footer-brand__mark">
                <LogoMark size={30} />
              </span>
              <span className="footer-brand__text">
                <span className="footer-brand__name">افق</span>
                <span className="footer-brand__sub">املاک</span>
              </span>
            </Link>
            <p className="site-footer__about">
              دفتری خصوصی در حوزه املاک که خانه‌های شاخص، سرمایه‌گذاری‌های سنجیده و آدم‌هایی را که در آن‌ها زندگی
              می‌کنند نمایندگی می‌کند.
            </p>
            <div className="site-footer__socials">
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">
                <Icon name="instagram" size={17} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                <Icon name="linkedin" size={17} />
              </a>
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer">
                <Icon name="facebook" size={17} />
              </a>
            </div>
          </div>

          <nav className="site-footer__col" aria-label="پاورقی">
            <h2 className="site-footer__heading">دسترسی سریع</h2>
            <ul className="site-footer__links">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__col">
            <h2 className="site-footer__heading">تماس</h2>
            <ul className="site-footer__contact">
              <li>
                <a href={CONTACT.phoneHref}>
                  <Icon name="phone" size={15} />
                  <span dir="ltr">{CONTACT.phone}</span>
                </a>
              </li>
              <li>
                <a href={CONTACT.emailHref}>
                  <Icon name="mail" size={15} />
                  <span dir="ltr">{CONTACT.email}</span>
                </a>
              </li>
              <li>
                <span className="site-footer__address">
                  <Icon name="pin" size={15} />
                  <span>
                    {CONTACT.address[0]}
                    <br />
                    {CONTACT.address[1]}
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div className="site-footer__col site-footer__news">
            <h2 className="site-footer__heading">خبرنامه</h2>
            <p className="site-footer__news-text">
              فهرست‌های تازه و یادداشت‌های بازار، گه‌گاه و بدون شلوغی.
            </p>
            {status === 'done' ? (
              <p className="site-footer__news-done" role="status">
                <Icon name="check" size={16} /> ثبت شدید.
              </p>
            ) : (
              <form className="news-form" onSubmit={handleSubmit} noValidate>
                <label className="sr-only" htmlFor="newsletter-email">
                  نشانی ایمیل
                </label>
                <input
                  id="newsletter-email"
                  className="news-form__input"
                  type="email"
                  name="email"
                  placeholder="نشانی ایمیل شما"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  aria-invalid={status === 'error'}
                  aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
                  required
                />
                <button type="submit" className="news-form__button" aria-label="عضویت در خبرنامه" disabled={status === 'sending'}>
                  <Icon name="arrow-right" size={17} />
                </button>
              </form>
            )}
            {status === 'error' ? (
              <p id="newsletter-error" className="news-form__error">
                لطفاً یک نشانی ایمیل معتبر وارد کنید.
              </p>
            ) : null}
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} املاک افق. تمام حقوق محفوظ است.</p>
          <ul className="site-footer__legal">
            <li>
              <Link to="/contact">حریم خصوصی</Link>
            </li>
            <li>
              <Link to="/contact">شرایط استفاده</Link>
            </li>
            <li>
              <Link to="/contact">مسکن منصفانه</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

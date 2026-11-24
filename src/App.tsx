import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { FavoritesProvider } from './store/FavoritesContext';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { TeamPage } from './pages/TeamPage';
import { ContactPage } from './pages/ContactPage';
import { NotFound } from './pages/NotFound';

const TITLES: Record<string, string> = {
  '/': 'املاک افق — خانه‌ها و سرمایه‌گذاری‌های شاخص',
  '/properties': 'املاک — املاک افق',
  '/about': 'درباره ما — املاک افق',
  '/services': 'خدمات — املاک افق',
  '/team': 'تیم ما — املاک افق',
  '/contact': 'تماس — املاک افق',
};

function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = TITLES[pathname] ?? 'املاک افق';
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <ScrollToTop />
        <RouteMeta />
        <a className="skip-link" href="#main">
          پرش به محتوا
        </a>
        <Header />
        <main id="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:slug" element={<PropertyDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </FavoritesProvider>
    </BrowserRouter>
  );
}

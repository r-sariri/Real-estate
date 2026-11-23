# Horizon Properties

A premium real estate website: editorial homepage, property discovery with live
filtering, property detail pages with a full-screen gallery, saved properties,
and inquiry / viewing-request forms.

Built with React 19 + TypeScript + Vite. No UI framework — the design system
lives in `src/styles/base.css` (tokens, reset, typography, buttons, forms) and
in component-scoped CSS files.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # type-check + production build
```

In the Base44 sandbox the app runs through Compose:

```bash
docker compose -f docker-compose.base44.yml up -d
```

## Structure

```
src/
  components/
    layout/    Header, Footer, PageHero, ScrollToTop, nav config
    home/      Hero, About, Featured, Services, WhyChoose, Team, CTA
    property/  PropertyCard, Carousel, Filters, Gallery, Lightbox, InquiryModal
    forms/     InquiryForm (contact + viewing modes, validation)
    ui/        Button, Icon, Img, Modal, Reveal
  data/        Property/agent/service records + repository (data access layer)
  hooks/       useProperties, useProperty
  pages/       Home, Properties, PropertyDetail, About, Services, Team, Contact, 404
  store/       FavoritesContext (localStorage)
```

## Content and data

- Properties, agents and services live in `src/data/*.ts` and are read through
  `src/data/repository.ts`. Every function there is async, so the local dataset
  can be replaced by an API or database without touching components.
- Images are referenced by Unsplash photo id through `<Img>` (`src/components/ui/Img.tsx`),
  which builds a responsive `srcset` and lazy-loads everything below the fold.
- Favourites are stored in `localStorage` under `horizon:favorites`.
- Inquiries and newsletter sign-ups are persisted by `src/data/repository.ts`
  (`horizon:inquiries`, `horizon:newsletter`). Swap those two functions for API
  calls when a backend is connected; the forms already handle loading and
  success states.

## Design system

| Token | Value |
| --- | --- |
| Deep navy | `#0B121A` |
| Ivory | `#F9F8F6` |
| Sand (section) | `#F1EEE8` |
| Mist (CTA) | `#EEF2F6` |
| Champagne | `#C5A072` |

Type: Inter (variable) for UI and headings, Playfair Display italic for editorial
accents. Both are self-hosted via `@fontsource`, so no external font request is
made at runtime.

Motion is CSS-only and respects `prefers-reduced-motion`.

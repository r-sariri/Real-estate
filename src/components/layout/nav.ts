export const NAV_ITEMS = [
  { label: 'خانه', to: '/' },
  { label: 'املاک', to: '/properties' },
  { label: 'درباره ما', to: '/about' },
  { label: 'خدمات', to: '/services' },
  { label: 'تیم', to: '/team' },
  { label: 'تماس', to: '/contact' },
] as const;

export const CONTACT = {
  phone: '(555) 246-7890',
  phoneHref: 'tel:+15552467890',
  email: 'hello@horizonproperties.com',
  emailHref: 'mailto:hello@horizonproperties.com',
  address: ['خیابان وست‌لیک ۱۴۲۰، واحد ۴۰۰', 'آستین، تگزاس ۷۸۷۴۶'],
  hours: 'دوشنبه تا جمعه، ۹:۰۰ تا ۱۸:۰۰',
};

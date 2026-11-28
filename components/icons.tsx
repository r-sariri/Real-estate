import type { SVGProps } from "react";

/**
 * Hand-tuned line icon set (jewellery / commerce / admin).
 * Stroke-based, 1.5px — no icon dependency, no external font/CDN.
 */
const paths: Record<string, React.ReactNode> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7.5 3.2C19.5 15.4 12 20 12 20Z" />,
  cart: <><path d="M3 4h2l2.2 10.4A2 2 0 0 0 9.2 16h8.4a2 2 0 0 0 2-1.6L21 7H6" /><circle cx="10" cy="20" r="1.2" /><circle cx="18" cy="20" r="1.2" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h10" /></>,
  close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronLeft: <path d="m14 6-6 6 6 6" />,
  chevronRight: <path d="m10 6 6 6-6 6" />,
  arrowLeft: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
  arrowRight: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  star: <path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.8l5.9-.8Z" />,
  diamond: <><path d="M6 4h12l3 5-9 11L3 9Z" /><path d="M3 9h18" /><path d="M9.5 4 8 9l4 11 4-11-1.5-5" /></>,
  sparkle: <><path d="M12 3v4" /><path d="M12 17v4" /><path d="M3 12h4" /><path d="M17 12h4" /><path d="m6 6 2.5 2.5" /><path d="m15.5 15.5 2.5 2.5" /><path d="m18 6-2.5 2.5" /><path d="m8.5 15.5-2.5 2.5" /></>,
  gold: <><ellipse cx="12" cy="7" rx="7" ry="3" /><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7" /><path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" /></>,
  truck: <><path d="M2 6h11v9H2z" /><path d="M13 9h4l3 3v3h-7" /><circle cx="6" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>,
  shield: <><path d="M12 3 5 6v6c0 4 3 7.4 7 9 4-1.6 7-5 7-9V6Z" /><path d="m9 12 2 2 4-4" /></>,
  gift: <><path d="M4 10h16v10H4z" /><path d="M2 6h20v4H2z" /><path d="M12 6v14" /><path d="M12 6C10 6 7.5 5 7.5 3.4A1.9 1.9 0 0 1 10.9 2.6C11.9 3.4 12 6 12 6Z" /><path d="M12 6c2 0 4.5-1 4.5-2.6a1.9 1.9 0 0 0-3.4-.8C12.1 3.4 12 6 12 6Z" /></>,
  phone: <path d="M6 3h3l2 5-2.4 1.5a11 11 0 0 0 5.9 5.9L16 13l5 2v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4 6.2 2 2 0 0 1 6 3Z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
  mapPin: <><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></>,
  instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="0.8" /></>,
  telegram: <path d="m21 4-3 16-6-4.5L21 4ZM12 15.5 9 18l-.5-4.5L21 4Z" />,
  whatsapp: <><path d="M20 12a8 8 0 0 1-11.7 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><path d="M12 16h.01" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  filter: <><path d="M4 6h16" /><path d="M7 12h10" /><path d="M10 18h4" /></>,
  package: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z" /><path d="M4 7.5 12 12l8-4.5" /><path d="M12 12v9" /></>,
  creditCard: <><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 10h19" /></>,
  logout: <><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 8l-4 4 4 4" /><path d="M6 12h9" /></>,
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 5.2a3.5 3.5 0 0 1 0 5.6" /><path d="M18 20a6.4 6.4 0 0 0-2-4.6" /></>,
  tag: <><path d="M3 12V4h8l9 9-8 8Z" /><circle cx="7.5" cy="7.5" r="1.3" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="8.5" cy="9.5" r="1.6" /><path d="m4 18 5.5-5 4 3.5 3-2.5L20 18" /></>,
  megaphone: <><path d="M4 10v4l10 5V5Z" /><path d="M14 8h3a3 3 0 0 1 0 6h-3" /><path d="M7 15v3a2 2 0 0 0 4 0v-1" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.5a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.7h4l.4-2.7a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" /></>,
  chart: <><path d="M4 20V4" /><path d="M4 20h16" /><path d="m7 15 4-5 3 3 5-7" /></>,
  edit: <><path d="M4 20h4L20 8l-4-4L4 16Z" /><path d="m14 6 4 4" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  quote: <path d="M9 6c-3 1-4.5 3.4-4.5 6.5V18h5v-6H6c0-2 .8-3.4 3-4.5Zm10 0c-3 1-4.5 3.4-4.5 6.5V18h5v-6H16c0-2 .8-3.4 3-4.5Z" />,
  ruler: <><rect x="2.5" y="8" width="19" height="8" rx="2" transform="rotate(-8 12 12)" /><path d="M7 9v3" /><path d="M11 8.5v3" /><path d="M15 8v3" /></>,
  scale: <><path d="M12 4v16" /><path d="M6 20h12" /><path d="M4 9h16" /><path d="M7 9 4 15h6Z" /><path d="m17 9-3 6h6Z" /></>,
  home: <><path d="m3 11 9-7 9 7" /><path d="M6 10v10h12V10" /></>,
  receipt: <><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2Z" /><path d="M9 8h6" /><path d="M9 12h6" /></>,
  lock: <><rect x="4.5" y="10" width="15" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c3 3.6 3 14.4 0 18-3-3.6-3-14.4 0-18Z" /></>,
  leaf: <><path d="M20 4c-9 0-15 4-15 10a6 6 0 0 0 6 6c6 0 9-6 9-16Z" /><path d="M9 15c2-3 5-5 8-6" /></>,
  hammer: <><path d="m14 6 4 4" /><path d="M4 20 16 8l-2-2L2 18Z" /><path d="m13 5 3-3 6 6-3 3Z" /></>,
};

export type IconName = keyof typeof paths;

export function Icon({
  name,
  size = 20,
  filled = false,
  ...props
}: { name: IconName; size?: number; filled?: boolean } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

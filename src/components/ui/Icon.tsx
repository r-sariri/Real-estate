import type { CSSProperties, SVGProps } from 'react';

export type IconName =
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up-right'
  | 'phone'
  | 'mail'
  | 'pin'
  | 'bed'
  | 'bath'
  | 'area'
  | 'calendar'
  | 'heart'
  | 'check'
  | 'close'
  | 'search'
  | 'key'
  | 'instagram'
  | 'linkedin'
  | 'facebook'
  | 'clock'
  | 'shield'
  | 'trend'
  | 'home'
  | 'sliders'
  | 'compass'
  | 'tag'
  | 'megaphone'
  | 'sun'
  | 'moon';

const paths: Record<IconName, React.ReactNode> = {
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  'arrow-left': <path d="M19 12H5M11 18l-6-6 6-6" />,
  'arrow-up-right': <path d="M7 17 17 7M8 7h9v9" />,
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  ),
  mail: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 6.5 7.4 5.6a2 2 0 0 0 2.2 0l7.4-5.6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.5s7.2-5.9 7.2-11.4a7.2 7.2 0 1 0-14.4 0C4.8 15.6 12 21.5 12 21.5Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  bed: (
    <>
      <path d="M2.5 18.5v-8h19v8M2.5 18.5h19M2.5 18.5V21M21.5 18.5V21" />
      <path d="M5.5 10.5V7h5.2a3 3 0 0 1 3 3v.5" />
    </>
  ),
  bath: (
    <>
      <path d="M3 12.5h18v2.6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2.6Z" />
      <path d="M6.5 12.5V6.6a2.1 2.1 0 0 1 4.1-.6" />
      <path d="M7 19.1 6 21.5M17 19.1l1 2.4" />
    </>
  ),
  area: <path d="M4 9V4h5M20 15v5h-5M15 4h5v5M9 20H4v-5" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>
  ),
  heart: (
    <path d="M20.8 5.6a5.1 5.1 0 0 0-7.2 0L12 7.2l-1.6-1.6a5.1 5.1 0 1 0-7.2 7.2L12 21l8.8-8.2a5.1 5.1 0 0 0 0-7.2Z" />
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="16" r="4" />
      <path d="m11 13 9-9M17 4l3 3M14.5 6.5l3 3" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <path d="M17.2 6.8h.01" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10.5V17M7.5 7.2v.01M11.5 17v-3.6a2.4 2.4 0 0 1 4.8 0V17M11.5 10.5V17" />
    </>
  ),
  facebook: <path d="M14.5 8.5h3V5h-3a4 4 0 0 0-4 4v2.5H8v3.4h2.5V21h3.4v-6.1h3l.6-3.4h-3.6V9.3c0-.5.3-.8.6-.8Z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3.2 2" />
    </>
  ),
  shield: <path d="M12 3 19 6v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" />,
  trend: <path d="M3 17.5 9 11l4 4 8-8.5M21 6.5v5M21 6.5h-5" />,
  home: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-9.5Z" />,
  sliders: <path d="M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  tag: (
    <>
      <path d="M20.6 12.6 12.4 20.8a2 2 0 0 1-2.8 0l-6.4-6.4a2 2 0 0 1-.6-1.4V4.5A1.5 1.5 0 0 1 4.1 3h8.5a2 2 0 0 1 1.4.6l6.6 6.6a2 2 0 0 1 0 2.4Z" />
      <path d="M7.6 7.6h.01" />
    </>
  ),
  megaphone: (
    <>
      <path d="M3 11v3a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1Z" />
      <path d="M14 8.5a5 5 0 0 1 0 7M17 5.5a9 9 0 0 1 0 13" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.1M12 19.3v2.1M2.6 12h2.1M19.3 12h2.1M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5" />
    </>
  ),
  moon: <path d="M20.6 14.4A8.7 8.7 0 0 1 9.6 3.4a8.7 8.7 0 1 0 11 11Z" />,
};

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  style?: CSSProperties;
};

export function Icon({ name, size = 20, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      data-icon={name}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 34 34"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.5 15.5 17 5.5l12.5 10" />
      <path d="M9.5 14.5V28M17 14.5V28M24.5 14.5V28" />
    </svg>
  );
}

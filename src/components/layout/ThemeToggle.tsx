import { useState } from 'react';
import { Icon } from '../ui/Icon';
import './ThemeToggle.css';

const STORAGE_KEY = 'horizon:theme';

type Theme = 'light' | 'dark';

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';

    document.documentElement.dataset.theme = next;

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Storage can be unavailable in private mode. */
    }

    setTheme(next);
  };

  const label = theme === 'dark' ? 'روشن کردن تم' : 'تاریک کردن تم';

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} strokeWidth={1.6} />
    </button>
  );
}

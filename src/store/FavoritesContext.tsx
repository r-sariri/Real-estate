import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const KEY = 'horizon:favorites';

type FavoritesValue = {
  ids: string[];
  count: number;
  isFavorite: (slug: string) => boolean;
  toggle: (slug: string) => void;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(read);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      /* ignore unavailable storage */
    }
  }, [ids]);

  const toggle = useCallback((slug: string) => {
    setIds((current) => (current.includes(slug) ? current.filter((id) => id !== slug) : [...current, slug]));
  }, []);

  const value = useMemo<FavoritesValue>(
    () => ({
      ids,
      count: ids.length,
      isFavorite: (slug: string) => ids.includes(slug),
      toggle,
    }),
    [ids, toggle],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesValue {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}

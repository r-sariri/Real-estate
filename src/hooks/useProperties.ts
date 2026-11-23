import { useEffect, useState } from 'react';
import { getProperty, listProperties } from '../data/repository';
import type { Property } from '../data/types';

export function useProperties() {
  const [properties, setProperties] = useState<Property[] | null>(null);

  useEffect(() => {
    let active = true;
    listProperties().then((result) => {
      if (active) setProperties(result);
    });
    return () => {
      active = false;
    };
  }, []);

  return { properties: properties ?? [], loading: properties === null };
}

export function useProperty(slug: string | undefined) {
  const [state, setState] = useState<{ property: Property | null; loading: boolean }>({
    property: null,
    loading: true,
  });

  useEffect(() => {
    if (!slug) {
      setState({ property: null, loading: false });
      return;
    }
    let active = true;
    setState((current) => ({ ...current, loading: true }));
    getProperty(slug).then((property) => {
      if (active) setState({ property: property ?? null, loading: false });
    });
    return () => {
      active = false;
    };
  }, [slug]);

  return state;
}

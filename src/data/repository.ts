import { properties } from './properties';
import { agents } from './agents';
import { services } from './services';
import type { Agent, Inquiry, InquiryInput, Property, Service } from './types';

/**
 * Data access layer.
 *
 * Everything the UI needs goes through these functions, so the local dataset can
 * be replaced by a database-backed API later without touching components.
 */

const latency = <T,>(payload: T, ms = 40): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(payload), ms);
  });

export async function listProperties(): Promise<Property[]> {
  return latency(properties.slice());
}

export async function getProperty(slug: string): Promise<Property | undefined> {
  return latency(properties.find((property) => property.slug === slug));
}

export async function listFeatured(limit = 6): Promise<Property[]> {
  const featured = properties.filter((property) => property.featured);
  const rest = properties.filter((property) => !property.featured);
  return latency([...featured, ...rest].slice(0, limit));
}

export async function listSimilar(slug: string, limit = 3): Promise<Property[]> {
  const current = properties.find((property) => property.slug === slug);
  if (!current) return latency([]);
  const ranked = properties
    .filter((property) => property.slug !== slug)
    .sort((a, b) => {
      const score = (property: Property) =>
        (property.type === current.type ? 2 : 0) +
        (property.region === current.region ? 1 : 0) +
        (Math.abs(property.price - current.price) < 1_500_000 ? 1 : 0);
      return score(b) - score(a);
    });
  return latency(ranked.slice(0, limit));
}

export async function listAgents(): Promise<Agent[]> {
  return latency(agents.slice());
}

export async function listServices(): Promise<Service[]> {
  return latency(services.slice());
}

/* --------------------------------------------------------------------------
   Local persistence for inquiries and newsletter sign-ups.
   Swap these bodies for API calls when a backend is connected.
   -------------------------------------------------------------------------- */

const INQUIRY_KEY = 'horizon:inquiries';
const NEWSLETTER_KEY = 'horizon:newsletter';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — the submission still resolves for the user */
  }
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function submitInquiry(input: InquiryInput): Promise<{ ok: true; inquiry: Inquiry }> {
  const inquiry: Inquiry = {
    ...input,
    id: newId(),
    createdAt: new Date().toISOString(),
  };
  const existing = readJson<Inquiry[]>(INQUIRY_KEY, []);
  writeJson(INQUIRY_KEY, [inquiry, ...existing].slice(0, 250));
  await latency(true, 550);
  return { ok: true, inquiry };
}

export async function subscribeToNewsletter(email: string): Promise<{ ok: true }> {
  const existing = readJson<string[]>(NEWSLETTER_KEY, []);
  if (!existing.includes(email)) writeJson(NEWSLETTER_KEY, [email, ...existing]);
  await latency(true, 400);
  return { ok: true };
}

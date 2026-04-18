// SERVER ONLY — reads from local JSON files via lib/data.ts (uses Node fs).
// Do NOT import this file from client components.
import { readJSON } from './data';
import type { Property, Emirate, Agent } from './types';

export async function getEmiratesWithCounts(): Promise<Emirate[]> {
  const emirates = readJSON<Emirate[]>('emirates.json');
  const properties = readJSON<Property[]>('properties.json');
  return emirates
    .map((e) => ({
      ...e,
      property_count: properties.filter((p) => p.emirate_slug === e.slug).length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getEmirateBySlug(slug: string): Promise<Emirate | null> {
  const emirates = readJSON<Emirate[]>('emirates.json');
  const properties = readJSON<Property[]>('properties.json');
  const emirate = emirates.find((e) => e.slug === slug) ?? null;
  if (!emirate) return null;
  return {
    ...emirate,
    property_count: properties.filter((p) => p.emirate_slug === slug).length,
  };
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const properties = readJSON<Property[]>('properties.json');
  const featured = properties
    .filter((p) => p.is_featured)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Newest featured always leads, then diversify by emirate, then extras.
  if (featured.length === 0) return [];
  const [newest, ...rest] = featured;

  const seen = new Set<string>([newest.emirate_slug]);
  const perEmirate: Property[] = [];
  const extras: Property[] = [];

  for (const p of rest) {
    if (!seen.has(p.emirate_slug)) {
      seen.add(p.emirate_slug);
      perEmirate.push(p);
    } else {
      extras.push(p);
    }
  }

  return [newest, ...perEmirate, ...extras].slice(0, 7);
}

export async function getPropertiesByEmirate(
  emirateSlug: string,
  filters?: {
    priceType?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
  }
): Promise<Property[]> {
  const properties = readJSON<Property[]>('properties.json');
  let result = properties.filter((p) => p.emirate_slug === emirateSlug);

  if (filters?.priceType && filters.priceType !== 'all') {
    result = result.filter((p) => p.price_type === filters.priceType);
  }
  if (filters?.propertyType && filters.propertyType !== 'all') {
    result = result.filter((p) => p.property_type === filters.propertyType);
  }
  if (filters?.minPrice) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters?.bedrooms) {
    result = result.filter((p) => p.bedrooms !== null && p.bedrooms >= filters.bedrooms!);
  }

  return result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
}

export async function getAllProperties(): Promise<Property[]> {
  const properties = readJSON<Property[]>('properties.json');
  return properties.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const properties = readJSON<Property[]>('properties.json');
  return properties.find((p) => p.id === id) ?? null;
}

export async function searchProperties(params: {
  listingType?: string;
  propertyType?: string;
  emirateSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
}): Promise<Property[]> {
  const properties = readJSON<Property[]>('properties.json');
  let result = [...properties];

  if (params.listingType && params.listingType !== 'all') {
    result = result.filter((p) => p.price_type === params.listingType);
  }
  if (params.propertyType && params.propertyType !== 'all') {
    result = result.filter((p) => p.property_type === params.propertyType);
  }
  if (params.emirateSlug && params.emirateSlug !== 'all') {
    result = result.filter((p) => p.emirate_slug === params.emirateSlug);
  }
  if (params.minPrice) {
    result = result.filter((p) => p.price >= params.minPrice!);
  }
  if (params.maxPrice) {
    result = result.filter((p) => p.price <= params.maxPrice!);
  }
  if (params.bedrooms && params.bedrooms !== 'any') {
    result = result.filter(
      (p) => p.bedrooms !== null && p.bedrooms >= parseInt(params.bedrooms!)
    );
  }

  return result
    .sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
    .slice(0, 50);
}

export async function getDefaultAgent(): Promise<Agent | null> {
  const agents = readJSON<Agent[]>('agents.json');
  return agents[0] ?? null;
}

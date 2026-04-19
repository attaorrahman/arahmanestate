// SERVER ONLY — reads from Supabase.
// Do NOT import this file from client components.
import { supabaseServer } from './supabase-server';
import type { Property, Emirate, Agent } from './types';

export async function getEmiratesWithCounts(): Promise<Emirate[]> {
  const { data: emirates } = await supabaseServer.from('emirates').select('*').order('name');
  const { data: properties } = await supabaseServer.from('properties').select('emirate_slug');
  const props = properties ?? [];
  return (emirates ?? [])
    .map((e: Emirate) => ({
      ...e,
      property_count: props.filter((p: { emirate_slug: string }) => p.emirate_slug === e.slug).length,
    }))
    .sort((a: Emirate, b: Emirate) => a.name.localeCompare(b.name));
}

export async function getEmirateBySlug(slug: string): Promise<Emirate | null> {
  const { data: emirate } = await supabaseServer.from('emirates').select('*').eq('slug', slug).single();
  if (!emirate) return null;
  const { count } = await supabaseServer.from('properties').select('*', { count: 'exact', head: true }).eq('emirate_slug', slug);
  return { ...emirate, property_count: count ?? 0 } as Emirate;
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const { data } = await supabaseServer
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false });
  const featured = (data ?? []) as Property[];

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
  let query = supabaseServer.from('properties').select('*').eq('emirate_slug', emirateSlug);

  if (filters?.priceType && filters.priceType !== 'all') {
    query = query.eq('price_type', filters.priceType);
  }
  if (filters?.propertyType && filters.propertyType !== 'all') {
    query = query.eq('property_type', filters.propertyType);
  }
  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters?.bedrooms) {
    query = query.gte('bedrooms', filters.bedrooms);
  }

  const { data } = await query.order('is_featured', { ascending: false });
  return (data ?? []) as Property[];
}

export async function getAllProperties(): Promise<Property[]> {
  const { data } = await supabaseServer.from('properties').select('*').order('is_featured', { ascending: false });
  return (data ?? []) as Property[];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const { data } = await supabaseServer.from('properties').select('*').eq('id', id).single();
  return (data as Property) ?? null;
}

export async function searchProperties(params: {
  listingType?: string;
  propertyType?: string;
  emirateSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
}): Promise<Property[]> {
  let query = supabaseServer.from('properties').select('*');

  if (params.listingType && params.listingType !== 'all') {
    query = query.eq('price_type', params.listingType);
  }
  if (params.propertyType && params.propertyType !== 'all') {
    query = query.eq('property_type', params.propertyType);
  }
  if (params.emirateSlug && params.emirateSlug !== 'all') {
    query = query.eq('emirate_slug', params.emirateSlug);
  }
  if (params.minPrice) {
    query = query.gte('price', params.minPrice);
  }
  if (params.maxPrice) {
    query = query.lte('price', params.maxPrice);
  }
  if (params.bedrooms && params.bedrooms !== 'any') {
    query = query.gte('bedrooms', parseInt(params.bedrooms));
  }

  const { data } = await query.order('is_featured', { ascending: false }).limit(50);
  return (data ?? []) as Property[];
}

export async function getDefaultAgent(): Promise<Agent | null> {
  const { data } = await supabaseServer.from('agents').select('*').limit(1).single();
  return (data as Agent) ?? null;
}

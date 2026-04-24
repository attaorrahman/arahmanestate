import type { MetadataRoute } from 'next';
import { supabaseServer } from '@/lib/supabase-server';

const SITE_URL = 'https://bnhmasterkey.ae';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/properties`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/transactions`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/schedule-meeting`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ];

  let emirateRoutes: MetadataRoute.Sitemap = [];
  let propertyRoutes: MetadataRoute.Sitemap = [];

  try {
    const { data: emirates } = await supabaseServer.from('emirates').select('slug');
    emirateRoutes = (emirates ?? []).map((e: { slug: string }) => ({
      url: `${SITE_URL}/properties/${e.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    const { data: properties } = await supabaseServer
      .from('properties')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(1000);

    propertyRoutes = (properties ?? []).map((p: { id: string; created_at: string }) => ({
      url: `${SITE_URL}/property/${p.id}`,
      lastModified: new Date(p.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error('[sitemap] failed to load dynamic routes:', err);
  }

  return [...staticRoutes, ...emirateRoutes, ...propertyRoutes];
}

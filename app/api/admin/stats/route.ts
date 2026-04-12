import { NextResponse } from 'next/server';
import { readJSON } from '@/lib/data';
import type { Property, Emirate } from '@/lib/types';

interface StoredInquiry { id: string }

export async function GET() {
  try {
    const properties = readJSON<Property[]>('properties.json');
    const emirates = readJSON<Emirate[]>('emirates.json');
    const inquiries = readJSON<StoredInquiry[]>('inquiries.json');

    const byEmirate = emirates
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((e) => ({
        slug: e.slug,
        name: e.name,
        count: properties.filter((p) => p.emirate_slug === e.slug).length,
      }));

    return NextResponse.json({
      totalProperties: properties.length,
      forSale: properties.filter((p) => p.price_type === 'sale').length,
      forRent: properties.filter((p) => p.price_type === 'rent').length,
      featured: properties.filter((p) => p.is_featured).length,
      totalInquiries: inquiries.length,
      byEmirate,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to compute stats' }, { status: 500 });
  }
}

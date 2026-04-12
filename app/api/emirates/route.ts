import { NextResponse } from 'next/server';
import { readJSON } from '@/lib/data';
import type { Property, Emirate } from '@/lib/types';

export async function GET() {
  try {
    const emirates = readJSON<Emirate[]>('emirates.json');
    const properties = readJSON<Property[]>('properties.json');
    const result = emirates
      .map((e) => ({
        ...e,
        property_count: properties.filter((p) => p.emirate_slug === e.slug).length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to read emirates' }, { status: 500 });
  }
}

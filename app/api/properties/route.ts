import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { readJSON, writeJSON } from '@/lib/data';
import type { Property } from '@/lib/types';

export async function GET() {
  try {
    const properties = readJSON<Property[]>('properties.json');
    return NextResponse.json(properties);
  } catch {
    return NextResponse.json({ error: 'Failed to read properties' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const properties = readJSON<Property[]>('properties.json');
    const newProperty: Property = {
      ...body,
      id: randomUUID(),
      created_at: new Date().toISOString(),
    };
    properties.unshift(newProperty);
    writeJSON('properties.json', properties);
    return NextResponse.json(newProperty, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to create property';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

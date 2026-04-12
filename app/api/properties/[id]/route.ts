import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/data';
import type { Property } from '@/lib/types';

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const properties = readJSON<Property[]>('properties.json');
    const property = properties.find((p) => p.id === params.id);
    if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(property);
  } catch {
    return NextResponse.json({ error: 'Failed to read property' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();
    const properties = readJSON<Property[]>('properties.json');
    const idx = properties.findIndex((p) => p.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    properties[idx] = { ...properties[idx], ...body, id: params.id };
    writeJSON('properties.json', properties);
    return NextResponse.json(properties[idx]);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to update property';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const properties = readJSON<Property[]>('properties.json');
    const filtered = properties.filter((p) => p.id !== params.id);
    writeJSON('properties.json', filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}

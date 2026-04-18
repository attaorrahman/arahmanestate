import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/data';
import type { Partner } from '@/lib/types';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const partners = readJSON<Partner[]>('partners.json');
    const idx = partners.findIndex((p) => p.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }
    if (body.name !== undefined) partners[idx].name = (body.name || '').trim();
    if (body.logo_url !== undefined) partners[idx].logo_url = body.logo_url || null;
    if (body.highlight !== undefined) partners[idx].highlight = !!body.highlight;
    writeJSON('partners.json', partners);
    return NextResponse.json(partners[idx]);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to update partner';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const partners = readJSON<Partner[]>('partners.json');
    const next = partners.filter((p) => p.id !== params.id);
    if (next.length === partners.length) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }
    writeJSON('partners.json', next);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}

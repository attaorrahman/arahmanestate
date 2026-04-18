import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { readJSON, writeJSON } from '@/lib/data';
import type { Partner } from '@/lib/types';

export async function GET() {
  try {
    const partners = readJSON<Partner[]>('partners.json');
    return NextResponse.json(partners);
  } catch {
    return NextResponse.json({ error: 'Failed to read partners' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const partners = readJSON<Partner[]>('partners.json');
    const newPartner: Partner = {
      id: randomUUID(),
      name: (body.name || '').trim(),
      logo_url: body.logo_url || null,
      highlight: !!body.highlight,
      created_at: new Date().toISOString(),
    };
    if (!newPartner.name) {
      return NextResponse.json({ error: 'Partner name is required' }, { status: 400 });
    }
    partners.push(newPartner);
    writeJSON('partners.json', partners);
    return NextResponse.json(newPartner, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to create partner';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

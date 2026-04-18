import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/data';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin-auth';
import type { Property } from '@/lib/types';

interface StoredInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  property_id?: string;
  created_at: string;
  email_status?: string;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const inquiries = readJSON<StoredInquiry[]>('inquiries.json');
    const properties = readJSON<Property[]>('properties.json');
    const inq = inquiries.find((i) => i.id === params.id);
    if (!inq) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    const prop = inq.property_id
      ? properties.find((p) => p.id === inq.property_id) ?? null
      : null;
    return NextResponse.json({
      ...inq,
      phone: inq.phone ?? null,
      property_id: inq.property_id ?? null,
      email_status: inq.email_status ?? null,
      properties: prop ? { id: prop.id, title: prop.title, location: prop.location } : null,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to read inquiry' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const inquiries = readJSON<StoredInquiry[]>('inquiries.json');
    const next = inquiries.filter((i) => i.id !== params.id);
    if (next.length === inquiries.length) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    writeJSON('inquiries.json', next);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}

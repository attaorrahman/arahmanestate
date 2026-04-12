import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { readJSON, writeJSON } from '@/lib/data';
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
}

export async function GET() {
  try {
    const inquiries = readJSON<StoredInquiry[]>('inquiries.json');
    const properties = readJSON<Property[]>('properties.json');

    const result = inquiries.map((inq) => {
      const prop = inq.property_id
        ? properties.find((p) => p.id === inq.property_id)
        : null;
      return {
        ...inq,
        phone: inq.phone ?? null,
        property_id: inq.property_id ?? null,
        properties: prop ? { title: prop.title } : null,
      };
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to read inquiries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inquiries = readJSON<StoredInquiry[]>('inquiries.json');
    const newInquiry: StoredInquiry = {
      id: randomUUID(),
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      source: body.source ?? 'contact_form',
      property_id: body.property_id,
      created_at: new Date().toISOString(),
    };
    inquiries.unshift(newInquiry);
    writeJSON('inquiries.json', inquiries);
    return NextResponse.json(newInquiry, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to save inquiry';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

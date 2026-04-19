import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data, error } = await supabaseServer.from('partners').select('*').order('created_at');
    if (error) throw new Error(error.message);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to read partners' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = (body.name || '').trim();
    if (!name) {
      return NextResponse.json({ error: 'Partner name is required' }, { status: 400 });
    }
    const { data, error } = await supabaseServer
      .from('partners')
      .insert({
        id: randomUUID(),
        name,
        logo_url: body.logo_url || null,
        highlight: !!body.highlight,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return NextResponse.json(data, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to create partner';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

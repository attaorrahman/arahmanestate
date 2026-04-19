import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = (body.name || '').trim();
    if (body.logo_url !== undefined) updates.logo_url = body.logo_url || null;
    if (body.highlight !== undefined) updates.highlight = !!body.highlight;

    const { data, error } = await supabaseServer
      .from('partners')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to update partner';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseServer.from('partners').delete().eq('id', params.id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 });
  }
}

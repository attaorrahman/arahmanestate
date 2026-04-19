import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { data, error } = await supabaseServer.from('properties').select('*').eq('id', params.id).single();
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to read property' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseServer
      .from('properties')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to update property';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { error } = await supabaseServer.from('properties').delete().eq('id', params.id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}

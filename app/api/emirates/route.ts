import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data: emirates } = await supabaseServer.from('emirates').select('*').order('name');
    const { data: properties } = await supabaseServer.from('properties').select('emirate_slug');
    const props = properties ?? [];
    const result = (emirates ?? []).map((e) => ({
      ...e,
      property_count: props.filter((p: { emirate_slug: string }) => p.emirate_slug === e.slug).length,
    }));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to read emirates' }, { status: 500 });
  }
}

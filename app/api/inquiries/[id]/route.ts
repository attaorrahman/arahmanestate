import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin-auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { data: inq, error } = await supabaseServer
      .from('inquiries')
      .select('*')
      .eq('id', params.id)
      .single();
    if (error || !inq) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    let prop = null;
    if (inq.property_id) {
      const { data } = await supabaseServer
        .from('properties')
        .select('id, title, location')
        .eq('id', inq.property_id)
        .single();
      prop = data;
    }

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
    const { error } = await supabaseServer.from('inquiries').delete().eq('id', params.id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}

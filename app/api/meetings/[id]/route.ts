import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin-auth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { error } = await supabaseServer.from('meetings').delete().eq('id', params.id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete meeting' }, { status: 500 });
  }
}

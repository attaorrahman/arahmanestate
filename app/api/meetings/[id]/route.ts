import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/data';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin-auth';
import type { Meeting } from '@/lib/types';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const meetings = readJSON<Meeting[]>('meetings.json');
    const next = meetings.filter((m) => m.id !== params.id);
    if (next.length === meetings.length) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }
    writeJSON('meetings.json', next);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete meeting' }, { status: 500 });
  }
}

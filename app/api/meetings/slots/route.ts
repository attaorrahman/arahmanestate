import { NextRequest, NextResponse } from 'next/server';
import { readJSON } from '@/lib/data';
import { isValidDate } from '@/lib/meeting-slots';
import type { Meeting } from '@/lib/types';

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date || !isValidDate(date)) {
    return NextResponse.json({ error: 'Valid date (YYYY-MM-DD) is required' }, { status: 400 });
  }
  try {
    const meetings = readJSON<Meeting[]>('meetings.json');
    const booked = meetings.filter((m) => m.date === date).map((m) => m.time);
    return NextResponse.json({ date, booked }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to read meetings' }, { status: 500 });
  }
}

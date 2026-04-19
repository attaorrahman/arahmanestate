import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { isValidDate } from '@/lib/meeting-slots';

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  if (!date || !isValidDate(date)) {
    return NextResponse.json({ error: 'Valid date (YYYY-MM-DD) is required' }, { status: 400 });
  }
  try {
    const { data, error } = await supabaseServer
      .from('meetings')
      .select('time')
      .eq('date', date);
    if (error) throw new Error(error.message);
    const booked = (data ?? []).map((m) => m.time);
    return NextResponse.json({ date, booked }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to read meetings' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const [
      { data: properties },
      { data: emirates },
      { data: inquiries },
      { data: meetings },
      { data: partners },
    ] = await Promise.all([
      supabaseServer.from('properties').select('*'),
      supabaseServer.from('emirates').select('*').order('name'),
      supabaseServer.from('inquiries').select('id, source, created_at'),
      supabaseServer.from('meetings').select('*'),
      supabaseServer.from('partners').select('id'),
    ]);

    const props = properties ?? [];
    const emirs = emirates ?? [];
    const inqs = inquiries ?? [];
    const mtgs = meetings ?? [];

    const byEmirate = emirs.map((e) => ({
      slug: e.slug,
      name: e.name,
      count: props.filter((p) => p.emirate_slug === e.slug).length,
    }));

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const meetingsToday = mtgs.filter((m) => m.date === todayStr);
    const meetingsUpcoming = mtgs.filter((m) => m.date > todayStr);
    const meetingsPast = mtgs.filter((m) => m.date < todayStr);

    const purposeMap: Record<string, number> = {};
    mtgs.forEach((m) => {
      purposeMap[m.purpose] = (purposeMap[m.purpose] || 0) + 1;
    });
    const meetingsByPurpose = Object.entries(purposeMap).map(([name, value]) => ({ name, value }));

    const sourceMap: Record<string, number> = {};
    inqs.forEach((inq) => {
      const label = inq.source === 'property_inquiry' ? 'Property Inquiry'
        : inq.source === 'booking' ? 'Booking'
        : 'Contact Form';
      sourceMap[label] = (sourceMap[label] || 0) + 1;
    });
    const inquiriesBySource = Object.entries(sourceMap).map(([name, value]) => ({ name, value }));

    return NextResponse.json({
      totalProperties: props.length,
      forSale: props.filter((p) => p.price_type === 'sale').length,
      forRent: props.filter((p) => p.price_type === 'rent').length,
      featured: props.filter((p) => p.is_featured).length,
      totalInquiries: inqs.length,
      byEmirate,
      totalMeetings: mtgs.length,
      meetingsToday: meetingsToday.length,
      meetingsUpcoming: meetingsUpcoming.length,
      meetingsPast: meetingsPast.length,
      meetingsByPurpose,
      inquiriesBySource,
      totalPartners: (partners ?? []).length,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to compute stats' }, { status: 500 });
  }
}

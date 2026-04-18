import { NextResponse } from 'next/server';
import { readJSON } from '@/lib/data';
import type { Property, Emirate, Meeting, Partner } from '@/lib/types';

interface StoredInquiry { id: string; source: string; created_at: string }

export async function GET() {
  try {
    const properties = readJSON<Property[]>('properties.json');
    const emirates = readJSON<Emirate[]>('emirates.json');
    const inquiries = readJSON<StoredInquiry[]>('inquiries.json');
    const meetings = readJSON<Meeting[]>('meetings.json');
    const partners = readJSON<Partner[]>('partners.json');

    const byEmirate = emirates
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((e) => ({
        slug: e.slug,
        name: e.name,
        count: properties.filter((p) => p.emirate_slug === e.slug).length,
      }));

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const meetingsToday = meetings.filter((m) => m.date === todayStr);
    const meetingsUpcoming = meetings.filter((m) => m.date > todayStr);
    const meetingsPast = meetings.filter((m) => m.date < todayStr);

    // Meetings by purpose for pie chart
    const purposeMap: Record<string, number> = {};
    meetings.forEach((m) => {
      purposeMap[m.purpose] = (purposeMap[m.purpose] || 0) + 1;
    });
    const meetingsByPurpose = Object.entries(purposeMap).map(([name, value]) => ({ name, value }));

    // Inquiries by source for pie chart
    const sourceMap: Record<string, number> = {};
    inquiries.forEach((inq) => {
      const label = inq.source === 'property_inquiry' ? 'Property Inquiry'
        : inq.source === 'booking' ? 'Booking'
        : 'Contact Form';
      sourceMap[label] = (sourceMap[label] || 0) + 1;
    });
    const inquiriesBySource = Object.entries(sourceMap).map(([name, value]) => ({ name, value }));

    return NextResponse.json({
      totalProperties: properties.length,
      forSale: properties.filter((p) => p.price_type === 'sale').length,
      forRent: properties.filter((p) => p.price_type === 'rent').length,
      featured: properties.filter((p) => p.is_featured).length,
      totalInquiries: inquiries.length,
      byEmirate,
      totalMeetings: meetings.length,
      meetingsToday: meetingsToday.length,
      meetingsUpcoming: meetingsUpcoming.length,
      meetingsPast: meetingsPast.length,
      meetingsByPurpose,
      inquiriesBySource,
      totalPartners: partners.length,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to compute stats' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabaseServer } from '@/lib/supabase-server';
import { isValidDate, isValidSlot, formatSlotLabel } from '@/lib/meeting-slots';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.bnhmasterkey.ae',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMeetingEmail(m: { name: string; email: string; phone: string; purpose: string; location: string; message: string | null; date: string; time: string }) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0D0D0D; padding: 24px; border-bottom: 3px solid #C9A84C;">
        <h1 style="color: #C9A84C; margin: 0; font-size: 22px;">New Meeting Scheduled</h1>
      </div>
      <div style="background: #f9f9f9; padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Name:</td><td>${m.name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td><a href="mailto:${m.email}">${m.email}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td><a href="tel:${m.phone}">${m.phone}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Purpose:</td><td>${m.purpose}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Location:</td><td>${m.location}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Date:</td><td>${m.date}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Time:</td><td>${formatSlotLabel(m.time)}</td></tr>
        </table>
        ${m.message ? `<div style="margin-top: 16px; padding: 16px; background: white; border-left: 3px solid #C9A84C;">
          <p style="margin: 0 0 6px; font-weight: bold;">Message:</p>
          <p style="margin: 0; line-height: 1.6;">${m.message}</p>
        </div>` : ''}
      </div>
      <div style="background: #0D0D0D; padding: 16px; text-align: center;">
        <p style="color: #888; margin: 0; font-size: 12px;">BNH MasterKey Real Estate</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"BNH MasterKey Website" <${process.env.SMTP_USER}>`,
    to: 'info@bnhmasterkey.ae',
    replyTo: m.email,
    subject: `Meeting scheduled — ${m.name} on ${m.date} at ${formatSlotLabel(m.time)}`,
    html,
  });
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { data, error } = await supabaseServer
      .from('meetings')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw new Error(error.message);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to read meetings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, string | undefined>;
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();
    const purpose = (body.purpose || '').trim();
    const location = (body.location || '').trim();
    const message = (body.message || '').toString().trim();
    const date = (body.date || '').trim();
    const time = (body.time || '').trim();

    if (!name || !email || !phone || !purpose || !location || !date || !time) {
      return NextResponse.json({ error: 'All fields except message are required.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    if (!isValidDate(date)) {
      return NextResponse.json({ error: 'Invalid date.' }, { status: 400 });
    }
    if (!isValidSlot(time)) {
      return NextResponse.json({ error: 'Invalid time slot.' }, { status: 400 });
    }

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (date < todayStr) {
      return NextResponse.json({ error: 'Cannot schedule a meeting in the past.' }, { status: 400 });
    }

    // Double-booking check
    const { data: existing } = await supabaseServer
      .from('meetings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .limit(1);
    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "Can't schedule meeting — this time slot is already booked." },
        { status: 409 }
      );
    }

    const { data: newMeeting, error } = await supabaseServer
      .from('meetings')
      .insert({
        name,
        email,
        phone,
        purpose,
        location,
        message: message || null,
        date,
        time,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    sendMeetingEmail(newMeeting).catch((err) => {
      console.error('Failed to send meeting email:', err);
    });

    return NextResponse.json(newMeeting, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to schedule meeting';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

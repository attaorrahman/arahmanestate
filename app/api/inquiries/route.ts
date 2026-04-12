import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import nodemailer from 'nodemailer';
import { readJSON, writeJSON } from '@/lib/data';
import type { Property } from '@/lib/types';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendNotificationEmail(inquiry: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0D0D0D; padding: 24px; border-bottom: 3px solid #C9A84C;">
        <h1 style="color: #C9A84C; margin: 0; font-size: 22px;">New Property Inquiry</h1>
      </div>
      <div style="background: #f9f9f9; padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #333; width: 120px;">Name:</td>
            <td style="padding: 10px 0; color: #555;">${inquiry.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #333;">Email:</td>
            <td style="padding: 10px 0; color: #555;"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td>
          </tr>
          ${inquiry.phone ? `<tr>
            <td style="padding: 10px 0; font-weight: bold; color: #333;">Phone:</td>
            <td style="padding: 10px 0; color: #555;"><a href="tel:${inquiry.phone}">${inquiry.phone}</a></td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #333;">Source:</td>
            <td style="padding: 10px 0; color: #555;">${inquiry.source}</td>
          </tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: white; border-left: 3px solid #C9A84C;">
          <p style="margin: 0 0 6px; font-weight: bold; color: #333;">Message:</p>
          <p style="margin: 0; color: #555; line-height: 1.6;">${inquiry.message}</p>
        </div>
      </div>
      <div style="background: #0D0D0D; padding: 16px; text-align: center;">
        <p style="color: #888; margin: 0; font-size: 12px;">BNH MasterKey Real Estate</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"BNH MasterKey Website" <${process.env.SMTP_USER}>`,
    to: 'info@bnhmasterkey.ae',
    replyTo: inquiry.email,
    subject: `New Inquiry from ${inquiry.name}`,
    html,
  });
}

interface StoredInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  property_id?: string;
  created_at: string;
}

export async function GET() {
  try {
    const inquiries = readJSON<StoredInquiry[]>('inquiries.json');
    const properties = readJSON<Property[]>('properties.json');

    const result = inquiries.map((inq) => {
      const prop = inq.property_id
        ? properties.find((p) => p.id === inq.property_id)
        : null;
      return {
        ...inq,
        phone: inq.phone ?? null,
        property_id: inq.property_id ?? null,
        properties: prop ? { title: prop.title } : null,
      };
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to read inquiries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inquiries = readJSON<StoredInquiry[]>('inquiries.json');
    const newInquiry: StoredInquiry = {
      id: randomUUID(),
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      source: body.source ?? 'contact_form',
      property_id: body.property_id,
      created_at: new Date().toISOString(),
    };
    inquiries.unshift(newInquiry);
    writeJSON('inquiries.json', inquiries);

    // Send email notification (don't block response if it fails)
    try {
      await sendNotificationEmail({
        name: newInquiry.name,
        email: newInquiry.email,
        phone: newInquiry.phone,
        message: newInquiry.message,
        source: newInquiry.source,
      });
    } catch (emailErr) {
      console.error('Failed to send notification email:', emailErr);
    }

    return NextResponse.json(newInquiry, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to save inquiry';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

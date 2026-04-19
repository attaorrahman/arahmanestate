import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabaseServer } from '@/lib/supabase-server';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.bnhmasterkey.ae',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465,
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
}): Promise<string> {
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

  return 'sent';
}

export async function GET() {
  try {
    const { data: inquiries, error } = await supabaseServer
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);

    // Fetch property titles for inquiries that have a property_id
    const propertyIds = (inquiries ?? [])
      .map((i) => i.property_id)
      .filter(Boolean);

    let propertiesMap: Record<string, string> = {};
    if (propertyIds.length > 0) {
      const { data: properties } = await supabaseServer
        .from('properties')
        .select('id, title')
        .in('id', propertyIds);
      propertiesMap = Object.fromEntries((properties ?? []).map((p) => [p.id, p.title]));
    }

    const result = (inquiries ?? []).map((inq) => ({
      ...inq,
      phone: inq.phone ?? null,
      property_id: inq.property_id ?? null,
      properties: inq.property_id && propertiesMap[inq.property_id]
        ? { title: propertiesMap[inq.property_id] }
        : null,
    }));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to read inquiries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data: newInquiry, error } = await supabaseServer
      .from('inquiries')
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        message: body.message,
        source: body.source ?? 'contact_form',
        property_id: body.property_id || null,
        email_status: 'pending',
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    // Send email in background — update status after attempt
    sendNotificationEmail({
      name: newInquiry.name,
      email: newInquiry.email,
      phone: newInquiry.phone,
      message: newInquiry.message,
      source: newInquiry.source,
    })
      .then(() => {
        supabaseServer.from('inquiries').update({ email_status: 'sent' }).eq('id', newInquiry.id).then(() => {});
      })
      .catch((emailErr) => {
        console.error('Failed to send notification email:', emailErr);
        const status = `failed: ${emailErr instanceof Error ? emailErr.message : String(emailErr)}`;
        supabaseServer.from('inquiries').update({ email_status: status }).eq('id', newInquiry.id).then(() => {});
      });

    return NextResponse.json(newInquiry, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to save inquiry';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

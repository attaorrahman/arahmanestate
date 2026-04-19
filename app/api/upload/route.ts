import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabaseServer } from '@/lib/supabase-server';

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const BUCKET = 'property-images';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 8MB)' }, { status: 400 });
    }

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const filename = `${randomUUID()}.${ext || 'jpg'}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabaseServer.storage
      .from(BUCKET)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: `Storage error: ${error.message}` }, { status: 500 });
    }

    // Try public URL first
    const { data: publicUrlData } = supabaseServer.storage
      .from(BUCKET)
      .getPublicUrl(filename);

    // Verify the public URL is accessible; if not, create a signed URL
    let finalUrl = publicUrlData.publicUrl;
    try {
      const check = await fetch(finalUrl, { method: 'HEAD' });
      if (!check.ok) {
        const { data: signedData, error: signedError } = await supabaseServer.storage
          .from(BUCKET)
          .createSignedUrl(filename, 60 * 60 * 24 * 365); // 1 year
        if (!signedError && signedData?.signedUrl) {
          finalUrl = signedData.signedUrl;
        }
      }
    } catch {
      // Public URL check failed, use it anyway
    }

    return NextResponse.json({ url: finalUrl }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Upload failed';
    console.error('Upload route error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

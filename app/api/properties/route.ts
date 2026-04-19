import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data, error } = await supabaseServer.from('properties').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to read properties' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseServer
      .from('properties')
      .insert({
        id: randomUUID(),
        title: body.title,
        price: body.price,
        price_type: body.price_type,
        property_type: body.property_type,
        emirate_slug: body.emirate_slug,
        location: body.location,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        sqft: body.sqft,
        image_url: body.image_url,
        images: body.images || [],
        description: body.description,
        is_featured: body.is_featured ?? false,
        is_verified: body.is_verified ?? false,
        amenities: body.amenities || [],
        latitude: body.latitude,
        longitude: body.longitude,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return NextResponse.json(data, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to create property';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

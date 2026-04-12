export interface Property {
  id: string;
  title: string;
  price: number;
  price_type: 'sale' | 'rent';
  property_type: 'apartment' | 'villa' | 'penthouse' | 'commercial' | 'townhouse';
  emirate_slug: string;
  location: string;
  bedrooms: number | null;
  bathrooms: number | null;
  sqft: number | null;
  image_url: string | null;
  description: string | null;
  is_featured: boolean;
  is_verified: boolean;
  amenities: string[];
  created_at: string;
}

export interface Emirate {
  id: string;
  name: string;
  slug: string;
  property_count: number;
  image_url: string | null;
  description: string | null;
  created_at: string;
}

export type PropertyType = 'all' | 'apartment' | 'villa' | 'penthouse' | 'commercial' | 'townhouse';
export type ListingType = 'all' | 'sale' | 'rent';

export interface Agent {
  id: string;
  name: string;
  title: string;
  photo_url: string | null;
  phone: string | null;
  email: string | null;
  rating: number;
  created_at: string;
}

export interface Inquiry {
  name: string;
  email: string;
  phone?: string;
  message: string;
  property_id?: string;
  source: 'contact_form' | 'property_inquiry';
}

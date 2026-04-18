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
  images: string[];
  description: string | null;
  is_featured: boolean;
  is_verified: boolean;
  amenities: string[];
  latitude: number | null;
  longitude: number | null;
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
  source: 'contact_form' | 'property_inquiry' | 'booking';
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  highlight: boolean;
  created_at: string;
}

export interface Meeting {
  id: string;
  name: string;
  email: string;
  phone: string;
  purpose: string;
  location: string;
  message: string | null;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  created_at: string;
}

export interface Transaction {
  id: string;
  project_name: string;
  building_name: string;
  unit_type: string;
  bedrooms: number | string;
  area_sqft: number;
  price: number;
  price_per_sqft: number;
  transaction_type: 'Sale' | 'Resale';
  property_usage: 'Residential' | 'Commercial';
  location: string;
  emirate: string;
  sold_by: 'Developer' | 'Individual';
  date: string;
  capital_gain: number;
}

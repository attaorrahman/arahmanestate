'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createProperty, updateProperty, getAllEmirates } from '@/lib/admin-queries';
import type { Property } from '@/lib/types';

interface FormData {
  title: string;
  price: string;
  price_type: 'sale' | 'rent';
  property_type: 'apartment' | 'villa' | 'penthouse' | 'commercial' | 'townhouse';
  emirate_slug: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  image_url: string;
  description: string;
  is_featured: boolean;
  is_verified: boolean;
  amenities: string;
}

const EMPTY: FormData = {
  title: '', price: '', price_type: 'sale', property_type: 'apartment',
  emirate_slug: 'dubai', location: '', bedrooms: '', bathrooms: '',
  sqft: '', image_url: '', description: '', is_featured: false,
  is_verified: true, amenities: '',
};

const EMIRATES = [
  { slug: 'dubai', name: 'Dubai' },
  { slug: 'abu-dhabi', name: 'Abu Dhabi' },
  { slug: 'sharjah', name: 'Sharjah' },
  { slug: 'ajman', name: 'Ajman' },
  { slug: 'ras-al-khaimah', name: 'Ras Al Khaimah' },
  { slug: 'fujairah', name: 'Fujairah' },
  { slug: 'umm-al-quwain', name: 'Umm Al Quwain' },
];

export default function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter();
  const isEdit = !!property;

  const [form, setForm] = useState<FormData>(
    property
      ? {
          title: property.title,
          price: String(property.price),
          price_type: property.price_type,
          property_type: property.property_type,
          emirate_slug: property.emirate_slug,
          location: property.location,
          bedrooms: property.bedrooms != null ? String(property.bedrooms) : '',
          bathrooms: property.bathrooms != null ? String(property.bathrooms) : '',
          sqft: property.sqft != null ? String(property.sqft) : '',
          image_url: property.image_url || '',
          description: property.description || '',
          is_featured: property.is_featured,
          is_verified: property.is_verified,
          amenities: (property.amenities || []).join(', '),
        }
      : EMPTY
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      price: parseFloat(form.price),
      price_type: form.price_type,
      property_type: form.property_type,
      emirate_slug: form.emirate_slug,
      location: form.location.trim(),
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
      sqft: form.sqft ? parseInt(form.sqft) : null,
      image_url: form.image_url.trim() || null,
      description: form.description.trim() || null,
      is_featured: form.is_featured,
      is_verified: form.is_verified,
      amenities: form.amenities
        ? form.amenities.split(',').map((a) => a.trim()).filter(Boolean)
        : [],
    };

    try {
      if (isEdit) {
        await updateProperty(property!.id, payload);
      } else {
        await createProperty(payload as Omit<Property, 'id' | 'created_at'>);
      }
      router.push('/admin/properties');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save property.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C9A84C] transition-colors';
  const labelClass = 'block text-gray-600 text-xs font-medium uppercase tracking-wide mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/properties" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h2 className="font-display text-gray-900 font-semibold">
          {isEdit ? 'Edit Property' : 'New Property'}
        </h2>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 p-6 space-y-5">
        <h3 className="font-display text-gray-700 font-semibold text-sm uppercase tracking-wide border-b border-gray-100 pb-3">
          Basic Info
        </h3>

        <div>
          <label className={labelClass}>Title *</label>
          <input required type="text" value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Luxury Villa in Palm Jumeirah"
            className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price (AED) *</label>
            <input required type="number" min="0" value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="e.g. 5000000"
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Listing Type *</label>
            <select value={form.price_type} onChange={(e) => set('price_type', e.target.value as 'sale' | 'rent')} className={inputClass}>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Property Type *</label>
            <select value={form.property_type} onChange={(e) => set('property_type', e.target.value as FormData['property_type'])} className={inputClass}>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="penthouse">Penthouse</option>
              <option value="townhouse">Townhouse</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Emirate *</label>
            <select value={form.emirate_slug} onChange={(e) => set('emirate_slug', e.target.value)} className={inputClass}>
              {EMIRATES.map((e) => (
                <option key={e.slug} value={e.slug}>{e.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Location / Neighborhood *</label>
          <input required type="text" value={form.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="e.g. Dubai Marina, JVC, Downtown"
            className={inputClass} />
        </div>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 p-6 space-y-5">
        <h3 className="font-display text-gray-700 font-semibold text-sm uppercase tracking-wide border-b border-gray-100 pb-3">
          Details
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Bedrooms</label>
            <input type="number" min="0" value={form.bedrooms}
              onChange={(e) => set('bedrooms', e.target.value)}
              placeholder="e.g. 3" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Bathrooms</label>
            <input type="number" min="0" value={form.bathrooms}
              onChange={(e) => set('bathrooms', e.target.value)}
              placeholder="e.g. 2" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Area (sqft)</label>
            <input type="number" min="0" value={form.sqft}
              onChange={(e) => set('sqft', e.target.value)}
              placeholder="e.g. 2500" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Image URL</label>
          <input type="url" value={form.image_url}
            onChange={(e) => set('image_url', e.target.value)}
            placeholder="https://images.pexels.com/..."
            className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea rows={4} value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Describe the property..."
            className={`${inputClass} resize-none`} />
        </div>

        <div>
          <label className={labelClass}>Amenities (comma-separated)</label>
          <input type="text" value={form.amenities}
            onChange={(e) => set('amenities', e.target.value)}
            placeholder="Pool, Gym, Parking, Smart Home"
            className={inputClass} />
        </div>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 p-6">
        <h3 className="font-display text-gray-700 font-semibold text-sm uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">
          Flags
        </h3>
        <div className="flex gap-6">
          {[
            { key: 'is_featured', label: 'Featured listing' },
            { key: 'is_verified', label: 'Verified listing' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form[key as keyof FormData] as boolean}
                onChange={(e) => set(key as keyof FormData, e.target.checked)}
                className="w-4 h-4 accent-[#C9A84C]"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963f] text-black font-semibold px-6 py-2.5 rounded-sm text-sm transition-colors disabled:opacity-60"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <><Save size={14} /> {isEdit ? 'Save Changes' : 'Create Property'}</>
          )}
        </button>
        <Link
          href="/admin/properties"
          className="px-6 py-2.5 rounded-sm text-sm border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

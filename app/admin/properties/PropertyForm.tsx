'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Upload, X, Image as ImageIcon, Plus, Star } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { createProperty, updateProperty } from '@/lib/admin-queries';
import type { Property } from '@/lib/types';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), { ssr: false });

interface PropertyFormData {
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
  images: string[];
  description: string;
  is_featured: boolean;
  is_verified: boolean;
  amenities: string;
  latitude: number | null;
  longitude: number | null;
}

const EMPTY: PropertyFormData = {
  title: '', price: '', price_type: 'sale', property_type: 'apartment',
  emirate_slug: 'dubai', location: '', bedrooms: '', bathrooms: '',
  sqft: '', image_url: '', images: [], description: '', is_featured: true,
  is_verified: true, amenities: '', latitude: null, longitude: null,
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

  const [form, setForm] = useState<PropertyFormData>(
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
          images: property.images || [],
          description: property.description || '',
          is_featured: property.is_featured,
          is_verified: property.is_verified,
          amenities: (property.amenities || []).join(', '),
          latitude: property.latitude ?? null,
          longitude: property.longitude ?? null,
        }
      : EMPTY
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const mainFileRef = useRef<HTMLInputElement>(null);
  const extraFileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof PropertyFormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Server returned invalid response: ${text.slice(0, 200)}`);
    }
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    if (!data.url) throw new Error('Upload succeeded but no URL was returned');
    return data.url;
  };

  const handleMainUpload = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const url = await uploadFile(file);
      set('image_url', url);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Upload failed';
      setError(`Main image upload failed: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleExtraUpload = async (files: FileList) => {
    setError('');
    setUploadingExtra(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        urls.push(url);
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Upload failed';
      setError(`Image upload failed: ${msg}`);
    } finally {
      setUploadingExtra(false);
    }
  };

  const removeExtraImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.image_url.trim()) {
      setError('Main property image is required.');
      return;
    }

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
      images: form.images,
      description: form.description.trim() || null,
      is_featured: form.is_featured,
      is_verified: form.is_verified,
      amenities: form.amenities
        ? form.amenities.split(',').map((a) => a.trim()).filter(Boolean)
        : [],
      latitude: form.latitude,
      longitude: form.longitude,
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
            <select value={form.property_type} onChange={(e) => set('property_type', e.target.value as PropertyFormData['property_type'])} className={inputClass}>
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

      {/* ── Images Section ── */}
      <div className="bg-white rounded-sm border border-gray-100 p-6 space-y-5">
        <h3 className="font-display text-gray-700 font-semibold text-sm uppercase tracking-wide border-b border-gray-100 pb-3">
          Property Images
        </h3>

        {/* Main Image */}
        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-1.5">
              <Star size={12} className="text-[#C9A84C]" /> Main Image (Required) *
            </span>
          </label>
          <input
            ref={mainFileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleMainUpload(f);
              e.target.value = '';
            }}
          />

          {form.image_url ? (
            <div className="flex items-start gap-4">
              <div className="relative w-48 h-32 rounded-sm overflow-hidden border-2 border-[#C9A84C] bg-gray-50 shrink-0">
                <img src={form.image_url} alt="Main preview" className="w-full h-full object-cover" />
                <div className="absolute top-1.5 left-1.5 bg-[#C9A84C] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase">
                  Main
                </div>
                <button
                  type="button"
                  onClick={() => set('image_url', '')}
                  className="absolute top-1 right-1 w-6 h-6 rounded-sm bg-black/70 hover:bg-black text-white flex items-center justify-center"
                  aria-label="Remove image"
                >
                  <X size={13} />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => mainFileRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C] px-3 py-1.5 rounded-sm transition-colors disabled:opacity-50"
                >
                  <Upload size={13} /> Replace main image
                </button>
                <span className="text-xs text-gray-400">This is the cover image shown on listings</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => mainFileRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-[#C9A84C]/40 hover:border-[#C9A84C] rounded-sm px-4 py-8 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[#C9A84C] transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-[#C9A84C] rounded-full animate-spin" />
                  <span className="text-sm">Uploading...</span>
                </>
              ) : (
                <>
                  <ImageIcon size={22} />
                  <span className="text-sm font-medium">Click to upload main property image</span>
                  <span className="text-xs text-gray-400">JPG, PNG, WebP, GIF — up to 8MB</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Additional Images */}
        <div>
          <label className={labelClass}>Additional Images (Optional — Interior, Exterior, etc.)</label>
          <input
            ref={extraFileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) handleExtraUpload(files);
              e.target.value = '';
            }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {form.images.map((url, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-sm overflow-hidden border border-gray-200 bg-gray-50 group">
                <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExtraImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-sm bg-black/70 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X size={13} />
                </button>
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-sm">
                  {i + 1}
                </div>
              </div>
            ))}

            {/* Add more button */}
            <button
              type="button"
              onClick={() => extraFileRef.current?.click()}
              disabled={uploadingExtra}
              className="aspect-[4/3] border border-dashed border-gray-300 hover:border-[#C9A84C] rounded-sm flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-[#C9A84C] transition-colors disabled:opacity-50"
            >
              {uploadingExtra ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#C9A84C] rounded-full animate-spin" />
              ) : (
                <>
                  <Plus size={20} />
                  <span className="text-xs font-medium">Add Images</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Upload interior, exterior, or other property photos. You can select multiple images at once.</p>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 p-6 space-y-5">
        <h3 className="font-display text-gray-700 font-semibold text-sm uppercase tracking-wide border-b border-gray-100 pb-3">
          Property Location on Map
        </h3>
        <LocationPicker
          latitude={form.latitude}
          longitude={form.longitude}
          onChange={(lat, lng) => setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }))}
        />
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
                checked={form[key as keyof PropertyFormData] as boolean}
                onChange={(e) => set(key as keyof PropertyFormData, e.target.checked)}
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
          disabled={saving || uploading || uploadingExtra}
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

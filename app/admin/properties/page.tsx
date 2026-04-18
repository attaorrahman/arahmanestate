'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Star, Search } from 'lucide-react';
import { getAllPropertiesAdmin, deleteProperty } from '@/lib/admin-queries';
import { formatPrice } from '@/lib/utils';
import type { Property } from '@/lib/types';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    getAllPropertiesAdmin()
      .then((data) => { setProperties(data); setFiltered(data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      properties.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.emirate_slug.toLowerCase().includes(q)
      )
    );
  }, [search, properties]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert('Failed to delete property.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C] w-64"
          />
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963f] text-black font-semibold px-4 py-2 rounded-sm text-sm transition-colors"
        >
          <Plus size={15} />
          Add Property
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading properties...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No properties found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Property</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Emirate</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Type</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Price</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Status</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {property.image_url && (
                          <img
                            src={
                              property.image_url.includes('images.pexels.com')
                                ? `${property.image_url}?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop`
                                : property.image_url
                            }
                            alt=""
                            className="w-10 h-10 rounded-sm object-cover shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-gray-900 font-medium truncate max-w-[200px]">{property.title}</p>
                          <p className="text-gray-400 text-xs truncate">{property.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{property.emirate_slug.replace('-', ' ')}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-gray-600">{property.property_type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-gray-900 font-medium">{formatPrice(property.price, property.price_type)}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded-sm font-medium ${
                          property.price_type === 'sale' ? 'bg-gray-100 text-gray-600' : 'bg-[#C9A84C]/10 text-[#C9A84C]'
                        }`}>
                          {property.price_type === 'sale' ? 'For Sale' : 'For Rent'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {property.is_featured && (
                          <span className="inline-flex items-center gap-1 text-xs text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded-sm w-fit">
                            <Star size={10} className="fill-yellow-500 text-yellow-500" /> Featured
                          </span>
                        )}
                        {property.is_verified && (
                          <span className="text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded-sm w-fit">Verified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/properties/${property.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-[#C9A84C] hover:bg-[#C9A84C]/5 rounded-sm transition-colors"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(property.id, property.title)}
                          disabled={deleting === property.id}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-colors disabled:opacity-40"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-gray-400 text-xs">{filtered.length} of {properties.length} properties</p>
    </div>
  );
}

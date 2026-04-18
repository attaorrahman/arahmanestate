'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Upload, X, Image as ImageIcon, Star } from 'lucide-react';
import type { Partner } from '@/lib/types';

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; partner?: Partner } | null>(null);

  const load = () => {
    fetch('/api/partners', { cache: 'no-store' })
      .then((r) => r.ok ? r.json() : [])
      .then(setPartners)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this partner?')) return;
    const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' });
    if (res.ok) setPartners((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">{partners.length} partners</p>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963f] text-black font-semibold px-4 py-2 rounded-sm text-sm transition-colors"
        >
          <Plus size={14} /> Add Partner
        </button>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading partners...</div>
        ) : partners.length === 0 ? (
          <div className="p-12 text-center">
            <Star size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No partners yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {partners.map((p) => (
              <div
                key={p.id}
                className={`relative flex flex-col items-center gap-3 p-5 rounded-sm border transition-colors ${
                  p.highlight
                    ? 'bg-[#C9A84C]/5 border-[#C9A84C]/25'
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                {p.highlight && (
                  <span className="absolute top-2 left-2 bg-[#C9A84C] text-[8px] text-white font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                    Premium
                  </span>
                )}

                {p.logo_url ? (
                  <img src={p.logo_url} alt={p.name} className="w-16 h-16 object-contain rounded-sm" />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center">
                    <ImageIcon size={20} className="text-gray-300" />
                  </div>
                )}

                <p className={`font-display text-sm font-bold tracking-wider ${
                  p.highlight ? 'text-[#C9A84C]' : 'text-gray-700'
                }`}>
                  {p.name}
                </p>

                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setModal({ mode: 'edit', partner: p })}
                    className="text-gray-400 hover:text-[#C9A84C] transition-colors p-1"
                    aria-label="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <PartnerModal
          mode={modal.mode}
          partner={modal.partner}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}
    </div>
  );
}

function PartnerModal({
  mode, partner, onClose, onSaved,
}: {
  mode: 'add' | 'edit';
  partner?: Partner;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(partner?.name || '');
  const [logoUrl, setLogoUrl] = useState(partner?.logo_url || '');
  const [highlight, setHighlight] = useState(partner?.highlight || false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setLogoUrl(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    setSaving(true);
    setError('');
    try {
      const body = { name: name.trim(), logo_url: logoUrl || null, highlight };
      const url = mode === 'edit' ? `/api/partners/${partner!.id}` : '/api/partners';
      const res = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to save');
      }
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C9A84C] transition-colors';
  const labelClass = 'block text-gray-600 text-xs font-medium uppercase tracking-wide mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-sm border border-gray-100 w-full max-w-md mx-4 p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-gray-900 font-semibold">
            {mode === 'edit' ? 'Edit Partner' : 'Add Partner'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Company name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. EMAAR"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Company logo</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
                e.target.value = '';
              }}
            />

            {logoUrl ? (
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt="Logo preview" className="w-14 h-14 object-contain rounded-sm border border-gray-200 bg-gray-50" />
                <div className="flex flex-col gap-1.5">
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="text-xs text-gray-600 hover:text-[#C9A84C] border border-gray-200 px-2.5 py-1 rounded-sm inline-flex items-center gap-1.5 disabled:opacity-50">
                    <Upload size={11} /> Replace
                  </button>
                  <button type="button" onClick={() => setLogoUrl('')}
                    className="text-xs text-gray-400 hover:text-red-500">Remove</button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full border border-dashed border-gray-300 hover:border-[#C9A84C] rounded-sm px-4 py-6 flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#C9A84C] transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <><div className="w-4 h-4 border-2 border-gray-300 border-t-[#C9A84C] rounded-full animate-spin" /><span className="text-xs">Uploading...</span></>
                ) : (
                  <><ImageIcon size={18} /><span className="text-xs">Click to upload logo</span></>
                )}
              </button>
            )}
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={highlight}
              onChange={(e) => setHighlight(e.target.checked)}
              className="w-4 h-4 accent-[#C9A84C]"
            />
            <span className="text-sm text-gray-700">Premium partner</span>
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963f] text-black font-semibold px-5 py-2.5 rounded-sm text-sm transition-colors disabled:opacity-60"
            >
              {saving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : mode === 'edit' ? 'Save Changes' : 'Add Partner'}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-sm text-sm border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

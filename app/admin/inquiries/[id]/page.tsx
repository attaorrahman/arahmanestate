'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, User, MessageSquare, Calendar, Tag, Building2, Trash2,
  CircleCheck as CheckCircle2, AlertTriangle, Clock,
} from 'lucide-react';

interface InquiryDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  source: string;
  property_id: string | null;
  created_at: string;
  email_status: string | null;
  properties: { id: string; title: string; location: string } | null;
}

function sourceLabel(source: string) {
  if (source === 'property_inquiry') return 'Property Inquiry';
  if (source === 'booking') return 'Booking Request';
  return 'Contact Form';
}

function sourceBadgeClass(source: string) {
  if (source === 'property_inquiry') return 'bg-blue-50 text-blue-700 border-blue-100';
  if (source === 'booking') return 'bg-purple-50 text-purple-700 border-purple-100';
  return 'bg-gray-50 text-gray-700 border-gray-200';
}

export default function InquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [inq, setInq] = useState<InquiryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/inquiries/${id}`, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Not found');
        setInq(await res.json());
      })
      .catch(() => setError('Inquiry not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this inquiry permanently?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.replace('/admin/inquiries');
    } catch {
      alert('Failed to delete inquiry.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="h-6 w-40 bg-gray-100 animate-pulse rounded-sm" />
        <div className="bg-white rounded-sm border border-gray-100 p-8 h-64 animate-pulse" />
      </div>
    );
  }

  if (error || !inq) {
    return (
      <div className="max-w-2xl">
        <Link href="/admin/inquiries" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm mb-6">
          <ArrowLeft size={15} /> Back to Inquiries
        </Link>
        <div className="bg-white rounded-sm border border-gray-100 p-12 text-center">
          <MessageSquare size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">{error || 'Inquiry not found.'}</p>
        </div>
      </div>
    );
  }

  const detailRows = [
    { icon: User, label: 'Name', value: inq.name },
    { icon: Mail, label: 'Email', value: inq.email, href: `mailto:${inq.email}` },
    ...(inq.phone ? [{ icon: Phone, label: 'Phone', value: inq.phone, href: `tel:${inq.phone}` }] : []),
    { icon: Tag, label: 'Source', value: sourceLabel(inq.source), badge: true },
    { icon: Calendar, label: 'Submitted', value: new Date(inq.created_at).toLocaleString('en-GB', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }) },
  ];

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/inquiries" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm transition-colors">
          <ArrowLeft size={15} /> Back to Inquiries
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-sm transition-colors disabled:opacity-50"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-gray-900 font-semibold text-lg">{inq.name}</h2>
            <p className="text-gray-400 text-xs mt-0.5">{inq.email}</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-sm font-medium border shrink-0 ${sourceBadgeClass(inq.source)}`}>
            {sourceLabel(inq.source)}
          </span>
        </div>

        {/* Email delivery status */}
        {inq.email_status && (
          <div className={`mx-6 mt-5 flex items-start gap-2 text-sm px-3 py-2 rounded-sm border ${
            inq.email_status === 'sent'
              ? 'bg-green-50 border-green-100 text-green-700'
              : inq.email_status === 'pending'
              ? 'bg-yellow-50 border-yellow-100 text-yellow-700'
              : 'bg-red-50 border-red-100 text-red-600'
          }`}>
            {inq.email_status === 'sent' ? (
              <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
            ) : inq.email_status === 'pending' ? (
              <Clock size={15} className="mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            )}
            <div>
              <p className="font-medium text-xs">
                {inq.email_status === 'sent'
                  ? 'Email notification delivered to info@bnhmasterkey.ae'
                  : inq.email_status === 'pending'
                  ? 'Email notification pending…'
                  : 'Email notification failed'}
              </p>
              {inq.email_status.startsWith('failed:') && (
                <p className="text-xs mt-0.5 opacity-80">{inq.email_status.replace('failed: ', '')}</p>
              )}
            </div>
          </div>
        )}

        {/* Detail rows */}
        <div className="px-6 py-5 space-y-4">
          {detailRows.map(({ icon: Icon, label, value, href, badge }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-sm bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={14} className="text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs uppercase tracking-wider">{label}</p>
                {href ? (
                  <a href={href} className="text-sm text-[#C9A84C] hover:underline break-all">{value}</a>
                ) : badge ? (
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-sm font-medium mt-0.5 border ${sourceBadgeClass(inq.source)}`}>
                    {value}
                  </span>
                ) : (
                  <p className="text-sm text-gray-800">{value}</p>
                )}
              </div>
            </div>
          ))}

          {/* Property reference */}
          {inq.properties && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-sm bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                <Building2 size={14} className="text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs uppercase tracking-wider">Related Property</p>
                <Link
                  href={`/property/${inq.properties.id}`}
                  target="_blank"
                  className="text-sm text-[#C9A84C] hover:underline"
                >
                  {inq.properties.title}
                </Link>
                <p className="text-gray-400 text-xs">{inq.properties.location}</p>
              </div>
            </div>
          )}
        </div>

        {/* Message */}
        <div className="px-6 py-5 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={14} className="text-gray-400" />
            <p className="text-gray-400 text-xs uppercase tracking-wider">Message</p>
          </div>
          <div className="bg-[#FAFAF8] border border-gray-100 rounded-sm p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {inq.message}
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-wrap gap-3">
          <a
            href={`mailto:${inq.email}?subject=Re: Your inquiry — BNH MasterKey`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C] px-3 py-1.5 rounded-sm transition-colors"
          >
            <Mail size={12} /> Reply via Email
          </a>
          {inq.phone && (
            <a
              href={`tel:${inq.phone}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-[#C9A84C] border border-gray-200 hover:border-[#C9A84C] px-3 py-1.5 rounded-sm transition-colors"
            >
              <Phone size={12} /> Call
            </a>
          )}
          {inq.phone && (
            <a
              href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-green-600 border border-gray-200 hover:border-green-300 px-3 py-1.5 rounded-sm transition-colors"
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

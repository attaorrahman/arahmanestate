'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, CircleCheck as CheckCircle2, AlertTriangle } from 'lucide-react';
import { getAllInquiries } from '@/lib/admin-queries';
import type { InquiryWithProperty } from '@/lib/admin-queries';

function sourceLabel(source: string) {
  if (source === 'property_inquiry') return 'Property';
  if (source === 'booking') return 'Booking';
  return 'Contact Form';
}

function sourceBadgeClass(source: string) {
  if (source === 'property_inquiry') return 'bg-blue-50 text-blue-700';
  if (source === 'booking') return 'bg-purple-50 text-purple-700';
  return 'bg-gray-100 text-gray-600';
}

export default function InquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<InquiryWithProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllInquiries()
      .then(setInquiries)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm">{inquiries.length} total submissions</p>

      <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading inquiries...</div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No inquiries yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Contact</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Message</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Property</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Source</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Email</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    onClick={() => router.push(`/admin/inquiries/${inq.id}`)}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <p className="text-gray-900 font-medium">{inq.name}</p>
                      <p className="text-gray-400 text-xs">{inq.email}</p>
                      {inq.phone && <p className="text-gray-400 text-xs">{inq.phone}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-600 text-xs max-w-xs line-clamp-2">{inq.message}</p>
                    </td>
                    <td className="px-4 py-3">
                      {inq.properties ? (
                        <p className="text-[#C9A84C] text-xs">{inq.properties.title}</p>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${sourceBadgeClass(inq.source)}`}>
                        {sourceLabel(inq.source)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {inq.email_status === 'sent' ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle2 size={12} /> Sent
                        </span>
                      ) : inq.email_status?.startsWith('failed') ? (
                        <span className="inline-flex items-center gap-1 text-red-500 text-xs" title={inq.email_status}>
                          <AlertTriangle size={12} /> Failed
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(inq.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

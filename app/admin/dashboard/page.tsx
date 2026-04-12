'use client';

import { useEffect, useState } from 'react';
import { Building2, TrendingUp, Home, MessageSquare, Star } from 'lucide-react';
import { getDashboardStats, getAllInquiries } from '@/lib/admin-queries';
import type { DashboardStats, InquiryWithProperty } from '@/lib/admin-queries';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [inquiries, setInquiries] = useState<InquiryWithProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getAllInquiries()])
      .then(([s, i]) => { setStats(s); setInquiries(i.slice(0, 5)); })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Properties', value: stats.totalProperties, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'For Sale', value: stats.forSale, icon: Home, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'For Rent', value: stats.forRent, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Featured', value: stats.featured, icon: Star, color: 'text-[#C9A84C]', bg: 'bg-yellow-50' },
    { label: 'Total Inquiries', value: stats.totalInquiries, icon: MessageSquare, color: 'text-red-500', bg: 'bg-red-50' },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-sm border border-gray-100 p-5 h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-sm border border-gray-100 p-5">
            <div className={`w-9 h-9 ${bg} rounded-sm flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Properties by emirate */}
        <div className="bg-white rounded-sm border border-gray-100 p-6">
          <h2 className="font-display text-gray-900 font-semibold mb-4">Properties by Emirate</h2>
          <div className="space-y-3">
            {stats?.byEmirate.map(({ name, count, slug }) => {
              const pct = stats.totalProperties > 0 ? Math.round((count / stats.totalProperties) * 100) : 0;
              return (
                <div key={slug}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{name}</span>
                    <span className="text-gray-500">{count} properties</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C9A84C] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent inquiries */}
        <div className="bg-white rounded-sm border border-gray-100 p-6">
          <h2 className="font-display text-gray-900 font-semibold mb-4">Recent Inquiries</h2>
          {inquiries.length === 0 ? (
            <p className="text-gray-400 text-sm">No inquiries yet.</p>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div key={inq.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
                    <span className="text-[#C9A84C] text-xs font-bold">
                      {inq.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-900 text-sm font-medium truncate">{inq.name}</p>
                    <p className="text-gray-400 text-xs truncate">{inq.email}</p>
                    {inq.properties && (
                      <p className="text-[#C9A84C] text-xs truncate mt-0.5">{inq.properties.title}</p>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs shrink-0 ml-auto">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

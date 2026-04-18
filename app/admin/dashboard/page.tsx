'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building2, TrendingUp, Home, MessageSquare, Star,
  CalendarClock, CalendarCheck, CalendarX, Clock, Handshake,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { getDashboardStats, getAllInquiries } from '@/lib/admin-queries';
import type { DashboardStats, InquiryWithProperty } from '@/lib/admin-queries';

const GOLD = '#C9A84C';
const CHART_COLORS = ['#C9A84C', '#1A1A1A', '#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [inquiries, setInquiries] = useState<InquiryWithProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getAllInquiries()])
      .then(([s, i]) => { setStats(s); setInquiries(i.slice(0, 5)); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white rounded-sm border border-gray-100 p-5 h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const propertyCards = stats ? [
    { label: 'Total Properties', value: stats.totalProperties, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'For Sale', value: stats.forSale, icon: Home, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'For Rent', value: stats.forRent, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Featured', value: stats.featured, icon: Star, color: 'text-[#C9A84C]', bg: 'bg-yellow-50' },
    { label: 'Total Inquiries', value: stats.totalInquiries, icon: MessageSquare, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Total Partners', value: stats.totalPartners, icon: Handshake, color: 'text-teal-600', bg: 'bg-teal-50' },
  ] : [];

  const meetingCards = stats ? [
    { label: 'Total Meetings', value: stats.totalMeetings, icon: CalendarClock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: "Today's Meetings", value: stats.meetingsToday, icon: Clock, color: 'text-[#C9A84C]', bg: 'bg-yellow-50' },
    { label: 'Upcoming', value: stats.meetingsUpcoming, icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Past', value: stats.meetingsPast, icon: CalendarX, color: 'text-gray-500', bg: 'bg-gray-100' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Property + inquiry stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {propertyCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-sm border border-gray-100 p-5">
            <div className={`w-9 h-9 ${bg} rounded-sm flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Meeting stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {meetingCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Link
            key={label}
            href="/admin/meetings"
            className="bg-white rounded-sm border border-gray-100 p-5 hover:border-[#C9A84C]/40 transition-colors group"
          >
            <div className={`w-9 h-9 ${bg} rounded-sm flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="font-display text-2xl font-bold text-gray-900 group-hover:text-[#C9A84C] transition-colors">{value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Properties by Emirate — bar chart */}
        <div className="bg-white rounded-sm border border-gray-100 p-6 lg:col-span-1">
          <h2 className="font-display text-gray-900 font-semibold mb-4">Properties by Emirate</h2>
          {stats && stats.byEmirate.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.byEmirate} layout="vertical" margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#999' }} allowDecimals={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={90}
                  tick={{ fontSize: 11, fill: '#555' }}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, border: '1px solid #eee', borderRadius: 2 }}
                  formatter={(v: number) => [`${v} properties`, 'Count']}
                />
                <Bar dataKey="count" fill={GOLD} radius={[0, 3, 3, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm">No data.</p>
          )}
        </div>

        {/* Meetings by Purpose — pie chart */}
        <div className="bg-white rounded-sm border border-gray-100 p-6">
          <h2 className="font-display text-gray-900 font-semibold mb-4">Meetings by Purpose</h2>
          {stats && stats.meetingsByPurpose.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.meetingsByPurpose}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  style={{ fontSize: 10 }}
                >
                  {stats.meetingsByPurpose.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #eee', borderRadius: 2 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm">No meetings yet.</p>
          )}
        </div>

        {/* Inquiries by Source — pie chart */}
        <div className="bg-white rounded-sm border border-gray-100 p-6">
          <h2 className="font-display text-gray-900 font-semibold mb-4">Inquiries by Source</h2>
          {stats && stats.inquiriesBySource.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.inquiriesBySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  style={{ fontSize: 10 }}
                >
                  {stats.inquiriesBySource.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #eee', borderRadius: 2 }} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm">No inquiries yet.</p>
          )}
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
  );
}

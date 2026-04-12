'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Property } from '@/lib/types';
import PropertyForm from '../../PropertyForm';

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setProperty)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-gray-400 text-sm p-4">Loading property...</div>;
  }

  if (!property) {
    return <div className="text-red-500 text-sm p-4">Property not found.</div>;
  }

  return <PropertyForm property={property} />;
}

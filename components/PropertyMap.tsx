'use client';

import { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  location: string;
}

export default function PropertyMap({ latitude, longitude, title, location }: PropertyMapProps) {
  const [showDialog, setShowDialog] = useState(false);

  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed&hl=en`;

  const handleOpenGoogleMaps = () => {
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    setShowDialog(false);
  };

  return (
    <div className="bg-white rounded-sm border border-gray-100 p-8 luxury-shadow">
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
        Property Location
      </h2>
      <div className="w-12 h-0.5 bg-[#C9A84C] mb-5" />

      <div className="flex items-center gap-2 mb-4">
        <MapPin size={16} className="text-[#C9A84C]" />
        <span className="font-body text-gray-600 text-sm">{location}</span>
      </div>

      {/* Map container */}
      <div className="relative rounded-sm overflow-hidden border border-gray-200">
        <iframe
          src={embedUrl}
          className="w-full h-[320px] border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map showing ${title}`}
        />
        <button
          type="button"
          onClick={() => setShowDialog(true)}
          className="absolute bottom-3 right-3 z-[10] bg-white hover:bg-[#C9A84C] rounded-sm px-3 py-2 shadow-md flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors cursor-pointer"
        >
          <ExternalLink size={14} />
          Open in Google Maps
        </button>
      </div>

      {/* Confirmation dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" onClick={() => setShowDialog(false)}>
          <div
            className="bg-white rounded-sm border border-gray-100 p-6 shadow-xl max-w-sm mx-4 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#C9A84C]/10 rounded-sm flex items-center justify-center">
                <MapPin size={20} className="text-[#C9A84C]" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-gray-900">Open in Google Maps?</h3>
                <p className="text-xs text-gray-500 mt-0.5">View the exact property location</p>
              </div>
            </div>

            <p className="font-body text-sm text-gray-600 mb-5">
              Would you like to open <span className="font-semibold text-gray-900">{title}</span> location in Google Maps for detailed directions and navigation?
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleOpenGoogleMaps}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#b8963f] text-black font-semibold px-4 py-2.5 rounded-sm text-sm transition-colors"
              >
                <ExternalLink size={14} />
                Yes, Open Maps
              </button>
              <button
                onClick={() => setShowDialog(false)}
                className="flex-1 px-4 py-2.5 rounded-sm text-sm border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

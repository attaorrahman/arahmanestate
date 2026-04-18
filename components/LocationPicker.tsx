'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Search, Crosshair } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number | null, lng: number | null) => void;
}

const DEFAULT_CENTER: [number, number] = [25.2048, 55.2708]; // Dubai
const DEFAULT_ZOOM = 11;
const MARKER_ZOOM = 15;

export default function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const updateMarker = useCallback((lat: number, lng: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const icon = L.divIcon({
        className: '',
        html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:#C9A84C;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });
      markerRef.current = L.marker([lat, lng], { icon, draggable: true }).addTo(map);
      markerRef.current.on('dragend', () => {
        const pos = markerRef.current!.getLatLng();
        onChange(parseFloat(pos.lat.toFixed(6)), parseFloat(pos.lng.toFixed(6)));
      });
    }
    map.setView([lat, lng], Math.max(map.getZoom(), MARKER_ZOOM));
  }, [onChange]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: latitude && longitude ? [latitude, longitude] : DEFAULT_CENTER,
      zoom: latitude && longitude ? MARKER_ZOOM : DEFAULT_ZOOM,
      zoomControl: true,
    });

    L.tileLayer('https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}', {
      attribution: '&copy; Google Maps',
      maxZoom: 20,
    }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = parseFloat(e.latlng.lat.toFixed(6));
      const lng = parseFloat(e.latlng.lng.toFixed(6));
      onChange(lat, lng);
      updateMarker(lat, lng);
    });

    mapInstanceRef.current = map;

    if (latitude && longitude) {
      updateMarker(latitude, longitude);
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync marker when props change externally
  useEffect(() => {
    if (latitude && longitude && mapInstanceRef.current) {
      updateMarker(latitude, longitude);
    }
  }, [latitude, longitude, updateMarker]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearchError('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}&limit=1&countrycodes=ae`,
        { headers: { 'Accept': 'application/json' } }
      );
      const data = await res.json();
      if (data.length === 0) {
        setSearchError('Location not found. Try a different search.');
        return;
      }
      const lat = parseFloat(parseFloat(data[0].lat).toFixed(6));
      const lng = parseFloat(parseFloat(data[0].lon).toFixed(6));
      onChange(lat, lng);
      updateMarker(lat, lng);
    } catch {
      setSearchError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    onChange(null, null);
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
      mapInstanceRef.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
            placeholder="Search location in UAE..."
            className="w-full border border-gray-200 rounded-sm pl-9 pr-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C9A84C] transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#C9A84C] hover:bg-[#b8963f] text-black text-sm font-medium rounded-sm transition-colors disabled:opacity-50"
        >
          {searching ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <><Crosshair size={14} /> Find</>
          )}
        </button>
      </div>

      {searchError && <p className="text-red-500 text-xs">{searchError}</p>}

      {/* Map */}
      <div className="relative rounded-sm overflow-hidden border border-gray-200">
        <div ref={mapRef} className="h-[300px] w-full" />
        <div className="absolute bottom-2 left-2 z-[1000] bg-white/90 backdrop-blur-sm rounded-sm px-2.5 py-1.5 text-xs text-gray-500 pointer-events-none">
          Click on the map to set location
        </div>
      </div>

      {/* Coordinates display */}
      {latitude && longitude ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-sm px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-green-600" />
            <span className="text-sm text-green-800">
              {latitude}, {longitude}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-400">No location selected. Search or click on the map to pin the property location.</p>
      )}
    </div>
  );
}

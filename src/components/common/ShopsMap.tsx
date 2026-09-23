import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Shop } from '../../types/shop';
import { MapPin } from 'lucide-react';

interface ShopsMapProps {
  shops: Shop[];
  height?: string;
}

export const ShopsMap: React.FC<ShopsMapProps> = ({ shops, height = '360px' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapInstance = useRef<L.Map | null>(null);

  const validShops = (shops || []).filter(
    (s) => s && s.latitude != null && s.longitude != null && !isNaN(Number(s.latitude)) && !isNaN(Number(s.longitude))
  );

  useEffect(() => {
    if (!mapRef.current || validShops.length === 0) return;

    // Clean up existing map instance if already initialized
    if (leafletMapInstance.current) {
      leafletMapInstance.current.remove();
      leafletMapInstance.current = null;
    }

    const centerLat = Number(validShops[0].latitude);
    const centerLng = Number(validShops[0].longitude);

    // Initialize Leaflet map directly on DOM container
    const map = L.map(mapRef.current).setView([centerLat, centerLng], 12);
    leafletMapInstance.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    validShops.forEach((shop) => {
      const lat = Number(shop.latitude);
      const lng = Number(shop.longitude);

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: bold; color: #0f172a;">${shop.name}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #475569;">${shop.address || ''}</p>
          <div style="font-size: 10px; color: #047857; font-weight: bold;">Mobile: ${shop.phone || 'N/A'}</div>
        </div>
      `;

      L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent);
    });

    return () => {
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }
    };
  }, [shops]);

  if (!shops || !Array.isArray(shops) || shops.length === 0 || validShops.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-slate-100 rounded-xl p-8 border border-slate-200 text-slate-500 text-xs font-semibold"
        style={{ height }}
      >
        <MapPin className="w-5 h-5 text-slate-400 mr-2" /> No map coordinates available for this retailer's shops yet.
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="relative rounded-xl overflow-hidden border border-slate-200 shadow-xs z-0"
      style={{ height }}
    />
  );
};

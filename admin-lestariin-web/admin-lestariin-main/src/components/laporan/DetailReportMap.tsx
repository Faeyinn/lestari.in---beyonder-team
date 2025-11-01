import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { type LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Trash2, Flame, Droplet, User } from 'lucide-react';

interface DetailReportMapProps {
  position: [number, number];
  category?: string;
}

// Custom icon generator for Lucide icons
const createLucideIcon = (icon: React.ReactElement, bg: string) => {
  const svg = renderToStaticMarkup(icon);
  return L.divIcon({
    html: `<div style="background:${bg};border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
      ${svg}
    </div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const DetailReportMap: React.FC<DetailReportMapProps> = ({ position, category }) => {
  const mapCenter: LatLngExpression = [position[0], position[1]];

  // Determine icon based on category
  let icon = <Trash2 size={20} color="white" />;
  let color = '#22c55e';

  if (category === 'Pembakaran Hutan') {
    icon = <Flame size={20} color="white" />;
    color = '#ef4444';
  } else if (category === 'Penebangan Hutan') {
    icon = <User size={20} color="white" />;
    color = '#f59e0b';
  } else if (category === 'Kualitas Air') {
    icon = <Droplet size={20} color="white" />;
    color = '#3b82f6';
  } else if (category === 'Sampah') {
    icon = <Trash2 size={20} color="white" />;
    color = '#22c55e';
  }

  return (
    <div className="w-full h-48 md:h-56 rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={mapCenter}
        zoom={14}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={mapCenter} icon={createLucideIcon(icon, color)}>
          <Popup>Lokasi Laporan</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default DetailReportMap;

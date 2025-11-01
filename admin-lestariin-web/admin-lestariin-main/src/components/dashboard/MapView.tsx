import React, { useState, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import { Trash2, Flame, Droplet, User } from 'lucide-react';
import { API_ENDPOINTS } from '@/utils/apiConfig';
import type { Report } from '@/utils/reportData';

// API Report interface
interface ApiReport {
  id: number;
  image_url: string;
  description: string;
  latitude: number;
  longitude: number;
  water_classification: string;
  forest_classification: string;
  public_fire_classification: string;
  trash_classification: string;
  illegal_logging_classification: string;
  verified: boolean;
  created_at: string;
  user: {
    email: string;
    name: string;
  };
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

const heatmapCircles = [
  // Example: [lat, lng, color, radius]
  [-0.914, 100.460, '#ef4444', 300],
  [-0.912, 100.462, '#22c55e', 250],
  [-0.913, 100.467, '#3b82f6', 200],
];

const MapView: React.FC = () => {
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [apiReports, setApiReports] = useState<ApiReport[]>([]);

  // Fetch reports from API for map markers
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error('No access token found');
          return;
        }
        const response = await fetch(API_ENDPOINTS.REPORTS_ALL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Map reports data:', data); // Debug log
          setApiReports(data);
        } else {
          console.error('Failed to fetch reports for map:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching reports for map:', error);
      }
    };
    fetchReports();
  }, []);

  // Create markers from API reports (using actual lat,lng from API)
  const apiMarkers = apiReports.map((report) => {
    // Determine category and icon based on classifications
    let category = 'Laporan';
    let color = '#22c55e';
    let icon = <Trash2 size={20} />;

    // Check classifications in priority order
    if (report.public_fire_classification && report.public_fire_classification !== 'no_fire') {
      category = 'Pembakaran Hutan';
      color = '#ef4444';
      icon = <Flame size={20} color="white" />;
    } else if (report.illegal_logging_classification && report.illegal_logging_classification !== 'tidak_penebangan_liar') {
      category = 'Penebangan Hutan';
      color = '#f59e0b';
      icon = <User size={20} color="white" />; // Using User as placeholder for logging icon
    } else if (report.water_classification && report.water_classification !== 'Air_bersih') {
      category = 'Kualitas Air';
      color = '#3b82f6';
      icon = <Droplet size={20} color="white" />;
    } else if (report.trash_classification && report.trash_classification !== 'tidak_sampah') {
      category = 'Sampah';
      color = '#22c55e';
      icon = <Trash2 size={20} color="white" />;
    }

    return {
      id: report.id,
      type: 'report',
      position: [report.latitude, report.longitude], // Use actual coordinates from API
      title: category,
      description: report.description,
      date: report.created_at ? new Date(report.created_at).toLocaleDateString('id-ID') : '',
      image: report.image_url,
      color: color,
      icon: icon,
      verified: report.verified,
      user: report.user.name,
    };
  });

  // Use only API markers (no dummy data)
  const allMarkers = apiMarkers;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <MapContainer
        center={[-0.914, 100.464]}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', minHeight: 350, borderRadius: '1rem' }}
      >
        {/* Map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Heatmap effect using Circle */}
        {heatmapCircles.map(([lat, lng, color, radius], idx) => (
          <Circle
            key={idx}
            center={[lat as number, lng as number] as LatLngExpression}
            pathOptions={{ color: color as string, fillColor: color as string, fillOpacity: 0.25, opacity: 0.2 }}
            radius={radius as number}
          />
        ))}

        {/* Markers */}
        {allMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position as LatLngExpression}
            icon={createLucideIcon(marker.icon, marker.color)}
            eventHandlers={{
              click: () => setSelectedMarker(marker.id),
            }}
          >
            {selectedMarker === marker.id && (
              <Popup
                closeButton={true}
                eventHandlers={{
                  remove: () => setSelectedMarker(null),
                }}
                minWidth={180}
                maxWidth={220}
              >
                <div>
                  {marker.image && (
                    <img
                      src={marker.image}
                      alt={marker.title}
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                  )}
                  <div className="font-semibold text-sm">{marker.title}</div>
                  <div className="text-xs text-gray-600">{marker.description}</div>
                  {marker.date && (
                    <div className="text-xs text-gray-400 mt-1">{marker.date}</div>
                  )}
                  {marker.user && (
                    <div className="text-xs text-gray-500 mt-1">Oleh: {marker.user}</div>
                  )}
                  {marker.verified !== undefined && (
                    <div className={`text-xs mt-1 ${marker.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {marker.verified ? '✓ Terverifikasi' : '⏳ Menunggu Verifikasi'}
                    </div>
                  )}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
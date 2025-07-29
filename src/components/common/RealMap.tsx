import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Professional, Location } from '../../types';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RealMapProps {
    userLocation: Location;
    filteredProfessionals: Professional[];
    locationPermission: boolean;
    calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => string;
    onSelectProfessional?: (professional: Professional) => void;
}

export const RealMap: React.FC<RealMapProps> = ({
    userLocation,
    filteredProfessionals,
    locationPermission,
    calculateDistance,
    onSelectProfessional
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.LayerGroup>(new L.LayerGroup());

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map only once
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 13);

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstanceRef.current);

            // Add markers layer group
            markersRef.current.addTo(mapInstanceRef.current);
        }

        // Clear existing markers
        markersRef.current.clearLayers();

        // Add user location marker
        const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: '<div style="background: #ff4444; border: 2px solid white; border-radius: 50%; width: 16px; height: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
            .bindPopup(locationPermission ? 'La tua posizione (GPS)' : 'Posizione approssimativa')
            .addTo(markersRef.current);

        // Add professional markers
        filteredProfessionals.forEach((prof) => {
            const profIcon = L.divIcon({
                className: 'professional-marker',
                html: `<div style="background: #2563eb; border: 2px solid white; border-radius: 50%; width: 12px; height: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            });

            const distance = calculateDistance(userLocation.lat, userLocation.lng, prof.lat, prof.lng);

            const marker = L.marker([prof.lat, prof.lng], { icon: profIcon })
                .bindPopup(`
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${prof.name}</h3>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">${prof.specialty}</p>
            <div style="display: flex; align-items: center; gap: 8px; font-size: 11px; margin-bottom: 4px;">
              <span>📍 ${prof.location}</span>
              <span>⭐ ${prof.rating}</span>
              <span style="color: #2563eb;">📐 ${distance}km</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <div>
                <div style="font-weight: bold; font-size: 13px;">€${prof.price}</div>
                <div style="color: ${prof.available ? '#16a34a' : '#dc2626'}; font-size: 11px;">
                  ${prof.available ? 'Disponibile' : 'Occupato'}
                </div>
              </div>
              <button 
                onclick="window.selectProfessional_${prof.id}()" 
                style="background: #c0c0c0; border: 2px outset #c0c0c0; padding: 4px 8px; font-size: 11px; cursor: pointer;"
                ${!prof.available ? 'disabled' : ''}
              >
                Seleziona
              </button>
            </div>
          </div>
        `)
                .addTo(markersRef.current);

            // Add click handler for selecting professional
            (window as any)[`selectProfessional_${prof.id}`] = () => {
                if (onSelectProfessional) {
                    onSelectProfessional(prof);
                }
            };
        });

        // Update map view to include all markers
        if (filteredProfessionals.length > 0) {
            const group = new L.FeatureGroup([
                L.marker([userLocation.lat, userLocation.lng]),
                ...filteredProfessionals.map(prof => L.marker([prof.lat, prof.lng]))
            ]);
            mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [20, 20] });
        }

        return () => {
            // Cleanup global functions
            filteredProfessionals.forEach((prof) => {
                delete (window as any)[`selectProfessional_${prof.id}`];
            });
        };
    }, [userLocation, filteredProfessionals, locationPermission, calculateDistance, onSelectProfessional]);

    return (
        <div className="relative">
            <div
                ref={mapRef}
                className="h-64 border-2 border-gray-400 bg-white"
                style={{ boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.2)' }}
            />
            <div className="absolute top-2 right-2 bg-white bg-opacity-90 p-2 text-xs border border-gray-400">
                <div className="font-bold">Taranto, Italia</div>
                <div>{locationPermission ? 'GPS Attivo' : 'Posizione approssimativa'}</div>
            </div>
            <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 p-2 text-xs border border-gray-400">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                    <span>La tua posizione</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full border border-white"></div>
                    <span>Professionisti ({filteredProfessionals.length})</span>
                </div>
            </div>
        </div>
    );
};

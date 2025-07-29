import React from 'react';
import { Professional, Location } from '../../types';

interface SimpleMapProps {
  userLocation: Location;
  filteredProfessionals: Professional[];
  locationPermission: boolean;
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => string;
}

export const SimpleMap: React.FC<SimpleMapProps> = ({ 
  userLocation, 
  filteredProfessionals, 
  locationPermission,
  calculateDistance 
}) => (
  <div className="h-48 bg-green-100 border-2 border-gray-400 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>
      
      <div 
        className="absolute w-3 h-3 bg-red-500 rounded-full border border-white shadow-md animate-pulse"
        style={{ top: '45%', left: '48%' }}
      >
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600 whitespace-nowrap">
          Tu sei qui
        </div>
      </div>
      
      {filteredProfessionals.map((prof, idx) => (
        <div 
          key={prof.id}
          className="absolute w-2 h-2 bg-blue-500 rounded-full border border-white cursor-pointer hover:bg-blue-700"
          style={{ 
            top: `${35 + (idx * 8)}%`, 
            left: `${40 + (idx * 10)}%`,
            zIndex: 10 
          }}
          title={`${prof.name} - ${calculateDistance(userLocation.lat, userLocation.lng, prof.lat, prof.lng)}km`}
        >
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-blue-700 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
            {prof.name}
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 p-2 text-xs border border-gray-400">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>La tua posizione</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Professionisti</span>
        </div>
      </div>
      
      <div className="absolute top-2 right-2 bg-white bg-opacity-90 p-2 text-xs border border-gray-400">
        <div className="font-bold">Taranto, Italia</div>
        <div>{locationPermission ? 'GPS Attivo' : 'Posizione approssimativa'}</div>
      </div>
    </div>
  </div>
);
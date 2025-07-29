import React, { useState } from 'react';
import { Button95 } from '../common/Button95';
import { RealMap } from '../common/RealMap';
import { BookingCalendarWindow } from './BookingCalendarWindow';
import { Professional, Category, Location } from '../../types';

interface SearchWindowProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: Category[];
  filteredProfessionals: Professional[];
  userLocation: Location;
  locationPermission: boolean;
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => string;
  onBookAppointment: (professional: Professional, date: string, time: string, type: 'presenza' | 'video') => void;
  onSendMessage: (professionalName: string, message: string) => void;
  onShowMessage: (title: string, message: string, type: 'info' | 'success' | 'error') => void;
}

export const SearchWindow: React.FC<SearchWindowProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  filteredProfessionals,
  userLocation,
  locationPermission,
  calculateDistance,
  onBookAppointment,
  onSendMessage,
  onShowMessage
}) => {
  const [showBookingCalendar, setShowBookingCalendar] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [mapView, setMapView] = useState<'real' | 'simple'>('real');

  const handleBookingRequest = (professional: Professional) => {
    setSelectedProfessional(professional);
    setShowBookingCalendar(true);
  };

  const handleBookSlot = (professional: Professional, date: string, time: string, type: 'presenza' | 'video') => {
    onBookAppointment(professional, date, time, type);
    setShowBookingCalendar(false);
    setSelectedProfessional(null);
  };

  const handleCancelBooking = () => {
    setShowBookingCalendar(false);
    setSelectedProfessional(null);
  };

  const handleSelectProfessionalFromMap = (professional: Professional) => {
    handleBookingRequest(professional);
  };

  if (showBookingCalendar && selectedProfessional) {
    return (
      <BookingCalendarWindow
        professional={selectedProfessional}
        onBookSlot={handleBookSlot}
        onCancel={handleCancelBooking}
        onShowMessage={onShowMessage}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Cerca professionisti..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-2 py-1 border-2 border-gray-600 text-sm"
          style={{ boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.2)' }}
        />
        <Button95 variant="primary">🔍 Trova</Button95>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {categories.slice(0, 4).map((cat) => (
          <Button95
            key={cat.id}
            className={`text-xs p-2 flex flex-col items-center ${selectedCategory === cat.id ? 'bg-blue-200' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="text-sm mb-1">
              {cat.id === 'medici' ? '🏥' :
                cat.id === 'avvocati' ? '⚖️' :
                  cat.id === 'dentisti' ? '🦷' :
                    cat.id === 'architetti' ? '🏗️' : '📁'}
            </span>
            <span>{cat.name}</span>
            <span className="text-gray-600">({cat.count})</span>
          </Button95>
        ))}
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-sm">🗺️ Mappa Professionisti</h3>
          <div className="flex gap-1">
            <Button95
              className={`text-xs px-2 py-1 ${mapView === 'real' ? 'bg-blue-200' : ''}`}
              onClick={() => setMapView('real')}
            >
              🌍 Reale
            </Button95>
            <Button95
              className={`text-xs px-2 py-1 ${mapView === 'simple' ? 'bg-blue-200' : ''}`}
              onClick={() => setMapView('simple')}
            >
              📍 Semplice
            </Button95>
          </div>
        </div>

        {mapView === 'real' ? (
          <RealMap
            userLocation={userLocation}
            filteredProfessionals={filteredProfessionals}
            locationPermission={locationPermission}
            calculateDistance={calculateDistance}
            onSelectProfessional={handleSelectProfessionalFromMap}
          />
        ) : (
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
                  onClick={() => handleSelectProfessionalFromMap(prof)}
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
        )}
      </div>

      <div>
        <h3 className="font-bold text-sm mb-2">📋 Risultati ({filteredProfessionals.length})</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {filteredProfessionals.length === 0 ? (
            <div className="text-center text-gray-500 py-4">Nessun professionista trovato</div>
          ) : (
            filteredProfessionals.map(prof => (
              <div key={prof.id} className="border-2 border-gray-400 p-3 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-sm">{prof.name}</h3>
                    <p className="text-xs text-gray-600">{prof.specialty}</p>
                    <div className="flex items-center gap-1 text-xs">
                      <span>📍</span>
                      <span>{prof.location}</span>
                      <span className="ml-2">⭐ {prof.rating}</span>
                      <span className="ml-2 text-blue-600">
                        📐 {calculateDistance(userLocation.lat, userLocation.lng, prof.lat, prof.lng)}km
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <span>🗣️</span>
                      <span>{prof.languages.join(', ')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">€{prof.price}</div>
                    <div className={`text-xs px-1 rounded ${prof.available ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                      {prof.available ? '✅ Disponibile' : '❌ Occupato'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button95
                    className="text-xs flex-1"
                    disabled={!prof.available}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleBookingRequest(prof);
                    }}
                  >
                    📅 Prenota
                  </Button95>
                  <Button95
                    className="text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSendMessage(prof.name, "Ciao, ho una domanda sui tuoi servizi.");
                    }}
                  >
                    💬 Scrivi
                  </Button95>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
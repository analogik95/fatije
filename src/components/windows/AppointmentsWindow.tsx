import React from 'react';
import { Button95 } from '../common/Button95';
import { Appointment } from '../../types';

interface AppointmentsWindowProps {
  appointments: Appointment[];
  onShowMessage: (title: string, message: string, type: 'info' | 'success' | 'error') => void;
  onOpenWindow: (windowType: string, title: string) => void;
}

export const AppointmentsWindow: React.FC<AppointmentsWindowProps> = ({
  appointments,
  onShowMessage,
  onOpenWindow
}) => (
  <div className="space-y-4">
    <h2 className="font-bold mb-4">I Miei Appuntamenti ({appointments.length})</h2>
    
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {appointments.length === 0 ? (
        <div className="text-center text-gray-500 py-4">Nessun appuntamento programmato</div>
      ) : (
        appointments.map(appointment => (
          <div key={appointment.id} className={`border-2 border-gray-400 p-3 ${
            appointment.status === 'confermato' ? 'bg-green-50' : 
            appointment.status === 'in-attesa' ? 'bg-yellow-50' : 'bg-gray-50'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-sm">{appointment.professional}</h3>
                <p className="text-xs text-gray-600">{appointment.specialty}</p>
                <p className="text-xs">📅 {appointment.date} alle {appointment.time}</p>
                <p className="text-xs">📍 {appointment.type === 'video' ? 'Videochiamata' : 'Di persona'}</p>
              </div>
              <div className="flex gap-1">
                {appointment.type === 'video' && appointment.status === 'confermato' && (
                  <Button95 
                    className="text-xs" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onShowMessage('Videochiamata', '🎥 Avvio videochiamata...', 'info');
                    }}
                  >
                    Video
                  </Button95>
                )}
                <Button95 
                  className="text-xs" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onShowMessage(
                      'Dettagli Appuntamento',
                      `📋 Professionista: ${appointment.professional}\n📅 Data: ${appointment.date} alle ${appointment.time}\n📍 Modalità: ${appointment.type === 'video' ? 'Videochiamata' : 'Di persona'}\n⏱️ Stato: ${appointment.status}`,
                      'info'
                    );
                  }}
                >
                  Info
                </Button95>
              </div>
            </div>
            <div className={`text-xs ${
              appointment.status === 'confermato' ? 'text-green-600' : 
              appointment.status === 'in-attesa' ? 'text-yellow-600' : 'text-gray-600'
            }`}>
              {appointment.status === 'confermato' ? '✓ Confermato' : 
               appointment.status === 'in-attesa' ? '⏳ In attesa' : 'ℹ️ Completato'}
            </div>
          </div>
        ))
      )}
    </div>

    <Button95 
      variant="primary" 
      className="w-full" 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onOpenWindow('search', 'Trova Professionisti');
      }}
    >
      Prenota Nuovo Appuntamento
    </Button95>
  </div>
);
import React from 'react';
import { Button95 } from '../common/Button95';
import { Appointment, Message } from '../../types';

interface ProfessionalDashboardWindowProps {
  appointments: Appointment[];
  messages: Message[];
  onOpenWindow: (windowType: string, title: string) => void;
}

export const ProfessionalDashboardWindow: React.FC<ProfessionalDashboardWindowProps> = ({
  appointments,
  messages,
  onOpenWindow
}) => (
  <div className="space-y-4">
    <h2 className="font-bold mb-4">Dashboard Professionista</h2>
    
    <div className="border-2 border-gray-400 p-3 bg-blue-50">
      <h3 className="font-bold text-sm mb-2">Piano Premium - €49/mese</h3>
      <div className="text-xs text-gray-600">✓ Badge Premium ✓ Priorità ✓ Analytics</div>
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div className="border-2 border-gray-400 p-2 text-center">
        <div className="text-lg font-bold">127</div>
        <div className="text-xs">Clienti</div>
      </div>
      <div className="border-2 border-gray-400 p-2 text-center">
        <div className="text-lg font-bold">4.8</div>
        <div className="text-xs">Voto</div>
      </div>
      <div className="border-2 border-gray-400 p-2 text-center">
        <div className="text-lg font-bold">€3.240</div>
        <div className="text-xs">Mese</div>
      </div>
      <div className="border-2 border-gray-400 p-2 text-center">
        <div className="text-lg font-bold">{appointments.length}</div>
        <div className="text-xs">Appuntamenti</div>
      </div>
    </div>

    <div className="space-y-2">
      <Button95 className="w-full text-left" onClick={() => onOpenWindow('calendar', 'Calendario')}>
        📅 Calendario
      </Button95>
      <Button95 className="w-full text-left" onClick={() => onOpenWindow('messages', 'Posta in Arrivo')}>
        💬 Messaggi ({messages.filter(m => m.unread).length})
      </Button95>
    </div>
  </div>
);

interface CalendarWindowProps {
  onShowMessage: (title: string, message: string, type: 'info' | 'success' | 'error') => void;
}

export const CalendarWindow: React.FC<CalendarWindowProps> = ({ onShowMessage }) => {
  const today = new Date();
  const todaySchedule = [
    { time: "09:00", client: "Maria Conte", type: "Consulenza" },
    { time: "14:00", client: "Giuseppe Verdi", type: "Controllo" },
    { time: "16:30", client: "Disponibile", type: "Slot libero" }
  ];

  return (
    <div className="space-y-4">
      <h2 className="font-bold mb-4">Oggi - {today.toLocaleDateString('it-IT')}</h2>
      
      <div className="space-y-2">
        {todaySchedule.map((slot, idx) => (
          <div key={idx} className={`border-2 border-gray-400 p-2 ${slot.client === 'Disponibile' ? 'bg-green-50' : 'bg-blue-50'}`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-bold">{slot.time}</div>
                <div className="text-xs">{slot.client}</div>
              </div>
              <div className="text-xs text-gray-600">{slot.type}</div>
            </div>
          </div>
        ))}
      </div>

      <Button95 
        variant="primary" 
        className="w-full" 
        onClick={() => onShowMessage('Calendario', '📅 Funzione aggiungi appuntamento attivata!', 'info')}
      >
        Aggiungi Appuntamento
      </Button95>
    </div>
  );
};
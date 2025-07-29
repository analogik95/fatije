import React, { useState } from 'react';
import { Calendar } from '../ui/calendar';
import { Button95 } from '../common/Button95';
import { Professional } from '../../types';

interface BookingCalendarWindowProps {
    professional: Professional;
    onBookSlot: (professional: Professional, date: string, time: string, type: 'presenza' | 'video') => void;
    onCancel: () => void;
    onShowMessage: (title: string, message: string, type: 'info' | 'success' | 'error') => void;
}

export const BookingCalendarWindow: React.FC<BookingCalendarWindowProps> = ({
    professional,
    onBookSlot,
    onCancel,
    onShowMessage
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [appointmentType, setAppointmentType] = useState<'presenza' | 'video'>('presenza');

    // Mock available time slots (in a real app, this would come from the professional's calendar)
    const availableSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    // Mock occupied slots for the selected date
    const occupiedSlots = selectedDate ? (['10:00', '15:30']) : [];

    const getAvailableSlots = () => {
        return availableSlots.filter(slot => !occupiedSlots.includes(slot));
    };

    const handleBooking = () => {
        if (!selectedDate || !selectedTime) {
            onShowMessage('Errore', 'Seleziona una data e un orario per continuare.', 'error');
            return;
        }

        const dateString = selectedDate.toISOString().split('T')[0];
        onBookSlot(professional, dateString, selectedTime, appointmentType);
    };

    const isDateDisabled = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Disable past dates and Sundays
        return date < today || date.getDay() === 0;
    };

    return (
        <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="bg-blue-50 border-2 border-gray-400 p-3">
                <h2 className="font-bold text-sm mb-2">📅 Prenota Appuntamento</h2>
                <div className="text-xs">
                    <div><strong>Professionista:</strong> {professional.name}</div>
                    <div><strong>Specialità:</strong> {professional.specialty}</div>
                    <div><strong>Tariffa:</strong> €{professional.price}/consulenza</div>
                    <div><strong>Ubicazione:</strong> {professional.location}</div>
                </div>
            </div>

            <div>
                <h3 className="font-bold text-sm mb-2">1. Seleziona la Data</h3>
                <div className="border-2 border-gray-400 p-2 bg-white">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={isDateDisabled}
                        className="w-full"
                    />
                </div>
            </div>

            {selectedDate && (
                <div>
                    <h3 className="font-bold text-sm mb-2">2. Seleziona l'Orario</h3>
                    <div className="border-2 border-gray-400 p-2 bg-white">
                        <div className="grid grid-cols-3 gap-1">
                            {getAvailableSlots().map((slot) => (
                                <Button95
                                    key={slot}
                                    className={`text-xs p-2 ${selectedTime === slot ? 'bg-blue-200' : ''}`}
                                    onClick={() => setSelectedTime(slot)}
                                >
                                    {slot}
                                </Button95>
                            ))}
                        </div>
                        {getAvailableSlots().length === 0 && (
                            <div className="text-center text-gray-500 py-4 text-xs">
                                Nessun orario disponibile per questa data
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedDate && selectedTime && (
                <div>
                    <h3 className="font-bold text-sm mb-2">3. Modalità Consulenza</h3>
                    <div className="border-2 border-gray-400 p-2 bg-white space-y-2">
                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                            <input
                                type="radio"
                                name="appointmentType"
                                value="presenza"
                                checked={appointmentType === 'presenza'}
                                onChange={() => setAppointmentType('presenza')}
                                className="w-3 h-3"
                            />
                            <span>🏢 Di persona presso lo studio</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                            <input
                                type="radio"
                                name="appointmentType"
                                value="video"
                                checked={appointmentType === 'video'}
                                onChange={() => setAppointmentType('video')}
                                className="w-3 h-3"
                            />
                            <span>💻 Videochiamata online</span>
                        </label>
                    </div>
                </div>
            )}

            {selectedDate && selectedTime && (
                <div className="bg-yellow-50 border-2 border-gray-400 p-3">
                    <h3 className="font-bold text-sm mb-2">📋 Riepilogo Prenotazione</h3>
                    <div className="text-xs space-y-1">
                        <div><strong>Data:</strong> {selectedDate.toLocaleDateString('it-IT', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</div>
                        <div><strong>Orario:</strong> {selectedTime}</div>
                        <div><strong>Modalità:</strong> {appointmentType === 'presenza' ? 'Di persona' : 'Videochiamata'}</div>
                        <div><strong>Costo:</strong> €{professional.price}</div>
                    </div>
                </div>
            )}

            <div className="flex gap-2">
                <Button95
                    variant="primary"
                    className="flex-1"
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleBooking}
                >
                    Invia Richiesta
                </Button95>
                <Button95
                    className="flex-1"
                    onClick={onCancel}
                >
                    Annulla
                </Button95>
            </div>

            <div className="bg-gray-50 border-2 border-gray-400 p-2 text-xs">
                <div className="font-bold mb-1">ℹ️ Informazioni Importanti:</div>
                <ul className="space-y-1 text-xs">
                    <li>• La richiesta sarà inviata al professionista per conferma</li>
                    <li>• Riceverai una notifica quando l'appuntamento sarà confermato</li>
                    <li>• Puoi cancellare gratuitamente fino a 24h prima</li>
                    <li>• Per le videochiamata riceverai il link di accesso via email</li>
                </ul>
            </div>
        </div>
    );
};

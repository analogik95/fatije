
import React, { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSounds } from './hooks/useSounds';
import { useWindowManagement } from './hooks/useWindowManagement';

// Type imports
import {
  Professional,
  Appointment,
  Message,
  Location,
  Category,
  BootStage,
  ShutdownStage,
  UserType,
  ModalContent,
  FileTransfer
} from './types';

// Component imports
import { BIOSScreen, BootScreen } from './components/screens/BootScreens';
import { LoginDialog } from './components/screens/LoginDialog';
import { Window } from './components/common/Window';
import { Button95 } from './components/common/Button95';
import { SearchWindow } from './components/windows/SearchWindow';
import { AppointmentsWindow } from './components/windows/AppointmentsWindow';
import { MessagesWindow } from './components/windows/MessagesWindow';
import { ProfessionalDashboardWindow, CalendarWindow } from './components/windows/ProfessionalWindows';
import TetrisBackground from './components/common/TetrisBackground';

const TarantoMarketplace = () => {
  // Boot and main app state
  const [bootStage, setBootStage] = useState<BootStage>('bios');
  const [bootProgress, setBootProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useLocalStorage<UserType | null>('current-user', null);
  const [showShutdown, setShowShutdown] = useState(false);
  const [shutdownStage, setShutdownStage] = useState<ShutdownStage>('confirm');

  // Refs for click outside handling
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const startMenuRef = useRef<HTMLDivElement>(null);
  const isToggling = useRef(false);

  // Window management
  const {
    openWindows,
    activeWindow,
    windowStates,
    windowAnimations,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
    startDrag,
    startResize,
    setOpenWindows,
    setWindowStates,
    setActiveWindow
  } = useWindowManagement();

  // Sound effects hook
  const {
    playBootSound,
    playClickSound,
    playErrorSound,
    playSuccessSound,
    playNotificationSound,
    playShutdownSound
  } = useSounds();

  // Modal system for in-app notifications
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({ title: '', message: '', type: 'info' });

  // Location state
  const [userLocation, setUserLocation] = useState<Location>({ lat: 40.4736, lng: 17.2406 });
  const [locationPermission, setLocationPermission] = useState(false);

  // Search and data state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tutti');
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', [
    { id: 1, professional: "Dott.ssa Maria Rossi", specialty: "Cardiologia", date: "2025-07-28", time: "15:00", status: "confermato", type: "video" },
    { id: 2, professional: "Avv. Giuseppe Bianchi", specialty: "Diritto di Famiglia", date: "2025-07-29", time: "10:00", status: "in-attesa", type: "presenza" }
  ]);
  const [messages, setMessages] = useLocalStorage<Message[]>('messages', [
    { id: 1, from: "Dott.ssa Maria Rossi", message: "Porta i risultati degli esami precedenti", time: "14:30", unread: true },
    { id: 2, from: "Sistema", message: "Il tuo appuntamento è confermato per domani", time: "09:15", unread: false }
  ]);

  // MSN-style conversation state
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useLocalStorage<Record<string, Message[]>>('conversations', {
    "Dott.ssa Maria Rossi": [
      { id: 1, from: "Dott.ssa Maria Rossi", message: "Buongiorno! Come posso aiutarla? :)", time: "14:25", unread: false },
      { id: 2, from: "Tu", message: "Ciao dottoressa, volevo chiedere info sui risultati", time: "14:26", unread: false },
      { id: 3, from: "Dott.ssa Maria Rossi", message: "Porta i risultati degli esami precedenti", time: "14:30", unread: false }
    ]
  });
  const [messageInput, setMessageInput] = useState('');

  // MSN features state
  const [showEmoticons, setShowEmoticons] = useState(false);
  const [showFileTransfer, setShowFileTransfer] = useState(false);
  const [fileTransfers, setFileTransfers] = useLocalStorage<FileTransfer[]>('file-transfers', []);

  // Static data
  const professionals: Professional[] = [
    { id: 1, name: "Dott.ssa Maria Rossi", specialty: "Cardiologia", rating: 4.9, price: 80, location: "Centro", available: true, languages: ["IT", "EN"], category: "medici", lat: 40.4756, lng: 17.2296 },
    { id: 2, name: "Avv. Giuseppe Bianchi", specialty: "Diritto di Famiglia", rating: 4.7, price: 120, location: "Borgo", available: false, languages: ["IT"], category: "avvocati", lat: 40.4816, lng: 17.2406 },
    { id: 3, name: "Dott. Anna Verdi", specialty: "Odontoiatria", rating: 4.8, price: 60, location: "Isola", available: true, languages: ["IT", "EN", "FR"], category: "dentisti", lat: 40.4696, lng: 17.2516 },
    { id: 4, name: "Arch. Marco Neri", specialty: "Architettura", rating: 4.6, price: 90, location: "Tamburi", available: true, languages: ["IT", "EN"], category: "architetti", lat: 40.4836, lng: 17.2256 }
  ];

  const categories: Category[] = [
    { id: 'tutti', name: "Tutti", count: professionals.length },
    { id: 'medici', name: "Medici", count: 2 },
    { id: 'avvocati', name: "Avvocati", count: 1 },
    { id: 'dentisti', name: "Dentisti", count: 1 },
    { id: 'architetti', name: "Architetti", count: 1 }
  ];

  // Utility functions
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'tutti' || prof.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Effects
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationPermission(true);
        },
        (error) => {
          console.log('Geolocation error:', error);
          setLocationPermission(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (bootStage === 'bios') {
      const timer = setTimeout(() => setBootStage('loading'), 2000);
      return () => clearTimeout(timer);
    } else if (bootStage === 'loading') {
      const progressTimer = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 100) {
            setBootStage('desktop');
            // Play boot sound when desktop loads
            setTimeout(() => playBootSound(), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(progressTimer);
    }
  }, [bootStage, playBootSound]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close start menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Don't handle if we're in the middle of toggling
      if (isToggling.current) {
        return;
      }

      const target = e.target as HTMLElement;

      // Check if click is inside start button or start menu
      if (startButtonRef.current?.contains(target) || startMenuRef.current?.contains(target)) {
        return;
      }

      // Close the menu if clicking outside
      if (startMenuOpen) {
        setStartMenuOpen(false);
      }
    };

    if (startMenuOpen) {
      // Add a small delay before listening to avoid conflicts
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [startMenuOpen]);

  // Business logic functions
  const loginUser = (userType: UserType) => {
    setCurrentUser(userType);
    setOpenWindows([]);
    setWindowStates({});
  };

  const initiateShutdown = () => {
    setShowShutdown(true);
    setShutdownStage('confirm');
    setStartMenuOpen(false);
  };

  const confirmShutdown = () => {
    setShutdownStage('shutting-down');
    playShutdownSound();
    setTimeout(() => {
      setShutdownStage('safe-to-turn-off');
    }, 3000);
  };

  const cancelShutdown = () => {
    setShowShutdown(false);
    setShutdownStage('confirm');
  };

  const restart = () => {
    setCurrentUser(null);
    setOpenWindows([]);
    setWindowStates({});
    setShowShutdown(false);
    setBootStage('bios');
    setBootProgress(0);
  };

  const showInAppMessage = (title: string, message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setModalContent({ title, message, type });
    setShowModal(true);

    // Play appropriate sound based on message type
    switch (type) {
      case 'success':
        playSuccessSound();
        break;
      case 'error':
        playErrorSound();
        break;
      default:
        playNotificationSound();
    }
  };

  const bookAppointment = (professional: Professional) => {
    const newAppointment: Appointment = {
      id: Date.now(),
      professional: professional.name,
      specialty: professional.specialty,
      date: "2025-07-30",
      time: "14:00",
      status: "in-attesa",
      type: "presenza"
    };

    setAppointments(prev => [...prev, newAppointment]);

    const systemMessage: Message = {
      id: Date.now() + 1,
      from: "Sistema Prenotazioni",
      message: `✅ Richiesta inviata a ${professional.name} per il ${newAppointment.date} alle ore ${newAppointment.time}`,
      time: formatTime(new Date()),
      unread: true
    };

    setMessages(prev => [systemMessage, ...prev]);

    showInAppMessage(
      'Prenotazione Inviata',
      `✅ Richiesta inviata a ${professional.name} per il ${newAppointment.date} alle ore ${newAppointment.time}`,
      'success'
    );

    setTimeout(() => {
      openWindow('appointments', 'I Miei Appuntamenti');
    }, 1500);
  };

  const sendMessage = (professionalName: string, messageText: string) => {
    const newMessage: Message = {
      id: Date.now(),
      from: professionalName,
      message: `Re: ${messageText} - Grazie per il messaggio, ti risponderò presto!`,
      time: formatTime(new Date()),
      unread: true
    };

    setMessages(prev => [newMessage, ...prev]);

    // Also add to conversation
    setConversationMessages(prev => ({
      ...prev,
      [professionalName]: [
        ...(prev[professionalName] || []),
        {
          id: Date.now() - 1,
          from: 'Tu',
          message: messageText,
          time: formatTime(new Date()),
          unread: false
        },
        newMessage
      ]
    }));

    showInAppMessage(
      'Messaggio Inviato',
      `📩 Messaggio inviato a ${professionalName}!`,
      'success'
    );

    setTimeout(() => {
      openWindow('messages', 'Posta in Arrivo');
    }, 1500);
  };

  // MSN Emoticon conversion
  const convertEmoticons = (text: string): string => {
    const emoticonMap: Record<string, string> = {
      ':)': '😊', ':-)': '😊', ':(': '😢', ':-(': '😢', ':D': '😃', ':-D': '😃',
      ':P': '😛', ':-P': '😛', ';)': '😉', ';-)': '😉', ':o': '😮', ':-o': '😮',
      ':*': '😘', ':-*': '😘', ':|': '😐', ':-|': '😐', '8)': '😎', '8-)': '😎',
      '>:(': '😠', '>:-(': '😠', ':S': '😕', ':-S': '😕', 'XD': '😆',
      '\\o/': '🙌', '<3': '❤️', '</3': '💔', ':@': '😡', ':-@': '😡'
    };

    let convertedText = text;
    Object.entries(emoticonMap).forEach(([emoticon, emoji]) => {
      const regex = new RegExp(emoticon.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      convertedText = convertedText.replace(regex, emoji);
    });

    return convertedText;
  };

  const sendConversationMessage = (to: string, message: string) => {
    if (!message.trim()) return;

    // Convert emoticon text to emoji
    const convertedMessage = convertEmoticons(message.trim());

    const newMessage: Message = {
      id: Date.now(),
      from: 'Tu',
      message: convertedMessage,
      time: formatTime(new Date()),
      unread: false
    };

    setConversationMessages(prev => ({
      ...prev,
      [to]: [...(prev[to] || []), newMessage]
    }));

    setMessageInput('');
    setShowEmoticons(false);

    // Play message send sound
    playNotificationSound();

    // Simulate response after 2 seconds
    setTimeout(() => {
      const responses = [
        "Grazie per il messaggio! Ti risponderò al più presto :)",
        "Perfetto! Ho ricevuto il tuo messaggio :-)",
        "Va bene, ti farò sapere appena possibile! :D",
        "Ottimo! Ci sentiamo presto ;-)",
        "Ricevuto! A presto :-P"
      ];

      const responseMessage: Message = {
        id: Date.now(),
        from: to,
        message: responses[Math.floor(Math.random() * responses.length)],
        time: formatTime(new Date()),
        unread: true
      };

      setConversationMessages(prev => ({
        ...prev,
        [to]: [...(prev[to] || []), responseMessage]
      }));

      // Update main messages list
      setMessages(prev => [responseMessage, ...prev]);

      // Play receive sound
      playNotificationSound();
    }, 2000 + Math.random() * 3000);
  };

  // File transfer simulation
  const initiateFileTransfer = (fileName: string, to: string) => {
    const newTransfer = {
      id: Date.now(),
      fileName,
      from: 'Tu',
      to,
      status: 'sending' as const,
      progress: 0,
      timestamp: formatTime(new Date())
    };

    setFileTransfers(prev => [...prev, newTransfer]);
    setShowFileTransfer(false);

    // Show file transfer notification in conversation
    const transferMessage: Message = {
      id: Date.now() + 1,
      from: 'Sistema',
      message: `📁 Invio file: ${fileName}`,
      time: formatTime(new Date()),
      unread: false
    };

    setConversationMessages(prev => ({
      ...prev,
      [to]: [...(prev[to] || []), transferMessage]
    }));

    // Simulate file transfer progress
    const progressInterval = setInterval(() => {
      setFileTransfers(prev => prev.map(transfer => {
        if (transfer.id === newTransfer.id) {
          const newProgress = Math.min(transfer.progress + 10 + Math.random() * 20, 100);
          return { ...transfer, progress: newProgress };
        }
        return transfer;
      }));
    }, 500);

    // Complete transfer after random time
    setTimeout(() => {
      clearInterval(progressInterval);
      setFileTransfers(prev => prev.map(transfer =>
        transfer.id === newTransfer.id
          ? { ...transfer, status: 'completed', progress: 100 }
          : transfer
      ));

      // Add completion message
      const completionMessage: Message = {
        id: Date.now() + 2,
        from: 'Sistema',
        message: `✅ File "${fileName}" inviato con successo!`,
        time: formatTime(new Date()),
        unread: false
      };

      setConversationMessages(prev => ({
        ...prev,
        [to]: [...(prev[to] || []), completionMessage]
      }));

      playSuccessSound();
    }, 3000 + Math.random() * 7000);
  };

  const openConversation = (contact: string) => {
    setActiveConversation(contact);

    // Mark all messages from this contact as read
    setMessages(prev => prev.map(msg =>
      msg.from === contact ? { ...msg, unread: false } : msg
    ));

    // Initialize conversation if it doesn't exist
    if (!conversationMessages[contact]) {
      const existingMessages = messages.filter(msg => msg.from === contact);
      setConversationMessages(prev => ({
        ...prev,
        [contact]: existingMessages
      }));
    }

    // Resize window for conversation view
    const messagesWindow = openWindows.find(w => w.type === 'messages');
    if (messagesWindow) {
      setWindowStates(prev => ({
        ...prev,
        [messagesWindow.id]: {
          ...prev[messagesWindow.id],
          width: window.innerWidth < 768 ? window.innerWidth - 20 : 450,
          height: window.innerHeight < 768 ? window.innerHeight - 100 : 480
        }
      }));
    }
  };

  const backToContacts = () => {
    setActiveConversation(null);
    setShowEmoticons(false);
    setShowFileTransfer(false);
    // Resize back to contact list view
    const messagesWindow = openWindows.find(w => w.type === 'messages');
    if (messagesWindow) {
      setWindowStates(prev => ({
        ...prev,
        [messagesWindow.id]: {
          ...prev[messagesWindow.id],
          width: window.innerWidth < 768 ? window.innerWidth - 20 : 280,
          height: window.innerHeight < 768 ? window.innerHeight - 100 : 420
        }
      }));
    }
  };

  // UI Components

  const InAppModal = () => {
    if (!showModal) return null;

    const getIcon = () => {
      switch (modalContent.type) {
        case 'success': return '✅';
        case 'error': return '❌';
        default: return 'ℹ️';
      }
    };

    const getColor = () => {
      switch (modalContent.type) {
        case 'success': return 'from-green-600 to-green-800';
        case 'error': return 'from-red-600 to-red-800';
        default: return 'from-blue-600 to-blue-800';
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-400 bg-opacity-75 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
        <div className="bg-gray-300 border-2 border-gray-600 shadow-2xl max-w-md w-full"
          style={{ boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.7)' }}>
          <div className={`bg-gradient-to-r ${getColor()} text-white px-4 py-2 font-bold`}>
            {modalContent.title}
          </div>
          <div className="p-6 bg-white space-y-4">
            <div className="flex items-start gap-4">
              <div className="text-4xl flex-shrink-0">{getIcon()}</div>
              <div className="flex-1">
                <div className="text-sm whitespace-pre-line">{modalContent.message}</div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button95 onClick={() => setShowModal(false)}>OK</Button95>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ShutdownDialog = () => (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-75 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      {shutdownStage === 'confirm' && (
        <div className="bg-gray-300 border-2 border-gray-600 shadow-2xl max-w-md w-full"
          style={{ boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.7)' }}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 font-bold">
            Arresta Windows
          </div>
          <div className="p-6 bg-white space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">⚠️</div>
              <div>
                <div className="font-bold mb-2">Cosa vuoi che faccia il computer?</div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="shutdown" defaultChecked />
                    <span className="text-sm">Arresta il computer?</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="shutdown" />
                    <span className="text-sm">Riavvia il computer?</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="shutdown" />
                    <span className="text-sm">Chiudi tutti i programmi e accedi come utente diverso?</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button95 onClick={confirmShutdown}>OK</Button95>
              <Button95 onClick={cancelShutdown}>Annulla</Button95>
            </div>
          </div>
        </div>
      )}

      {shutdownStage === 'shutting-down' && (
        <div className="bg-gray-300 border-2 border-gray-600 shadow-2xl p-8 text-center max-w-md w-full"
          style={{ boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.7)' }}>
          <div className="text-4xl mb-4">💻</div>
          <div className="font-bold text-lg mb-2">Windows si sta arrestando...</div>
          <div className="text-sm text-gray-600">Attendere mentre Windows salva le impostazioni.</div>
        </div>
      )}

      {shutdownStage === 'safe-to-turn-off' && (
        <div className="bg-orange-600 border-4 border-yellow-400 shadow-2xl p-8 text-center text-white max-w-md w-full">
          <div className="text-6xl mb-4">⚡</div>
          <div className="font-bold text-2xl mb-4">Ora è possibile spegnere il computer.</div>
          <div className="text-lg mb-6">È anche possibile riavviare il computer facendo clic su Riavvia.</div>
          <Button95 onClick={restart} className="bg-gray-300 text-black">Riavvia</Button95>
        </div>
      )}
    </div>
  );

  const StartMenu = () => {
    const clientItems = [
      { label: '📁 Trova Professionisti', action: () => { playClickSound(); openWindow('search', 'Trova Professionisti'); } },
      { label: '📅 I Miei Appuntamenti', action: () => { playClickSound(); openWindow('appointments', 'I Miei Appuntamenti'); } },
      { label: '💬 Posta in Arrivo', action: () => { playClickSound(); openWindow('messages', 'Posta in Arrivo'); } }
    ];

    const professionalItems = [
      { label: '💼 Dashboard', action: () => { playClickSound(); openWindow('dashboard', 'Dashboard Professionista'); } },
      { label: '📅 Calendario', action: () => { playClickSound(); openWindow('calendar', 'Calendario'); } },
      { label: '💬 Posta in Arrivo', action: () => { playClickSound(); openWindow('messages', 'Posta in Arrivo'); } }
    ];

    const menuItems = currentUser === 'cliente' ? clientItems : professionalItems;

    return (
      <div
        ref={startMenuRef}
        className="fixed bottom-8 left-0 bg-gray-300 border-2 border-gray-600 w-64 shadow-2xl"
        style={{
          zIndex: 10000,
          boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.7)'
        }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-2 text-sm font-bold flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 border border-gray-800 animate-pulse"></div>
          Windows 95
        </div>
        <div className="p-2 space-y-1">
          <div className="text-xs text-gray-600 mb-2">Programmi:</div>
          {menuItems.map((item, idx) => (
            <Button95
              key={idx}
              className="w-full text-left text-xs hover:bg-blue-100 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                item.action();
                setStartMenuOpen(false);
              }}
            >
              {item.label}
            </Button95>
          ))}
          <div className="border-t border-gray-400 my-2"></div>
          <Button95 className="w-full text-left text-xs transition-all" onClick={(e) => { e.stopPropagation(); playClickSound(); setStartMenuOpen(false); }}>❓ Aiuto</Button95>
          <div className="border-t border-gray-400 my-2"></div>
          <Button95
            className="w-full text-left text-xs text-red-600 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              initiateShutdown();
            }}
          >
            🔌 Arresta...
          </Button95>
        </div>
      </div>
    );
  };

  const renderWindow = (window: any) => {
    switch (window.type) {
      case 'search':
        return (
          <SearchWindow
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            filteredProfessionals={filteredProfessionals}
            userLocation={userLocation}
            locationPermission={locationPermission}
            calculateDistance={calculateDistance}
            onBookAppointment={bookAppointment}
            onSendMessage={sendMessage}
            onShowMessage={showInAppMessage}
          />
        );
      case 'appointments':
        return (
          <AppointmentsWindow
            appointments={appointments}
            onShowMessage={showInAppMessage}
            onOpenWindow={openWindow}
          />
        );
      case 'messages':
        return (
          <MessagesWindow
            messages={messages}
            conversationMessages={conversationMessages}
            activeConversation={activeConversation}
            messageInput={messageInput}
            currentUser={currentUser!}
            fileTransfers={fileTransfers}
            showEmoticons={showEmoticons}
            showFileTransfer={showFileTransfer}
            setMessageInput={setMessageInput}
            setShowEmoticons={setShowEmoticons}
            setShowFileTransfer={setShowFileTransfer}
            onOpenConversation={openConversation}
            onBackToContacts={backToContacts}
            onSendMessage={sendConversationMessage}
            onFileTransfer={initiateFileTransfer}
            onShowMessage={showInAppMessage}
            formatTime={formatTime}
          />
        );
      case 'dashboard':
        return (
          <ProfessionalDashboardWindow
            appointments={appointments}
            messages={messages}
            onOpenWindow={openWindow}
          />
        );
      case 'calendar':
        return <CalendarWindow onShowMessage={showInAppMessage} />;
      default:
        return <div>Contenuto finestra</div>;
    }
  };

  const getDesktopIcons = () => {
    if (currentUser === 'cliente') {
      return [
        { icon: '📁', label: 'Trova Professionisti', onClick: () => openWindow('search', 'Trova Professionisti') },
        { icon: '📅', label: 'Appuntamenti', onClick: () => openWindow('appointments', 'I Miei Appuntamenti') },
        { icon: '💬', label: 'Posta', onClick: () => openWindow('messages', 'Posta in Arrivo') },
        { icon: '💻', label: 'Computer', onClick: () => showInAppMessage('Sistema', '💻 Risorse del Computer', 'info') }
      ];
    } else {
      return [
        { icon: '💼', label: 'Dashboard', onClick: () => openWindow('dashboard', 'Dashboard Professionista') },
        { icon: '📅', label: 'Calendario', onClick: () => openWindow('calendar', 'Calendario') },
        { icon: '💬', label: 'Posta', onClick: () => openWindow('messages', 'Posta in Arrivo') },
        { icon: '💻', label: 'Computer', onClick: () => showInAppMessage('Sistema', '💻 Risorse del Computer', 'info') }
      ];
    }
  };

  // Main render logic
  if (bootStage === 'bios') {
    return <BIOSScreen />;
  }

  if (bootStage === 'loading') {
    return <BootScreen bootProgress={bootProgress} />;
  }

  if (!currentUser) {
    return (
      <>
        <LoginDialog onLogin={loginUser} onShutdown={initiateShutdown} />
        {showShutdown && <ShutdownDialog />}
      </>
    );
  }

  return (
    <div
      className="h-screen w-screen relative overflow-hidden select-none"
      style={{
        backgroundColor: '#008080',
        backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJkaWFnb25hbCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj4KICAgICAgPHBhdGggZD0iTTAsMTAgTDEwLDAgTTUsMTUgTDE1LDUgTS01LC01MIDUsNSIgc3Ryb2tlPSIjMDA2NjY2IiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjZGlhZ29uYWwpIi8+Cjwvc3ZnPg==)',
        backgroundSize: '100px 100px'
      }}
    >
      {/* Tetris Background Animation */}
      <TetrisBackground />

      {/* Desktop Icons */}
      <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
        {getDesktopIcons().map((icon, idx) => (
          <div
            key={idx}
            className="w-16 h-20 sm:w-20 sm:h-24 text-center cursor-pointer hover:bg-blue-500 hover:bg-opacity-20 rounded p-1 sm:p-2 desktop-icon"
            onDoubleClick={(e) => {
              e.stopPropagation();
              icon.onClick();
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-2xl sm:text-3xl mb-1">{icon.icon}</div>
            <div className="text-xs font-bold text-black text-center leading-tight"
              style={{ textShadow: '1px 1px 1px rgba(255,255,255,0.8)' }}>
              {icon.label}
            </div>
          </div>
        ))}
      </div>

      {/* Windows */}
      {openWindows.map((window) => (
        <Window
          key={window.id}
          window={window}
          isActive={activeWindow === window.id}
          windowState={windowStates[window.id] || { x: 100, y: 100, width: 420, height: 450, minimized: false }}
          animation={windowAnimations[window.id] || null}
          onStartDrag={startDrag}
          onStartResize={startResize}
          onMinimize={minimizeWindow}
          onClose={closeWindow}
          onFocus={focusWindow}
          activeConversation={activeConversation}
        >
          {renderWindow(window)}
        </Window>
      ))}

      {/* Start Menu */}
      {startMenuOpen && <StartMenu />}

      {/* Taskbar */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-gray-300 border-t-2 border-gray-600 p-1 flex items-center h-8"
        style={{
          zIndex: 5000,
          boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.7)'
        }}
      >
        <Button95
          ref={startButtonRef}
          className="text-xs font-bold h-6 flex items-center gap-1 start-button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            // Set toggling flag
            isToggling.current = true;

            setStartMenuOpen(prev => !prev);

            // Clear the toggling flag after a short delay
            setTimeout(() => {
              isToggling.current = false;
            }, 150);
          }}
        >
          <div className="w-4 h-4 bg-red-500 border border-gray-800"></div>
          Start
        </Button95>

        <div className="flex-1 flex gap-1 px-1 sm:px-2 overflow-x-auto">
          {openWindows.filter(w => {
            const state = windowStates[w.id];
            return !state || !state.minimized;
          }).map(window => (
            <Button95
              key={window.id}
              className={`text-xs px-1 sm:px-2 h-6 whitespace-nowrap ${activeWindow === window.id ? 'bg-gray-400' : ''}`}
              onClick={() => focusWindow(window.id)}
            >
              {window.title.length > 12 ? window.title.substring(0, 12) + '...' : window.title}
            </Button95>
          ))}

          {openWindows.filter(w => {
            const state = windowStates[w.id];
            return state && state.minimized;
          }).map(window => (
            <Button95
              key={`min-${window.id}`}
              className="text-xs px-1 sm:px-2 h-6 whitespace-nowrap bg-gray-200"
              onClick={() => restoreWindow(window.id)}
            >
              {window.title.length > 12 ? window.title.substring(0, 12) + '...' : window.title}
            </Button95>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <div
            className="bg-gray-200 border border-gray-400 px-1 sm:px-2 py-1 text-xs h-6 flex items-center"
            style={{ boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.2)' }}
          >
            🔊
          </div>
          <div
            className="bg-gray-200 border border-gray-400 px-1 sm:px-2 py-1 text-xs h-6 flex items-center"
            style={{ boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.2)' }}
          >
            {formatTime(currentTime)}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showShutdown && <ShutdownDialog />}
      {showModal && <InAppModal />}
    </div>
  );
};

export default TarantoMarketplace;
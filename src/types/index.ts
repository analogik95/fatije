export interface Professional {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  price: number;
  location: string;
  available: boolean;
  languages: string[];
  category: string;
  lat: number;
  lng: number;
}

export interface Appointment {
  id: number;
  professional: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
  type: string;
}

export interface Message {
  id: number;
  from: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface WindowData {
  id: number;
  type: string;
  title: string;
}

export interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface FileTransfer {
  id: number;
  fileName: string;
  from: string;
  to: string;
  status: 'sending' | 'receiving' | 'completed' | 'cancelled';
  progress: number;
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export type WindowAnimationType = 'opening' | 'closing' | 'minimizing' | 'restoring' | null;

export type BootStage = 'bios' | 'loading' | 'desktop';

export type ShutdownStage = 'confirm' | 'shutting-down' | 'safe-to-turn-off';

export type UserType = 'cliente' | 'professionista';

export type ModalType = 'info' | 'success' | 'error';

export interface ModalContent {
  title: string;
  message: string;
  type: ModalType;
}
import React from 'react';

export const BIOSScreen: React.FC = () => (
  <div className="h-screen bg-black text-green-400 font-mono text-sm p-4 overflow-hidden">
    <div className="mb-4">
      <div className="text-xl mb-2">TARANTO COMPUTER BIOS v1.0</div>
      <div className="mb-4">Copyright (C) 1995 Sistemi Taranto S.r.l.</div>
    </div>
    
    <div className="space-y-1 mb-8">
      <div>Processore Principale: Intel 486DX2-66</div>
      <div>Test Memoria: 16384K OK</div>
      <div>Rilevamento IDE Master Primario: TARANTO-HD 1.2GB</div>
      <div>Rilevamento IDE Slave Primario: Nessuno</div>
      <div>Rilevamento Floppy Drive A: 1.44MB</div>
      <div>Tastiera: Rilevata</div>
      <div>Mouse: Compatibile Microsoft</div>
    </div>

    <div className="animate-pulse">
      <div>Caricamento Windows 95...</div>
      <div className="mt-2">Premi CANC per entrare nel SETUP</div>
    </div>
  </div>
);

interface BootScreenProps {
  bootProgress: number;
}

export const BootScreen: React.FC<BootScreenProps> = ({ bootProgress }) => (
  <div className="h-screen bg-black flex flex-col items-center justify-center">
    <div className="bg-gradient-to-b from-blue-600 to-blue-800 p-8 rounded-lg shadow-2xl text-center boot-glow">
      <div className="text-white text-6xl mb-4 animate-pulse">⊞</div>
      <div className="text-white text-4xl font-bold mb-2">Microsoft</div>
      <div className="text-white text-2xl mb-8">Windows 95</div>
      
      <div className="w-64 bg-gray-400 border-2 border-gray-600 h-4 mb-4" 
           style={{ boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3)' }}>
        <div 
          className="bg-blue-600 h-full transition-all duration-100 progress-bar"
          style={{ width: `${bootProgress}%` }}
        ></div>
      </div>
      
      <div className="text-white text-sm animate-pulse">Caricamento file di sistema...</div>
    </div>
  </div>
);
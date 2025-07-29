import React from 'react';
import { Button95 } from '../common/Button95';
import { UserType } from '../../types';

interface LoginDialogProps {
  onLogin: (userType: UserType) => void;
  onShutdown: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ onLogin, onShutdown }) => (
  <div 
    className="fixed inset-0 flex items-center justify-center p-4"
    style={{
      backgroundColor: '#008080',
      backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJkaWFnb25hbCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj4KICAgICAgPHBhdGggZD0iTTAsMTAgTDEwLDAgTTUsMTUgTDE1LDUgTS01LC01MIDUsNSIgc3Ryb2tlPSIjMDA2NjY2IiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjZGlhZ29uYWwpIi8+Cjwvc3ZnPg==)',
      backgroundSize: '100px 100px'
    }}
  >
    <div className="bg-gray-300 border-2 border-gray-600 shadow-2xl max-w-md w-full"
         style={{ boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.7)' }}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 font-bold">
        Benvenuto ai Servizi Professionali di Taranto
      </div>
      <div className="p-6 bg-white space-y-4">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🏛️</div>
          <div className="font-bold text-lg">Seleziona Account Utente</div>
        </div>

        <div className="space-y-3">
          <Button95 
            variant="primary" 
            className="w-full py-3 text-left"
            onClick={() => onLogin('cliente')}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 border-2 border-gray-600 flex items-center justify-center text-white font-bold">C</div>
              <div>
                <div className="font-bold">Account Cliente</div>
                <div className="text-xs opacity-80">Trova e prenota professionisti</div>
              </div>
            </div>
          </Button95>

          <Button95 
            variant="primary" 
            className="w-full py-3 text-left"
            onClick={() => onLogin('professionista')}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 border-2 border-gray-600 flex items-center justify-center text-white font-bold">P</div>
              <div>
                <div className="font-bold">Account Professionista</div>
                <div className="text-xs opacity-80">Gestisci la tua attività</div>
              </div>
            </div>
          </Button95>
        </div>

        <div className="border-t border-gray-400 pt-4">
          <Button95 className="w-full" onClick={onShutdown}>
            Arresta...
          </Button95>
        </div>
      </div>
    </div>
  </div>
);
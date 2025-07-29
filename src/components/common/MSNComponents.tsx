import React from 'react';
import { Button95 } from '../common/Button95';

interface EmoticonPickerProps {
  onEmoticonSelect: (emoticon: string) => void;
  onClose: () => void;
}

export const EmoticonPicker: React.FC<EmoticonPickerProps> = ({ onEmoticonSelect, onClose }) => {
  const emoticons = [
    { text: ':)', emoji: '😊', desc: 'Sorriso' },
    { text: ':(', emoji: '😢', desc: 'Triste' },
    { text: ':D', emoji: '😃', desc: 'Felice' },
    { text: ':P', emoji: '😛', desc: 'Linguaccia' },
    { text: ';)', emoji: '😉', desc: 'Occhiolino' },
    { text: ':o', emoji: '😮', desc: 'Sorpreso' },
    { text: ':*', emoji: '😘', desc: 'Bacio' },
    { text: ':|', emoji: '😐', desc: 'Neutro' },
    { text: '8)', emoji: '😎', desc: 'Figo' },
    { text: '>:(', emoji: '😠', desc: 'Arrabbiato' },
    { text: ':S', emoji: '😕', desc: 'Confuso' },
    { text: 'XD', emoji: '😆', desc: 'Ridendo' },
    { text: '\\o/', emoji: '🙌', desc: 'Evviva' },
    { text: '<3', emoji: '❤️', desc: 'Cuore' },
    { text: '</3', emoji: '💔', desc: 'Cuore spezzato' },
    { text: ':@', emoji: '😡', desc: 'Furioso' }
  ];

  return (
    <div className="absolute bottom-20 left-2 bg-white border-2 border-gray-400 shadow-lg rounded p-2 z-50 emoticon-picker-container"
         style={{ 
           width: '240px',
           boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.7)'
         }}>
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-2 py-1 text-xs font-bold mb-2 -m-2 mb-2">
        Seleziona emoticon
      </div>
      <div className="grid grid-cols-4 gap-1">
        {emoticons.map((emoticon, idx) => (
          <button
            key={idx}
            className="w-12 h-12 bg-gray-100 border border-gray-300 rounded hover:bg-blue-100 hover:border-blue-400 transition-all flex flex-col items-center justify-center text-xs emoticon-button"
            onClick={() => onEmoticonSelect(emoticon.text + ' ')}
            title={`${emoticon.desc} (${emoticon.text})`}
          >
            <div className="text-lg">{emoticon.emoji}</div>
            <div className="text-xs text-gray-600">{emoticon.text}</div>
          </button>
        ))}
      </div>
      <div className="flex justify-end mt-2">
        <button 
          onClick={onClose}
          className="px-2 py-1 bg-gray-300 border border-gray-600 text-xs rounded hover:bg-gray-200"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
};

interface FileTransferDialogProps {
  activeConversation: string;
  onFileTransfer: (fileName: string, to: string) => void;
  onClose: () => void;
}

export const FileTransferDialog: React.FC<FileTransferDialogProps> = ({ 
  activeConversation, 
  onFileTransfer, 
  onClose 
}) => {
  const [selectedFile, setSelectedFile] = React.useState<string>('');
  const commonFiles = [
    'documento.pdf',
    'ricetta_medica.jpg',
    'referti_analisi.pdf',
    'carta_identità.jpg',
    'codice_fiscale.pdf',
    'prescrizione.doc',
    'fattura.pdf',
    'contratto.pdf'
  ];

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-75 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-gray-300 border-2 border-gray-600 shadow-2xl max-w-md w-full"
           style={{ boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.7)' }}>
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 font-bold">
          📁 Invia File - MSN File Transfer
        </div>
        <div className="p-6 bg-white space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📂</div>
            <div>
              <div className="font-bold mb-2">Seleziona file da inviare a {activeConversation}</div>
              <div className="text-sm text-gray-600">Scegli un file dalla lista o simula l'invio</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">File disponibili:</label>
            <select 
              value={selectedFile} 
              onChange={(e) => setSelectedFile(e.target.value)}
              className="w-full p-2 border-2 border-gray-400 text-sm"
              style={{ boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.2)' }}
            >
              <option value="">Seleziona un file...</option>
              {commonFiles.map(file => (
                <option key={file} value={file}>{file}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button95 
              onClick={() => {
                if (selectedFile) {
                  onFileTransfer(selectedFile, activeConversation);
                }
              }}
              disabled={!selectedFile}
              variant="primary"
            >
              📤 Invia
            </Button95>
            <Button95 onClick={onClose}>Annulla</Button95>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FileTransferStatusProps {
  fileTransfers: Array<{
    id: number;
    fileName: string;
    from: string;
    to: string;
    status: 'sending' | 'receiving' | 'completed' | 'cancelled';
    progress: number;
    timestamp: string;
  }>;
}

export const FileTransferStatus: React.FC<FileTransferStatusProps> = ({ fileTransfers }) => {
  const activeTransfers = fileTransfers.filter(t => t.status !== 'completed' && t.status !== 'cancelled');
  
  if (activeTransfers.length === 0) return null;

  return (
    <div className="absolute top-2 right-2 bg-yellow-100 border-2 border-yellow-400 rounded p-2 shadow-lg z-40"
         style={{ width: '200px' }}>
      <div className="text-xs font-bold text-yellow-800 mb-2">📁 Trasferimenti attivi</div>
      {activeTransfers.map(transfer => (
        <div key={transfer.id} className="mb-2 last:mb-0">
          <div className="text-xs text-gray-700 mb-1">
            {transfer.fileName} → {transfer.to}
          </div>
          <div className="w-full bg-gray-300 border border-gray-500 h-2 rounded">
            <div 
              className="bg-green-500 h-full rounded transition-all duration-500 file-transfer-progress"
              style={{ width: `${transfer.progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-600 mt-1">{Math.round(transfer.progress)}%</div>
        </div>
      ))}
    </div>
  );
};
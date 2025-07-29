import React, { useState } from 'react';
import { Button95 } from '../common/Button95';
import { EmoticonPicker, FileTransferDialog, FileTransferStatus } from '../common/MSNComponents';
import { Message, FileTransfer, UserType } from '../../types';

interface MessagesWindowProps {
  messages: Message[];
  conversationMessages: Record<string, Message[]>;
  activeConversation: string | null;
  messageInput: string;
  currentUser: UserType;
  fileTransfers: FileTransfer[];
  showEmoticons: boolean;
  showFileTransfer: boolean;
  setMessageInput: (input: string) => void;
  setShowEmoticons: (show: boolean) => void;
  setShowFileTransfer: (show: boolean) => void;
  onOpenConversation: (contact: string) => void;
  onBackToContacts: () => void;
  onSendMessage: (to: string, message: string) => void;
  onFileTransfer: (fileName: string, to: string) => void;
  onShowMessage: (title: string, message: string, type: 'info' | 'success' | 'error') => void;
  formatTime: (date: Date) => string;
}

export const MessagesWindow: React.FC<MessagesWindowProps> = ({
  messages,
  conversationMessages,
  activeConversation,
  messageInput,
  currentUser,
  fileTransfers,
  showEmoticons,
  showFileTransfer,
  setMessageInput,
  setShowEmoticons,
  setShowFileTransfer,
  onOpenConversation,
  onBackToContacts,
  onSendMessage,
  onFileTransfer,
  onShowMessage,
  formatTime
}) => {
  // Get unique contacts
  const contacts = [...new Set(messages.map(msg => msg.from).filter(from => from !== 'Tu'))];

  if (activeConversation) {
    // Show conversation view - authentic MSN style
    const conversationMsgs = conversationMessages[activeConversation] || [];
    
    return (
      <div className="h-full flex flex-col bg-white relative">
        {/* File Transfer Status */}
        <FileTransferStatus fileTransfers={fileTransfers} />
        
        {/* MSN-style conversation header */}
        <div className="bg-gradient-to-b from-blue-400 to-blue-600 text-white p-2 border-b border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={onBackToContacts}
                className="text-white hover:bg-blue-700 px-2 py-1 rounded text-xs border border-blue-300"
              >
                ← Indietro
              </button>
              <div className="w-8 h-8 bg-orange-400 border-2 border-white rounded-full flex items-center justify-center text-xs font-bold text-white">
                {activeConversation.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-sm">{activeConversation}</div>
                <div className="text-xs text-blue-100">è online</div>
              </div>
            </div>
            <div className="flex gap-1">
              <button 
                className="w-6 h-6 bg-blue-500 border border-blue-300 text-white text-xs rounded hover:bg-blue-400" 
                title="Videochiamata"
                onClick={() => onShowMessage('Videochiamata', '🎥 Funzione videochiamata attivata!', 'info')}
              >
                📹
              </button>
              <button 
                className="w-6 h-6 bg-blue-500 border border-blue-300 text-white text-xs rounded hover:bg-blue-400"
                title="Condividi musica"
                onClick={() => onShowMessage('Musica', '🎵 Condivisione musica attivata!', 'info')}
              >
                🎵
              </button>
              <button 
                className="w-6 h-6 bg-blue-500 border border-blue-300 text-white text-xs rounded hover:bg-blue-400"
                title="Invia file"
                onClick={() => setShowFileTransfer(true)}
              >
                📁
              </button>
            </div>
          </div>
        </div>
        
        {/* Messages area with MSN styling */}
        <div className="flex-1 bg-white p-3 overflow-y-auto">
          {conversationMsgs.length === 0 ? (
            <div className="text-center text-gray-500 text-xs mt-8">
              <div className="text-2xl mb-2">💬</div>
              <div>La conversazione inizia qui.</div>
              <div>Scrivi qualcosa per iniziare!</div>
            </div>
          ) : (
            <div className="space-y-3">
              {conversationMsgs.map((msg, index) => (
                <div key={msg.id}>
                  {/* Show timestamp header if different day/time */}
                  {(index === 0 || conversationMsgs[index-1].time !== msg.time) && (
                    <div className="text-center text-xs text-gray-500 my-2">
                      <span className="bg-yellow-100 px-2 py-1 rounded border border-yellow-300">
                        {msg.time}
                      </span>
                    </div>
                  )}
                  
                  {/* Message bubble */}
                  <div className={`${msg.from === 'Tu' ? 'text-right' : 'text-left'}`}>
                    <div className="text-xs text-gray-600 mb-1">
                      <strong>{msg.from === 'Sistema' ? '🤖 ' : ''}{msg.from} dice:</strong>
                    </div>
                    <div className={`inline-block max-w-xs p-2 rounded text-xs transition-all hover:scale-105 animate-[fadeInUp_0.4s_ease] ${
                      msg.from === 'Tu' 
                        ? 'bg-blue-100 border border-blue-300 text-blue-900' 
                        : msg.from === 'Sistema'
                        ? 'bg-yellow-100 border border-yellow-300 text-yellow-900'
                        : 'bg-gray-100 border border-gray-300 text-gray-900'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* MSN-style message input area */}
        <div className="bg-gray-100 border-t border-gray-300 relative">
          {/* Emoticon picker */}
          {showEmoticons && (
            <EmoticonPicker 
              onEmoticonSelect={(emoticon) => {
                setMessageInput(prev => prev + emoticon);
                setShowEmoticons(false);
              }}
              onClose={() => setShowEmoticons(false)}
            />
          )}
          
          {/* Formatting toolbar */}
          <div className="flex items-center gap-1 p-1 border-b border-gray-300 bg-gray-50">
            <button className="px-2 py-1 text-xs hover:bg-gray-200 border border-transparent hover:border-gray-400 rounded font-bold">B</button>
            <button className="px-2 py-1 text-xs italic hover:bg-gray-200 border border-transparent hover:border-gray-400 rounded">I</button>
            <button className="px-2 py-1 text-xs underline hover:bg-gray-200 border border-transparent hover:border-gray-400 rounded">U</button>
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            <button className="px-2 py-1 text-xs hover:bg-gray-200 border border-transparent hover:border-gray-400 rounded">A</button>
            <button 
              className={`px-2 py-1 text-xs hover:bg-gray-200 border border-transparent hover:border-gray-400 rounded ${showEmoticons ? 'bg-blue-200 border-blue-400' : ''}`}
              onClick={() => setShowEmoticons(!showEmoticons)}
              title="Emoticon"
            >
              😊
            </button>
            <button className="px-2 py-1 text-xs hover:bg-gray-200 border border-transparent hover:border-gray-400 rounded">🎨</button>
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            <button 
              className="px-2 py-1 text-xs hover:bg-gray-200 border border-transparent hover:border-gray-400 rounded"
              onClick={() => setShowFileTransfer(true)}
              title="Invia file"
            >
              📁
            </button>
          </div>
          
          {/* Input area */}
          <div className="p-2">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Clicca qui per inserire il messaggio"
              className="w-full h-16 p-2 border border-gray-300 rounded text-xs resize-none focus:outline-none focus:border-blue-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage(activeConversation, messageInput);
                }
              }}
            />
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-600">Premi Invio per inviare, Maiusc+Invio per andare a capo</div>
              <Button95 
                className="text-xs px-3"
                onClick={() => onSendMessage(activeConversation, messageInput)}
                disabled={!messageInput.trim()}
              >
                Invia
              </Button95>
            </div>
          </div>
        </div>

        {/* File Transfer Dialog */}
        {showFileTransfer && activeConversation && (
          <FileTransferDialog 
            activeConversation={activeConversation}
            onFileTransfer={onFileTransfer}
            onClose={() => setShowFileTransfer(false)}
          />
        )}
      </div>
    );
  }
  
  // Show contact list - authentic MSN Messenger style
  return (
    <div className="h-full flex flex-col bg-white">
      {/* MSN Messenger header */}
      <div className="bg-gradient-to-b from-orange-400 to-orange-600 text-white p-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-orange-600 font-bold text-xs">MSN</span>
          </div>
          <div>
            <div className="font-bold text-sm">Windows Live Messenger</div>
            <div className="text-xs text-orange-100">Taranto Professional Services</div>
          </div>
        </div>
      </div>
      
      {/* User status bar */}
      <div className="bg-blue-50 border-b border-blue-200 p-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-400 rounded border-2 border-white flex items-center justify-center text-xs font-bold text-white">
            {currentUser === 'cliente' ? 'C' : 'P'}
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold">{currentUser === 'cliente' ? 'Cliente Taranto' : 'Professionista'}</div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-700">Online</span>
            </div>
          </div>
          <button className="text-xs px-2 py-1 bg-gray-200 border border-gray-300 rounded hover:bg-gray-300">▼</button>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="p-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Cerca contatti..." 
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-400"
          />
          <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">🔍</button>
        </div>
      </div>
      
      {/* Contacts list */}
      <div className="flex-1 bg-white overflow-y-auto">
        {/* Online contacts header */}
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
            <span>▼</span>
            <span>🟢 Online ({contacts.length})</span>
          </div>
        </div>
        
        {contacts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-3xl mb-2">😔</div>
            <div className="text-xs">Nessun contatto online</div>
            <div className="text-xs text-gray-400">Invita amici a chattare!</div>
          </div>
        ) : (
          <div className="p-1">
            {contacts.map(contact => {
              const lastMessage = messages.find(msg => msg.from === contact);
              const unreadCount = messages.filter(msg => msg.from === contact && msg.unread).length;
              
              return (
                <div 
                  key={contact}
                  className="flex items-center gap-3 p-2 hover:bg-blue-50 cursor-pointer rounded border-l-4 border-transparent hover:border-blue-400 transition-all transform hover:scale-102 hover:shadow-sm"
                  onClick={() => onOpenConversation(contact)}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
                      {contact.charAt(0)}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center online-pulse">
                      <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="text-xs font-bold text-gray-900 truncate">{contact}</div>
                      {unreadCount > 0 && (
                        <div className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-4 h-4 flex items-center justify-center ml-2 msn-notification">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {contact.includes('Dott') ? '👨‍⚕️ Medico' : 
                       contact.includes('Avv') ? '⚖️ Avvocato' : 
                       contact.includes('Arch') ? '🏗️ Architetto' : '💼 Professionista'}
                    </div>
                    {lastMessage && (
                      <div className="text-xs text-blue-600 truncate mt-1 italic">
                        "{lastMessage.message.length > 25 
                          ? lastMessage.message.substring(0, 25) + '...' 
                          : lastMessage.message}"
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Offline contacts */}
        <div className="bg-gray-100 px-3 py-2 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <span>▶</span>
            <span>⚫ Offline (0)</span>
          </div>
        </div>
      </div>
      
      {/* Bottom toolbar */}
      <div className="bg-gray-100 border-t border-gray-300 p-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            <button className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 border border-green-600">Aggiungi</button>
            <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 border border-blue-600">Invita</button>
          </div>
          <div className="flex gap-1">
            <button 
              className="w-6 h-6 bg-gray-200 border border-gray-400 rounded text-xs hover:bg-gray-300 flex items-center justify-center"
              onClick={() => onShowMessage('Musica', '🎵 Player musicale MSN attivato!', 'info')}
              title="Player musicale"
            >
              🎵
            </button>
            <button 
              className="w-6 h-6 bg-gray-200 border border-gray-400 rounded text-xs hover:bg-gray-300 flex items-center justify-center"
              onClick={() => onShowMessage('Email', '📧 Client email attivato!', 'info')}
              title="Email Hotmail"
            >
              📧
            </button>
            <button 
              className="w-6 h-6 bg-gray-200 border border-gray-400 rounded text-xs hover:bg-gray-300 flex items-center justify-center"
              onClick={() => onShowMessage('Impostazioni', '⚙️ Impostazioni MSN aperte!', 'info')}
              title="Impostazioni MSN"
            >
              ⚙️
            </button>
          </div>
        </div>
        
        {/* File transfers indicator */}
        {fileTransfers.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length > 0 && (
          <div className="mt-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded p-1">
            📁 {fileTransfers.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length} trasferimenti attivi
          </div>
        )}
      </div>
    </div>
  );
};
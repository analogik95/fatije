import React from 'react';
import { WindowData, WindowState, WindowAnimationType } from '../../types';

interface WindowProps {
  window: WindowData;
  children: React.ReactNode;
  className?: string;
  isActive: boolean;
  windowState: WindowState;
  animation: WindowAnimationType;
  onStartDrag: (e: React.MouseEvent | React.TouchEvent, windowId: number) => void;
  onStartResize: (e: React.MouseEvent | React.TouchEvent, windowId: number) => void;
  onMinimize: (windowId: number) => void;
  onClose: (windowId: number) => void;
  onFocus: (windowId: number) => void;
  activeConversation?: string | null;
}

export const Window: React.FC<WindowProps> = ({ 
  window, 
  children, 
  className = "",
  isActive,
  windowState,
  animation,
  onStartDrag,
  onStartResize,
  onMinimize,
  onClose,
  onFocus,
  activeConversation
}) => {
  if (windowState.minimized && animation !== 'minimizing') return null;

  const getAnimationClass = () => {
    switch (animation) {
      case 'opening':
        return 'animate-[windowOpen_0.3s_ease-out]';
      case 'closing':
        return 'animate-[windowClose_0.2s_ease-in]';
      case 'minimizing':
        return 'animate-[windowMinimize_0.2s_ease-in]';
      case 'restoring':
        return 'animate-[windowRestore_0.3s_ease-out]';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`fixed bg-gray-300 border-2 ${isActive ? 'border-gray-600' : 'border-gray-400'} shadow-lg ${className} ${getAnimationClass()}`}
      style={{ 
        zIndex: isActive ? 1000 : 999,
        boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,255,255,0.7)',
        top: `${windowState.y}px`,
        left: `${windowState.x}px`,
        width: `${windowState.width}px`,
        height: `${windowState.height}px`,
        minWidth: '200px',
        minHeight: '150px',
        opacity: animation === 'closing' || animation === 'minimizing' ? 0 : 1
      }}
      onClick={(e) => {
        e.stopPropagation();
        onFocus(window.id);
      }}
    >
      {/* Title bar */}
      <div 
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-2 py-1 flex justify-between items-center text-sm font-bold cursor-move select-none transition-all hover:from-blue-500 hover:to-blue-700"
        onMouseDown={(e) => onStartDrag(e, window.id)}
        onTouchStart={(e) => onStartDrag(e, window.id)}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 border border-gray-800"></div>
          <span className="text-xs sm:text-sm truncate">
            {window.type === 'messages' && activeConversation 
              ? `Chat con ${activeConversation}` 
              : window.title}
          </span>
        </div>
        <div className="flex gap-1">
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation(); 
              onMinimize(window.id); 
            }}
            className="w-4 h-4 bg-gray-300 border border-gray-600 text-black text-xs flex items-center justify-center hover:bg-gray-200 font-bold transition-all transform hover:scale-110"
            style={{ boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.8), inset -1px -1px 2px rgba(0,0,0,0.3)' }}
          >
            _
          </button>
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation(); 
              onClose(window.id); 
            }}
            className="w-4 h-4 bg-gray-300 border border-gray-600 text-black text-xs flex items-center justify-center hover:bg-gray-200 font-bold transition-all transform hover:scale-110 hover:bg-red-300"
            style={{ boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.8), inset -1px -1px 2px rgba(0,0,0,0.3)' }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Menu bar - hide for messages window */}
      {window.type !== 'messages' && (
        <div className="bg-gray-200 px-2 py-1 border-b border-gray-400 text-xs">
          <span>File  Modifica  Visualizza  Aiuto</span>
        </div>
      )}

      {/* Content */}
      <div className="bg-white overflow-auto" style={{ 
        height: window.type === 'messages' ? 'calc(100% - 30px)' : 'calc(100% - 60px)' 
      }}>
        {window.type === 'messages' ? (
          children
        ) : (
          <div className="p-3">
            {children}
          </div>
        )}
      </div>

      {/* Resize handles */}
      <div 
        className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize bg-gray-400 border-l border-t border-gray-600 hover:bg-gray-500 transition-colors"
        onMouseDown={(e) => onStartResize(e, window.id)}
        onTouchStart={(e) => onStartResize(e, window.id)}
      />
    </div>
  );
};
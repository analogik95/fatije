import { useState, useEffect } from 'react';
import { WindowData, WindowState, WindowAnimationType } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { useSounds } from './useSounds';

export const useWindowManagement = () => {
  const [openWindows, setOpenWindows] = useState<WindowData[]>([]);
  const [activeWindow, setActiveWindow] = useState<number | null>(null);
  const [windowStates, setWindowStates] = useLocalStorage<Record<number, WindowState>>('window-states', {});
  const [windowAnimations, setWindowAnimations] = useState<Record<number, WindowAnimationType>>({});
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragWindowId, setDragWindowId] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeWindowId, setResizeWindowId] = useState<number | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const {
    playOpenSound,
    playCloseSound,
    playMinimizeSound,
    playMaximizeSound
  } = useSounds();

  const getDefaultWindowState = (windowId: number): WindowState => {
    const windowIndex = openWindows.findIndex(w => w.id === windowId);
    const isMobile = window.innerWidth < 768;
    
    return {
      x: isMobile ? 10 : 100 + (windowIndex * 30),
      y: isMobile ? 50 + (windowIndex * 20) : 100 + (windowIndex * 30),
      width: isMobile ? window.innerWidth - 20 : 420,
      height: isMobile ? window.innerHeight - 100 : 450,
      minimized: false
    };
  };

  const openWindow = (windowType: string, title: string) => {
    const existingWindow = openWindows.find(w => w.type === windowType);
    if (existingWindow) {
      if (windowStates[existingWindow.id]?.minimized) {
        // Play restore sound and animation
        playMaximizeSound();
        setWindowAnimations(prev => ({ ...prev, [existingWindow.id]: 'restoring' }));
        
        setWindowStates(prev => ({
          ...prev,
          [existingWindow.id]: { ...prev[existingWindow.id], minimized: false }
        }));
        
        // Clear animation after duration
        setTimeout(() => {
          setWindowAnimations(prev => ({ ...prev, [existingWindow.id]: null }));
        }, 300);
      }
      setActiveWindow(existingWindow.id);
      return;
    }

    const newWindow = {
      id: Date.now(),
      type: windowType,
      title: title
    };
    
    // Play open sound and start opening animation
    playOpenSound();
    setWindowAnimations(prev => ({ ...prev, [newWindow.id]: 'opening' }));
    
    setOpenWindows(prev => [...prev, newWindow]);
    setActiveWindow(newWindow.id);
    
    // Set custom size for messages window (MSN-style)
    let windowState = getDefaultWindowState(newWindow.id);
    if (windowType === 'messages') {
      windowState = {
        ...windowState,
        width: window.innerWidth < 768 ? window.innerWidth - 20 : 280,
        height: window.innerHeight < 768 ? window.innerHeight - 100 : 420
      };
    }
    
    setWindowStates(prev => ({
      ...prev,
      [newWindow.id]: windowState
    }));
    
    // Clear opening animation after duration
    setTimeout(() => {
      setWindowAnimations(prev => ({ ...prev, [newWindow.id]: null }));
    }, 300);
  };

  const closeWindow = (windowId: number) => {
    // Play close sound and start closing animation
    playCloseSound();
    setWindowAnimations(prev => ({ ...prev, [windowId]: 'closing' }));
    
    // Remove window after animation
    setTimeout(() => {
      setOpenWindows(prev => prev.filter(w => w.id !== windowId));
      setWindowStates(prev => {
        const newStates = { ...prev };
        delete newStates[windowId];
        return newStates;
      });
      setWindowAnimations(prev => {
        const newAnimations = { ...prev };
        delete newAnimations[windowId];
        return newAnimations;
      });
      
      if (activeWindow === windowId) {
        const remaining = openWindows.filter(w => w.id !== windowId);
        setActiveWindow(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
      }
    }, 200);
  };

  const minimizeWindow = (windowId: number) => {
    // Play minimize sound and start minimizing animation
    playMinimizeSound();
    setWindowAnimations(prev => ({ ...prev, [windowId]: 'minimizing' }));
    
    setTimeout(() => {
      setWindowStates(prev => ({
        ...prev,
        [windowId]: { ...prev[windowId], minimized: true }
      }));
      
      setWindowAnimations(prev => ({ ...prev, [windowId]: null }));
      
      if (activeWindow === windowId) {
        const remaining = openWindows.filter(w => {
          const state = windowStates[w.id];
          return w.id !== windowId && (!state || !state.minimized);
        });
        setActiveWindow(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
      }
    }, 200);
  };

  const restoreWindow = (windowId: number) => {
    // Play restore sound and animation
    playMaximizeSound();
    setWindowAnimations(prev => ({ ...prev, [windowId]: 'restoring' }));
    
    setWindowStates(prev => ({
      ...prev,
      [windowId]: { ...prev[windowId], minimized: false }
    }));
    setActiveWindow(windowId);
    
    // Clear animation after duration
    setTimeout(() => {
      setWindowAnimations(prev => ({ ...prev, [windowId]: null }));
    }, 300);
  };

  const focusWindow = (windowId: number) => {
    setActiveWindow(windowId);
  };

  // Drag functionality
  const startDrag = (e: React.MouseEvent | React.TouchEvent, windowId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    setDragWindowId(windowId);
    setDragStart({ x: clientX, y: clientY });
    setActiveWindow(windowId);
    
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'move';
    document.body.classList.add('window-dragging');
  };

  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !dragWindowId) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    const currentState = windowStates[dragWindowId] || getDefaultWindowState(dragWindowId);
    const newX = Math.max(0, Math.min(window.innerWidth - currentState.width, currentState.x + deltaX));
    const newY = Math.max(0, Math.min(window.innerHeight - 100, currentState.y + deltaY));
    
    setWindowStates(prev => ({
      ...prev,
      [dragWindowId]: { ...currentState, x: newX, y: newY }
    }));
    
    setDragStart({ x: clientX, y: clientY });
  };

  const stopDrag = () => {
    setIsDragging(false);
    setDragWindowId(null);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    document.body.classList.remove('window-dragging');
  };

  // Resize functionality
  const startResize = (e: React.MouseEvent | React.TouchEvent, windowId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const currentState = windowStates[windowId] || getDefaultWindowState(windowId);
    
    setIsResizing(true);
    setResizeWindowId(windowId);
    setResizeStart({ 
      x: clientX, 
      y: clientY, 
      width: currentState.width, 
      height: currentState.height 
    });
    setActiveWindow(windowId);
    
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'nwse-resize';
  };

  const handleResize = (e: MouseEvent | TouchEvent) => {
    if (!isResizing || !resizeWindowId) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - resizeStart.x;
    const deltaY = clientY - resizeStart.y;
    
    const newWidth = Math.max(200, Math.min(window.innerWidth - 50, resizeStart.width + deltaX));
    const newHeight = Math.max(150, Math.min(window.innerHeight - 100, resizeStart.height + deltaY));
    
    const currentState = windowStates[resizeWindowId] || getDefaultWindowState(resizeWindowId);
    
    setWindowStates(prev => ({
      ...prev,
      [resizeWindowId]: { ...currentState, width: newWidth, height: newHeight }
    }));
  };

  const stopResize = () => {
    setIsResizing(false);
    setResizeWindowId(null);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  };

  // Mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragWindowId) {
        handleDrag(e);
      } else if (isResizing && resizeWindowId) {
        handleResize(e);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        stopDrag();
      } else if (isResizing) {
        stopResize();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && dragWindowId) {
        handleDrag(e);
      } else if (isResizing && resizeWindowId) {
        handleResize(e);
      }
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        stopDrag();
      } else if (isResizing) {
        stopResize();
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, isResizing, dragWindowId, resizeWindowId, dragStart, resizeStart]);

  return {
    // State
    openWindows,
    activeWindow,
    windowStates,
    windowAnimations,
    
    // Actions
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
    startDrag,
    startResize,
    
    // Utilities
    getDefaultWindowState,
    setOpenWindows,
    setWindowStates,
    setActiveWindow
  };
};
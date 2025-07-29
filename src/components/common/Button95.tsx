import React from 'react';
import { useSounds } from '../../hooks/useSounds';

interface Button95Props {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  variant?: 'default' | 'primary';
  disabled?: boolean;
}

export const Button95 = React.forwardRef<HTMLButtonElement, Button95Props>(({ 
  children, 
  onClick, 
  className = "", 
  variant = "default", 
  disabled = false 
}, ref) => {
  const { playClickSound } = useSounds();
  
  const baseStyle = "px-2 py-1 sm:px-3 sm:py-1 border-2 text-xs sm:text-sm font-bold cursor-pointer transition-all transform hover:brightness-110 win95-button";
  const variants = {
    default: "bg-gray-300 border-gray-600 hover:bg-gray-200 active:border-gray-400",
    primary: "bg-blue-500 text-white border-blue-700 hover:bg-blue-400 active:border-blue-300"
  };
  
  const handleClick = (e: React.MouseEvent) => {
    if (!disabled && onClick) {
      playClickSound();
      onClick(e);
    }
  };
  
  return (
    <button 
      ref={ref}
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ 
        boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.8), inset -1px -1px 2px rgba(0,0,0,0.3)'
      }}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
});
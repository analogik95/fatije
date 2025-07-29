import { useCallback, useRef } from 'react';

export const useSounds = () => {
  // Web Audio API context for generating sounds - create lazily to avoid autoplay policy issues
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current && typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        audioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.log('AudioContext creation failed:', error);
        return null;
      }
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    try {
      // Resume context if it's suspended (required for autoplay policy)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Audio playback failed:', error);
    }
  }, [getAudioContext]);

  const playBootSound = useCallback(() => {
    // Windows 95 startup sound approximation
    setTimeout(() => playTone(523, 0.2), 0);
    setTimeout(() => playTone(659, 0.2), 200);
    setTimeout(() => playTone(784, 0.3), 400);
    setTimeout(() => playTone(1047, 0.4), 700);
  }, [playTone]);

  const playClickSound = useCallback(() => {
    // Quick click sound
    playTone(800, 0.05, 'square', 0.05);
  }, [playTone]);

  const playOpenSound = useCallback(() => {
    // Window open sound - ascending tone
    playTone(400, 0.1);
    setTimeout(() => playTone(600, 0.1), 50);
    setTimeout(() => playTone(800, 0.1), 100);
  }, [playTone]);

  const playCloseSound = useCallback(() => {
    // Window close sound - descending tone
    playTone(800, 0.1);
    setTimeout(() => playTone(600, 0.1), 50);
    setTimeout(() => playTone(400, 0.1), 100);
  }, [playTone]);

  const playMinimizeSound = useCallback(() => {
    // Minimize sound - quick descending
    playTone(600, 0.08);
    setTimeout(() => playTone(300, 0.08), 40);
  }, [playTone]);

  const playMaximizeSound = useCallback(() => {
    // Maximize/restore sound - quick ascending
    playTone(300, 0.08);
    setTimeout(() => playTone(600, 0.08), 40);
  }, [playTone]);

  const playErrorSound = useCallback(() => {
    // Error sound - harsh tone
    playTone(200, 0.3, 'sawtooth', 0.15);
  }, [playTone]);

  const playSuccessSound = useCallback(() => {
    // Success sound - pleasant chord
    playTone(523, 0.2);
    setTimeout(() => playTone(659, 0.2), 0);
    setTimeout(() => playTone(784, 0.3), 100);
  }, [playTone]);

  const playNotificationSound = useCallback(() => {
    // MSN-style notification
    playTone(880, 0.15);
    setTimeout(() => playTone(1108, 0.15), 100);
  }, [playTone]);

  const playShutdownSound = useCallback(() => {
    // Windows 95 shutdown sound approximation
    playTone(1047, 0.2);
    setTimeout(() => playTone(784, 0.2), 200);
    setTimeout(() => playTone(659, 0.2), 400);
    setTimeout(() => playTone(523, 0.4), 600);
  }, [playTone]);

  return {
    playBootSound,
    playClickSound,
    playOpenSound,
    playCloseSound,
    playMinimizeSound,
    playMaximizeSound,
    playErrorSound,
    playSuccessSound,
    playNotificationSound,
    playShutdownSound
  };
};
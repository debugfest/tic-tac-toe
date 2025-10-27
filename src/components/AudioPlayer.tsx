// src/AudioPlayer.tsx
import { useEffect, useRef, useState } from 'react';
import backgroundAudioFile from '../../audio/ambient-game-67014.mp3';

export const AudioPlayer = () => {
  const [muted, setMuted] = useState(true); // default to muted
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element once
    const audio = new Audio(backgroundAudioFile);
    audio.loop = true;
    audio.volume = 0.4;
    audio.muted = muted;
    audioRef.current = audio;

    // Attempt to play (may fail due to autoplay restrictions)
    audio.play().catch(() => {
      console.log('Autoplay blocked until user interacts');
    });

    // Cleanup on unmount
    return () => {
      audio.pause();
    };
  }, []);

  // Update muted state when toggle changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  return (
    <button
      onClick={() => setMuted(prev => !prev)}
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        width: 50,
        height: 50,
        borderRadius: '50%',
        border: 'none',
        backgroundColor: muted ? '#1E3A8A' : '#3B82F6', // dark blue when muted, bright blue when unmuted
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s, transform 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      title={muted ? 'Unmute audio' : 'Mute audio'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}


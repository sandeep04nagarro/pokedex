import React, { useState, useRef } from 'react';

interface CryPlayerProps {
  latestUrl: string;
  legacyUrl: string;
  pokemonName: string;
}

export function CryPlayer({ latestUrl, legacyUrl, pokemonName }: CryPlayerProps) {
  const [playingVersion, setPlayingVersion] = useState<'latest' | 'legacy' | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playCry = (url: string, version: 'latest' | 'legacy') => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingVersion(version);
    audio.play().catch(() => setPlayingVersion(null));
    audio.onended = () => setPlayingVersion(null);
    audio.onerror = () => setPlayingVersion(null);
  };

  return (
    <div className="cry-player">
      <span className="cry-label">Cry:</span>
      <button
        className="cry-button"
        onClick={() => playCry(latestUrl, 'latest')}
        disabled={playingVersion !== null}
        aria-label={`Play latest cry for ${pokemonName}`}
      >
        {playingVersion === 'latest' ? '▶ Playing...' : '🔊 Play Cry'}
      </button>
      <button
        className="cry-button cry-button-secondary"
        onClick={() => playCry(legacyUrl, 'legacy')}
        disabled={playingVersion !== null}
        aria-label={`Play classic cry for ${pokemonName}`}
      >
        {playingVersion === 'legacy' ? '▶ Playing...' : '🔉 Classic'}
      </button>
    </div>
  );
}

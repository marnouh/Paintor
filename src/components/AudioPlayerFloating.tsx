import React from 'react';
import { useApp } from '../context/AppContext.tsx';

export const AudioPlayerFloating: React.FC = () => {
  const { currentAudio, toggleAudioPlayback, stopAudio } = useApp();

  if (!currentAudio) return null;

  return (
    <aside className="fixed bottom-16 right-4 z-40 max-w-sm animate-fade-in">
      <div className="flex items-center gap-3 py-2 px-3.5 rounded-full bg-[#201f24]/95 backdrop-blur-md border border-[#f2ca50]/40 text-[#e5e1e8] gilded-glow shadow-xl">
        <button
          onClick={() => toggleAudioPlayback()}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f2ca50] text-[#3c2f00] hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md shrink-0"
          title={currentAudio.isPlaying ? 'Mettre en pause' : 'Reprendre'}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {currentAudio.isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>

        <div className="flex flex-col text-left pr-2">
          <div className="flex items-center gap-1.5">
            <span className="font-label-caps text-[9px] text-[#f2ca50] uppercase font-bold tracking-wider">
              En écoute
            </span>
            <span className="text-[10px] text-[#99907c]">• {currentAudio.speaker}</span>
          </div>
          <span className="font-body-sm text-[11px] text-[#e5e1e8] truncate max-w-[150px] font-medium leading-tight">
            {currentAudio.title}
          </span>
        </div>

        {/* Animated wave bars */}
        <div className="flex items-end gap-1 h-4">
          <span
            className={`w-1 bg-[#f2ca50] rounded-full transition-all ${
              currentAudio.isPlaying ? 'h-3 animate-pulse' : 'h-1.5'
            }`}
          />
          <span
            className={`w-1 bg-[#f2ca50] rounded-full transition-all ${
              currentAudio.isPlaying ? 'h-4 animate-pulse [animation-delay:150ms]' : 'h-2'
            }`}
          />
          <span
            className={`w-1 bg-[#f2ca50] rounded-full transition-all ${
              currentAudio.isPlaying ? 'h-2.5 animate-pulse [animation-delay:300ms]' : 'h-1'
            }`}
          />
        </div>

        <button
          onClick={stopAudio}
          className="text-[#99907c] hover:text-[#e5e1e8] p-1 ml-1 cursor-pointer transition-colors"
          title="Fermer l'audio"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </aside>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';

export const formatAudioTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const AudioPlayerFloating: React.FC = () => {
  const {
    currentAudio,
    toggleAudioPlayback,
    seekAudio,
    skipAudio,
    setAudioPlaybackRate,
    retryAudio,
    switchAudioMode,
    stopAudio,
    setIsAudioModalOpen,
  } = useApp();

  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  if (!currentAudio) return null;

  const progressPercent = currentAudio.duration > 0
    ? Math.min(100, Math.max(0, (currentAudio.currentTime / currentAudio.duration) * 100))
    : 0;

  const cyclePlaybackRate = () => {
    const rates = [1.0, 1.25, 1.5, 2.0, 0.75];
    const currentIndex = rates.indexOf(currentAudio.playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setAudioPlaybackRate(nextRate);
  };

  if (isMinimized) {
    return (
      <aside className="fixed bottom-16 right-4 z-40 animate-fade-in">
        <div className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-[#1c1b20]/95 backdrop-blur-md border border-[#f2ca50]/50 text-[#e5e1e8] shadow-2xl">
          <button
            onClick={() => toggleAudioPlayback()}
            aria-label={currentAudio.isPlaying ? 'Mettre en pause' : 'Reprendre la lecture'}
            className="w-7 h-7 rounded-full bg-[#f2ca50] text-[#3c2f00] flex items-center justify-center hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-[16px]">
              {currentAudio.isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            aria-label="Agrandir le lecteur"
            className="flex items-center gap-1.5 text-left cursor-pointer hover:text-[#f2ca50] transition-colors"
          >
            <span className="text-[11px] font-medium truncate max-w-[120px]">
              {currentAudio.title}
            </span>
            <span className="text-[10px] text-[#f2ca50] font-mono">
              {formatAudioTime(currentAudio.currentTime)}
            </span>
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="text-[#99907c] hover:text-[#e5e1e8] p-1 cursor-pointer"
            title="Déplier"
          >
            <span className="material-symbols-outlined text-[16px]">expand_less</span>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed bottom-16 left-3 right-3 sm:left-auto sm:right-4 sm:w-[420px] z-40 animate-slide-up">
      <div className="bg-[#1c1b20]/98 backdrop-blur-xl border border-[#f2ca50]/40 rounded-2xl p-3 shadow-2xl text-[#e5e1e8] gilded-glow flex flex-col gap-2">
        {/* Error Notification Banner if playback error */}
        {currentAudio.hasError && (
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-[11px] animate-fade-in">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-[16px] text-red-400 shrink-0">
                error
              </span>
              <span className="truncate">
                {currentAudio.errorMessage || 'Erreur de lecture audio studio.'}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => retryAudio()}
                className="px-2 py-0.5 rounded-md bg-red-800/80 hover:bg-red-700 text-white font-medium text-[10px] cursor-pointer transition-colors"
              >
                Réessayer
              </button>
              <button
                onClick={() => switchAudioMode('speech')}
                className="px-2 py-0.5 rounded-md bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-bold text-[10px] cursor-pointer transition-colors"
                title="Lire avec la synthèse vocale française"
              >
                Voix TTS
              </button>
            </div>
          </div>
        )}

        {/* Top bar: Artwork thumbnail, Title, Mode, Minimize, Close */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setIsAudioModalOpen(true)}
            className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-[#f2ca50]/40 cursor-pointer group shadow-sm bg-[#201f24]"
            title="Ouvrir la transcription et le lecteur plein format"
          >
            <img
              src={currentAudio.artworkImage}
              alt={currentAudio.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {currentAudio.isPlaying && (
              <span className="absolute inset-0 bg-[#f2ca50]/20 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-ping" />
              </span>
            )}
          </div>

          <div
            onClick={() => setIsAudioModalOpen(true)}
            className="flex-1 min-w-0 cursor-pointer group"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-label-caps text-[9px] text-[#f2ca50] uppercase font-bold tracking-wider">
                {currentAudio.mode === 'speech' ? 'Voix Synthèse (TTS)' : 'Piste Audio Studio'}
              </span>
              <span className="text-[10px] text-[#99907c] truncate">• {currentAudio.speaker}</span>
            </div>
            <h4 className="text-[12.5px] font-medium text-[#e5e1e8] group-hover:text-[#f2ca50] truncate transition-colors leading-snug">
              {currentAudio.title}
            </h4>
            <p className="text-[10.5px] text-[#99907c] truncate leading-tight">
              {currentAudio.subtitle}
            </p>
          </div>

          {/* Action buttons: Maximize, Minimize, Close */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsAudioModalOpen(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] hover:bg-white/[0.05] transition-colors cursor-pointer"
              title="Agrandir & Transcription"
            >
              <span className="material-symbols-outlined text-[17px]">open_in_full</span>
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#d0c5af] hover:text-[#e5e1e8] hover:bg-white/[0.05] transition-colors cursor-pointer"
              title="Réduire"
            >
              <span className="material-symbols-outlined text-[17px]">expand_more</span>
            </button>
            <button
              onClick={stopAudio}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#99907c] hover:text-red-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
              title="Arrêter l'audio"
            >
              <span className="material-symbols-outlined text-[17px]">close</span>
            </button>
          </div>
        </div>

        {/* Timeline & Scrubber Slider */}
        <div className="space-y-1 pt-1">
          <div className="relative flex items-center group cursor-pointer">
            <input
              type="range"
              min={0}
              max={currentAudio.duration || 100}
              step={0.5}
              value={currentAudio.currentTime}
              onChange={(e) => seekAudio(Number(e.target.value))}
              aria-label="Progression audio"
              className="w-full h-1.5 bg-[#36343a] rounded-lg appearance-none cursor-pointer accent-[#f2ca50] focus:outline-none"
              style={{
                background: `linear-gradient(to right, #f2ca50 ${progressPercent}%, #36343a ${progressPercent}%)`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#99907c] px-0.5">
            <span className="text-[#e5e1e8] font-semibold">
              {formatAudioTime(currentAudio.currentTime)}
            </span>
            <span>{formatAudioTime(currentAudio.duration)}</span>
          </div>
        </div>

        {/* Playback Controls Row */}
        <div className="flex items-center justify-between pt-0.5">
          {/* Rate selector button */}
          <button
            onClick={cyclePlaybackRate}
            className="px-2 py-0.5 rounded-md bg-[#201f24] hover:bg-[#2b292f] border border-white/10 text-[10.5px] font-mono text-[#d0c5af] hover:text-[#f2ca50] transition-colors cursor-pointer"
            title="Changer la vitesse de lecture"
          >
            {currentAudio.playbackRate}x
          </button>

          {/* Center media transport: -10s, Play/Pause, +10s */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => skipAudio(-10)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] hover:bg-white/[0.05] transition-colors cursor-pointer"
              title="Reculer de 10 secondes"
            >
              <span className="material-symbols-outlined text-[18px]">replay_10</span>
            </button>

            <button
              onClick={() => toggleAudioPlayback()}
              disabled={currentAudio.isLoading}
              aria-label={currentAudio.isPlaying ? 'Pause' : 'Lecture'}
              className="w-9 h-9 rounded-full bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer font-bold disabled:opacity-75"
            >
              {currentAudio.isLoading ? (
                <span className="w-4 h-4 border-2 border-[#3c2f00] border-t-transparent rounded-full animate-spin" />
              ) : (
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {currentAudio.isPlaying ? 'pause' : 'play_arrow'}
                </span>
              )}
            </button>

            <button
              onClick={() => skipAudio(10)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] hover:bg-white/[0.05] transition-colors cursor-pointer"
              title="Avancer de 10 secondes"
            >
              <span className="material-symbols-outlined text-[18px]">forward_10</span>
            </button>
          </div>

          {/* Mode switch or transcript toggle shortcut */}
          <button
            onClick={() =>
              switchAudioMode(currentAudio.mode === 'file' ? 'speech' : 'file')
            }
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#201f24] hover:bg-[#2b292f] border border-white/10 text-[10.5px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors cursor-pointer"
            title={
              currentAudio.mode === 'file'
                ? 'Basculer en voix de synthèse (TTS)'
                : 'Basculer en piste studio'
            }
          >
            <span className="material-symbols-outlined text-[13px]">
              {currentAudio.mode === 'file' ? 'graphic_eq' : 'record_voice_over'}
            </span>
            <span className="font-label-caps text-[9px] uppercase">
              {currentAudio.mode === 'file' ? 'Studio' : 'TTS'}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

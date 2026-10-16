import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { formatAudioTime } from './AudioPlayerFloating.tsx';

export const AudioPlayerModal: React.FC = () => {
  const {
    currentAudio,
    isAudioModalOpen,
    setIsAudioModalOpen,
    toggleAudioPlayback,
    seekAudio,
    skipAudio,
    setAudioPlaybackRate,
    setAudioVolume,
    toggleAudioMute,
    retryAudio,
    switchAudioMode,
    stopAudio,
    openGigapixel,
    openArtwork,
  } = useApp();

  const [showFullTranscript, setShowFullTranscript] = useState<boolean>(true);

  if (!isAudioModalOpen || !currentAudio) return null;

  const progressPercent =
    currentAudio.duration > 0
      ? Math.min(100, Math.max(0, (currentAudio.currentTime / currentAudio.duration) * 100))
      : 0;

  const remainingSeconds = Math.max(0, currentAudio.duration - currentAudio.currentTime);

  const speedOptions = [0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#1c1b20] border border-[#f2ca50]/40 rounded-3xl overflow-hidden shadow-2xl text-[#e5e1e8]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#201f24]/70">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">
              headphones
            </span>
            <span className="font-label-caps text-[11px] text-[#f2ca50] uppercase tracking-wider font-bold">
              Guide Audio & Commentaire Curatoriel
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsAudioModalOpen(false)}
              aria-label="Réduire en barre flottante"
              className="p-1.5 rounded-full text-[#d0c5af] hover:text-[#e5e1e8] hover:bg-white/10 transition-colors cursor-pointer"
              title="Réduire en barre flottante"
            >
              <span className="material-symbols-outlined text-[20px]">expand_more</span>
            </button>
            <button
              onClick={() => {
                stopAudio();
                setIsAudioModalOpen(false);
              }}
              aria-label="Fermer et arrêter"
              className="p-1.5 rounded-full text-[#99907c] hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
              title="Arrêter la lecture"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scroll">
          {/* Error Banner if any */}
          {currentAudio.hasError && (
            <div className="p-3.5 bg-red-950/70 border border-red-500/50 rounded-2xl flex items-start gap-3 text-red-200">
              <span className="material-symbols-outlined text-red-400 text-[22px] mt-0.5 shrink-0">
                warning
              </span>
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-[13px] text-white">
                  Erreur de chargement audio
                </h5>
                <p className="text-[11.5px] text-red-300 mt-0.5">
                  {currentAudio.errorMessage || 'Impossible de diffuser le fichier audio studio.'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => retryAudio()}
                    className="px-3 py-1 rounded-lg bg-red-800 hover:bg-red-700 text-white font-medium text-[11px] cursor-pointer transition-colors"
                  >
                    Réessayer
                  </button>
                  <button
                    onClick={() => switchAudioMode('speech')}
                    className="px-3 py-1 rounded-lg bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-bold text-[11px] cursor-pointer transition-colors"
                  >
                    Activer la Voix de Synthèse (TTS)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Artwork Cover & Visual */}
          <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#f2ca50]/40 shadow-2xl bg-[#0e0e12] group">
            <img
              src={currentAudio.artworkImage}
              alt={currentAudio.title}
              className={`w-full h-full object-cover transition-all duration-700 ${
                currentAudio.isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />
            {currentAudio.isPlaying && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-3">
                <div className="flex items-end gap-1.5 h-6">
                  <span className="w-1.5 bg-[#f2ca50] rounded-full h-4 animate-pulse" />
                  <span className="w-1.5 bg-[#f2ca50] rounded-full h-6 animate-pulse [animation-delay:150ms]" />
                  <span className="w-1.5 bg-[#f2ca50] rounded-full h-3 animate-pulse [animation-delay:300ms]" />
                  <span className="w-1.5 bg-[#f2ca50] rounded-full h-5 animate-pulse [animation-delay:450ms]" />
                </div>
              </div>
            )}
          </div>

          {/* Track Metadata Titles */}
          <div className="text-center space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f2ca50]/15 text-[#f2ca50] text-[10px] font-label-caps uppercase tracking-wider font-bold border border-[#f2ca50]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] animate-pulse" />
              {currentAudio.mode === 'speech' ? 'Synthèse Vocale (TTS)' : 'Audio Studio Master'}
            </span>
            <h3 className="font-title-editorial text-[20px] text-[#e5e1e8] font-bold leading-tight">
              {currentAudio.title}
            </h3>
            <p className="text-[13px] text-[#d0c5af] font-medium">{currentAudio.subtitle}</p>
            <p className="text-[11.5px] text-[#99907c]">Voix et analyse : {currentAudio.speaker}</p>
          </div>

          {/* Audio Engine Selector Tabs */}
          <div className="bg-[#201f24] p-1 rounded-xl flex items-center border border-white/[0.08] text-[11px] font-label-caps">
            <button
              onClick={() => switchAudioMode('file')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                currentAudio.mode === 'file'
                  ? 'bg-[#2b292f] border border-[#f2ca50]/50 text-[#f2ca50] font-bold shadow-sm'
                  : 'text-[#d0c5af] hover:text-[#e5e1e8]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">graphic_eq</span>
              <span>Fichier Studio</span>
            </button>
            <button
              onClick={() => switchAudioMode('speech')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                currentAudio.mode === 'speech'
                  ? 'bg-[#2b292f] border border-[#f2ca50]/50 text-[#f2ca50] font-bold shadow-sm'
                  : 'text-[#d0c5af] hover:text-[#e5e1e8]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">record_voice_over</span>
              <span>Voix de Synthèse</span>
            </button>
          </div>

          {/* Timeline & Scrubber Slider */}
          <div className="space-y-1.5 pt-2">
            <div className="relative flex items-center group cursor-pointer">
              <input
                type="range"
                min={0}
                max={currentAudio.duration || 100}
                step={0.5}
                value={currentAudio.currentTime}
                onChange={(e) => seekAudio(Number(e.target.value))}
                aria-label="Barre de progression audio"
                className="w-full h-2 bg-[#36343a] rounded-lg appearance-none cursor-pointer accent-[#f2ca50] focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #f2ca50 ${progressPercent}%, #36343a ${progressPercent}%)`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#99907c]">
              <span className="text-[#e5e1e8] font-semibold">
                {formatAudioTime(currentAudio.currentTime)}
              </span>
              <span>-{formatAudioTime(remainingSeconds)}</span>
            </div>
          </div>

          {/* Big Playback Controls Transport */}
          <div className="flex items-center justify-center gap-6 pt-1">
            <button
              onClick={() => skipAudio(-10)}
              className="w-11 h-11 rounded-full flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] hover:bg-white/[0.05] transition-all active:scale-95 cursor-pointer"
              title="Reculer de 10s"
            >
              <span className="material-symbols-outlined text-[26px]">replay_10</span>
            </button>

            <button
              onClick={() => toggleAudioPlayback()}
              disabled={currentAudio.isLoading}
              aria-label={currentAudio.isPlaying ? 'Mettre en pause' : 'Lancer la lecture'}
              className="w-16 h-16 rounded-full bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] flex items-center justify-center shadow-xl active:scale-95 transition-all cursor-pointer font-bold disabled:opacity-75"
            >
              {currentAudio.isLoading ? (
                <span className="w-6 h-6 border-3 border-[#3c2f00] border-t-transparent rounded-full animate-spin" />
              ) : (
                <span
                  className="material-symbols-outlined text-[36px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {currentAudio.isPlaying ? 'pause' : 'play_arrow'}
                </span>
              )}
            </button>

            <button
              onClick={() => skipAudio(10)}
              className="w-11 h-11 rounded-full flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] hover:bg-white/[0.05] transition-all active:scale-95 cursor-pointer"
              title="Avancer de 10s"
            >
              <span className="material-symbols-outlined text-[26px]">forward_10</span>
            </button>
          </div>

          {/* Volume and Speed Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Speed Pills */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#201f24] border border-white/5">
              <span className="text-[10px] font-label-caps text-[#99907c] uppercase">Vitesse</span>
              <div className="flex items-center gap-1">
                {speedOptions.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setAudioPlaybackRate(rate)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                      currentAudio.playbackRate === rate
                        ? 'bg-[#f2ca50] text-[#3c2f00] font-bold'
                        : 'text-[#d0c5af] hover:text-[#e5e1e8]'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#201f24] border border-white/5">
              <button
                onClick={toggleAudioMute}
                className="text-[#d0c5af] hover:text-[#f2ca50] cursor-pointer"
                title={currentAudio.isMuted ? 'Rétablir le son' : 'Couper le son'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {currentAudio.isMuted || currentAudio.volume === 0
                    ? 'volume_off'
                    : currentAudio.volume < 0.5
                    ? 'volume_down'
                    : 'volume_up'}
                </span>
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={currentAudio.isMuted ? 0 : currentAudio.volume}
                onChange={(e) => setAudioVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-[#36343a] rounded-lg appearance-none cursor-pointer accent-[#f2ca50]"
              />
            </div>
          </div>

          {/* Curator Transcript Panel */}
          <div className="bg-[#201f24] border border-white/[0.08] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">
                  description
                </span>
                <span className="font-label-caps text-[11px] text-[#e5e1e8] font-bold uppercase tracking-wider">
                  Transcription Intégrale du Conservateur
                </span>
              </div>
              <button
                onClick={() => setShowFullTranscript(!showFullTranscript)}
                className="text-[11px] text-[#f2ca50] hover:underline cursor-pointer"
              >
                {showFullTranscript ? 'Masquer' : 'Afficher'}
              </button>
            </div>

            {showFullTranscript && (
              <div className="pt-2 text-[13px] text-[#d0c5af] leading-relaxed italic border-t border-white/5">
                « {currentAudio.transcript} »
              </div>
            )}
          </div>

          {/* Quick Actions: Open Gigapixel / Open Detail */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                setIsAudioModalOpen(false);
                openGigapixel(currentAudio.artworkId);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#201f24] hover:bg-[#2b292f] border border-[#f2ca50]/30 hover:border-[#f2ca50] text-[#e5e1e8] hover:text-[#f2ca50] flex items-center justify-center gap-2 text-[12px] font-medium transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[17px] text-[#f2ca50]">
                zoom_in
              </span>
              <span>Inspecter en Gigapixel</span>
            </button>

            <button
              onClick={() => {
                setIsAudioModalOpen(false);
                openArtwork(currentAudio.artworkId);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#201f24] hover:bg-[#2b292f] border border-white/10 hover:border-white/20 text-[#e5e1e8] flex items-center justify-center gap-2 text-[12px] font-medium transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-[#d0c5af]">
                info
              </span>
              <span>Fiche de l'Œuvre</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

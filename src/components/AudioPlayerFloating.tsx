import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';

export const formatAudioTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Visualiseur de fréquences audio pour l'écoute du guide muséal
 */
export const AudioSpectrumVisualizer: React.FC<{ isPlaying: boolean; barsCount?: number }> = ({
  isPlaying,
  barsCount = 12,
}) => {
  return (
    <div className="flex items-end justify-center gap-1 h-5 px-1 py-0.5 bg-[#141318]/70 rounded-md border border-white/5">
      {Array.from({ length: barsCount }).map((_, i) => {
        // Vary heights and animation delays to mirror audio spectrum frequencies
        const delays = [0, 120, 240, 80, 180, 300, 150, 90, 220, 70, 160, 280];
        const delay = delays[i % delays.length];
        const baseHeight = isPlaying ? 16 : 4;
        return (
          <span
            key={i}
            className={`w-1 rounded-full transition-all duration-200 ${
              isPlaying
                ? 'bg-[#f2ca50] animate-pulse'
                : 'bg-[#99907c]/40'
            }`}
            style={{
              height: isPlaying ? `${Math.max(4, (i % 4 + 1) * 3 + (i % 2) * 2)}px` : '3px',
              animationDuration: isPlaying ? `${600 + (i % 5) * 150}ms` : '0ms',
              animationDelay: `${delay}ms`,
            }}
          />
        );
      })}
    </div>
  );
};

export const AudioPlayerFloating: React.FC = () => {
  const {
    currentAudio,
    toggleAudioPlayback,
    seekAudio,
    skipAudio,
    setAudioPlaybackRate,
    setAudioVolume,
    toggleAudioMute,
    retryAudio,
    switchAudioMode,
    stopAudio,
    setIsAudioModalOpen,
    playAudioToneTest,
    registerAudioDomElement,
  } = useApp();

  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showNativeControls, setShowNativeControls] = useState<boolean>(false);
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);
  const [testToneStatus, setTestToneStatus] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Bind the real DOM HTMLAudioElement to the audioManager singleton
  useEffect(() => {
    if (audioRef.current) {
      registerAudioDomElement(audioRef.current);
    }
  }, [registerAudioDomElement]);

  if (!currentAudio) return null;

  const progressPercent =
    currentAudio.duration > 0
      ? Math.min(100, Math.max(0, (currentAudio.currentTime / currentAudio.duration) * 100))
      : 0;

  const cyclePlaybackRate = () => {
    const rates = [1.0, 1.25, 1.5, 2.0, 0.75];
    const currentIndex = rates.indexOf(currentAudio.playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setAudioPlaybackRate(nextRate);
  };

  const handleTestSound = () => {
    const success = playAudioToneTest(440, 0.4);
    if (success) {
      setTestToneStatus('Diapason 440 Hz émis avec succès');
      setTimeout(() => setTestToneStatus(null), 3000);
    } else {
      setTestToneStatus('Échec émission sonore');
      setTimeout(() => setTestToneStatus(null), 3000);
    }
  };

  if (isMinimized) {
    return (
      <aside className="fixed bottom-16 right-4 z-40 animate-fade-in" aria-label="Lecteur audio réduit">
        {/* Real DOM HTML5 audio element stays mounted so playback continues unbroken */}
        <audio
          ref={audioRef}
          id="regard-floating-audio-min"
          src={currentAudio.audioSrc}
          preload="auto"
          aria-label={`Guide sonore : ${currentAudio.title}`}
          className="sr-only"
        >
          <source src={currentAudio.audioSrc} type="audio/wav" />
          <source src={currentAudio.audioSrc} type="audio/mpeg" />
          Votre navigateur ne supporte pas l'élément audio HTML5.
        </audio>

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
            className="flex items-center gap-2 text-left cursor-pointer hover:text-[#f2ca50] transition-colors"
          >
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-medium truncate max-w-[120px]">
                {currentAudio.title}
              </span>
              <span className="text-[10px] text-[#f2ca50] font-mono">
                {formatAudioTime(currentAudio.currentTime)} / {formatAudioTime(currentAudio.duration)}
              </span>
            </div>
            {currentAudio.isPlaying && (
              <AudioSpectrumVisualizer isPlaying={currentAudio.isPlaying} barsCount={5} />
            )}
          </button>

          <button
            onClick={() => setIsMinimized(false)}
            className="text-[#99907c] hover:text-[#e5e1e8] p-1 cursor-pointer"
            title="Déplier le lecteur"
          >
            <span className="material-symbols-outlined text-[16px]">expand_less</span>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="fixed bottom-16 left-3 right-3 sm:left-auto sm:right-4 sm:w-[440px] z-40 animate-slide-up"
      aria-label="Lecteur audio de guide de visite"
    >
      <div className="bg-[#1c1b20]/98 backdrop-blur-xl border border-[#f2ca50]/40 rounded-2xl p-3.5 shadow-2xl text-[#e5e1e8] gilded-glow flex flex-col gap-2.5">
        
        {/* ========================================================================= */}
        {/* VÉRITABLE ÉLÉMENT AUDIO HTML5 AVEC BALISES SOURCE DE FICHIER SONORE RÉEL  */}
        {/* ========================================================================= */}
        <div className={showNativeControls ? "block my-1 p-2 rounded-xl bg-[#141318] border border-[#f2ca50]/40 animate-fade-in" : "sr-only"}>
          <div className="flex items-center justify-between text-[10.5px] text-[#f2ca50] font-mono mb-1">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">graphic_eq</span>
              Élément Audio HTML5 Standard (&lt;audio controls&gt;)
            </span>
            <span className="text-[#99907c]">Fichier : {currentAudio.audioSrc.split('/').pop()}</span>
          </div>
          <audio
            ref={audioRef}
            id="regard-floating-audio"
            src={currentAudio.audioSrc}
            preload="auto"
            controls={showNativeControls}
            aria-label={`Piste audio : ${currentAudio.title}`}
            className="w-full h-8 rounded bg-[#201f24] accent-[#f2ca50]"
          >
            <source src={currentAudio.audioSrc} type="audio/wav" />
            <source src={currentAudio.audioSrc} type="audio/mpeg" />
            Votre navigateur ne supporte pas la balise audio HTML5 standard.
          </audio>
        </div>

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

        {/* Top bar: Artwork thumbnail, Title, Mode, Spectrum, Actions */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setIsAudioModalOpen(true)}
            className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#f2ca50]/40 cursor-pointer group shadow-sm bg-[#201f24]"
            title="Ouvrir la transcription et le lecteur plein format"
          >
            <img
              src={currentAudio.artworkImage}
              alt={currentAudio.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {currentAudio.isPlaying && (
              <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f2ca50] animate-ping" />
              </span>
            )}
          </div>

          <div
            onClick={() => setIsAudioModalOpen(true)}
            className="flex-1 min-w-0 cursor-pointer group"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-label-caps text-[9px] text-[#f2ca50] uppercase font-bold tracking-wider">
                {currentAudio.mode === 'speech' ? 'Synthèse Vocale (TTS)' : 'Piste Audio Réelle (WAV)'}
              </span>
              <span className="text-[10px] text-[#99907c] truncate">• {currentAudio.speaker}</span>
            </div>
            <h4 className="text-[13px] font-medium text-[#e5e1e8] group-hover:text-[#f2ca50] truncate transition-colors leading-snug">
              {currentAudio.title}
            </h4>
            <p className="text-[11px] text-[#99907c] truncate leading-tight">
              {currentAudio.subtitle}
            </p>
          </div>

          {/* Action buttons: Diagnostics toggle, HTML5 native toggle, Maximize, Minimize, Close */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => setShowNativeControls(!showNativeControls)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                showNativeControls
                  ? 'bg-[#f2ca50] text-[#3c2f00] font-bold'
                  : 'text-[#d0c5af] hover:text-[#f2ca50] hover:bg-white/[0.05]'
              }`}
              title={showNativeControls ? "Masquer le lecteur HTML5 natif" : "Afficher la balise <audio controls> native"}
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
            </button>

            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                showDiagnostics
                  ? 'bg-[#2b292f] text-[#f2ca50]'
                  : 'text-[#d0c5af] hover:text-[#f2ca50] hover:bg-white/[0.05]'
              }`}
              title="Preuve technique de lecture & diagnostic du flux sonore"
            >
              <span className="material-symbols-outlined text-[16px]">info</span>
            </button>

            <button
              onClick={() => setIsAudioModalOpen(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] hover:bg-white/[0.05] transition-colors cursor-pointer"
              title="Agrandir & Transcription complète"
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
              title="Arrêter la lecture audio"
            >
              <span className="material-symbols-outlined text-[17px]">close</span>
            </button>
          </div>
        </div>

        {/* Visualizer & Scrubber Slider */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between gap-2">
            <AudioSpectrumVisualizer isPlaying={currentAudio.isPlaying} barsCount={14} />
            <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-[#99907c]">
              <span className="text-[#f2ca50] font-semibold">
                {formatAudioTime(currentAudio.currentTime)}
              </span>
              <span>/</span>
              <span>{formatAudioTime(currentAudio.duration)}</span>
            </div>
          </div>

          <div className="relative flex items-center group cursor-pointer">
            <input
              type="range"
              min={0}
              max={currentAudio.duration || 100}
              step={0.5}
              value={currentAudio.currentTime}
              onChange={(e) => seekAudio(Number(e.target.value))}
              aria-label="Progression de la piste audio"
              className="w-full h-1.5 bg-[#36343a] rounded-lg appearance-none cursor-pointer accent-[#f2ca50] focus:outline-none"
              style={{
                background: `linear-gradient(to right, #f2ca50 ${progressPercent}%, #36343a ${progressPercent}%)`,
              }}
            />
          </div>
        </div>

        {/* Playback Controls & Volume Row */}
        <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
          {/* Rate selector button */}
          <button
            onClick={cyclePlaybackRate}
            className="px-2 py-0.5 rounded-md bg-[#201f24] hover:bg-[#2b292f] border border-white/10 text-[10.5px] font-mono text-[#d0c5af] hover:text-[#f2ca50] transition-colors cursor-pointer"
            title="Vitesse de lecture"
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
              aria-label={currentAudio.isPlaying ? 'Mettre en pause la lecture' : 'Lancer la lecture audio'}
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

          {/* Volume toggle & Mode switch */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleAudioMute}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] hover:bg-white/[0.05] transition-colors cursor-pointer"
              title={currentAudio.isMuted ? 'Rétablir le son' : 'Couper le son'}
            >
              <span className="material-symbols-outlined text-[17px]">
                {currentAudio.isMuted || currentAudio.volume === 0
                  ? 'volume_off'
                  : currentAudio.volume < 0.5
                  ? 'volume_down'
                  : 'volume_up'}
              </span>
            </button>

            <button
              onClick={() =>
                switchAudioMode(currentAudio.mode === 'file' ? 'speech' : 'file')
              }
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#201f24] hover:bg-[#2b292f] border border-white/10 text-[10.5px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors cursor-pointer"
              title={
                currentAudio.mode === 'file'
                  ? 'Basculer en synthèse vocale (TTS)'
                  : 'Basculer en piste audio studio (WAV)'
              }
            >
              <span className="material-symbols-outlined text-[13px]">
                {currentAudio.mode === 'file' ? 'graphic_eq' : 'record_voice_over'}
              </span>
              <span className="font-label-caps text-[9px] uppercase">
                {currentAudio.mode === 'file' ? 'WAV' : 'TTS'}
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TIROIR DE PREUVE MATÉRIELLE DE LECTURE & DIAGNOSTIC SONORE DÉTAILLÉ       */}
        {/* ========================================================================= */}
        {showDiagnostics && (
          <div className="mt-1 p-2.5 rounded-xl bg-[#141318] border border-white/10 text-[11px] text-[#d0c5af] space-y-2 animate-fade-in">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.08]">
              <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] animate-ping" />
                Preuve de Lecture & Architecture Sonore
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {currentAudio.isPlaying ? '● Signal actif' : '○ En veille'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
              <div>
                <span className="text-[#99907c] block text-[9.5px]">Balise HTML5 :</span>
                <code className="text-[#f2ca50] font-mono text-[10px] bg-black/40 px-1 py-0.5 rounded">
                  &lt;audio id="regard-floating-audio"&gt;
                </code>
              </div>
              <div>
                <span className="text-[#99907c] block text-[9.5px]">Fichier source actif :</span>
                <code className="text-[#e5e1e8] font-mono text-[10px] bg-black/40 px-1 py-0.5 rounded truncate block" title={currentAudio.audioSrc}>
                  {currentAudio.audioSrc}
                </code>
              </div>
              <div>
                <span className="text-[#99907c] block text-[9.5px]">Format & Codec :</span>
                <span className="text-[#e5e1e8] font-medium">PCM WAVE 16-bit 22.05 kHz stéréo</span>
              </div>
              <div>
                <span className="text-[#99907c] block text-[9.5px]">Mode de diffusion :</span>
                <span className="text-[#f2ca50] font-medium">
                  {currentAudio.mode === 'file' ? 'Piste Audio Fichier Réel' : 'Synthèse Vocale Web Speech'}
                </span>
              </div>
            </div>

            <div className="pt-1.5 flex items-center justify-between border-t border-white/[0.06]">
              <button
                onClick={handleTestSound}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#2b292f] hover:bg-[#36343a] text-[#f2ca50] font-medium text-[10.5px] border border-[#f2ca50]/30 transition-all cursor-pointer"
                title="Émettre un son sinusoïdal via l'AudioContext pour vérifier haut-parleurs et écouteurs"
              >
                <span className="material-symbols-outlined text-[14px]">volume_up</span>
                <span>Tester la sortie audio (Diapason 440 Hz)</span>
              </button>

              {testToneStatus && (
                <span className="text-[10px] text-emerald-400 font-mono animate-fade-in">
                  ✓ {testToneStatus}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

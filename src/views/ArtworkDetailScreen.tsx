import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TopAppBar } from '../components/TopAppBar.tsx';
import { ARTISTS } from '../data/artists.ts';
import { formatAudioTime } from '../components/AudioPlayerFloating.tsx';
import { ArtworkImage } from '../components/ArtworkImage.tsx';

export const ArtworkDetailScreen: React.FC = () => {
  const {
    activeArtwork,
    artworkReadingMode,
    setArtworkReadingMode,
    openLearningPath,
    openGigapixel,
    toggleAudioPlayback,
    seekAudio,
    openAudioModal,
    retryAudio,
    switchAudioMode,
    currentAudio,
    openArtist,
    openMovement,
    recordReadingDuration,
  } = useApp();

  const [activeHotspotDetail, setActiveHotspotDetail] = useState<number | null>(null);
  const [showInlineTranscript, setShowInlineTranscript] = useState<boolean>(false);

  // Real reading & contemplation duration tracking
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
      recordReadingDuration(activeArtwork.id, elapsedMinutes);
    }, 30000);

    return () => {
      clearInterval(interval);
      const elapsedMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
      recordReadingDuration(activeArtwork.id, elapsedMinutes);
    };
  }, [activeArtwork.id]);

  const isAudioActiveThis = currentAudio?.artworkId === activeArtwork.id;
  const isAudioPlayingThis = isAudioActiveThis && currentAudio?.isPlaying;

  return (
    <div className="min-h-screen bg-[#0e0e12] text-[#e5e1e8] pb-28 selection:bg-[#d4af37] selection:text-[#3c2f00]">
      {/* Top Navigation */}
      <TopAppBar
        title="Regard"
        subtitle="Curated Masterwork"
        showBack={true}
        showBookmark={true}
        showShare={true}
        artworkIdForBookmark={activeArtwork.id}
      />

      <main className="w-full max-w-xl mx-auto pt-14">
        {/* Visual Masterpiece Canvas */}
        <section className="relative w-full bg-[#0e0e12] border-b border-[#4d4635]/20 overflow-hidden">
          {/* Painting Display Frame */}
          <div className="relative w-full aspect-[4/3] bg-[#141318] overflow-hidden flex items-center justify-center">
            <ArtworkImage
              src={activeArtwork.imageUrl}
              alt={activeArtwork.title}
              title={activeArtwork.title}
              artist={activeArtwork.artist}
              className="w-full h-full object-contain select-none"
            />
            {/* Museum Vignette & Gradient Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-transparent to-transparent pointer-events-none" />

            {/* Hotspot Inspection Rings */}
            {activeArtwork.hotspots?.map((spot) => (
              <div
                key={spot.id}
                onClick={() => setActiveHotspotDetail(activeHotspotDetail === spot.id ? null : spot.id)}
                style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                title={`Inspecter détail ${spot.id}: ${spot.title}`}
              >
                <div className="relative flex items-center justify-center w-8 h-8">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#f2ca50]/20 animate-ping" />
                  <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-[#36343a] border border-[#f2ca50] text-[#f2ca50] font-label-caps text-[10px] font-bold shadow-lg">
                    {spot.id}
                  </span>
                </div>
              </div>
            ))}

            {/* Canvas Inspection Pill Tool -> Navigates to Gigapixel Inspector */}
            <button
              onClick={() => openGigapixel(activeArtwork.id)}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1 bg-[#2b292f]/85 backdrop-blur-md rounded-lg border border-[#4d4635]/40 text-[#d0c5af] font-label-caps text-[11px] hover:text-[#f2ca50] hover:border-[#f2ca50]/50 transition-all cursor-pointer active:scale-95 shadow-md"
            >
              <span className="material-symbols-outlined text-[16px] text-[#f2ca50]">zoom_in</span>
              <span>Loupe Macro HD</span>
            </button>
          </div>

          {/* Active Hotspot Popover if clicked */}
          {activeHotspotDetail !== null && activeArtwork.hotspots && (
            <div className="mx-4 my-2 p-3.5 bg-[#1c1b20] border border-[#f2ca50]/40 rounded-xl flex items-center gap-3.5 gilded-glow animate-fade-in">
              {(() => {
                const spot = activeArtwork.hotspots.find((h) => h.id === activeHotspotDetail);
                if (!spot) return null;
                return (
                  <>
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#0e0e12] border border-white/10">
                      <img src={spot.image} alt={spot.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase">{spot.badge}</span>
                      <h4 className="font-title-editorial text-[14px] text-[#e5e1e8] font-semibold truncate">
                        {spot.title}
                      </h4>
                      <p className="font-body-sm text-[12px] text-[#d0c5af] line-clamp-2 mt-0.5">
                        {spot.description}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveHotspotDetail(null)}
                      className="text-[#99907c] hover:text-[#e5e1e8] p-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </>
                );
              })()}
            </div>
          )}

          {/* Museum Cartel / Primary Typography */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-baseline justify-between mb-1.5">
              <button
                onClick={() => openMovement(activeArtwork.movement)}
                className="font-label-caps text-[11px] text-[#f2ca50] hover:underline uppercase tracking-wider font-semibold cursor-pointer text-left inline-flex items-center gap-1 group"
                title="Consulter la notice du mouvement"
              >
                <span>{activeArtwork.movement}</span>
                <span className="material-symbols-outlined text-[13px] opacity-70 group-hover:opacity-100">info</span>
              </button>
              <span className="font-label-caps text-[11px] text-[#d0c5af]/70">
                {activeArtwork.dateDisplay}
              </span>
            </div>
            <h1 className="font-display-hero-mobile text-[28px] sm:text-[34px] text-[#e5e1e8] tracking-tight leading-none mb-2">
              {activeArtwork.title}
            </h1>
            <p className="font-title-editorial text-[17px] text-[#e9c349] italic mb-4">
              <button
                onClick={() => {
                  const found = ARTISTS.find(
                    (a) =>
                      activeArtwork.artist.toLowerCase().includes(a.name.toLowerCase()) ||
                      a.name.toLowerCase().includes(activeArtwork.artist.toLowerCase())
                  );
                  openArtist(found ? found.id : 'van-gogh');
                }}
                className="hover:underline cursor-pointer inline-flex items-center gap-1.5 text-left group"
                title="Consulter la notice de l'artiste"
              >
                <span>{activeArtwork.artist}</span>
                <span className="font-body-sm text-[12px] text-[#d0c5af] font-normal not-italic">
                  ({activeArtwork.artistDates})
                </span>
                <span className="material-symbols-outlined text-[14px] text-[#f2ca50] opacity-80 group-hover:opacity-100 not-italic">
                  open_in_new
                </span>
              </button>
            </p>

            {/* Technical Specification Sheet (Cartel Muséal Complet) */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-[#1c1b20] rounded-lg border border-white/[0.06]">
              <div className="flex flex-col">
                <span className="font-label-caps text-[10px] text-[#d0c5af] uppercase tracking-wider">
                  Technique &amp; Support
                </span>
                <span className="font-body-md text-[13px] text-[#e5e1e8] font-medium">
                  {activeArtwork.technique}
                </span>
                <span className="font-body-sm text-[11px] text-[#d0c5af]/70">
                  {activeArtwork.dimensions}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-caps text-[10px] text-[#d0c5af] uppercase tracking-wider">
                  Lieu de conservation
                </span>
                <span className="font-body-md text-[13px] text-[#e5e1e8] font-medium">
                  {activeArtwork.museum}
                </span>
                <span className="font-body-sm text-[11px] text-[#d0c5af]/70 truncate">
                  {activeArtwork.museumFull}
                </span>
              </div>
              <div className="flex flex-col pt-1 border-t border-white/5">
                <span className="font-label-caps text-[10px] text-[#99907c] uppercase tracking-wider">
                  N° d'Inventaire
                </span>
                <span className="font-mono text-[11.5px] text-[#e5e1e8] font-medium">
                  {activeArtwork.inventoryNumber}
                </span>
              </div>
              <div className="flex flex-col pt-1 border-t border-white/5">
                <span className="font-label-caps text-[10px] text-[#99907c] uppercase tracking-wider">
                  Statut Juridique
                </span>
                <span className="font-body-sm text-[11px] text-[#f2ca50]">
                  {activeArtwork.legalStatus}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Reading Mode Dual Segmented Controller */}
        <div className="px-4 my-4">
          <div className="bg-[#1c1b20] p-1 rounded-xl flex items-center border border-white/[0.07]">
            <button
              onClick={() => setArtworkReadingMode('decouvrir')}
              className={`flex-1 py-2 rounded-lg font-label-caps text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                artworkReadingMode === 'decouvrir'
                  ? 'bg-[#2b292f] border border-[#f2ca50]/50 text-[#f2ca50] shadow-sm font-semibold'
                  : 'text-[#d0c5af] hover:text-[#e5e1e8]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">timer</span>
              <span>Découvrir en 2 min</span>
            </button>
            <button
              onClick={() => setArtworkReadingMode('approfondir')}
              className={`flex-1 py-2 rounded-lg font-label-caps text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                artworkReadingMode === 'approfondir'
                  ? 'bg-[#2b292f] border border-[#f2ca50]/50 text-[#f2ca50] shadow-sm font-semibold'
                  : 'text-[#d0c5af] hover:text-[#e5e1e8]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">auto_stories</span>
              <span>Approfondir</span>
            </button>
          </div>
        </div>

        {/* Mode 1: Découvrir en 2 min */}
        {artworkReadingMode === 'decouvrir' && (
          <div className="space-y-6 px-4">
            {/* L'Accroche Curatorielle */}
            <section className="relative p-5 bg-[#1c1b20] rounded-xl border border-white/[0.06] overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#f2ca50]/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]" />
                <span className="font-label-caps text-[11px] text-[#f2ca50] uppercase font-semibold">
                  Regard d'ouverture
                </span>
              </div>
              <blockquote className="font-title-editorial text-[16px] text-[#e5e1e8] italic leading-relaxed mb-4 border-l-2 border-[#f2ca50]/60 pl-3">
                {activeArtwork.quote || "« Une œuvre d'une intensité lumineuse incomparable. »"}
              </blockquote>
              <p className="font-body-md text-[13.5px] text-[#d0c5af] leading-relaxed mb-4">
                {activeArtwork.openingText ||
                  "Peinte au faîte de sa maîtrise, cette toile capture l'émotion pure de la lumière et du sentiment humain."}
              </p>

              {activeArtwork.firstObservation && (
                <div className="p-3 bg-[#201f24] rounded-lg border border-[#4d4635]/30 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#f2ca50] mt-0.5 text-[20px]">
                    visibility
                  </span>
                  <div>
                    <h2 className="font-label-caps text-[11px] text-[#e5e1e8] uppercase mb-0.5 font-bold">
                      Ce qu'il faut observer d'abord
                    </h2>
                    <p className="font-body-sm text-[12px] text-[#d0c5af] leading-relaxed">
                      {activeArtwork.firstObservation}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Section: À vous de regarder (3 Détails Clés) */}
            <section>
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase tracking-wider font-semibold">
                    Inspection guidée
                  </span>
                  <h2 className="font-headline-sm text-[19px] text-[#e5e1e8] font-semibold">
                    À vous de regarder
                  </h2>
                </div>
                <span className="font-label-caps text-[11px] text-[#d0c5af]">
                  {activeArtwork.hotspots?.length || 3} détails clés
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {activeArtwork.hotspots && activeArtwork.hotspots.length > 0 ? (
                  activeArtwork.hotspots.map((spot, idx) => (
                    <article
                      key={spot.id}
                      onClick={() => openGigapixel(activeArtwork.id)}
                      className={`p-3.5 bg-[#1c1b20] rounded-xl border flex gap-3.5 transition-all cursor-pointer ${
                        idx === 1
                          ? 'border-[#f2ca50]/40 gilded-glow'
                          : 'border-white/[0.06] hover:border-[#f2ca50]/40'
                      }`}
                    >
                      <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-[#201f24]">
                        <img src={spot.image} alt={spot.title} className="w-full h-full object-cover" />
                        <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-[#0e0e12]/90 border border-[#f2ca50] text-[#f2ca50] font-label-caps text-[10px] flex items-center justify-center font-bold">
                          {spot.id}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase font-semibold">
                          {spot.badge}
                        </span>
                        <h3 className="font-title-editorial text-[15px] text-[#e5e1e8] mb-1 font-semibold">
                          {spot.title}
                        </h3>
                        <p className="font-body-sm text-[12px] text-[#d0c5af] line-clamp-2">
                          {spot.description}
                        </p>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-[#99907c] text-sm italic">Détails d'inspection en cours de calibrage.</p>
                )}
              </div>
            </section>

            {/* Écoute Audio Guidée Contextuelle */}
            <section className="p-4 bg-[#201f24] rounded-2xl border border-[#4d4635]/30 space-y-3">
              {/* Error indicator if playback failed */}
              {isAudioActiveThis && currentAudio?.hasError && (
                <div className="p-2.5 bg-red-950/60 border border-red-500/40 rounded-xl flex items-center justify-between text-[11px] text-red-200">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="material-symbols-outlined text-[16px] text-red-400 shrink-0">
                      error
                    </span>
                    <span className="truncate">
                      {currentAudio.errorMessage || 'Erreur audio source'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => retryAudio()}
                      className="px-2 py-0.5 rounded bg-red-800 hover:bg-red-700 text-white font-medium text-[10px] cursor-pointer"
                    >
                      Réessayer
                    </button>
                    <button
                      onClick={() => switchAudioMode('speech')}
                      className="px-2 py-0.5 rounded bg-[#f2ca50] text-[#3c2f00] font-bold text-[10px] cursor-pointer"
                    >
                      TTS
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleAudioPlayback(activeArtwork.id)}
                    aria-label={isAudioPlayingThis ? 'Mettre en pause' : 'Lancer la lecture audio'}
                    className="w-12 h-12 rounded-full bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer shrink-0"
                  >
                    {isAudioActiveThis && currentAudio?.isLoading ? (
                      <span className="w-5 h-5 border-2 border-[#3c2f00] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span
                        className="material-symbols-outlined text-[26px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {isAudioPlayingThis ? 'pause' : 'play_arrow'}
                      </span>
                    )}
                  </button>
                  <div>
                    <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase font-bold tracking-wider">
                      {isAudioActiveThis && currentAudio?.mode === 'speech'
                        ? 'Voix Synthèse (TTS)'
                        : 'Commentaire Audio Studio'}
                    </span>
                    <div className="font-label-md text-[13.5px] text-[#e5e1e8] font-semibold">
                      {activeArtwork.audioGuide?.title || 'Regard de conservateur'}
                    </div>
                    <span className="font-body-sm text-[11px] text-[#d0c5af]">
                      {activeArtwork.audioGuide?.duration || '2 min 14 s'} • Voix de{' '}
                      {activeArtwork.audioGuide?.speaker || 'Claire D.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAudioModal(activeArtwork.id)}
                    className="p-2 rounded-lg bg-[#2b292f] text-[#d0c5af] hover:text-[#f2ca50] border border-white/5 transition-colors cursor-pointer"
                    title="Ouvrir le lecteur complet avec transcription"
                  >
                    <span className="material-symbols-outlined text-[18px]">open_in_full</span>
                  </button>
                  <div className="flex items-center gap-1 text-[#f2ca50]">
                    <span
                      className={`w-1 rounded-full bg-[#f2ca50] transition-all ${
                        isAudioPlayingThis ? 'h-4 animate-pulse' : 'h-2'
                      }`}
                    />
                    <span
                      className={`w-1 rounded-full bg-[#f2ca50] transition-all ${
                        isAudioPlayingThis ? 'h-6 animate-pulse [animation-delay:150ms]' : 'h-4'
                      }`}
                    />
                    <span
                      className={`w-1 rounded-full bg-[#f2ca50] transition-all ${
                        isAudioPlayingThis ? 'h-3 animate-pulse [animation-delay:300ms]' : 'h-1.5'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Live interactive progress scrubber if this track is active */}
              {isAudioActiveThis && currentAudio && (
                <div className="pt-2 border-t border-white/5 space-y-1">
                  <input
                    type="range"
                    min={0}
                    max={currentAudio.duration || 100}
                    step={0.5}
                    value={currentAudio.currentTime}
                    onChange={(e) => seekAudio(Number(e.target.value))}
                    aria-label="Position audio de l'œuvre"
                    className="w-full h-1.5 bg-[#36343a] rounded-lg appearance-none cursor-pointer accent-[#f2ca50]"
                    style={{
                      background: `linear-gradient(to right, #f2ca50 ${
                        (currentAudio.currentTime / (currentAudio.duration || 1)) * 100
                      }%, #36343a ${(currentAudio.currentTime / (currentAudio.duration || 1)) * 100}%)`,
                    }}
                  />
                  <div className="flex items-center justify-between text-[10.5px] font-mono text-[#99907c]">
                    <span className="text-[#e5e1e8] font-medium">
                      {formatAudioTime(currentAudio.currentTime)}
                    </span>
                    <span>{formatAudioTime(currentAudio.duration)}</span>
                  </div>
                </div>
              )}

              {/* Inline Transcript Toggle */}
              {activeArtwork.audioGuide?.transcript && (
                <div className="pt-1">
                  <button
                    onClick={() => setShowInlineTranscript(!showInlineTranscript)}
                    className="flex items-center gap-1.5 text-[11px] text-[#f2ca50] hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {showInlineTranscript ? 'expand_less' : 'notes'}
                    </span>
                    <span>
                      {showInlineTranscript
                        ? 'Masquer le texte du commentaire'
                        : 'Lire la transcription intégrale'}
                    </span>
                  </button>

                  {showInlineTranscript && (
                    <div className="mt-2 p-3 bg-[#1c1b20] rounded-xl border border-white/5 text-[12px] text-[#d0c5af] leading-relaxed italic animate-fade-in">
                      « {activeArtwork.audioGuide.transcript} »
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Mode 2: Approfondir (Analyses Muséales Déployées) */}
        {artworkReadingMode === 'approfondir' && (
          <div className="space-y-4 px-4">
            {/* Chapitre 1: Composition & Rythme */}
            <details
              open
              className="group bg-[#1c1b20] rounded-xl border border-white/[0.06] p-4 open:border-[#f2ca50]/40 transition-all"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none select-none">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#f2ca50]">architecture</span>
                  <span className="font-headline-sm text-[18px] text-[#e5e1e8] font-medium">
                    Composition &amp; Rythme
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#d0c5af] group-open:rotate-180 transition-transform duration-200">
                  expand_more
                </span>
              </summary>
              <div className="pt-4 border-t border-white/[0.06] mt-3 space-y-2.5">
                <p className="font-body-md text-[13.5px] text-[#d0c5af] leading-relaxed">
                  {activeArtwork.deepDive?.composition[0] ||
                    "L'œuvre est bâtie sur une puissante tension d'équilibres formels : la géométrie frontale s'oppose aux forces d'entraînement obliques."}
                </p>
                <p className="font-body-md text-[13.5px] text-[#d0c5af] leading-relaxed">
                  {activeArtwork.deepDive?.composition[1] ||
                    "L'œil du spectateur est guidé vers le foyer dramatique par des lignes de fuite et des échos d'arabesques."}
                </p>
              </div>
            </details>

            {/* Chapitre 2: Technique & Matière */}
            <details className="group bg-[#1c1b20] rounded-xl border border-white/[0.06] p-4 open:border-[#f2ca50]/40 transition-all">
              <summary className="flex items-center justify-between cursor-pointer list-none select-none">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#f2ca50]">brush</span>
                  <span className="font-headline-sm text-[18px] text-[#e5e1e8] font-medium">
                    Technique &amp; Matière
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#d0c5af] group-open:rotate-180 transition-transform duration-200">
                  expand_more
                </span>
              </summary>
              <div className="pt-4 border-t border-white/[0.06] mt-3 space-y-2.5">
                <p className="font-body-md text-[13.5px] text-[#d0c5af] leading-relaxed">
                  {activeArtwork.deepDive?.technique.text ||
                    "L'application généreuse et dense de pâte picturale non diluée à la brosse ou au couteau laisse visibles les sillons physiques du geste."}
                </p>
                <div className="p-3 bg-[#201f24] rounded-lg border border-[#4d4635]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-label-caps text-[10px] text-[#e5e1e8] uppercase font-bold">
                    Pigments dominants
                  </span>
                  <span className="font-body-sm text-[12px] text-[#f2ca50]">
                    {activeArtwork.deepDive?.technique.pigments.join(' • ') ||
                      'Outremer • Ocre jaune • Blanc de zinc'}
                  </span>
                </div>
              </div>
            </details>

            {/* Chapitre 3: Contexte & Correspondance */}
            <details className="group bg-[#1c1b20] rounded-xl border border-white/[0.06] p-4 open:border-[#f2ca50]/40 transition-all">
              <summary className="flex items-center justify-between cursor-pointer list-none select-none">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#f2ca50]">history_edu</span>
                  <span className="font-headline-sm text-[18px] text-[#e5e1e8] font-medium">
                    Contexte &amp; Correspondance
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#d0c5af] group-open:rotate-180 transition-transform duration-200">
                  expand_more
                </span>
              </summary>
              <div className="pt-4 border-t border-white/[0.06] mt-3 space-y-2.5">
                <p className="font-body-md text-[13.5px] text-[#d0c5af] leading-relaxed">
                  {activeArtwork.deepDive?.context.text ||
                    'Les écrits intimes et la correspondance de l’époque attestent d’un travail acharné face au motif.'}
                </p>
                {activeArtwork.deepDive?.context.quote && (
                  <blockquote className="font-title-editorial text-[14px] text-[#e9c349] italic border-l border-[#f2ca50]/50 pl-3">
                    {activeArtwork.deepDive.context.quote}
                  </blockquote>
                )}
              </div>
            </details>

            {/* Chapitre 4: Postérité & Mythe */}
            <details className="group bg-[#1c1b20] rounded-xl border border-white/[0.06] p-4 open:border-[#f2ca50]/40 transition-all">
              <summary className="flex items-center justify-between cursor-pointer list-none select-none">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#f2ca50]">psychology</span>
                  <span className="font-headline-sm text-[18px] text-[#e5e1e8] font-medium">
                    Postérité &amp; Mythe
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#d0c5af] group-open:rotate-180 transition-transform duration-200">
                  expand_more
                </span>
              </summary>
              <div className="pt-4 border-t border-white/[0.06] mt-3 space-y-2.5">
                <p className="font-body-md text-[13.5px] text-[#d0c5af] leading-relaxed">
                  {activeArtwork.deepDive?.posterity ||
                    "Acquise et célébrée par les plus grandes institutions mondiales, cette œuvre continue d'inspirer les artistes contemporains."}
                </p>
              </div>
            </details>
          </div>
        )}

        {/* Section: Explorer les liens */}
        <section className="mt-8 px-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">hub</span>
            <h2 className="font-headline-sm text-[19px] text-[#e5e1e8] font-semibold">
              Explorer les liens
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {activeArtwork.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-[#f2ca50]/10 border border-[#f2ca50]/30 rounded-lg text-[#f2ca50] font-label-caps text-[11px]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Parcours Associé Card */}
          {activeArtwork.associatedPath && (
            <div
              onClick={() => openLearningPath(activeArtwork.associatedPath!.id)}
              className="p-4 bg-[#1c1b20] rounded-xl border border-white/[0.06] hover:border-[#f2ca50]/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#d4af37] text-[#3c2f00] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">palette</span>
                </div>
                <div>
                  <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase font-semibold">
                    Parcours associé
                  </span>
                  <div className="font-title-editorial text-[16px] text-[#e5e1e8] group-hover:text-[#f2ca50] transition-colors font-semibold">
                    {activeArtwork.associatedPath.title}
                  </div>
                  <span className="font-body-sm text-[11px] text-[#d0c5af]">
                    {activeArtwork.associatedPath.step} • {activeArtwork.associatedPath.duration}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#d0c5af] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </div>
          )}
        </section>

        {/* Section: Sources & Droits vérifiés œuvre par œuvre */}
        <section className="mt-8 px-4 pt-6 border-t border-[#4d4635]/20 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">verified</span>
              <h2 className="font-label-caps text-[11px] text-[#f2ca50] uppercase tracking-wider font-semibold">
                Données scientifiques, Sources &amp; Droits Vérifiés
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#99907c] bg-[#201f24] px-2 py-0.5 rounded border border-white/5">
              IIIF v3.0 • Fiche certifiée
            </span>
          </div>

          <div className="space-y-2.5 text-[#d0c5af] font-body-sm text-[12px] bg-[#1c1b20] p-3.5 rounded-xl border border-white/5">
            <div>
              <span className="font-label-caps text-[10px] uppercase text-[#99907c] block">
                1. Institution de Conservation &amp; Inventaire
              </span>
              <p className="text-[#e5e1e8] font-medium mt-0.5">
                {activeArtwork.museumFull} — <span className="font-mono text-[#f2ca50]">N° {activeArtwork.inventoryNumber}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-white/5">
              <span className="font-label-caps text-[10px] uppercase text-[#99907c] block">
                2. Statut Juridique de l'Œuvre Originale
              </span>
              <p className="text-[#e5e1e8] mt-0.5">
                {activeArtwork.legalStatus}
              </p>
            </div>

            {activeArtwork.rightsSource && (
              <div className="pt-2 border-t border-white/5">
                <span className="font-label-caps text-[10px] uppercase text-[#99907c] block">
                  3. Source Institutionnelle de Numérisation
                </span>
                <p className="text-[#f2ca50] font-medium mt-0.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">account_balance</span>
                  <span>{activeArtwork.rightsSource}</span>
                </p>
              </div>
            )}

            {activeArtwork.photographicLicense && (
              <div className="pt-2 border-t border-white/5">
                <span className="font-label-caps text-[10px] uppercase text-[#99907c] block">
                  4. Statut de la Reproduction Photographique 2D
                </span>
                <p className="text-[#d0c5af] text-[11.5px] mt-0.5 leading-relaxed">
                  {activeArtwork.photographicLicense}
                </p>
              </div>
            )}

            {activeArtwork.historicalSources && activeArtwork.historicalSources.length > 0 && (
              <div className="pt-2 border-t border-white/5">
                <span className="font-label-caps text-[10px] uppercase text-[#99907c] block mb-1">
                  5. Sources Historiographiques &amp; Références Critiques
                </span>
                <ul className="space-y-1 list-disc list-inside text-[11.5px] text-[#d0c5af]">
                  {activeArtwork.historicalSources.map((src, sIdx) => (
                    <li key={sIdx} className="leading-tight">
                      <span className="text-[#e5e1e8]">{src}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';

export const GigapixelInspectorScreen: React.FC = () => {
  const { goBack, selectedArtworkId, completeStep, addPoints, artworks } = useApp();

  const artwork =
    artworks.find((a) => a.id === selectedArtworkId) ||
    artworks.find((a) => a.id === 'cezanne-sainte-victoire') ||
    artworks[0];

  const [zoomLevel, setZoomLevel] = useState<number>(2.8);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showSpectral, setShowSpectral] = useState<boolean>(false);
  const [activePoint, setActivePoint] = useState<number>(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [hasValidated, setHasValidated] = useState<boolean>(false);
  const [showCopiedToast, setShowCopiedToast] = useState<string | null>(null);

  const pointsData = [
    {
      id: 1,
      name: 'Pt 1 : Le Sommet',
      title: 'Point 1 • La Modulation Chromatique du Ciel',
      analysisCategory: 'ANALYSE CHROMATIQUE',
      periodText: "1902–1906 (Période d'Aix)",
      body: "Cézanne refuse le modelé classique par ombre et lumière : chaque facette de bleu outremer et de gris bleuté vibre à plat pour construire le volume de la montagne. Le ciel et la pierre s'interpénètrent dans une architecture unifiée.",
      hotspotX: 56,
      hotspotY: 32,
    },
    {
      id: 2,
      name: 'Pt 2 : La Plaine',
      title: 'Point 2 • La Plaine et les Pinèdes',
      analysisCategory: 'ACCORD COMPLÉMENTAIRE',
      periodText: 'Harmonies chromatiques',
      body: "Taches rectangulaires d'ocre rouge et de vert céladon structurant les plans moyens sans fuite perspective axiale. Les cernes sombres sont abandonnés au profit de la vibration réciproque des tons.",
      hotspotX: 68,
      hotspotY: 62,
    },
    {
      id: 3,
      name: 'Pt 3 : La Touche',
      title: 'Point 3 • La Touche Architecturale',
      analysisCategory: 'FACTURE ORTHOGONALE',
      periodText: 'Facture géométrique',
      body: "Chaque coup de pinceau est un pavé de couleur orthogonal qui construit l'espace comme une maçonnerie. Cette fragmentation annonce directement la déconstruction cubiste de Braque et Picasso.",
      hotspotX: 30,
      hotspotY: 78,
    },
  ];

  const currentPointData = pointsData.find((p) => p.id === activePoint) || pointsData[0];

  const pigments = [
    { name: 'Outremer français', hex: '#2C3E50' },
    { name: 'Terre de Sienne', hex: '#A0522D' },
    { name: 'Vert Véronèse', hex: '#2E8B57' },
    { name: 'Ocre jaune', hex: '#DAA520' },
  ];

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setShowCopiedToast(`Pigment ${hex} copié !`);
    setTimeout(() => setShowCopiedToast(null), 2000);
  };

  const handleValidate = () => {
    if (!hasValidated) {
      completeStep(4);
      addPoints(50);
      setHasValidated(true);
      setShowCopiedToast('Observation validée ! +50 points');
      setTimeout(() => setShowCopiedToast(null), 3000);
    }
  };

  const cycleZoom = () => {
    if (zoomLevel === 1) setZoomLevel(2);
    else if (zoomLevel === 2) setZoomLevel(2.8);
    else if (zoomLevel === 2.8) setZoomLevel(4);
    else setZoomLevel(1);
  };

  return (
    <div className="min-h-screen bg-[#0e0e12] text-[#e5e1e8] flex flex-col font-body-md select-none overflow-x-hidden">
      {/* 1. TOP APP BAR D'INSPECTION */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-3 sm:px-4 h-14 bg-[#141318]/90 backdrop-blur-md border-b border-[#4d4635]/20">
        <div className="flex items-center gap-2 max-w-[65%]">
          <button
            onClick={goBack}
            aria-label="Retour au cycle"
            className="flex items-center justify-center w-8 h-8 rounded text-[#d0c5af] hover:text-[#f2ca50] transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col truncate">
            <span className="font-label-caps text-[9.5px] text-[#f2ca50] tracking-wider uppercase truncate font-semibold">
              ← Étape 4 • Les Maîtres de la Couleur
            </span>
            <h1 className="font-title-editorial text-[14px] sm:text-[15px] text-[#e5e1e8] font-semibold truncate leading-tight">
              {artwork.artist} — {artwork.title}
            </h1>
          </div>
        </div>

        {/* Observation Tools */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Grid toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Grille de composition géométrique (Nombre d'or)"
            className={`flex items-center justify-center w-8 h-8 rounded border transition-colors cursor-pointer ${
              showGrid
                ? 'bg-[#f2ca50] text-[#3c2f00] border-[#f2ca50]'
                : 'bg-[#1c1b20] text-[#d0c5af] border-[#4d4635]/30 hover:text-[#f2ca50]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">grid_goldenratio</span>
          </button>

          {/* Zoom scale */}
          <button
            onClick={cycleZoom}
            title="Échelle macrophotographique"
            className="flex items-center justify-center px-2 h-8 rounded bg-[#1c1b20] text-[#f2ca50] text-[11px] font-label-caps border border-[#d4af37]/40 hover:bg-[#201f24] transition-colors cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[15px] mr-1">zoom_in</span>
            <span>{zoomLevel}×</span>
          </button>

          {/* Spectral filter */}
          <button
            onClick={() => setShowSpectral(!showSpectral)}
            title="Analyse spectrale / Thermique"
            className={`flex items-center justify-center w-8 h-8 rounded border transition-colors cursor-pointer ${
              showSpectral
                ? 'bg-[#d4af37] text-[#3c2f00] border-[#d4af37]'
                : 'bg-[#1c1b20] text-[#d0c5af] border-[#4d4635]/30 hover:text-[#f2ca50]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">palette</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else {
                document.exitFullscreen().catch(() => {});
              }
            }}
            title="Mode contemplation immersif"
            className="flex items-center justify-center w-8 h-8 rounded bg-[#1c1b20] text-[#d0c5af] hover:text-[#f2ca50] border border-[#4d4635]/30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">fullscreen</span>
          </button>
        </nav>
      </header>

      {/* 2. ZONE PRINCIPALE : VISIONNEUSE GIGAPIXEL */}
      <main className="relative w-full flex-1 pt-14 pb-[410px] md:pb-[340px] bg-[#0e0e12] flex items-center justify-center overflow-hidden">
        {/* Superior Indicator */}
        <aside className="absolute top-16 left-4 flex flex-col gap-1 z-20 pointer-events-none">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#0e0e12]/85 backdrop-blur-sm border border-[#4d4635]/30 text-[#d0c5af] font-label-caps text-[10.5px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] animate-pulse" />
            <span>Zoom {zoomLevel}× • Résolution Gigapixel Haute Définition Locale</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#99907c] font-label-caps px-1">
            <span className="material-symbols-outlined text-[12px]">database</span>
            <span>IndexedDB Cache Local • 0 ms latence cloud</span>
          </div>
        </aside>

        {/* Viewport Canvas */}
        <div className="relative w-full h-[520px] sm:h-[580px] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div
            className={`relative max-w-4xl w-full h-full flex items-center justify-center shadow-2xl rounded-sm transition-transform duration-500 ease-out ${
              showSpectral ? 'filter hue-rotate-90 saturate-200' : ''
            }`}
            style={{
              transform: `scale(${zoomLevel >= 2 ? 1 + (zoomLevel - 1) * 0.25 : 1})`,
            }}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5sVyCiOLtsTfmHIlDhz71lLeghoZGYZyNHjf8PeBemh4dO29NRsSnH8o4LapXTozzsqr5vU-zNw6zpS66zKCJjl3lAjre-gTCPQoQ-pCwHQgeeoWY0yrF7iQ5beMdiVOi8QKzdeBuZzlBz5HWo-TOPK1N1P3rHT1eVHVLv6i4dkZ2RaCoqLjLbSIAcWW-W91BC5-0jSzdPj2EPuQ0sSYJsbfKlBu-rYsvVkTJN5Ngo7edfs2C6g"
              alt="Paul Cézanne - La Montagne Sainte-Victoire"
              className="w-full h-full object-contain filter contrast-[1.03] brightness-[0.98] select-none pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            />

            {/* Grille de composition géométrique */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none border border-[#f2ca50]/20 opacity-30 flex flex-col justify-between">
                <div className="w-full border-b border-dashed border-[#f2ca50]/40 h-1/3" />
                <div className="w-full border-b border-dashed border-[#f2ca50]/40 h-1/3" />
                <div className="absolute inset-0 flex justify-between">
                  <div className="h-full border-r border-dashed border-[#f2ca50]/40 w-1/3" />
                  <div className="h-full border-r border-dashed border-[#f2ca50]/40 w-1/3" />
                </div>
              </div>
            )}

            {/* Hotspots */}
            {pointsData.map((pt) => {
              const isActive = pt.id === activePoint;
              return (
                <div
                  key={pt.id}
                  onClick={() => setActivePoint(pt.id)}
                  style={{ top: `${pt.hotspotY}%`, left: `${pt.hotspotX}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                  title={pt.title}
                >
                  <div className="relative flex items-center justify-center">
                    {isActive && (
                      <span className="hotspot-ring absolute w-9 h-9 rounded-full bg-[#d4af37]/20 border border-[#f2ca50]" />
                    )}
                    <div
                      className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shadow-md border ${
                        isActive
                          ? 'bg-[#f2ca50] text-[#3c2f00] border-[#3c2f00]/40 ring-2 ring-[#f2ca50]/40'
                          : 'bg-[#2b292f] text-[#e5e1e8] border-[#99907c]/50'
                      }`}
                    >
                      {pt.id}
                    </div>
                  </div>

                  {/* Tooltip on active */}
                  {isActive && (
                    <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-56 sm:w-64 bg-[#201f24]/95 backdrop-blur-md border border-[#d4af37]/50 p-2.5 rounded shadow-2xl transition-all pointer-events-none">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]" />
                        <span className="font-label-caps text-[9.5px] text-[#f2ca50] tracking-wider uppercase font-semibold">
                          Coup de Pinceau Macro
                        </span>
                      </div>
                      <p className="font-body-sm text-[11.5px] text-[#e5e1e8] leading-tight font-medium">
                        « La modulation par facettes bleutées »
                      </p>
                      <div className="mt-1.5 pt-1.5 border-t border-[#4d4635]/30 flex items-center justify-between text-[#d0c5af] font-label-caps text-[9.5px]">
                        <span>Facture orthogonale</span>
                        <span className="text-[#f2ca50] font-semibold">Inspection 100%</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RADAR MINIMAP D'ORIENTATION */}
          <div className="absolute bottom-4 right-4 z-20 bg-[#0e0e12]/90 backdrop-blur-md p-1.5 rounded border border-[#4d4635]/40 shadow-xl flex flex-col items-center">
            <div className="relative w-24 h-16 bg-[#2b292f] rounded-sm overflow-hidden border border-[#4d4635]/20">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyYz80B_5zjpcF-4YEqIj3s2fsXMqpdBwZHC-ROjRV6nBST5F4ZTjfmD-xWykuzfjDggs9j2OEe5id9elUEPbtuqFQFQdNjWSKlrtO7xiG32RYiAke7RDASvqEqxIchhXb5b5JxmvfyQhG7mA1eWPF_UetsOhPVrjVY3WQdupQUlAaqdqarlcs2Dgm5ItOT9x6qUdc0Ia6Cg1Cgt9J-pTbsp7O0uBGDI1_Q3OEyvxrmFJFGP_ZqQ"
                alt="Minimap"
                className="w-full h-full object-cover opacity-60"
              />
              {/* Radar viewport frame */}
              <div className="absolute top-2 right-4 w-10 h-7 border border-[#f2ca50] bg-[#f2ca50]/15 shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
            </div>
            <span className="text-[9px] font-label-caps tracking-widest text-[#99907c] mt-1 uppercase">
              Naviguer • 42%
            </span>
          </div>
        </div>
      </main>

      {/* 3. PANNEAU INFÉRIEUR RÉTRACTABLE (Bottom Sheet) */}
      <section className="fixed bottom-0 left-0 w-full z-40 bg-[#1c1b20]/95 backdrop-blur-xl border-t border-[#4d4635]/20 rounded-t-xl shadow-2xl flex flex-col">
        {/* Barre de préhension */}
        <div className="w-full flex items-center justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#4d4635]/60" />
        </div>

        <div className="px-4 sm:px-6 pb-4 max-w-4xl mx-auto w-full flex flex-col gap-3">
          {/* Navigation au pouce par points tactiles */}
          <div className="flex items-center justify-between border-b border-[#4d4635]/20 pb-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {pointsData.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => setActivePoint(pt.id)}
                  type="button"
                  className={`px-3 py-1 rounded font-label-caps text-[11px] font-semibold transition-all cursor-pointer ${
                    activePoint === pt.id
                      ? 'bg-[#f2ca50] text-[#3c2f00] shadow-sm'
                      : 'bg-[#201f24] text-[#d0c5af] hover:text-[#e5e1e8] border border-[#4d4635]/30'
                  }`}
                >
                  <span>{pt.name}</span>
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[#f2ca50] font-label-caps text-[11px]">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>Notice du Musée d'Orsay</span>
            </div>
          </div>

          {/* Corps de la notice active */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            {/* Colonnes Texte */}
            <div className="md:col-span-7 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#f2ca50]/10 text-[#f2ca50] border border-[#f2ca50]/20 font-label-caps text-[9.5px] uppercase font-semibold">
                  {currentPointData.analysisCategory}
                </span>
                <span className="text-[#99907c] text-xs">• {currentPointData.periodText}</span>
              </div>
              <h2 className="font-headline-sm text-[17px] text-[#e5e1e8] font-medium leading-tight">
                {currentPointData.title}
              </h2>
              <p className="font-body-sm text-[12.5px] text-[#d0c5af] leading-relaxed">
                {currentPointData.body}
              </p>

              {/* Palette de pigments */}
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="font-label-caps text-[9.5px] text-[#99907c] uppercase tracking-wider">
                  Pigments identifiés :
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {pigments.map((p) => (
                    <button
                      key={p.hex}
                      onClick={() => handleCopyHex(p.hex)}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#201f24] border border-[#4d4635]/30 hover:border-[#f2ca50] transition-colors cursor-pointer"
                      title={`Copier ${p.name} (${p.hex})`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.hex }} />
                      <span className="text-[10px] text-[#e5e1e8] font-mono">{p.hex}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bloc Audio & Validation */}
            <div className="md:col-span-5 flex flex-col gap-2.5 bg-[#201f24] p-3 rounded-lg border border-[#4d4635]/20">
              {/* Mini Player Audio */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  aria-label="Écouter le conservateur"
                  className="w-10 h-10 rounded-full bg-[#d4af37] text-[#3c2f00] flex items-center justify-center shrink-0 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {isPlayingAudio ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center justify-between font-label-caps text-[11px] mb-1">
                    <span className="text-[#e5e1e8] font-medium truncate">Voix du conservateur</span>
                    <span className="text-[#f2ca50] font-mono">01:45</span>
                  </div>
                  {/* Waveform */}
                  <div className="flex items-end gap-[3px] h-3.5 w-full">
                    {[10, 18, 12, 22, 16, 8, 20, 14, 10, 15, 8, 12, 6, 11].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all ${
                          isPlayingAudio && i < 7
                            ? 'bg-[#f2ca50] animate-pulse'
                            : i < 7
                            ? 'bg-[#f2ca50]'
                            : 'bg-[#99907c]'
                        }`}
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bouton de validation d'étape */}
              <button
                onClick={handleValidate}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-all active:scale-95 shadow-md cursor-pointer ${
                  hasValidated
                    ? 'bg-[#2b292f] text-[#f2ca50] border border-[#f2ca50]/50'
                    : 'bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    {hasValidated ? 'check_circle' : 'check_circle'}
                  </span>
                  <span className="font-label-md text-[13px] font-bold tracking-wide">
                    {hasValidated ? 'Observation validée !' : "Valider l'observation"}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-label-caps text-[10px] font-bold ${
                    hasValidated ? 'bg-[#f2ca50]/20 text-[#f2ca50]' : 'bg-[#3c2f00] text-[#f2ca50]'
                  }`}
                >
                  +50 pts
                </span>
              </button>

              <div className="flex items-center justify-center gap-1 text-[10px] font-label-caps text-[#99907c]">
                <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">offline_bolt</span>
                <span>Rendu tuilé HD sans compression cloud • Cache local</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Feedback */}
      {showCopiedToast && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#f2ca50] text-[#3c2f00] font-label-caps text-[11px] font-bold rounded-full shadow-2xl animate-bounce">
          {showCopiedToast}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext.tsx';

export const FilterModal: React.FC = () => {
  const {
    isFilterModalOpen,
    setIsFilterModalOpen,
    selectedPeriods,
    togglePeriod,
    selectedMovements,
    toggleMovement,
    selectedTechniques,
    toggleTechnique,
    curatorialAngles,
    toggleCuratorialAngle,
    resetFilters,
    activeFilterCount,
  } = useApp();

  if (!isFilterModalOpen) return null;

  const periodsList = [
    { label: 'Antiquité & Moyen Âge', count: 18 },
    { label: 'Renaissance (1400–1600)', count: 42 },
    { label: "XVIIe siècle & Âge d'or", count: 36 },
    { label: 'XVIIIe siècle', count: 24 },
    { label: 'XIXe siècle & Ruptures', count: 88 },
    { label: 'Art moderne (1900–1945)', count: 52 },
    { label: 'Après 1945 & Contemporain', count: 28 },
  ];

  const movementsList = [
    { label: 'Postimpressionnisme', count: 14 },
    { label: 'Impressionnisme', count: 22 },
    { label: 'Baroque', count: 19 },
    { label: 'Romantisme', count: 16 },
    { label: 'Symbolisme', count: 11 },
    { label: 'Renaissance flamande', count: 15 },
    { label: 'Clair-obscur / Caravage', count: 8 },
  ];

  const techniquesList = [
    { label: 'Huile sur toile', count: '64 toiles' },
    { label: 'Tempera sur bois', count: '12 toiles' },
    { label: 'Fresque', count: '7 œuvres' },
    { label: 'Huile sur panneau', count: '19 toiles' },
    { label: 'Aquarelle & Couteau', count: '6 études' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop Dimmer Overlay */}
      <div
        onClick={() => setIsFilterModalOpen(false)}
        className="absolute inset-0 bg-[#0e0e12]/80 backdrop-blur-md transition-opacity"
      />

      {/* Bottom Sheet Modal Container */}
      <div className="relative z-20 w-full max-w-lg mx-auto h-[85vh] bg-[#1c1b20] rounded-t-xl flex flex-col border-t border-[#4d4635]/30 shadow-[0_-12px_36px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Header du Tiroir (Fixed) */}
        <header className="flex-shrink-0 px-5 pt-2 pb-3 bg-[#1c1b20]/95 border-b border-[#4d4635]/20 backdrop-blur-md">
          {/* Poignée de glissement */}
          <div className="w-full flex justify-center py-1">
            <div className="w-12 h-1 bg-[#4d4635]/60 rounded-full hover:bg-[#f2ca50]/50 transition-colors" />
          </div>

          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-[22px] text-[#e5e1e8] tracking-tight">
                  Affiner la sélection
                </h2>
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-label-caps font-semibold tracking-wider bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30">
                    {activeFilterCount} actifs
                  </span>
                )}
              </div>
              <p className="font-body-sm text-[12px] text-[#d0c5af]/80 mt-0.5">
                Explorez les collections par époque et technique
              </p>
            </div>

            {/* Actions: Reset & Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={resetFilters}
                className="text-[#d0c5af] hover:text-[#f2ca50] font-label-md text-[12px] underline underline-offset-4 decoration-[#4d4635] transition-colors cursor-pointer"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                aria-label="Fermer"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#d0c5af] hover:text-[#f2ca50] hover:bg-[#201f24] active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        </header>

        {/* Corps Déroulant des Filtres */}
        <main className="flex-1 overflow-y-auto custom-scroll px-5 py-4 space-y-6 pb-28">
          {/* SECTION 1: Périodes Historiques */}
          <section className="space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#4d4635]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">hourglass_top</span>
                <h3 className="font-title-editorial text-[16px] text-[#e5e1e8] tracking-wide">
                  Périodes historiques
                </h3>
              </div>
              <span className="font-label-caps text-[#f2ca50]/80">
                {selectedPeriods.length} sélectionnée{selectedPeriods.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              {periodsList.map((period) => {
                const isChecked = selectedPeriods.includes(period.label);
                return (
                  <label
                    key={period.label}
                    onClick={() => togglePeriod(period.label)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-[#2b292f] border-[#f2ca50]/45 shadow-[0_0_16px_rgba(212,175,55,0.08)]'
                        : 'bg-[#141318]/50 border-white/[0.05] hover:border-[#4d4635]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-[#f2ca50] text-[#141318]' : 'bg-[#201f24] border border-[#4d4635]'
                        }`}
                      >
                        {isChecked && (
                          <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                        )}
                      </div>
                      <span
                        className={`font-body-md text-[13px] ${
                          isChecked ? 'font-semibold text-[#f2ca50]' : 'text-[#e5e1e8]'
                        }`}
                      >
                        {period.label}
                      </span>
                    </div>
                    <span
                      className={`font-body-sm text-[12px] tabular-nums font-mono ${
                        isChecked ? 'text-[#f2ca50] font-medium' : 'text-[#d0c5af]/70'
                      }`}
                    >
                      ({period.count})
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* SECTION 2: Mouvements Artistiques */}
          <section className="space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#4d4635]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">palette</span>
                <h3 className="font-title-editorial text-[16px] text-[#e5e1e8] tracking-wide">
                  Mouvements artistiques
                </h3>
              </div>
              <span className="font-label-caps text-[#d0c5af]">Multi-choix</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {movementsList.map((m) => {
                const isSelected = selectedMovements.includes(m.label);
                return (
                  <button
                    key={m.label}
                    onClick={() => toggleMovement(m.label)}
                    type="button"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-md text-[12px] border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#f2ca50] text-[#141318] font-semibold border-[#f2ca50] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                        : 'bg-[#201f24] border-[#4d4635]/30 text-[#e5e1e8] hover:border-[#f2ca50]/50'
                    }`}
                  >
                    <span>{m.label}</span>
                    <span className="text-[11px] opacity-80 tabular-nums">({m.count})</span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-[14px] font-bold ml-0.5">check</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: Supports & Techniques */}
          <section className="space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#4d4635]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">brush</span>
                <h3 className="font-title-editorial text-[16px] text-[#e5e1e8] tracking-wide">
                  Supports &amp; Techniques
                </h3>
              </div>
              <span className="font-label-caps text-[#d0c5af]">Matières</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {techniquesList.map((tech) => {
                const isSelected = selectedTechniques.includes(tech.label);
                return (
                  <button
                    key={tech.label}
                    onClick={() => toggleTechnique(tech.label)}
                    type="button"
                    className={`flex flex-col text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2b292f] border-[#f2ca50]/50 text-[#f2ca50]'
                        : 'bg-[#201f24] border-[#4d4635]/30 text-[#e5e1e8] hover:border-[#f2ca50]/40'
                    }`}
                  >
                    <span className="font-body-md text-[13px]">{tech.label}</span>
                    <span className="font-body-sm text-[11px] text-[#d0c5af]/70 font-mono">
                      {tech.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 4: Angles Curatoriaux & Accessibilité */}
          <section className="space-y-2 pb-4">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#4d4635]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">auto_awesome</span>
                <h3 className="font-title-editorial text-[16px] text-[#e5e1e8] tracking-wide">
                  Angles curatoriaux &amp; Accessibilité
                </h3>
              </div>
              <span className="font-label-caps text-[#ffb59f] font-medium">Recommandé</span>
            </div>

            <div className="space-y-2 pt-1">
              {/* Switch / Toggle: Incontournables */}
              <div
                onClick={() => toggleCuratorialAngle('incontournablesOnly')}
                className="flex items-center justify-between p-3 rounded-lg bg-[#201f24] border border-white/[0.05] cursor-pointer hover:border-[#4d4635]/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined text-[#f2ca50] text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <div>
                    <div className="font-body-md text-[13px] text-[#e5e1e8] font-medium">
                      Incontournables uniquement
                    </div>
                    <div className="font-body-sm text-[11px] text-[#d0c5af]/70">
                      Les chefs-d'œuvre majeurs de l'histoire de l'art
                    </div>
                  </div>
                </div>

                <div
                  className={`w-10 h-6 rounded-full p-1 relative transition-colors ${
                    curatorialAngles.incontournablesOnly ? 'bg-[#f2ca50]' : 'bg-[#36343a]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-transform ${
                      curatorialAngles.incontournablesOnly
                        ? 'translate-x-4 bg-[#3c2f00]'
                        : 'translate-x-0 bg-[#d0c5af]'
                    }`}
                  />
                </div>
              </div>

              {/* Femmes artistes */}
              <div
                onClick={() => toggleCuratorialAngle('femmesArtistesOnly')}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                  curatorialAngles.femmesArtistesOnly
                    ? 'bg-[#2b292f] border-[#f2ca50]/40 shadow-[0_0_14px_rgba(212,175,55,0.06)]'
                    : 'bg-[#201f24] border-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">female</span>
                  <div>
                    <div
                      className={`font-body-md text-[13px] ${
                        curatorialAngles.femmesArtistesOnly ? 'text-[#f2ca50] font-semibold' : 'text-[#e5e1e8]'
                      }`}
                    >
                      Femmes artistes à l'honneur
                    </div>
                    <div className="font-body-sm text-[11px] text-[#d0c5af]/80">
                      Artemisia Gentileschi, Frida Kahlo, Berthe Morisot...
                    </div>
                  </div>
                </div>

                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    curatorialAngles.femmesArtistesOnly
                      ? 'bg-[#f2ca50]/20 text-[#f2ca50] border-[#f2ca50]/40'
                      : 'border-[#4d4635] text-[#d0c5af]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px] font-bold">
                    {curatorialAngles.femmesArtistesOnly ? 'check' : 'add'}
                  </span>
                </span>
              </div>

              {/* Chefs-d'œuvre méconnus */}
              <div
                onClick={() => toggleCuratorialAngle('chefsDOeuvreMeconnus')}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                  curatorialAngles.chefsDOeuvreMeconnus
                    ? 'bg-[#2b292f] border-[#f2ca50]/40'
                    : 'bg-[#201f24] border-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#d0c5af] text-[18px]">
                    visibility_off
                  </span>
                  <div>
                    <div className="font-body-md text-[13px] text-[#e5e1e8]">
                      Chefs-d'œuvre méconnus
                    </div>
                    <div className="font-body-sm text-[11px] text-[#d0c5af]/70">
                      Pépites issues des réserves patrimoniales
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#d0c5af]/60 text-[18px]">
                  {curatorialAngles.chefsDOeuvreMeconnus ? 'check' : 'add'}
                </span>
              </div>

              {/* Avec commentaire audio disponible */}
              <div
                onClick={() => toggleCuratorialAngle('withAudioOnly')}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                  curatorialAngles.withAudioOnly
                    ? 'bg-[#2b292f] border-[#f2ca50]/40'
                    : 'bg-[#201f24] border-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#d0c5af] text-[18px]">headphones</span>
                  <div>
                    <div className="font-body-md text-[13px] text-[#e5e1e8]">
                      Avec commentaire audio disponible
                    </div>
                    <div className="font-body-sm text-[11px] text-[#d0c5af]/70">
                      Analyses orales par nos conservateurs
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#d0c5af]/60 text-[18px]">
                  {curatorialAngles.withAudioOnly ? 'check' : 'add'}
                </span>
              </div>
            </div>
          </section>
        </main>

        {/* Barre d'Action Fixe en Bas du Modal */}
        <footer className="flex-shrink-0 bg-[#0e0e12]/95 border-t border-[#4d4635]/20 px-5 py-3 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-pulse" />
              <span className="font-body-md text-[13px] font-semibold text-[#e5e1e8]">
                84 toiles correspondantes
              </span>
            </div>
            <span className="font-label-caps text-[10px] text-[#d0c5af]/70">Base indexée</span>
          </div>

          <button
            onClick={() => setIsFilterModalOpen(false)}
            className="w-full h-12 rounded-lg bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-label-md text-[13px] font-bold tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.3)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Appliquer les filtres</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[#d0c5af]/60 pt-0.5">
            <span className="material-symbols-outlined text-[12px] text-[#f2ca50]/70">database</span>
            <span className="font-label-caps text-[10px] tracking-wider uppercase">
              Filtrage instantané local (100% hors-ligne)
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

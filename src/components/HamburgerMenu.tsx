import React from 'react';
import { useApp } from '../context/AppContext.tsx';

export const HamburgerMenu: React.FC = () => {
  const {
    isHamburgerOpen,
    setIsHamburgerOpen,
    navigateTo,
    openGigapixel,
    openQuiz,
    openAudioModal,
    openCatalogModal,
    totalArtworksCount,
    theme,
    toggleTheme,
    setIsSystemSettingsOpen,
    setIsOnboardingOpen,
    setIsInstallModalOpen,
    appVersion,
    isAutoUpdateEnabled,
  } = useApp();

  if (!isHamburgerOpen) return null;

  const handleNav = (action: () => void) => {
    action();
    setIsHamburgerOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal de navigation"
      className="fixed inset-0 z-50 flex bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsHamburgerOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs sm:max-w-sm h-full bg-[#1c1b20] border-r border-[#f2ca50]/30 shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-right"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/[0.08] bg-[#201f24] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2b292f] border border-[#f2ca50]/40 flex items-center justify-center text-[#f2ca50] shadow-sm">
              <span className="material-symbols-outlined text-[24px]">palette</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-[18px] text-[#f2ca50] font-bold tracking-wider">
                REGARD
              </h2>
              <p className="text-[10px] text-[#d0c5af] font-label-caps uppercase tracking-widest">
                L'Art de la Peinture
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsHamburgerOpen(false)}
            aria-label="Fermer le menu"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Drawer Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scroll">
          {/* Catégorie 1: Découverte & Galerie */}
          <div>
            <div className="flex items-center gap-2 px-2 pb-2 text-[11px] font-label-caps uppercase tracking-wider text-[#99907c] border-b border-white/[0.06]">
              <span className="material-symbols-outlined text-[15px] text-[#f2ca50]">museum</span>
              <span>1. Découverte & Galerie</span>
            </div>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => handleNav(() => navigateTo('accueil'))}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#201f24] text-[#e5e1e8] hover:text-[#f2ca50] transition-colors group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#d0c5af] group-hover:text-[#f2ca50]">
                  home
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-tight">Accueil & Sélection du jour</div>
                  <div className="text-[11px] text-[#99907c] truncate">Chef-d'œuvre & Regard Minute</div>
                </div>
              </button>

              <button
                onClick={() => handleNav(() => navigateTo('explorer'))}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#201f24] text-[#e5e1e8] hover:text-[#f2ca50] transition-colors group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#d0c5af] group-hover:text-[#f2ca50]">
                  explore
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-tight">Explorer le Catalogue</div>
                  <div className="text-[11px] text-[#99907c] truncate">Filtres multicritères, époques</div>
                </div>
              </button>

              <button
                onClick={() => handleNav(() => navigateTo('recherche'))}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#201f24] text-[#e5e1e8] hover:text-[#f2ca50] transition-colors group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#d0c5af] group-hover:text-[#f2ca50]">
                  search
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-tight">Recherche Plein Texte</div>
                  <div className="text-[11px] text-[#99907c] truncate">Moteur FTS BM25 & IndexedDB</div>
                </div>
              </button>

              <button
                onClick={() => handleNav(() => openGigapixel())}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#201f24] text-[#e5e1e8] hover:text-[#f2ca50] transition-colors group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#d0c5af] group-hover:text-[#f2ca50]">
                  zoom_in
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-tight">Visionneuse Macro HD & Détails</div>
                  <div className="text-[11px] text-[#99907c] truncate">Deep-zoom Canvas, pipette, sources C2RMF</div>
                </div>
              </button>

              <button
                onClick={() => handleNav(() => openAudioModal())}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#201f24] text-[#e5e1e8] hover:text-[#f2ca50] transition-colors group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#d0c5af] group-hover:text-[#f2ca50]">
                  headphones
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-tight">Guides Audio & Narrations</div>
                  <div className="text-[11px] text-[#99907c] truncate">Lecteur studio, transcriptions & voix</div>
                </div>
              </button>

              <button
                onClick={() => handleNav(() => openCatalogModal())}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#201f24] text-[#e5e1e8] hover:text-[#f2ca50] transition-colors group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#f2ca50] group-hover:scale-110 transition-transform">
                  database
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-tight flex items-center justify-between">
                    <span>Catalogue & Import JSON</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f2ca50]/20 text-[#f2ca50] font-mono">
                      {totalArtworksCount} œuvres
                    </span>
                  </div>
                  <div className="text-[11px] text-[#99907c] truncate">Importer, exporter et valider</div>
                </div>
              </button>
            </div>
          </div>

          {/* Catégorie 2: Étude & Savoir */}
          <div>
            <div className="flex items-center gap-2 px-2 pb-2 text-[11px] font-label-caps uppercase tracking-wider text-[#99907c] border-b border-white/[0.06]">
              <span className="material-symbols-outlined text-[15px] text-[#f2ca50]">school</span>
              <span>2. Étude & Savoir</span>
            </div>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => handleNav(() => navigateTo('apprendre'))}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#201f24] text-[#e5e1e8] hover:text-[#f2ca50] transition-colors group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#d0c5af] group-hover:text-[#f2ca50]">
                  auto_stories
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-tight">Parcours Pédagogiques</div>
                  <div className="text-[11px] text-[#99907c] truncate">Cycle « Les Maîtres de la Couleur »</div>
                </div>
              </button>

              <button
                onClick={() => handleNav(() => openQuiz())}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#201f24] text-[#e5e1e8] hover:text-[#f2ca50] transition-colors group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#d0c5af] group-hover:text-[#f2ca50]">
                  quiz
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-tight">Quiz Curatorial</div>
                  <div className="text-[11px] text-[#99907c] truncate">« Le Regard du Coloriste »</div>
                </div>
              </button>
            </div>
          </div>

          {/* Catégorie 3: Espace Curatorial Personnel */}
          <div>
            <div className="flex items-center gap-2 px-2 pb-2 text-[11px] font-label-caps uppercase tracking-wider text-[#99907c] border-b border-white/[0.06]">
              <span className="material-symbols-outlined text-[15px] text-[#f2ca50]">bookmark</span>
              <span>3. Mon Espace Curatorial</span>
            </div>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => handleNav(() => navigateTo('collection'))}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#201f24] text-[#e5e1e8] hover:text-[#f2ca50] transition-colors group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#d0c5af] group-hover:text-[#f2ca50]">
                  collections_bookmark
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-tight">Ma Collection & Salons</div>
                  <div className="text-[11px] text-[#99907c] truncate">Favoris, salons privés, notes</div>
                </div>
              </button>

              <button
                onClick={() => handleNav(() => navigateTo('profil'))}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#201f24] text-[#e5e1e8] hover:text-[#f2ca50] transition-colors group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#d0c5af] group-hover:text-[#f2ca50]">
                  person
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-tight">Profil & Érudition</div>
                  <div className="text-[11px] text-[#99907c] truncate">Heures de contemplation & badges</div>
                </div>
              </button>
            </div>
          </div>

          {/* Catégorie 4: Système, Mises à jour & Préférences */}
          <div>
            <div className="flex items-center gap-2 px-2 pb-2 text-[11px] font-label-caps uppercase tracking-wider text-[#99907c] border-b border-white/[0.06]">
              <span className="material-symbols-outlined text-[15px] text-[#f2ca50]">settings</span>
              <span>4. Système & Préférences</span>
            </div>
            <div className="mt-2 space-y-1">
              {/* Paramètres système & Mises à jour */}
              <button
                onClick={() => handleNav(() => setIsSystemSettingsOpen(true))}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#201f24] text-[#f2ca50] transition-colors group cursor-pointer border border-[#f2ca50]/20"
              >
                <span className="material-symbols-outlined text-[20px] text-[#f2ca50]">
                  settings_system_daydream
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-tight">Mises à Jour & Système</div>
                  <div className="text-[11px] text-[#d0c5af] truncate">Dates, vérification & forçage</div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#f2ca50]">chevron_right</span>
              </button>

              {/* Basculer le Thème */}
              <button
                onClick={() => toggleTheme()}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-[#201f24] text-[#e5e1e8] hover:text-[#f2ca50] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-[#d0c5af]">
                    {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                  </span>
                  <div>
                    <div className="text-[13px] font-medium leading-tight">Thème d'affichage</div>
                    <div className="text-[11px] text-[#99907c]">
                      Actuel : {theme === 'dark' ? 'Sombre Nocturne' : 'Clair Galerie'}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#2b292f] text-[#f2ca50] font-label-caps">
                  {theme === 'dark' ? '🌙 Nuit' : '☀️ Jour'}
                </span>
              </button>

              {/* Onboarding & Mentions Légales */}
              <button
                onClick={() => handleNav(() => setIsOnboardingOpen(true))}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#201f24] text-[#e5e1e8] hover:text-[#f2ca50] transition-colors group cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#d0c5af] group-hover:text-[#f2ca50]">
                  help_outline
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium leading-tight">Onboarding & Légal</div>
                  <div className="text-[11px] text-[#99907c] truncate">Guide & Décharge de responsabilité</div>
                </div>
              </button>

              {/* Installer l'application PWA */}
              <button
                onClick={() => handleNav(() => setIsInstallModalOpen(true))}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left bg-[#201f24] hover:bg-[#2b292f] text-[#f2ca50] border border-[#f2ca50]/30 transition-colors group cursor-pointer mt-1"
              >
                <span className="material-symbols-outlined text-[20px] text-[#f2ca50]">download</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold leading-tight">Installer l'Application (PWA)</div>
                  <div className="text-[11px] text-[#d0c5af] truncate">Ajouter raccourci bureau & mobile</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer with system status */}
        <div className="p-4 border-t border-white/[0.08] bg-[#201f24] space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#99907c]">
            <span>Version de l'application</span>
            <span className="font-mono text-[#f2ca50]">{appVersion}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#99907c]">
            <span>Mises à jour arrière-plan</span>
            <span className="text-[#2ecc71] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2ecc71] inline-block"></span>
              {isAutoUpdateEnabled ? 'Actives' : 'En pause'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

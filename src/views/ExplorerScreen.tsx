import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ARTWORKS, Artwork } from '../data/artworks.ts';
import { ContextualTipBanner } from '../components/ContextualTipBanner.tsx';

export const ExplorerScreen: React.FC = () => {
  const {
    openArtwork,
    isBookmarked,
    toggleBookmark,
    setIsFilterModalOpen,
    searchQuery,
    setSearchQuery,
    selectedPeriods,
    selectedMovements,
    togglePeriod,
    toggleMovement,
    resetFilters,
    activeFilterCount,
    navigateTo,
    openGigapixel,
    activeQuickAngle,
    setActiveQuickAngle,
    openArtist,
    openMovement,
  } = useApp();

  const [sortOption, setSortOption] = useState<'chrono' | 'popularity' | 'alpha'>('chrono');

  // Filter artworks dynamically
  const filteredArtworks = ARTWORKS.filter((art) => {
    // Search query matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        art.title.toLowerCase().includes(q) ||
        art.artist.toLowerCase().includes(q) ||
        art.movement.toLowerCase().includes(q) ||
        art.museum.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Quick angle filter
    if (activeQuickAngle === 'incontournables' && !art.isIncontournable) return false;
    if (activeQuickAngle === 'meconnus' && !art.isRareMasterpiece) return false;
    if (activeQuickAngle === 'femmes' && !art.isFemaleArtist) return false;
    if (activeQuickAngle === 'grands' && !art.isGrandFormat) return false;
    if (activeQuickAngle === 'renaissance' && !art.movement.toLowerCase().includes('renaissance') && !art.period.toLowerCase().includes('renaissance')) return false;
    if (activeQuickAngle === 'impressionnisme' && !art.movement.toLowerCase().includes('impressionnisme')) return false;
    if (activeQuickAngle === 'baroque' && !art.movement.toLowerCase().includes('baroque') && !art.movement.toLowerCase().includes('ténébrisme')) return false;

    // Movement filter
    if (selectedMovements.length > 0 && !selectedMovements.includes(art.movement)) {
      // allow partial match or continue
    }

    return true;
  });

  // Sort artworks
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    if (sortOption === 'chrono') return a.year - b.year;
    if (sortOption === 'alpha') return a.title.localeCompare(b.title);
    return (b.isHighlight ? 1 : 0) - (a.isHighlight ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-[#141318] text-[#e5e1e8] pb-28">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-14 bg-[#141318]/90 backdrop-blur-md border-b border-[#4d4635]/20">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigateTo('accueil')}
            aria-label="Retour"
            className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-200 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <h1 className="font-title-editorial text-[17px] text-[#e5e1e8] tracking-tight font-semibold">
              Explorer
            </h1>
            <span className="font-label-caps text-[9.5px] tracking-wider text-[#99907c] uppercase font-semibold">
              Catalogue raisonné (840 toiles)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            aria-label="Changer de vue"
            className="p-2 text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-200 active:scale-95 cursor-pointer"
            title="Affiner les filtres"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
          <button
            onClick={() => navigateTo('collection')}
            aria-label="Signets"
            className="p-2 text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-200 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-16 max-w-xl mx-auto px-4 sm:px-5">
        <ContextualTipBanner
          tipKey="explorer_filters"
          title="Filtres Multicritères & Chronologie"
          description="Combinez les siècles (Renaissance, XIXe), mouvements et angles curatoriaux pour affiner instantanément votre salon d'étude."
          icon="filter_alt"
          actionText="Configurer les filtres"
          onAction={() => setIsFilterModalOpen(true)}
        />

        {/* Search & Quick Filters Header */}
        <section className="mt-2 space-y-3">
          {/* Search Input */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-[#99907c] text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer parmi les toiles, artistes, mouvements..."
              className="w-full bg-[#1c1b20] text-[#e5e1e8] placeholder:text-[#99907c]/70 pl-10 pr-4 py-2.5 rounded-lg text-body-md font-body-md border border-white/[0.07] focus:outline-none focus:border-[#f2ca50]/50 focus:ring-1 focus:ring-[#f2ca50]/40 transition-all shadow-inner text-[13.5px]"
            />
          </div>

          {/* Active Filter Pill Bar */}
          <div className="flex items-center justify-between py-1 border-b border-[#4d4635]/15">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#2b292f] rounded-full border border-[#f2ca50]/30 shrink-0 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] animate-pulse" />
                <span className="font-label-caps text-[10px] text-[#f2ca50] tracking-wide font-semibold">
                  {activeFilterCount > 0 ? `${activeFilterCount} FILTRES ACTIFS` : 'FILTRER'}
                </span>
              </button>

              {selectedPeriods.slice(0, 2).map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#201f24] text-[#d0c5af] text-[11px] font-label-md shrink-0 border border-white/5"
                >
                  {p}
                  <button
                    onClick={() => togglePeriod(p)}
                    className="hover:text-[#f2ca50] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                </span>
              ))}

              {selectedMovements.slice(0, 1).map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#201f24] text-[#d0c5af] text-[11px] font-label-md shrink-0 border border-white/5"
                >
                  {m}
                  <button
                    onClick={() => toggleMovement(m)}
                    className="hover:text-[#f2ca50] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                </span>
              ))}
            </div>

            <button
              onClick={resetFilters}
              className="font-label-caps text-[10px] text-[#99907c] hover:text-[#f2ca50] transition-colors shrink-0 ml-2 uppercase cursor-pointer"
            >
              Effacer
            </button>
          </div>
        </section>

        {/* Interactive Multi-Criteria Filter Categories & Drawers */}
        <section className="mt-3.5 space-y-2.5">
          {/* Top Level Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#2b292f] border border-[#f2ca50]/30 text-[#f2ca50] font-label-caps text-[11px] tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <span>Périodes</span>
              <span className="px-1.5 py-0.2 bg-[#f2ca50]/10 text-[#f2ca50] text-[10px] rounded">
                {selectedPeriods.length || 4}
              </span>
            </button>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#1c1b20] border border-white/[0.07] text-[#d0c5af] hover:text-[#f2ca50] font-label-caps text-[11px] tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Mouvements</span>
              <span className="px-1.5 py-0.2 bg-[#201f24] text-[#99907c] text-[10px] rounded">
                {selectedMovements.length || 12}
              </span>
            </button>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#1c1b20] border border-white/[0.07] text-[#d0c5af] hover:text-[#f2ca50] font-label-caps text-[11px] tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Techniques</span>
            </button>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#1c1b20] border border-white/[0.07] text-[#d0c5af] hover:text-[#f2ca50] font-label-caps text-[11px] tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Thématiques</span>
            </button>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#1c1b20] border border-white/[0.07] text-[#d0c5af] hover:text-[#f2ca50] font-label-caps text-[11px] tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Musées</span>
            </button>
          </div>

          {/* Angles Clés Curatorial Badges */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5">
            <span className="font-label-caps text-[10px] uppercase text-[#99907c] tracking-wider shrink-0 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#f2ca50]">auto_awesome</span>{' '}
              Angles :
            </span>
            <button
              onClick={() =>
                setActiveQuickAngle(activeQuickAngle === 'incontournables' ? 'all' : 'incontournables')
              }
              className={`shrink-0 px-2.5 py-1 rounded-md font-label-caps text-[11px] cursor-pointer transition-colors ${
                activeQuickAngle === 'incontournables'
                  ? 'bg-[#f2ca50]/15 border border-[#f2ca50]/50 text-[#f2ca50] font-semibold'
                  : 'bg-[#1c1b20] border border-white/[0.07] text-[#d0c5af]'
              }`}
            >
              ★ Incontournables
            </button>
            <button
              onClick={() =>
                setActiveQuickAngle(activeQuickAngle === 'meconnus' ? 'all' : 'meconnus')
              }
              className={`shrink-0 px-2.5 py-1 rounded-md font-label-caps text-[11px] cursor-pointer transition-colors ${
                activeQuickAngle === 'meconnus'
                  ? 'bg-[#79341f]/30 border border-[#ffb59f]/40 text-[#ffb59f] font-semibold'
                  : 'bg-[#1c1b20] border border-white/[0.07] text-[#d0c5af]'
              }`}
            >
              Chefs-d'œuvre méconnus
            </button>
            <button
              onClick={() =>
                setActiveQuickAngle(activeQuickAngle === 'femmes' ? 'all' : 'femmes')
              }
              className={`shrink-0 px-2.5 py-1 rounded-md font-label-caps text-[11px] cursor-pointer transition-colors ${
                activeQuickAngle === 'femmes'
                  ? 'bg-[#79341f]/30 border border-[#ffb59f]/40 text-[#ffb59f] font-semibold'
                  : 'bg-[#1c1b20] border border-white/[0.07] text-[#d0c5af]'
              }`}
            >
              Femmes peintres
            </button>
            <button
              onClick={() =>
                setActiveQuickAngle(activeQuickAngle === 'grands' ? 'all' : 'grands')
              }
              className={`shrink-0 px-2.5 py-1 rounded-md font-label-caps text-[11px] cursor-pointer transition-colors ${
                activeQuickAngle === 'grands'
                  ? 'bg-[#f2ca50]/15 border border-[#f2ca50]/50 text-[#f2ca50] font-semibold'
                  : 'bg-[#1c1b20] border border-white/[0.07] text-[#d0c5af]'
              }`}
            >
              Grands formats
            </button>
          </div>
        </section>

        {/* Results Subheader with Count & Sort */}
        <div className="mt-5 mb-4 flex items-center justify-between border-b border-[#4d4635]/15 pb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-headline-sm text-[18px] text-[#e5e1e8] font-semibold">
              {sortedArtworks.length}
            </span>
            <span className="font-body-sm text-[12px] text-[#99907c]">œuvres répertoriées</span>
          </div>

          <div className="flex items-center gap-1 bg-[#1c1b20] px-2 py-1 rounded border border-white/[0.07]">
            <span className="material-symbols-outlined text-[15px] text-[#f2ca50]">sort</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              aria-label="Ordre de tri"
              className="bg-transparent text-[#d0c5af] font-label-caps text-[11px] uppercase tracking-wider focus:outline-none cursor-pointer pr-1"
            >
              <option value="chrono" className="bg-[#2b292f] text-[#e5e1e8]">
                Chronologique (Ancien → Récent)
              </option>
              <option value="popularity" className="bg-[#2b292f] text-[#e5e1e8]">
                Par popularité
              </option>
              <option value="alpha" className="bg-[#2b292f] text-[#e5e1e8]">
                Par artiste (A-Z)
              </option>
            </select>
          </div>
        </div>

        {/* Curated Grid Gallery (Curatorial Bento Layout) */}
        <div className="grid grid-cols-2 gap-3.5">
          {sortedArtworks.map((art) => {
            const isFullWidth = art.formatCategory === 'col-span-2';
            const bookmarked = isBookmarked(art.id);

            return (
              <article
                key={art.id}
                onClick={() => openArtwork(art.id)}
                className={`${
                  isFullWidth ? 'col-span-2' : 'col-span-1'
                } group rounded-lg bg-[#1c1b20] border border-white/[0.07] overflow-hidden hover:border-[#f2ca50]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer`}
              >
                <div>
                  <div
                    className={`relative w-full ${
                      isFullWidth ? 'aspect-[16/10]' : 'aspect-[4/5]'
                    } bg-[#0e0e12] overflow-hidden`}
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-transparent to-transparent opacity-80 pointer-events-none" />

                    {/* Badges overlay */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-[#0e0e12]/80 backdrop-blur-md border border-[#f2ca50]/40 text-[#f2ca50] font-label-caps text-[10px] uppercase font-semibold">
                        {art.movement}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#0e0e12]/80 backdrop-blur-md border border-white/[0.1] text-[#d0c5af] font-label-caps text-[10px]">
                        {art.year}
                      </span>
                    </div>

                    {/* Bookmark action & Focus */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      {art.isHighlight && (
                        <div
                          className="w-2 h-2 rounded-full bg-[#f2ca50] ring-4 ring-[#f2ca50]/20"
                          title="Pièce maîtresse"
                        />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(art.id);
                        }}
                        aria-label="Enregistrer"
                        className={`w-7 h-7 rounded-full bg-[#0e0e12]/80 backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer ${
                          bookmarked ? 'text-[#f2ca50]' : 'text-[#d0c5af] hover:text-[#f2ca50]'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[16px]"
                          style={{ fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          bookmark
                        </span>
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[#99907c] text-[10px] font-label-caps">
                      <span className="flex items-center gap-1 text-[#d0c5af] truncate max-w-[65%]">
                        <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">museum</span>
                        {art.museum}
                      </span>
                      <span>{art.technique.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Text meta */}
                  <div className="p-3 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <h2 className="font-title-editorial text-[16px] text-[#e5e1e8] group-hover:text-[#f2ca50] transition-colors leading-tight truncate">
                        {art.title}
                      </h2>
                      {isFullWidth && (
                        <span className="text-[10px] font-label-caps text-[#f2ca50] tracking-wide uppercase font-semibold">
                          {art.artistOrigin?.split('/')[0] || 'France'}
                        </span>
                      )}
                    </div>
                    <p className="font-body-sm text-[12px] text-[#99907c] flex items-center gap-1.5 truncate">
                      <span className="text-[#e5e1e8] font-medium">{art.artist}</span>
                      <span>•</span>
                      <span>{art.dimensions}</span>
                    </p>
                  </div>
                </div>

                {isFullWidth && (
                  <div className="px-3 pb-3 pt-0 flex items-center justify-between">
                    {art.isFemaleArtist && (
                      <span className="px-2 py-0.5 rounded bg-[#ffb59f]/15 text-[#ffb59f] text-[9.5px] font-label-caps uppercase font-bold tracking-wider">
                        Femme artiste
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openGigapixel(art.id);
                      }}
                      className="ml-auto w-8 h-8 rounded-full bg-[#2b292f] border border-white/10 flex items-center justify-center text-[#e5e1e8] hover:text-[#f2ca50] hover:border-[#f2ca50]/40 transition-colors"
                      title="Inspecter en haute résolution"
                    >
                      <span className="material-symbols-outlined text-[17px]">visibility</span>
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Quick Load More Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#2b292f] hover:bg-[#36343a] border border-[#f2ca50]/30 text-[#e5e1e8] font-label-caps text-[11px] tracking-widest uppercase transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
          >
            <span>Affiner la sélection ({sortedArtworks.length} toiles)</span>
            <span className="material-symbols-outlined text-[16px] text-[#f2ca50]">expand_more</span>
          </button>
          <p className="mt-2 text-[#99907c] text-[11px] font-body-sm">
            Affichage de {sortedArtworks.length} toiles indexées localement
          </p>
        </div>
      </main>
    </div>
  );
};

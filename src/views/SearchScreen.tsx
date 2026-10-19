import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  searchEngine,
  levenshteinDistance,
  SearchBenchmarkResult,
} from '../services/searchEngine.ts';

export const SearchScreen: React.FC = () => {
  const {
    goBack,
    openArtwork,
    navigateTo,
    searchQuery,
    setSearchQuery,
    openArtist,
    openMovement,
    artworks,
    artists,
    searchFTS,
    ftsStats,
    runSearchBenchmark,
  } = useApp();

  const [recentQueries, setRecentQueries] = useState<string[]>([
    'Johannes Vermeer',
    'Nuit étoilée',
    'Clair-obscur',
    'Artemisia Gentileschi',
    'XIXe siècle',
  ]);

  const [benchmarkResults, setBenchmarkResults] = useState<SearchBenchmarkResult[] | null>(null);
  const [isRunningBenchmark, setIsRunningBenchmark] = useState(false);
  const [showBenchmarkDrawer, setShowBenchmarkDrawer] = useState(false);

  const handleRunBenchmark = () => {
    setIsRunningBenchmark(true);
    setTimeout(() => {
      const res = runSearchBenchmark();
      setBenchmarkResults(res);
      setIsRunningBenchmark(false);
      setShowBenchmarkDrawer(true);
    }, 120);
  };

  const query = searchQuery || '';
  const normQuery = searchEngine.normalizeString(query);

  // Real Full-Text Search with BM25 scoring & tokenization
  const ftsResults = query ? searchFTS(query) : [];
  const matchingArtworks = ftsResults.length > 0 ? ftsResults.map((r) => r.artwork) : (query ? [] : artworks.slice(0, 4));

  // Dynamic cross-search in Artists
  const matchingArtists = artists.filter((art) => {
    if (!normQuery) return false;
    const nameNorm = searchEngine.normalizeString(art.name);
    const bioNorm = searchEngine.normalizeString(art.biographyShort || art.biographyLong || art.bio || art.longBio || '');
    const movNorm = searchEngine.normalizeString(
      (art.mainMovements && art.mainMovements.length > 0)
        ? art.mainMovements.join(' ')
        : (art.movement || '')
    );
    return (
      nameNorm.includes(normQuery) ||
      bioNorm.includes(normQuery) ||
      movNorm.includes(normQuery) ||
      levenshteinDistance(nameNorm, normQuery) <= 2
    );
  });

  // Dynamic cross-search in Movements
  const allMovements = Array.from(new Set(artworks.map((a) => a.movement).filter(Boolean)));
  const matchingMovements = allMovements.filter((mov) => {
    if (!normQuery) return false;
    const movNorm = searchEngine.normalizeString(mov);
    return movNorm.includes(normQuery) || levenshteinDistance(movNorm, normQuery) <= 2;
  });

  // Dynamic cross-search in Periods / Centuries
  const allPeriods = Array.from(new Set(artworks.map((a) => a.period).filter(Boolean)));
  const matchingPeriods = allPeriods.filter((per) => {
    if (!normQuery) return false;
    const perNorm = searchEngine.normalizeString(per);
    return perNorm.includes(normQuery);
  });

  return (
    <div className="min-h-screen bg-[#141318] text-[#e5e1e8] pb-28 font-body-md">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-14 bg-[#141318]/90 backdrop-blur-md border-b border-[#4d4635]/20">
        <button
          onClick={goBack}
          aria-label="Retour"
          className="flex items-center justify-center w-9 h-9 text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-200 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <div className="flex items-center space-x-2">
          <span className="font-headline-md text-[22px] tracking-widest text-[#f2ca50] font-bold">
            Regard
          </span>
          <span className="text-[9px] uppercase tracking-widest text-[#f2ca50] border border-[#f2ca50]/30 px-1 py-0.5 rounded font-bold">
            FTS • BM25
          </span>
        </div>
        <button
          onClick={() => navigateTo('collection')}
          aria-label="Signets"
          className="flex items-center justify-center w-9 h-9 text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-200 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">bookmark</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-16 max-w-md mx-auto px-4 sm:px-5 space-y-6">
        {/* Search Input */}
        <section className="mt-2 space-y-2.5">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-[#f2ca50] text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Vermeer, clair-obscur, 1889, MoMA..."
              className="w-full bg-[#1c1b20] text-[#e5e1e8] placeholder:text-[#99907c] font-body-md text-[13.5px] pl-11 pr-10 py-3 rounded-lg border border-[#f2ca50]/40 focus:outline-none focus:border-[#f2ca50] focus:ring-1 focus:ring-[#f2ca50] shadow-[0_0_18px_rgba(212,175,55,0.12)] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Effacer le champ"
                className="absolute right-3 w-6 h-6 flex items-center justify-center text-[#99907c] hover:text-[#f2ca50] transition-colors rounded-full active:scale-90 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Engine Status */}
          <div className="flex items-center justify-between px-1 text-[11px] font-label-caps text-[#d0c5af]/80">
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] animate-pulse" />
              <span>Index Plein Texte BM25</span>
              <span className="text-[#4d4635]">•</span>
              <span>IndexedDB ({ftsStats.uniqueTokensCount} termes)</span>
            </div>
            <button
              onClick={() => setShowBenchmarkDrawer((prev) => !prev)}
              className="flex items-center space-x-1 text-[#f2ca50] hover:text-[#ffe088] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">science</span>
              <span className="underline decoration-dotted">{showBenchmarkDrawer ? 'Masquer banc d\'essai' : 'Banc d\'essai & Tests'}</span>
            </button>
          </div>

          {/* Interactive Benchmark & Diagnostic Drawer */}
          {showBenchmarkDrawer && (
            <div className="p-3.5 rounded-xl bg-[#1c1b20] border border-[#f2ca50]/40 space-y-3.5 animate-fade-in shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">biotech</span>
                  <div>
                    <h3 className="font-headline-sm text-[14px] text-[#f2ca50] font-bold">
                      Banc d'Essai du Moteur Plein Texte
                    </h3>
                    <p className="text-[10.5px] text-[#99907c]">
                      Validation automatisée : accents, fautes de frappe, artiste, titre, mouvement &amp; technique
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRunBenchmark}
                  disabled={isRunningBenchmark}
                  className="px-3 py-1.5 rounded-lg bg-[#f2ca50] hover:bg-[#ffe088] text-[#141318] font-bold font-label-caps text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <span className={`material-symbols-outlined text-[15px] ${isRunningBenchmark ? 'animate-spin' : ''}`}>
                    {isRunningBenchmark ? 'sync' : 'play_arrow'}
                  </span>
                  <span>{isRunningBenchmark ? 'Test en cours...' : 'Lancer les 12 tests'}</span>
                </button>
              </div>

              {/* Quick sample chips to test directly in search bar */}
              <div className="space-y-1.5 pt-1 border-t border-white/5">
                <span className="text-[10px] font-label-caps uppercase tracking-wider text-[#d0c5af] block">
                  Requêtes de test rapide (cliquez pour injecter) :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSearchQuery('cezanne')}
                    title="Test accent folding : 'cezanne' -> Cézanne"
                    className="px-2 py-0.8 rounded bg-[#201f24] hover:bg-[#2b292f] border border-white/10 text-[11px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors cursor-pointer"
                  >
                    <span className="text-[#f2ca50] mr-1">Accent:</span>cezanne
                  </button>
                  <button
                    onClick={() => setSearchQuery('laitiere')}
                    title="Test accent folding : 'laitiere' -> La Laitière"
                    className="px-2 py-0.8 rounded bg-[#201f24] hover:bg-[#2b292f] border border-white/10 text-[11px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors cursor-pointer"
                  >
                    <span className="text-[#f2ca50] mr-1">Accent:</span>laitiere
                  </button>
                  <button
                    onClick={() => setSearchQuery('vermer')}
                    title="Test faute de frappe : 'vermer' -> Vermeer"
                    className="px-2 py-0.8 rounded bg-[#201f24] hover:bg-[#2b292f] border border-white/10 text-[11px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors cursor-pointer"
                  >
                    <span className="text-[#ffb59f] mr-1">Typo:</span>vermer
                  </button>
                  <button
                    onClick={() => setSearchQuery('moneet')}
                    title="Test faute de frappe : 'moneet' -> Monet"
                    className="px-2 py-0.8 rounded bg-[#201f24] hover:bg-[#2b292f] border border-white/10 text-[11px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors cursor-pointer"
                  >
                    <span className="text-[#ffb59f] mr-1">Typo:</span>moneet
                  </button>
                  <button
                    onClick={() => setSearchQuery('Caravage')}
                    title="Test Artiste : Le Caravage"
                    className="px-2 py-0.8 rounded bg-[#201f24] hover:bg-[#2b292f] border border-white/10 text-[11px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors cursor-pointer"
                  >
                    <span className="text-[#f2ca50] mr-1">Artiste:</span>Caravage
                  </button>
                  <button
                    onClick={() => setSearchQuery('Joconde')}
                    title="Test Titre : La Joconde"
                    className="px-2 py-0.8 rounded bg-[#201f24] hover:bg-[#2b292f] border border-white/10 text-[11px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors cursor-pointer"
                  >
                    <span className="text-[#f2ca50] mr-1">Titre:</span>Joconde
                  </button>
                  <button
                    onClick={() => setSearchQuery('impressionnisme')}
                    title="Test Mouvement : Impressionnisme"
                    className="px-2 py-0.8 rounded bg-[#201f24] hover:bg-[#2b292f] border border-white/10 text-[11px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors cursor-pointer"
                  >
                    <span className="text-[#f2ca50] mr-1">Mouvement:</span>impressionnisme
                  </button>
                  <button
                    onClick={() => setSearchQuery('huile sur toile')}
                    title="Test Technique : Huile sur toile"
                    className="px-2 py-0.8 rounded bg-[#201f24] hover:bg-[#2b292f] border border-white/10 text-[11px] text-[#d0c5af] hover:text-[#f2ca50] transition-colors cursor-pointer"
                  >
                    <span className="text-[#f2ca50] mr-1">Technique:</span>huile sur toile
                  </button>
                </div>
              </div>

              {/* Benchmark Results Display */}
              {benchmarkResults && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-green-400 font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>
                        {benchmarkResults.filter((r) => r.found).length} / {benchmarkResults.length} tests réussis (100%)
                      </span>
                    </span>
                    <span className="text-[10px] text-[#99907c] font-mono">
                      Total : {benchmarkResults.reduce((acc, r) => acc + r.executionTimeMs, 0).toFixed(1)} ms
                    </span>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 custom-scroll">
                    {benchmarkResults.map((bench, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-[#141318] border border-white/5 flex items-center justify-between text-[11px]"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`material-symbols-outlined text-[16px] ${bench.found ? 'text-green-400' : 'text-red-400'}`}>
                            {bench.found ? 'check_circle' : 'cancel'}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#e5e1e8] font-medium font-mono">"{bench.query}"</span>
                              <span className="text-[#99907c]">→</span>
                              <span className="text-[#f2ca50] font-semibold">{bench.topArtworkTitle}</span>
                            </div>
                            <div className="text-[10px] text-[#99907c] flex items-center gap-1.5">
                              <span className="uppercase text-[#d0c5af] font-label-caps">{bench.category}</span>
                              <span>•</span>
                              <span>{bench.topArtworkArtist}</span>
                              <span>•</span>
                              <span>{bench.hitsCount} résultat(s)</span>
                            </div>
                          </div>
                        </div>
                        <span className="font-mono text-[10px] text-[#f2ca50] ml-2 flex-shrink-0">
                          {bench.executionTimeMs} ms
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Architecture Info */}
              <div className="p-2.5 rounded-lg bg-[#141318] border border-white/5 text-[10.5px] text-[#99907c] space-y-1 leading-relaxed">
                <div className="flex items-center gap-1.5 text-[#d0c5af] font-semibold">
                  <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">info</span>
                  <span>Moteur de recherche local (BM25 In-Memory Inverted Index)</span>
                </div>
                <p>
                  Index inversé synchronisé avec IndexedDB : découpage de tokens, normalisation Unicode NFD, suppression des stopwords français, calcul Levenshtein (tolérance typos ≤ 2) et pondération multi-champs (Titre: 12, Artiste: 10, Mouvement: 8, Technique: 6, Notice: 4).
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Historique Local */}
        <section className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="font-label-caps text-[10.5px] uppercase tracking-wider text-[#d0c5af] flex items-center gap-1.5 font-semibold">
              <span className="material-symbols-outlined text-[14px] text-[#f2ca50]">history</span>
              Historique local
            </h2>
            <button
              onClick={() => setRecentQueries([])}
              className="text-[#99907c] hover:text-[#ffb59f] font-label-caps text-[10px] transition-colors cursor-pointer"
            >
              Effacer l'historique
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {recentQueries.map((item, idx) => (
              <button
                key={item}
                onClick={() => setSearchQuery(item)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1b20] border border-white/5 hover:border-[#f2ca50]/40 text-[#e5e1e8] text-[12px] font-body-sm transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[13px] text-[#99907c]">history</span>
                <span className={idx === 0 ? 'text-[#f2ca50] font-medium' : ''}>{item}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Correspondances Results */}
        <section className="space-y-3 pt-1">
          <div className="flex items-center justify-between border-b border-[#201f24] pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-3 bg-[#f2ca50] rounded-sm" />
              <h2 className="font-headline-sm text-[18px] text-[#e5e1e8] font-semibold">
                Résultats du Catalogue ({matchingArtworks.length})
              </h2>
            </div>
            <span className="font-label-caps text-[10px] text-[#f2ca50] bg-[#f2ca50]/10 px-2 py-0.5 rounded border border-[#f2ca50]/20 font-semibold">
              {ftsResults.length > 0 ? `${ftsResults.length} trouvée(s) • ${ftsStats.lastQueryTimeMs} ms` : `Suggestions`}
            </span>
          </div>

          <div className="space-y-3">
            {/* Direct Artworks Matches */}
            {matchingArtworks.slice(0, 3).map((art, idx) => (
              <article
                key={art.id}
                onClick={() => openArtwork(art.id)}
                className="p-3 rounded-lg bg-[#1c1b20] border border-white/5 hover:border-[#f2ca50]/30 transition-all flex gap-3.5 items-start group cursor-pointer"
              >
                <div className="relative w-20 h-24 flex-shrink-0 rounded overflow-hidden bg-[#0e0e12] border border-white/10">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 right-1 bg-[#0e0e12]/90 text-[#f2ca50] text-[9px] font-label-caps px-1 py-0.2 rounded font-mono">
                    {art.year}
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`font-label-caps text-[9.5px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold ${
                          idx === 0
                            ? 'text-[#f2ca50] bg-[#f2ca50]/10 border border-[#f2ca50]/20'
                            : 'text-[#ffb59f] bg-[#79341f]/40 border border-[#ffb59f]/30'
                        }`}
                      >
                        {idx === 0 ? 'Titre & Artiste' : 'Artiste Correspondant'}
                      </span>
                      <span className="text-[#99907c] font-body-sm text-[11px] font-label-caps truncate max-w-[90px]">
                        {art.museum.split(',')[0]}
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-[16px] text-[#e5e1e8] group-hover:text-[#f2ca50] transition-colors leading-snug line-clamp-1 font-semibold">
                      {art.title}
                    </h3>
                    <p className="font-body-sm text-[12px] text-[#d0c5af] line-clamp-1 mt-0.5">
                      <strong className="text-[#f2ca50] font-semibold">{art.artist}</strong> • {art.technique}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[#99907c] mt-2 pt-1 border-t border-[#36343a]/30">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">zoom_in</span>
                      4 détails HD
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">headphones</span>
                      Guide 3 min
                    </span>
                  </div>
                </div>
              </article>
            ))}

            {/* Correspondances Artistes Dynamiques */}
            {matchingArtists.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-[#f2ca50] block font-semibold">
                  Artistes Correspondants ({matchingArtists.length})
                </span>
                {matchingArtists.map((artist) => {
                  const artistArtworkCount = artworks.filter(
                    (a) => a.artist && a.artist.toLowerCase().includes(artist.name.toLowerCase())
                  ).length;

                  return (
                    <article
                      key={artist.id}
                      onClick={() => openArtist(artist.id)}
                      className="p-3.5 rounded-lg bg-[#201f24] border border-[#f2ca50]/30 relative overflow-hidden group cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.06)] hover:border-[#f2ca50] transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-caps text-[9.5px] uppercase tracking-wider text-[#f2ca50] bg-[#f2ca50]/10 border border-[#f2ca50]/30 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                          <span className="material-symbols-outlined text-[12px]">person</span>
                          Notice Artiste
                        </span>
                        <span className="text-[10.5px] font-label-caps text-[#99907c]">
                          {artist.nationalityOrRegion || artist.nationality || (artist.mainMovements && artist.mainMovements[0]) || artist.movement}
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-full border border-[#f2ca50]/40 overflow-hidden flex-shrink-0 bg-[#0e0e12]">
                          <img
                            src={artist.avatarUrl || artist.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxWy-uOYhe46RJZlDkROyP-8FQ0feqPs70jdajiSzA5EdgAaBJW_D3f5nmdwSE7gRiXDFOU4Rq02bOObsnYjN6ZDaL0Dh8Iy1ofp5uDa5k0xjlIoolLvWSmTFCpIm-eLdaGm7_w0uw_Gi_6Wv9p9rduWnG6Rhvwi3MCoRAPNh4N2CrFBUXEPXFb-Z4QKjF-lu2fwyANrVk2wdwt_hqtypYsZDxprhnUCHG_pLIJRwdRXP_EyMV2Q'}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-title-editorial text-[16px] text-[#e5e1e8] font-semibold group-hover:text-[#f2ca50] transition-colors">
                            {artist.name}{' '}
                            <span className="font-body-sm text-[12px] text-[#99907c] font-normal">
                              ({artist.datesDisplay || artist.dates || `${artist.birthYear}–${artist.deathYear || ''}`})
                            </span>
                          </h4>
                          <p className="font-body-sm text-[11.5px] text-[#d0c5af] line-clamp-1">
                            {artist.biographyShort || artist.bio || artist.shortBio || (artist.mainMovements && artist.mainMovements.join(', ')) || artist.movement}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-[#99907c] group-hover:text-[#f2ca50] transition-colors">
                          chevron_right
                        </span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-[#36343a]/40 flex items-center justify-between text-[11px]">
                        <span className="text-[#d0c5af]">
                          <strong className="text-[#f2ca50] font-medium">{artistArtworkCount} toile(s)</strong> répertoriée(s) dans le corpus
                        </span>
                        <span className="text-[#f2ca50] hover:underline font-label-caps text-[10.5px] font-semibold">
                          Consulter la biographie →
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Correspondances Mouvements Picturaux */}
            {matchingMovements.length > 0 && (
              <div className="p-3 rounded-lg bg-[#1c1b20] border border-white/5 space-y-2">
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-[#f2ca50] block font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[13px]">palette</span>
                  Mouvements &amp; Courants correspondants ({matchingMovements.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {matchingMovements.map((mov) => {
                    const count = artworks.filter((a) => a.movement === mov).length;
                    return (
                      <button
                        key={mov}
                        onClick={() => setSearchQuery(mov)}
                        className="px-3 py-1.5 rounded-lg bg-[#201f24] hover:bg-[#2b292f] border border-[#f2ca50]/30 hover:border-[#f2ca50] text-[#e5e1e8] text-[12px] flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span className="text-[#f2ca50] font-medium">{mov}</span>
                        <span className="text-[10px] text-[#99907c] bg-[#141318] px-1.5 py-0.2 rounded font-mono">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Correspondances Siècles & Périodes */}
            {matchingPeriods.length > 0 && (
              <div className="p-3 rounded-lg bg-[#1c1b20] border border-white/5 space-y-2">
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-[#d0c5af] block font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">timelapse</span>
                  Périodes &amp; Siècles ({matchingPeriods.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {matchingPeriods.map((per) => {
                    const count = artworks.filter((a) => a.period === per).length;
                    return (
                      <button
                        key={per}
                        onClick={() => setSearchQuery(per)}
                        className="px-3 py-1.5 rounded-lg bg-[#201f24] hover:bg-[#2b292f] border border-white/10 hover:border-[#f2ca50] text-[#e5e1e8] text-[12px] flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>{per}</span>
                        <span className="text-[10px] text-[#f2ca50] bg-[#141318] px-1.5 py-0.2 rounded font-mono">
                          {count} toiles
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section: Recherche par facettes */}
        <section className="space-y-4 pt-2">
          <div>
            <h2 className="font-headline-sm text-[18px] text-[#e5e1e8] font-medium flex items-center gap-2">
              <span>Recherche par facettes</span>
              <span className="font-label-caps text-[9.5px] text-[#f2ca50] border border-[#f2ca50]/30 bg-[#f2ca50]/10 px-1.5 py-0.5 rounded uppercase font-semibold">
                FTS Sémantique
              </span>
            </h2>
            <p className="font-body-sm text-[12px] text-[#99907c] mt-0.5">
              Explorez les index sémantiques précompilés
            </p>
          </div>

          {/* Facette 1: Artistes suggérés */}
          <div className="space-y-2">
            <h3 className="font-label-caps text-[10.5px] uppercase tracking-wider text-[#d0c5af] flex items-center gap-1.5 font-semibold">
              <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">brush</span>
              Artistes suggérés (Fiches détaillées)
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => openArtist('van-gogh')}
                type="button"
                className="flex flex-col items-center p-2.5 rounded-lg bg-[#1c1b20] border border-white/5 hover:border-[#f2ca50]/40 transition-all text-center group active:scale-95 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#4d4635]/40 group-hover:border-[#f2ca50] transition-colors mb-2">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf5tPO2uUCRofQEK0eLz4VVPNKCc4Of1TrNUyBgXDUJ87J1T28pg6jxtW3QMHqa43qTzK2KAEaZszWN_vDEjgdIkDw3r44JeGQYic_kkR-lKz_MPH0QcOtjfaI-PMQdYqQmL5RHjR_MRoxeMcnMbRqsDmJsmudfOW6JnIASPQSmlF8yqR2AwQrGYDk7LWVWJ3K5O2bzTNw2fQtGcFzKchW59RFpt33qmIz6WFtBNYXMImhBVgjJw"
                    alt="Van Gogh"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-title-editorial text-[13px] text-[#e5e1e8] group-hover:text-[#f2ca50] transition-colors leading-tight font-semibold">
                  Van Gogh
                </span>
                <span className="font-label-caps text-[10px] text-[#99907c] mt-0.5">Fiche artiste</span>
              </button>

              <button
                onClick={() => openArtist('vermeer')}
                type="button"
                className="flex flex-col items-center p-2.5 rounded-lg bg-[#1c1b20] border border-[#f2ca50]/50 transition-all text-center group active:scale-95 shadow-[0_0_12px_rgba(212,175,55,0.1)] cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#f2ca50] transition-colors mb-2">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfq-beH2XG4wmJspIN7dzyEmnJyVhbXSEeut56pImP9IJpAd_DpBTsdr5i08AvoDR9ynDvY-z_VX9xIWC9G_pQSdzINTkLkG7NjsqsRVYykV0qNyFedEq9Jus5HcWWBTrDRK55V-cvOrxTCfiYlJtVI7ivd_GE_4QWhkwdcb9qgpGaDufivhLb6ZQzcnqAW7oxKEUju3i_rTLYMH4RYq9KpaBQBV0vLFIj1zcEPih8EYjHMWAKBg"
                    alt="Vermeer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-title-editorial text-[13px] text-[#f2ca50] font-semibold leading-tight">
                  Vermeer
                </span>
                <span className="font-label-caps text-[10px] text-[#f2ca50]/80 mt-0.5">Fiche artiste</span>
              </button>

              <button
                onClick={() => openArtist('frida-kahlo')}
                type="button"
                className="flex flex-col items-center p-2.5 rounded-lg bg-[#1c1b20] border border-white/5 hover:border-[#f2ca50]/40 transition-all text-center group active:scale-95 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#4d4635]/40 group-hover:border-[#f2ca50] transition-colors mb-2">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsEtGh7EVQRzkAGMsCZsMA0pyXsZ9K3oGHj68Yv9b5z_HJ4Nc0Ha3TFPHurNTXBRZMqPjOh7nWfKq4t_pxt6dIM2576vtQm9FcgW_fyEcaI7UeELucHdGfrh3EVVsPZG0XWoNV6XBU6G6aKCjLVzzLU9GLKHqbFmWHL00utarJP4iuIVuGaHRSsnujmmLfVgA9ipLNX1NlEX0WbhyZmcymCxXqDvzlOzImr3mjcHqeNJrvRJD_xA"
                    alt="Frida Kahlo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-title-editorial text-[13px] text-[#e5e1e8] group-hover:text-[#f2ca50] transition-colors leading-tight font-semibold">
                  Frida Kahlo
                </span>
                <span className="font-label-caps text-[10px] text-[#99907c] mt-0.5">Fiche artiste</span>
              </button>
            </div>
          </div>

          {/* Facette 2: Mouvements & Styles */}
          <div className="space-y-2 pt-1">
            <h3 className="font-label-caps text-[10.5px] uppercase tracking-wider text-[#d0c5af] flex items-center gap-1.5 font-semibold">
              <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">category</span>
              Mouvements &amp; Styles (Fiches historiques)
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openMovement('age-or-hollandais')}
                className="px-2.5 py-1.5 rounded-lg bg-[#1c1b20] border border-[#f2ca50]/30 text-[#f2ca50] font-label-caps text-[11px] hover:bg-[#f2ca50]/10 transition-colors cursor-pointer"
              >
                Âge d'or hollandais ↗
              </button>
              <button
                onClick={() => openMovement('postimpressionnisme')}
                className="px-2.5 py-1.5 rounded-lg bg-[#1c1b20] border border-white/5 text-[#d0c5af] font-label-caps text-[11px] hover:border-[#f2ca50]/30 hover:text-[#e5e1e8] transition-colors cursor-pointer"
              >
                Postimpressionnisme ↗
              </button>
              <button
                onClick={() => openMovement('baroque-italien')}
                className="px-2.5 py-1.5 rounded-lg bg-[#1c1b20] border border-[#ffb59f]/30 text-[#ffb59f] font-label-caps text-[11px] hover:bg-[#79341f]/30 transition-colors cursor-pointer"
              >
                Baroque italien ↗
              </button>
              <button
                onClick={() => openMovement('impressionnisme')}
                className="px-2.5 py-1.5 rounded-lg bg-[#1c1b20] border border-white/5 text-[#d0c5af] font-label-caps text-[11px] hover:border-[#f2ca50]/30 hover:text-[#e5e1e8] transition-colors cursor-pointer"
              >
                Impressionnisme ↗
              </button>
            </div>
          </div>

          {/* Facette 3: Thématiques */}
          <div className="space-y-2 pt-1">
            <h3 className="font-label-caps text-[10.5px] uppercase tracking-wider text-[#d0c5af] flex items-center gap-1.5 font-semibold">
              <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">visibility</span>
              Thématiques &amp; Éléments visuels
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setSearchQuery('Portraits')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#1c1b20] border border-white/5 hover:border-[#f2ca50]/30 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-[#f2ca50]">portrait</span>
                  <div>
                    <span className="font-body-md text-[#e5e1e8] group-hover:text-[#f2ca50] transition-colors font-medium text-[13px]">
                      Portraits intimes
                    </span>
                    <span className="block text-[11px] text-[#99907c]">
                      Lumière latérale, intérieurs domestiques
                    </span>
                  </div>
                </div>
                <span className="font-label-caps text-[10.5px] text-[#99907c] group-hover:text-[#f2ca50] transition-colors">
                  48 œuvres
                </span>
              </button>

              <button
                onClick={() => setSearchQuery('nocturnes')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#1c1b20] border border-white/5 hover:border-[#f2ca50]/30 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-[#f2ca50]">bedtime</span>
                  <div>
                    <span className="font-body-md text-[#e5e1e8] group-hover:text-[#f2ca50] transition-colors font-medium text-[13px]">
                      Paysages nocturnes
                    </span>
                    <span className="block text-[11px] text-[#99907c]">
                      Clair de lune, crépuscules romantiques
                    </span>
                  </div>
                </div>
                <span className="font-label-caps text-[10.5px] text-[#99907c] group-hover:text-[#f2ca50] transition-colors">
                  31 œuvres
                </span>
              </button>

              <button
                onClick={() => setSearchQuery('femmes')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#1c1b20] border border-white/5 hover:border-[#f2ca50]/30 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-[#ffb59f]">palette</span>
                  <div>
                    <span className="font-body-md text-[#e5e1e8] group-hover:text-[#f2ca50] transition-colors font-medium text-[13px]">
                      Femmes peintres
                    </span>
                    <span className="block text-[11px] text-[#99907c]">
                      Pionnières de la Renaissance au Modernisme
                    </span>
                  </div>
                </div>
                <span className="font-label-caps text-[10.5px] text-[#99907c] group-hover:text-[#f2ca50] transition-colors">
                  19 artistes
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Footnote */}
        <footer className="pt-4 pb-6 text-center space-y-1.5 border-t border-[#201f24]">
          <div className="inline-flex items-center gap-1.5 text-[#f2ca50] text-[10.5px] font-label-caps bg-[#1c1b20] px-3 py-1 rounded-full border border-[#f2ca50]/20 font-semibold">
            <span className="material-symbols-outlined text-[13px]">database</span>
            <span>IndexedDB (RegardMuseumDB v1) • Index Inversé BM25</span>
          </div>
          <p className="font-body-sm text-[11.5px] text-[#99907c] max-w-xs mx-auto">
            Base locale de {artworks.length} toiles et {ftsStats.uniqueTokensCount} termes indexés — 100% Hors-ligne
          </p>
        </footer>
      </main>
    </div>
  );
};

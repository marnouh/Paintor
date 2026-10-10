import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TopAppBar } from '../components/TopAppBar.tsx';
import { ContextualTipBanner } from '../components/ContextualTipBanner.tsx';

export const HomeScreen: React.FC = () => {
  const {
    openArtwork,
    openLearningPath,
    openGigapixel,
    toggleBookmark,
    isBookmarked,
    toggleAudioPlayback,
    navigateTo,
    applyQuickFilter,
    toggleHamburger,
  } = useApp();

  return (
    <div className="min-h-screen bg-[#141318] text-[#e5e1e8] pb-28">
      {/* Top App Bar */}
      <TopAppBar
        title="Regard"
        subtitle="L'Art de la Peinture"
        showSearch={true}
        showBookmark={true}
      />

      <main className="max-w-xl mx-auto pt-16 px-4 sm:px-5">
        <ContextualTipBanner
          tipKey="home_welcome"
          title="Guide du Conservateur"
          description="Touchez les points dorés vibrants sur les toiles pour révéler les repentirs et secrets picturaux en quelques secondes."
          icon="auto_awesome"
          actionText="Ouvrir le menu des fonctionnalités"
          onAction={toggleHamburger}
        />

        {/* Accroche Éditoriale & Date */}
        <section className="mt-4 mb-5 flex items-end justify-between border-b border-[#4d4635]/30 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] animate-pulse" />
              <span className="font-label-caps text-[#f2ca50] uppercase text-[11px]">
                Mardi 24 Octobre
              </span>
            </div>
            <p className="font-title-editorial text-[17px] text-[#e5e1e8] mt-0.5 font-semibold">
              La sélection du conservateur
            </p>
          </div>
          <div className="text-right">
            <span className="font-label-caps text-[10px] text-[#d0c5af] tracking-wider bg-[#201f24] px-2 py-1 rounded-lg border border-white/5">
              100% Hors-ligne
            </span>
          </div>
        </section>

        {/* 1. HERO MASTERWORK OF THE DAY (Johannes Vermeer) */}
        <section className="mb-8">
          <div className="relative bg-[#1c1b20] rounded-xl overflow-hidden border border-white/[0.08] group transition-all duration-300 hover:border-[#4d4635]">
            {/* Artwork Canvas Image */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0e0e12]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfUFs2zk7zUeQDIEQffqpLA9dUx_tWV1SBEYNqMgK_dG9m5j8Ii4NLhotd0o4PVbkAvPaRiSWfl4113sOrA34gbA9EEGqucatxBZVaYYCXqPzIBFRs9sEaK5BpFRh0oZL4EHUOg4jklfYEqy9px957jN_dm3kGz82CnxcqFkOwRzu2Qe-AxwcDmvHDVZJ0HCZaaEH0OY9exiBd25dk3CeRg4c5hkGZEh8OmBl90ZUZt84fU6H7IA"
                alt="La Jeune Fille à la perle par Johannes Vermeer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              {/* Ambient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-[#0e0e12]/30 to-transparent pointer-events-none" />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0e0e12]/85 backdrop-blur-md text-[#f2ca50] font-label-caps text-[10px] border border-[#f2ca50]/35 shadow-sm">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    stars
                  </span>
                  ŒUVRE DU JOUR
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0e0e12]/80 backdrop-blur-md text-[#d0c5af] font-label-caps text-[10px] border border-white/10">
                  <span className="material-symbols-outlined text-[13px]">schedule</span>
                  2 min de lecture
                </span>
              </div>

              {/* Hotspot Focal Target */}
              <div
                onClick={() => openArtwork('girl-pearl-earring')}
                className="absolute top-[44%] left-[56%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin"
                title="Inspecter le détail de la perle"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full bg-[#f2ca50]/20 animate-ping" />
                  <span className="w-6 h-6 rounded-full border border-[#f2ca50]/70 bg-[#0e0e12]/90 flex items-center justify-center gilded-glow">
                    <span className="w-2 h-2 rounded-full bg-[#f2ca50]" />
                  </span>
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/pin:flex items-center gap-1 px-2 py-1 rounded bg-[#2b292f] text-[#e5e1e8] text-[10px] font-label-caps whitespace-nowrap shadow-xl border border-white/10">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[12px]">zoom_in</span>
                  Éclat de la perle
                </div>
              </div>
            </div>

            {/* Masterwork Meta Block */}
            <div className="p-4 pt-3 bg-[#1c1b20] border-t border-white/5">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-widest uppercase font-semibold">
                  Johannes Vermeer
                </span>
                <span className="font-body-sm text-[12px] text-[#99907c]">
                  1665 • Mauritshuis, La Haye
                </span>
              </div>
              <h2
                onClick={() => openArtwork('girl-pearl-earring')}
                className="font-display-hero-mobile text-[26px] text-[#e5e1e8] leading-tight tracking-tight mb-2 hover:text-[#f2ca50] transition-colors cursor-pointer"
              >
                La Jeune Fille à la perle
              </h2>
              <p className="font-body-md text-[13.5px] text-[#d0c5af] italic leading-relaxed mb-4">
                « L'énigmatique regard par-dessus l'épaule et l'éclat pur de la lumière de Delft, suspendus dans un silence d'ambre. »
              </p>

              {/* Action Cluster */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => openArtwork('girl-pearl-earring')}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#d4af37] hover:bg-[#f2ca50] text-[#3c2f00] rounded-lg font-label-md text-[13px] font-bold tracking-wide hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  Découvrir l'œuvre
                </button>
                <button
                  onClick={() => toggleBookmark('girl-pearl-earring')}
                  aria-label="Conserver dans ma collection"
                  className={`p-3 rounded-lg bg-[#201f24] hover:text-[#f2ca50] border border-white/10 transition-colors active:scale-95 cursor-pointer ${
                    isBookmarked('girl-pearl-earring') ? 'text-[#f2ca50]' : 'text-[#e5e1e8]'
                  }`}
                  title="Ajouter aux favoris"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: isBookmarked('girl-pearl-earring') ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    bookmark
                  </span>
                </button>
                <button
                  onClick={() => toggleAudioPlayback('La lumière de Delft', 'Claire D.')}
                  aria-label="Guide audio rapide"
                  className="p-3 rounded-lg bg-[#201f24] text-[#e5e1e8] hover:text-[#f2ca50] border border-white/10 transition-colors active:scale-95 cursor-pointer"
                  title="Écouter le guide audio"
                >
                  <span className="material-symbols-outlined text-[20px]">headphones</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. AXES D'EXPLORATION CHIPS */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-label-caps text-[11px] text-[#99907c] tracking-widest uppercase">
              Axes d'exploration
            </h3>
            <span className="font-body-sm text-[12px] text-[#99907c] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#f2ca50]">database</span>
              Base locale 840 œuvres
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:-mx-0 sm:px-0">
            <button
              onClick={() => applyQuickFilter('incontournables')}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#f2ca50]/10 border border-[#f2ca50]/30 text-[#f2ca50] font-label-caps text-[11px] hover:bg-[#f2ca50]/20 transition-colors cursor-pointer"
            >
              Incontournables
            </button>
            <button
              onClick={() => applyQuickFilter('meconnus')}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#2b292f] border border-white/5 text-[#d0c5af] hover:text-[#e5e1e8] hover:border-[#99907c] font-label-caps text-[11px] transition-colors cursor-pointer"
            >
              Chefs-d'œuvre méconnus
            </button>
            <button
              onClick={() => applyQuickFilter('femmes')}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#2b292f] border border-white/5 text-[#d0c5af] hover:text-[#e5e1e8] hover:border-[#99907c] font-label-caps text-[11px] transition-colors cursor-pointer"
            >
              Femmes artistes
            </button>
            <button
              onClick={() => applyQuickFilter('renaissance')}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#2b292f] border border-white/5 text-[#d0c5af] hover:text-[#e5e1e8] hover:border-[#99907c] font-label-caps text-[11px] transition-colors cursor-pointer"
            >
              Renaissance
            </button>
            <button
              onClick={() => applyQuickFilter('impressionnisme')}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#2b292f] border border-white/5 text-[#d0c5af] hover:text-[#e5e1e8] hover:border-[#99907c] font-label-caps text-[11px] transition-colors cursor-pointer"
            >
              Impressionnisme
            </button>
            <button
              onClick={() => applyQuickFilter('baroque')}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#2b292f] border border-white/5 text-[#d0c5af] hover:text-[#e5e1e8] hover:border-[#99907c] font-label-caps text-[11px] transition-colors cursor-pointer"
            >
              Baroque &amp; Ténèbres
            </button>
          </div>
        </section>

        {/* 3. PARCOURS THÉMATIQUES */}
        <section className="mb-8">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h2 className="font-headline-sm text-[20px] text-[#e5e1e8] font-semibold">
                Parcours thématiques
              </h2>
              <p className="font-body-sm text-[12px] text-[#99907c] mt-0.5">
                Visites guidées et cycles d'initiation esthétique
              </p>
            </div>
            <button
              onClick={() => navigateTo('apprendre')}
              className="font-label-caps text-[11px] text-[#f2ca50] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Tout voir</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>

          <div className="space-y-3">
            {/* Path Card 1: In Progress with Fine Progress Gauge */}
            <article
              onClick={() => openLearningPath('maitres-couleur')}
              className="bg-[#201f24] rounded-xl p-3.5 border border-white/5 hover:border-[#f2ca50]/40 transition-all cursor-pointer relative overflow-hidden group"
            >
              <div className="flex gap-3.5">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative bg-[#0e0e12]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNu8ab4xzC-deMjUEkUcVqgp1MKdNZTiFDhMyIA_lJ06RVoKRFsV_mbJYKg2HB08D-kAKT695WGuLy2CmK-Or1zEbY4cHUxiVHARnnx762gYtcW-bayHQsJ7KBP7-NS_K8xJ6FQosW1bJ2wCCp5yojhvvrkPRJLVScnIzTeLjOwH4fdMEfYbzCzB6Lh6BrLU4oQirdi70uSzyTCppbapcZSpZBIMTxdtW24bgMvsuybBkJr1Idsw"
                    alt="Les Maîtres de la Couleur"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute inset-0 bg-[#f2ca50]/10 mix-blend-overlay" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase tracking-wider font-semibold">
                        Étape 4 / 8 en cours
                      </span>
                      <span className="font-body-sm text-[12px] text-[#99907c] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">timer</span>
                        45 min
                      </span>
                    </div>
                    <h3 className="font-title-editorial text-[16px] text-[#e5e1e8] truncate group-hover:text-[#f2ca50] transition-colors">
                      Les Maîtres de la Couleur
                    </h3>
                    <p className="font-body-sm text-[12px] text-[#d0c5af] truncate">
                      De Van Gogh à Henri Matisse
                    </p>
                  </div>
                  {/* Progress Gauge */}
                  <div className="mt-2">
                    <div className="w-full h-1 bg-[#36343a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#f2ca50] rounded-full" style={{ width: '50%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Path Card 2: Le Clair-obscur et la Nuit */}
            <article
              onClick={() => openLearningPath('clair-obscur')}
              className="bg-[#201f24] rounded-xl p-3.5 border border-white/5 hover:border-[#f2ca50]/40 transition-all cursor-pointer relative overflow-hidden group"
            >
              <div className="flex gap-3.5">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative bg-[#0e0e12]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3oX-6JRpIC5-l9VVazuuxsTkSnoBY4Wv7ZrzQZ9cBfFFNQXZHIQD0OA2dEvnwA9olJj3_usha7S5Uf1VzOyfSk94gkpKaJM2EnXAASKNxc4X1nq6wqIau3Oe9hDND1tNdrHy4YR1IJja4yvTxCE3JW6t0sVvdeCGY3ioz8p2QMYuXVyaICH2C2TAoGkabXme5mvC1a9mjhGaGrjJUftKvi_BeK53kXVcOgsuSALgSgEtavMu7vw"
                    alt="Le Clair-obscur et la Nuit"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-caps text-[10px] text-[#ffb59f] uppercase tracking-wider font-semibold">
                        5 œuvres clés
                      </span>
                      <span className="font-body-sm text-[12px] text-[#99907c] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">timer</span>
                        20 min
                      </span>
                    </div>
                    <h3 className="font-title-editorial text-[16px] text-[#e5e1e8] truncate group-hover:text-[#f2ca50] transition-colors">
                      Le Clair-obscur et la Nuit
                    </h3>
                    <p className="font-body-sm text-[12px] text-[#d0c5af] truncate">
                      Caravage, Rembrandt, Georges de La Tour
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                    <span className="font-label-caps text-[10px] text-[#99907c]">
                      Analyse picturale &amp; audio
                    </span>
                    <span className="material-symbols-outlined text-[#99907c] text-[16px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Path Card 3: Révolution Impressionniste */}
            <article
              onClick={() => openLearningPath('revolution-impressionniste')}
              className="bg-[#201f24] rounded-xl p-3.5 border border-white/5 hover:border-[#f2ca50]/40 transition-all cursor-pointer relative overflow-hidden group"
            >
              <div className="flex gap-3.5">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative bg-[#0e0e12]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUNdZtV1Ka8D57_ekkQVt9bjENNo4FL2KFDdL8lnlEecGCRNZ0B_6r4FlnvVASKo4n3RvyRLLQa-n2oTBk_IggLUepA9LMq8miioBEVZZzN5HyfIqwzCyWoem87gZEFmj9iV90Gnqa-igJDev2Hwuwv5gJCXIi71wCZMPKgkJcqeqneGZbY-PtOxHrr9RdAT_97pLJnGbUuaFz0eAPX6WVQpDCuOK1SizcoLkW-sQZ4DwU8uYa7w"
                    alt="Révolution Impressionniste"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-[#f2ca50]/10 text-[#f2ca50] font-label-caps text-[9px] uppercase tracking-wider font-semibold">
                        Nouveau
                      </span>
                      <span className="font-body-sm text-[12px] text-[#99907c] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">timer</span>
                        25 min
                      </span>
                    </div>
                    <h3 className="font-title-editorial text-[16px] text-[#e5e1e8] truncate group-hover:text-[#f2ca50] transition-colors">
                      Révolution Impressionniste
                    </h3>
                    <p className="font-body-sm text-[12px] text-[#d0c5af] truncate">
                      Monet, Edgar Degas, Berthe Morisot
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                    <span className="font-label-caps text-[10px] text-[#99907c]">
                      6 chefs-d'œuvre sélectionnés
                    </span>
                    <span className="material-symbols-outlined text-[#99907c] text-[16px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* 4. REGARD MINUTE / FOCUS DÉTAIL CACHÉ (Arnolfini Mirror) */}
        <section className="mb-8">
          <div className="relative rounded-xl p-4 bg-gradient-to-br from-[#2b292f] to-[#1c1b20] border border-[#f2ca50]/30 gilded-glow overflow-hidden">
            <div className="flex items-start justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/20">
                  <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
                </span>
                <div>
                  <span className="font-label-caps text-[10px] text-[#f2ca50] tracking-widest uppercase block">
                    Regard Minute
                  </span>
                  <h3 className="font-headline-sm text-[19px] text-[#e5e1e8] font-semibold">
                    Le détail caché du jour
                  </h3>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#0e0e12]/80 text-[11px] font-label-caps text-[#99907c] border border-white/10">
                1 min
              </span>
            </div>

            {/* Detail Presentation Card with Magnifier Graphic */}
            <div
              onClick={() => openGigapixel('starry-night')}
              className="relative rounded-lg overflow-hidden bg-[#0e0e12] my-3 border border-white/10 cursor-pointer group"
            >
              <div className="aspect-[16/9] w-full relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuANsB2OTXhjJgd8K5cihPE0gV2cUKcHgx6ZUfTB5xi5myF4DVRm1pN5qIaM-FzzVAIGKcyuple3bJtiYP6srSalCg7hSQO6rdSUcZEF76C-R_38QVNJXCwgBUp4T1w88Ybqh7_EmyGctZPUgrYRUp9BcIIdt-BSVhj2XjTFwiJaSC1mln1X7Di55YlRBpqtT1q6PW8T-SCLSjC20rP2vpYRub6YbALL0v9L0nqAZNuxVZwr37pSAA"
                  alt="Miroir convexe des Époux Arnolfini par Jan van Eyck"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#0e0e12]/30 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full border border-[#f2ca50]/70 bg-black/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[#f2ca50] text-[24px]">search</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#201f24]">
                <p className="font-label-caps text-[10.5px] text-[#99907c] uppercase tracking-wider mb-0.5">
                  Jan van Eyck • 1434 • National Gallery
                </p>
                <p className="font-body-md text-[13px] text-[#e5e1e8]">
                  Le reflet minuscule du peintre dans le miroir convexe des <em>Époux Arnolfini</em>.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex items-center justify-between pt-1 relative z-10">
              <span className="font-body-sm text-[12px] text-[#d0c5af] italic">
                Pouvez-vous distinguer les deux témoins ?
              </span>
              <button
                onClick={() => openGigapixel('cezanne-sainte-victoire')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#3a383e] text-[#e5e1e8] hover:text-[#f2ca50] border border-white/10 font-label-caps text-[11px] tracking-wider transition-colors active:scale-95 cursor-pointer"
              >
                <span>Inspecter le détail</span>
                <span className="material-symbols-outlined text-[15px]">zoom_in</span>
              </button>
            </div>
          </div>
        </section>

        {/* 5. REPRENDRE LA VISITE (Récents) */}
        <section className="mb-8">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <h2 className="font-headline-sm text-[19px] text-[#e5e1e8] font-semibold">
                Reprendre la visite
              </h2>
              <p className="font-body-sm text-[12px] text-[#99907c] mt-0.5">
                Vos dernières toiles contemplées
              </p>
            </div>
            <button
              onClick={() => navigateTo('collection')}
              className="font-label-caps text-[11px] text-[#99907c] hover:text-[#e5e1e8] transition-colors cursor-pointer"
            >
              Historique
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Recent 1: La Nuit étoilée */}
            <div
              onClick={() => openArtwork('starry-night')}
              className="bg-[#201f24] rounded-xl p-3 border border-white/5 hover:border-[#99907c] transition-all cursor-pointer group"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#0e0e12] mb-2.5 relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCf-6ab3nwty5vQfsHJ70MqtCVK5ubdxj-94yx0rIVv__XhwNTi9NrkkyMn4BOMAyGseGcGiRS9MYtym7vd9DfFUsgqH6Va4TWhTzQ3bps6heOKJXUJlyG0NmeRjTGhAYVbpjVM2yO0zd_OJL5MgV7djI8OvBAcJZlZwts71EkfJyjUlWH2J7r9NBa5Y0_3o1sIgCygBa1AyIgEhzfLpR3ZMetRZ0mkgX9MmT-9GqFHly8hWrMmZA"
                  alt="La Nuit étoilée"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-label-caps text-[#e5e1e8] backdrop-blur-sm">
                  Vu hier
                </span>
              </div>
              <h4 className="font-title-editorial text-[14px] text-[#e5e1e8] font-semibold truncate group-hover:text-[#f2ca50] transition-colors">
                La Nuit étoilée
              </h4>
              <p className="font-body-sm text-[11px] text-[#99907c] truncate">
                Vincent van Gogh • 1889
              </p>
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[#99907c]">
                <span className="font-label-caps text-[9.5px]">MoMA, New York</span>
                <span className="material-symbols-outlined text-[14px]">navigate_next</span>
              </div>
            </div>

            {/* Recent 2: La Laitière */}
            <div
              onClick={() => openArtwork('milkmaid')}
              className="bg-[#201f24] rounded-xl p-3 border border-white/5 hover:border-[#99907c] transition-all cursor-pointer group"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#0e0e12] mb-2.5 relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW5vClwRVnHkQcl0Bq5uqtZCGBjb72JcOtERu7hucnegCGmlXia9cwYaJqiSujD4eFgCagDrZpgPkLYttBi1WCx4zLnWadsjmHKLl9bW5VccXfZfKsmtwU4IdVmCJdA5vSPJv_8Gd33Mu7X0iB5PB7BP9DdVmxzahiOlGXtu5YMKNngTXYXeCQ-AkXmg6yXzHASoXorNr2bzCUU9dZH7bwvcq3gfudihUeVohOCRKrCqlTvxqgiA"
                  alt="La Laitière"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-label-caps text-[#e5e1e8] backdrop-blur-sm">
                  Il y a 3j
                </span>
              </div>
              <h4 className="font-title-editorial text-[14px] text-[#e5e1e8] font-semibold truncate group-hover:text-[#f2ca50] transition-colors">
                La Laitière
              </h4>
              <p className="font-body-sm text-[11px] text-[#99907c] truncate">
                Johannes Vermeer • 1658
              </p>
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[#99907c]">
                <span className="font-label-caps text-[9.5px]">Rijksmuseum, Amsterdam</span>
                <span className="material-symbols-outlined text-[14px]">navigate_next</span>
              </div>
            </div>
          </div>
        </section>

        {/* Curatorial Note Footer */}
        <footer className="pt-6 pb-2 text-center border-t border-[#4d4635]/20">
          <p className="font-title-editorial text-[13px] text-[#99907c] italic">
            « La peinture est une poésie qui se voit au lieu de se sentir. »
          </p>
          <p className="font-label-caps text-[10px] text-[#99907c]/60 mt-1 uppercase tracking-widest">
            Léonard de Vinci — Regard Muséum v2.4
          </p>
        </footer>
      </main>
    </div>
  );
};

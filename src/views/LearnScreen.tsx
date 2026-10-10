import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TopAppBar } from '../components/TopAppBar.tsx';
import { LEARNING_PATHS } from '../data/learningPaths.ts';
import { TIMELINE_MOVEMENTS, GLOSSARY_TERMS } from '../data/learningExtras.ts';

export const LearnScreen: React.FC = () => {
  const { openLearningPath, toggleAudioPlayback, navigateTo, openMovement } = useApp();
  const [activeTab, setActiveTab] = useState<'parcours' | 'frise'>('parcours');

  return (
    <div className="min-h-screen bg-[#141318] text-[#e5e1e8] pb-28">
      {/* Top App Bar */}
      <TopAppBar
        title="Regard"
        subtitle="L'Art de la Peinture"
        showBack={false}
        showSearch={true}
        showBookmark={true}
      />

      <main className="pt-16 px-4 sm:px-5 max-w-xl mx-auto">
        {/* Hero Header Section */}
        <section className="mt-4 mb-6">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-label-caps text-[10.5px] text-[#f2ca50] tracking-widest uppercase font-semibold">
              HISTOIRE DE L'ART &amp; CYCLES THÉMATIQUES
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#2b292f] border border-[#4d4635]/30 text-[#d0c5af] font-label-caps text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] animate-pulse" />
              100% Hors-ligne
            </span>
          </div>

          <h1 className="font-display-hero-mobile text-[32px] sm:text-[36px] text-[#e5e1e8] font-semibold tracking-tight">
            Apprendre
          </h1>
          <p className="font-body-md text-[13.5px] text-[#d0c5af] mt-1.5 leading-relaxed">
            Développez votre œil à travers les époques et les maîtres de la peinture. Une formation visuelle progressive, rigoureusement documentée.
          </p>

          <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#201f24] border border-[#4d4635]/20">
            <span className="material-symbols-outlined text-[#f2ca50] text-[16px]">offline_pin</span>
            <span className="font-body-sm text-[12px] text-[#d0c5af]">
              Index pédagogique local FTS5 • Base conservatoire active
            </span>
          </div>
        </section>

        {/* Dual-Track Segmented Switcher */}
        <section className="mb-6">
          <div className="p-1 rounded-lg bg-[#1c1b20] border border-[#4d4635]/20 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('parcours')}
              className={`flex-1 py-2 px-3 rounded-lg font-label-caps text-[11px] text-center transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'parcours'
                  ? 'bg-[#2b292f] text-[#f2ca50] border border-[#f2ca50]/30 shadow-sm font-semibold'
                  : 'text-[#d0c5af] hover:text-[#e5e1e8]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">school</span>
              Parcours Guidés
            </button>
            <button
              onClick={() => setActiveTab('frise')}
              className={`flex-1 py-2 px-3 rounded-lg font-label-caps text-[11px] text-center transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'frise'
                  ? 'bg-[#2b292f] text-[#f2ca50] border border-[#f2ca50]/30 shadow-sm font-semibold'
                  : 'text-[#d0c5af] hover:text-[#e5e1e8]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">history_edu</span>
              Frise Chronologique
            </button>
          </div>
        </section>

        {/* PARCOURS EN COURS (RESUME BANNER) */}
        <section className="mb-8">
          <div className="relative overflow-hidden rounded-xl bg-[#201f24] border border-[#f2ca50]/35 gilded-glow p-4">
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-[#f2ca50]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#f2ca50]/10 border border-[#f2ca50]/20 text-[#f2ca50] font-label-caps text-[10px] uppercase font-semibold">
                  En cours
                </span>
                <span className="font-body-sm text-[12px] text-[#d0c5af]">
                  Étape 4 sur 8
                </span>
              </div>
              <span className="font-label-caps text-[11px] text-[#f2ca50] font-semibold">
                50% accompli
              </span>
            </div>

            <div className="flex items-start gap-3.5 mb-3.5">
              <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-[#4d4635]/30 bg-[#0e0e12]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6dHsslQSJRoIbLP6wlog0iYyOdastN2UE3cenyP3bL9br3rO7F6WqGJNbVQW4VghtKKm-RjUsUYE0fuJVL3eXB51ZfvD7V7ISZZ_X1Ym5MCzGknGRoOZGnYkzTMQULLIiguEermp1xGrAvP7RyyvIuCPbS18pHcaQvYolOj1yhQlvAJ9zYsDanCD0VhWBh8dkn84Qjrc1raQ-n1mzzmOG0eMOuP5qAbInL3iUQU42W1ytAPYXvg"
                  alt="Paul Cézanne - La Montagne Sainte-Victoire"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-headline-sm text-[18px] text-[#e5e1e8] leading-snug font-semibold truncate">
                  Les Maîtres de la Couleur
                </h2>
                <p className="font-body-sm text-[12px] text-[#d0c5af] mt-1 line-clamp-1">
                  Prochaine toile : Paul Cézanne, <span className="italic text-[#e5e1e8]">La Montagne Sainte-Victoire</span>
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-[#d0c5af] font-body-sm text-[11px]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">schedule</span>
                    15 min restantes
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">palette</span>
                    Postimpressionnisme
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-[#36343a] rounded-full overflow-hidden mb-4">
              <div className="h-full bg-[#f2ca50] rounded-full transition-all duration-500" style={{ width: '50%' }} />
            </div>

            {/* CTA Button */}
            <button
              onClick={() => openLearningPath('maitres-couleur')}
              className="w-full py-2.5 px-4 rounded-lg bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-label-md text-[13px] font-bold flex items-center justify-center gap-2 transition-transform duration-150 active:scale-95 shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
              Reprendre le cycle
            </button>
          </div>
        </section>

        {/* TAB 1 : CYCLES THÉMATIQUES */}
        {activeTab === 'parcours' && (
          <section className="mb-8 space-y-4">
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <h2 className="font-headline-md text-[20px] text-[#e5e1e8] font-semibold">
                  Cycles Thématiques
                </h2>
                <p className="font-body-sm text-[12px] text-[#99907c] mt-0.5">
                  Parcours narratifs structurés par un conservateur
                </p>
              </div>
              <span className="font-label-caps text-[11px] text-[#f2ca50] uppercase font-semibold">
                4 Séries
              </span>
            </div>

            <div className="space-y-3.5">
              {LEARNING_PATHS.map((path) => (
                <article
                  key={path.id}
                  onClick={() => openLearningPath(path.id)}
                  className={`p-4 rounded-xl bg-[#1c1b20] border transition-all duration-200 cursor-pointer group ${
                    path.id === 'maitres-couleur'
                      ? 'border-[#f2ca50]/40 gilded-glow'
                      : 'border-white/[0.06] hover:border-[#f2ca50]/30'
                  }`}
                >
                  <div className="flex gap-3.5">
                    <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-[#4d4635]/30 bg-[#0e0e12]">
                      <img
                        src={path.coverImage}
                        alt={path.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-label-caps uppercase font-semibold ${
                              path.level === 'Incontournable'
                                ? 'bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/40'
                                : path.level === 'Intermédiaire'
                                ? 'bg-[#79341f]/40 text-[#ffb59f] border border-[#ffb59f]/20'
                                : 'bg-[#2b292f] text-[#d0c5af] border border-white/5'
                            }`}
                          >
                            {path.level}
                          </span>
                          <span className="font-body-sm text-[11px] text-[#99907c]">
                            {path.estimatedDuration}
                          </span>
                        </div>
                        <h3 className="font-title-editorial text-[16px] text-[#e5e1e8] group-hover:text-[#f2ca50] transition-colors leading-tight font-semibold">
                          {path.title}
                        </h3>
                        <p className="font-body-sm text-[12px] text-[#d0c5af] mt-1 line-clamp-2">
                          {path.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                        <span className="font-body-sm text-[11px] text-[#99907c] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-[#f2ca50]">visibility</span>
                          {path.artworkCount} toiles maîtresses
                        </span>
                        <span className="material-symbols-outlined text-[#f2ca50] text-[18px] group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* TAB 2 : FRISE CHRONOLOGIQUE DES GRANDS MOUVEMENTS */}
        {activeTab === 'frise' && (
          <section className="mb-8">
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <span className="font-label-caps text-[10.5px] text-[#f2ca50] uppercase tracking-widest font-semibold">
                  Voyage dans le Temps
                </span>
                <h2 className="font-headline-md text-[20px] text-[#e5e1e8] font-semibold mt-0.5">
                  Grands Mouvements
                </h2>
              </div>
              <span className="font-body-sm text-[12px] text-[#99907c]">1400 — 1945</span>
            </div>

            <p className="font-body-sm text-[12.5px] text-[#d0c5af] mb-6 leading-relaxed">
              Parcourez six siècles de ruptures formelles, d'évolutions des pigments et d'innovations optiques.
            </p>

            {/* Stepper Timeline */}
            <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[1px] before:bg-gradient-to-b before:from-[#f2ca50] before:via-[#4d4635] before:to-[#f2ca50]/40">
              {TIMELINE_MOVEMENTS.map((mov) => (
                <div key={mov.id} className="relative group">
                  <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-[#141318] border-2 border-[#f2ca50] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]" />
                  </div>
                  <div
                    onClick={() => openMovement(mov.id)}
                    className="p-4 rounded-xl bg-[#1c1b20] border border-white/[0.06] hover:border-[#f2ca50]/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-caps text-[11px] text-[#f2ca50] font-semibold">
                        {mov.periodYears}
                      </span>
                      <span className="font-body-sm text-[11px] text-[#99907c]">
                        {mov.geographicCenter}
                      </span>
                    </div>
                    <h3 className="font-title-editorial text-[16px] text-[#e5e1e8] group-hover:text-[#f2ca50] transition-colors font-semibold">
                      {mov.title}
                    </h3>
                    <p className="font-body-sm text-[12px] text-[#d0c5af] mt-1 leading-relaxed">
                      {mov.description}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="font-body-sm text-[#e5e1e8] italic text-[11.5px] truncate max-w-[65%]">
                        {mov.artists}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openMovement(mov.id);
                        }}
                        className="px-2.5 py-1 rounded bg-[#2b292f] border border-white/10 text-[#f2ca50] hover:text-[#ffe088] font-label-caps text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        Notice &amp; Toiles
                        <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION : VOCABULAIRE DU CONSERVATEUR (GLOSSAIRE) */}
        <section className="mb-8">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="font-headline-md text-[20px] text-[#e5e1e8] font-semibold">
              Vocabulaire du Conservateur
            </h2>
            <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase font-semibold">
              Glossaire
            </span>
          </div>
          <p className="font-body-sm text-[12px] text-[#99907c] mb-4">
            Clés de lecture technique pour décrypter la toile comme un restaurateur d'art.
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {GLOSSARY_TERMS.map((term) => (
              <details
                key={term.id}
                className="group rounded-xl bg-[#1c1b20] border border-white/[0.06] p-4 overflow-hidden transition-all duration-200"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#2b292f] border border-white/10 flex items-center justify-center text-[#f2ca50]">
                      <span className="material-symbols-outlined text-[18px]">{term.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-title-editorial text-[15px] text-[#e5e1e8] group-hover:text-[#f2ca50] transition-colors font-semibold">
                        {term.term}
                      </h3>
                      <span className="font-label-caps text-[10px] text-[#99907c] uppercase">
                        {term.category}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#99907c] group-open:rotate-180 transition-transform duration-200 text-[20px]">
                    expand_more
                  </span>
                </summary>
                <div className="mt-3 pt-3 border-t border-white/5 font-body-sm text-[12.5px] text-[#d0c5af] leading-relaxed">
                  {term.definition}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Floating Contextual Audio Guide Badge */}
        <div className="my-6 flex justify-center">
          <button
            onClick={() =>
              toggleAudioPlayback(
                'Le regard analytique',
                'Dr. Hélène de Saint-Germain'
              )
            }
            className="flex items-center gap-2.5 py-2.5 px-4 rounded-full bg-[#2b292f] border border-[#f2ca50]/40 text-[#e5e1e8] gilded-glow hover:border-[#f2ca50] active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#f2ca50] text-[#3c2f00]">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                headphones
              </span>
            </span>
            <div className="flex flex-col text-left">
              <span className="font-label-caps text-[9.5px] text-[#f2ca50] uppercase font-bold tracking-wider">
                Audio Guide
              </span>
              <span className="font-body-sm text-[12px] text-[#e5e1e8] leading-tight">
                Le regard analytique
              </span>
            </div>
            <span className="material-symbols-outlined text-[#99907c] text-[18px]">graphic_eq</span>
          </button>
        </div>

        {/* Curatorial Footer */}
        <section className="mt-4 mb-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0e0e12] border border-[#4d4635]/20">
            <span className="material-symbols-outlined text-[#f2ca50] text-[14px]">verified</span>
            <span className="font-label-caps text-[10px] text-[#d0c5af] uppercase">
              Contenu vérifié • Conservation des Musées Nationaux
            </span>
          </div>
          <p className="font-body-sm text-[11px] text-[#99907c]/70 mt-2">
            Regard Éditions d'Art • Système d'Apprentissage Autonome v2.4
          </p>
        </section>
      </main>
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TopAppBar } from '../components/TopAppBar.tsx';

export const PathDetailScreen: React.FC = () => {
  const {
    activeLearningPath,
    completedSteps,
    openArtwork,
    openGigapixel,
    openQuiz,
    toggleAudioPlayback,
  } = useApp();

  return (
    <div className="min-h-screen bg-[#141318] text-[#e5e1e8] pb-28">
      {/* Top App Bar */}
      <TopAppBar
        title="Parcours Thématique"
        subtitle="Regard Muséum"
        showBack={true}
        showSearch={false}
        showBookmark={true}
        showShare={true}
      />

      <main className="max-w-2xl mx-auto px-4 sm:px-5 pt-16 space-y-6">
        {/* 1. HERO ÉDITORIAL DU CYCLE PÉDAGOGIQUE */}
        <section className="space-y-4 pt-2">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label-caps text-[10px] text-[#f2ca50] bg-[#f2ca50]/10 border border-[#f2ca50]/25 px-2.5 py-1 rounded font-semibold">
              CYCLE PÉDAGOGIQUE • HISTOIRE DE L'ART
            </span>
            <span className="inline-flex items-center gap-1 font-label-caps text-[10px] text-[#d0c5af] bg-[#2b292f] border border-white/5 px-2.5 py-1 rounded">
              <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">cloud_off</span>
              100% Hors-ligne
            </span>
            <span className="font-label-caps text-[10px] text-[#ffb59f] bg-[#79341f]/40 border border-[#ffb59f]/20 px-2.5 py-1 rounded">
              Niveau Intermédiaire
            </span>
          </div>

          <h1 className="font-display-hero-mobile text-[32px] sm:text-[38px] text-[#e5e1e8] font-semibold tracking-tight">
            {activeLearningPath.title}
          </h1>

          <p className="font-title-editorial text-[15px] sm:text-[16px] italic text-[#d0c5af] leading-relaxed border-l-2 border-[#d4af37] pl-3.5">
            {activeLearningPath.curatorQuote}
          </p>

          {/* Metrics 4-up */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-[#1c1b20] border border-white/5 p-3 rounded flex flex-col justify-between">
              <span className="font-label-caps text-[10px] text-[#99907c] uppercase">Corpus</span>
              <span className="font-headline-sm text-[20px] text-[#e5e1e8] font-semibold mt-1">
                {activeLearningPath.artworkCount} toiles
              </span>
              <span className="font-body-sm text-[11px] text-[#d0c5af]">Chefs-d'œuvre</span>
            </div>
            <div className="bg-[#1c1b20] border border-white/5 p-3 rounded flex flex-col justify-between">
              <span className="font-label-caps text-[10px] text-[#99907c] uppercase">Durée estimée</span>
              <span className="font-headline-sm text-[20px] text-[#e5e1e8] font-semibold mt-1">
                ~{activeLearningPath.estimatedDuration}
              </span>
              <span className="font-body-sm text-[11px] text-[#d0c5af]">Rythme contemplatif</span>
            </div>
            <div className="bg-[#1c1b20] border border-white/5 p-3 rounded flex flex-col justify-between">
              <span className="font-label-caps text-[10px] text-[#99907c] uppercase">Analyse</span>
              <span className="font-headline-sm text-[20px] text-[#e5e1e8] font-semibold mt-1">
                5 notices
              </span>
              <span className="font-body-sm text-[11px] text-[#d0c5af]">Traités &amp; pigments</span>
            </div>
            <div className="bg-[#1c1b20] border border-white/5 p-3 rounded flex flex-col justify-between">
              <span className="font-label-caps text-[10px] text-[#99907c] uppercase">Évaluation</span>
              <span className="font-headline-sm text-[20px] text-[#f2ca50] font-semibold mt-1">
                Quiz final
              </span>
              <span className="font-body-sm text-[11px] text-[#d0c5af]">Badge conservateur</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <div className="w-7 h-7 rounded-full bg-[#2b292f] border border-white/10 flex items-center justify-center text-[#f2ca50] shrink-0">
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </div>
            <p className="font-body-sm text-[12px] text-[#d0c5af]">
              Commissariat scientifique :{' '}
              <span className="text-[#e5e1e8] font-medium">{activeLearningPath.curatorName}</span>
            </p>
          </div>
        </section>

        {/* 2. BARRE DE PROGRESSION & CARTE CTA D'ÉTAPE ACTIVE */}
        <section className="space-y-4">
          <div className="bg-[#1c1b20] border border-white/5 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">timelapse</span>
                <span className="font-label-md text-[13px] text-[#e5e1e8] font-medium">
                  Votre avancement dans le cycle
                </span>
              </div>
              <span className="font-label-caps text-[11px] text-[#f2ca50] font-bold">
                Étape 4 sur 8 (50%)
              </span>
            </div>
            {/* Jauge dorée */}
            <div className="relative w-full bg-[#201f24] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#e9c349] via-[#f2ca50] to-[#d4af37] h-full rounded-full transition-all duration-500"
                style={{ width: '50%' }}
              />
            </div>
            {/* Repères sous jauge */}
            <div className="flex justify-between items-center text-[9.5px] text-[#99907c] font-body-sm">
              <span className="text-[#f2ca50]">1. Monet</span>
              <span className="text-[#f2ca50]">2. Van Gogh</span>
              <span className="text-[#f2ca50]">3. Seurat</span>
              <span className="text-[#f2ca50] font-bold">4. Cézanne (en cours)</span>
              <span>5. Matisse</span>
              <span>6. Kandinsky</span>
              <span>7. Rothko</span>
              <span>8. Quiz</span>
            </div>
          </div>

          {/* Action prioritaire immédiate */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#201f24] via-[#2b292f] to-[#1c1b20] border border-[#f2ca50]/35 gilded-glow rounded-xl p-4 sm:p-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-ping" />
                <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase font-semibold">
                  Étape en cours d'étude
                </span>
                <span className="text-[#99907c] text-xs">•</span>
                <span className="font-body-sm text-[11.5px] text-[#d0c5af] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">schedule</span> 8 min restantes
                </span>
              </div>

              <h2 className="font-headline-sm text-[18px] text-[#e5e1e8] font-semibold">
                Paul Cézanne —{' '}
                <span className="italic font-display-hero-mobile text-[#f2ca50]">
                  La Montagne Sainte-Victoire
                </span>{' '}
                (1904)
              </h2>

              <p className="font-body-md text-[13px] text-[#d0c5af] leading-relaxed">
                Focus sur la modulation par facettes chromatiques : comment le peintre substitue le modelé de la lumière par des touches modulées de vert céladon, ocre jaune et bleu outremer.
              </p>

              <button
                onClick={() => openGigapixel('cezanne-sainte-victoire')}
                className="inline-flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#f2ca50] text-[#3c2f00] font-label-md text-[13px] font-bold px-5 py-2.5 rounded-lg active:scale-95 transition-all shadow-md cursor-pointer mt-2"
              >
                <span>Continuer l'analyse</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3. LE CHEMINEMENT PICTURAL (8 Étapes Synchronisées) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#4d4635]/20 pb-2">
            <h2 className="font-headline-sm text-[19px] text-[#e5e1e8] font-semibold">
              Le Cheminement Pictural
            </h2>
            <span className="font-label-caps text-[10px] text-[#99907c]">8 ÉTAPES SYNCHRONISÉES</span>
          </div>

          <div className="space-y-3">
            {/* Étape 1 : Claude Monet */}
            <article
              onClick={() => openArtwork('impression-sunrise')}
              className="bg-[#1c1b20] border border-white/5 rounded-lg p-3.5 flex items-start gap-3.5 hover:border-[#f2ca50]/30 transition-all cursor-pointer"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded shrink-0 overflow-hidden bg-[#0e0e12] border border-white/5">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoNZAjrlchweiCJmdJVlom8Ot-A5uyWPz_M-BfFrVP6c-ynQN5gWnl3dWESF4U_jmKEJ3a7PnLap2-YDfsn99QASCuL8hj5Ah_207CHxeAemm8lHK-4PbSsqRzd9B5VpumEuzpIX638SlwUauSBr476YXmN8xIVJlAgZb7z2AIlmrat8r5Pp5Wd-M_pU79GHon3hb47wH7d8ivxJEcs1FszYaEfJEO3H8VK9znkGQQi7tpL3fklw"
                  alt="Claude Monet"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-caps text-[10px] text-[#99907c]">ÉTAPE 1 • 1872</span>
                  <span className="inline-flex items-center gap-1 font-label-caps text-[10px] text-[#f2ca50] bg-[#f2ca50]/10 border border-[#f2ca50]/20 px-1.5 py-0.5 rounded font-semibold">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>{' '}
                    Validé
                  </span>
                </div>
                <h3 className="font-title-editorial text-[15px] text-[#e5e1e8] font-semibold truncate">
                  Claude Monet — <span className="italic">Impression, soleil levant</span>
                </h3>
                <p className="font-body-sm text-[12px] text-[#d0c5af] line-clamp-1">
                  La vibration rétinienne, la touche non mélangée et la captation de l'air en plein air.
                </p>
              </div>
            </article>

            {/* Étape 2 : Vincent van Gogh */}
            <article
              onClick={() => openArtwork('starry-night')}
              className="bg-[#1c1b20] border border-white/5 rounded-lg p-3.5 flex items-start gap-3.5 hover:border-[#f2ca50]/30 transition-all cursor-pointer"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded shrink-0 overflow-hidden bg-[#0e0e12] border border-white/5">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUVg4LgGrUWDD3QOha7nBBoc6FVbY_HmFp7RgAc4kMcmaR6EFNzErfmx82oZHQ46AGIagxqHar67e8S24p0f47BDaE_3FbgjcSpRRJrqBwnKsX3Q_Kc020T58S1X3bLtX1MvQFdFLDmKleZ-vdJk8yPqgMmZh5M7TaNnEhiGZD8vKiV6LCi37E2Wc-IpAImDitEIKQNZEq2jUO96_YA2sE-SU7bWloylzme5LCK8VdzgtK_Op-FQ"
                  alt="Vincent van Gogh"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-caps text-[10px] text-[#99907c]">ÉTAPE 2 • 1889</span>
                  <span className="inline-flex items-center gap-1 font-label-caps text-[10px] text-[#f2ca50] bg-[#f2ca50]/10 border border-[#f2ca50]/20 px-1.5 py-0.5 rounded font-semibold">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>{' '}
                    Validé
                  </span>
                </div>
                <h3 className="font-title-editorial text-[15px] text-[#e5e1e8] font-semibold truncate">
                  Vincent van Gogh — <span className="italic">La Nuit étoilée</span>
                </h3>
                <p className="font-body-sm text-[12px] text-[#d0c5af] line-clamp-1">
                  La couleur expressive et psychologique, transcendant la simple observation mimétique.
                </p>
              </div>
            </article>

            {/* Étape 3 : Georges Seurat */}
            <article className="bg-[#1c1b20] border border-white/5 rounded-lg p-3.5 flex items-start gap-3.5 hover:border-[#f2ca50]/30 transition-all cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded shrink-0 overflow-hidden bg-[#0e0e12] border border-white/5">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlyHtl2Mp0mA47GApP4Rp0GDHRikTbqUfMGRcfxX1AoMduUMB8l0EmC0qFJqIXzIPBsc-FxZ8T_gJS0B_KFPs04SOOdZwdVBjz0QvQiCvgz2-5oHJ1zWirQbnVXh630A_9tHh1Jj4EhJqNP54jpsluCjgXCPM0DyrSB-fABeMNeryfjWitBR_H5iHSPqV9C9a9UcFPnbqfLohX_EdY2rBUTjZzj2W81dD1P57CYyKMBq4p8iH1Xg"
                  alt="Georges Seurat"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-caps text-[10px] text-[#99907c]">ÉTAPE 3 • 1886</span>
                  <span className="inline-flex items-center gap-1 font-label-caps text-[10px] text-[#f2ca50] bg-[#f2ca50]/10 border border-[#f2ca50]/20 px-1.5 py-0.5 rounded font-semibold">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>{' '}
                    Validé
                  </span>
                </div>
                <h3 className="font-title-editorial text-[15px] text-[#e5e1e8] font-semibold truncate">
                  Georges Seurat — <span className="italic">Un dimanche à la Grande Jatte</span>
                </h3>
                <p className="font-body-sm text-[12px] text-[#d0c5af] line-clamp-1">
                  Le divisionnisme scientifique et le mélange optique des pigments purs dans l'œil.
                </p>
              </div>
            </article>

            {/* ÉTAPE 4 : FOCUS ACTUEL / EN COURS (Grande Carte Bento Structurée) */}
            <article className="relative bg-[#1c1b20] border border-[#f2ca50]/40 gilded-glow rounded-xl p-4 sm:p-5 space-y-4 my-2">
              <div className="flex items-center justify-between border-b border-[#4d4635]/30 pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">
                    radio_button_checked
                  </span>
                  <span className="font-label-caps text-[10.5px] text-[#f2ca50] uppercase font-bold tracking-widest">
                    Étape 4 en cours • Station active
                  </span>
                </div>
                <span className="font-label-caps text-[10px] text-[#f2ca50] bg-[#f2ca50]/15 border border-[#f2ca50]/30 px-2 py-0.5 rounded font-semibold">
                  Temps estimé : 8 min
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-label-caps text-[10px] text-[#ffb59f] uppercase font-semibold">
                  Post-Impressionnisme Provençal • Aix-en-Provence
                </span>
                <h3 className="font-headline-md text-[20px] text-[#e5e1e8] font-semibold">
                  Paul Cézanne —{' '}
                  <span className="italic font-display-hero text-[#f2ca50]">
                    La Montagne Sainte-Victoire
                  </span>{' '}
                  (1904)
                </h3>
                <p className="font-title-editorial text-[14px] text-[#d0c5af] italic">
                  Thèse curatoriale : « Quand la couleur est à sa richesse, la forme est à sa plénitude. »
                </p>
              </div>

              {/* Toile avec points d'inspection */}
              <div
                onClick={() => openGigapixel('cezanne-sainte-victoire')}
                className="relative bg-[#0e0e12] rounded-lg overflow-hidden border border-white/5 cursor-pointer group"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQdL48gnDfZeKXScaSYgIuj9qLIMx116iu_AUu8Q9qMnQZw9T4Bj036hNHrUNORvw9ZAYUti-e8Y_q_MS2_hn9nqNdmPAtZziyEbtsS26hACzXBU3xrVPSr9Lb_K8csGFBuhRUT8seBjIYjtfIgd1-WJf-zTN2kIxA4sDJwwvhfNoLWqnNEEd7WcRYUsdbNtVGxBAs29eQhDdKz3AfgXIQ_Wcrq2gqexxnei8sdmKwLF_5aDqliQ"
                  alt="Paul Cézanne Montagne Sainte-Victoire"
                  className="w-full h-56 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Hotspot 1 */}
                <div className="absolute top-[28%] left-[58%] group/pin cursor-pointer">
                  <span className="absolute -inset-2 rounded-full bg-[#f2ca50]/20 animate-ping" />
                  <div className="relative w-6 h-6 rounded-full border border-[#f2ca50]/70 bg-[#0e0e12]/80 backdrop-blur-sm flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#f2ca50]" />
                  </div>
                </div>
                {/* Hotspot 2 */}
                <div className="absolute bottom-[24%] left-[32%] group/pin cursor-pointer">
                  <div className="relative w-6 h-6 rounded-full border border-[#f2ca50]/70 bg-[#0e0e12]/80 backdrop-blur-sm flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#f2ca50]" />
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 bg-[#0e0e12]/85 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-[#d0c5af] font-label-caps border border-white/10 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[13px] text-[#f2ca50]">zoom_in</span>
                  2 points d'analyse tactile
                </div>
              </div>

              {/* Les 3 clés d'observation */}
              <div className="bg-[#201f24] border border-white/5 p-3.5 rounded-lg space-y-2">
                <h4 className="font-label-caps text-[10.5px] text-[#99907c] uppercase flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[15px] text-[#f2ca50]">visibility</span>
                  3 clés d'observation pour valider cette étape
                </h4>
                <ul className="space-y-1.5 text-[#d0c5af] font-body-sm text-[12px] pl-1">
                  <li className="flex items-start gap-2">
                    <span className="text-[#f2ca50] font-bold">1.</span>
                    <span>
                      <strong>La modulation remplace le modelé :</strong> Cézanne n'utilise plus de noir ni d'ombres portées ; le relief naît de la juxtaposition de tons chauds et froids.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f2ca50] font-bold">2.</span>
                    <span>
                      <strong>La touche architecturale :</strong> Chaque coup de pinceau est un pavé de couleur orthogonal qui construit l'espace comme une maçonnerie.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f2ca50] font-bold">3.</span>
                    <span>
                      <strong>L'écho du bleu :</strong> Le bleu du ciel descend se mêler aux toits de tuiles et à la végétation, créant l'unité plane de la toile.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() =>
                    toggleAudioPlayback(
                      'Paul Cézanne et la Montagne',
                      'Dr. Hélène de Saint-Germain'
                    )
                  }
                  className="inline-flex items-center gap-2 text-[#d0c5af] hover:text-[#e5e1e8] text-[12.5px] font-label-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">headphones</span>
                  Guide audio (4:12)
                </button>
                <button
                  onClick={() => openGigapixel('cezanne-sainte-victoire')}
                  className="inline-flex items-center gap-2 bg-[#d4af37] hover:bg-[#f2ca50] text-[#3c2f00] font-label-md text-[13px] font-bold px-4 py-2 rounded active:scale-95 transition-all shadow cursor-pointer"
                >
                  <span>Lancer l'inspection HD</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_full</span>
                </button>
              </div>
            </article>

            {/* Étape 5 : Henri Matisse */}
            <article className="bg-[#1c1b20]/60 border border-white/5 rounded-lg p-3.5 flex items-start gap-3.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded shrink-0 overflow-hidden bg-[#0e0e12] relative border border-white/5">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVrkZcVDN86mKmyBrDAgc4hz9gxf8N_3Or2zmJnJ20QxTzrZR801OpYHgdPanA2IAkyWu1Kc5b0QoXtCl5W2RGOvbzU-qPDg2_UCRRYOh846SSZbbQ2xzfg10QYdYeuZUG-ZWKJzgFiUOEYhc9lEFPYCXOJweGeZxoWW85u_Su3ZQTekGPJ2_oW1f-IagBpYkBYrZrinr_4Ca3a6V4Stjdd59SYR1VwlUmTOfN3qf7PVf7JBOfdQ"
                  alt="Henri Matisse"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0e0e12]/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#99907c] text-[18px]">lock</span>
                </div>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-caps text-[10px] text-[#99907c]">ÉTAPE 5 • 1910</span>
                  <span className="font-label-caps text-[10px] text-[#99907c]">À Débloquer</span>
                </div>
                <h3 className="font-title-editorial text-[15px] text-[#e5e1e8] font-semibold truncate">
                  Henri Matisse — <span className="italic">La Danse</span>
                </h3>
                <p className="font-body-sm text-[12px] text-[#d0c5af] line-clamp-1">
                  L'aplat pur, l'intensité sauvage du fauvisme et l'autonomie rythmique.
                </p>
              </div>
              <span className="material-symbols-outlined text-[#99907c] self-center text-[18px]">
                chevron_right
              </span>
            </article>

            {/* Étape 6 : Vassily Kandinsky */}
            <article className="bg-[#1c1b20]/60 border border-white/5 rounded-lg p-3.5 flex items-start gap-3.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded shrink-0 overflow-hidden bg-[#0e0e12] relative border border-white/5">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAi_WTv8AhUVjhdi4GbZWSnULtrA4hqTtL_o4K5vvA0S-_KYrOx8O7FvVJyDh6voZxJG7ULhzemkf8FOq4LV11KFYbcE7Rd0bB3kYh_lNQv1CwfW1e1cjR0O50emLKS1tHEDwgf7XLVUpA4PANDSyYhGu-qtMaFaH-DGDtHFmld9CHQXV29CHJ7s5f8bByXR8LWtQ2aHcm5KgwEjcJK8httBpMXZF3Co2Pf630eA8JNT5gvvFtEYg"
                  alt="Vassily Kandinsky"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0e0e12]/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#99907c] text-[18px]">lock</span>
                </div>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-caps text-[10px] text-[#99907c]">ÉTAPE 6 • 1913</span>
                  <span className="font-label-caps text-[10px] text-[#99907c]">À Débloquer</span>
                </div>
                <h3 className="font-title-editorial text-[15px] text-[#e5e1e8] font-semibold truncate">
                  Vassily Kandinsky — <span className="italic">Composition VII</span>
                </h3>
                <p className="font-body-sm text-[12px] text-[#d0c5af] line-clamp-1">
                  La synesthésie, la résonance intérieure et la spiritualité de la couleur pure.
                </p>
              </div>
              <span className="material-symbols-outlined text-[#99907c] self-center text-[18px]">
                chevron_right
              </span>
            </article>

            {/* Étape 7 : Mark Rothko */}
            <article className="bg-[#1c1b20]/60 border border-white/5 rounded-lg p-3.5 flex items-start gap-3.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded shrink-0 overflow-hidden bg-[#0e0e12] relative border border-white/5">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0fcU8l2uu-fH6RHH9V8GP4wMgjph8Wr7A4r1SzluUTXUOBFNxnC2Uu11l38ZV8opngiJ78FmObLNxeqrIFy4qYb4Xv3JJVHNnNUzHgH9Xd7FvQCiVq_fPihMHZIwH96dIN9Mav8pwcoCy3y2VfK39iuX2PUPXxLO1KWJ8yCEcW8Mz8V_0vZFNSeG-sOJq9TqmKbre5-PIri_VZYIO1JLE9yXhLCf-aJCgkA-szyZBpB-aA-azog"
                  alt="Mark Rothko"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0e0e12]/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#99907c] text-[18px]">lock</span>
                </div>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-caps text-[10px] text-[#99907c]">ÉTAPE 7 • 1953</span>
                  <span className="font-label-caps text-[10px] text-[#99907c]">À Débloquer</span>
                </div>
                <h3 className="font-title-editorial text-[15px] text-[#e5e1e8] font-semibold truncate">
                  Mark Rothko — <span className="italic">No. 61 (Rust and Blue)</span>
                </h3>
                <p className="font-body-sm text-[12px] text-[#d0c5af] line-clamp-1">
                  Le champ chromatique méditatif (Color Field) et la dissolution du sujet.
                </p>
              </div>
              <span className="material-symbols-outlined text-[#99907c] self-center text-[18px]">
                chevron_right
              </span>
            </article>

            {/* Étape 8 : SYNTHÈSE DU CYCLE (Quiz final) -> CLICK OPENS QUIZ! */}
            <article
              onClick={openQuiz}
              className="bg-[#2b292f] border border-[#f2ca50]/40 gilded-glow rounded-xl p-4 flex items-start gap-3.5 relative overflow-hidden cursor-pointer hover:brightness-105 transition-all"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded shrink-0 bg-[#36343a] border border-[#f2ca50]/40 flex flex-col items-center justify-center text-[#f2ca50]">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  workspace_premium
                </span>
                <span className="font-label-caps text-[9px] uppercase tracking-wider mt-0.5 font-bold">
                  Quiz final
                </span>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-caps text-[10.5px] text-[#f2ca50] font-bold">
                    SYNTHÈSE DU CYCLE
                  </span>
                  <span className="font-label-caps text-[10px] text-[#d0c5af] bg-[#f2ca50]/15 px-2 py-0.5 rounded border border-[#f2ca50]/30 font-semibold">
                    Lancer l'évaluation →
                  </span>
                </div>
                <h3 className="font-title-editorial text-[16px] text-[#e5e1e8] font-semibold truncate">
                  Le Regard du Coloriste
                </h3>
                <p className="font-body-sm text-[12px] text-[#d0c5af]">
                  Tableau comparatif interactif et 5 questions d'observation fine pour débloquer le badge muséal « Maître de la Couleur ».
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* 4. BLOC DE NOTIONS TECHNIQUES */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-[#4d4635]/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">menu_book</span>
              <h2 className="font-headline-sm text-[19px] text-[#e5e1e8] font-semibold">
                Notions Techniques du Cycle
              </h2>
            </div>
            <span className="font-label-caps text-[10px] text-[#99907c]">3 FICHES PÉDAGOGIQUES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeLearningPath.notions?.map((notion) => (
              <div
                key={notion.title}
                className="bg-[#1c1b20] border border-white/5 p-4 rounded-xl space-y-2 hover:border-[#f2ca50]/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase font-semibold">
                    {notion.category}
                  </span>
                  <span className="material-symbols-outlined text-[#99907c] text-[16px]">palette</span>
                </div>
                <h3 className="font-title-editorial text-[15px] text-[#e5e1e8] font-semibold">
                  {notion.title}
                </h3>
                <p className="font-body-sm text-[12px] text-[#d0c5af] leading-relaxed">
                  {notion.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Rassurance Locale */}
        <section className="border-t border-[#4d4635]/20 pt-4 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2 text-[#d0c5af] text-body-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f2ca50] text-[16px]">database</span>
              <span className="font-body-sm text-[11.5px]">
                Progression stockée dans{' '}
                <code className="bg-[#2b292f] px-1.5 py-0.5 rounded text-[#f2ca50] font-mono text-[11px]">
                  IndexedDB: user_progress
                </code>{' '}
                (0 octet consommé sur le réseau).
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] font-label-caps text-[#99907c]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]" />
              BASE SYNCHRONISÉE
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';

export const OnboardingModal: React.FC = () => {
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    acceptLegalNoticeAndCompleteOnboarding,
    hasAcceptedLegalNotice,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [legalChecked, setLegalChecked] = useState<boolean>(hasAcceptedLegalNotice);

  if (!isOnboardingOpen) return null;

  const totalSteps = 3;

  const handleFinish = () => {
    if (!legalChecked) return;
    acceptLegalNoticeAndCompleteOnboarding();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-[#1c1b20] border border-[#f2ca50]/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with step indicator */}
        <div className="px-6 pt-5 pb-4 border-b border-white/[0.08] bg-[#201f24] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2ca50] text-[24px]">museum</span>
            <span className="font-headline-sm text-[17px] text-[#f2ca50] font-bold">
              Bienvenue dans Regard
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === currentStep
                    ? 'w-6 bg-[#f2ca50]'
                    : step < currentStep
                    ? 'w-2 bg-[#f2ca50]/50'
                    : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scroll">
          {/* STEP 0: Introduction */}
          {currentStep === 0 && (
            <div className="space-y-4 animate-fade-in text-center sm:text-left">
              <div className="w-16 h-16 mx-auto sm:mx-0 rounded-2xl bg-[#2b292f] border border-[#f2ca50]/30 flex items-center justify-center text-[#f2ca50] shadow-md">
                <span className="material-symbols-outlined text-[36px]">palette</span>
              </div>
              <h3 id="onboarding-title" className="font-headline-lg text-[22px] sm:text-[24px] text-[#e5e1e8]">
                L'Art de la Peinture, en silence et en haute fidélité
              </h3>
              <p className="text-[14px] text-[#d0c5af] leading-relaxed">
                <strong>Regard</strong> est un musée de poche autonome pensé pour les passionnés et
                les curieux. Découvrez les chefs-d'œuvre de la peinture mondiale dans des
                conditions de recueillement et de précision scientifique incomparables.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-left">
                <div className="p-3 rounded-xl bg-[#141318] border border-white/[0.06]">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[20px] mb-1">
                    offline_bolt
                  </span>
                  <div className="text-[12px] font-bold text-[#e5e1e8]">100% Autonome</div>
                  <div className="text-[11px] text-[#99907c]">Fonctionne sans connexion ni trackers</div>
                </div>
                <div className="p-3 rounded-xl bg-[#141318] border border-white/[0.06]">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[20px] mb-1">
                    zoom_in
                  </span>
                  <div className="text-[12px] font-bold text-[#e5e1e8]">Macrophotographie</div>
                  <div className="text-[11px] text-[#99907c]">Inspecteur Gigapixel & Nombre d'Or</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Features & Navigation */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#2b292f] border border-[#f2ca50]/30 flex items-center justify-center text-[#f2ca50] shrink-0">
                  <span className="material-symbols-outlined text-[26px]">menu_book</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-[18px] text-[#e5e1e8]">
                    Explorez par catégories & savourez l'histoire
                  </h3>
                  <p className="text-[12px] text-[#99907c]">Des outils curatorials complets à portée de main</p>
                </div>
              </div>

              <div className="space-y-2.5 text-[13px] text-[#d0c5af]">
                <div className="p-3 rounded-xl bg-[#141318] border border-white/[0.06] flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">menu</span>
                  <div>
                    <strong className="text-[#e5e1e8]">Menu Hamburger :</strong> Accédez instantanément
                    aux fonctionnalités classées par catégories (Galerie, Étude, Mon Espace, Système).
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#141318] border border-white/[0.06] flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">school</span>
                  <div>
                    <strong className="text-[#e5e1e8]">Parcours & Quiz :</strong> Suivez les cycles
                    chronologiques (« Les Maîtres de la Couleur ») et testez votre regard curatorial.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#141318] border border-white/[0.06] flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">sync</span>
                  <div>
                    <strong className="text-[#e5e1e8]">Mises à jour automatiques :</strong> L'application
                    vérifie régulièrement et s'actualise en arrière-plan en toute transparence.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Mentions Légales & Non-responsabilité */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#79341f]/30 border border-[#f2ca50]/40 flex items-center justify-center text-[#f2ca50] shrink-0">
                  <span className="material-symbols-outlined text-[26px]">gavel</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-[18px] text-[#f2ca50] font-bold">
                    Mentions Légales & Avertissement
                  </h3>
                  <p className="text-[11px] text-[#99907c] font-label-caps uppercase">
                    Clause de non-responsabilité obligatoire
                  </p>
                </div>
              </div>

              {/* Legal Box */}
              <div className="p-4 rounded-xl bg-[#141318] border border-white/[0.08] text-[12px] text-[#d0c5af] space-y-3 leading-relaxed max-h-56 overflow-y-auto custom-scroll">
                <p className="font-semibold text-[#e5e1e8]">
                  Clause d'exonération de responsabilité relative aux données fournies :
                </p>
                <p>
                  <strong>1. Nature culturelle et informative :</strong> Les informations, cartels,
                  attributions d'œuvres, dates historiques, analyses techniques, pigments, notices
                  biographiques et reproductions d'œuvres d'art présentés dans cette application sont
                  fournis à titre strictement indicatif, informatif et pédagogique.
                </p>
                <p>
                  <strong>2. Absence d'engagement et de garantie :</strong> L'éditeur et développeur
                  de l'application décline expressément toute responsabilité quant à l'exactitude,
                  l'exhaustivité, la véracité, l'authenticité, la mise à jour ou la conformité des
                  données fournies dans l'application. Aucune décision juridique, d'authentification
                  ou d'expertise marchande ne saurait se fonder sur les contenus de l'application.
                </p>
                <p>
                  <strong>3. Propriété intellectuelle et domaine public :</strong> Les reproductions
                  d'œuvres picturales intégrées relèvent du domaine public universel. Les fiches
                  d'analyse constituent une proposition curatoriale personnelle.
                </p>
                <p>
                  <strong>4. Responsabilité de l'utilisateur :</strong> L'utilisateur reconnaît et
                  accepte qu'il utilise l'application et ses données sous sa seule et entière
                  responsabilité.
                </p>
              </div>

              {/* Checkbox acceptation */}
              <label className="flex items-start gap-3 p-3 rounded-xl bg-[#201f24] border border-[#f2ca50]/40 cursor-pointer hover:bg-[#2b292f] transition-colors">
                <input
                  type="checkbox"
                  checked={legalChecked}
                  onChange={(e) => setLegalChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#f2ca50] focus:ring-[#f2ca50] accent-[#f2ca50] cursor-pointer"
                />
                <span className="text-[12px] text-[#e5e1e8] leading-tight">
                  <strong>J'ai lu et j'accepte les mentions légales.</strong> Je reconnais
                  expressément que l'éditeur et le développeur ne sont pas responsables des données
                  fournies dans l'application.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#201f24] flex items-center justify-between">
          {currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl text-[#d0c5af] hover:text-[#f2ca50] font-label-caps text-[11px] tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Précédent</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#141318] font-bold font-label-caps text-[11px] tracking-wider uppercase transition-all shadow-md flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span>Continuer</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!legalChecked}
              className={`px-5 py-2.5 rounded-xl font-bold font-label-caps text-[11px] tracking-wider uppercase transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                legalChecked
                  ? 'bg-[#f2ca50] hover:bg-[#ffe088] text-[#141318]'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Entrer dans le Musée</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

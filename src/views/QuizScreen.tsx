import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { COLORIST_QUIZ } from '../data/learningExtras.ts';

export const QuizScreen: React.FC = () => {
  const { goBack, addPoints } = useApp();

  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState<boolean>(false);
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [isLoupeZoomed, setIsLoupeZoomed] = useState<boolean>(false);

  const currentQ = COLORIST_QUIZ[questionIndex] || COLORIST_QUIZ[0];

  const handleSelect = (optionId: string) => {
    if (!isAnswerConfirmed) {
      setSelectedOption(optionId);
    }
  };

  const handleConfirmAnswer = () => {
    if (isAnswerConfirmed) {
      // Go to next question or complete
      if (questionIndex < COLORIST_QUIZ.length - 1) {
        setQuestionIndex(questionIndex + 1);
        setSelectedOption(null);
        setIsAnswerConfirmed(false);
        setShowHint(false);
      } else {
        setIsQuizCompleted(true);
        addPoints(scoreCount * 25);
      }
    } else {
      if (!selectedOption) return;
      const selected = currentQ.options.find((o) => o.id === selectedOption);
      if (selected?.isCorrect) {
        setScoreCount((prev) => prev + 1);
      }
      setIsAnswerConfirmed(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerConfirmed(false);
    setShowHint(false);
    setScoreCount(0);
    setIsQuizCompleted(false);
  };

  return (
    <div className="min-h-screen bg-[#0e0e12] text-[#e5e1e8] antialiased flex justify-center pb-12">
      <main className="w-full max-w-[460px] min-h-screen bg-[#0e0e12] flex flex-col relative">
        {/* Header (Assessment View) */}
        <header className="sticky top-0 z-40 bg-[#0e0e12]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-[#4d4635]/15 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 text-[#d0c5af] hover:text-[#f2ca50] transition-colors font-label-md text-[13px] group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
                arrow_back
              </span>
              <span>Quitter l'évaluation</span>
            </button>
            <div className="flex items-center gap-1.5 text-[#99907c] text-[11px] font-body-sm bg-[#1c1b20] px-2 py-0.5 rounded border border-white/5">
              <span className="material-symbols-outlined text-[14px] text-[#f2ca50]">hourglass_top</span>
              <span>Temps libre</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-0.5">
            <span className="font-label-caps text-[10px] text-[#f2ca50] tracking-widest uppercase font-semibold">
              ÉTAPE 8 • ÉVALUATION FINALE
            </span>
            <span className="font-label-caps text-[10px] text-[#d0c5af] bg-[#201f24] px-2 py-0.5 rounded border border-white/10 font-medium">
              QUESTION {questionIndex + 1} SUR {COLORIST_QUIZ.length}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <h1 className="font-headline-md text-[21px] text-[#e5e1e8] tracking-tight font-semibold">
              Le Regard du Coloriste
            </h1>
            <div className="inline-flex items-center gap-1 text-[10.5px] font-label-caps text-[#f2ca50] bg-[#f2ca50]/10 border border-[#f2ca50]/25 px-2 py-0.5 rounded whitespace-nowrap font-bold">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                award_star
              </span>
              <span>BADGE CONSERVATEUR</span>
            </div>
          </div>

          {/* 5-Step Progress Bar */}
          <div className="pt-1 pb-0.5">
            <div className="flex items-center justify-between gap-1.5 w-full">
              {COLORIST_QUIZ.map((q, idx) => {
                const isPassed = idx < questionIndex;
                const isCurrent = idx === questionIndex;
                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setQuestionIndex(idx);
                      setIsAnswerConfirmed(false);
                    }}
                    className={`flex-1 h-1.5 rounded-full transition-all cursor-pointer relative ${
                      isPassed
                        ? 'bg-[#d4af37]'
                        : isCurrent
                        ? 'bg-[#f2ca50] gilded-glow-sm'
                        : 'bg-[#36343a]/60'
                    }`}
                    title={`Question ${idx + 1}`}
                  >
                    {isCurrent && (
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#ffe088] rounded-full animate-ping" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        {isQuizCompleted ? (
          /* CONGRATULATIONS SCREEN */
          <div className="px-5 pt-10 text-center space-y-6 flex-1 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#f2ca50]/15 border-2 border-[#f2ca50] flex items-center justify-center text-[#f2ca50] gilded-glow mx-auto">
              <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                workspace_premium
              </span>
            </div>

            <div className="space-y-2">
              <span className="font-label-caps text-[11px] text-[#f2ca50] uppercase tracking-widest font-bold">
                Évaluation Validée
              </span>
              <h2 className="font-headline-lg text-[26px] text-[#e5e1e8] font-bold">
                Félicitations, Conservateur !
              </h2>
              <p className="font-body-md text-[13.5px] text-[#d0c5af] max-w-xs mx-auto leading-relaxed">
                Vous avez obtenu le badge d'honneur « Maître de la Couleur ». Votre acuité esthétique est désormais certifiée par le musée Regard.
              </p>
            </div>

            <div className="p-4 bg-[#1c1b20] rounded-xl border border-[#f2ca50]/30 w-full text-left space-y-2">
              <div className="flex justify-between text-[12px] font-label-caps text-[#e5e1e8]">
                <span>Score obtenu</span>
                <span className="text-[#f2ca50] font-bold">
                  {scoreCount}/{COLORIST_QUIZ.length} ({Math.round((scoreCount / COLORIST_QUIZ.length) * 100)}%)
                </span>
              </div>
              <div className="flex justify-between text-[12px] font-label-caps text-[#e5e1e8]">
                <span>Points d'immersion</span>
                <span className="text-[#f2ca50] font-bold">+{scoreCount * 25} pts</span>
              </div>
              <div className="flex justify-between text-[12px] font-label-caps text-[#e5e1e8]">
                <span>Niveau d'acuité</span>
                <span className="text-[#f2ca50] font-bold">
                  {scoreCount >= 4 ? 'Maître du Regard (Validé)' : 'Initié au Beau'}
                </span>
              </div>
            </div>

            <div className="w-full space-y-2">
              <button
                onClick={handleRestartQuiz}
                className="w-full py-3 px-4 rounded-lg bg-[#201f24] hover:bg-[#2b292f] border border-[#f2ca50]/40 text-[#f2ca50] font-label-md text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                <span>Recommencer l'évaluation</span>
              </button>
              <button
                onClick={goBack}
                className="w-full py-3.5 px-4 rounded-lg bg-[#f2ca50] text-[#3c2f00] font-label-md text-[14px] font-bold shadow-lg hover:bg-[#ffe088] transition-all cursor-pointer"
              >
                Retourner aux cycles
              </button>
            </div>
          </div>
        ) : (
          /* CORE EXAMINATION BODY */
          <div className="px-4 pt-4 flex flex-col gap-4">
            {/* Visual Specimen Card */}
            <section className="bg-[#1c1b20] rounded border border-white/[0.08] overflow-hidden flex flex-col">
              <div className="px-3.5 py-2 bg-[#201f24] flex items-center justify-between border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f2ca50]" />
                  <span className="font-label-caps text-[10px] text-[#d0c5af] font-semibold">
                    {currentQ.corpus}
                  </span>
                </div>
                <span className="font-body-sm text-[11px] text-[#99907c]">{currentQ.period}</span>
              </div>

              {/* Masterwork Macro Frame */}
              <div className="relative bg-[#0e0e12] w-full aspect-[4/3] flex items-center justify-center overflow-hidden group">
                <img
                  src={currentQ.artworkImage}
                  alt={currentQ.artworkTitle}
                  className={`w-full h-full object-cover object-center transition-transform duration-500 ease-out ${
                    isLoupeZoomed ? 'scale-150' : 'group-hover:scale-105'
                  }`}
                />

                {/* Target Focal Reticle */}
                <div className="absolute top-[38%] left-[54%] -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full border border-[#f2ca50]/40 animate-ping" />
                  <span className="w-5 h-5 rounded-full border border-[#f2ca50] bg-[#f2ca50]/20 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]" />
                  </span>
                </div>

                <button
                  onClick={() => setIsLoupeZoomed(!isLoupeZoomed)}
                  type="button"
                  className="absolute bottom-3 right-3 bg-[#2b292f]/90 hover:bg-[#36343a] backdrop-blur-md text-[#e5e1e8] border border-white/10 px-3 py-1.5 rounded text-[11px] font-body-sm flex items-center gap-1.5 gilded-glow transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#f2ca50]">search</span>
                  <span>{isLoupeZoomed ? 'Dézoomer' : 'Zoomer sur la touche'}</span>
                </button>

                <div className="absolute bottom-3 left-3 bg-[#0e0e12]/80 backdrop-blur-sm border border-white/[0.05] px-2 py-0.5 rounded text-[9.5px] font-label-caps text-[#d0c5af]">
                  DÉTAIL MACRO • CONTOUR VIBRATOIRE
                </div>
              </div>

              <div className="px-3.5 py-2.5 bg-[#1c1b20] flex items-center justify-between text-[11.5px] text-[#d0c5af] border-t border-white/[0.04]">
                <span className="italic font-title-editorial text-[#e5e1e8]">
                  Étude comparative sur la tension chromatique
                </span>
                <span className="text-[#99907c] font-label-caps text-[9.5px]">HUILE SUR TOILE</span>
              </div>
            </section>

            {/* Assessment Query */}
            <section className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-label-caps text-[10px] text-[#f2ca50] tracking-wider font-semibold">
                  ÉPREUVE ANALYTIQUE
                </span>
                <span className="text-[#99907c] text-xs">•</span>
                <span className="font-body-sm text-[11.5px] text-[#99907c]">Observation attentive</span>
              </div>
              <h2 className="font-title-editorial text-[16.5px] text-[#e5e1e8] font-semibold leading-snug">
                Question {questionIndex + 1} : {currentQ.question}
              </h2>
            </section>

            {/* Multiple Choice Cards */}
            <section className="flex flex-col gap-2.5">
              {currentQ.options.map((option) => {
                const isSelected = selectedOption === option.id;
                const isCorrect = option.isCorrect;

                let cardStyle = 'bg-[#1c1b20] hover:bg-[#201f24] border-white/[0.07] hover:border-[#4d4635]/40';
                if (isAnswerConfirmed) {
                  if (isCorrect) {
                    cardStyle = 'bg-emerald-950/40 border-2 border-emerald-500 text-emerald-100';
                  } else if (isSelected) {
                    cardStyle = 'bg-rose-950/40 border-2 border-rose-500 text-rose-100';
                  } else {
                    cardStyle = 'bg-[#1c1b20]/50 border-white/[0.04] opacity-50';
                  }
                } else if (isSelected) {
                  cardStyle = 'bg-[#201f24] border-2 border-[#d4af37] gilded-glow';
                }

                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className={`relative rounded p-3.5 flex items-start gap-3 cursor-pointer transition-all active:scale-[0.99] border ${cardStyle}`}
                  >
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isAnswerConfirmed && isCorrect
                          ? 'bg-emerald-500 text-black font-bold'
                          : isAnswerConfirmed && isSelected
                          ? 'bg-rose-500 text-white font-bold'
                          : isSelected
                          ? 'bg-[#d4af37] text-[#3c2f00] font-bold'
                          : 'border border-[#99907c] text-[#99907c]'
                      }`}
                    >
                      {isAnswerConfirmed && isCorrect ? (
                        <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                      ) : isAnswerConfirmed && isSelected ? (
                        <span className="material-symbols-outlined text-[13px] font-bold">close</span>
                      ) : isSelected ? (
                        <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                      ) : (
                        <span className="text-[10px] font-label-caps font-semibold">{option.id}</span>
                      )}
                    </div>

                    <div className="flex-1 pr-1">
                      <p
                        className={`font-body-md text-[13px] leading-relaxed ${
                          isSelected ? 'font-medium text-[#e5e1e8]' : 'text-[#d0c5af]'
                        }`}
                      >
                        {option.text}
                      </p>
                      {isAnswerConfirmed ? (
                        isCorrect ? (
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-label-caps text-emerald-400 font-bold">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            <span>BONNE RÉPONSE ({option.tag})</span>
                          </div>
                        ) : isSelected ? (
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-label-caps text-rose-400 font-bold">
                            <span className="material-symbols-outlined text-[14px]">cancel</span>
                            <span>VOTRE CHOIX ({option.tag})</span>
                          </div>
                        ) : null
                      ) : isSelected ? (
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className="text-[9.5px] font-label-caps text-[#f2ca50] bg-[#f2ca50]/10 border border-[#f2ca50]/20 px-2 py-0.5 rounded font-semibold">
                            SÉLECTION EN COURS
                          </span>
                          <span className="text-[11px] font-body-sm text-[#d0c5af] italic">
                            {option.tag}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Curator Clue Accordion */}
            <section className="bg-[#1c1b20] rounded border border-white/[0.07] p-3.5 flex flex-col gap-2 transition-all">
              <div
                onClick={() => setShowHint(!showHint)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2 text-[#f2ca50]">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    lightbulb
                  </span>
                  <span className="font-label-caps text-[10.5px] tracking-wider text-[#f2ca50] font-semibold">
                    INDICE DU CONSERVATEUR
                  </span>
                </div>
                <span
                  className={`material-symbols-outlined text-[16px] text-[#99907c] transition-transform duration-200 ${
                    showHint ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </div>
              {showHint && (
                <p className="font-body-sm text-[12px] text-[#d0c5af] leading-relaxed pl-6 border-l border-[#f2ca50]/20 mt-1">
                  {currentQ.curatorClue}
                </p>
              )}
            </section>

            {/* Score & Gamification Progression */}
            <section className="bg-[#201f24] rounded border border-white/[0.06] p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#f2ca50]/10 border border-[#f2ca50]/25 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px] text-[#f2ca50]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="font-body-sm text-[12.5px] text-[#e5e1e8] font-medium">
                    Score actuel :{' '}
                    <span className="text-[#f2ca50] font-bold">
                      {scoreCount}/{COLORIST_QUIZ.length} validés
                    </span>
                  </div>
                  <div className="text-[10px] font-label-caps text-[#d0c5af]">
                    +100 PTS POUR LE TITRE « REGARD ÉCLAIRÉ »
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block text-[10px] font-label-caps text-[#ffe088] bg-[#36343a] px-2 py-0.5 rounded border border-white/[0.08] font-semibold">
                  PRÉCISION 100%
                </span>
              </div>
            </section>

            {/* Primary Action Trigger */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={handleConfirmAnswer}
                disabled={!selectedOption && !isAnswerConfirmed}
                className={`w-full py-3.5 px-4 rounded font-label-md text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-150 shadow-md ${
                  !selectedOption && !isAnswerConfirmed
                    ? 'bg-[#36343a] text-[#99907c] cursor-not-allowed border border-white/5 opacity-60'
                    : 'bg-[#d4af37] hover:bg-[#f2ca50] text-[#3c2f00] cursor-pointer gilded-glow active:scale-[0.98]'
                }`}
              >
                <span>
                  {isAnswerConfirmed
                    ? questionIndex < COLORIST_QUIZ.length - 1
                      ? 'Question suivante'
                      : 'Voir mon bilan d\'évaluation'
                    : selectedOption
                    ? 'Confirmer la réponse'
                    : 'Sélectionnez une réponse'}
                </span>
                <span className="material-symbols-outlined text-[18px]">
                  {isAnswerConfirmed ? 'arrow_forward' : selectedOption ? 'check_circle' : 'touch_app'}
                </span>
              </button>

              <div className="pt-1 pb-4 text-center">
                <p className="text-[11px] font-body-sm text-[#99907c] flex items-center justify-center gap-1.5 flex-wrap">
                  <span className="material-symbols-outlined text-[13px]">storage</span>
                  <span>Évaluation calculée localement (Moteur IndexedDB)</span>
                  <span>•</span>
                  <span className="text-[#d0c5af]">Déblocage hors-ligne du badge « Maître de la Couleur »</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

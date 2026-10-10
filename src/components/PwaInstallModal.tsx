import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';

export const PwaInstallModal: React.FC = () => {
  const { isInstallModalOpen, setIsInstallModalOpen, isAppInstalled, installApp } = useApp();
  const [copiedState, setCopiedState] = useState(false);

  if (!isInstallModalOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1c1b20] border border-[#f2ca50]/40 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative">
        {/* Glow ambient */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#f2ca50]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 bg-[#201f24] border-b border-[#4d4635]/25 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-xl border border-[#f2ca50]/50 overflow-hidden bg-[#0e0e12] shrink-0 shadow-lg">
              <img
                src="/src/assets/images/regard_pwa_logo_1791643215759.jpg"
                alt="Logo Regard"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-caps text-[9px] text-[#f2ca50] bg-[#f2ca50]/10 border border-[#f2ca50]/30 px-1.5 py-0.5 rounded font-semibold uppercase">
                  Application PWA
                </span>
                <span className="text-[11px] font-mono text-[#99907c]">v1.0.4 • 100% Hors-ligne</span>
              </div>
              <h2 className="font-headline-md text-[19px] text-[#e5e1e8] font-bold mt-0.5">
                Installer Regard
              </h2>
              <p className="font-body-sm text-[11px] text-[#d0c5af]">
                Accès direct sur téléphone &amp; bureau
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsInstallModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#2b292f] text-[#d0c5af] hover:text-[#f2ca50] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-[#e5e1e8]">
          {isAppInstalled ? (
            <div className="p-3.5 bg-[#201f24] border border-[#f2ca50]/30 rounded-xl text-center space-y-1.5">
              <span className="material-symbols-outlined text-[#f2ca50] text-[28px]">check_circle</span>
              <p className="font-title-editorial text-[15px] font-semibold text-[#f2ca50]">
                Application déjà installée !
              </p>
              <p className="text-[12px] text-[#d0c5af]">
                Regard est configurée en mode autonome (standalone) sur cet appareil.
              </p>
            </div>
          ) : (
            <>
              {/* Primary Native Prompt Action */}
              <button
                onClick={async () => {
                  await installApp();
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#d4af37] hover:bg-[#f2ca50] text-[#3c2f00] font-label-md text-[13.5px] font-bold flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  download
                </span>
                <span>Installer maintenant sur cet appareil</span>
              </button>

              {/* Instructions by Device */}
              <div className="space-y-3 pt-1">
                <h3 className="font-label-caps text-[10.5px] uppercase tracking-wider text-[#99907c] font-semibold">
                  Guide d'installation rapide
                </h3>

                {/* iPhone / iOS */}
                <div className="p-3 bg-[#201f24] rounded-lg border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-[#f2ca50] font-label-caps text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[16px]">phone_iphone</span>
                    <span>Sur iPhone &amp; iPad (Safari)</span>
                  </div>
                  <p className="font-body-sm text-[11.5px] text-[#d0c5af] leading-relaxed">
                    1. Touchez le bouton <strong className="text-[#e5e1e8]">Partager</strong> (icône carré avec flèche vers le haut ⎋)<br />
                    2. Faites défiler et sélectionnez <strong className="text-[#f2ca50]">« Sur l'écran d'accueil »</strong> ⊕<br />
                    3. Confirmez pour ajouter l'icône musée sur votre écran.
                  </p>
                </div>

                {/* Android / Chrome */}
                <div className="p-3 bg-[#201f24] rounded-lg border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-[#f2ca50] font-label-caps text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[16px]">android</span>
                    <span>Sur Android (Chrome, Samsung Internet)</span>
                  </div>
                  <p className="font-body-sm text-[11.5px] text-[#d0c5af] leading-relaxed">
                    Cliquez sur le bouton doré ci-dessus ou ouvrez le menu <strong>(⋮)</strong> de votre navigateur puis sélectionnez <strong>« Installer l'application »</strong>.
                  </p>
                </div>

                {/* Desktop / Ordinateur */}
                <div className="p-3 bg-[#201f24] rounded-lg border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-[#f2ca50] font-label-caps text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
                    <span>Sur Ordinateur (Chrome, Edge, Safari macOS)</span>
                  </div>
                  <p className="font-body-sm text-[11.5px] text-[#d0c5af] leading-relaxed">
                    Cliquez sur l'icône <strong className="text-[#f2ca50]">⊕ Installer</strong> située à droite dans la barre d'adresse du navigateur pour lancer l'app en fenêtre indépendante sans bordures.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Share / Copy fallback */}
          <div className="pt-2 flex items-center justify-between border-t border-white/5 text-[11px]">
            <span className="text-[#99907c]">Lien de l'application</span>
            <button
              onClick={handleCopyLink}
              className="text-[#f2ca50] hover:underline font-label-caps flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[13px]">
                {copiedState ? 'check' : 'content_copy'}
              </span>
              <span>{copiedState ? 'Lien copié !' : 'Copier l’URL'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

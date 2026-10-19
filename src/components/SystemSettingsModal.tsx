import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';

export const SystemSettingsModal: React.FC = () => {
  const {
    isSystemSettingsOpen,
    setIsSystemSettingsOpen,
    appVersion,
    releaseDate,
    lastUpdateCheckDate,
    isCheckingUpdate,
    checkForUpdates,
    forceUpdate,
    isAutoUpdateEnabled,
    setIsAutoUpdateEnabled,
    autoUpdateIntervalMinutes,
    setAutoUpdateIntervalMinutes,
    theme,
    toggleTheme,
    showTooltips,
    setShowTooltips,
    showContextualTips,
    setShowContextualTips,
    resetContextualTips,
    setIsOnboardingOpen,
    storageDiagnostics,
    openCatalogModal,
    exportDatabaseJSON,
    openBackupModal,
  } = useApp();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isSystemSettingsOpen) return null;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleManualCheck = async () => {
    const res = await checkForUpdates();
    triggerToast(res);
  };

  const handleForceUpdate = async () => {
    const res = await forceUpdate();
    triggerToast(res);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="system-settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={() => setIsSystemSettingsOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-[#1c1b20] border border-[#f2ca50]/40 shadow-2xl overflow-hidden animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#201f24]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#f2ca50] text-[24px]">
              settings_system_daydream
            </span>
            <div>
              <h2 id="system-settings-title" className="font-headline-sm text-[18px] text-[#f2ca50] font-bold">
                Paramètres Système & Mises à Jour
              </h2>
              <p className="text-[11px] text-[#99907c] font-label-caps uppercase tracking-wider">
                Maintenance & Moteur PWA Autonome
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSystemSettingsOpen(false)}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scroll">
          {/* Toast notification if active */}
          {toastMessage && (
            <div className="p-3 rounded-xl bg-[#2b292f] border border-[#f2ca50] text-[#f2ca50] text-[12px] flex items-center gap-2 animate-fade-in shadow-lg">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span className="font-medium">{toastMessage}</span>
            </div>
          )}

          {/* Section 1: Informations de Version & Sortie */}
          <div className="p-4 rounded-xl bg-[#141318] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-[11px] text-[#99907c] uppercase tracking-wider">
                Version de l'application
              </span>
              <span className="font-mono text-[12px] font-bold text-[#f2ca50] bg-[#2b292f] px-2 py-0.5 rounded border border-[#f2ca50]/30">
                {appVersion}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#d0c5af]">Date de sortie officielle</span>
              <span className="text-[13px] text-[#e5e1e8] font-medium">{releaseDate}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#d0c5af]">Dernière vérification</span>
              <span className="text-[13px] text-[#e5e1e8] font-mono text-[12px]">
                {lastUpdateCheckDate}
              </span>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#99907c]">
              <span>Moteur de stockage</span>
              <span className="text-[#f2ca50] font-medium">IndexedDB (RegardMuseumDB v1) + FTS BM25</span>
            </div>
          </div>

          {/* Section 2: Architecture & Diagnostic de Stockage Local (IndexedDB) */}
          <div className="p-4 rounded-xl bg-[#141318] border border-[#f2ca50]/20 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-title-editorial text-[14px] text-[#f2ca50] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">database</span>
                Stockage Local IndexedDB
              </h3>
              <span className="text-[10px] font-label-caps uppercase px-2 py-0.5 rounded bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30 font-bold">
                100% Hors-Ligne
              </span>
            </div>

            <p className="text-[11.5px] text-[#d0c5af] leading-relaxed">
              Base structurée W3C <strong className="text-[#e5e1e8]">RegardMuseumDB (v1)</strong> hébergée exclusivement sur votre appareil. Zéro cloud, zéro suivi.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded bg-[#201f24] border border-white/5 flex flex-col">
                <span className="text-[#99907c]">Œuvres</span>
                <span className="text-[#f2ca50] font-bold text-[13px]">{storageDiagnostics?.stores.artworksCount ?? 210}</span>
              </div>
              <div className="p-2 rounded bg-[#201f24] border border-white/5 flex flex-col">
                <span className="text-[#99907c]">Artistes</span>
                <span className="text-[#f2ca50] font-bold text-[13px]">{storageDiagnostics?.stores.artistsCount ?? 105}</span>
              </div>
              <div className="p-2 rounded bg-[#201f24] border border-white/5 flex flex-col">
                <span className="text-[#99907c]">Favoris réels</span>
                <span className="text-[#f2ca50] font-bold text-[13px]">{storageDiagnostics?.stores.bookmarksCount ?? 0}</span>
              </div>
              <div className="p-2 rounded bg-[#201f24] border border-white/5 flex flex-col">
                <span className="text-[#99907c]">Visites réelles</span>
                <span className="text-[#f2ca50] font-bold text-[13px]">{storageDiagnostics?.stores.historyCount ?? 0}</span>
              </div>
              <div className="p-2 rounded bg-[#201f24] border border-white/5 flex flex-col">
                <span className="text-[#99907c]">Notes d'étude</span>
                <span className="text-[#f2ca50] font-bold text-[13px]">{storageDiagnostics?.stores.notesCount ?? 0}</span>
              </div>
              <div className="p-2 rounded bg-[#201f24] border border-white/5 flex flex-col">
                <span className="text-[#99907c]">Quota utilisé</span>
                <span className="text-[#f2ca50] font-bold text-[13px]">
                  {storageDiagnostics?.storageQuota?.usageFormatted || '< 5 Mo'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setIsSystemSettingsOpen(false);
                  openCatalogModal();
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-[#2b292f] hover:bg-[#36343a] text-[#f2ca50] border border-[#f2ca50]/30 font-label-caps text-[11px] tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">inventory_2</span>
                <span>Gérer Catalogue (Import/Export)</span>
              </button>
              <button
                onClick={() => {
                  setIsSystemSettingsOpen(false);
                  openBackupModal();
                }}
                className="py-2 px-3 rounded-lg bg-[#201f24] hover:bg-[#2b292f] text-[#f2ca50] border border-[#f2ca50]/30 font-label-caps text-[11px] tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">lock_reset</span>
                <span>Sauvegarde &amp; Restauration</span>
              </button>
            </div>
          </div>

          {/* Section 2: Actions de mise à jour */}
          <div className="p-4 rounded-xl bg-[#201f24] border border-[#f2ca50]/20 space-y-4">
            <h3 className="font-title-editorial text-[14px] text-[#f2ca50] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">sync</span>
              Gestion des Mises à Jour
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Bouton Vérifier les mises à jour */}
              <button
                onClick={handleManualCheck}
                disabled={isCheckingUpdate}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#2b292f] hover:bg-[#36343a] text-[#f2ca50] border border-[#f2ca50]/30 transition-all font-label-caps text-[11px] tracking-wider uppercase cursor-pointer disabled:opacity-50 active:scale-95 shadow-sm"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    isCheckingUpdate ? 'animate-spin' : ''
                  }`}
                >
                  refresh
                </span>
                <span>{isCheckingUpdate ? 'Vérification...' : 'Vérifier les mises à jour'}</span>
              </button>

              {/* Bouton Forcer la mise à jour */}
              <button
                onClick={handleForceUpdate}
                disabled={isCheckingUpdate}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#141318] font-bold border border-[#f2ca50] transition-all font-label-caps text-[11px] tracking-wider uppercase cursor-pointer disabled:opacity-50 active:scale-95 shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">system_update</span>
                <span>Forcer la mise à jour</span>
              </button>
            </div>

            <p className="text-[11px] text-[#99907c] leading-relaxed">
              Le bouton « Forcer la mise à jour » réinitialise le cache de l'application, recharge
              les fiches d'œuvres actualisées et installe la toute dernière révision sans perdre
              vos favoris ni votre progression.
            </p>
          </div>

          {/* Section 3: Mises à jour automatiques en arrière-plan */}
          <div className="p-4 rounded-xl bg-[#141318] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[13px] font-medium text-[#e5e1e8]">
                  Mises à jour automatiques en arrière-plan
                </h4>
                <p className="text-[11px] text-[#99907c]">
                  Vérifie périodiquement et installe les nouvelles versions silencieusement
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAutoUpdateEnabled}
                  onChange={(e) => setIsAutoUpdateEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2b292f] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2ca50]"></div>
              </label>
            </div>

            {isAutoUpdateEnabled && (
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[12px] text-[#d0c5af]">Fréquence d'analyse en arrière-plan</span>
                <select
                  value={autoUpdateIntervalMinutes}
                  onChange={(e) => setAutoUpdateIntervalMinutes(Number(e.target.value))}
                  className="bg-[#201f24] text-[#f2ca50] border border-[#f2ca50]/30 rounded-lg px-2 py-1 text-[12px] outline-none cursor-pointer"
                >
                  <option value={15}>Toutes les 15 minutes</option>
                  <option value={30}>Toutes les 30 minutes</option>
                  <option value={60}>Toutes les heures</option>
                  <option value={360}>Toutes les 6 heures</option>
                  <option value={1440}>Quotidienne (24h)</option>
                </select>
              </div>
            )}
          </div>

          {/* Section 4: Thème Visuel & Affichage */}
          <div className="p-4 rounded-xl bg-[#141318] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[13px] font-medium text-[#e5e1e8]">Thème d'affichage</h4>
                <p className="text-[11px] text-[#99907c]">
                  Mode Sombre nocturne ou Mode Clair galerie d'art
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201f24] hover:bg-[#2b292f] text-[#f2ca50] border border-[#f2ca50]/30 transition-all text-[12px] font-medium cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">
                  {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                </span>
                <span>{theme === 'dark' ? 'Sombre' : 'Clair'}</span>
              </button>
            </div>
          </div>

          {/* Section 5: Aides, Infobulles & Onboarding */}
          <div className="p-4 rounded-xl bg-[#141318] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[13px] font-medium text-[#e5e1e8]">Infobulles au survol</h4>
                <p className="text-[11px] text-[#99907c]">
                  Afficher les bulles d'aide explicatives sur les boutons
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTooltips}
                  onChange={(e) => setShowTooltips(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2b292f] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2ca50]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <div>
                <h4 className="text-[13px] font-medium text-[#e5e1e8]">Bannières contextuelles</h4>
                <p className="text-[11px] text-[#99907c]">
                  Guides d'aide pédagogiques par écran
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showContextualTips}
                  onChange={(e) => setShowContextualTips(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2b292f] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2ca50]"></div>
              </label>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <button
                onClick={() => {
                  resetContextualTips();
                  triggerToast('Toutes les astuces contextuelles ont été réactivées');
                }}
                className="text-[11px] text-[#d0c5af] hover:text-[#f2ca50] underline cursor-pointer"
              >
                Réactiver toutes les astuces masquées
              </button>

              <button
                onClick={() => {
                  setIsSystemSettingsOpen(false);
                  setIsOnboardingOpen(true);
                }}
                className="text-[11px] text-[#f2ca50] hover:text-[#ffe088] font-medium underline flex items-center gap-1 cursor-pointer"
              >
                <span>Revoir l'Onboarding</span>
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-[#201f24] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#99907c]">
            <span className="material-symbols-outlined text-[14px] text-[#f2ca50]">verified_user</span>
            <span>Mode autonome & chiffré</span>
          </div>
          <button
            onClick={() => setIsSystemSettingsOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-[#2b292f] hover:bg-[#36343a] text-[#f2ca50] border border-[#f2ca50]/30 text-[12px] font-label-caps uppercase cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

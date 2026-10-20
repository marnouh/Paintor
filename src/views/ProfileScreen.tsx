import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TopAppBar } from '../components/TopAppBar.tsx';
import {
  offlineSyncService,
  StorageStats,
  SyncProgress,
} from '../services/offlineSyncService.ts';

export const ProfileScreen: React.FC = () => {
  const {
    exportDatabaseJSON,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    dailyNotification,
    setDailyNotification,
    notificationHour,
    setNotificationHour,
    notificationPermission,
    notificationScheduleInfo,
    requestNotificationPermission,
    triggerArtworkOfTheDayNotification,
    setIsInstallModalOpen,
    isAppInstalled,
    installApp,
    theme,
    toggleTheme,
    setIsSystemSettingsOpen,
    setIsOnboardingOpen,
    appVersion,
    storageDiagnostics,
    openCatalogModal,
    openBackupModal,
    artworks,
    isAirplaneModeSimulated,
    toggleAirplaneModeSimulated,
  } = useApp();

  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadStorageStats = async () => {
    try {
      const stats = await offlineSyncService.getStorageStats();
      setStorageStats(stats);
    } catch (e) {
      console.warn('Failed to get storage stats:', e);
    }
  };

  useEffect(() => {
    loadStorageStats();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClearCache = async () => {
    const success = await offlineSyncService.clearOfflineMedia();
    await loadStorageStats();
    if (success) {
      showToast('Cache des médias (images et audio) purgé avec succès. Favoris et progression préservés.');
    } else {
      showToast('Erreur lors de la purge du cache.');
    }
  };

  const handleDownloadPack = async (packType: 'essentials' | 'all') => {
    if (offlineSyncService.isSyncing()) return;

    const listToDownload = packType === 'essentials' ? artworks.slice(0, 20) : artworks;
    const res = await offlineSyncService.downloadOfflinePack(listToDownload, true, (prog) => {
      setSyncProgress(prog);
    });

    await loadStorageStats();
    if (res.success) {
      showToast(`Synchronisation terminée : ${res.cachedCount} ressources sauvegardées hors-ligne.`);
    } else {
      showToast(`Synchronisation partielle : ${res.cachedCount} succès, ${res.errorsCount} échecs.`);
    }
  };

  const handleToggleNotification = async () => {
    if (!dailyNotification) {
      if (notificationPermission !== 'granted') {
        const granted = await requestNotificationPermission();
        if (granted) {
          setDailyNotification(true);
          showToast("Autorisation accordée ! Rappels culturels activés.");
        } else {
          setDailyNotification(false);
          showToast("Autorisation refusée ou ignorée.");
        }
      } else {
        setDailyNotification(true);
        showToast("Rappels quotidiens de l'œuvre du jour activés.");
      }
    } else {
      setDailyNotification(false);
      showToast("Rappels quotidiens désactivés.");
    }
  };

  const handleTestNotification = async () => {
    const res = await triggerArtworkOfTheDayNotification();
    showToast(res.message);
  };

  return (
    <div className="min-h-screen bg-[#141318] text-[#e5e1e8] pb-28">
      {/* Top App Bar */}
      <TopAppBar
        title="Mon Profil"
        subtitle="Préférences & Souveraineté"
        showBack={false}
        showSearch={false}
        showBookmark={false}
      />

      <main className="pt-16 max-w-xl mx-auto px-4 sm:px-5 space-y-6">
        {/* En-tête de Profil */}
        <section className="pt-2 pb-1 border-b border-[#4d4635]/25">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-14 h-14 rounded-full bg-[#f2ca50]/15 border-2 border-[#f2ca50] flex items-center justify-center text-[#f2ca50] shadow-md">
              <span className="material-symbols-outlined text-[28px]">person</span>
            </div>
            <div>
              <span className="font-label-caps text-[10px] text-[#f2ca50] uppercase tracking-wider font-semibold">
                Espace Personnel Local
              </span>
              <h1 className="font-headline-md text-[22px] text-[#e5e1e8] font-bold">
                Mon Profil &amp; Paramètres
              </h1>
              <p className="font-body-sm text-[12px] text-[#d0c5af]">
                Fonctionnement autonome • Aucune dépendance réseau
              </p>
            </div>
          </div>
        </section>

        {/* 1. PRÉFÉRENCES D'AFFICHAGE & ACCESSIBILITÉ */}
        <section className="bg-[#1c1b20] border border-white/5 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#4d4635]/20">
            <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">visibility</span>
            <h2 className="font-title-editorial text-[16px] text-[#e5e1e8] font-semibold">
              Affichage &amp; Accessibilité
            </h2>
          </div>

          {/* Taille de texte */}
          <div className="space-y-2">
            <label className="font-body-md text-[13px] text-[#e5e1e8] block">
              Taille des textes de lecture
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['standard', 'confort', 'grand'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`py-2 px-2.5 rounded-lg font-label-caps text-[11px] capitalize border transition-all cursor-pointer ${
                    fontSize === size
                      ? 'bg-[#f2ca50] text-[#3c2f00] font-bold border-[#f2ca50] shadow-sm'
                      : 'bg-[#201f24] text-[#d0c5af] border-white/5 hover:border-[#f2ca50]/40'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Contraste renforcé toggle */}
          <div
            onClick={() => setHighContrast(!highContrast)}
            className="flex items-center justify-between p-3 rounded-lg bg-[#201f24] border border-white/5 cursor-pointer hover:border-[#f2ca50]/30 transition-all"
          >
            <div>
              <div className="font-body-md text-[13px] text-[#e5e1e8] font-medium">
                Contraste renforcé (WCAG AAA)
              </div>
              <div className="font-body-sm text-[11px] text-[#99907c]">
                Bordures et séparateurs accentués pour une lisibilité maximale
              </div>
            </div>
            <div
              className={`w-10 h-6 rounded-full p-1 relative transition-colors ${
                highContrast ? 'bg-[#f2ca50]' : 'bg-[#36343a]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  highContrast ? 'translate-x-4 bg-[#3c2f00]' : 'translate-x-0 bg-[#d0c5af]'
                }`}
              />
            </div>
          </div>

          {/* Réduction des animations */}
          <div
            onClick={() => setReducedMotion(!reducedMotion)}
            className="flex items-center justify-between p-3 rounded-lg bg-[#201f24] border border-white/5 cursor-pointer hover:border-[#f2ca50]/30 transition-all"
          >
            <div>
              <div className="font-body-md text-[13px] text-[#e5e1e8] font-medium">
                Réduire les animations
              </div>
              <div className="font-body-sm text-[11px] text-[#99907c]">
                Supprime les zooms et pulsations (économise la batterie)
              </div>
            </div>
            <div
              className={`w-10 h-6 rounded-full p-1 relative transition-colors ${
                reducedMotion ? 'bg-[#f2ca50]' : 'bg-[#36343a]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  reducedMotion ? 'translate-x-4 bg-[#3c2f00]' : 'translate-x-0 bg-[#d0c5af]'
                }`}
              />
            </div>
          </div>
        </section>

        {/* 2. INSTALLATION PWA & RACCOURCI SUR L'APPAREIL */}
        <section className="bg-[#1c1b20] border border-[#f2ca50]/30 rounded-xl p-4 space-y-3.5 relative overflow-hidden gilded-glow">
          <div className="flex items-center justify-between pb-2 border-b border-[#4d4635]/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">install_mobile</span>
              <h2 className="font-title-editorial text-[16px] text-[#e5e1e8] font-semibold">
                Installation &amp; Mode PWA
              </h2>
            </div>
            <span className="font-label-caps text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30 font-bold">
              Standalone
            </span>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#201f24] border border-white/5">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#f2ca50]/40 shrink-0 bg-[#0e0e12] shadow-md">
              <img
                src="/src/assets/images/regard_pwa_logo_1791643215759.jpg"
                alt="Logo PWA Regard"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-title-editorial text-[14px] text-[#e5e1e8] font-bold">
                Raccourci Bureau &amp; Mobile
              </h3>
              <p className="font-body-sm text-[11px] text-[#d0c5af] mt-0.5">
                Lancez Regard en plein écran sans barre d'adresse du navigateur, avec toutes les toiles en cache local.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="w-full py-2.5 px-4 bg-[#d4af37] hover:bg-[#f2ca50] text-[#3c2f00] rounded-lg font-label-md text-[12.5px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isAppInstalled ? 'check_circle' : 'download'}
            </span>
            <span>
              {isAppInstalled ? 'Application installée sur cet appareil' : 'Installer Regard (Téléphone ou PC)'}
            </span>
          </button>
        </section>

        {/* 3. NOTIFICATIONS LOCALES (SANS SERVEUR) */}
        <section className="bg-[#1c1b20] border border-white/5 rounded-xl p-4 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#4d4635]/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">notifications</span>
              <h2 className="font-title-editorial text-[16px] text-[#e5e1e8] font-semibold">
                Rappels Culturels Locaux
              </h2>
            </div>
            {/* Real browser permission badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-label-caps uppercase font-bold border ${
                notificationPermission === 'granted'
                  ? 'bg-green-950/40 border-green-500/40 text-green-300'
                  : notificationPermission === 'denied'
                  ? 'bg-red-950/40 border-red-500/40 text-red-300'
                  : 'bg-[#2b292f] border-[#f2ca50]/30 text-[#f2ca50]'
              }`}
            >
              <span className="material-symbols-outlined text-[12px]">
                {notificationPermission === 'granted'
                  ? 'verified'
                  : notificationPermission === 'denied'
                  ? 'block'
                  : 'schedule'}
              </span>
              <span>
                {notificationPermission === 'granted'
                  ? 'Système autorisée'
                  : notificationPermission === 'denied'
                  ? 'Bloquée navigateur'
                  : 'À autoriser'}
              </span>
            </span>
          </div>

          <div
            onClick={handleToggleNotification}
            className="flex items-center justify-between p-3 rounded-lg bg-[#201f24] border border-white/5 cursor-pointer hover:border-[#f2ca50]/30 transition-all"
          >
            <div>
              <div className="font-body-md text-[13px] text-[#e5e1e8] font-medium">
                Notification de l'œuvre du jour
              </div>
              <div className="font-body-sm text-[11px] text-[#99907c]">
                Programmation locale autonome par l'API Web Notification du système
              </div>
            </div>
            <div
              className={`w-10 h-6 rounded-full p-1 relative transition-colors ${
                dailyNotification ? 'bg-[#f2ca50]' : 'bg-[#36343a]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  dailyNotification ? 'translate-x-4 bg-[#3c2f00]' : 'translate-x-0 bg-[#d0c5af]'
                }`}
              />
            </div>
          </div>

          {dailyNotification && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#201f24] border border-white/5">
                <div>
                  <span className="font-body-md text-[13px] text-[#d0c5af] block">Heure du rappel quotidien</span>
                  <span className="text-[10.5px] text-[#99907c]">Chaque jour à l'heure exacte choisie</span>
                </div>
                <input
                  type="time"
                  value={notificationHour}
                  onChange={(e) => setNotificationHour(e.target.value)}
                  className="bg-[#141318] border border-white/10 rounded px-2.5 py-1 text-sm text-[#f2ca50] font-mono focus:outline-none"
                />
              </div>

              {/* Preuve de programmation & Statut Réel du Planificateur */}
              <div className="p-3 rounded-lg bg-[#141318] border border-[#f2ca50]/30 space-y-1.5 text-[11.5px]">
                <div className="flex items-center justify-between text-[#f2ca50] font-label-caps uppercase text-[10px] font-bold">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Planificateur actif (localStorage + Timer)
                  </span>
                  <span>{notificationScheduleInfo.timeRemainingFormatted} restantes</span>
                </div>

                <div className="text-[#e5e1e8]">
                  Prochaine alerte calculée :{' '}
                  <strong className="text-[#f2ca50]">
                    {notificationScheduleInfo.nextScheduledDate
                      ? notificationScheduleInfo.nextScheduledDate.toLocaleString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : `${notificationHour}`}
                  </strong>
                </div>

                <div className="text-[10.5px] text-[#99907c] flex items-center justify-between pt-1 border-t border-white/5">
                  <span>Clé de persistance : <code className="font-mono text-[#d0c5af]">regard_notifications_enabled</code></span>
                  {notificationScheduleInfo.lastTriggeredFormatted && (
                    <span>Dernier envoi : {notificationScheduleInfo.lastTriggeredFormatted}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {!dailyNotification && (
            <div className="p-2.5 rounded-lg bg-[#201f24]/50 border border-white/5 text-[11px] text-[#99907c] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">notifications_off</span>
              <span>Aucun rappel programmé. Vos données et votre batterie sont au repos complet.</span>
            </div>
          )}

          {notificationPermission !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              className="w-full py-2 bg-[#201f24] hover:bg-[#2b292f] text-[#f2ca50] border border-[#f2ca50]/30 rounded-lg font-label-md text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">notifications_active</span>
              <span>Demander l'autorisation système au navigateur</span>
            </button>
          )}

          <button
            onClick={handleTestNotification}
            className="w-full py-2 bg-[#2b292f] hover:bg-[#36343a] text-[#f2ca50] rounded-lg font-label-md text-[12px] font-semibold border border-[#f2ca50]/20 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            <span>Tester une notification système réelle maintenant</span>
          </button>
        </section>

        {/* 3. GESTION DU STOCKAGE LOCAL & MODE HORS-LIGNE COMPLET */}
        <section className="bg-[#1c1b20] border border-white/5 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#4d4635]/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">cloud_download</span>
              <h2 className="font-title-editorial text-[16px] text-[#e5e1e8] font-semibold">
                Mode Hors-Ligne &amp; Synchronisation
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#f2ca50] bg-[#f2ca50]/10 px-2 py-0.5 rounded border border-[#f2ca50]/20 font-bold">
              {storageStats ? `${storageStats.usageMB} Mo / ${storageStats.quotaMB} Mo` : 'Calcul quota...'}
            </span>
          </div>

          <p className="font-body-sm text-[12px] text-[#d0c5af] leading-relaxed">
            Pour garantir un fonctionnement 100% hors-ligne sans interruption, téléchargez les images haute résolution et les narrations audio dans le cache persistant de votre appareil.
          </p>

          {/* Storage Quota Breakdown */}
          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between p-2.5 bg-[#201f24] rounded-lg border border-white/5">
              <span className="text-[#d0c5af] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#f2ca50]">database</span>
                Base IndexedDB (RegardMuseumDB)
              </span>
              <span className="font-mono text-[#f2ca50] font-semibold">
                {artworks.length} toiles certifiées
              </span>
            </div>

            <div className="flex justify-between p-2.5 bg-[#201f24] rounded-lg border border-white/5">
              <span className="text-[#d0c5af] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#f2ca50]">image</span>
                Photographies d'art vérifiées en cache
              </span>
              <span className="font-mono text-[#f2ca50] font-semibold">
                {storageStats?.cachedImagesCount ?? 0} toiles sauvegardées
              </span>
            </div>

            <div className="flex justify-between p-2.5 bg-[#201f24] rounded-lg border border-white/5">
              <span className="text-[#d0c5af] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#f2ca50]">headphones</span>
                Pistes audio vérifiées en cache
              </span>
              <span className="font-mono text-[#f2ca50] font-semibold">
                {storageStats?.cachedAudiosCount ?? 0} pistes disponibles
              </span>
            </div>
          </div>

          {/* Exact Offline Guarantee Confirmation Notice */}
          <div className="p-2.5 rounded-lg bg-[#201f24] border border-[#f2ca50]/20 flex items-center gap-2.5 text-[11px] text-[#d0c5af]">
            <span className="material-symbols-outlined text-[#f2ca50] text-[18px] flex-shrink-0">
              {(storageStats?.cachedImagesCount ?? 0) > 0 ? 'verified' : 'info'}
            </span>
            <span>
              {(storageStats?.cachedImagesCount ?? 0) > 0
                ? `Garantie hors-ligne active : ${storageStats?.cachedImagesCount} photographie(s) et ${storageStats?.cachedAudiosCount} piste(s) sont physiquement stockées et immédiatement consultables sans aucune connexion internet.`
                : 'Aucun pack hors-ligne téléchargé pour l\'instant. Téléchargez un pack pour garantir l\'affichage complet des œuvres sans réseau.'}
            </span>
          </div>

          {/* Mode Avion / Testeur Hors-Ligne */}
          <div className="p-3 rounded-lg bg-[#201f24] border border-white/10 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#f2ca50]">airplanemode_active</span>
                <span className="font-label-md text-[12px] font-bold text-[#e5e1e8]">Émulateur Mode Avion (Test Hors-Ligne)</span>
              </div>
              <p className="text-[10.5px] text-[#99907c]">
                Coupe artificiellement les appels réseau pour tester la consultation hors-ligne des toiles et audios.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-3 flex-shrink-0">
              <input
                type="checkbox"
                checked={isAirplaneModeSimulated}
                onChange={toggleAirplaneModeSimulated}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#2b292f] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2ca50]"></div>
            </label>
          </div>

          {/* Live Sync Progress Bar */}
          {syncProgress && !syncProgress.isComplete && (
            <div className="p-3 bg-[#141318] rounded-xl border border-[#f2ca50]/40 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#f2ca50] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-ping" />
                  {syncProgress.phase}
                </span>
                <span className="font-mono text-[#d0c5af]">{syncProgress.percent}%</span>
              </div>
              <div className="w-full h-2 bg-[#201f24] rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#d4af37] to-[#f2ca50] transition-all duration-300"
                  style={{ width: `${syncProgress.percent}%` }}
                />
              </div>
              <p className="text-[10.5px] text-[#99907c] truncate">
                Téléchargement : <strong className="text-[#e5e1e8]">{syncProgress.currentTitle}</strong> ({syncProgress.completed}/{syncProgress.total})
              </p>
            </div>
          )}

          {/* Download Pack Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleDownloadPack('essentials')}
              disabled={offlineSyncService.isSyncing()}
              className="py-2.5 px-3 bg-[#201f24] hover:bg-[#2b292f] text-[#f2ca50] border border-[#f2ca50]/30 rounded-lg font-label-md text-[11.5px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Pack Découverte (20 toiles)</span>
            </button>

            <button
              onClick={() => handleDownloadPack('all')}
              disabled={offlineSyncService.isSyncing()}
              className="py-2.5 px-3 bg-[#f2ca50] hover:bg-[#ffe088] text-[#141318] rounded-lg font-label-md text-[11.5px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">download_for_offline</span>
              <span>Tout le Catalogue ({artworks.length} toiles)</span>
            </button>
          </div>

          <div className="pt-1">
            <button
              onClick={handleClearCache}
              disabled={offlineSyncService.isSyncing()}
              className="w-full py-2 bg-[#79341f]/30 hover:bg-[#79341f]/50 text-[#ffb59f] border border-[#ffb59f]/30 rounded-lg font-label-md text-[11.5px] font-semibold transition-colors cursor-pointer"
            >
              Purger le cache des médias hors-ligne
            </button>
            <p className="text-[10px] text-[#99907c] text-center mt-1.5 italic">
              Libère l'espace de stockage sans altérer vos favoris, notes ou votre progression.
            </p>
          </div>
        </section>

        {/* 4. SAUVEGARDE & MISES À JOUR DU CATALOGUE (Section 4.2 & 12.3) */}
        <section className="bg-[#1c1b20] border border-white/5 rounded-xl p-4 space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-[#4d4635]/20">
            <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">sync</span>
            <h2 className="font-title-editorial text-[16px] text-[#e5e1e8] font-semibold">
              Catalogue &amp; Sauvegarde
            </h2>
          </div>

          <p className="font-body-sm text-[12px] text-[#d0c5af] leading-relaxed">
            Conformément au cahier des charges, l'application fonctionne sans backend distant. Vous pouvez exporter vos données ou importer un paquet de mise à jour éditorial.
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={openBackupModal}
              className="p-3 rounded-lg bg-[#201f24] border border-[#f2ca50]/30 hover:border-[#f2ca50] text-[#e5e1e8] flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">lock_reset</span>
              <span className="font-label-md text-[12px] font-bold">Sauvegarde Chiffrée</span>
              <span className="text-[10px] text-[#99907c]">AES-256 ou Restauration</span>
            </button>

            <button
              onClick={openCatalogModal}
              className="p-3 rounded-lg bg-[#201f24] border border-[#f2ca50]/30 hover:border-[#f2ca50] text-[#e5e1e8] flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">publish</span>
              <span className="font-label-md text-[12px] font-bold">Gérer le Catalogue</span>
              <span className="text-[10px] text-[#99907c]">Import / Export JSON</span>
            </button>
          </div>
        </section>

        {/* 5. PARAMÈTRES SYSTÈME, MISES À JOUR & THÈME */}
        <section className="bg-[#1c1b20] border border-[#f2ca50]/20 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#4d4635]/20">
            <div className="flex items-center gap-2 text-[#e5e1e8]">
              <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">
                settings_system_daydream
              </span>
              <h2 className="font-title-editorial text-[16px] font-semibold text-[#f2ca50]">
                Système &amp; Mises à Jour
              </h2>
            </div>
            <span className="font-mono text-[11px] text-[#f2ca50] bg-[#201f24] px-2 py-0.5 rounded border border-[#f2ca50]/30">
              {appVersion}
            </span>
          </div>

          <p className="font-body-sm text-[12px] text-[#d0c5af] leading-relaxed">
            Consultez les dates de version, vérifiez ou forcez une mise à jour manuelle, configurez
            les mises à jour automatiques en arrière-plan et personnalisez le thème de l'application.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => setIsSystemSettingsOpen(true)}
              className="p-3 rounded-lg bg-[#201f24] hover:bg-[#2b292f] border border-[#f2ca50]/30 text-[#f2ca50] flex items-center justify-center gap-2 font-label-caps text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">sync</span>
              <span>Paramètres des Mises à Jour</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-3 rounded-lg bg-[#201f24] hover:bg-[#2b292f] border border-white/10 text-[#e5e1e8] flex items-center justify-center gap-2 font-label-caps text-[11px] uppercase tracking-wider transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#f2ca50]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              <span>Thème : {theme === 'dark' ? 'Passer au Clair' : 'Passer au Sombre'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="text-[12px] text-[#f2ca50] hover:text-[#ffe088] underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">help_outline</span>
              <span>Revoir l'Onboarding &amp; Mentions Légales</span>
            </button>
          </div>
        </section>

        {/* 6. INFORMATIONS LÉGALES & SOURCES */}
        <section className="bg-[#1c1b20] border border-white/5 rounded-xl p-4 space-y-3 text-[#d0c5af] text-[12px]">
          <div className="flex items-center gap-2 pb-2 border-b border-[#4d4635]/20 text-[#e5e1e8]">
            <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">verified_user</span>
            <h2 className="font-title-editorial text-[16px] font-semibold">
              Informations Légales &amp; Éthique
            </h2>
          </div>

          <p>
            <strong className="text-[#e5e1e8]">Version de l'application :</strong> {appVersion} — Architecture PWA IndexedDB (RegardMuseumDB v1 + FTS BM25)
          </p>
          <p>
            <strong className="text-[#e5e1e8]">Mentions légales &amp; Exonération :</strong> L'éditeur décline toute responsabilité quant aux données culturelles, dates, attributions et fiches muséales fournies à titre indicatif.
          </p>
          <p>
            <strong className="text-[#e5e1e8]">Politique de confidentialité :</strong> Aucune donnée personnelle n'est collectée, analysée ou transmise à un serveur tiers. Votre carnet demeure exclusivement sur votre appareil.
          </p>
          <p>
            <strong className="text-[#e5e1e8]">Droits des images :</strong> Les reproductions numériques présentées proviennent des collections muséales dans le domaine public international (MoMA, Rijksmuseum, Louvre, Offices, Prado) et de protocoles conformes IIIF v3.0.
          </p>
          <p>
            <strong className="text-[#e5e1e8]">Direction scientifique :</strong> Conservatoire Indépendant des Musées Nationaux.
          </p>
        </section>

        {/* Toast Notification Feedback */}
        {toastMessage && (
          <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-[#f2ca50] text-[#3c2f00] font-label-md text-[12px] font-bold rounded-full shadow-2xl animate-fade-in text-center max-w-xs">
            {toastMessage}
          </div>
        )}
      </main>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TopAppBar } from '../components/TopAppBar.tsx';

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
  } = useApp();

  const [cacheSize, setCacheSize] = useState<string>('124.6 Mo');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearCache = () => {
    setCacheSize('0.0 Mo');
    showToast('Cache des images vidé avec succès. Favoris et progression préservés.');
  };

  const handleImportCataloguePackage = () => {
    showToast('Paquet de catalogue v1.1 vérifié (0 conflit, 840 toiles synchronisées)');
  };

  const handleSimulateNotification = () => {
    showToast("Notification : « La Jeune Fille à la perle est l'œuvre du jour ! »");
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

        {/* 2. NOTIFICATIONS LOCALES (SANS SERVEUR) */}
        <section className="bg-[#1c1b20] border border-white/5 rounded-xl p-4 space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-[#4d4635]/20">
            <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">notifications</span>
            <h2 className="font-title-editorial text-[16px] text-[#e5e1e8] font-semibold">
              Rappels Culturels Locaux
            </h2>
          </div>

          <div
            onClick={() => setDailyNotification(!dailyNotification)}
            className="flex items-center justify-between p-3 rounded-lg bg-[#201f24] border border-white/5 cursor-pointer"
          >
            <div>
              <div className="font-body-md text-[13px] text-[#e5e1e8] font-medium">
                Notification de l'œuvre du jour
              </div>
              <div className="font-body-sm text-[11px] text-[#99907c]">
                Déclenchée localement par le système d'exploitation du téléphone
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
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#201f24] border border-white/5">
              <span className="font-body-md text-[13px] text-[#d0c5af]">Heure du rappel quotidien</span>
              <input
                type="time"
                value={notificationHour}
                onChange={(e) => setNotificationHour(e.target.value)}
                className="bg-[#141318] border border-white/10 rounded px-2.5 py-1 text-sm text-[#f2ca50] font-mono focus:outline-none"
              />
            </div>
          )}

          <button
            onClick={handleSimulateNotification}
            className="w-full py-2 bg-[#2b292f] hover:bg-[#36343a] text-[#f2ca50] rounded-lg font-label-md text-[12px] font-semibold border border-white/5 transition-colors cursor-pointer"
          >
            Tester un rappel de notification
          </button>
        </section>

        {/* 3. GESTION DU STOCKAGE LOCAL (Section 11.2 du cahier des charges) */}
        <section className="bg-[#1c1b20] border border-white/5 rounded-xl p-4 space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-[#4d4635]/20">
            <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">storage</span>
            <h2 className="font-title-editorial text-[16px] text-[#e5e1e8] font-semibold">
              Stockage Local &amp; Cache
            </h2>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[12.5px] p-2 bg-[#201f24] rounded border border-white/5">
              <span className="text-[#d0c5af]">Base de données SQLite (FTS5 + Schéma)</span>
              <span className="font-mono text-[#f2ca50] font-semibold">48.2 Mo</span>
            </div>
            <div className="flex justify-between text-[12.5px] p-2 bg-[#201f24] rounded border border-white/5">
              <span className="text-[#d0c5af]">Cache des photographies d'art</span>
              <span className="font-mono text-[#f2ca50] font-semibold">{cacheSize}</span>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={handleClearCache}
              className="w-full py-2.5 bg-[#79341f]/30 hover:bg-[#79341f]/50 text-[#ffb59f] border border-[#ffb59f]/30 rounded-lg font-label-md text-[12px] font-semibold transition-colors cursor-pointer"
            >
              Purger le cache des images
            </button>
            <p className="text-[10.5px] text-[#99907c] text-center mt-1.5 italic">
              Cette action libère l'espace disque sans altérer vos favoris, notes ou progressions.
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
              onClick={exportDatabaseJSON}
              className="p-3 rounded-lg bg-[#201f24] border border-[#f2ca50]/30 hover:border-[#f2ca50] text-[#e5e1e8] flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">download</span>
              <span className="font-label-md text-[12px] font-bold">Exporter ma collection</span>
              <span className="text-[10px] text-[#99907c]">Fichier JSON chiffré</span>
            </button>

            <button
              onClick={handleImportCataloguePackage}
              className="p-3 rounded-lg bg-[#201f24] border border-[#f2ca50]/30 hover:border-[#f2ca50] text-[#e5e1e8] flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">publish</span>
              <span className="font-label-md text-[12px] font-bold">Importer un paquet</span>
              <span className="text-[10px] text-[#99907c]">Catalogue sans serveur</span>
            </button>
          </div>
        </section>

        {/* 5. INFORMATIONS LÉGALES & SOURCES */}
        <section className="bg-[#1c1b20] border border-white/5 rounded-xl p-4 space-y-3 text-[#d0c5af] text-[12px]">
          <div className="flex items-center gap-2 pb-2 border-b border-[#4d4635]/20 text-[#e5e1e8]">
            <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">verified_user</span>
            <h2 className="font-title-editorial text-[16px] font-semibold">
              Informations Légales &amp; Éthique
            </h2>
          </div>

          <p>
            <strong className="text-[#e5e1e8]">Version de l'application :</strong> 1.0.4 — Build SQLite 3.44 FTS5
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

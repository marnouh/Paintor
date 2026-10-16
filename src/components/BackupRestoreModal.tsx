import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  cryptoBackupService,
  BackupInspectionResult,
} from '../services/cryptoBackupService.ts';

export const BackupRestoreModal: React.FC = () => {
  const {
    isBackupModalOpen,
    setIsBackupModalOpen,
    refreshUserData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'export' | 'restore'>('export');

  // Export State
  const [encryptExport, setEncryptExport] = useState<boolean>(true);
  const [exportPassphrase, setExportPassphrase] = useState<string>('');
  const [confirmPassphrase, setConfirmPassphrase] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  // Restore State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawFileContent, setRawFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [restorePassphrase, setRestorePassphrase] = useState<string>('');
  const [inspectionResult, setInspectionResult] = useState<BackupInspectionResult | null>(null);
  const [restoreMode, setRestoreMode] = useState<'merge' | 'replace'>('merge');
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [restoreStatusMessage, setRestoreStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isBackupModalOpen) return null;

  // --- Export Handling ---
  const handleExecuteExport = async () => {
    setExportFeedback(null);

    if (encryptExport) {
      if (!exportPassphrase.trim()) {
        setExportFeedback('Veuillez saisir une phrase secrète pour chiffrer la sauvegarde.');
        return;
      }
      if (exportPassphrase.length < 6) {
        setExportFeedback('La phrase secrète doit comporter au moins 6 caractères pour garantir la sécurité AES-GCM.');
        return;
      }
      if (exportPassphrase !== confirmPassphrase) {
        setExportFeedback('Les deux saisies de la phrase secrète ne correspondent pas.');
        return;
      }
    }

    try {
      setIsExporting(true);
      const { jsonString, filename } = await cryptoBackupService.exportBackup(
        encryptExport ? exportPassphrase.trim() : undefined
      );

      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      setExportFeedback(
        `Sauvegarde ${encryptExport ? 'chiffrée (AES-GCM 256 bits)' : 'standard'} téléchargée avec succès (${filename}).`
      );
      setExportPassphrase('');
      setConfirmPassphrase('');
    } catch (err: any) {
      setExportFeedback(`Erreur lors de l'export : ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // --- Restore File Upload ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setRestoreStatusMessage(null);
    setRestorePassphrase('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      setRawFileContent(content);
      const inspected = await cryptoBackupService.inspectBackup(content);
      setInspectionResult(inspected);
    };
    reader.readAsText(file);
  };

  const handleDecryptWithPassphrase = async () => {
    if (!rawFileContent) return;
    setRestoreStatusMessage(null);
    const inspected = await cryptoBackupService.inspectBackup(rawFileContent, restorePassphrase);
    setInspectionResult(inspected);
  };

  const handleExecuteRestore = async () => {
    if (!inspectionResult || !inspectionResult.decryptedData) return;

    try {
      setIsRestoring(true);
      setRestoreStatusMessage(null);

      const res = await cryptoBackupService.restoreData(
        inspectionResult.decryptedData,
        restoreMode
      );

      if (res.success) {
        await refreshUserData();
        setRestoreStatusMessage({
          type: 'success',
          text: `Restauration réussie (${restoreMode === 'merge' ? 'Mode Fusion' : 'Mode Remplacement'}). Votre collection est synchronisée.`,
        });
      } else {
        setRestoreStatusMessage({
          type: 'error',
          text: res.message,
        });
      }
    } catch (err: any) {
      setRestoreStatusMessage({
        type: 'error',
        text: `Échec : ${err.message}`,
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="backup-restore-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={() => setIsBackupModalOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-[#1c1b20] border border-[#f2ca50]/40 shadow-2xl overflow-hidden animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#201f24]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#f2ca50] text-[24px]">
              lock_reset
            </span>
            <div>
              <h2 id="backup-restore-title" className="font-headline-sm text-[18px] text-[#f2ca50] font-bold">
                Sauvegarde &amp; Restauration
              </h2>
              <p className="text-[11px] text-[#99907c] font-label-caps uppercase tracking-wider">
                Chiffrement Fort Web Crypto AES-256 • Zéro Serveur
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBackupModalOpen(false)}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#d0c5af] hover:text-[#f2ca50] hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/[0.06] bg-[#141318] px-5 pt-2">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-4 py-2.5 font-label-caps text-[12px] tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'border-[#f2ca50] text-[#f2ca50] font-bold'
                : 'border-transparent text-[#99907c] hover:text-[#e5e1e8]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span>Exporter / Sauvegarder</span>
          </button>
          <button
            onClick={() => setActiveTab('restore')}
            className={`flex items-center gap-2 px-4 py-2.5 font-label-caps text-[12px] tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === 'restore'
                ? 'border-[#f2ca50] text-[#f2ca50] font-bold'
                : 'border-transparent text-[#99907c] hover:text-[#e5e1e8]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">upload</span>
            <span>Vérifier &amp; Restaurer</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scroll">
          {/* TAB 1: EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141318] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">shield</span>
                    <span className="text-[13px] font-semibold text-[#e5e1e8]">
                      Chiffrement fort AES-GCM (256 bits)
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={encryptExport}
                      onChange={(e) => setEncryptExport(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#2b292f] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2ca50]"></div>
                  </label>
                </div>

                <p className="text-[11.5px] text-[#99907c] leading-relaxed">
                  {encryptExport
                    ? 'Vos favoris, notes, toiles et progression seront chiffrés avec une clé dérivée par PBKDF2 (100 000 itérations). Personne ne pourra lire votre carnet sans votre phrase secrète.'
                    : 'Sauvegarde au format JSON clair. Recommandé uniquement pour archivage personnel sur support chiffré.'}
                </p>

                {encryptExport && (
                  <div className="pt-2 space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-label-caps uppercase text-[#d0c5af] mb-1">
                        Phrase secrète ou mot de passe
                      </label>
                      <input
                        type="password"
                        value={exportPassphrase}
                        onChange={(e) => setExportPassphrase(e.target.value)}
                        placeholder="Ex : VermeerClairObscur1675!"
                        className="w-full bg-[#201f24] text-[#e5e1e8] placeholder-[#99907c] border border-white/10 rounded-lg px-3 py-2 text-[12.5px] outline-none focus:border-[#f2ca50]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-label-caps uppercase text-[#d0c5af] mb-1">
                        Confirmer la phrase secrète
                      </label>
                      <input
                        type="password"
                        value={confirmPassphrase}
                        onChange={(e) => setConfirmPassphrase(e.target.value)}
                        placeholder="Répétez la même phrase secrète"
                        className="w-full bg-[#201f24] text-[#e5e1e8] placeholder-[#99907c] border border-white/10 rounded-lg px-3 py-2 text-[12.5px] outline-none focus:border-[#f2ca50]/50"
                      />
                    </div>
                  </div>
                )}
              </div>

              {exportFeedback && (
                <div
                  className={`p-3 rounded-xl border text-[12px] flex items-center gap-2 ${
                    exportFeedback.includes('Erreur') || exportFeedback.includes('Veuillez') || exportFeedback.includes('doit')
                      ? 'bg-red-950/40 border-red-500/40 text-red-200'
                      : 'bg-[#2b292f] border-[#f2ca50] text-[#f2ca50]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {exportFeedback.includes('Erreur') ? 'error' : 'check_circle'}
                  </span>
                  <span>{exportFeedback}</span>
                </div>
              )}

              <button
                onClick={handleExecuteExport}
                disabled={isExporting}
                className="w-full py-3 bg-[#f2ca50] hover:bg-[#ffe088] text-[#141318] font-bold rounded-xl font-label-caps text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-md disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {encryptExport ? 'lock' : 'download'}
                </span>
                <span>
                  {isExporting
                    ? 'Chiffrement en cours...'
                    : encryptExport
                    ? 'Générer la Sauvegarde Chiffrée'
                    : 'Télécharger la Sauvegarde JSON'}
                </span>
              </button>
            </div>
          )}

          {/* TAB 2: RESTORE */}
          {activeTab === 'restore' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.regard"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 rounded-xl border-2 border-dashed border-[#f2ca50]/30 hover:border-[#f2ca50] bg-[#141318] flex flex-col items-center text-center gap-2 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[#f2ca50] text-[36px]">
                  upload_file
                </span>
                <span className="text-[13px] font-medium text-[#e5e1e8]">
                  {fileName ? `Fichier sélectionné : ${fileName}` : 'Cliquez pour choisir un fichier de sauvegarde (.json)'}
                </span>
                <span className="text-[11px] text-[#99907c]">
                  Prend en charge les sauvegardes chiffrées AES-GCM et les exports JSON de collection
                </span>
              </div>

              {/* Encrypted Passphrase Prompt */}
              {inspectionResult?.isEncrypted && inspectionResult?.needsPassphrase && (
                <div className="p-4 rounded-xl bg-[#201f24] border border-[#f2ca50]/30 space-y-3">
                  <div className="flex items-center gap-2 text-[#f2ca50]">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                    <span className="text-[13px] font-semibold">Sauvegarde chiffrée détectée</span>
                  </div>
                  <p className="text-[11.5px] text-[#d0c5af]">
                    Ce fichier a été sécurisé par AES-256. Veuillez entrer la phrase secrète définie lors de l'exportation pour le déchiffrer.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={restorePassphrase}
                      onChange={(e) => setRestorePassphrase(e.target.value)}
                      placeholder="Saisissez la phrase secrète..."
                      className="flex-1 bg-[#141318] text-[#e5e1e8] placeholder-[#99907c] border border-white/10 rounded-lg px-3 py-2 text-[12.5px] outline-none focus:border-[#f2ca50]/50"
                    />
                    <button
                      onClick={handleDecryptWithPassphrase}
                      className="px-4 py-2 bg-[#f2ca50] text-[#141318] font-bold rounded-lg text-[12px] font-label-caps uppercase cursor-pointer"
                    >
                      Déchiffrer
                    </button>
                  </div>
                  {inspectionResult.error && (
                    <div className="text-[11.5px] text-red-400 flex items-center gap-1.5 pt-1">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      <span>{inspectionResult.error}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Preview of Validated Content */}
              {inspectionResult && inspectionResult.valid && inspectionResult.decryptedData && (
                <div className="p-4 rounded-xl bg-[#141318] border border-green-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-400">
                      <span className="material-symbols-outlined text-[20px]">verified</span>
                      <span className="text-[13px] font-bold">Sauvegarde vérifiée avec succès</span>
                    </div>
                    {inspectionResult.exportedAt && (
                      <span className="text-[10.5px] text-[#99907c]">
                        Exportée le {new Date(inspectionResult.exportedAt).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>

                  <p className="text-[11.5px] text-[#d0c5af]">
                    Contenu authentifié prêt à être restauré dans votre base locale IndexedDB :
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="p-2 bg-[#201f24] rounded border border-white/5">
                      <span className="text-[#99907c] block">Toiles</span>
                      <span className="text-[#f2ca50] font-bold text-[13px]">
                        {inspectionResult.counts?.artworksCount ?? 0}
                      </span>
                    </div>
                    <div className="p-2 bg-[#201f24] rounded border border-white/5">
                      <span className="text-[#99907c] block">Favoris</span>
                      <span className="text-[#f2ca50] font-bold text-[13px]">
                        {inspectionResult.counts?.bookmarksCount ?? 0}
                      </span>
                    </div>
                    <div className="p-2 bg-[#201f24] rounded border border-white/5">
                      <span className="text-[#99907c] block">Notes d'étude</span>
                      <span className="text-[#f2ca50] font-bold text-[13px]">
                        {inspectionResult.counts?.notesCount ?? 0}
                      </span>
                    </div>
                    <div className="p-2 bg-[#201f24] rounded border border-white/5">
                      <span className="text-[#99907c] block">Visites réelles</span>
                      <span className="text-[#f2ca50] font-bold text-[13px]">
                        {inspectionResult.counts?.historyCount ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* Mode Selector */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <label className="block text-[11px] font-label-caps uppercase text-[#d0c5af]">
                      Mode de Restauration
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setRestoreMode('merge')}
                        className={`p-2.5 rounded-lg border text-left text-[11px] cursor-pointer transition-all ${
                          restoreMode === 'merge'
                            ? 'bg-[#201f24] border-[#f2ca50] text-[#f2ca50]'
                            : 'bg-[#141318] border-white/10 text-[#99907c]'
                        }`}
                      >
                        <strong className="block font-semibold">1. Fusionner (Recommandé)</strong>
                        <span>Conserve vos données actuelles et intègre la sauvegarde sans écrasement</span>
                      </button>
                      <button
                        onClick={() => setRestoreMode('replace')}
                        className={`p-2.5 rounded-lg border text-left text-[11px] cursor-pointer transition-all ${
                          restoreMode === 'replace'
                            ? 'bg-[#201f24] border-[#f2ca50] text-[#f2ca50]'
                            : 'bg-[#141318] border-white/10 text-[#99907c]'
                        }`}
                      >
                        <strong className="block font-semibold">2. Remplacer</strong>
                        <span>Écrase l'état local actuel par celui contenu dans la sauvegarde</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleExecuteRestore}
                    disabled={isRestoring}
                    className="w-full mt-2 py-3 bg-[#2ecc71] hover:bg-[#27ae60] text-black font-bold rounded-xl font-label-caps text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 disabled:opacity-50 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">restore</span>
                    <span>{isRestoring ? 'Restauration en cours...' : 'Appliquer la Restauration'}</span>
                  </button>
                </div>
              )}

              {restoreStatusMessage && (
                <div
                  className={`p-3 rounded-xl border text-[12px] flex items-center gap-2 ${
                    restoreStatusMessage.type === 'error'
                      ? 'bg-red-950/40 border-red-500/40 text-red-200'
                      : 'bg-green-950/40 border-green-500/40 text-green-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {restoreStatusMessage.type === 'error' ? 'error' : 'check_circle'}
                  </span>
                  <span>{restoreStatusMessage.text}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-[#201f24] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#99907c]">
            <span className="material-symbols-outlined text-[14px] text-[#f2ca50]">lock</span>
            <span>Standard Web Crypto W3C</span>
          </div>
          <button
            onClick={() => setIsBackupModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-[#2b292f] hover:bg-[#36343a] text-[#f2ca50] border border-[#f2ca50]/30 text-[12px] font-label-caps uppercase cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

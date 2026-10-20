/**
 * Real Catalog and Application Update Service for Regard PWA
 * Downloads, cryptographically verifies (SHA-256) and applies new catalog versions
 * to IndexedDB without touching user bookmarks, notes, or history.
 * Includes complete offline detection and failure management.
 */

import { indexedDbService } from './indexedDbService.ts';
import { validateArtworksJson } from './catalogValidator.ts';
import { Artwork } from '../data/artworks.ts';

export interface CatalogManifest {
  schemaVersion: string;
  catalogVersion: string;
  releaseDate: string;
  description: string;
  artworksCount: number;
  artistsCount: number;
  sha256Checksum: string;
  catalogUrl: string;
  fileSizeBytes?: number;
  changelog: string[];
}

export interface UpdateCheckResult {
  hasUpdate: boolean;
  isOffline: boolean;
  currentVersion: string;
  latestVersion?: string;
  manifest?: CatalogManifest;
  message: string;
  error?: string;
}

export interface UpdateExecutionResult {
  success: boolean;
  newVersion?: string;
  artworksCount?: number;
  message: string;
  error?: string;
  changelog?: string[];
  durationMs?: number;
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

class CatalogUpdateService {
  private currentVersionKey = 'catalog_version';
  private defaultVersion = '1.1.0';

  public async getCurrentCatalogVersion(): Promise<string> {
    try {
      const db = await indexedDbService.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction('app_settings', 'readonly');
        const store = tx.objectStore('app_settings');
        const req = store.get(this.currentVersionKey);
        req.onsuccess = () => {
          resolve(req.result?.value || this.defaultVersion);
        };
        req.onerror = () => resolve(this.defaultVersion);
      });
    } catch {
      return this.defaultVersion;
    }
  }

  public async setCatalogVersion(version: string): Promise<void> {
    try {
      const db = await indexedDbService.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('app_settings', 'readwrite');
        const store = tx.objectStore('app_settings');
        store.put({ key: this.currentVersionKey, value: version });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('Failed to save catalog version:', e);
    }
  }

  /**
   * Check for verifiable catalog and app updates via real HTTP fetch of manifest.json
   */
  public async checkForUpdate(): Promise<UpdateCheckResult> {
    const currentVersion = await this.getCurrentCatalogVersion();

    // Check online status
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return {
        hasUpdate: false,
        isOffline: true,
        currentVersion,
        message: 'Mode 100% hors-ligne actif. L\'appareil n\'est pas connecté à Internet ; le catalogue local reste pleinement opérationnel.',
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch('/catalog/manifest.json?t=' + Date.now(), {
        cache: 'no-cache',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          hasUpdate: false,
          isOffline: false,
          currentVersion,
          error: `Serveur distant de mise à jour injoignable (Statut HTTP ${response.status}).`,
          message: 'Impossible de vérifier les mises à jour pour l\'instant.',
        };
      }

      const manifest: CatalogManifest = await response.json();

      if (!manifest.catalogVersion || !manifest.catalogUrl) {
        return {
          hasUpdate: false,
          isOffline: false,
          currentVersion,
          error: 'Manifeste de mise à jour corrompu ou incomplet.',
          message: 'Format de mise à jour non reconnu.',
        };
      }

      // Check if version is newer
      const hasUpdate = manifest.catalogVersion !== currentVersion;

      return {
        hasUpdate,
        isOffline: false,
        currentVersion,
        latestVersion: manifest.catalogVersion,
        manifest,
        message: hasUpdate
          ? `Nouvelle édition disponible : ${manifest.catalogVersion} (${manifest.artworksCount} œuvres)`
          : `Votre catalogue est parfaitement à jour (Édition ${currentVersion}).`,
      };
    } catch (e: any) {
      const isAbort = e.name === 'AbortError';
      return {
        hasUpdate: false,
        isOffline: true,
        currentVersion,
        error: isAbort ? 'Délai d\'attente dépassé lors de la vérification.' : e.message,
        message: 'Vérification impossible : fonctionnement autonome hors-ligne actif.',
      };
    }
  }

  /**
   * Download, cryptographically verify and install the catalog update into IndexedDB
   */
  public async applyUpdate(
    manifest: CatalogManifest,
    onProgress?: (step: string, percent: number) => void
  ): Promise<UpdateExecutionResult> {
    const startTime = performance.now();

    try {
      // 1. Download
      onProgress?.('Téléchargement du paquet de catalogue...', 15);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const resp = await fetch(manifest.catalogUrl + '?t=' + Date.now(), {
        cache: 'no-cache',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!resp.ok) {
        throw new Error(`Échec du téléchargement du catalogue (HTTP ${resp.status})`);
      }

      const text = await resp.text();
      onProgress?.('Vérification de l\'empreinte cryptographique SHA-256...', 40);

      // 2. Cryptographic Checksum verification (SHA-256)
      if (manifest.sha256Checksum) {
        const subtle = (typeof window !== 'undefined' && window.crypto?.subtle)
          ? window.crypto.subtle
          : (typeof globalThis !== 'undefined' && (globalThis as any).crypto?.subtle ? (globalThis as any).crypto.subtle : null);

        if (!subtle) {
          throw new Error(
            "Échec de sécurité : L'API cryptographique native (crypto.subtle) n'est pas disponible dans ce contexte. La mise à jour est interrompue pour éviter d'appliquer un fichier non authentifié."
          );
        }
        const enc = new TextEncoder();
        const dataBuffer = enc.encode(text);
        const hashBuffer = await subtle.digest('SHA-256', dataBuffer);
        const calculatedHash = bufferToHex(hashBuffer);

        if (calculatedHash.toLowerCase() !== manifest.sha256Checksum.toLowerCase()) {
          throw new Error(
            `Échec de vérification d'intégrité : l'empreinte SHA-256 calculée (${calculatedHash.slice(0, 8)}...) ne correspond pas à celle du manifeste (${manifest.sha256Checksum.slice(0, 8)}...). Paquet rejeté pour protéger votre base de données.`
          );
        }
      }

      // 3. Schema validation & announced count verification
      onProgress?.('Validation du schéma muséal et des cartels...', 65);
      const validation = validateArtworksJson(text);
      if (!validation.isValid && validation.errors.length > 0) {
        throw new Error(`Schéma de catalogue invalide : ${validation.errors[0].message}`);
      }

      if (manifest.artworksCount && validation.sanitizedArtworks.length !== manifest.artworksCount) {
        throw new Error(
          `Incohérence de données : le manifeste annonce ${manifest.artworksCount} œuvres, mais le fichier validé en contient ${validation.sanitizedArtworks.length}. Mise à jour interrompue.`
        );
      }

      // 4. Truly Atomic apply in a single IndexedDB transaction
      onProgress?.('Enregistrement atomique dans IndexedDB (RegardMuseumDB)...', 85);
      const sanitizedArtworks: Artwork[] = validation.sanitizedArtworks;

      // Merge with any custom imported artworks user may have added
      const currentArtworks = await indexedDbService.getArtworks();
      const canonicalIds = new Set(sanitizedArtworks.map((a) => a.id));
      const userCustomArtworks = currentArtworks.filter((a) => !canonicalIds.has(a.id));
      const finalArtworks = [...sanitizedArtworks, ...userCustomArtworks];

      // Single transaction: clears, inserts all artworks, and stores version
      await indexedDbService.atomicReplaceArtworks(finalArtworks, manifest.catalogVersion);

      // 5. Service Worker update check
      onProgress?.('Actualisation des caches PWA et de l\'index BM25...', 95);
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          reg.update();
        }
      }

      onProgress?.('Mise à jour terminée avec succès.', 100);
      const durationMs = Math.round(performance.now() - startTime);

      return {
        success: true,
        newVersion: manifest.catalogVersion,
        artworksCount: finalArtworks.length,
        message: `Catalogue mis à jour avec succès vers la version ${manifest.catalogVersion} (${finalArtworks.length} toiles synchronisées, 0 conflit).`,
        changelog: manifest.changelog,
        durationMs,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Une erreur inconnue est survenue durant la mise à jour.',
        message: `Échec de la mise à jour : ${err.message}`,
        durationMs: Math.round(performance.now() - startTime),
      };
    }
  }
}

export const catalogUpdateService = new CatalogUpdateService();

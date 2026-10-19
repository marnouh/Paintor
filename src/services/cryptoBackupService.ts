/**
 * Cryptographic Backup and Restore Service for Regard PWA
 * Uses Web Crypto API standard (AES-GCM 256-bit + PBKDF2 SHA-256 with 100,000 iterations).
 * Zero external dependencies.
 */

import { indexedDbService, StoredBookmark, StoredHistoryItem, StoredNote } from './indexedDbService.ts';
import { Artwork } from '../data/artworks.ts';

export interface EncryptedBackupContainer {
  app: 'Regard — L\'Art de la Peinture';
  format: 'regard-secure-backup';
  version: 1;
  isEncrypted: true;
  encryption: {
    algorithm: 'AES-GCM';
    keyLength: 256;
    kdf: 'PBKDF2-SHA256';
    iterations: number;
    salt: string; // base64
    iv: string;   // base64
  };
  exportedAt: string;
  ciphertext: string; // base64
  summary?: {
    artworksCount: number;
    bookmarksCount: number;
    notesCount: number;
    historyCount: number;
    userPoints: number;
  };
}

export interface PlainBackupContainer {
  app: 'Regard — L\'Art de la Peinture';
  format: 'regard-backup';
  version: 1;
  isEncrypted: false;
  exportedAt: string;
  data: {
    artworks?: Artwork[];
    bookmarks?: StoredBookmark[];
    history?: StoredHistoryItem[];
    notes?: StoredNote[];
    progress?: { points: number; completedSteps: (string | number)[] };
    app_settings?: Record<string, any>;
  };
}

export type BackupFileContent = EncryptedBackupContainer | PlainBackupContainer | any;

export interface BackupInspectionResult {
  valid: boolean;
  isEncrypted: boolean;
  needsPassphrase: boolean;
  exportedAt?: string;
  error?: string;
  counts?: {
    artworksCount: number;
    bookmarksCount: number;
    notesCount: number;
    historyCount: number;
    userPoints: number;
  };
  decryptedData?: {
    artworks?: Artwork[];
    bookmarks?: StoredBookmark[];
    history?: StoredHistoryItem[];
    notes?: StoredNote[];
    progress?: { points: number; completedSteps: (string | number)[] };
    app_settings?: Record<string, any>;
  };
}

function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

class CryptoBackupService {
  private isCryptoAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.crypto && !!window.crypto.subtle;
  }

  /**
   * Derive a 256-bit AES-GCM CryptoKey from a passphrase using PBKDF2-SHA256
   */
  private async deriveKey(passphrase: string, salt: Uint8Array, iterations = 100000): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as BufferSource,
        iterations,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Export all user data from IndexedDB into a JSON string (either plain or AES-GCM encrypted)
   */
  public async exportBackup(passphrase?: string): Promise<{ jsonString: string; filename: string }> {
    const artworks = await indexedDbService.getArtworks();
    const bookmarks = await indexedDbService.getBookmarks();
    const history = await indexedDbService.getHistory();
    const notes = await indexedDbService.getNotes();
    const progress = await indexedDbService.getUserProgress();

    const dataPayload = {
      artworks,
      bookmarks,
      history,
      notes,
      progress,
    };

    const exportedAt = new Date().toISOString();
    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    if (passphrase && passphrase.trim().length > 0) {
      if (!this.isCryptoAvailable()) {
        throw new Error('L\'API Web Crypto n\'est pas disponible dans ce navigateur pour le chiffrement.');
      }

      // Generate random salt (16 bytes) and IV (12 bytes for AES-GCM)
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      const key = await this.deriveKey(passphrase.trim(), salt, 100000);
      const enc = new TextEncoder();
      const plaintextBuffer = enc.encode(JSON.stringify(dataPayload));

      const ciphertextBuffer = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv as BufferSource,
        },
        key,
        plaintextBuffer
      );

      const encryptedContainer: EncryptedBackupContainer = {
        app: 'Regard — L\'Art de la Peinture',
        format: 'regard-secure-backup',
        version: 1,
        isEncrypted: true,
        encryption: {
          algorithm: 'AES-GCM',
          keyLength: 256,
          kdf: 'PBKDF2-SHA256',
          iterations: 100000,
          salt: bufferToBase64(salt),
          iv: bufferToBase64(iv),
        },
        exportedAt,
        ciphertext: bufferToBase64(ciphertextBuffer),
        summary: {
          artworksCount: artworks.length,
          bookmarksCount: bookmarks.length,
          notesCount: notes.length,
          historyCount: history.length,
          userPoints: progress.points || 0,
        },
      };

      return {
        jsonString: JSON.stringify(encryptedContainer, null, 2),
        filename: `regard-sauvegarde-securisee-${timestampStr}.regard.json`,
      };
    } else {
      // Plain backup
      const plainContainer: PlainBackupContainer = {
        app: 'Regard — L\'Art de la Peinture',
        format: 'regard-backup',
        version: 1,
        isEncrypted: false,
        exportedAt,
        data: dataPayload,
      };

      return {
        jsonString: JSON.stringify(plainContainer, null, 2),
        filename: `regard-sauvegarde-${timestampStr}.json`,
      };
    }
  }

  /**
   * Inspect and decrypt a backup file.
   * If the file is encrypted and no passphrase (or wrong passphrase) is given, returns appropriate status.
   */
  public async inspectBackup(rawText: string, passphrase?: string): Promise<BackupInspectionResult> {
    try {
      const parsed = JSON.parse(rawText);

      // 1. Detect if it's an encrypted container
      if (parsed.format === 'regard-secure-backup' && parsed.isEncrypted === true) {
        if (!passphrase || passphrase.trim().length === 0) {
          return {
            valid: true,
            isEncrypted: true,
            needsPassphrase: true,
            exportedAt: parsed.exportedAt,
            counts: parsed.summary,
          };
        }

        // Try decrypting with passphrase
        try {
          const salt = base64ToBuffer(parsed.encryption.salt);
          const iv = base64ToBuffer(parsed.encryption.iv);
          const iterations = parsed.encryption.iterations || 100000;
          const ciphertext = base64ToBuffer(parsed.ciphertext);

          const key = await this.deriveKey(passphrase.trim(), salt, iterations);
          const decryptedBuffer = await window.crypto.subtle.decrypt(
            {
              name: 'AES-GCM',
              iv: iv as BufferSource,
            },
            key,
            ciphertext as unknown as BufferSource
          );

          const dec = new TextDecoder();
          const decryptedJson = dec.decode(decryptedBuffer);
          const decryptedData = JSON.parse(decryptedJson);

          return {
            valid: true,
            isEncrypted: true,
            needsPassphrase: false,
            exportedAt: parsed.exportedAt,
            decryptedData,
            counts: {
              artworksCount: Array.isArray(decryptedData.artworks) ? decryptedData.artworks.length : 0,
              bookmarksCount: Array.isArray(decryptedData.bookmarks) ? decryptedData.bookmarks.length : 0,
              notesCount: Array.isArray(decryptedData.notes) ? decryptedData.notes.length : 0,
              historyCount: Array.isArray(decryptedData.history) ? decryptedData.history.length : 0,
              userPoints: decryptedData.progress?.points ?? 0,
            },
          };
        } catch (decryptErr) {
          return {
            valid: false,
            isEncrypted: true,
            needsPassphrase: true,
            error: 'Phrase secrète incorrecte ou fichier altéré (échec de déchiffrement AES-GCM).',
          };
        }
      }

      // 2. Unencrypted standard container
      if (parsed.data || parsed.format === 'regard-backup') {
        const data = parsed.data || parsed;
        return {
          valid: true,
          isEncrypted: false,
          needsPassphrase: false,
          exportedAt: parsed.exportedAt || parsed.exportDate,
          decryptedData: data,
          counts: {
            artworksCount: Array.isArray(data.artworks) ? data.artworks.length : 0,
            bookmarksCount: Array.isArray(data.bookmarks) ? data.bookmarks.length : 0,
            notesCount: Array.isArray(data.notes) ? data.notes.length : 0,
            historyCount: Array.isArray(data.history) ? data.history.length : 0,
            userPoints: data.progress?.points ?? 0,
          },
        };
      }

      // 3. Fallback: Array of artworks or legacy JSON
      if (Array.isArray(parsed)) {
        return {
          valid: true,
          isEncrypted: false,
          needsPassphrase: false,
          decryptedData: { artworks: parsed },
          counts: {
            artworksCount: parsed.length,
            bookmarksCount: 0,
            notesCount: 0,
            historyCount: 0,
            userPoints: 0,
          },
        };
      }

      return {
        valid: false,
        isEncrypted: false,
        needsPassphrase: false,
        error: 'Format de fichier non reconnu. Veuillez fournir une sauvegarde Regard valide.',
      };
    } catch (e: any) {
      return {
        valid: false,
        isEncrypted: false,
        needsPassphrase: false,
        error: `Fichier JSON invalide : ${e.message}`,
      };
    }
  }

  /**
   * Apply validated data to IndexedDB
   */
  /**
   * Apply validated data to IndexedDB in a SINGLE atomic transaction across all stores.
   * Performs structural validation of each store before applying any mutations.
   * If any step fails or is aborted, all stores roll back completely.
   */
  public async restoreData(
    data: any,
    mode: 'merge' | 'replace'
  ): Promise<{ success: boolean; message: string; details: any }> {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('Données de sauvegarde invalides ou corrompues (objet manquant).');
      }

      // --- 1. Structural validation of stores ---
      const validatedBookmarks: StoredBookmark[] = [];
      if (Array.isArray(data.bookmarks)) {
        for (const b of data.bookmarks) {
          const artworkId = typeof b === 'string' ? b.trim() : (b?.artworkId ? String(b.artworkId).trim() : null);
          if (artworkId && artworkId.length > 0) {
            validatedBookmarks.push({
              artworkId,
              addedAt: typeof b?.addedAt === 'number' && !isNaN(b.addedAt) ? b.addedAt : Date.now(),
            });
          }
        }
      }

      const validatedHistory: StoredHistoryItem[] = [];
      if (Array.isArray(data.history)) {
        for (const h of data.history) {
          if (h && typeof h.artworkId === 'string' && h.artworkId.trim().length > 0) {
            validatedHistory.push({
              artworkId: h.artworkId.trim(),
              lastVisitedAt: typeof h.lastVisitedAt === 'number' && !isNaN(h.lastVisitedAt) ? h.lastVisitedAt : Date.now(),
              visitCount: typeof h.visitCount === 'number' && h.visitCount > 0 ? Math.floor(h.visitCount) : 1,
              readMinutes: typeof h.readMinutes === 'number' && h.readMinutes > 0 ? Math.floor(h.readMinutes) : 2,
            });
          }
        }
      }

      const validatedNotes: StoredNote[] = [];
      if (Array.isArray(data.notes)) {
        for (const n of data.notes) {
          if (n && typeof n.id === 'string' && typeof n.content === 'string') {
            validatedNotes.push({
              id: n.id,
              artworkId: n.artworkId ? String(n.artworkId) : undefined,
              title: typeof n.title === 'string' ? n.title : 'Note de contemplation',
              content: n.content,
              createdAt: typeof n.createdAt === 'number' ? n.createdAt : Date.now(),
              updatedAt: typeof n.updatedAt === 'number' ? n.updatedAt : Date.now(),
            });
          }
        }
      }

      let validatedProgress: { points: number; completedSteps: number[] } | undefined = undefined;
      if (data.progress && typeof data.progress === 'object') {
        const rawPoints = Number(data.progress.points);
        const points = !isNaN(rawPoints) && rawPoints >= 0 ? Math.floor(rawPoints) : 0;
        const steps: number[] = [];
        if (Array.isArray(data.progress.completedSteps)) {
          for (const s of data.progress.completedSteps) {
            const stepNum = Number(s);
            if (!isNaN(stepNum) && stepNum >= 0) steps.push(Math.floor(stepNum));
          }
        }
        validatedProgress = { points, completedSteps: steps };
      }

      const validatedArtworks: Artwork[] = [];
      if (Array.isArray(data.artworks)) {
        for (const a of data.artworks) {
          if (a && typeof a.id === 'string' && typeof a.title === 'string') {
            validatedArtworks.push(a);
          }
        }
      }

      // --- 2. Calculate Final Payloads (Merge vs Replace) in memory ---
      let finalBookmarks = validatedBookmarks;
      let finalHistory = validatedHistory;
      let finalNotes = validatedNotes;
      let finalProgress = validatedProgress;
      let finalArtworks = validatedArtworks;

      if (mode === 'merge') {
        // Bookmarks merge
        const currentBookmarks = await indexedDbService.getBookmarks();
        const bMap = new Map<string, StoredBookmark>();
        for (const b of currentBookmarks) bMap.set(b.artworkId, b);
        for (const b of validatedBookmarks) bMap.set(b.artworkId, b);
        finalBookmarks = Array.from(bMap.values());

        // History merge
        const currentHistory = await indexedDbService.getHistory();
        const hMap = new Map<string, StoredHistoryItem>();
        for (const h of currentHistory) hMap.set(h.artworkId, h);
        for (const h of validatedHistory) {
          const existing = hMap.get(h.artworkId);
          hMap.set(h.artworkId, {
            artworkId: h.artworkId,
            lastVisitedAt: Math.max(existing?.lastVisitedAt || 0, h.lastVisitedAt),
            visitCount: (existing?.visitCount || 0) + h.visitCount,
            readMinutes: (existing?.readMinutes || 0) + h.readMinutes,
          });
        }
        finalHistory = Array.from(hMap.values());

        // Notes merge
        const currentNotes = await indexedDbService.getNotes();
        const nMap = new Map<string, StoredNote>();
        for (const n of currentNotes) nMap.set(n.id, n);
        for (const n of validatedNotes) nMap.set(n.id, n);
        finalNotes = Array.from(nMap.values());

        // Progress merge
        const currentProg = await indexedDbService.getUserProgress();
        const mergedPoints = Math.max(currentProg.points || 0, validatedProgress?.points || 0);
        const stepsSet = new Set<number>(currentProg.completedSteps || []);
        if (validatedProgress) {
          for (const s of validatedProgress.completedSteps) stepsSet.add(s);
        }
        finalProgress = { points: mergedPoints, completedSteps: Array.from(stepsSet) };

        // Artworks merge
        if (validatedArtworks.length > 0) {
          const currentArts = await indexedDbService.getArtworks();
          const aMap = new Map<string, Artwork>();
          for (const a of currentArts) aMap.set(a.id, a);
          for (const a of validatedArtworks) aMap.set(a.id, a);
          finalArtworks = Array.from(aMap.values());
        }
      }

      // --- 3. Execute Truly Atomic Transaction in IndexedDB ---
      await indexedDbService.atomicRestoreAllUserData(
        {
          bookmarks: finalBookmarks,
          history: finalHistory,
          notes: finalNotes,
          progress: finalProgress,
          artworks: finalArtworks.length > 0 ? finalArtworks : undefined,
        },
        mode
      );

      // --- 4. Synchronize with localStorage for instant reactivity across restarts ---
      try {
        localStorage.setItem(
          'regard_bookmarks',
          JSON.stringify(finalBookmarks.map((b) => b.artworkId))
        );
        localStorage.setItem('regard_history', JSON.stringify(finalHistory));
        if (finalProgress) {
          localStorage.setItem('regard_points', String(finalProgress.points));
          localStorage.setItem('regard_completed_steps', JSON.stringify(finalProgress.completedSteps));
        }
      } catch (storageErr) {
        console.warn('LocalStorage sync warning:', storageErr);
      }

      const details = {
        artworksUpdated: finalArtworks.length,
        bookmarksRestored: finalBookmarks.length,
        notesRestored: finalNotes.length,
        historyRestored: finalHistory.length,
        progressRestored: !!finalProgress,
      };

      return {
        success: true,
        message: `Restauration atomique réussie (${mode === 'merge' ? 'fusion' : 'remplacement'}). Base de données synchronisée et intègre.`,
        details,
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Échec de la restauration (opération annulée sans perte de données) : ${e.message}`,
        details: null,
      };
    }
  }
}

export const cryptoBackupService = new CryptoBackupService();

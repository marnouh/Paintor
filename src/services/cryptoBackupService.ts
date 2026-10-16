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
  public async restoreData(
    data: any,
    mode: 'merge' | 'replace'
  ): Promise<{ success: boolean; message: string; details: any }> {
    try {
      const details = {
        artworksUpdated: 0,
        bookmarksRestored: 0,
        notesRestored: 0,
        historyRestored: 0,
        progressRestored: false,
      };

      // 1. Artworks
      if (Array.isArray(data.artworks) && data.artworks.length > 0) {
        if (mode === 'replace') {
          await indexedDbService.saveArtworks(data.artworks);
          details.artworksUpdated = data.artworks.length;
        } else {
          // Merge artworks
          const current = await indexedDbService.getArtworks();
          const map = new Map<string, Artwork>();
          for (const a of current) map.set(a.id, a);
          for (const a of data.artworks) map.set(a.id, a);
          const merged = Array.from(map.values());
          await indexedDbService.saveArtworks(merged);
          details.artworksUpdated = merged.length;
        }
      }

      // 2. Bookmarks
      if (Array.isArray(data.bookmarks)) {
        if (mode === 'replace') {
          await indexedDbService.clearStore('bookmarks');
          await indexedDbService.bulkPutItems('bookmarks', data.bookmarks);
          details.bookmarksRestored = data.bookmarks.length;
        } else {
          // Merge bookmarks
          const current = await indexedDbService.getBookmarks();
          const map = new Map<string, StoredBookmark>();
          for (const b of current) map.set(b.artworkId, b);
          for (const b of data.bookmarks) {
            const id = typeof b === 'string' ? b : b.artworkId;
            if (id) {
              map.set(id, { artworkId: id, addedAt: b.addedAt || Date.now() });
            }
          }
          const merged = Array.from(map.values());
          await indexedDbService.clearStore('bookmarks');
          await indexedDbService.bulkPutItems('bookmarks', merged);
          details.bookmarksRestored = merged.length;
        }
      }

      // 3. History
      if (Array.isArray(data.history)) {
        if (mode === 'replace') {
          await indexedDbService.clearStore('history');
          await indexedDbService.bulkPutItems('history', data.history);
          details.historyRestored = data.history.length;
        } else {
          const current = await indexedDbService.getHistory();
          const map = new Map<string, StoredHistoryItem>();
          for (const h of current) map.set(h.artworkId, h);
          for (const h of data.history) {
            if (h.artworkId) {
              const existing = map.get(h.artworkId);
              map.set(h.artworkId, {
                artworkId: h.artworkId,
                lastVisitedAt: Math.max(existing?.lastVisitedAt || 0, h.lastVisitedAt || 0),
                visitCount: (existing?.visitCount || 0) + (h.visitCount || 1),
                readMinutes: (existing?.readMinutes || 0) + (h.readMinutes || 2),
              });
            }
          }
          const merged = Array.from(map.values());
          await indexedDbService.clearStore('history');
          await indexedDbService.bulkPutItems('history', merged);
          details.historyRestored = merged.length;
        }
      }

      // 4. Notes
      if (Array.isArray(data.notes)) {
        if (mode === 'replace') {
          await indexedDbService.clearStore('notes');
          await indexedDbService.bulkPutItems('notes', data.notes);
          details.notesRestored = data.notes.length;
        } else {
          const current = await indexedDbService.getNotes();
          const map = new Map<string, StoredNote>();
          for (const n of current) map.set(n.id, n);
          for (const n of data.notes) {
            if (n.id) map.set(n.id, n);
          }
          const merged = Array.from(map.values());
          await indexedDbService.clearStore('notes');
          await indexedDbService.bulkPutItems('notes', merged);
          details.notesRestored = merged.length;
        }
      }

      // 5. User Progress
      if (data.progress) {
        const currentProgress = await indexedDbService.getUserProgress();
        const newPoints = mode === 'replace'
          ? (data.progress.points || 0)
          : Math.max(currentProgress.points || 0, data.progress.points || 0);

        const currentSteps = new Set(currentProgress.completedSteps || []);
        if (Array.isArray(data.progress.completedSteps)) {
          for (const s of data.progress.completedSteps) currentSteps.add(s);
        }

        await indexedDbService.saveUserProgress(newPoints, Array.from(currentSteps));
        details.progressRestored = true;
      }

      return {
        success: true,
        message: 'Restauration effectuée avec succès dans IndexedDB.',
        details,
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Erreur durant l'application de la restauration : ${e.message}`,
        details: null,
      };
    }
  }
}

export const cryptoBackupService = new CryptoBackupService();

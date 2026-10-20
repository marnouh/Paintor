/**
 * IndexedDB Service for Regard - PWA Local Architecture
 * Database: RegardMuseumDB (v1)
 * ObjectStores:
 *  - artworks: Catalog of artworks (210 canonical + user imports)
 *  - artists: Biographical profiles of painters (105+ artists)
 *  - bookmarks: Saved artworks with added timestamps
 *  - history: Real visited artworks with timestamps and read duration (starts empty)
 *  - notes: User curatorial study notes
 *  - user_progress: Points, badges, completed steps
 *  - app_settings: User preferences & display flags
 */

import { ARTWORKS, Artwork } from '../data/artworks.ts';
import { ARTISTS, Artist } from '../data/artists.ts';

export interface StoredBookmark {
  artworkId: string;
  addedAt: number;
}

export interface StoredHistoryItem {
  artworkId: string;
  lastVisitedAt: number;
  visitCount: number;
  readMinutes: number;
}

export interface StoredNote {
  id: string;
  artworkId?: string;
  title?: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface StorageDiagnostics {
  driver: 'IndexedDB';
  databaseName: string;
  version: number;
  isAvailable: boolean;
  stores: {
    artworksCount: number;
    artistsCount: number;
    bookmarksCount: number;
    historyCount: number;
    notesCount: number;
  };
  storageQuota?: {
    usageBytes: number;
    quotaBytes: number;
    usageFormatted: string;
    quotaFormatted: string;
    percentUsed: number;
  };
}

const DB_NAME = 'RegardMuseumDB';
const DB_VERSION = 1;

class IndexedDbService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  public isSupported(): boolean {
    return (
      typeof indexedDB !== 'undefined' ||
      (typeof window !== 'undefined' && 'indexedDB' in window)
    );
  }

  public async closeDb(): Promise<void> {
    if (this.dbPromise) {
      try {
        const db = await this.dbPromise;
        db.close();
      } catch {
        // ignore
      }
      this.dbPromise = null;
    }
  }

  public getDb(): Promise<IDBDatabase> {
    if (!this.isSupported()) {
      return Promise.reject(new Error('IndexedDB is not supported in this environment.'));
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
        const idb = (typeof window !== 'undefined' && window.indexedDB) ? window.indexedDB : indexedDB;
        const request = idb.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // 1. Artworks store
          if (!db.objectStoreNames.contains('artworks')) {
            const artStore = db.createObjectStore('artworks', { keyPath: 'id' });
            artStore.createIndex('artist', 'artist', { unique: false });
            artStore.createIndex('movement', 'movement', { unique: false });
            artStore.createIndex('period', 'period', { unique: false });
            artStore.createIndex('year', 'year', { unique: false });
          }

          // 2. Artists store
          if (!db.objectStoreNames.contains('artists')) {
            const artistStore = db.createObjectStore('artists', { keyPath: 'id' });
            artistStore.createIndex('name', 'name', { unique: false });
          }

          // 3. Bookmarks store
          if (!db.objectStoreNames.contains('bookmarks')) {
            db.createObjectStore('bookmarks', { keyPath: 'artworkId' });
          }

          // 4. Real History store
          if (!db.objectStoreNames.contains('history')) {
            db.createObjectStore('history', { keyPath: 'artworkId' });
          }

          // 5. Notes store
          if (!db.objectStoreNames.contains('notes')) {
            const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
            noteStore.createIndex('artworkId', 'artworkId', { unique: false });
            noteStore.createIndex('createdAt', 'createdAt', { unique: false });
          }

          // 6. User progress store (points, levels, steps)
          if (!db.objectStoreNames.contains('user_progress')) {
            db.createObjectStore('user_progress', { keyPath: 'key' });
          }

          // 7. App settings store
          if (!db.objectStoreNames.contains('app_settings')) {
            db.createObjectStore('app_settings', { keyPath: 'key' });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    }

    return this.dbPromise;
  }

  // --- Initial Seeding & Migration ---

  public async initAndSeed(): Promise<void> {
    const db = await this.getDb();

    // 1. Check if artworks exist
    const artworkCount = await this.count('artworks');
    if (artworkCount === 0) {
      // Check legacy localStorage for custom catalog
      let initialArtworks = ARTWORKS;
      try {
        const saved = localStorage.getItem('regard_custom_catalog');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            initialArtworks = parsed;
          }
        }
      } catch (e) {
        console.warn('Legacy localStorage custom catalog read error:', e);
      }

      await this.bulkPut('artworks', initialArtworks);
    }

    // 2. Check if artists exist
    const artistCount = await this.count('artists');
    if (artistCount === 0) {
      await this.bulkPut('artists', ARTISTS);
    }

    // 3. Migrate legacy bookmarks if empty
    const bookmarkCount = await this.count('bookmarks');
    if (bookmarkCount === 0) {
      try {
        const savedBookmarks = localStorage.getItem('regard_bookmarks');
        if (savedBookmarks) {
          const ids: string[] = JSON.parse(savedBookmarks);
          if (Array.isArray(ids) && ids.length > 0) {
            const bookmarkObjects: StoredBookmark[] = ids.map((id, idx) => ({
              artworkId: id,
              addedAt: Date.now() - (ids.length - idx) * 3600000,
            }));
            await this.bulkPut('bookmarks', bookmarkObjects);
          }
        }
      } catch (e) {
        console.warn('Legacy bookmark migration error:', e);
      }
    }

    // 4. Migrate legacy points if progress empty
    const progressCount = await this.count('user_progress');
    if (progressCount === 0) {
      try {
        const savedPoints = localStorage.getItem('regard_points');
        const points = savedPoints ? Number(savedPoints) : 0;
        await this.setKeyVal('user_progress', 'points', points);
        await this.setKeyVal('user_progress', 'completedSteps', []);
      } catch (e) {
        console.warn('Legacy progress migration error:', e);
      }
    }

    // 5. Notes store starts clean and empty for new users (no artificial notes)
  }

  // --- Generic Helpers ---

  private async count(storeName: string): Promise<number> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  private async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  }

  private async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error);
    });
  }

  private async put<T>(storeName: string, item: T): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  private async bulkPut<T>(storeName: string, items: T[]): Promise<void> {
    if (items.length === 0) return;
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      for (const item of items) {
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  private async delete(storeName: string, key: IDBValidKey): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  private async clear(storeName: string): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  private async getKeyVal<T>(storeName: string, key: string): Promise<T | undefined> {
    const res = await this.get<{ key: string; value: T }>(storeName, key);
    return res?.value;
  }

  private async setKeyVal<T>(storeName: string, key: string, value: T): Promise<void> {
    await this.put(storeName, { key, value });
  }

  // --- Artworks Operations ---

  public async getArtworks(): Promise<Artwork[]> {
    const arts = await this.getAll<Artwork>('artworks');
    return arts.length > 0 ? arts : ARTWORKS;
  }

  /**
   * Atomically replaces the artworks catalog in a SINGLE IndexedDB transaction.
   * If any step fails or the transaction is interrupted, the transaction aborts
   * and rolls back automatically, preventing an empty or corrupted catalog state.
   */
  public async atomicReplaceArtworks(artworks: Artwork[], version?: string): Promise<void> {
    const db = await this.getDb();
    const stores = version ? ['artworks', 'app_settings'] : ['artworks'];

    return new Promise((resolve, reject) => {
      const tx = db.transaction(stores, 'readwrite');
      const artStore = tx.objectStore('artworks');

      tx.onerror = () => {
        reject(tx.error || new Error('Erreur transactionnelle lors du remplacement atomique du catalogue.'));
      };

      tx.onabort = () => {
        reject(new Error('Transaction IndexedDB annulée : le catalogue antérieur a été préservé intact.'));
      };

      tx.oncomplete = () => {
        resolve();
      };

      // 1. Clear within the atomic transaction
      artStore.clear();

      // 2. Bulk insert all artworks in the same atomic transaction
      for (const artwork of artworks) {
        artStore.put(artwork);
      }

      // 3. Record new catalog version atomically in the same transaction
      if (version) {
        const settingsStore = tx.objectStore('app_settings');
        settingsStore.put({ key: 'catalog_version', value: version });
      }
    });
  }

  public async saveArtworks(artworks: Artwork[]): Promise<void> {
    await this.atomicReplaceArtworks(artworks);
  }

  public async addOrUpdateArtworks(artworks: Artwork[]): Promise<void> {
    await this.bulkPut('artworks', artworks);
  }

  public async resetArtworksToDefault(): Promise<void> {
    await this.atomicReplaceArtworks(ARTWORKS, '1.1.0');
  }

  // --- Artists Operations ---

  public async getArtists(): Promise<Artist[]> {
    const artists = await this.getAll<Artist>('artists');
    return artists.length > 0 ? artists : ARTISTS;
  }

  public async saveArtists(artists: Artist[]): Promise<void> {
    await this.clear('artists');
    await this.bulkPut('artists', artists);
  }

  // --- Bookmarks Operations ---

  public async getBookmarkIds(): Promise<string[]> {
    const items = await this.getAll<StoredBookmark>('bookmarks');
    // Sort most recent first
    return items.sort((a, b) => b.addedAt - a.addedAt).map((b) => b.artworkId);
  }

  public async getBookmarks(): Promise<StoredBookmark[]> {
    return this.getAll<StoredBookmark>('bookmarks');
  }

  public async clearStore(storeName: string): Promise<void> {
    await this.clear(storeName);
  }

  public async bulkPutItems<T>(storeName: string, items: T[]): Promise<void> {
    await this.bulkPut(storeName, items);
  }

  public async addBookmark(artworkId: string): Promise<void> {
    await this.put<StoredBookmark>('bookmarks', {
      artworkId,
      addedAt: Date.now(),
    });
  }

  public async removeBookmark(artworkId: string): Promise<void> {
    await this.delete('bookmarks', artworkId);
  }

  public async toggleBookmark(artworkId: string): Promise<boolean> {
    const existing = await this.get<StoredBookmark>('bookmarks', artworkId);
    if (existing) {
      await this.delete('bookmarks', artworkId);
      return false;
    } else {
      await this.put<StoredBookmark>('bookmarks', {
        artworkId,
        addedAt: Date.now(),
      });
      return true;
    }
  }

  // --- Real History Operations ---

  public async getHistory(): Promise<StoredHistoryItem[]> {
    const items = await this.getAll<StoredHistoryItem>('history');
    return items.sort((a, b) => b.lastVisitedAt - a.lastVisitedAt);
  }

  public async recordVisit(artworkId: string, readMinutes: number = 2): Promise<void> {
    const existing = await this.get<StoredHistoryItem>('history', artworkId);
    const updated: StoredHistoryItem = {
      artworkId,
      lastVisitedAt: Date.now(),
      visitCount: (existing?.visitCount || 0) + 1,
      readMinutes: Math.max(existing?.readMinutes || 0, readMinutes),
    };
    await this.put<StoredHistoryItem>('history', updated);
  }

  public async clearHistory(): Promise<void> {
    await this.clear('history');
  }

  // --- Notes Operations ---

  public async getNotes(): Promise<StoredNote[]> {
    const notes = await this.getAll<StoredNote>('notes');
    return notes.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  public async saveNote(content: string, title?: string, artworkId?: string, noteId?: string): Promise<StoredNote> {
    const id = noteId || `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const note: StoredNote = {
      id,
      artworkId,
      title: title || 'Note de contemplation',
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await this.put<StoredNote>('notes', note);
    return note;
  }

  public async deleteNote(id: string): Promise<void> {
    await this.delete('notes', id);
  }

  /**
   * Atomically restores user data (bookmarks, history, notes, user_progress, and optional artworks)
   * in a single readwrite IndexedDB transaction.
   * If any step errors or the transaction aborts, all stores roll back automatically.
   */
  public async atomicRestoreAllUserData(
    payload: {
      bookmarks?: StoredBookmark[];
      history?: StoredHistoryItem[];
      notes?: StoredNote[];
      progress?: { points: number; completedSteps: number[] };
      artworks?: Artwork[];
    },
    mode: 'merge' | 'replace'
  ): Promise<void> {
    const db = await this.getDb();
    const storeNames: string[] = ['bookmarks', 'history', 'notes', 'user_progress'];
    if (payload.artworks && payload.artworks.length > 0) {
      storeNames.push('artworks');
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeNames, 'readwrite');

      tx.onerror = () => {
        reject(tx.error || new Error('Erreur transactionnelle lors de la restauration atomique.'));
      };

      tx.onabort = () => {
        reject(new Error('Transaction de restauration annulée : les données précédentes sont restées intactes.'));
      };

      tx.oncomplete = () => {
        resolve();
      };

      // 1. Bookmarks
      if (payload.bookmarks) {
        const bStore = tx.objectStore('bookmarks');
        if (mode === 'replace') bStore.clear();
        for (const b of payload.bookmarks) {
          bStore.put(b);
        }
      }

      // 2. History
      if (payload.history) {
        const hStore = tx.objectStore('history');
        if (mode === 'replace') hStore.clear();
        for (const h of payload.history) {
          hStore.put(h);
        }
      }

      // 3. Notes
      if (payload.notes) {
        const nStore = tx.objectStore('notes');
        if (mode === 'replace') nStore.clear();
        for (const n of payload.notes) {
          nStore.put(n);
        }
      }

      // 4. Progress
      if (payload.progress) {
        const pStore = tx.objectStore('user_progress');
        pStore.put({ key: 'points', value: payload.progress.points });
        pStore.put({ key: 'completedSteps', value: payload.progress.completedSteps });
        // Also persist legacy snake_case alias for absolute backward-compatibility
        pStore.put({ key: 'completed_steps', value: payload.progress.completedSteps });
      }

      // 5. Artworks (if present)
      if (payload.artworks && payload.artworks.length > 0) {
        const aStore = tx.objectStore('artworks');
        if (mode === 'replace') aStore.clear();
        for (const a of payload.artworks) {
          aStore.put(a);
        }
      }
    });
  }

  // --- User Progress (Points, Steps) ---

  public async getUserProgress(): Promise<{ points: number; completedSteps: number[] }> {
    const points = (await this.getKeyVal<number>('user_progress', 'points')) ?? 0;
    const completedSteps =
      (await this.getKeyVal<number[]>('user_progress', 'completedSteps')) ??
      (await this.getKeyVal<number[]>('user_progress', 'completed_steps')) ??
      [];
    return { points, completedSteps };
  }

  public async saveUserProgress(points: number, completedSteps: number[]): Promise<void> {
    await this.setKeyVal('user_progress', 'points', points);
    await this.setKeyVal('user_progress', 'completedSteps', completedSteps);
    await this.setKeyVal('user_progress', 'completed_steps', completedSteps);
  }

  // --- Diagnostics & Storage Metrics ---

  public async getDiagnostics(): Promise<StorageDiagnostics> {
    const artworksCount = await this.count('artworks').catch(() => 0);
    const artistsCount = await this.count('artists').catch(() => 0);
    const bookmarksCount = await this.count('bookmarks').catch(() => 0);
    const historyCount = await this.count('history').catch(() => 0);
    const notesCount = await this.count('notes').catch(() => 0);

    let storageQuota: StorageDiagnostics['storageQuota'] = undefined;
    if (typeof navigator !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const usageBytes = estimate.usage || 0;
        const quotaBytes = estimate.quota || 0;
        const percentUsed = quotaBytes > 0 ? (usageBytes / quotaBytes) * 100 : 0;
        storageQuota = {
          usageBytes,
          quotaBytes,
          usageFormatted: `${(usageBytes / (1024 * 1024)).toFixed(2)} Mo`,
          quotaFormatted: `${(quotaBytes / (1024 * 1024 * 1024)).toFixed(1)} Go`,
          percentUsed: Number(percentUsed.toFixed(2)),
        };
      } catch (e) {
        console.warn('Storage estimate failed:', e);
      }
    }

    return {
      driver: 'IndexedDB',
      databaseName: DB_NAME,
      version: DB_VERSION,
      isAvailable: this.isSupported(),
      stores: {
        artworksCount,
        artistsCount,
        bookmarksCount,
        historyCount,
        notesCount,
      },
      storageQuota,
    };
  }

  // --- Full Backup Export & Import ---

  public async exportCompleteDatabaseJson(): Promise<string> {
    const artworks = await this.getArtworks();
    const artists = await this.getArtists();
    const bookmarks = await this.getAll<StoredBookmark>('bookmarks');
    const history = await this.getAll<StoredHistoryItem>('history');
    const notes = await this.getNotes();
    const progress = await this.getUserProgress();
    const diagnostics = await this.getDiagnostics();

    const backup = {
      app: 'Regard - L Art de la Peinture',
      exportDate: new Date().toISOString(),
      storageEngine: 'IndexedDB (RegardMuseumDB v1)',
      diagnostics,
      data: {
        artworks,
        artists,
        bookmarks,
        history,
        notes,
        progress,
      },
    };

    return JSON.stringify(backup, null, 2);
  }

  public async importCompleteDatabaseJson(jsonString: string): Promise<{ success: boolean; message: string; count: number }> {
    try {
      const parsed = JSON.parse(jsonString);
      const data = parsed.data || parsed;

      const artworks = Array.isArray(data.artworks) ? data.artworks : undefined;
      const bookmarks = Array.isArray(data.bookmarks) ? data.bookmarks : undefined;
      const history = Array.isArray(data.history) ? data.history : undefined;
      const notes = Array.isArray(data.notes) ? data.notes : undefined;
      const progress = data.progress ? { points: data.progress.points || 0, completedSteps: data.progress.completedSteps || [] } : undefined;

      await this.atomicRestoreAllUserData(
        {
          artworks,
          bookmarks,
          history,
          notes,
          progress,
        },
        'replace'
      );

      if (Array.isArray(data.artists) && data.artists.length > 0) {
        await this.saveArtists(data.artists);
      }

      const artworkCount = artworks ? artworks.length : 0;
      return {
        success: true,
        message: `Restauration atomique réussie dans IndexedDB (${artworkCount} œuvres indexées).`,
        count: artworkCount,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Erreur transactionnelle lors de l'import : ${err.message}`,
        count: 0,
      };
    }
  }
}

export const indexedDbService = new IndexedDbService();

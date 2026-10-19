/**
 * Offline Sync and Storage Management Service
 * Provides complete pre-caching of artwork images and audio assets,
 * calculates storage quota (navigator.storage.estimate),
 * and tracks offline readiness per artwork.
 */

import { Artwork } from '../data/artworks.ts';

export interface StorageStats {
  supported: boolean;
  usageBytes: number;
  quotaBytes: number;
  usageMB: string;
  quotaMB: string;
  usagePercent: number;
  cachedImagesCount: number;
  cachedAudiosCount: number;
  isPersisted: boolean;
}

export interface SyncProgress {
  phase: string;
  currentTitle: string;
  completed: number;
  total: number;
  percent: number;
  successCount: number;
  failedCount: number;
  isComplete: boolean;
  error?: string;
}

const IMAGES_CACHE_NAME = 'regard-images-v2';
const AUDIO_CACHE_NAME = 'regard-audio-v2';

class OfflineSyncService {
  private syncInProgress = false;

  public isSyncing(): boolean {
    return this.syncInProgress;
  }

  /**
   * Calculate precise storage usage and quota via browser StorageManager
   */
  public async getStorageStats(): Promise<StorageStats> {
    if (typeof window === 'undefined' || !('caches' in window)) {
      return {
        supported: false,
        usageBytes: 0,
        quotaBytes: 0,
        usageMB: '0.0',
        quotaMB: '0.0',
        usagePercent: 0,
        cachedImagesCount: 0,
        cachedAudiosCount: 0,
        isPersisted: false,
      };
    }

    let usageBytes = 0;
    let quotaBytes = 0;
    let isPersisted = false;

    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        usageBytes = estimate.usage || 0;
        quotaBytes = estimate.quota || 0;
      } catch (e) {
        console.warn('Storage estimate error:', e);
      }
    }

    if (navigator.storage && navigator.storage.persisted) {
      try {
        isPersisted = await navigator.storage.persisted();
      } catch (e) {
        // ignore
      }
    }

    let cachedImagesCount = 0;
    let cachedAudiosCount = 0;

    try {
      if (await caches.has(IMAGES_CACHE_NAME)) {
        const imgCache = await caches.open(IMAGES_CACHE_NAME);
        const keys = await imgCache.keys();
        cachedImagesCount = keys.length;
      }
    } catch (e) {
      console.warn('Count images cache error:', e);
    }

    try {
      if (await caches.has(AUDIO_CACHE_NAME)) {
        const audCache = await caches.open(AUDIO_CACHE_NAME);
        const keys = await audCache.keys();
        cachedAudiosCount = keys.length;
      }
    } catch (e) {
      console.warn('Count audio cache error:', e);
    }

    const usageMB = (usageBytes / (1024 * 1024)).toFixed(1);
    const quotaMB = (quotaBytes / (1024 * 1024)).toFixed(0);
    const usagePercent = quotaBytes > 0 ? Math.min(100, Math.round((usageBytes / quotaBytes) * 100)) : 0;

    return {
      supported: true,
      usageBytes,
      quotaBytes,
      usageMB,
      quotaMB,
      usagePercent,
      cachedImagesCount,
      cachedAudiosCount,
      isPersisted,
    };
  }

  /**
   * Request persistent storage to prevent browser eviction
   */
  public async requestPersistentStorage(): Promise<boolean> {
    if (typeof window !== 'undefined' && navigator.storage && navigator.storage.persist) {
      try {
        return await navigator.storage.persist();
      } catch (e) {
        console.warn('Persist storage error:', e);
      }
    }
    return false;
  }

  /**
   * Check if a specific artwork has its image cached locally
   */
  public async isArtworkImageCached(imageUrl: string): Promise<boolean> {
    if (typeof window === 'undefined' || !('caches' in window) || !imageUrl) return false;
    try {
      const cache = await caches.open(IMAGES_CACHE_NAME);
      const match = await cache.match(imageUrl);
      return !!match;
    } catch {
      return false;
    }
  }

  /**
   * Download and cache images and audios with live progress tracking
   */
  public async downloadOfflinePack(
    artworksToCache: Artwork[],
    includeAudio = true,
    onProgress?: (progress: SyncProgress) => void
  ): Promise<{ success: boolean; cachedCount: number; errorsCount: number }> {
    if (this.syncInProgress) {
      return { success: false, cachedCount: 0, errorsCount: 0 };
    }
    this.syncInProgress = true;

    const totalImages = artworksToCache.length;
    const totalAudios = includeAudio ? artworksToCache.filter((a) => a.audioGuide?.audioSrc).length : 0;
    const totalTasks = totalImages + totalAudios;

    let completed = 0;
    let successCount = 0;
    let failedCount = 0;

    const update = (phase: string, currentTitle: string) => {
      const percent = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 100;
      onProgress?.({
        phase,
        currentTitle,
        completed,
        total: totalTasks,
        percent,
        successCount,
        failedCount,
        isComplete: false,
      });
    };

    try {
      const imgCache = await caches.open(IMAGES_CACHE_NAME);
      const audCache = await caches.open(AUDIO_CACHE_NAME);

      // 1. Cache Artwork Images (batch of 4 concurrent requests)
      const imageBatchSize = 4;
      for (let i = 0; i < artworksToCache.length; i += imageBatchSize) {
        const batch = artworksToCache.slice(i, i + imageBatchSize);
        await Promise.all(
          batch.map(async (artwork) => {
            update('Téléchargement des toiles haute résolution', artwork.title);
            try {
              // Check if already in cache
              const existing = await imgCache.match(artwork.imageUrl);
              if (!existing) {
                // Fetch image (no-cors allows saving opaque response for cross-origin assets)
                const resp = await fetch(artwork.imageUrl, { mode: 'no-cors' });
                if (resp) {
                  await imgCache.put(artwork.imageUrl, resp);
                }
              }
              successCount++;
            } catch (err) {
              console.warn(`Failed to cache image for ${artwork.title}:`, err);
              failedCount++;
            } finally {
              completed++;
            }
          })
        );
      }

      // 2. Cache Audio Tracks if requested
      if (includeAudio) {
        for (const artwork of artworksToCache) {
          const audioSrc = artwork.audioGuide?.audioSrc;
          if (!audioSrc) continue;

          update('Téléchargement des pistes audio', artwork.title);
          try {
            const existing = await audCache.match(audioSrc);
            if (!existing) {
              const resp = await fetch(audioSrc);
              if (resp && resp.ok) {
                await audCache.put(audioSrc, resp);
              }
            }
            successCount++;
          } catch (err) {
            console.warn(`Failed to cache audio for ${artwork.title}:`, err);
            failedCount++;
          } finally {
            completed++;
          }
        }
      }

      this.syncInProgress = false;
      onProgress?.({
        phase: 'Synchronisation achevée',
        currentTitle: 'Toutes les ressources sélectionnées sont disponibles hors-ligne',
        completed: totalTasks,
        total: totalTasks,
        percent: 100,
        successCount,
        failedCount,
        isComplete: true,
      });

      return { success: true, cachedCount: successCount, errorsCount: failedCount };
    } catch (e: any) {
      this.syncInProgress = false;
      onProgress?.({
        phase: 'Erreur de synchronisation',
        currentTitle: e.message || 'Interruption de réseau',
        completed,
        total: totalTasks,
        percent: totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0,
        successCount,
        failedCount,
        isComplete: true,
        error: e.message,
      });
      return { success: false, cachedCount: successCount, errorsCount: failedCount };
    }
  }

  /**
   * Clear all offline media caches (images and audio)
   */
  public async clearOfflineMedia(): Promise<boolean> {
    try {
      await Promise.all([
        caches.delete(IMAGES_CACHE_NAME),
        caches.delete(AUDIO_CACHE_NAME),
      ]);
      return true;
    } catch (e) {
      console.warn('Failed to clear media cache:', e);
      return false;
    }
  }
}

export const offlineSyncService = new OfflineSyncService();

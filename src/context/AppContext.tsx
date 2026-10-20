import React, { createContext, useContext, useState, useEffect } from 'react';
import { ARTWORKS, Artwork } from '../data/artworks.ts';
import { ARTISTS, Artist } from '../data/artists.ts';
import { LEARNING_PATHS, LearningPath } from '../data/learningPaths.ts';
import { audioManager, CurrentAudioState } from '../services/audioManager.ts';
import { validateArtworksJson } from '../services/catalogValidator.ts';
import {
  indexedDbService,
  StoredNote,
  StorageDiagnostics,
} from '../services/indexedDbService.ts';
import {
  searchEngine,
  SearchResultItem,
  SearchEngineStats,
  SearchBenchmarkResult,
} from '../services/searchEngine.ts';
import { catalogUpdateService } from '../services/catalogUpdateService.ts';
import {
  notificationService,
  NotificationScheduleInfo,
} from '../services/notificationService.ts';

export type ScreenType =
  | 'accueil'
  | 'explorer'
  | 'apprendre'
  | 'recherche'
  | 'collection'
  | 'profil'
  | 'artwork-detail'
  | 'path-detail'
  | 'gigapixel-inspector'
  | 'quiz';

export interface HistoryItem {
  artworkId: string;
  timeAgo: string;
  readMinutes: number;
  lastVisitedAt: number;
}

export const formatTimeAgo = (timestamp: number): string => {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'À l’instant';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} j`;
  return new Date(timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

interface AppContextType {
  // Navigation
  currentScreen: ScreenType;
  navigateTo: (screen: ScreenType) => void;
  selectedArtworkId: string;
  openArtwork: (id: string, mode?: 'decouvrir' | 'approfondir') => void;
  artworkReadingMode: 'decouvrir' | 'approfondir';
  setArtworkReadingMode: (mode: 'decouvrir' | 'approfondir') => void;
  selectedPathId: string;
  openLearningPath: (pathId: string) => void;
  openGigapixel: (artworkId?: string) => void;
  openQuiz: () => void;
  goBack: () => void;

  // Artist & Movement modals
  selectedArtistId: string | null;
  openArtist: (id: string) => void;
  closeArtist: () => void;
  selectedMovementId: string | null;
  openMovement: (id: string) => void;
  closeMovement: () => void;

  // Filter Modal
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (open: boolean) => void;

  // Explorer & Search Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedPeriods: string[];
  togglePeriod: (p: string) => void;
  selectedMovements: string[];
  toggleMovement: (m: string) => void;
  selectedTechniques: string[];
  toggleTechnique: (t: string) => void;
  curatorialAngles: {
    incontournablesOnly: boolean;
    femmesArtistesOnly: boolean;
    chefsDOeuvreMeconnus: boolean;
    withAudioOnly: boolean;
  };
  toggleCuratorialAngle: (key: 'incontournablesOnly' | 'femmesArtistesOnly' | 'chefsDOeuvreMeconnus' | 'withAudioOnly') => void;
  resetFilters: () => void;
  activeFilterCount: number;

  // Collection & Gamification
  bookmarkedIds: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  history: HistoryItem[];
  clearHistory: () => void;
  userPoints: number;
  addPoints: (pts: number) => void;
  userLevel: string;
  completedSteps: number[];
  completeStep: (stepNumber: number) => void;
  toggleStep: (stepNumber: number) => void;
  recordReadingDuration: (artworkId: string, durationMinutes: number) => Promise<void>;

  // Guide Audio Réel & Lecteur Interactif
  currentAudio: CurrentAudioState | null;
  playAudio: (artworkId: string, forceMode?: 'file' | 'speech') => Promise<void>;
  toggleAudioPlayback: (titleOrArtworkId?: string, speaker?: string) => void;
  pauseAudio: () => void;
  resumeAudio: () => Promise<void>;
  seekAudio: (seconds: number) => void;
  skipAudio: (deltaSeconds: number) => void;
  setAudioPlaybackRate: (rate: number) => void;
  setAudioVolume: (volume: number) => void;
  toggleAudioMute: () => void;
  switchAudioMode: (mode: 'file' | 'speech') => Promise<void>;
  retryAudio: () => Promise<void>;
  stopAudio: () => void;
  isAudioModalOpen: boolean;
  setIsAudioModalOpen: (open: boolean) => void;
  openAudioModal: (artworkId?: string) => void;
  playAudioToneTest: (freq?: number, duration?: number) => boolean;
  registerAudioDomElement: (el: HTMLAudioElement | null) => void;

  // User Preferences & Accessibility
  fontSize: 'standard' | 'confort' | 'grand';
  setFontSize: (size: 'standard' | 'confort' | 'grand') => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  dailyNotification: boolean;
  setDailyNotification: (v: boolean) => void;
  notificationHour: string;
  setNotificationHour: (h: string) => void;
  notificationPermission: NotificationPermission;
  notificationScheduleInfo: NotificationScheduleInfo;
  requestNotificationPermission: () => Promise<boolean>;
  triggerArtworkOfTheDayNotification: () => Promise<{ success: boolean; message: string }>;
  activeQuickAngle: string;
  setActiveQuickAngle: (angle: string) => void;
  applyQuickFilter: (angle: string) => void;

  // PWA Installation
  isInstallModalOpen: boolean;
  setIsInstallModalOpen: (open: boolean) => void;
  isAppInstalled: boolean;
  hasPrompt: boolean;
  installApp: () => Promise<void>;

  // Theme (Dark / Light)
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;

  // Hamburger Menu
  isHamburgerOpen: boolean;
  setIsHamburgerOpen: (open: boolean) => void;
  toggleHamburger: () => void;

  // System Settings & Updates
  isSystemSettingsOpen: boolean;
  setIsSystemSettingsOpen: (open: boolean) => void;
  appVersion: string;
  releaseDate: string;
  lastUpdateCheckDate: string;
  isCheckingUpdate: boolean;
  isAutoUpdateEnabled: boolean;
  setIsAutoUpdateEnabled: (v: boolean) => void;
  autoUpdateIntervalMinutes: number;
  setAutoUpdateIntervalMinutes: (v: number) => void;
  checkForUpdates: () => Promise<string>;
  forceUpdate: () => Promise<string>;

  // Onboarding & Legal Notice
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  hasAcceptedLegalNotice: boolean;
  acceptLegalNoticeAndCompleteOnboarding: () => void;

  // Contextual Onboarding & Tooltips
  showTooltips: boolean;
  setShowTooltips: (v: boolean) => void;
  showContextualTips: boolean;
  setShowContextualTips: (v: boolean) => void;
  dismissedTips: string[];
  dismissTip: (key: string) => void;
  resetContextualTips: () => void;

  // Helpers
  activeArtwork: Artwork;
  activeLearningPath: LearningPath;
  exportDatabaseJSON: () => void;

  // Catalogue & Import/Export d'œuvres (JSON)
  artworks: Artwork[];
  artists: Artist[];
  totalArtworksCount: number;
  totalArtistsCount: number;
  isCatalogModalOpen: boolean;
  setIsCatalogModalOpen: (open: boolean) => void;
  openCatalogModal: () => void;
  importCatalogJson: (json: string, mode?: 'merge' | 'replace') => Promise<number>;
  exportCatalogJson: () => void;
  resetCatalogToDefault: () => Promise<void>;

  // Architecture de stockage IndexedDB & Recherche Plein Texte FTS
  storageDriver: 'IndexedDB';
  storageDiagnostics: StorageDiagnostics | null;
  refreshStorageDiagnostics: () => Promise<void>;
  userNotes: StoredNote[];
  addNote: (content: string, title?: string, artworkId?: string) => Promise<StoredNote>;
  deleteNote: (id: string) => Promise<void>;
  searchFTS: (query: string) => SearchResultItem[];
  ftsStats: SearchEngineStats;
  runSearchBenchmark: () => SearchBenchmarkResult[];

  // Sauvegarde Chiffrée & Restauration
  isBackupModalOpen: boolean;
  setIsBackupModalOpen: (open: boolean) => void;
  openBackupModal: () => void;
  refreshUserData: () => Promise<void>;
  catalogVersion: string;

  // Test Hors-Ligne & Simulation Mode Avion
  isAirplaneModeSimulated: boolean;
  toggleAirplaneModeSimulated: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['accueil']);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('accueil');
  const [selectedArtworkId, setSelectedArtworkId] = useState<string>('starry-night');
  const [artworkReadingMode, setArtworkReadingMode] = useState<'decouvrir' | 'approfondir'>('decouvrir');
  const [selectedPathId, setSelectedPathId] = useState<string>('maitres-couleur');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [selectedMovementId, setSelectedMovementId] = useState<string | null>(null);

  // Dynamic Catalog State (IndexedDB)
  const [artworks, setArtworks] = useState<Artwork[]>(() => ARTWORKS);
  const [artists, setArtists] = useState<Artist[]>(() => ARTISTS);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState<boolean>(false);

  // Real Local Storage & IndexedDB Stores (starts strictly clean without dummy values)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('regard_bookmarks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
    return [];
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('regard_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
    return [];
  });

  const [userPoints, setUserPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('regard_points');
      if (saved !== null) {
        const pts = Number(saved);
        if (!isNaN(pts)) return pts;
      }
    } catch (e) {
      console.warn(e);
    }
    return 0; // Starts strictly at 0 for a new user
  });

  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('regard_completed_steps');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
    return []; // Starts strictly empty for a new user
  });

  const [userNotes, setUserNotes] = useState<StoredNote[]>([]);
  const [storageDiagnostics, setStorageDiagnostics] = useState<StorageDiagnostics | null>(null);
  const [isDbReady, setIsDbReady] = useState<boolean>(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [catalogVersion, setCatalogVersion] = useState<string>('1.1.0');
  const [isAirplaneModeSimulated, setIsAirplaneModeSimulated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('regard_airplane_mode') === 'true';
    } catch {
      return false;
    }
  });

  const toggleAirplaneModeSimulated = () => {
    setIsAirplaneModeSimulated((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('regard_airplane_mode', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const openBackupModal = () => setIsBackupModalOpen(true);

  const refreshStorageDiagnostics = async () => {
    try {
      const diag = await indexedDbService.getDiagnostics();
      setStorageDiagnostics(diag);
    } catch (e) {
      console.warn('Failed to refresh diagnostics:', e);
    }
  };

  const refreshUserData = async () => {
    try {
      const [loadedArts, loadedArtists, bmarks, hist, notes, prog, diag] = await Promise.all([
        indexedDbService.getArtworks(),
        indexedDbService.getArtists(),
        indexedDbService.getBookmarkIds(),
        indexedDbService.getHistory(),
        indexedDbService.getNotes(),
        indexedDbService.getUserProgress(),
        indexedDbService.getDiagnostics(),
      ]);

      setArtworks(loadedArts);
      setArtists(loadedArtists);
      searchEngine.indexArtworks(loadedArts);

      setBookmarkedIds(bmarks);
      setHistory(
        hist.map((h) => ({
          artworkId: h.artworkId,
          timeAgo: formatTimeAgo(h.lastVisitedAt),
          readMinutes: h.readMinutes,
          lastVisitedAt: h.lastVisitedAt,
        }))
      );
      setUserNotes(notes);
      setUserPoints(prog.points);
      setCompletedSteps(prog.completedSteps);
      setStorageDiagnostics(diag);

      const ver = await catalogUpdateService.getCurrentCatalogVersion();
      setCatalogVersion(ver);
    } catch (e) {
      console.warn('Failed to refresh user data:', e);
    }
  };

  // Initial Seed & Load from IndexedDB on startup
  useEffect(() => {
    let isMounted = true;
    const initializeDb = async () => {
      try {
        await indexedDbService.initAndSeed();

        const [loadedArts, loadedArtists, bmarks, hist, notes, prog, diag] = await Promise.all([
          indexedDbService.getArtworks(),
          indexedDbService.getArtists(),
          indexedDbService.getBookmarkIds(),
          indexedDbService.getHistory(),
          indexedDbService.getNotes(),
          indexedDbService.getUserProgress(),
          indexedDbService.getDiagnostics(),
        ]);

        if (!isMounted) return;

        setArtworks(loadedArts);
        setArtists(loadedArtists);
        searchEngine.indexArtworks(loadedArts);

        setBookmarkedIds(bmarks);
        setHistory(
          hist.map((h) => ({
            artworkId: h.artworkId,
            timeAgo: formatTimeAgo(h.lastVisitedAt),
            readMinutes: h.readMinutes,
            lastVisitedAt: h.lastVisitedAt,
          }))
        );
        setUserNotes(notes);
        setUserPoints(prog.points);
        setCompletedSteps(prog.completedSteps);
        setStorageDiagnostics(diag);
        setIsDbReady(true);
      } catch (err) {
        console.warn('Error booting IndexedDB:', err);
        searchEngine.indexArtworks(ARTWORKS);
      }
    };

    initializeDb();
    return () => {
      isMounted = false;
    };
  }, []);

  const openCatalogModal = () => setIsCatalogModalOpen(true);

  const totalArtworksCount = artworks.length;
  const totalArtistsCount = Array.from(new Set(artworks.map((a) => a.artist))).filter(Boolean).length;

  const importCatalogJson = async (json: string, mode: 'merge' | 'replace' = 'merge'): Promise<number> => {
    const result = validateArtworksJson(json);
    if (result.sanitizedArtworks.length === 0) return 0;

    if (mode === 'replace') {
      setArtworks(result.sanitizedArtworks);
      searchEngine.indexArtworks(result.sanitizedArtworks);
      await indexedDbService.saveArtworks(result.sanitizedArtworks);
      await refreshStorageDiagnostics();
      return result.sanitizedArtworks.length;
    } else {
      const map = new Map<string, Artwork>();
      artworks.forEach((item) => map.set(item.id, item));
      result.sanitizedArtworks.forEach((item) => map.set(item.id, item));
      const merged = Array.from(map.values());
      setArtworks(merged);
      searchEngine.indexArtworks(merged);
      await indexedDbService.saveArtworks(merged);
      await refreshStorageDiagnostics();
      return result.sanitizedArtworks.length;
    }
  };

  const exportCatalogJson = () => {
    const blob = new Blob([JSON.stringify(artworks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `regard-catalogue-${artworks.length}-oeuvres.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetCatalogToDefault = async () => {
    setArtworks(ARTWORKS);
    searchEngine.indexArtworks(ARTWORKS);
    await indexedDbService.resetArtworksToDefault();
    await refreshStorageDiagnostics();
  };

  const openArtist = (id: string) => setSelectedArtistId(id);
  const closeArtist = () => setSelectedArtistId(null);
  const openMovement = (id: string) => setSelectedMovementId(id);
  const closeMovement = () => setSelectedMovementId(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>(["XVIIe siècle & Âge d'or", 'XIXe siècle & Ruptures']);
  const [selectedMovements, setSelectedMovements] = useState<string[]>(['Postimpressionnisme']);
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [curatorialAngles, setCuratorialAngles] = useState({
    incontournablesOnly: false,
    femmesArtistesOnly: true,
    chefsDOeuvreMeconnus: false,
    withAudioOnly: false,
  });

  const searchFTS = (query: string) => {
    return searchEngine.search(query).results;
  };

  const ftsStats = searchEngine.getStats();
  const runSearchBenchmark = () => searchEngine.runBenchmarkSuite();

  // Accessibility & System Preferences
  const [fontSize, setFontSize] = useState<'standard' | 'confort' | 'grand'>(() => {
    try {
      const saved = localStorage.getItem('regard_font_size');
      return (saved as 'standard' | 'confort' | 'grand') || 'standard';
    } catch {
      return 'standard';
    }
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem('regard_high_contrast') === 'true';
    } catch {
      return false;
    }
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    try {
      return localStorage.getItem('regard_reduced_motion') === 'true';
    } catch {
      return false;
    }
  });

  const [dailyNotification, setDailyNotification] = useState<boolean>(() => {
    try {
      return localStorage.getItem('regard_notifications_enabled') === 'true';
    } catch {
      return false;
    }
  });
  const [notificationHour, setNotificationHour] = useState<string>(() => {
    try {
      return localStorage.getItem('regard_notifications_time') || '09:00';
    } catch {
      return '09:00';
    }
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  // Sync notification preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('regard_notifications_enabled', String(dailyNotification));
    } catch (e) {
      console.warn(e);
    }
  }, [dailyNotification]);

  useEffect(() => {
    try {
      localStorage.setItem('regard_notifications_time', notificationHour);
    } catch (e) {
      console.warn(e);
    }
  }, [notificationHour]);

  const [notificationScheduleInfo, setNotificationScheduleInfo] = useState<NotificationScheduleInfo>(() =>
    notificationService.getScheduleInfo()
  );

  const refreshNotificationSchedule = () => {
    setNotificationScheduleInfo(notificationService.getScheduleInfo());
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    const perm = await notificationService.requestPermission();
    setNotificationPermission(perm);
    refreshNotificationSchedule();
    return perm === 'granted';
  };

  const triggerArtworkOfTheDayNotification = async (): Promise<{ success: boolean; message: string }> => {
    const res = await notificationService.triggerArtworkNotification(artworks);
    refreshNotificationSchedule();
    return { success: res.success, message: res.message };
  };

  // Sync settings and start background timer for daily notifications
  useEffect(() => {
    notificationService.saveSettings(dailyNotification, notificationHour);
    if (dailyNotification) {
      notificationService.startScheduler(artworks, () => {
        refreshNotificationSchedule();
      });
    } else {
      notificationService.stopScheduler();
    }
    refreshNotificationSchedule();

    return () => {
      notificationService.stopScheduler();
    };
  }, [dailyNotification, notificationHour, artworks]);

  // Listen for Service Worker notification clicks
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'OPEN_ARTWORK_FROM_NOTIFICATION' && event.data.artworkId) {
          openArtwork(event.data.artworkId);
        }
      };
      navigator.serviceWorker.addEventListener('message', handleMessage);
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
  }, [artworks]);

  // Handle URL deep link from notification on launch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const artId = params.get('artworkId');
      if (artId && artworks.some((a) => a.id === artId)) {
        openArtwork(artId);
      }
    }
  }, [artworks]);

  const [activeQuickAngle, setActiveQuickAngle] = useState<string>('all');

  useEffect(() => {
    try {
      localStorage.setItem('regard_font_size', fontSize);
      document.documentElement.classList.remove('font-size-confort', 'font-size-grand');
      if (fontSize === 'confort') document.documentElement.classList.add('font-size-confort');
      if (fontSize === 'grand') document.documentElement.classList.add('font-size-grand');
    } catch (e) {
      console.warn(e);
    }
  }, [fontSize]);

  useEffect(() => {
    try {
      localStorage.setItem('regard_high_contrast', String(highContrast));
      if (highContrast) {
        document.documentElement.classList.add('high-contrast-mode');
      } else {
        document.documentElement.classList.remove('high-contrast-mode');
      }
    } catch (e) {
      console.warn(e);
    }
  }, [highContrast]);

  useEffect(() => {
    try {
      localStorage.setItem('regard_reduced_motion', String(reducedMotion));
      if (reducedMotion) {
        document.documentElement.classList.add('reduce-motion-mode');
      } else {
        document.documentElement.classList.remove('reduce-motion-mode');
      }
    } catch (e) {
      console.warn(e);
    }
  }, [reducedMotion]);

  const applyQuickFilter = (angle: string) => {
    setActiveQuickAngle(angle);
    navigateTo('explorer');
  };

  // PWA beforeinstallprompt handler
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setIsAppInstalled(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('Install prompt error:', err);
        setIsInstallModalOpen(true);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  // Theme Management (Dark / Light)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('regard_theme');
      return (saved as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('regard_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
      }
    } catch (e) {
      console.warn(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Hamburger Menu
  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);
  const toggleHamburger = () => setIsHamburgerOpen((prev) => !prev);

  // System Settings & Updates
  const [isSystemSettingsOpen, setIsSystemSettingsOpen] = useState<boolean>(false);
  const appVersion = 'v2.5.0';
  const releaseDate = '10 Octobre 2026';
  const [lastUpdateCheckDate, setLastUpdateCheckDate] = useState<string>(() => {
    try {
      return localStorage.getItem('regard_last_check') || '10 Octobre 2026 à 14:30';
    } catch {
      return '10 Octobre 2026 à 14:30';
    }
  });
  const [isCheckingUpdate, setIsCheckingUpdate] = useState<boolean>(false);
  const [isAutoUpdateEnabled, setIsAutoUpdateEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('regard_auto_update') !== 'false';
    } catch {
      return true;
    }
  });
  const [autoUpdateIntervalMinutes, setAutoUpdateIntervalMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('regard_auto_update_interval');
      return saved ? Number(saved) : 60;
    } catch {
      return 60;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('regard_auto_update', String(isAutoUpdateEnabled));
      localStorage.setItem('regard_auto_update_interval', String(autoUpdateIntervalMinutes));
    } catch (e) {
      console.warn(e);
    }
  }, [isAutoUpdateEnabled, autoUpdateIntervalMinutes]);

  const checkForUpdates = async (): Promise<string> => {
    setIsCheckingUpdate(true);
    try {
      const checkResult = await catalogUpdateService.checkForUpdate();
      const now = new Date();
      const formatted = `${now.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
      setLastUpdateCheckDate(formatted);
      localStorage.setItem('regard_last_check', formatted);

      if (checkResult.isOffline) {
        setIsCheckingUpdate(false);
        return checkResult.message;
      }

      if (checkResult.hasUpdate && checkResult.manifest) {
        setIsCheckingUpdate(false);
        return `Nouvelle édition ${checkResult.manifest.catalogVersion} disponible (${checkResult.manifest.artworksCount} toiles). Cliquez sur « Forcer la mise à jour » pour l'installer.`;
      } else {
        setIsCheckingUpdate(false);
        return checkResult.message;
      }
    } catch (e: any) {
      setIsCheckingUpdate(false);
      return `Vérification échouée : ${e.message}`;
    }
  };

  const forceUpdate = async (): Promise<string> => {
    setIsCheckingUpdate(true);
    try {
      // 1. Check manifest
      const checkResult = await catalogUpdateService.checkForUpdate();
      if (checkResult.isOffline) {
        setIsCheckingUpdate(false);
        return checkResult.message;
      }

      if (!checkResult.manifest) {
        setIsCheckingUpdate(false);
        return 'Impossible de récupérer le manifeste distant de mise à jour.';
      }

      // 2. Download, verify SHA-256 and apply update
      const updateResult = await catalogUpdateService.applyUpdate(checkResult.manifest);
      if (updateResult.success) {
        await refreshUserData();
        const now = new Date();
        const formatted = `${now.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
        setLastUpdateCheckDate(formatted);
        localStorage.setItem('regard_last_check', formatted);
        setIsCheckingUpdate(false);
        return `Mise à jour v${updateResult.newVersion} installée avec succès ! ${updateResult.artworksCount} toiles synchronisées. Vos favoris et notes sont préservés.`;
      } else {
        setIsCheckingUpdate(false);
        return `Échec de mise à jour : ${updateResult.error || updateResult.message}`;
      }
    } catch (e: any) {
      setIsCheckingUpdate(false);
      return `Erreur lors de la mise à jour : ${e.message}`;
    }
  };

  // Background Automatic Updates (periodic check loop)
  useEffect(() => {
    if (!isAutoUpdateEnabled) return;
    const intervalMs = Math.max(1, autoUpdateIntervalMinutes) * 60 * 1000;
    const timer = setInterval(() => {
      const now = new Date();
      const formatted = `${now.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
      setLastUpdateCheckDate(formatted);
      try {
        localStorage.setItem('regard_last_check', formatted);
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((r) => r.update());
          });
        }
      } catch (e) {
        console.warn('Auto update check failed', e);
      }
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isAutoUpdateEnabled, autoUpdateIntervalMinutes]);

  // Onboarding & Legal Notice
  const [hasAcceptedLegalNotice, setHasAcceptedLegalNotice] = useState<boolean>(() => {
    try {
      return localStorage.getItem('regard_legal_accepted') === 'true';
    } catch {
      return false;
    }
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('regard_legal_accepted') !== 'true';
    } catch {
      return true;
    }
  });

  const acceptLegalNoticeAndCompleteOnboarding = () => {
    setHasAcceptedLegalNotice(true);
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem('regard_legal_accepted', 'true');
    } catch (e) {
      console.warn(e);
    }
  };

  // Tooltips & Contextual Tips
  const [showTooltips, setShowTooltips] = useState<boolean>(() => {
    try {
      return localStorage.getItem('regard_show_tooltips') !== 'false';
    } catch {
      return true;
    }
  });

  const [showContextualTips, setShowContextualTips] = useState<boolean>(() => {
    try {
      return localStorage.getItem('regard_show_contextual_tips') !== 'false';
    } catch {
      return true;
    }
  });

  const [dismissedTips, setDismissedTips] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('regard_dismissed_tips');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('regard_show_tooltips', String(showTooltips));
      localStorage.setItem('regard_show_contextual_tips', String(showContextualTips));
      localStorage.setItem('regard_dismissed_tips', JSON.stringify(dismissedTips));
    } catch (e) {
      console.warn(e);
    }
  }, [showTooltips, showContextualTips, dismissedTips]);

  const dismissTip = (key: string) => {
    setDismissedTips((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  const resetContextualTips = () => {
    setDismissedTips([]);
  };

  const [currentAudio, setCurrentAudio] = useState<CurrentAudioState | null>(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((state) => {
      setCurrentAudio(state);
    });
    return () => unsubscribe();
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('regard_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.warn(e);
    }
  }, [bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('regard_points', String(userPoints));
    } catch (e) {
      console.warn(e);
    }
  }, [userPoints]);

  useEffect(() => {
    try {
      localStorage.setItem('regard_completed_steps', JSON.stringify(completedSteps));
    } catch (e) {
      console.warn(e);
    }
  }, [completedSteps]);

  useEffect(() => {
    try {
      localStorage.setItem('regard_history', JSON.stringify(history));
    } catch (e) {
      console.warn(e);
    }
  }, [history]);

  const navigateTo = (screen: ScreenType) => {
    if (screen !== currentScreen) {
      setScreenHistory((prev) => [...prev, screen]);
      setCurrentScreen(screen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const nextHistory = [...screenHistory];
      nextHistory.pop();
      const prevScreen = nextHistory[nextHistory.length - 1];
      setScreenHistory(nextHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('accueil');
    }
  };

  const openArtwork = (id: string, mode: 'decouvrir' | 'approfondir' = 'decouvrir') => {
    setSelectedArtworkId(id);
    setArtworkReadingMode(mode);
    indexedDbService.recordVisit(id, 2).then(async () => {
      const hist = await indexedDbService.getHistory();
      const mapped = hist.map((h) => ({
        artworkId: h.artworkId,
        timeAgo: formatTimeAgo(h.lastVisitedAt),
        readMinutes: h.readMinutes,
        lastVisitedAt: h.lastVisitedAt,
      }));
      setHistory(mapped);
      try {
        localStorage.setItem('regard_history', JSON.stringify(mapped));
      } catch (e) {
        console.warn(e);
      }
      await refreshStorageDiagnostics();
    });
    navigateTo('artwork-detail');
  };

  const openLearningPath = (pathId: string) => {
    setSelectedPathId(pathId);
    navigateTo('path-detail');
  };

  const openGigapixel = (artworkId?: string) => {
    if (artworkId) {
      setSelectedArtworkId(artworkId);
    }
    navigateTo('gigapixel-inspector');
  };

  const openQuiz = () => {
    navigateTo('quiz');
  };

  const toggleBookmark = async (id: string) => {
    await indexedDbService.toggleBookmark(id);
    const updated = await indexedDbService.getBookmarkIds();
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('regard_bookmarks', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    await refreshStorageDiagnostics();
  };

  const isBookmarked = (id: string) => bookmarkedIds.includes(id);

  const clearHistory = async () => {
    await indexedDbService.clearHistory();
    setHistory([]);
    try {
      localStorage.removeItem('regard_history');
    } catch (e) {
      console.warn(e);
    }
    await refreshStorageDiagnostics();
  };

  const addPoints = (pts: number) => {
    setUserPoints((prev) => {
      const next = Math.min(1000, prev + pts);
      try {
        localStorage.setItem('regard_points', String(next));
      } catch (e) {
        console.warn(e);
      }
      indexedDbService.saveUserProgress(next, completedSteps);
      return next;
    });
  };

  const completeStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) return;
    const nextSteps = [...completedSteps, stepNumber];
    const newPoints = Math.min(1000, userPoints + 50);
    setCompletedSteps(nextSteps);
    setUserPoints(newPoints);
    try {
      localStorage.setItem('regard_completed_steps', JSON.stringify(nextSteps));
      localStorage.setItem('regard_points', String(newPoints));
    } catch (e) {
      console.warn(e);
    }
    indexedDbService.saveUserProgress(newPoints, nextSteps);
  };

  const toggleStep = (stepNumber: number) => {
    const isCompleted = completedSteps.includes(stepNumber);
    const nextSteps = isCompleted
      ? completedSteps.filter((s) => s !== stepNumber)
      : [...completedSteps, stepNumber];
    const newPoints = isCompleted
      ? Math.max(0, userPoints - 50)
      : Math.min(1000, userPoints + 50);

    setCompletedSteps(nextSteps);
    setUserPoints(newPoints);
    try {
      localStorage.setItem('regard_completed_steps', JSON.stringify(nextSteps));
      localStorage.setItem('regard_points', String(newPoints));
    } catch (e) {
      console.warn(e);
    }
    indexedDbService.saveUserProgress(newPoints, nextSteps);
  };

  const recordReadingDuration = async (artworkId: string, durationMinutes: number) => {
    await indexedDbService.recordVisit(artworkId, durationMinutes);
    const hist = await indexedDbService.getHistory();
    const mapped = hist.map((h) => ({
      artworkId: h.artworkId,
      timeAgo: formatTimeAgo(h.lastVisitedAt),
      readMinutes: h.readMinutes,
      lastVisitedAt: h.lastVisitedAt,
    }));
    setHistory(mapped);
    try {
      localStorage.setItem('regard_history', JSON.stringify(mapped));
    } catch (e) {
      console.warn(e);
    }
    await refreshStorageDiagnostics();
  };

  const addNote = async (content: string, title?: string, artworkId?: string): Promise<StoredNote> => {
    const note = await indexedDbService.saveNote(content, title, artworkId);
    const updated = await indexedDbService.getNotes();
    setUserNotes(updated);
    await refreshStorageDiagnostics();
    return note;
  };

  const deleteNote = async (id: string): Promise<void> => {
    await indexedDbService.deleteNote(id);
    const updated = await indexedDbService.getNotes();
    setUserNotes(updated);
    await refreshStorageDiagnostics();
  };

  const togglePeriod = (p: string) => {
    setSelectedPeriods((prev) => (prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]));
  };

  const toggleMovement = (m: string) => {
    setSelectedMovements((prev) => (prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]));
  };

  const toggleTechnique = (t: string) => {
    setSelectedTechniques((prev) => (prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]));
  };

  const toggleCuratorialAngle = (key: 'incontournablesOnly' | 'femmesArtistesOnly' | 'chefsDOeuvreMeconnus' | 'withAudioOnly') => {
    setCuratorialAngles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetFilters = () => {
    setSelectedPeriods([]);
    setSelectedMovements([]);
    setSelectedTechniques([]);
    setCuratorialAngles({
      incontournablesOnly: false,
      femmesArtistesOnly: false,
      chefsDOeuvreMeconnus: false,
      withAudioOnly: false,
    });
  };

  const activeFilterCount =
    selectedPeriods.length +
    selectedMovements.length +
    selectedTechniques.length +
    (curatorialAngles.incontournablesOnly ? 1 : 0) +
    (curatorialAngles.femmesArtistesOnly ? 1 : 0) +
    (curatorialAngles.chefsDOeuvreMeconnus ? 1 : 0) +
    (curatorialAngles.withAudioOnly ? 1 : 0);

  const userLevel =
    userPoints >= 900
      ? 'Conservateur Émérite (Niveau 4)'
      : userPoints >= 700
      ? 'Regard Éclairé (Niveau 3)'
      : userPoints >= 400
      ? 'Amateur Averti (Niveau 2)'
      : 'Initié au Beau (Niveau 1)';

  const playAudio = async (artworkId: string, forceMode?: 'file' | 'speech') => {
    const art = artworks.find((a) => a.id === artworkId);
    await audioManager.playArtwork(artworkId, forceMode, art);
  };

  const toggleAudioPlayback = (titleOrArtworkId?: string, _speaker?: string) => {
    if (titleOrArtworkId) {
      const foundArtwork =
        artworks.find((a) => a.id === titleOrArtworkId) ||
        artworks.find(
          (a) =>
            a.title.toLowerCase().includes(titleOrArtworkId.toLowerCase()) ||
            (a.audioGuide && a.audioGuide.title.toLowerCase().includes(titleOrArtworkId.toLowerCase()))
        );

      if (foundArtwork) {
        if (currentAudio?.artworkId === foundArtwork.id) {
          audioManager.togglePlay();
          return;
        } else {
          audioManager.playArtwork(foundArtwork.id, undefined, foundArtwork);
          return;
        }
      }
    }

    if (currentAudio) {
      audioManager.togglePlay();
    } else if (selectedArtworkId) {
      const art = artworks.find((a) => a.id === selectedArtworkId);
      audioManager.playArtwork(selectedArtworkId, undefined, art);
    } else {
      audioManager.playArtwork(artworks[0]?.id || 'starry-night', undefined, artworks[0]);
    }
  };

  const pauseAudio = () => audioManager.pause();
  const resumeAudio = async () => audioManager.resume();
  const seekAudio = (seconds: number) => audioManager.seek(seconds);
  const skipAudio = (delta: number) => audioManager.skip(delta);
  const setAudioPlaybackRate = (rate: number) => audioManager.setPlaybackRate(rate);
  const setAudioVolume = (vol: number) => audioManager.setVolume(vol);
  const toggleAudioMute = () => audioManager.toggleMute();
  const switchAudioMode = async (mode: 'file' | 'speech') => audioManager.switchMode(mode);
  const retryAudio = async () => audioManager.retry();
  const stopAudio = () => audioManager.stop();
  const playAudioToneTest = (freq?: number, duration?: number) => audioManager.playToneTest(freq, duration);
  const registerAudioDomElement = (el: HTMLAudioElement | null) => audioManager.bindDomAudioElement(el);

  const openAudioModal = (artworkId?: string) => {
    if (artworkId && artworkId !== currentAudio?.artworkId) {
      const art = artworks.find((a) => a.id === artworkId);
      audioManager.playArtwork(artworkId, undefined, art);
    }
    setIsAudioModalOpen(true);
  };

  const exportDatabaseJSON = async () => {
    try {
      const jsonString = await indexedDbService.exportCompleteDatabaseJson();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `regard_sauvegarde_indexeddb_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('Export database error:', e);
    }
  };

  const activeArtwork = artworks.find((a) => a.id === selectedArtworkId) || artworks[0];
  const activeLearningPath = LEARNING_PATHS.find((p) => p.id === selectedPathId) || LEARNING_PATHS[0];

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        selectedArtworkId,
        openArtwork,
        artworkReadingMode,
        setArtworkReadingMode,
        selectedPathId,
        openLearningPath,
        openGigapixel,
        openQuiz,
        goBack,

        selectedArtistId,
        openArtist,
        closeArtist,
        selectedMovementId,
        openMovement,
        closeMovement,

        isFilterModalOpen,
        setIsFilterModalOpen,

        searchQuery,
        setSearchQuery,
        selectedPeriods,
        togglePeriod,
        selectedMovements,
        toggleMovement,
        selectedTechniques,
        toggleTechnique,
        curatorialAngles,
        toggleCuratorialAngle,
        resetFilters,
        activeFilterCount,

        bookmarkedIds,
        toggleBookmark,
        isBookmarked,
        history,
        clearHistory,
        userPoints,
        addPoints,
        userLevel,
        completedSteps,
        completeStep,
        toggleStep,
        recordReadingDuration,

        currentAudio,
        playAudio,
        toggleAudioPlayback,
        pauseAudio,
        resumeAudio,
        seekAudio,
        skipAudio,
        setAudioPlaybackRate,
        setAudioVolume,
        toggleAudioMute,
        switchAudioMode,
        retryAudio,
        stopAudio,
        isAudioModalOpen,
        setIsAudioModalOpen,
        openAudioModal,
        playAudioToneTest,
        registerAudioDomElement,

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
        activeQuickAngle,
        setActiveQuickAngle,
        applyQuickFilter,

        isInstallModalOpen,
        setIsInstallModalOpen,
        isAppInstalled,
        hasPrompt: !!deferredPrompt,
        installApp,

        theme,
        setTheme,
        toggleTheme,

        isHamburgerOpen,
        setIsHamburgerOpen,
        toggleHamburger,

        isSystemSettingsOpen,
        setIsSystemSettingsOpen,
        appVersion,
        releaseDate,
        lastUpdateCheckDate,
        isCheckingUpdate,
        isAutoUpdateEnabled,
        setIsAutoUpdateEnabled,
        autoUpdateIntervalMinutes,
        setAutoUpdateIntervalMinutes,
        checkForUpdates,
        forceUpdate,

        isOnboardingOpen,
        setIsOnboardingOpen,
        hasAcceptedLegalNotice,
        acceptLegalNoticeAndCompleteOnboarding,

        showTooltips,
        setShowTooltips,
        showContextualTips,
        setShowContextualTips,
        dismissedTips,
        dismissTip,
        resetContextualTips,

        activeArtwork,
        activeLearningPath,
        exportDatabaseJSON,

        // Catalogue & Import/Export d'œuvres (JSON)
        artworks,
        artists,
        totalArtworksCount,
        totalArtistsCount,
        isCatalogModalOpen,
        setIsCatalogModalOpen,
        openCatalogModal,
        importCatalogJson,
        exportCatalogJson,
        resetCatalogToDefault,

        // IndexedDB & Recherche Plein Texte
        storageDriver: 'IndexedDB',
        storageDiagnostics,
        refreshStorageDiagnostics,
        userNotes,
        addNote,
        deleteNote,
        searchFTS,
        ftsStats,
        runSearchBenchmark,

        // Sauvegarde Chiffrée & Restauration
        isBackupModalOpen,
        setIsBackupModalOpen,
        openBackupModal,
        refreshUserData,
        catalogVersion,

        // Test Hors-Ligne & Simulation Mode Avion
        isAirplaneModeSimulated,
        toggleAirplaneModeSimulated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

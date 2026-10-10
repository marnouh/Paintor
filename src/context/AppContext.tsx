import React, { createContext, useContext, useState, useEffect } from 'react';
import { ARTWORKS, Artwork } from '../data/artworks.ts';
import { LEARNING_PATHS, LearningPath } from '../data/learningPaths.ts';

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
}

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

  // Audio Tour Global Simulation
  currentAudio: {
    title: string;
    speaker: string;
    isPlaying: boolean;
  } | null;
  toggleAudioPlayback: (title?: string, speaker?: string) => void;
  stopAudio: () => void;

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

  // Local Storage persisted states
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('regard_bookmarks');
      return saved ? JSON.parse(saved) : ['starry-night', 'girl-pearl-earring', 'judith-holofernes', 'thorn-necklace'];
    } catch {
      return ['starry-night', 'girl-pearl-earring', 'judith-holofernes', 'thorn-necklace'];
    }
  });

  const [history, setHistory] = useState<HistoryItem[]>([
    { artworkId: 'milkmaid', timeAgo: 'Il y a 2h', readMinutes: 8 },
    { artworkId: 'third-of-may', timeAgo: 'Hier', readMinutes: 15 },
    { artworkId: 'impression-sunrise', timeAgo: 'Il y a 3 jours', readMinutes: 4 },
  ]);

  const [userPoints, setUserPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('regard_points');
      return saved ? Number(saved) : 780;
    } catch {
      return 780;
    }
  });

  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3]);

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

  const [dailyNotification, setDailyNotification] = useState<boolean>(true);
  const [notificationHour, setNotificationHour] = useState<string>('09:00');
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
  const appVersion = 'v2.4.2';
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
    await new Promise((resolve) => setTimeout(resolve, 1400));
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
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          reg.update();
        }
      }
    } catch (e) {
      console.warn(e);
    }
    setIsCheckingUpdate(false);
    return `Votre version ${appVersion} est parfaitement à jour (Vérifié ${formatted})`;
  };

  const forceUpdate = async (): Promise<string> => {
    setIsCheckingUpdate(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      const now = new Date();
      const formatted = `${now.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
      setLastUpdateCheckDate(formatted);
      localStorage.setItem('regard_last_check', formatted);
    } catch (e) {
      console.warn(e);
    }
    setIsCheckingUpdate(false);
    return `Mise à jour forcée réussie ! Cache réinitialisé et fiches synchronisées (v2.4.2).`;
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

  const [currentAudio, setCurrentAudio] = useState<{
    title: string;
    speaker: string;
    isPlaying: boolean;
  } | null>(null);

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
    // Add to history if not present
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.artworkId !== id);
      return [{ artworkId: id, timeAgo: 'À l’instant', readMinutes: 2 }, ...filtered];
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

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [id, ...prev];
      }
    });
  };

  const isBookmarked = (id: string) => bookmarkedIds.includes(id);

  const clearHistory = () => {
    setHistory([]);
  };

  const addPoints = (pts: number) => {
    setUserPoints((prev) => Math.min(1000, prev + pts));
  };

  const completeStep = (stepNumber: number) => {
    setCompletedSteps((prev) => (prev.includes(stepNumber) ? prev : [...prev, stepNumber]));
    addPoints(50);
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

  const toggleAudioPlayback = (title = 'Commentaire du Conservateur', speaker = 'Claire D.') => {
    if (currentAudio && currentAudio.isPlaying) {
      setCurrentAudio({ ...currentAudio, isPlaying: false });
    } else {
      setCurrentAudio({ title, speaker, isPlaying: true });
    }
  };

  const stopAudio = () => {
    setCurrentAudio(null);
  };

  const exportDatabaseJSON = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      app: 'Regard - L Art de la Peinture',
      storageEngine: 'SQLite FTS5 Local Storage Wrapper',
      user: {
        points: userPoints,
        level: userLevel,
        bookmarks: bookmarkedIds,
        completedSteps: completedSteps,
        history: history,
      },
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `regard_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeArtwork = ARTWORKS.find((a) => a.id === selectedArtworkId) || ARTWORKS[0];
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

        currentAudio,
        toggleAudioPlayback,
        stopAudio,

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

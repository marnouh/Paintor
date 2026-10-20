import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { HomeScreen } from './views/HomeScreen.tsx';
import { ArtworkDetailScreen } from './views/ArtworkDetailScreen.tsx';
import { ExplorerScreen } from './views/ExplorerScreen.tsx';
import { LearnScreen } from './views/LearnScreen.tsx';
import { PathDetailScreen } from './views/PathDetailScreen.tsx';
import { GigapixelInspectorScreen } from './views/GigapixelInspectorScreen.tsx';
import { QuizScreen } from './views/QuizScreen.tsx';
import { SearchScreen } from './views/SearchScreen.tsx';
import { CollectionScreen } from './views/CollectionScreen.tsx';
import { ProfileScreen } from './views/ProfileScreen.tsx';
import { ArtistDetailModal } from './views/ArtistDetailModal.tsx';
import { MovementDetailModal } from './views/MovementDetailModal.tsx';
import { BottomNavBar } from './components/BottomNavBar.tsx';
import { FilterModal } from './components/FilterModal.tsx';
import { AudioPlayerFloating } from './components/AudioPlayerFloating.tsx';
import { AudioPlayerModal } from './components/AudioPlayerModal.tsx';
import { PwaInstallModal } from './components/PwaInstallModal.tsx';
import { HamburgerMenu } from './components/HamburgerMenu.tsx';
import { SystemSettingsModal } from './components/SystemSettingsModal.tsx';
import { OnboardingModal } from './components/OnboardingModal.tsx';
import { CatalogManagerModal } from './components/CatalogManagerModal.tsx';
import { BackupRestoreModal } from './components/BackupRestoreModal.tsx';

const AppContent: React.FC = () => {
  const {
    currentScreen,
    selectedArtistId,
    closeArtist,
    selectedMovementId,
    closeMovement,
    openArtwork,
    isAirplaneModeSimulated,
    toggleAirplaneModeSimulated,
  } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'accueil':
        return <HomeScreen />;
      case 'explorer':
        return <ExplorerScreen />;
      case 'apprendre':
        return <LearnScreen />;
      case 'recherche':
        return <SearchScreen />;
      case 'collection':
        return <CollectionScreen />;
      case 'profil':
        return <ProfileScreen />;
      case 'artwork-detail':
        return <ArtworkDetailScreen />;
      case 'path-detail':
        return <PathDetailScreen />;
      case 'gigapixel-inspector':
        return <GigapixelInspectorScreen />;
      case 'quiz':
        return <QuizScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const showBottomNav =
    currentScreen !== 'gigapixel-inspector' && currentScreen !== 'quiz';

  return (
    <div className="min-h-screen bg-[#141318] text-[#e5e1e8] transition-colors duration-300">
      {isAirplaneModeSimulated && (
        <aside
          role="status"
          aria-label="Mode Avion Simulé"
          className="sticky top-0 z-50 bg-[#79341f] text-[#ffb59f] px-3.5 py-2 text-[11.5px] font-medium flex items-center justify-between border-b border-[#ffb59f]/30 shadow-lg animate-fade-in"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] animate-pulse">airplanemode_active</span>
            <span>
              <strong>Mode Avion Simulé Actif :</strong> Réseau externe neutralisé. Navigation, toiles en cache, deep-zoom et audio opèrent 100% hors-ligne.
            </span>
          </div>
          <button
            onClick={toggleAirplaneModeSimulated}
            className="px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 text-white text-[11px] font-semibold transition-colors cursor-pointer border border-white/20"
          >
            Quitter le mode avion
          </button>
        </aside>
      )}
      {renderScreen()}
      {showBottomNav && <BottomNavBar />}
      <FilterModal />
      <AudioPlayerFloating />
      <AudioPlayerModal />
      {/* Artist & Movement detail modals */}
      <ArtistDetailModal
        artistId={selectedArtistId}
        onClose={closeArtist}
        onSelectArtwork={openArtwork}
      />
      <MovementDetailModal
        movementId={selectedMovementId}
        onClose={closeMovement}
        onSelectArtwork={openArtwork}
      />
      <PwaInstallModal />
      {/* Hamburger Drawer, System Settings & Onboarding */}
      <HamburgerMenu />
      <SystemSettingsModal />
      <OnboardingModal />
      <CatalogManagerModal />
      <BackupRestoreModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

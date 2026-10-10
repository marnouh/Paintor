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
import { PwaInstallModal } from './components/PwaInstallModal.tsx';
import { HamburgerMenu } from './components/HamburgerMenu.tsx';
import { SystemSettingsModal } from './components/SystemSettingsModal.tsx';
import { OnboardingModal } from './components/OnboardingModal.tsx';

const AppContent: React.FC = () => {
  const {
    currentScreen,
    selectedArtistId,
    closeArtist,
    selectedMovementId,
    closeMovement,
    openArtwork,
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
      {renderScreen()}
      {showBottomNav && <BottomNavBar />}
      <FilterModal />
      <AudioPlayerFloating />
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

import React from 'react';
import { useApp, ScreenType } from '../context/AppContext.tsx';

export const BottomNavBar: React.FC = () => {
  const { currentScreen, navigateTo } = useApp();

  const navItems: { screen: ScreenType; label: string; icon: string }[] = [
    { screen: 'accueil', label: 'Accueil', icon: 'home' },
    { screen: 'explorer', label: 'Explorer', icon: 'palette' },
    { screen: 'apprendre', label: 'Apprendre', icon: 'auto_stories' },
    { screen: 'recherche', label: 'Recherche', icon: 'search' },
    { screen: 'collection', label: 'Collection', icon: 'collections_bookmark' },
    { screen: 'profil', label: 'Profil', icon: 'person' },
  ];

  // Map sub-screens to main tabs if needed
  const getIsActive = (itemScreen: ScreenType) => {
    if (currentScreen === itemScreen) return true;
    if (itemScreen === 'apprendre' && (currentScreen === 'path-detail' || currentScreen === 'quiz')) {
      return true;
    }
    if (itemScreen === 'explorer' && currentScreen === 'gigapixel-inspector') {
      return true;
    }
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-1 py-1.5 bg-[#0e0e12]/95 backdrop-blur-xl border-t border-[#4d4635]/15 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const isActive = getIsActive(item.screen);
        return (
          <button
            key={item.screen}
            onClick={() => navigateTo(item.screen)}
            className={`flex flex-col items-center justify-center py-1 px-3 relative transition-all duration-150 active:scale-90 cursor-pointer ${
              isActive ? 'text-[#f2ca50]' : 'text-[#d0c5af] hover:text-[#f2ca50]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span
              className={`font-label-caps text-[10px] tracking-wide mt-0.5 ${
                isActive ? 'font-bold text-[#f2ca50]' : 'font-medium'
              }`}
            >
              {item.label}
            </span>
            {/* Understated golden under-dot */}
            <span
              className={`w-1 h-1 rounded-full mt-0.5 transition-all ${
                isActive ? 'bg-[#f2ca50]' : 'bg-transparent'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};

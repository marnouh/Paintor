import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Tooltip } from './Tooltip.tsx';

interface TopAppBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showBookmark?: boolean;
  showShare?: boolean;
  badge?: string;
  artworkIdForBookmark?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title = 'Regard',
  subtitle = "L'Art de la Peinture",
  showBack = false,
  showSearch = true,
  showBookmark = true,
  showShare = false,
  badge,
  artworkIdForBookmark,
}) => {
  const {
    goBack,
    navigateTo,
    isBookmarked,
    toggleBookmark,
    selectedArtworkId,
    setIsInstallModalOpen,
    toggleHamburger,
    theme,
    toggleTheme,
  } = useApp();
  const [toastShare, setToastShare] = React.useState(false);

  const targetArtworkId = artworkIdForBookmark || selectedArtworkId;
  const bookmarked = isBookmarked(targetArtworkId);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Regard — L’Art de la Peinture',
          text: 'Découvrez ce chef-d’œuvre dans Regard',
          url: window.location.href,
        });
      } catch {
        // user canceled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToastShare(true);
      setTimeout(() => setToastShare(false), 2500);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-3 sm:px-4 h-14 bg-[#141318]/90 backdrop-blur-md border-b border-[#4d4635]/20">
      {/* Leading actions: Hamburger & Back / Search */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Bouton Hamburger Catégories */}
        <Tooltip content="Menu des catégories & fonctionnalités" position="bottom">
          <button
            onClick={toggleHamburger}
            aria-label="Ouvrir le menu principal"
            className="flex items-center justify-center p-2 text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-200 active:scale-95 cursor-pointer rounded-lg hover:bg-white/[0.05]"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
        </Tooltip>

        {showBack ? (
          <Tooltip content="Retour à l'écran précédent" position="bottom">
            <button
              onClick={goBack}
              aria-label="Retour"
              className="flex items-center justify-center p-2 text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-200 active:scale-95 cursor-pointer rounded-lg hover:bg-white/[0.05]"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          </Tooltip>
        ) : showSearch ? (
          <Tooltip content="Recherche avancée d'œuvres" position="bottom">
            <button
              onClick={() => navigateTo('recherche')}
              aria-label="Recherche rapide"
              className="flex items-center justify-center p-2 text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-200 active:scale-95 cursor-pointer rounded-lg hover:bg-white/[0.05]"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
          </Tooltip>
        ) : null}

        {!showBack && (
          <span className="font-label-caps text-[#99907c] tracking-wider hidden md:inline text-[10px] pl-1">
            ÉDITION QUOTIDIENNE
          </span>
        )}
      </div>

      {/* Center Brand Anchor */}
      <div
        onClick={() => navigateTo('accueil')}
        className="flex flex-col items-center cursor-pointer select-none group"
      >
        <div className="flex items-center gap-1.5">
          <span className="font-headline-md text-[20px] sm:text-[22px] tracking-widest text-[#f2ca50] font-bold group-hover:brightness-110 transition-all">
            {title}
          </span>
          {badge && (
            <span className="text-[9px] uppercase tracking-widest text-[#f2ca50] border border-[#f2ca50]/30 px-1 py-0.5 rounded">
              {badge}
            </span>
          )}
        </div>
        <span className="font-label-caps text-[9px] uppercase tracking-widest text-[#d0c5af]/70 -mt-0.5">
          {subtitle}
        </span>
      </div>

      {/* Trailing actions */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Toggle Thème Sombre / Clair */}
        <Tooltip
          content={theme === 'dark' ? 'Passer au thème Clair' : 'Passer au thème Sombre'}
          position="bottom"
        >
          <button
            onClick={toggleTheme}
            aria-label="Basculer le thème"
            className="flex items-center justify-center p-2 text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-200 active:scale-95 cursor-pointer rounded-lg hover:bg-white/[0.05]"
          >
            <span className="material-symbols-outlined text-[19px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </Tooltip>

        {/* Bouton Installation PWA */}
        <Tooltip content="Installer le raccourci sur votre téléphone ou PC" position="bottom">
          <button
            onClick={() => setIsInstallModalOpen(true)}
            aria-label="Installation de l'application"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md bg-[#201f24] hover:bg-[#2b292f] text-[#f2ca50] hover:text-[#ffe088] border border-[#f2ca50]/30 transition-all text-[11px] font-label-caps cursor-pointer shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px]">download</span>
            <span className="hidden sm:inline">Installation</span>
          </button>
        </Tooltip>

        {showBookmark && (
          <Tooltip content="Ajouter ce chef-d'œuvre à vos favoris" position="bottom">
            <button
              onClick={() => toggleBookmark(targetArtworkId)}
              aria-label="Ajouter à la collection"
              className={`flex items-center justify-center p-2 transition-colors duration-200 active:scale-95 cursor-pointer rounded-lg hover:bg-white/[0.05] ${
                bookmarked ? 'text-[#f2ca50]' : 'text-[#d0c5af] hover:text-[#f2ca50]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: bookmarked ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
            </button>
          </Tooltip>
        )}

        {showShare && (
          <Tooltip content="Partager cette œuvre" position="bottom">
            <button
              onClick={handleShare}
              aria-label="Partager"
              className="flex items-center justify-center p-2 text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-200 active:scale-95 cursor-pointer rounded-lg hover:bg-white/[0.05]"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
          </Tooltip>
        )}
      </div>

      {toastShare && (
        <div className="absolute top-14 right-4 bg-[#201f24] border border-[#f2ca50] text-[#e5e1e8] text-[11px] font-label-caps px-3 py-1.5 rounded-lg shadow-xl animate-fade-in flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#f2ca50] text-[14px]">check</span>
          <span>Lien copié dans le presse-papier !</span>
        </div>
      )}
    </header>
  );
};

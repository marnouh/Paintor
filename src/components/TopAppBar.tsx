import React from 'react';
import { useApp } from '../context/AppContext.tsx';

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
  const { goBack, navigateTo, isBookmarked, toggleBookmark, selectedArtworkId } = useApp();

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
      alert('Lien de la toile copié dans le presse-papier !');
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-14 bg-[#141318]/90 backdrop-blur-md border-b border-[#4d4635]/20">
      {/* Leading action */}
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={goBack}
            aria-label="Retour"
            className="flex items-center justify-center p-2 text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-200 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
        ) : showSearch ? (
          <button
            onClick={() => navigateTo('recherche')}
            aria-label="Recherche rapide"
            className="flex items-center justify-center p-2 text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-200 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
        ) : (
          <div className="w-8" />
        )}
        {!showBack && (
          <span className="font-label-caps text-[#99907c] tracking-wider hidden sm:inline text-[10px]">
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
          <span className="font-headline-md text-[22px] tracking-widest text-[#f2ca50] font-bold group-hover:brightness-110 transition-all">
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
      <div className="flex items-center gap-1">
        {showBookmark && (
          <button
            onClick={() => toggleBookmark(targetArtworkId)}
            aria-label="Ajouter à la collection"
            className={`flex items-center justify-center p-2 transition-colors duration-200 active:scale-95 cursor-pointer ${
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
        )}

        {showShare && (
          <button
            onClick={handleShare}
            aria-label="Partager"
            className="flex items-center justify-center p-2 text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-200 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        )}
      </div>
    </header>
  );
};

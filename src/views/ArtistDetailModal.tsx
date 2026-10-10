import React from 'react';
import { ARTISTS, Artist } from '../data/artists.ts';
import { ARTWORKS } from '../data/artworks.ts';

interface ArtistDetailModalProps {
  artistId: string | null;
  onClose: () => void;
  onSelectArtwork: (id: string) => void;
  onSelectMovement?: (movementName: string) => void;
}

export const ArtistDetailModal: React.FC<ArtistDetailModalProps> = ({
  artistId,
  onClose,
  onSelectArtwork,
}) => {
  if (!artistId) return null;

  const artist = ARTISTS.find((a) => a.id === artistId) || ARTISTS[0];
  const relatedArtworks = ARTWORKS.filter(
    (art) =>
      art.artist.toLowerCase().includes(artist.name.toLowerCase()) ||
      artist.artworkIds.includes(art.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1c1b20] border border-[#f2ca50]/40 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative p-5 bg-[#201f24] border-b border-[#4d4635]/25 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-[#f2ca50]/50 overflow-hidden bg-[#0e0e12] shrink-0 shadow-md">
              <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-caps text-[9.5px] text-[#f2ca50] bg-[#f2ca50]/10 border border-[#f2ca50]/30 px-1.5 py-0.5 rounded font-semibold uppercase">
                  Notice Artiste
                </span>
                <span className="text-[11px] font-mono text-[#99907c]">{artist.datesDisplay}</span>
              </div>
              <h2 className="font-headline-md text-[20px] text-[#e5e1e8] font-bold mt-0.5">
                {artist.name}
              </h2>
              <p className="font-body-sm text-[11px] text-[#d0c5af]">{artist.nationalityOrRegion}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2b292f] text-[#d0c5af] hover:text-[#f2ca50] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto custom-scroll p-5 space-y-4 text-[#e5e1e8]">
          {/* Mouvements */}
          <div className="flex flex-wrap gap-1.5">
            {artist.mainMovements.map((mov) => (
              <span
                key={mov}
                className="px-2.5 py-1 rounded bg-[#f2ca50]/10 border border-[#f2ca50]/30 text-[#f2ca50] font-label-caps text-[10px] font-semibold"
              >
                {mov}
              </span>
            ))}
          </div>

          {/* Quote */}
          {artist.quotes && artist.quotes.length > 0 && (
            <blockquote className="font-title-editorial text-[14px] text-[#e9c349] italic border-l-2 border-[#f2ca50] pl-3 py-1 bg-[#141318]/50 rounded-r">
              {artist.quotes[0]}
            </blockquote>
          )}

          {/* Biography */}
          <div className="space-y-2">
            <h3 className="font-label-caps text-[10.5px] uppercase tracking-wider text-[#99907c] font-semibold">
              Biographie &amp; Vision
            </h3>
            <p className="font-body-md text-[13px] text-[#d0c5af] leading-relaxed">
              {artist.biographyLong}
            </p>
          </div>

          {/* Contexte Historique */}
          <div className="p-3 bg-[#201f24] rounded-lg border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-[#f2ca50] font-label-caps text-[10px] uppercase font-bold">
              <span className="material-symbols-outlined text-[14px]">history</span>
              <span>Contexte de son temps</span>
            </div>
            <p className="font-body-sm text-[11.5px] text-[#d0c5af]">
              {artist.historicalContext}
            </p>
          </div>

          {/* Œuvres de l'artiste dans l'application */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="font-label-caps text-[10.5px] uppercase tracking-wider text-[#99907c] font-semibold">
                Œuvres indexées ({relatedArtworks.length})
              </h3>
              <span className="text-[11px] text-[#f2ca50] font-label-caps">Catalogue local</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {relatedArtworks.map((art) => (
                <div
                  key={art.id}
                  onClick={() => {
                    onClose();
                    onSelectArtwork(art.id);
                  }}
                  className="bg-[#201f24] rounded-lg overflow-hidden border border-white/5 hover:border-[#f2ca50]/40 transition-all cursor-pointer group"
                >
                  <div className="aspect-[4/3] bg-[#0e0e12] overflow-hidden">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-2">
                    <h4 className="font-title-editorial text-[12.5px] text-[#e5e1e8] group-hover:text-[#f2ca50] transition-colors truncate font-semibold">
                      {art.title}
                    </h4>
                    <p className="font-body-sm text-[10px] text-[#99907c] truncate">
                      {art.year > 0 ? art.year : 'Antiquité'} • {art.museum.split(',')[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

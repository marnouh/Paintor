import React from 'react';
import { MOVEMENTS, Movement } from '../data/movements.ts';
import { ARTWORKS } from '../data/artworks.ts';

interface MovementDetailModalProps {
  movementId: string | null;
  onClose: () => void;
  onSelectArtwork: (id: string) => void;
}

export const MovementDetailModal: React.FC<MovementDetailModalProps> = ({
  movementId,
  onClose,
  onSelectArtwork,
}) => {
  if (!movementId) return null;

  const movement =
    MOVEMENTS.find((m) => m.id === movementId || m.name.toLowerCase().includes(movementId.toLowerCase())) ||
    MOVEMENTS[0];

  const relatedArtworks = ARTWORKS.filter(
    (art) =>
      art.movement.toLowerCase().includes(movement.name.toLowerCase()) ||
      movement.associatedArtworkIds.includes(art.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1c1b20] border border-[#f2ca50]/40 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 bg-[#201f24] border-b border-[#4d4635]/25 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label-caps text-[9.5px] text-[#f2ca50] bg-[#f2ca50]/10 border border-[#f2ca50]/30 px-1.5 py-0.5 rounded font-semibold uppercase">
                Notice Mouvement
              </span>
              <span className="text-[11px] font-mono text-[#99907c]">{movement.periodYears}</span>
            </div>
            <h2 className="font-headline-md text-[20px] text-[#e5e1e8] font-bold mt-1">
              {movement.name}
            </h2>
            <p className="font-body-sm text-[11px] text-[#d0c5af]">{movement.geographicCenter}</p>
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
          {/* Definition */}
          <div className="space-y-1.5">
            <h3 className="font-label-caps text-[10.5px] uppercase tracking-wider text-[#99907c] font-semibold">
              Définition &amp; Manifeste
            </h3>
            <p className="font-body-md text-[13px] text-[#d0c5af] leading-relaxed">
              {movement.definition}
            </p>
          </div>

          {/* Caractéristiques stylistiques */}
          <div className="space-y-2 p-3.5 bg-[#201f24] rounded-lg border border-white/5">
            <h3 className="font-label-caps text-[10.5px] uppercase tracking-wider text-[#f2ca50] font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">palette</span>
              Caractéristiques stylistiques clés
            </h3>
            <ul className="space-y-1.5 text-[12px] text-[#d0c5af]">
              {movement.characteristics.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] mt-1.5 shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Artistes majeurs */}
          <div className="space-y-1.5">
            <h3 className="font-label-caps text-[10.5px] uppercase tracking-wider text-[#99907c] font-semibold">
              Artistes emblématiques
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {movement.keyArtists.map((artistName) => (
                <span
                  key={artistName}
                  className="px-2.5 py-1 rounded bg-[#2b292f] border border-white/10 text-[#e5e1e8] font-body-sm text-[11px]"
                >
                  {artistName}
                </span>
              ))}
            </div>
          </div>

          {/* Repères Historiques */}
          <div className="p-3 bg-[#141318] rounded-lg border border-[#4d4635]/30 text-[12px] text-[#d0c5af]">
            <span className="font-label-caps text-[10px] text-[#99907c] uppercase block mb-1 font-bold">
              Repères d'époque
            </span>
            {movement.historicalMilestones}
          </div>

          {/* Toiles représentatives dans l'app */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <h3 className="font-label-caps text-[10.5px] uppercase tracking-wider text-[#99907c] font-semibold">
              Toiles représentatives ({relatedArtworks.length})
            </h3>

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
                      {art.artist}
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

import React, { useState } from 'react';

interface ArtworkImageProps {
  src: string;
  alt: string;
  title?: string;
  artist?: string;
  className?: string;
  aspectRatioClass?: string;
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
}

export const ArtworkImage: React.FC<ArtworkImageProps> = ({
  src,
  alt,
  title,
  artist,
  className = '',
  aspectRatioClass = '',
  loading = 'lazy',
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasError(false);
    setRetryCount((prev) => prev + 1);
  };

  if (hasError || !src) {
    return (
      <div
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center bg-[#1c1b20] border border-[#f2ca50]/20 text-center p-3 overflow-hidden select-none ${aspectRatioClass} ${className}`}
        style={{ minHeight: '120px' }}
      >
        {/* Decorative background framing */}
        <div className="absolute inset-1 border border-white/5 rounded pointer-events-none" />
        <span className="material-symbols-outlined text-[#f2ca50]/50 text-[28px] mb-1.5">
          palette
        </span>
        <span className="font-title-editorial text-[12px] text-[#e5e1e8] font-semibold line-clamp-1 max-w-[90%]">
          {title || alt}
        </span>
        {artist && (
          <span className="font-body-sm text-[10.5px] text-[#99907c] line-clamp-1 max-w-[85%] mt-0.5">
            {artist}
          </span>
        )}
        <div className="mt-2 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#2b292f] text-[9.5px] font-label-caps text-[#d0c5af] border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50]/60" />
            Visuel hors-cache
          </span>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-[#f2ca50] text-[#141318] text-[9.5px] font-label-caps font-bold hover:bg-[#ffe088] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[11px]">refresh</span>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <img
      key={`${src}-${retryCount}`}
      src={src}
      alt={alt}
      loading={loading}
      onClick={onClick}
      onError={() => setHasError(true)}
      className={className}
    />
  );
};

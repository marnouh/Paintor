import React from 'react';
import { useApp } from '../context/AppContext.tsx';

interface ContextualTipBannerProps {
  tipKey: string;
  title: string;
  description: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
}

export const ContextualTipBanner: React.FC<ContextualTipBannerProps> = ({
  tipKey,
  title,
  description,
  icon = 'tips_and_updates',
  actionText,
  onAction,
}) => {
  const { showContextualTips, dismissedTips, dismissTip } = useApp();

  if (!showContextualTips || dismissedTips.includes(tipKey)) {
    return null;
  }

  return (
    <div className="mx-4 my-3 p-3.5 rounded-xl border border-[#f2ca50]/30 bg-[#201f24]/90 backdrop-blur-md shadow-md flex items-start gap-3 transition-all animate-fade-in">
      <div className="w-8 h-8 rounded-lg bg-[#f2ca50]/15 flex items-center justify-center shrink-0 text-[#f2ca50]">
        <span className="material-symbols-outlined text-[19px]">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-title-editorial text-[13px] text-[#f2ca50] font-semibold tracking-wide">
            {title}
          </h4>
          <button
            onClick={() => dismissTip(tipKey)}
            className="text-[#99907c] hover:text-[#e5e1e8] p-1 -mr-1 -mt-1 rounded transition-colors cursor-pointer"
            title="Masquer cette astuce"
            aria-label="Fermer l'astuce"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
        <p className="text-[12px] text-[#d0c5af] leading-relaxed mt-0.5">
          {description}
        </p>
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="mt-2 text-[11px] font-label-caps uppercase tracking-wider text-[#f2ca50] hover:text-[#ffe088] underline flex items-center gap-1 cursor-pointer"
          >
            <span>{actionText}</span>
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </button>
        )}
      </div>
    </div>
  );
};

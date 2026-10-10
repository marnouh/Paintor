import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'bottom',
  children,
  delay = 200,
}) => {
  const { showTooltips } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  if (!showTooltips) {
    return <>{children}</>;
  }

  const handleMouseEnter = () => {
    const id = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[position];

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none whitespace-nowrap px-2.5 py-1 text-[11px] font-sans font-medium rounded-md shadow-lg border border-[#f2ca50]/40 bg-[#1c1b20] text-[#f2ca50] backdrop-blur-md animate-fade-in ${positionClasses}`}
          style={{
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
          }}
        >
          {content}
          <div
            className={`absolute w-1.5 h-1.5 bg-[#1c1b20] border-[#f2ca50]/40 rotate-45 ${
              position === 'bottom'
                ? '-top-1 left-1/2 -translate-x-1/2 border-t border-l'
                : position === 'top'
                ? '-bottom-1 left-1/2 -translate-x-1/2 border-b border-r'
                : position === 'left'
                ? '-right-1 top-1/2 -translate-y-1/2 border-t border-r'
                : '-left-1 top-1/2 -translate-y-1/2 border-b border-l'
            }`}
          />
        </div>
      )}
    </div>
  );
};

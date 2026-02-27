import React from 'react';
import { ViewMode, hexToRgba } from './data/elements';

interface ModeTabsProps {
  currentMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const tabs: { mode: ViewMode; label: string; available: boolean }[] = [
  { mode: 'properties', label: '性质', available: false },
  { mode: 'electrons', label: '电子层', available: false },
  { mode: 'isotopes', label: '同位素', available: true },
  { mode: 'compounds', label: '化合物', available: false },
];

const activeColor = '#00E5FF';
const inactiveColor = '#6B7280';

const ModeTabs: React.FC<ModeTabsProps> = ({ currentMode, onChange }) => {
  return (
    <div 
      className="absolute left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {tabs.map((tab) => {
        const isActive = currentMode === tab.mode;
        const color = isActive ? activeColor : inactiveColor;
        
        return (
          <button
            key={tab.mode}
            onClick={() => tab.available && onChange(tab.mode)}
            className={`
              relative px-3 py-2 text-xs font-mono tracking-wider
              transition-all duration-300 text-left
              ${tab.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
            `}
            style={{
              background: isActive ? hexToRgba(activeColor, 0.1) : 'transparent',
              border: `1px solid ${hexToRgba(color, isActive ? 0.6 : 0.2)}`,
              color: isActive ? activeColor : 'rgba(255,255,255,0.4)',
              boxShadow: isActive 
                ? `0 0 15px ${hexToRgba(activeColor, 0.3)}, inset 0 0 10px ${hexToRgba(activeColor, 0.1)}`
                : 'none',
            }}
            title={tab.available ? tab.label : `${tab.label} (暂未实现)`}
          >
            {/* 激活指示器 */}
            {isActive && (
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4"
                style={{
                  background: activeColor,
                  boxShadow: `0 0 8px ${activeColor}`,
                }}
              />
            )}
            
            {tab.label}
            
            {/* 未实现标记 */}
            {!tab.available && (
              <span className="ml-1 text-[8px] opacity-50">...</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ModeTabs;

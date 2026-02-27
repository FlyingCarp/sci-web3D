import React from 'react';
import { motion } from 'framer-motion';
import { Isotope, hexToRgba } from './data/elements';

interface IsotopeCardProps {
  isotope: Isotope;
  elementSymbol: string;
  atomicNumber: number;
  index: number;
  totalCount: number;
  seriesColor: string;
}

const IsotopeCard: React.FC<IsotopeCardProps> = ({
  isotope,
  elementSymbol,
  atomicNumber,
  index,
  totalCount,
  seriesColor,
}) => {
  const massNumber = atomicNumber + isotope.neutrons;
  const isStable = isotope.decaymode === 'Stable' || isotope.halflife === 'Infinity';
  const abundance = parseFloat(isotope.masscontrib);
  const hasAbundance = abundance > 0;
  
  // 稳定同位素用绿色，放射性用红色
  const stabilityColor = isStable ? '#22C55E' : '#EF4444';
  
  // 格式化半衰期
  const formatHalflife = (hl: string): string => {
    if (hl === 'Infinity') return '稳定';
    const num = parseFloat(hl);
    if (isNaN(num)) return hl;
    if (num >= 3.154e7) return `${(num / 3.154e7).toFixed(1)}年`;
    if (num >= 86400) return `${(num / 86400).toFixed(1)}天`;
    if (num >= 3600) return `${(num / 3600).toFixed(1)}时`;
    if (num >= 60) return `${(num / 60).toFixed(1)}分`;
    if (num >= 1) return `${num.toFixed(1)}秒`;
    if (num >= 1e-3) return `${(num * 1e3).toFixed(1)}ms`;
    if (num >= 1e-6) return `${(num * 1e6).toFixed(1)}μs`;
    if (num >= 1e-9) return `${(num * 1e9).toFixed(1)}ns`;
    return `<1ns`;
  };

  // 沿着与周期表倾斜方向一致的直线展开
  // 倾斜方向是 rotateX: -8, rotateY: 12，视觉上是向右上方倾斜
  // 1. 卡片倾斜角度向右下
  const spacing = 72; // 卡片间距
  const offsetX = index * spacing * 0.9;  // 保持向右
  const offsetY = index * spacing * 0.4;  // 修改为正数，使其向下展开

  

  return (
    <motion.div
      className="absolute pointer-events-auto"
      initial={{ 
        opacity: 0, 
        x: 0, 
        y: 0,
        scale: 0.3,
      }}
      animate={{ 
        opacity: 1, 
        x: offsetX,
        y: offsetY,
        scale: 1,
      }}
      exit={{ 
        opacity: 0, 
        x: 0, 
        y: 0,
        scale: 0.3,
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 25,
        delay: index * 0.025,
      }}
      whileHover={{
        scale: 1.1,
        zIndex: 100,
        transition: { duration: 0.15 }
      }}
      style={{
        zIndex: totalCount - index,
        transformOrigin: 'left center',
      }}
    >
      <div
        className="w-14 h-16 flex flex-col items-center justify-center relative cursor-pointer"
        style={{
          background: hexToRgba(seriesColor, 0.12),
          border: `1px solid ${hexToRgba(seriesColor, 0.6)}`,
          boxShadow: `
            0 0 15px ${hexToRgba(seriesColor, 0.4)},
            inset 0 0 10px ${hexToRgba(seriesColor, 0.1)}
          `,
        }}
      >
        {/* 稳定性指示器 */}
        <div 
          className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
          style={{
            background: stabilityColor,
            boxShadow: `0 0 4px ${stabilityColor}`,
          }}
          title={isStable ? '稳定' : '放射性'}
        />

        {/* 质量数 (上标) */}
        <span 
          className="absolute top-0.5 left-1 text-[9px] font-bold font-mono"
          style={{ color: seriesColor }}
        >
          {massNumber}
        </span>

        {/* 元素符号 */}
        <span 
          className="text-base font-bold mt-1"
          style={{ 
            color: seriesColor,
            textShadow: `0 0 8px ${hexToRgba(seriesColor, 0.6)}`
          }}
        >
          {elementSymbol}
        </span>

        {/* 丰度或半衰期 */}
        <span 
          className="text-[8px] text-white/70 mt-0.5"
          title={hasAbundance ? `自然丰度: ${abundance}%` : `半衰期: ${isotope.halflife}秒`}
        >
          {hasAbundance ? `${abundance.toFixed(2)}%` : formatHalflife(isotope.halflife)}
        </span>

        {/* 衰变模式 (非稳定时显示) */}
        {!isStable && (
          <span 
            className="text-[6px] text-white/40 truncate max-w-full px-0.5"
            title={isotope.decaymode}
          >
            {isotope.decaymode.replace('Decay', '').replace('Emission', '')}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default IsotopeCard;

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Element, 
  seriesColors, 
  ElementSeries, 
  hexToRgba,
  getMatterState,
  stateColors,
  stateStyles,
} from './data/elements';

interface ElementCardProps {
  element: Element;
  temperature: number;
  showStateColors: boolean;
  isSelected: boolean;
  highlightedSeries?: ElementSeries | null;
  onSelect: (element: Element) => void;
  onHover: (element: Element | null) => void;
}

const ElementCard: React.FC<ElementCardProps> = ({
  element,
  temperature,
  showStateColors,
  isSelected,
  highlightedSeries,
  onSelect,
  onHover,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const neonColor = seriesColors[element.series as ElementSeries];
  
  // 计算当前温度下的物态
  const matterState = useMemo(() => 
    getMatterState(element, temperature), 
    [element, temperature]
  );
  
  // 获取物态对应的样式
  const stateStyle = stateStyles[matterState];
  const stateColor = stateColors[matterState];
  
  // 根据 showStateColors 决定使用哪个颜色
  // 默认使用元素分类颜色，只有温度改变时才使用物态颜色
  const displayColor = showStateColors ? stateColor : neonColor;

  // 系列高亮时，非高亮元素变暗
  const isSeriesHighlighted = highlightedSeries !== null && highlightedSeries !== undefined;
  const isThisSeriesHighlighted = highlightedSeries === element.series;
  const isDimmed = isSeriesHighlighted && !isThisSeriesHighlighted;

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(element);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(null);
  };

  // 根据是否显示物态颜色计算视觉效果
  const getVisuals = () => {
    if (showStateColors) {
      // 显示物态颜色模式
      const baseGlow = stateStyle.glowIntensity;
      const opacity = stateStyle.opacity;
      const borderStyle = stateStyle.borderStyle;
      const borderOpacity = isHovered || isSelected ? 0.9 : 0.5;
      const bgOpacity = isHovered || isSelected ? 0.12 : 0.05;
      const background = `linear-gradient(135deg, ${hexToRgba(stateColor, bgOpacity)}, ${hexToRgba(neonColor, bgOpacity * 0.3)})`;
      const glowStrength = isHovered || isSelected ? 25 * baseGlow : 10 * baseGlow;
      const innerGlow = isHovered || isSelected ? 15 : 5;
      
      const boxShadow = matterState === 'gas'
        ? `0 0 ${glowStrength}px ${hexToRgba(stateColor, 0.4)}, 0 0 ${glowStrength * 2}px ${hexToRgba(stateColor, 0.15)}`
        : `0 0 ${glowStrength}px ${hexToRgba(stateColor, 0.5)}, 0 0 ${glowStrength * 1.5}px ${hexToRgba(neonColor, 0.2)}, inset 0 0 ${innerGlow}px ${hexToRgba(stateColor, 0.1)}`;
      
      return {
        opacity,
        background,
        border: `1px ${borderStyle} ${hexToRgba(stateColor, borderOpacity)}`,
        boxShadow,
        borderRadius: matterState === 'liquid' ? '4px' : '0px',
      };
    } else {
      // 默认模式 - 使用元素分类颜色
      const borderOpacity = isHovered || isSelected ? 0.8 : 0.4;
      const bgOpacity = isHovered || isSelected ? 0.08 : 0.03;
      
      return {
        opacity: 1,
        background: hexToRgba(neonColor, bgOpacity),
        border: `1px solid ${hexToRgba(neonColor, borderOpacity)}`,
        boxShadow: isHovered || isSelected
          ? `0 0 20px ${hexToRgba(neonColor, 0.5)}, 0 0 40px ${hexToRgba(neonColor, 0.2)}, inset 0 0 15px ${hexToRgba(neonColor, 0.1)}`
          : `0 0 8px ${hexToRgba(neonColor, 0.15)}`,
        borderRadius: '0px',
      };
    }
  };

  const visuals = getVisuals();

  // 物态动画只在显示物态颜色时生效 - 只有气态闪烁
  const getAnimationClass = (): string => {
    if (!showStateColors) return '';
    // 固态和液态不闪烁，只有气态有脉动辉光
    if (matterState === 'gas') return 'animate-pulse';
    return '';
  };

  // 计算最终透明度
  const finalOpacity = isDimmed ? visuals.opacity * 0.3 : visuals.opacity;
  const finalScale = isDimmed ? 0.95 : 1;
  const highlightScale = isThisSeriesHighlighted ? 1.05 : 1;

  return (
    <motion.div
      className={`element-card ${getAnimationClass()}`}
      style={{
        gridRow: element.row,
        gridColumn: element.col,
        opacity: finalOpacity,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: finalOpacity, 
        scale: finalScale * highlightScale,
        z: isSelected ? 30 : (isThisSeriesHighlighted ? 10 : 0),
        y: showStateColors && matterState === 'gas' ? -2 : 0,
      }}
      whileHover={{ 
        scale: 1.1,
        z: 25,
        transition: { duration: 0.15 }
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(element)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
    >
      <div 
        className="relative w-full h-full cursor-pointer flex flex-col items-center justify-center transition-all duration-300"
        style={{
          background: visuals.background,
          border: visuals.border,
          boxShadow: visuals.boxShadow,
          borderRadius: visuals.borderRadius,
        }}
      >
        {/* 物态指示器 - 只在显示物态颜色时显示 */}
        {showStateColors && (
          <div 
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
            style={{
              background: stateColor,
              boxShadow: `0 0 4px ${stateColor}`,
              opacity: matterState === 'unknown' ? 0.3 : 0.8,
            }}
          />
        )}

        {/* 原子序数 */}
        <span 
          className="absolute top-1 left-1.5 text-[0.5rem] font-mono"
          style={{ color: hexToRgba(displayColor, 0.7) }}
        >
          {element.atomic}
        </span>

        {/* 元素符号 */}
        <span 
          className="text-lg font-bold leading-none transition-colors duration-200"
          style={{ 
            color: isHovered || isSelected ? displayColor : 'rgba(255,255,255,0.9)',
            textShadow: isHovered || isSelected ? `0 0 10px ${hexToRgba(displayColor, 0.8)}` : 'none'
          }}
        >
          {element.symbol}
        </span>

        {/* 元素名称 */}
        <span 
          className="text-[0.5rem] mt-0.5 leading-none text-white/60"
        >
          {element.name}
        </span>

        {/* 原子量 */}
        <span 
          className="text-[0.4rem] mt-0.5 leading-none font-mono text-white/30"
        >
          {parseFloat(element.weight).toFixed(element.weight.includes('.') ? 
            Math.min(element.weight.split('.')[1]?.length || 0, 2) : 0)}
        </span>

        {/* 选中指示器 */}
        {isSelected && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              border: `2px solid ${displayColor}`,
              boxShadow: `0 0 25px ${hexToRgba(displayColor, 0.6)}, inset 0 0 20px ${hexToRgba(displayColor, 0.15)}`,
              borderRadius: visuals.borderRadius,
            }}
          />
        )}

      </div>
    </motion.div>
  );
};

export default ElementCard;

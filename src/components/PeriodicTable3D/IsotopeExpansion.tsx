import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Element, Isotope, loadIsotopes, seriesColors, hexToRgba } from './data/elements';
import IsotopeCard from './IsotopeCard';

interface IsotopeExpansionProps {
  element: Element | null;
  onClose: () => void;
}

const IsotopeExpansion: React.FC<IsotopeExpansionProps> = ({ element, onClose }) => {
  const [isotopes, setIsotopes] = useState<Isotope[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (element) {
      setLoading(true);
      loadIsotopes(element.atomic).then((data) => {
        // 按质量数排序
        const sorted = data.sort((a, b) => a.neutrons - b.neutrons);
        setIsotopes(sorted);
        setLoading(false);
      });
    } else {
      setIsotopes([]);
    }
  }, [element]);

  if (!element) return null;

  const seriesColor = seriesColors[element.series];

  // 计算元素在网格中的位置（基于网格布局）
  // 网格单元格大小约为 48px + 4px gap = 52px
  const cellSize = 52;
  const gridCols = 18;
  const gridRows = 10;
  
  // 计算元素相对于网格中心的位置
  const elementX = (element.col - (gridCols + 1) / 2) * cellSize;
  const elementY = (element.row - (gridRows + 1) / 2) * cellSize;

  return (
    <AnimatePresence>
      <motion.div
        key={element.atomic}
        className="absolute inset-0 pointer-events-none z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* 元素信息标题 */}
        <motion.div
          className="absolute top-4 right-4 pointer-events-auto z-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          style={{
            background: hexToRgba(seriesColor, 0.15),
            border: `1px solid ${hexToRgba(seriesColor, 0.5)}`,
            boxShadow: `0 0 20px ${hexToRgba(seriesColor, 0.3)}`,
            padding: '12px 20px',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span 
                className="text-2xl font-bold"
                style={{ 
                  color: seriesColor,
                  textShadow: `0 0 15px ${hexToRgba(seriesColor, 0.8)}`
                }}
              >
                {element.symbol}
              </span>
              <div className="text-[10px] text-white/60">{element.name}</div>
            </div>
            
            <div className="border-l border-white/20 pl-3 text-right">
              <div className="text-xs text-white/80">
                <span style={{ color: seriesColor }}>{isotopes.length}</span> 种同位素
              </div>
              <div className="text-[10px] text-white/50">
                {isotopes.filter(i => i.decaymode === 'Stable' || i.halflife === 'Infinity').length} 种稳定
              </div>
            </div>

            <button
              onClick={onClose}
              className="ml-2 px-2 py-1 text-[10px] transition-all duration-200 hover:bg-white/10"
              style={{
                border: `1px solid ${hexToRgba(seriesColor, 0.3)}`,
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              ✕
            </button>
          </div>
        </motion.div>

        {/* 同位素卡片容器 - 从元素原位置展开 */}
        <div 
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(calc(-50% + ${elementX}px), calc(-50% + ${elementY}px))`,
            transformStyle: 'preserve-3d',
          }}
        >
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/50 text-sm"
            >
              加载中...
            </motion.div>
          ) : (
            <AnimatePresence>
              {isotopes.map((isotope, index) => (
                <IsotopeCard
                  key={`${element.atomic}-${isotope.neutrons}`}
                  isotope={isotope}
                  elementSymbol={element.symbol}
                  atomicNumber={element.atomic}
                  index={index}
                  totalCount={isotopes.length}
                  seriesColor={seriesColor}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* 底部说明 */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6 text-[10px] text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3 } }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span>稳定</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
            <span>放射性</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IsotopeExpansion;

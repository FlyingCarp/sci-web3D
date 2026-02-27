import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Element, seriesColors, hexToRgba } from './data/elements';
import { X } from 'lucide-react';

interface ElementDetailProps {
  element: Element | null;
  onClose: () => void;
}

const ElementDetail: React.FC<ElementDetailProps> = ({ element, onClose }) => {
  if (!element) return null;

  const neonColor = seriesColors[element.series];

  // 元素系列中文名
  const seriesNames: Record<string, string> = {
    Alkali: '碱金属',
    Alkaline: '碱土金属',
    Transition: '过渡金属',
    Lanthanoid: '镧系元素',
    Actinoid: '锕系元素',
    Poor: '贫金属',
    Metalloid: '准金属',
    Nonmetal: '非金属',
    Noble: '惰性气体',
    Unknown: '未知',
  };

  // 数据项组件
  const DataRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center py-1 border-b border-white/5">
      <span className="text-white/40 text-xs tracking-wide">{label}</span>
      <span className="text-white/80 text-xs font-mono">{value}</span>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 min-w-[300px] max-w-[90vw]"
        style={{
          // 透明背景 + 发光边框
          background: hexToRgba(neonColor, 0.03),
          border: `1px solid ${hexToRgba(neonColor, 0.5)}`,
          boxShadow: `
            0 0 30px ${hexToRgba(neonColor, 0.2)},
            0 0 60px ${hexToRgba(neonColor, 0.1)},
            inset 0 0 30px ${hexToRgba(neonColor, 0.05)}
          `,
        }}
      >
        {/* 顶部装饰线 */}
        <div 
          className="absolute top-0 left-4 right-4 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${neonColor}, transparent)` }}
        />

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 transition-all duration-200 hover:bg-white/5"
          style={{
            border: `1px solid ${hexToRgba(neonColor, 0.3)}`,
          }}
        >
          <X size={14} style={{ color: hexToRgba(neonColor, 0.7) }} />
        </button>

        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* 元素符号大卡片 - HUD 风格 */}
            <div
              className="w-20 h-20 flex flex-col items-center justify-center shrink-0 relative"
              style={{
                background: hexToRgba(neonColor, 0.05),
                border: `1px solid ${hexToRgba(neonColor, 0.6)}`,
                boxShadow: `0 0 20px ${hexToRgba(neonColor, 0.3)}, inset 0 0 15px ${hexToRgba(neonColor, 0.1)}`,
              }}
            >
              {/* 角标装饰 */}
              <div 
                className="absolute top-0 left-0 w-2 h-2 border-t border-l"
                style={{ borderColor: neonColor }}
              />
              <div 
                className="absolute top-0 right-0 w-2 h-2 border-t border-r"
                style={{ borderColor: neonColor }}
              />
              <div 
                className="absolute bottom-0 left-0 w-2 h-2 border-b border-l"
                style={{ borderColor: neonColor }}
              />
              <div 
                className="absolute bottom-0 right-0 w-2 h-2 border-b border-r"
                style={{ borderColor: neonColor }}
              />

              <span 
                className="text-[10px] font-mono"
                style={{ color: hexToRgba(neonColor, 0.7) }}
              >
                {element.atomic}
              </span>
              <span 
                className="text-3xl font-bold"
                style={{ 
                  color: neonColor,
                  textShadow: `0 0 15px ${hexToRgba(neonColor, 0.8)}`
                }}
              >
                {element.symbol}
              </span>
              <span className="text-[10px] text-white/60">
                {element.name}
              </span>
            </div>

            {/* 详细信息 - 数据网格风格 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-3">
                <h3 
                  className="text-lg font-light tracking-wide"
                  style={{ color: neonColor }}
                >
                  {element.name}
                </h3>
                <span className="text-white/30 text-sm font-mono">
                  {element.symbol}
                </span>
              </div>

              <div className="space-y-0">
                <DataRow label="原子量" value={element.weight} />
                <DataRow label="分类" value={seriesNames[element.series]} />
                {element.melt && <DataRow label="熔点" value={`${element.melt} K`} />}
                {element.boil && <DataRow label="沸点" value={`${element.boil} K`} />}
                {element.electroneg && <DataRow label="电负性" value={element.electroneg} />}
                <DataRow label="电子排布" value={element.electrons.join('-')} />
              </div>
            </div>
          </div>
        </div>

        {/* 底部装饰线 */}
        <div 
          className="absolute bottom-0 left-4 right-4 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${hexToRgba(neonColor, 0.5)}, transparent)` }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ElementDetail;

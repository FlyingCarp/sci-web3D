import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';
import ElementCard from './ElementCard';
import ElementDetail from './ElementDetail';
import TemperatureSlider from './TemperatureSlider';
import ModeTabs from './ModeTabs';
import IsotopeExpansion from './IsotopeExpansion';
import { Element, parseElements, seriesColors, ElementSeries, hexToRgba, ViewMode } from './data/elements';

interface PeriodicTable3DProps {
  className?: string;
}

const PeriodicTable3D: React.FC<PeriodicTable3DProps> = ({
  className = '',
}) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [highlightedSeries, setHighlightedSeries] = useState<ElementSeries | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('properties');
  const [temperature, setTemperature] = useState(298);
  const DEFAULT_TEMPERATURE = 298;
  const showStateColors = temperature !== DEFAULT_TEMPERATURE;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // 同位素模式下选中元素时的固定倾斜角度
  const isIsotopeMode = viewMode === 'isotopes';
  const isotopeSelected = isIsotopeMode && selectedElement !== null;

  // Spring 动画值
  const rotateX = useSpring(0, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 20 });

  // 当同位素模式选中元素时，设置固定倾斜角度
  useEffect(() => {
    if (isotopeSelected) {
      rotateX.set(-8);
      rotateY.set(12);
    } else if (!isDragging) {
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [isotopeSelected, isDragging, rotateX, rotateY]);

  // 加载元素数据
  useEffect(() => {
    fetch('/data/elements.json')
      .then(res => res.json())
      .then(data => {
        const parsed = parseElements(data);
        setElements(parsed);
      })
      .catch(err => console.error('Failed to load elements:', err));
  }, []);

  // 切换模式时清除选中
  const handleModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    setSelectedElement(null);
  }, []);

  // 拖拽处理 - 同位素选中时禁用拖拽
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isotopeSelected) return;
    if ((e.target as HTMLElement).closest('.element-card')) return;
    
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, [isotopeSelected]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || isotopeSelected) return;

    const deltaX = (e.clientX - dragStart.current.x) * 0.08;
    const deltaY = (e.clientY - dragStart.current.y) * 0.08;

    const clampedX = Math.max(-12, Math.min(12, -deltaY));
    const clampedY = Math.max(-12, Math.min(12, deltaX));

    rotateX.set(clampedX);
    rotateY.set(clampedY);
  }, [isDragging, isotopeSelected, rotateX, rotateY]);

  const handleMouseUp = useCallback(() => {
    if (isotopeSelected) return;
    setIsDragging(false);
    rotateX.set(0);
    rotateY.set(0);
  }, [isotopeSelected, rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging && !isotopeSelected) {
      setIsDragging(false);
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [isDragging, isotopeSelected, rotateX, rotateY]);

  // 图例数据
  const legendItems: { series: ElementSeries; name: string }[] = [
    { series: 'Alkali', name: '碱金属' },
    { series: 'Alkaline', name: '碱土金属' },
    { series: 'Transition', name: '过渡金属' },
    { series: 'Lanthanoid', name: '镧系' },
    { series: 'Actinoid', name: '锕系' },
    { series: 'Poor', name: '贫金属' },
    { series: 'Metalloid', name: '准金属' },
    { series: 'Nonmetal', name: '非金属' },
    { series: 'Noble', name: '惰性气体' },
    { series: 'Unknown', name: '未知' },
  ];

  return (
    <div
      ref={containerRef}
      className={`
        relative w-full h-full min-h-screen overflow-hidden select-none
        bg-[#030308]
        ${className}
      `}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isotopeSelected ? 'default' : (isDragging ? 'grabbing' : 'grab') }}
    >
      {/* 标题 - HUD 风格 */}
      <div className="absolute top-4 left-4 z-40">
        <h1 className="text-xl font-light tracking-[0.2em] text-white/90 uppercase">
          Periodic Table
        </h1>
        <p className="text-xs mt-1 text-white/40 tracking-wide">
          {isIsotopeMode ? '点击元素查看同位素' : '拖拽旋转 · 点击查看详情'}
        </p>
      </div>

      {/* 模式选择器 */}
      <ModeTabs currentMode={viewMode} onChange={handleModeChange} />

      {/* 图例 - 始终显示 */}
      <div className="absolute top-16 left-4 z-40 py-2">
          <div className="grid grid-cols-2 gap-x-5 gap-y-1">
            {legendItems.map(item => {
              const color = seriesColors[item.series];
              const isHighlighted = highlightedSeries === item.series;
              return (
                <div 
                  key={item.series} 
                  className="flex items-center gap-2 cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHighlightedSeries(item.series)}
                  onMouseLeave={() => setHighlightedSeries(null)}
                  style={{
                    transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <div 
                    className="w-2.5 h-2.5 rounded-sm transition-all duration-200"
                    style={{ 
                      background: isHighlighted ? hexToRgba(color, 0.3) : 'transparent',
                      border: `1px solid ${color}`,
                      boxShadow: isHighlighted 
                        ? `0 0 8px ${hexToRgba(color, 0.8)}` 
                        : `0 0 4px ${hexToRgba(color, 0.5)}`
                    }}
                  />
                  <span 
                    className="text-[10px] tracking-wide transition-all duration-200"
                    style={{ 
                      color: isHighlighted ? color : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      {/* 周期表容器 */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4 pt-16 overflow-auto"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="periodic-grid-wrapper"
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* 周期表网格 */}
          <div
            className="periodic-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(18, minmax(40px, 56px))',
              gridTemplateRows: 'repeat(10, minmax(44px, 56px))',
              gap: '4px',
              transformStyle: 'preserve-3d',
              opacity: isotopeSelected ? 0.3 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
          {/* 镧系/锕系占位标记 */}
          <div 
            className="flex items-center justify-center text-[10px] text-white/20 font-mono"
            style={{ 
              gridRow: 6, 
              gridColumn: 3,
              border: '1px dashed rgba(255,255,255,0.1)',
            }}
          >
            57-71
          </div>
          <div 
            className="flex items-center justify-center text-[10px] text-white/20 font-mono"
            style={{ 
              gridRow: 7, 
              gridColumn: 3,
              border: '1px dashed rgba(255,255,255,0.1)',
            }}
          >
            89-103
          </div>

          {/* 元素卡片 */}
          {elements.map(element => (
            <ElementCard
              key={element.atomic}
              element={element}
              temperature={temperature}
              showStateColors={showStateColors && !isIsotopeMode}
              isSelected={selectedElement?.atomic === element.atomic}
              highlightedSeries={highlightedSeries}
              onSelect={setSelectedElement}
              onHover={setHoveredElement}
            />
          ))}
        </div>
        </motion.div>
      </div>

      {/* 同位素展开视图 */}
      {isIsotopeMode && (
        <IsotopeExpansion
          element={selectedElement}
          onClose={() => setSelectedElement(null)}
        />
      )}

      {/* 悬浮提示 - 非同位素模式 */}
      {hoveredElement && !selectedElement && !isIsotopeMode && (
        <div 
          className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 pointer-events-none"
          style={{ 
            background: 'transparent',
            border: `1px solid ${hexToRgba(seriesColors[hoveredElement.series], 0.5)}`,
            boxShadow: `0 0 15px ${hexToRgba(seriesColors[hoveredElement.series], 0.3)}`,
          }}
        >
          <span 
            className="text-sm font-light tracking-wide"
            style={{ color: seriesColors[hoveredElement.series] }}
          >
            {hoveredElement.name}
          </span>
          <span className="text-white/60 text-sm ml-2">
            {hoveredElement.symbol}
          </span>
          <span className="text-white/40 text-xs ml-3 font-mono">
            {hoveredElement.weight}
          </span>
        </div>
      )}

      {/* 温度滑块 - 非同位素模式显示 */}
      {!isIsotopeMode && (
        <TemperatureSlider
          temperature={temperature}
          onChange={setTemperature}
        />
      )}

      {/* 详情面板 - 非同位素模式显示 */}
      {!isIsotopeMode && (
        <ElementDetail
          element={selectedElement}
          onClose={() => setSelectedElement(null)}
        />
      )}
    </div>
  );
};

export default PeriodicTable3D;

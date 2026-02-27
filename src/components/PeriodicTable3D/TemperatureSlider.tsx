import React from 'react';
import { hexToRgba } from './data/elements';

interface TemperatureSliderProps {
  temperature: number;
  onChange: (temp: number) => void;
}

// 预设温度快捷按钮
const presets = [
  { label: '0K', value: 0, desc: '绝对零度' },
  { label: '298K', value: 298, desc: '室温' },
  { label: '373K', value: 373, desc: '水沸点' },
  { label: '1811K', value: 1811, desc: '铁熔点' },
  { label: '6000K', value: 6000, desc: '太阳表面' },
];

// 温度滑块主色
const sliderColor = '#00E5FF';

const TemperatureSlider: React.FC<TemperatureSliderProps> = ({
  temperature,
  onChange,
}) => {
  // 开尔文转摄氏度
  const celsius = Math.round(temperature - 273.15);

  return (
    <div 
      className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3"
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        border: `1px solid ${hexToRgba(sliderColor, 0.3)}`,
        borderRadius: '12px',
        padding: '16px 12px',
        boxShadow: `0 0 20px ${hexToRgba(sliderColor, 0.1)}`,
      }}
    >
      {/* 标题 */}
      <div className="text-center mb-1">
        <div 
          className="text-[10px] font-mono tracking-widest uppercase"
          style={{ color: hexToRgba(sliderColor, 0.7) }}
        >
          Temperature
        </div>
      </div>

      {/* 温度显示 */}
      <div className="text-center">
        <div 
          className="text-2xl font-bold font-mono"
          style={{ 
            color: sliderColor,
            textShadow: `0 0 10px ${hexToRgba(sliderColor, 0.5)}`
          }}
        >
          {temperature}
          <span className="text-sm ml-1">K</span>
        </div>
        <div className="text-xs text-white/40 font-mono">
          {celsius > 0 ? '+' : ''}{celsius}°C
        </div>
      </div>

      {/* 垂直滑块 */}
      <div className="relative h-48 w-8 flex items-center justify-center">
        {/* 轨道背景 */}
        <div 
          className="absolute w-1 h-full rounded-full"
          style={{
            background: `linear-gradient(to top, 
              ${hexToRgba('#3B82F6', 0.4)}, 
              ${hexToRgba('#F59E0B', 0.5)}, 
              ${hexToRgba('#EF4444', 0.6)}
            )`,
          }}
        />
        
        {/* 滑块轨道 */}
        <input
          type="range"
          min="0"
          max="6000"
          step="1"
          value={temperature}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute h-full cursor-pointer"
          style={{
            writingMode: 'vertical-lr',
            direction: 'rtl',
            WebkitAppearance: 'none',
            appearance: 'none',
            width: '32px',
            background: 'transparent',
          }}
        />

        {/* 刻度标记 */}
        <div className="absolute left-8 h-full flex flex-col justify-between text-[8px] text-white/30 font-mono py-1">
          <span>6000</span>
          <span>3000</span>
          <span>0</span>
        </div>
      </div>

      {/* 快捷按钮 */}
      <div className="flex flex-col gap-1 mt-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            className="px-2 py-1 text-[9px] font-mono transition-all duration-200"
            style={{
              background: temperature === preset.value 
                ? hexToRgba(sliderColor, 0.2) 
                : 'transparent',
              border: `1px solid ${hexToRgba(sliderColor, temperature === preset.value ? 0.5 : 0.2)}`,
              color: temperature === preset.value ? sliderColor : 'rgba(255,255,255,0.5)',
              borderRadius: '4px',
            }}
            title={preset.desc}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* 物态图例 */}
      <div className="mt-3 pt-3 border-t border-white/10 w-full">
        <div className="text-[8px] text-white/30 text-center mb-2 uppercase tracking-wider">State</div>
        <div className="flex flex-col gap-1 text-[9px]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm" style={{ background: 'transparent', border: '1px solid #3B82F6' }} />
            <span className="text-white/50">固态</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm" style={{ background: '#F59E0B', border: '1px solid #F59E0B', boxShadow: '0 0 4px #F59E0B' }} />
            <span className="text-white/50">液态</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm animate-pulse" style={{ background: 'transparent', border: '1px dashed #EF4444', boxShadow: '0 0 8px #EF4444' }} />
            <span className="text-white/50">气态</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureSlider;

// ========== 视图模式相关 ==========

// 视图模式类型
export type ViewMode = 'properties' | 'electrons' | 'isotopes' | 'compounds';

// 同位素数据接口
export interface Isotope {
  neutrons: number;
  isomass: string;
  binding: string;
  masscontrib: string;
  halflife: string;
  decaymode: string;
  excess?: string;
  magneticmoment?: string | null;
  quadrupolemoment?: string | null;
  specificactivity?: string;
  isowiki?: string;
}

// 加载同位素数据
export async function loadIsotopes(atomicNumber: number): Promise<Isotope[]> {
  try {
    const response = await fetch(`/ptable_offline/JSON/isotope/${atomicNumber}.json`);
    if (!response.ok) throw new Error('Failed to load isotopes');
    return await response.json();
  } catch (error) {
    console.error('Error loading isotopes:', error);
    return [];
  }
}

// 元素系列类型
export type ElementSeries = 
  | 'Alkali' 
  | 'Alkaline' 
  | 'Transition' 
  | 'Lanthanoid' 
  | 'Actinoid' 
  | 'Poor' 
  | 'Metalloid' 
  | 'Nonmetal' 
  | 'Noble' 
  | 'Unknown';

// 元素数据接口
export interface Element {
  atomic: number;
  symbol: string;
  name: string;
  weight: string;
  series: ElementSeries;
  electrons: number[];
  melt?: string;
  boil?: string;
  electroneg?: string;
  // 周期表位置
  row: number;
  col: number;
}

// 元素系列颜色配置 - 全息霓虹色系
// 使用高饱和度纯色，用于边框发光效果
export const seriesColors: Record<ElementSeries, string> = {
  Alkali:     '#FF4D4D', // 霓虹红
  Alkaline:   '#FFD700', // 霓虹金黄
  Transition: '#FF8C00', // 霓虹橙
  Lanthanoid: '#FF69B4', // 霓虹粉
  Actinoid:   '#E066FF', // 霓虹紫红
  Poor:       '#00BFFF', // 霓虹蓝
  Metalloid:  '#00FA9A', // 霓虹青绿
  Nonmetal:   '#7CFC00', // 霓虹绿
  Noble:      '#9370DB', // 霓虹紫
  Unknown:    '#808080', // 银灰
};

// 辅助函数：将 hex 转为 rgba
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 元素中英文名称映射
export const elementNames: Record<string, string> = {
  H: '氢', He: '氦', Li: '锂', Be: '铍', B: '硼', C: '碳', N: '氮', O: '氧', F: '氟', Ne: '氖',
  Na: '钠', Mg: '镁', Al: '铝', Si: '硅', P: '磷', S: '硫', Cl: '氯', Ar: '氩', K: '钾', Ca: '钙',
  Sc: '钪', Ti: '钛', V: '钒', Cr: '铬', Mn: '锰', Fe: '铁', Co: '钴', Ni: '镍', Cu: '铜', Zn: '锌',
  Ga: '镓', Ge: '锗', As: '砷', Se: '硒', Br: '溴', Kr: '氪', Rb: '铷', Sr: '锶', Y: '钇', Zr: '锆',
  Nb: '铌', Mo: '钼', Tc: '锝', Ru: '钌', Rh: '铑', Pd: '钯', Ag: '银', Cd: '镉', In: '铟', Sn: '锡',
  Sb: '锑', Te: '碲', I: '碘', Xe: '氙', Cs: '铯', Ba: '钡', La: '镧', Ce: '铈', Pr: '镨', Nd: '钕',
  Pm: '钷', Sm: '钐', Eu: '铕', Gd: '钆', Tb: '铽', Dy: '镝', Ho: '钬', Er: '铒', Tm: '铥', Yb: '镱',
  Lu: '镥', Hf: '铪', Ta: '钽', W: '钨', Re: '铼', Os: '锇', Ir: '铱', Pt: '铂', Au: '金', Hg: '汞',
  Tl: '铊', Pb: '铅', Bi: '铋', Po: '钋', At: '砹', Rn: '氡', Fr: '钫', Ra: '镭', Ac: '锕', Th: '钍',
  Pa: '镤', U: '铀', Np: '镎', Pu: '钚', Am: '镅', Cm: '锔', Bk: '锫', Cf: '锎', Es: '锿', Fm: '镄',
  Md: '钔', No: '锘', Lr: '铹', Rf: '𬬻', Db: '𬭊', Sg: '𬭳', Bh: '𬭛', Hs: '𬭶', Mt: '鿏', Ds: '𫟼',
  Rg: '𬬭', Cn: '鿔', Nh: '鿭', Fl: '𫓧', Mc: '镆', Lv: '𫟷', Ts: '鿬', Og: '鿫'
};

// 周期表位置映射（row, col）- 1-indexed
// 标准 18 列布局
export const elementPositions: Record<number, [number, number]> = {
  // Period 1
  1: [1, 1], 2: [1, 18],
  // Period 2
  3: [2, 1], 4: [2, 2], 5: [2, 13], 6: [2, 14], 7: [2, 15], 8: [2, 16], 9: [2, 17], 10: [2, 18],
  // Period 3
  11: [3, 1], 12: [3, 2], 13: [3, 13], 14: [3, 14], 15: [3, 15], 16: [3, 16], 17: [3, 17], 18: [3, 18],
  // Period 4
  19: [4, 1], 20: [4, 2], 21: [4, 3], 22: [4, 4], 23: [4, 5], 24: [4, 6], 25: [4, 7], 26: [4, 8],
  27: [4, 9], 28: [4, 10], 29: [4, 11], 30: [4, 12], 31: [4, 13], 32: [4, 14], 33: [4, 15], 34: [4, 16],
  35: [4, 17], 36: [4, 18],
  // Period 5
  37: [5, 1], 38: [5, 2], 39: [5, 3], 40: [5, 4], 41: [5, 5], 42: [5, 6], 43: [5, 7], 44: [5, 8],
  45: [5, 9], 46: [5, 10], 47: [5, 11], 48: [5, 12], 49: [5, 13], 50: [5, 14], 51: [5, 15], 52: [5, 16],
  53: [5, 17], 54: [5, 18],
  // Period 6
  55: [6, 1], 56: [6, 2],
  // Lanthanides (57-71) -> Row 9
  57: [9, 3], 58: [9, 4], 59: [9, 5], 60: [9, 6], 61: [9, 7], 62: [9, 8], 63: [9, 9], 64: [9, 10],
  65: [9, 11], 66: [9, 12], 67: [9, 13], 68: [9, 14], 69: [9, 15], 70: [9, 16], 71: [9, 17],
  // Period 6 continued
  72: [6, 4], 73: [6, 5], 74: [6, 6], 75: [6, 7], 76: [6, 8], 77: [6, 9], 78: [6, 10], 79: [6, 11],
  80: [6, 12], 81: [6, 13], 82: [6, 14], 83: [6, 15], 84: [6, 16], 85: [6, 17], 86: [6, 18],
  // Period 7
  87: [7, 1], 88: [7, 2],
  // Actinides (89-103) -> Row 10
  89: [10, 3], 90: [10, 4], 91: [10, 5], 92: [10, 6], 93: [10, 7], 94: [10, 8], 95: [10, 9], 96: [10, 10],
  97: [10, 11], 98: [10, 12], 99: [10, 13], 100: [10, 14], 101: [10, 15], 102: [10, 16], 103: [10, 17],
  // Period 7 continued
  104: [7, 4], 105: [7, 5], 106: [7, 6], 107: [7, 7], 108: [7, 8], 109: [7, 9], 110: [7, 10], 111: [7, 11],
  112: [7, 12], 113: [7, 13], 114: [7, 14], 115: [7, 15], 116: [7, 16], 117: [7, 17], 118: [7, 18],
};

// 将 series 字符串转换为类型
function parseSeries(series: string): ElementSeries {
  const validSeries: ElementSeries[] = [
    'Alkali', 'Alkaline', 'Transition', 'Lanthanoid', 'Actinoid', 
    'Poor', 'Metalloid', 'Nonmetal', 'Noble', 'Unknown'
  ];
  return validSeries.includes(series as ElementSeries) ? (series as ElementSeries) : 'Unknown';
}

// 从 JSON 数据解析元素列表
export function parseElements(jsonData: unknown[]): Element[] {
  // 第一个元素是空数组，跳过
  const rawElements = jsonData.slice(1) as Record<string, unknown>[];
  
  return rawElements.map((el) => {
    const atomic = parseInt(el.atomic as string);
    const [row, col] = elementPositions[atomic] || [0, 0];
    
    return {
      atomic,
      symbol: el.symbol as string,
      name: elementNames[el.symbol as string] || (el.symbol as string),
      weight: el.weight as string,
      series: parseSeries(el.series as string),
      electrons: el.electrons as number[],
      melt: el.melt as string | undefined,
      boil: el.boil as string | undefined,
      electroneg: el.electroneg as string | undefined,
      row,
      col,
    };
  });
}

// ========== 物态相关 ==========

// 物态类型
export type MatterState = 'solid' | 'liquid' | 'gas' | 'unknown';

// 根据温度判断元素的物态
export function getMatterState(element: Element, temperature: number): MatterState {
  const melt = element.melt ? parseFloat(element.melt) : null;
  const boil = element.boil ? parseFloat(element.boil) : null;
  
  // 无熔沸点数据
  if (melt === null && boil === null) return 'unknown';
  
  // 气态：温度 >= 沸点
  if (boil !== null && temperature >= boil) return 'gas';
  
  // 液态：熔点 <= 温度 < 沸点
  if (melt !== null && temperature >= melt) return 'liquid';
  
  // 固态：温度 < 熔点
  if (melt !== null && temperature < melt) return 'solid';
  
  // 特殊情况：只有沸点没有熔点（如氦）
  if (melt === null && boil !== null && temperature < boil) return 'liquid';
  
  return 'unknown';
}

// 物态颜色配置 - 使用高对比度颜色便于区分
export const stateColors: Record<MatterState, string> = {
  solid:   '#3B82F6', // 亮蓝色 - 冷色调，表示稳定固态
  liquid:  '#F59E0B', // 琥珀色 - 暖色调，表示流动液态
  gas:     '#EF4444', // 红色 - 高能色调，表示活跃气态
  unknown: '#6B7280', // 灰色 - 中性色，表示未知状态
};

// 物态视觉样式配置 - 温度越高辉光越活泼
export const stateStyles: Record<MatterState, {
  opacity: number;
  glowIntensity: number;
  borderStyle: string;
}> = {
  solid: {
    opacity: 1,
    glowIntensity: 0,      // 固态 - 完全不发光，冷静稳定
    borderStyle: 'solid',
  },
  liquid: {
    opacity: 0.95,
    glowIntensity: 1.0,    // 液态 - 有辉光，不闪烁
    borderStyle: 'solid',
  },
  gas: {
    opacity: 0.9,
    glowIntensity: 1.8,    // 气态 - 强辉光，会闪烁
    borderStyle: 'dashed',
  },
  unknown: {
    opacity: 0.5,
    glowIntensity: 0.3,
    borderStyle: 'dotted',
  },
};

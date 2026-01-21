import React from 'react';

interface Placeholder3DProps {
  label?: string;
  className?: string;
}

/**
 * 3D 可视化占位符组件
 * 用于页面布局时预留 3D 组件的位置
 * 
 * @example
 * <Placeholder3D label="用户数据可视化" className="h-[500px]" />
 */
export const Placeholder3D: React.FC<Placeholder3DProps> = ({ 
  label = "3D 可视化区域", 
  className = ""
}) => (
  <div className={`
    flex items-center justify-center 
    bg-slate-800/50 border-2 border-dashed border-slate-600 
    rounded-lg min-h-[400px]
    ${className}
  `}>
    <div className="text-center">
      <div className="text-slate-500 font-mono text-sm">{label}</div>
      <div className="text-slate-600 text-xs mt-1">等待 3D 组件接入</div>
    </div>
  </div>
);

export default Placeholder3D;

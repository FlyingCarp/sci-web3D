import React from 'react';
import { Layers } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  return (
    <header className={`border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Poros <span className="text-indigo-400">SciWebD</span>
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
          <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
          <span className="hover:text-white cursor-pointer transition-colors">Datasets</span>
          <div className="w-px h-4 bg-white/10"></div>
          <button className="flex items-center gap-2 hover:text-white transition-colors">
            <span>Login</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

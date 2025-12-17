import React from 'react';
import SceneManager from './3d/SceneManager';
import { useGraphStore } from './store/graphStore';

const App: React.FC = () => {
  // 取出 error 状态
  const { isLoading, selectedNode, error } = useGraphStore();

  // 如果有错误，直接显示红屏报错
  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-900 text-red-500 p-10">
        <h1 className="text-4xl font-bold mb-4">🚫 系统错误</h1>
        <div className="bg-black p-6 rounded-lg border border-red-500/50 font-mono text-lg max-w-2xl">
          {error}
        </div>
        <p className="mt-4 text-gray-400">请按 F12 打开开发者工具查看 Console 详情</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050510] overflow-hidden touch-none select-none">
      <div className="absolute inset-0 z-0">
        <SceneManager />
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-cyan-400 font-mono animate-pulse tracking-widest">
            正在加载数据 / LOADING DATA...
          </div>
        </div>
      )}

      {/* 顶部标题 */}
      <div className="absolute top-0 left-0 z-10 w-full p-4 pointer-events-none">
         <h1 className="text-2xl font-bold text-white">DEBUG MODE</h1>
      </div>
      
      {/* ... 省略详情卡片代码，保持不变 ... */}
    </div>
  );
};

export default App;
// src/pages/NetworkVisPage.tsx
import React, { useEffect } from 'react';
import SceneManager from '../3d/SceneManager'; // 你的 3D 核心
// 引入其他你需要的 UI 组件，如 InfoPanel 等
// 引入 useGraphStore

const NetworkVisPage: React.FC = () => {
  // 这里放你原本写在 App.tsx 里的加载数据逻辑
  // const setGraphData = useGraphStore(...)
  
  useEffect(() => {
     // 加载 materialsNetwork 数据的逻辑
  }, []);

  return (
    <div className="w-full h-screen relative bg-black">
      {/* 你的 3D 场景 */}
      <SceneManager />
      
      {/* 你的 UI 覆盖层 */}
      <div className="absolute top-0 left-0 z-10 p-4">
        <h1 className="text-white">Materials Network Visualization</h1>
      </div>
    </div>
  );
};

export default NetworkVisPage;
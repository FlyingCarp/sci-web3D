// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NetworkVisPage from './pages/NetworkVisPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 首页 */}
        <Route path="/" element={<LandingPage />} />
        
        {/* 你的 Materials Network 项目页面 */}
        <Route path="/viz/materials" element={<NetworkVisPage />} />
        
        {/* 未来如果有其他项目，加在这里 */}
        {/* <Route path="/viz/stats" element={<StatsPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Network, 
  ArrowRight, 
  Activity, 
  Search,
  Database
} from 'lucide-react';
import { Header } from '../layouts';

// --- 1. 数据层定义 ---
interface ProjectData {
  id: string;
  // 恢复 explicit path，这样你可以精确控制跳转目标，不依赖命名规则
  path: string;       
  title: string;
  category: string;
  type: '3D' | 'Stream' | 'Analysis';
  description: string;
  status: 'Live' | 'Beta' | 'Dev';
  lastUpdate: string;
}

// 模拟数据
const MOCK_API_DATA: ProjectData[] = [
  {
    id: '101',
    // 关键修复：这里填回你原来的路由地址
    // 如果你的3D图页面在根路径，就填 '/'；如果在 '/viz/materials' 就填这个
    path: '/viz/materials', 
    title: 'Materials Network',
    category: 'Material Science',
    type: '3D',
    description: '一种展示元素间相似度的材料网络可视化展示',
    status: 'Live',
    lastUpdate: '2025-12-25'
  }
];

// --- 2. 表现层映射 ---
const getProjectStyle = (category: string) => {
  switch (category) {
    case 'Material Science':
      return {
        gradient: 'from-blue-600 to-indigo-900',
        icon: <Network className="w-8 h-8 text-white" />
      };
    default:
      return {
        gradient: 'from-slate-600 to-slate-900',
        icon: <Database className="w-8 h-8 text-white" />
      };
  }
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const projects = useMemo(() => MOCK_API_DATA, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* 背景装饰 */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      {/* 顶部导航 - 使用 layouts/Header 组件 */}
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
        
        {/* Hero Section */}
        <div className="text-center mb-24 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
            <Activity className="w-3 h-3" />
            <span>Node Status: Online</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="text-slate-100">Scientific Data</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              Visualization Portal
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            High-performance rendering for complex scientific datasets.
            <br className="hidden md:block"/>
            From atomic structures to automated laboratory twins.
          </p>

          <div className="flex justify-center mt-8">
            <div className="relative group w-full max-w-md">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-50 group-hover:opacity-100 blur transition duration-300"></div>
              <div className="relative flex items-center bg-slate-900 rounded-full leading-none border border-slate-700">
                <Search className="ml-4 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search project ID, chemical formula..." 
                  className="bg-transparent text-white px-4 py-4 outline-none w-full placeholder:text-slate-500 text-sm font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const style = getProjectStyle(project.category);
            const isClickable = project.status !== 'Dev';

            return (
              <div 
                key={project.id}
                // 关键修复：直接使用 data 里的 path，不再动态拼接
                onClick={() => isClickable && navigate(project.path)}
                className={`
                  group relative flex flex-col rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-hidden
                  hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-900/20 transition-all duration-300
                  ${!isClickable ? 'opacity-60 grayscale-[0.3] cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {/* Card Header */}
                <div className={`h-36 bg-gradient-to-br ${style.gradient} p-6 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 origin-bottom`}>
                  <div className="absolute right-[-20px] top-[-30px] w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 shadow-lg">
                      {style.icon}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`
                        text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border backdrop-blur-md
                        ${project.status === 'Live' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : ''}
                      `}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col border-t border-white/5 bg-slate-900/80">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest border border-indigo-500/20 px-1.5 py-0.5 rounded">
                      {project.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-indigo-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>UPDATED: {project.lastUpdate}</span>
                    {isClickable && (
                      <span className="flex items-center gap-1 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all">
                        Launch <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 mt-12 text-center text-slate-600 text-xs font-mono">
        <p>&copy; 2025 Poros SciWebD Group. Powered by React & Three.js.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
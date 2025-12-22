import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Network, 
  BarChart3, 
  Cpu, 
  ArrowRight, 
  Activity, 
  Layers, 
  Search 
} from 'lucide-react';

// 定义项目接口
interface Project {
  id: string;
  title: string;
  category: string; // 例如: Material Science, Neuroscience
  type: '3D' | '2D' | 'Report';
  description: string;
  path: string;
  status: 'Live' | 'Beta' | 'Coming Soon';
  gradient: string; // 每个项目卡片不同的背景渐变
  icon: React.ReactNode;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // 模拟项目数据
  const projects: Project[] = [
    {
      id: 'materials-01',
      title: 'Materials Genome Network',
      category: 'Material Science',
      type: '3D',
      description: '基于高通量计算与实验数据构建的材料成分-结构-性能关联网络可视化。探索新型合金的潜在拓扑结构。',
      path: '/viz/materials',
      status: 'Live',
      gradient: 'from-blue-600 to-indigo-900',
      icon: <Network className="w-8 h-8 text-white" />,
    },
    {
      id: 'brain-viz-02',
      title: 'Cortical Synapse Map',
      category: 'Neuroscience',
      type: '3D',
      description: '大鼠躯体感觉皮层神经元突触连接的三维重建与图论分析展示。',
      path: '/viz/brain', // 示例路径
      status: 'Coming Soon',
      gradient: 'from-purple-600 to-fuchsia-900',
      icon: <Cpu className="w-8 h-8 text-white" />,
    },
    {
      id: 'climate-stats-03',
      title: 'Global Climate Trends',
      category: 'Environmental Sci',
      type: '2D',
      description: '过去50年全球气温异常与碳排放相关性的交互式图表分析。',
      path: '/viz/stats', // 示例路径
      status: 'Beta',
      gradient: 'from-teal-600 to-emerald-900',
      icon: <BarChart3 className="w-8 h-8 text-white" />,
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* --- 背景装饰 (Background Accents) --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      {/* --- 顶部导航 (Header) --- */}
      <header className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              SciWeb<span className="text-indigo-400">3D</span> Portal
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
            <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-white cursor-pointer transition-colors">About</span>
            <button className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all text-xs border border-white/10">
              Sign In
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
        
        {/* --- Hero Section --- */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-4">
            <Activity className="w-3 h-3" />
            <span>System Status: Operational</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">
              Scientific Data
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Visualization Hub
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            探索复杂网络、高维数据与实验结果的交互式可视化平台。
            <br className="hidden md:block"/>
            为科研人员提供直观的数据洞察工具。
          </p>

          <div className="flex justify-center mt-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
              <div className="relative flex items-center bg-slate-900 rounded-full leading-none">
                <Search className="ml-4 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="搜索项目或数据集..." 
                  className="bg-transparent text-white px-4 py-3 outline-none w-64 md:w-80 placeholder:text-slate-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Projects Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id}
              onClick={() => {
                if (project.status !== 'Coming Soon') {
                  navigate(project.path);
                }
              }}
              className={`
                group relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden
                hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300
                ${project.status === 'Coming Soon' ? 'opacity-70 cursor-not-allowed grayscale-[0.5]' : 'cursor-pointer'}
              `}
            >
              {/* Card Header / Image Placeholder */}
              <div className={`h-40 bg-gradient-to-br ${project.gradient} p-6 relative overflow-hidden`}>
                <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10 flex justify-between items-start">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
                    {project.icon}
                  </div>
                  <span className={`
                    text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded border backdrop-blur-md
                    ${project.status === 'Live' ? 'bg-green-500/20 border-green-500/30 text-green-300' : ''}
                    ${project.status === 'Beta' ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : ''}
                    ${project.status === 'Coming Soon' ? 'bg-slate-500/20 border-slate-500/30 text-slate-300' : ''}
                  `}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    {project.category}
                  </span>
                  <span className="text-xs font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                    {project.type}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-indigo-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                  {project.description}
                </p>

                {/* Card Footer */}
                <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between text-sm">
                  <span className="text-slate-500 text-xs font-mono">ID: {project.id.split('-')[0]}</span>
                  
                  {project.status !== 'Coming Soon' && (
                    <span className="flex items-center gap-1 text-indigo-400 font-medium group-hover:translate-x-1 transition-transform">
                      Enter Viz <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* New Project Placeholder */}
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 flex flex-col items-center justify-center p-8 min-h-[300px] text-slate-600 hover:border-slate-700 hover:bg-slate-900/50 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-slate-700 transition-colors">
              <span className="text-2xl font-light text-slate-500 group-hover:text-slate-300">+</span>
            </div>
            <span className="text-sm font-medium">Add New Project</span>
          </div>
        </div>

      </main>

      {/* --- Simple Footer --- */}
      <footer className="border-t border-white/5 py-8 text-center text-slate-600 text-sm">
        <p>&copy; 2025 SciWeb3D Research Group. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
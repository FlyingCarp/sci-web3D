// 门户层只需要知道这些通用信息
export interface ProjectMetadata {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  // 新增：项目类型。决定了点进去后跳转到哪个渲染器
  type: '3d-network' | '2d-chart' | 'volume-render'; 
  dataUrl: string; // 数据源地址，具体格式由具体页面自己去解析
}

const MOCK_PROJECTS: ProjectMetadata[] = [
  {
    id: 'materials-net-01',
    title: 'Materials Genome Network',
    description: '材料成分-结构-性能关联网络。',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
    type: '3d-network', // <--- 标记这是个 3D 网络项目
    dataUrl: '/data/graph.json',
  },
  {
    id: 'future-project-02',
    title: 'Experimental Data Charts',
    description: '未来可能添加的普通图表项目。',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    type: '2d-chart', // <--- 标记这是个 2D 图表项目
    dataUrl: '/data/stats.json',
  }
];

export const apiService = {
  fetchProjectsList: async (): Promise<ProjectMetadata[]> => {
    return new Promise((resolve) => resolve(MOCK_PROJECTS));
  },
  
  // 删除 fetchGraphData 的具体实现，或者保留它仅供 3D 网络页面使用
  // 数据的具体获取逻辑应该下放给具体的 Page 组件
};
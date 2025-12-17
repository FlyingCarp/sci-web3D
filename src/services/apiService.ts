import { GraphData } from '../types/graph';
// 假设你把 Python 生成的 json 放到了 public/data/graph.json
// 或者在开发阶段直接 import 一个本地的 mock json 文件
// import localData from '../../public/data/graph.json'; 

export const apiService = {
  /**
   * 获取图谱数据
   * Phase 1: 读取本地静态文件
   * Future: 替换为真实的 API fetch
   */
  fetchGraphData: async (): Promise<GraphData> => {
    // 模拟网络延迟，让加载状态可见
    await new Promise(resolve => setTimeout(resolve, 800));

    // 真实场景下使用 fetch 读取 public 文件夹下的资源
    const response = await fetch('/data/graph.json');
    if (!response.ok) {
      throw new Error('Failed to load graph data');
    }
    return response.json();
  }
};
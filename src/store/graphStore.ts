import { create } from 'zustand';

// 定义接口 (保持不变)
interface GraphNode { id: string; group: string; val: number; x: number; y: number; z: number; color: string; }
interface GraphLink { source: string; target: string; similarity: number; }
interface GraphData { nodes: GraphNode[]; links: GraphLink[]; }

interface GraphState {
  data: GraphData | null;
  isLoading: boolean;
  error: string | null; // 新增：错误信息状态
  selectedNode: any | null;
  
  fetchData: () => Promise<void>;
  setSelectedNode: (node: any | null) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  selectedNode: null,

  fetchData: async () => {
    console.log("🚀 [System] 开始请求数据..."); // log 1
    set({ isLoading: true, error: null });

    try {
      // 1. 尝试请求文件
      const response = await fetch('/data/graph.json');
      console.log(`📡 [System] HTTP 状态码: ${response.status}`); // log 2

      if (!response.ok) {
        throw new Error(`无法读取文件 (HTTP ${response.status})。请检查 public/data/graph.json 是否存在`);
      }

      // 2. 尝试解析 JSON
      const jsonData = await response.json();
      console.log("📦 [System] 数据解析成功，节点数量:", jsonData.nodes?.length); // log 3

      // 3. 简单的完整性检查
      if (!jsonData.nodes || jsonData.nodes.length === 0) {
        throw new Error("JSON 文件是空的，或者结构不对（找不到 nodes 字段）");
      }

      set({ data: jsonData, isLoading: false });
      console.log("✅ [System] 数据已存入 Store"); // log 4

    } catch (err: any) {
      console.error("❌ [System] 发生严重错误:", err);
      // 将错误信息存入状态，以便显示在屏幕上
      set({ error: err.message, isLoading: false });
    }
  },

  setSelectedNode: (node) => set({ selectedNode: node }),
}));
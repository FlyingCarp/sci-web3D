import { create } from 'zustand';
import type { GraphNode, GraphLink, GraphState } from '../types/graph';

// --- 常量定义 ---
const NODE_COUNT = 118;      
const NODE_STRIDE = 16;      
const MATRIX_VAL_SIZE = 4;   // Float32 = 4 Bytes

// 🛠️ 核心修正：对应 Python 脚本的缩放因子
const COORD_SCALE = 30000;   // 坐标缩放因子
const RADIUS_SCALE = 50000;  // 半径缩放因子

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const useGraphStore = create<GraphState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  selectedNode: null,

  fetchData: async () => {
    console.log("🚀 [System] 开始请求 Float32 Bin 数据...");
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/data/out.bin'); //读取bin文件的节点信息及邻接矩阵
      console.log(`📡 [System] HTTP 状态码: ${response.status}`);

      if (!response.ok) throw new Error(`无法读取文件 (HTTP ${response.status})`);

      const buffer = await response.arrayBuffer();
      const view = new DataView(buffer);
      
      const nodes: GraphNode[] = [];
      const links: GraphLink[] = [];
      let offset = 0;

      // ---------------------------------------------------------
      // 3. 解析 NODES
      // ---------------------------------------------------------
      const decoder = new TextDecoder('ascii'); 

      for (let i = 0; i < NODE_COUNT; i++) {
        // ID
        const idBytes = new Uint8Array(buffer, offset, 2); 
        const rawId = decoder.decode(idBytes).replace(/\0/g, '').trim(); 

        // 🛠️ 修正 1：坐标还原 (Int16 -> Float)
        // Python: int16 = float * 30000
        // TS: float = int16 / 30000
        const rawX = view.getInt16(offset + 2, true); 
        const rawY = view.getInt16(offset + 4, true);
        const rawZ = view.getInt16(offset + 6, true);
        
        const x = rawX / COORD_SCALE;
        const y = rawY / COORD_SCALE;
        const z = rawZ / COORD_SCALE;

        // 🛠️ 修正 2：半径还原 (Uint16 -> Float)
        // Python: uint16 = radius * 50000 + 1000
        // 这里简单除以 50000 即可恢复相对大小
        const rawRadius = view.getUint16(offset + 8, true);
        const radius = rawRadius / RADIUS_SCALE;

        // Color
        const r = view.getUint8(offset + 10);
        const g = view.getUint8(offset + 11);
        const b = view.getUint8(offset + 12);
        const color = rgbToHex(r, g, b);

        const group = view.getUint8(offset + 13).toString();

        nodes.push({
          id: rawId,
          group: group,
          val: radius, // 这里现在是 0.0 ~ 1.2 左右的小数，适合 SceneManager 使用
          x: x,
          y: y,
          z: z,
          color: color
        });

        offset += NODE_STRIDE;
      }

      // ---------------------------------------------------------
      // 4. 解析 邻接矩阵
      // ---------------------------------------------------------
      const SIMILARITY_THRESHOLD = 0.0; // 🛠️ 修正 3：加载所有边

      // 循环逻辑必须匹配 Python 的下三角写入顺序
      // Python: for i in range(1, N): for j in range(i):
      for (let i = 1; i < NODE_COUNT; i++) {
        for (let j = 0; j < i; j++) {
            
          if (offset + MATRIX_VAL_SIZE > buffer.byteLength) break; 

          const similarity = view.getFloat32(offset, true); 
          offset += MATRIX_VAL_SIZE;

          if (similarity > SIMILARITY_THRESHOLD) {
            links.push({
              source: nodes[i].id, 
              target: nodes[j].id,
              similarity: similarity
            });
          }
        }
      }

      console.log(`📦 [System] 解析完成: ${nodes.length} 节点, ${links.length} 连线`);
      set({ data: { nodes, links }, isLoading: false });

    } catch (err: any) {
      console.error("❌ [System] 解析错误:", err);
      set({ error: err.message, isLoading: false });
    }
  },

  setSelectedNode: (node) => set({ selectedNode: node }),
}));
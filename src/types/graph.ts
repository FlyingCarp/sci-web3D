// 严格对应 Python 脚本生成的逻辑
export interface GraphNode {
  id: string;      // 对应 label_column
  group: string;   // 对应 Group
  val: number;     // 对应 radius/ratio，控制节点大小
  
  // Python 预计算好的椭球坐标 (x, y, z)
  x?: number;      
  y?: number;
  z?: number;
  
  // Python 预计算好的 Hex 颜色
  color: string;   
}

export interface GraphLink {
  source: string;
  target: string;
  similarity: number; // 0.0 - 1.0, 用于控制透明度
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
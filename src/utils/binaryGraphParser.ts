// src/utils/binaryGraphParser.ts

// 必须严格对应 Python 脚本中的顺序，不可更改
const NODES_LIST = [
  'Ne', 'Ar', 'Kr', 'Rn', 'Xe', 'C', 'He', 'H', 'N', 'O', 'F', 'Cl', 'Br', 'I', 
  'Se', 'Te', 'P', 'S', 'At', 'Po', 'As', 'Sb', 'Bi', 'Mo', 'W', 'Re', 'Tc', 'Nb', 
  'Ta', 'Ti', 'Hf', 'Zr', 'Pd', 'Rh', 'Ru', 'Pt', 'Ir', 'Os', 'K', 'Li', 'Na', 'Sr', 
  'Ba', 'Ra', 'Fr', 'Cs', 'Rb', 'Co', 'Cr', 'V', 'Mn', 'Fe', 'Ni', 'In', 'Ca', 'Cd', 
  'Mg', 'Zn', 'Sc', 'Al', 'Ga', 'Be', 'B', 'Ge', 'Si', 'Ag', 'Cu', 'Au', 'Pb', 'Sn', 
  'Hg', 'Tl', 'Mc', 'Nh', 'Ts', 'Lv', 'Og', 'Cn', 'Fl', 'Hs', 'Mt', 'Ds', 'Rg', 'Sg', 
  'Db', 'Bh', 'Rf', 'Yb', 'Y', 'Tb', 'Tm', 'Dy', 'Er', 'Ho', 'Nd', 'Pr', 'Pm', 'Ce', 
  'La', 'Gd', 'Eu', 'Sm', 'Lr', 'Lu', 'No', 'Fm', 'Md', 'Es', 'Am', 'Cm', 'Bk', 'Cf', 
  'Ac', 'Pa', 'Th', 'U', 'Np', 'Pu'
];

export interface GraphNode {
  id: string;
  val: number; 
  color?: string;
  // 兼容可能存在的预设坐标
  x?: number;
  y?: number;
  z?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  similarity: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export const fetchAndParseBinaryMatrix = async (url: string, threshold: number = 0.82): Promise<GraphData> => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const dataView = new Uint8Array(buffer);
  console.log(buffer);
  // 1. 初始化节点
  const nodes: GraphNode[] = NODES_LIST.map(id => ({
    id,
    val: 1, // 初始大小，稍后根据 degree 调整
    color: '#4facfe' // 默认颜色，你可以改为根据元素周期表分类配色
  }));

  const links: GraphLink[] = [];
  const n = NODES_LIST.length;
  let idx = 0;

  // 2. 解析下三角矩阵 (Lower Triangular)
  // 逻辑必须与 Python 生成脚本完全一致: for i in range(1, N): for j in range(i):
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (idx >= dataView.length) break;

      const uint8Val = dataView[idx];
      const similarity = uint8Val / 255.0; // 归一化还原 [0, 1]
      idx++;

      if (similarity >= threshold) {
        // 注意：source 和 target 的顺序在这里不影响无向图的显示
        links.push({
          source: NODES_LIST[i],
          target: NODES_LIST[j],
          similarity: similarity
        });
      }
    }
  }

  // 3. 计算节点度数 (Degree) 并调整大小
  const degreeMap: Record<string, number> = {};
  links.forEach(l => {
    degreeMap[l.source] = (degreeMap[l.source] || 0) + 1;
    degreeMap[l.target] = (degreeMap[l.target] || 0) + 1;
  });
  
  nodes.forEach(node => {
    const degree = degreeMap[node.id] || 0;
    // 基础大小 1，每多一个连接增加 0.5
    node.val = 1 + degree * 0.5;
    
    // (可选) 如果是孤立点，可以把它变暗或者变小
    if (degree === 0) {
        node.val = 0.5; 
        node.color = '#555'; // 灰色
    }
  });

  console.log(`[BinaryParser] Parsed ${links.length} links (Threshold: ${threshold})`);
  return { nodes, links };
};
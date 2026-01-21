# Poros SciWebD - AI 上下文文档

> 本文件用于在新的 AI 对话窗口中快速对齐项目信息。

## 项目概述

**Poros SciWebD** 是一个科研数据可视化平台，基于 React + TypeScript + Three.js 构建。主要功能是展示 3D 材料网络可视化。

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **3D 渲染**: Three.js + react-force-graph-3d
- **状态管理**: Zustand
- **样式**: Tailwind CSS（已配置 brand 设计 Token）
- **路由**: React Router DOM 7

## 目录结构

```
src/
├── 3d/                        # 3D 核心代码（不要随意修改）
│   └── SceneManager.tsx       # 3D 场景管理器，包含控制面板
│
├── components/
│   └── ui/                    # 通用 UI 组件（前端工程师领地）
│       ├── Placeholder3D/     # 3D 占位符组件
│       └── index.ts           # 桶文件
│
├── layouts/                   # 布局组件（前端工程师领地）
│   ├── Header.tsx             # 顶部导航
│   ├── MainLayout.tsx         # 通用页面布局
│   └── index.ts               # 桶文件
│
├── pages/                     # 页面（共享区域）
│   ├── LandingPage.tsx        # 首页
│   └── NetworkVisPage.tsx     # 3D 可视化页面
│
├── store/                     # Zustand 状态管理
│   └── graphStore.ts          # 图数据 store
│
├── services/                  # API 服务层
│   └── apiService.ts
│
├── types/                     # TypeScript 类型定义
│   └── graph.ts               # GraphNode, GraphLink, GraphData, GraphState
│
├── utils/                     # 工具函数
│   └── binaryGraphParser.ts
│
├── App.tsx                    # 路由配置
├── main.jsx                   # 入口文件
└── index.css                  # 全局样式（Tailwind）
```

## 协作模式

项目采用**两人协作**模式：

| 角色 | 负责内容 | 工作目录 |
|------|---------|---------|
| 架构/3D开发 | 3D 可视化、数据流、后端、路由 | `3d/`, `store/`, `services/`, `types/` |
| 前端工程师 | 页面布局、样式、响应式、交互动画 | `layouts/`, `components/ui/`, `pages/` |

详细协作规范见 `协作规范.md`。

## 关键文件说明

### SceneManager.tsx (390行)
- 3D 场景的核心组件
- 包含：ForceGraph3D、控制面板（相似度滑块）、返回按钮
- 使用 `useGraphStore` 获取数据
- **不拆分**，由架构开发者维护

### graphStore.ts
- Zustand store，负责从 `/data/out.bin` 加载二进制数据
- 解析节点（118个元素）和邻接矩阵
- 类型定义已移至 `types/graph.ts`

### LandingPage.tsx
- 项目首页，展示项目卡片列表
- 已使用 `<Header />` 布局组件

## Tailwind 设计 Token

```javascript
// tailwind.config.js 中已配置
colors: {
  brand: {
    primary: '#6366f1',      // 主色
    secondary: '#64c8ff',    // 科技蓝
    surface: 'rgba(10, 20, 30, 0.85)',  // 面板背景
    border: 'rgba(100, 200, 255, 0.3)', // 边框
  }
}
```

## 路由配置

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | LandingPage | 首页 |
| `/viz/materials` | NetworkVisPage | 材料网络 3D 可视化 |

## 当前状态

### 已完成
- [x] 创建 `layouts/` 目录（Header, MainLayout）
- [x] 创建 `components/ui/` 目录（Placeholder3D）
- [x] 扩展 Tailwind 设计 Token
- [x] 从 LandingPage 提取 Header 组件
- [x] 整理类型定义（消除 graphStore 和 types/graph.ts 重复）
- [x] 编写协作规范文档

### 待办
- [ ] 前端工程师：美化 Header/Sidebar
- [ ] 前端工程师：响应式适配
- [ ] 架构开发：后端 API 对接
- [ ] 架构开发：用户认证系统

## 注意事项

1. **SceneManager.tsx 不要拆分** - 3D 场景及其控制面板作为整体维护
2. **类型定义在 types/graph.ts** - graphStore 通过 import 引用
3. **使用桶文件导入** - `import { Header } from '../layouts'` 而非完整路径
4. **品牌色使用 Tailwind Token** - `bg-brand-primary` 等

## 常用命令

```bash
npm run dev      # 启动开发服务器 (http://localhost:5173)
npm run build    # 构建生产版本
npm run lint     # 运行 ESLint
```

## 数据文件

- `/public/data/out.bin` - 二进制图数据（节点+邻接矩阵）
- `/public/data/graph.json` - JSON 格式图数据（备用）

---

*最后更新: 2025-01-19*

# Sci-Web3D

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  [![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)  [![Three.js](https://img.shields.io/badge/Three.js-r150+-black)](https://threejs.org/)  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

**Sci-Web3D** 是一个高性能的交互式 3D 力导向图（Force-Directed Graph）可视化平台。

本项目旨在构建一个能够流畅渲染大规模网络数据的 Web 应用，支持 PC 和移动端。项目采用渐进式架构设计，从纯前端 MVP 平滑过渡到前后端分离的完整应用，重点关注渲染性能、架构的可扩展性以及优秀的用户体验。

---

## ✨ 核心特性

* **高性能 3D 渲染**: 基于 `Three.js` 和 `three-forcegraph`，支持大规模节点/边的流畅渲染。
* **响应式设计**: 集成 `Tailwind CSS`，完美适配 PC 与移动端操作。
* **解耦架构**: 独特的数据抽象层设计，实现从“本地静态数据”到“远程 API 数据”的零成本切换。
* **状态管理**: 使用 `Zustand` 管理全局图数据、交互状态与 UI 逻辑。

---

## 🛠️ 技术栈

* **核心框架**: React, TypeScript, Vite
* **3D 图形库**: Three.js, three-forcegraph
* **状态管理**: Zustand
* **样式与布局**: Tailwind CSS
* **后端 (Phase 2)**: Node.js, Express.js

---

## 📅 项目路线图 (Roadmap)

本项目开发分为三个阶段，目前处于 **Phase 1**。

### Phase 1: 核心功能与纯前端 MVP (Core Functionality)
目标：构建可在 PC/移动端运行的纯前端 MVP，验证核心可视化功能。

- [x] **环境搭建**: Vite + React + TS + Tailwind 初始化。
- [x] **数据抽象层**: 实现 `src/services/apiService.ts`，支持动态 Import 本地 JSON 数据。
- [x] **状态管理**: 基于 Zustand 构建 `graphStore` (Data, Loading, SelectedNode)。
- [x] **3D 渲染层**: 封装 `src/3d/SceneManager.tsx`，实现力导向图渲染与点击交互。
- [x] **基础 UI**: 开发 InfoPanel 和 Controls 组件，实现响应式布局。

### Phase 2: 后端集成与架构分离 (Backend Integration)
目标：从纯前端转变为前后端分离架构，实现动态数据获取。

- [ ] **后端 API**: 搭建 Node.js + Express 服务，提供 `/api/graph-data` 接口。
- [ ] **CORS 配置**: 允许前端跨域访问数据资源。
- [ ] **服务层改造**: 修改 `fetchGraphData()` 实现，从 `import()` 切换为 `fetch API` (无需修改 UI/State 层)。
- [ ] **部署联调**: 前端部署至 Vercel/Netlify，后端部署至云服务器。

### Phase 3: UI/UX 优化与功能扩展 (Optimization & Features)
目标：打磨体验，处理超大规模数据，增加高级功能。

- [ ] **视觉升级**: 优化 UI 组件动效，设计优雅的 Loading 界面。
- [ ] **渲染优化**: 探索 GPU Instancing 等技术以提升大规模数据集性能。
- [ ] **高级功能**:
    - [ ] 节点搜索与属性筛选。
    - [ ] 复杂交互（节点折叠/展开、最短路径）。
    - [ ] 视图导出（PNG/CSV）。

---

## 📂 目录结构核心说明

良好的架构设计使得各个模块职责分明：

```text
src/
├── 3d/
│   └── SceneManager.tsx    # 3D场景核心，订阅 Store 并通过 three-forcegraph 渲染
├── components/             # UI 组件 (InfoPanel, Controls 等)
├── services/
│   └── apiService.ts       # 数据获取层 (关键解耦点，隔离本地/远程数据差异)
├── store/
│   └── graphStore.ts       # Zustand 全局状态 (GraphData, SelectedNode, Loading)
└── App.tsx
public/
└── data/
    └── graph.json          # 本地测试数据
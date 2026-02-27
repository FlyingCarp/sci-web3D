#3 Pull Request: sci-web3D – Collaboration Architecture Refactor

## Overview

This PR refactors the project structure to support **two-person collaboration** (Architecture/3D Developer + Frontend Engineer). It introduces a clear directory separation, design system tokens, and documentation for seamless teamwork.

---

## Description of Changes

### 📁 Directory Structure Refactor #IDKVEQ 

**New directories created for frontend collaboration:**

```
src/
├── components/
│   └── ui/                        # [NEW] Frontend engineer's domain
│       ├── Placeholder3D/
│       │   └── index.tsx          # 3D placeholder component
│       └── index.ts               # Barrel file
│
├── layouts/                       # [NEW] Layout components
│   ├── Header.tsx                 # Extracted from LandingPage
│   ├── MainLayout.tsx             # Generic page layout wrapper
│   └── index.ts                   # Barrel file
```

### 🎨 Design System (Tailwind Token) #IDKVF0

**Extended `tailwind.config.js` with brand colors:**

```javascript
colors: {
  brand: {
    primary: '#6366f1',      // indigo - main color
    secondary: '#64c8ff',    // tech blue - accent
    surface: 'rgba(10, 20, 30, 0.85)',  // panel background
    border: 'rgba(100, 200, 255, 0.3)', // border color
  }
}
borderRadius: { panel: '24px' }
boxShadow: { glow: '0 0 20px rgba(99, 102, 241, 0.3)' }
```

### 🔧 Code Refactoring #IDKVFS #IDKVFX

| File | Change |
|------|--------|
| `LandingPage.tsx` | Extracted inline header → imports `<Header />` from layouts |
| `types/graph.ts` | Added `GraphState` interface (moved from graphStore) |
| `graphStore.ts` | Now imports types from `types/graph.ts` instead of inline definition |

### 📄 Documentation #IDKVG2

| Document | Purpose |
|----------|---------|
| `协作规范.md` | Frontend collaboration guide (directory ownership, workflow, examples) |
| `ai_codebase.md` | AI context document for quick onboarding in new sessions |

---

## Files Changed

### New Files (6)
- `src/layouts/Header.tsx`
- `src/layouts/MainLayout.tsx`
- `src/layouts/index.ts`
- `src/components/ui/Placeholder3D/index.tsx`
- `src/components/ui/index.ts`
- `ai_codebase.md`

### Modified Files (4)
- `tailwind.config.js` - Added brand design tokens
- `src/pages/LandingPage.tsx` - Uses `<Header />` component
- `src/types/graph.ts` - Added `GraphState` interface
- `src/store/graphStore.ts` - Imports types from `types/graph.ts`

### Documentation Files (1 modified)
- `协作规范.md` - Updated collaboration workflow

---

## Test Results

| Module | Goal | Expected | Actual | Status |
|--------|------|----------|--------|--------|
| Landing page load | Page renders correctly | Header visible, no errors | Header component renders, layout intact | ✅ Pass |
| Header extraction | Reusable header component | Same visual appearance | Identical to original inline header | ✅ Pass |
| 3D visualization | Scene loads normally | Graph renders, interactions work | SceneManager unchanged, all features work | ✅ Pass |
| Node click-to-focus | Click to center node | Camera animates to target | Animation works as before | ✅ Pass |
| Similarity slider | Filter links by threshold | Slider controls link visibility | Slider functions correctly | ✅ Pass |
| Tailwind tokens | Brand colors available | `bg-brand-primary` works | Colors compile and apply | ✅ Pass |
| Type imports | No TypeScript errors | Clean compilation | `npm run dev` succeeds | ✅ Pass |
| Barrel imports | Simplified import paths | `import { Header } from '../layouts'` | Imports resolve correctly | ✅ Pass |

---

## Collaboration Impact

### Before
- Single-developer codebase, no clear boundaries
- LandingPage contained inline header (200+ lines)
- Type definitions duplicated in graphStore and types/
- No design tokens, styles hardcoded

### After
- Clear directory ownership for collaboration
- Reusable `<Header />` and `<MainLayout />` components
- Unified type definitions in `types/graph.ts`
- Brand design system via Tailwind tokens
- `<Placeholder3D />` component for layout-first development

---

## Directory Ownership Summary

| Directory | Owner | Notes |
|-----------|-------|-------|
| `src/3d/` | Architecture/3D Dev | 3D core, do not modify |
| `src/layouts/` | Frontend Engineer | Header, Sidebar, MainLayout |
| `src/components/ui/` | Frontend Engineer | Reusable UI components |
| `src/pages/` | Shared | Both can edit with coordination |
| `src/store/`, `src/types/`, `src/services/` | Architecture/3D Dev | State management, types, API |

---

## How to Test

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Verify:
# 1. http://localhost:5173/ - Landing page with Header component
# 2. http://localhost:5173/viz/materials - 3D visualization (unchanged)
# 3. Click nodes to verify focus animation still works
# 4. Adjust similarity slider to verify filtering works
```

---
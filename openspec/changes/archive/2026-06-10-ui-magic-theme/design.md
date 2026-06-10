## Context

現有前端以純 Tailwind utility class 組成，缺乏視覺層次、互動動效與色彩系統。頁面佈局平鋪直述，KPI 卡片無動效，車輛狀態無語意色，登入頁無視覺引導。Magic UI 提供以 `framer-motion` 為基礎的動效元件與設計模式，可在不引入 UI 框架的前提下大幅提升視覺質感。

## Goals / Non-Goals

**Goals:**
- 建立跨頁面的色彩 token 系統（primary、surface、muted、border）
- 儀表板改以 Bento Grid 排版，KPI 卡片加入數字動畫
- 側邊欄加入品牌識別與選取動效
- 車輛狀態 badge 語意化配色
- 登入頁加入視覺層次（漸層背景 + 卡片陰影）

**Non-Goals:**
- 暗色模式（Dark Mode）— 本期不含
- 響應式行動版排版 — 本期不含
- 完整設計 system（Storybook、token 文件）— 本期不含
- 更換 UI 框架 — 保留 Tailwind，僅擴充設計 token

## Decisions

### 1. 動效庫：`framer-motion`（而非純 CSS animation）

**選擇**：安裝 `framer-motion` 作為動效引擎。  
**理由**：Magic UI 的 NumberTicker、Shimmer 等元件均以 framer-motion 為基礎；spring physics 讓數字滾動自然流暢，純 CSS 的 `@keyframes` 難以模擬。  
**備選**：CSS animation — 零依賴，但無法實作數字 counter；`react-spring` — 功能相近但 Magic UI 生態圈不使用。

### 2. Magic UI 元件引入方式：copy 原始碼（而非 npm package）

**選擇**：直接將 Magic UI 元件原始碼複製至 `src/components/magic/`。  
**理由**：Magic UI 設計為 copy-paste 使用模式（非 npm 安裝），便於自定義樣式；避免引入額外 registry 或外部套件管理。  
**備選**：`npx magicui-cli add` — 需要設定 CLI，本專案規模不值得。

### 3. 色彩 token：擴充 `tailwind.config.js`（而非 CSS 變數）

**選擇**：在 `tailwind.config.js` 的 `extend.colors` 新增語意化 token（`brand-primary`、`surface`、`muted`、`status-*`）。  
**理由**：與現有 Tailwind utility class 一致，JIT 引擎自動 tree-shake 未用到的 token；不需要引入 CSS-in-JS。  
**備選**：CSS custom properties（`--color-primary`）— 可搭配 Dark Mode，但目前 Non-Goal；不引入額外概念。

### 4. 儀表板佈局：CSS Grid Bento（而非 flex 堆疊）

**選擇**：以 CSS Grid `grid-template-areas` 實作 Bento Grid，卡片佔用不同格數呈現視覺重量差異。  
**理由**：Bento Grid 是 Magic UI 的核心版面模式；CSS Grid 原生支援，無需額外 library。  
**備選**：維持 flex 排列 — 簡單但無法呈現不同尺寸卡片的設計語言。

### 5. 車輛狀態 badge：語意色 + 靜態樣式（而非動態 shimmer）

**選擇**：以固定色彩（綠/藍/橘/灰）搭配圓點指示，不加動效。  
**理由**：表格中大量 badge 若都有動效會造成視覺干擾；語意色本身已足夠傳達狀態資訊。  
**備選**：shimmer 動效 — 適合「loading」情境，不適合穩定狀態的持續展示。

## Risks / Trade-offs

- **[Risk] framer-motion bundle size 約 100KB（gzip ~34KB）** → Mitigation：僅在儀表板頁 lazy import 有動效的元件；其他頁面不引入
- **[Risk] 動效在低效能設備上造成 jank** → Mitigation：使用 `useReducedMotion()` hook，偵測系統無障礙設定後跳過動畫
- **[Risk] 視覺改動破壞現有頁面功能** → Mitigation：改動純屬樣式層，不修改資料流與 API 呼叫；視覺改動可獨立 revert

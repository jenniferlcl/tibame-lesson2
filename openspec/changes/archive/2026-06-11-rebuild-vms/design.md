## Context

現有 VMS 前端以手刻 Tailwind 元件為主，缺乏一致的 UI 元件庫，表單、對話框、表格等互動元件均需手動維護。本次重建目標是在不改變後端 API 語義的前提下，全面升級前端 UI 層，並補強儀表板的月趨勢資料端點。

現有架構（不改動）：
- 後端：Express 5 + pg raw SQL，CommonJS，port 3001
- 前端：React 18 + Vite + React Router 6 + Axios，ESM，`@` alias → `src/`
- 資料庫：PostgreSQL 16，Docker Compose，schema.sql / seed.sql 不變

## Goals / Non-Goals

**Goals:**
- 前端全面採用 shadcn/ui 元件（Button、Card、Dialog、Form、Input、Select、Table、Badge、Alert）
- 引入 Magic UI NumberTicker 為 KPI 卡片數字加入動畫效果
- 儀表板補充長條圖（每月新增車輛趨勢），圖表資料來自真實 DB 月統計
- 車輛與員工管理頁改用 Dialog Modal 取代 inline 表單
- 車輛列表支援欄位排序（車牌、年份、里程、狀態）

**Non-Goals:**
- 後端 API 路由與 payload 結構不做破壞性變更（僅新增 dashboard 月趨勢欄位）
- 不引入 TanStack Query、Zustand 或其他狀態管理庫
- 不更動 schema.sql / seed.sql / docker-compose.yml
- 不做行動裝置版 RWD 優化
- 不實作車輛出借/歸還工作流程

## Decisions

### 決策 1：採用 shadcn/ui 作為主要元件庫

**選擇**：shadcn/ui（基於 Radix UI + Tailwind CSS）

**理由**：
- 元件原始碼直接複製到 `src/components/ui/`，完全可客製化，無黑盒依賴
- 已有 Tailwind CSS 基礎，整合成本低
- Dialog、Form、Select 等高無障礙需求元件由 Radix UI 保證 a11y

**備選方案**：
- Ant Design：元件豐富但 bundle 大、樣式難覆蓋，不適合 Tailwind 專案
- MUI：Material Design 風格與本專案視覺方向不符

### 決策 2：Magic UI 僅用於 NumberTicker

**選擇**：僅在儀表板 KPI 卡片數字上使用 Magic UI NumberTicker

**理由**：Magic UI 元件多為純展示型動畫，其他頁面以功能性為主，過度動畫反而降低可讀性。

**備選方案**：全頁面引入 Magic UI — 動畫過重，維護成本高。

### 決策 3：圖表庫沿用 recharts

**選擇**：recharts（現有依賴）

**理由**：現有 DashboardPage 已使用 recharts，維持一致避免重複引入。recharts 與 React 18 + Vite 相容性良好。

**備選方案**：chart.js / ApexCharts — 功能相近但需額外安裝，無明顯優勢。

### 決策 4：Dashboard 月趨勢 API 新增欄位

**選擇**：`GET /api/dashboard/stats` 回應新增 `monthlyVehicles` 陣列

**理由**：維持單一 dashboard stats 端點，避免新增路由。資料結構：
```json
{
  "monthlyVehicles": [
    { "month": "2025-12", "count": 3 },
    { "month": "2026-01", "count": 5 }
  ]
}
```
後端以 `DATE_TRUNC('month', created_at)` GROUP BY 查詢近 6 個月。

**備選方案**：獨立端點 `/api/dashboard/monthly` — 增加前端請求數，無額外收益。

### 決策 5：管理表單改用 Dialog Modal

**選擇**：新增與編輯表單改用 shadcn/ui Dialog

**理由**：Dialog 不破壞列表頁面捲動位置，使用者操作完畢後視角回到列表，體驗較 inline 表單或獨立頁面流暢。

**備選方案**：獨立路由頁面 — 增加路由複雜度，不必要。

## Risks / Trade-offs

| 風險 | 緩解措施 |
|------|----------|
| shadcn/ui init 會修改 tailwind.config / vite.config / globals.css | 執行前備份現有設定，手動合併差異 |
| 覆蓋 apps/frontend/src/components/ 可能誤刪現有 magic/ 元件 | 明確僅覆蓋非 magic/ 目錄；magic/ 子目錄保留 |
| 月趨勢 SQL 在資料量少時可能回傳不足 6 個月 | 前端補足空月份（count: 0）以確保圖表完整顯示 |
| Dialog + Form 組合在 shadcn/ui 中需 react-hook-form | 保持現有手動 state 管理方式，不強制引入 react-hook-form |

## Migration Plan

1. `cd apps/frontend && npx shadcn@latest init` — 設定 Tailwind 路徑、CSS 變數、別名
2. 安裝所需 shadcn/ui 元件：`npx shadcn@latest add button card dialog input select table badge alert`
3. 依頁面順序重建：LoginPage → AppLayout/Sidebar → DashboardPage → VehiclesPage → EmployeesPage
4. 後端 `dashboard.js` 新增月趨勢 SQL 查詢並加入回應
5. 更新 `docker-compose.yml`（若有需要）確保 pgAdmin 設定不變
6. `docker compose down -v && docker compose up -d` 重置 DB 驗證 seed 正常

**回滾**：git revert 至重建前的 commit；docker compose 資料庫不受影響。

## Open Questions

- Magic UI NumberTicker 是否從現有 `src/components/magic/NumberTicker.jsx` 延用，還是重新安裝套件？→ 建議延用現有檔案，避免套件版本衝突。
- 車輛列表排序是前端排序（本地資料）還是後端排序（API 參數）？→ 本期採前端本地排序，資料量小不需後端分頁。

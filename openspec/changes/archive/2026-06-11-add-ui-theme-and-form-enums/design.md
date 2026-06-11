## Context

VMS 前後端已完成基礎 CRUD 功能。現有車輛表單的顏色欄位為純文字輸入，使用者可任意輸入不存在的顏色；後端 `vehicles.js` 對 `brand` 與 `color` 缺乏 enum 驗證，任意字串均可寫入資料庫。UI 整體風格以 shadcn/ui 預設色彩為主，缺乏 Magic UI 常見的漸層、光暈、動效等視覺層次。

## Goals / Non-Goals

**Goals:**
- 補齊車輛 brand 與 color 的後端 enum 驗證，與已有的 status 驗證模式一致
- 將車輛表單 color 欄位改為 shadcn/ui Select，提升資料一致性與操作體驗
- 在現有 light theme 基礎上加入 Magic UI 風格視覺強化：漸層標題、KPI 光暈、shimmer 動畫、背景層次、表格 hover 色條

**Non-Goals:**
- Dark mode 切換機制
- 車輛 model 欄位的品牌聯動下拉（需品牌-車型映射表，複雜度高）
- email / phone 欄位的格式驗證（regex pattern）
- DB schema 層新增 ENUM type（保持 VARCHAR，驗證在應用層）

## Decisions

### 1. Enum 驗證保持在應用層，不改動 DB schema

**選擇**：新增 `VEHICLE_BRANDS` 與 `VEHICLE_COLORS` 陣列至 `apps/backend/src/lib/enums.js`，路由層 includes 比對。  
**理由**：DB 的 `brand`、`color` 欄位是 VARCHAR，若改為 PG ENUM 需要 migration，且日後擴充選項時需 ALTER TYPE；應用層陣列只要改 JS 檔即可。現有 `VEHICLE_STATUSES`、`DEPARTMENTS`、`USER_ROLES` 均採用相同模式。  
**備選**：PG ENUM type — 更強的 DB 層約束，但 migration 成本高，且本專案無 ORM/migration tool。

### 2. 前端 color 選項常數獨立定義於頁面，不共用後端 enums.js

**選擇**：在 `VehiclesPage.jsx` 內定義 `COLOR_LIST` 常數，內容與後端 `VEHICLE_COLORS` 保持一致。  
**理由**：後端為 CommonJS，前端為 ESM；兩側沒有共享套件（非 npm workspaces）。現有 `BRAND_LIST`、`DEPARTMENT_LIST`、`STATUS_OPTIONS` 均採相同模式——前端自維護，後端自維護。  
**備選**：抽共享 JSON 檔 — 可解決同步問題，但需建立 shared 套件或 build step，複雜度超出本次範圍。

### 3. UI 強化以 Tailwind utility extension 實作，不引入新動畫套件

**選擇**：在 `tailwind.config.js` 擴充 `boxShadow`（glow tokens）與 `keyframes/animation`（shimmer）；在 `index.css` 新增 `.text-gradient` 與 `.shimmer-bg` utility class。  
**理由**：專案已使用 Tailwind 與 Framer Motion（NumberTicker）；新增 utility token 比引入額外套件（如 magic-ui package）更輕量，與現有 shadcn/ui 設計 token 系統一致。  
**備選**：引入 magic-ui 套件 — 元件豐富但會增加 bundle size 並與現有 shadcn/ui 元件產生重疊。

## Risks / Trade-offs

- **[Risk] 前後端 enum 不同步** → Mitigation：`enums.js` 是唯一後端真實來源，前端常數需手動對齊；在 `openspec/config.yaml` 已記載此約束，提醒未來開發者。
- **[Risk] shimmer CSS 動畫在低效能裝置上持續消耗 GPU** → Mitigation：動畫元素面積小（KPI 圖示區），且使用 `background-position` 動畫而非 `transform`，效能影響極低。
- **[Trade-off] color 欄位限制選項** → 現有資料庫可能已有不在選單內的顏色字串（自由文字輸入時期寫入的舊資料）；這些舊資料在 PUT 時若不更動 color 欄位不受影響，但若嘗試重新選擇顏色則需從合法選項挑選。

## Migration Plan

1. 部署後端：`enums.js` 新增陣列，`vehicles.js` 加入驗證 — 舊資料不受影響（POST/PUT 才觸發驗證）
2. 部署前端：`VehiclesPage.jsx` color 欄位改為 Select — 使用者下次編輯車輛時需從合法選項選擇顏色
3. 無需 DB migration，無需 rollback plan（純邏輯變更，不改資料結構）

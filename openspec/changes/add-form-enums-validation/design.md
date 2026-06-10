## Context

車輛表單的 `status` 對應 DB ENUM，目前以純文字輸入，送出非法值時 PostgreSQL 拋出 `invalid input value for enum` 錯誤，後端未捕捉而回傳 500。員工表單的 `department` 為自由文字，已有多種寫法並存於 DB。前端與後端都需要建立「允許值清單」的概念，使前端透過下拉選單引導輸入，後端作為安全邊界驗證。

## Goals / Non-Goals

**Goals:**
- 後端新增 `src/lib/enums.js` 作為允許值清單的 single source of truth
- 後端 POST/PUT 路由驗證 `status`、`department`、`role` 必須在允許清單內
- 前端車輛/員工表單以 `<Select>` 元件取代自由文字輸入
- 非法值回傳明確的 `400` 而非 `500`

**Non-Goals:**
- 透過 API 動態取得允許清單（`GET /api/options`）— 前端硬編碼，本期不含
- 國際化（多語言 label）— 本期不含
- 可搜尋下拉（autocomplete）— brand 欄位使用標準 `<select>`，不引入 combobox

## Decisions

### 1. Enum 清單管理：後端 `enums.js` 為 source of truth，前端硬編碼

**選擇**：後端建立 `apps/backend/src/lib/enums.js` 定義所有允許值；前端在各頁面元件中直接硬編碼對應的 label/value 陣列。  
**理由**：前後端 enum 值通常在同一 PR 中一起改動，共用 source of truth 的收益（避免不同步）在本架構下低於引入 API endpoint 的成本；後端 `enums.js` 確保 API 驗證邏輯集中，前端 hardcode 足夠簡單。  
**備選**：新增 `GET /api/options` 動態回傳清單 — 前後端自動同步，但多一支 API、多一次 HTTP 請求；本期複雜度不值得。

### 2. 前端 Select 元件：共用 `<Select>` wrapper（而非每頁重複 `<select>`）

**選擇**：新增 `apps/frontend/src/components/Select.jsx`，接收 `options`（`{ value, label }[]`）、`value`、`onChange`、`placeholder` props；以 Tailwind 統一樣式。  
**理由**：車輛頁與員工頁都需要下拉選單，共用元件確保樣式一致；未來新增下拉欄位只需傳入 `options` 陣列。  
**備選**：每頁各自用 `<select>` — 快速但樣式不一致，且 Tailwind 的 select 樣式需在兩處同步維護。

### 3. brand 欄位：前端下拉（有限清單）、後端不驗證

**選擇**：前端提供常見品牌清單（Toyota/Honda/Ford/Mazda 等），後端不驗證 brand 欄位值。  
**理由**：`brand` 在 DB schema 為 `VARCHAR(100)`，非 ENUM；後端強制驗證 brand 清單會限制未來新增品牌的彈性。前端下拉已降低髒資料風險，不需要後端額外把關。  
**備選**：後端也驗證 brand — 資料更嚴格，但擴充困難，需同時改前後端；本期不採用。

### 4. 後端驗證回應：`400 { message: '...' }`（而非 Zod/joi）

**選擇**：在路由函式開頭以 `if (!ALLOWED.includes(value)) return res.status(400).json({ message: '...' })` 做驗證。  
**理由**：本專案後端不使用 schema validation library（無 Zod/joi），引入新依賴成本不合比例；手動驗證與現有錯誤回應格式一致。  
**備選**：引入 `joi` 或 `zod` — 驗證邏輯更宣告式，但需新增依賴且改寫現有路由結構。

## Risks / Trade-offs

- **[Risk] 前後端 enum 清單不同步**（前端多一個 brand，後端少驗一個 department）→ Mitigation：tasks 中明確列出「前後端清單需對齊」的 checklist；code review 時同一 PR 一起檢查
- **[Risk] 現有 DB 中已有不合法的 department 值**（如「業務」vs「業務部」）→ Mitigation：`seed-mock.js`（另一個 change）建立的資料已使用標準化值；tasks 中加入「確認現有 seed 資料符合新允許清單」的步驟
- **[Trade-off] 前端硬編碼 vs 動態 API** → 硬編碼犧牲了前後端自動同步，換來零額外 HTTP 請求與更簡單的元件邏輯；待系統規模擴大後可升級為動態方案

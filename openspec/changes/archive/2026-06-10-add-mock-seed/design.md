## Context

現有 `seed.sql` 以純 SQL 撰寫，僅含 3 筆固定用戶與少量資料，密碼 hash 為硬編碼字串。此設計適合初始化，但無法靈活建立覆蓋所有情境的模擬資料集。新增一個獨立的 Node.js script（`seed-mock.js`），利用後端既有的 `pg.Pool` 與 `bcrypt`，生成貼近真實的資料並確保冪等執行。

## Goals / Non-Goals

**Goals:**
- 一鍵建立覆蓋所有情境的模擬資料（各車輛狀態、跨部門員工、有/無指派車輛）
- 冪等執行：每次執行結果一致，不累加重複資料
- 避免意外在非開發環境執行

**Non-Goals:**
- 在 CI/CD pipeline 中自動執行 — 本期不含
- 使用 Faker.js 產生隨機資料 — 資料為固定設計，確保情境可重複驗證
- 整合 Docker Compose init — 保留 `seed.sql` 不動，`seed-mock.js` 為獨立指令

## Decisions

### 1. 實作語言：Node.js script（而非 SQL 檔案）

**選擇**：以 `apps/backend/src/db/seed-mock.js`（CommonJS）實作，複用 `pg.Pool` 與 `bcrypt`。  
**理由**：SQL 無法呼叫 bcrypt 動態 hash 密碼；Node.js 可加入環境保護邏輯（`NODE_ENV` 檢查）；可讀性與維護性較 SQL 高。  
**備選**：純 SQL + 硬編碼 hash — 如現有 `seed.sql`，但 hash 字串難以驗證正確性，且無法加入保護邏輯。

### 2. 密碼 hash cost factor：4（而非正式環境的 12）

**選擇**：seed-mock.js 中使用 `bcrypt.hash(password, 4)`。  
**理由**：10 名用戶若 cost 12，每次 seed 需等待 ~10 秒，嚴重影響開發體驗；cost 4 在開發環境安全性足夠，執行時間降至 < 1 秒。  
**備選**：cost 12 — 與正式環境一致，但 seed 變成不可接受的慢操作。

### 3. 清空策略：依 FK 順序 DELETE（而非 TRUNCATE CASCADE）

**選擇**：依外鍵順序執行 `DELETE FROM vehicles; DELETE FROM employees; DELETE FROM users;`。  
**理由**：`TRUNCATE CASCADE` 會跳過 FK 約束，風險在不熟悉 schema 時可能意外清空關聯表；明確 DELETE 順序讓邏輯一目了然，且可在同一 transaction 中完成。  
**備選**：`TRUNCATE vehicles, employees, users CASCADE` — 更快，但可讀性較差，本專案規模不需要效能優化。

### 4. 環境保護：`NODE_ENV` 檢查

**選擇**：script 開頭檢查 `process.env.NODE_ENV`，若為 `production` 則立即 exit(1) 並印出警告。  
**理由**：防止開發者誤在正式環境執行，清空生產資料。  
**備選**：不加保護 — 風險過高，不採用。

### 5. 模擬資料設計：固定資料集（而非隨機生成）

**選擇**：所有資料為固定設計（具名員工、具名車輛），每次執行結果完全相同。  
**理由**：可重複驗證情境（例如「DEF-5678 一定是 in_use 狀態且指派給 alice」），方便開發者建立肌肉記憶與測試腳本。  
**備選**：使用 Faker.js 隨機生成 — 資料多樣但每次不同，難以重複驗證邊界情境。

## Risks / Trade-offs

- **[Risk] 開發者誤在正式環境執行，清空生產資料** → Mitigation：`NODE_ENV === 'production'` 時立即拒絕執行並印出紅色警告
- **[Risk] seed-mock.js 與 schema.sql 不同步（欄位新增後忘記更新 mock 資料）** → Mitigation：tasks 中明確列出「seed-mock.js 需覆蓋所有必填欄位」，code review 時檢查
- **[Trade-off] 固定資料 vs 隨機資料** → 固定資料犧牲了「大量資料壓力測試」的價值，但換來可重複驗證的測試情境，本期優先

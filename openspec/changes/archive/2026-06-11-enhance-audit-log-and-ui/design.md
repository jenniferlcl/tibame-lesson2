## Context（背景）

本 change 為純前端修改，後端 API 無任何調整（`GET /api/audit-logs` 的 `auditLogListQuerySchema` 已支援逗號分隔多值）。技術範圍集中在 `apps/web`，涵蓋稽核紀錄 (audit log) 頁面、應用程式外殼 (application shell) 元件、車輛表單 (vehicle form)、員工表單 (employee form) 四個區域。

現況問題：
- `AuditLogs` 頁面的動作與結果篩選為單值 `<select>`，不支援多選
- 動作欄直接顯示 `action` 原始字串（如 `auth.login.success`），未使用 `AUDIT_ACTION_LABELS`
- `metadata` 欄位未呈現，`ip` 欄位無遮蔽
- Header 與左側 Sidebar 同時顯示使用者姓名，重複
- Sidebar 高度未固定，主內容捲動時側欄可能跟著移動
- 車輛 / 員工編輯表單中 `purchasedAt` / `hiredAt` 的 `<input type="date">` 回填值格式不符，導致顯示空白

## Goals / Non-Goals（目標 / 非目標）

**Goals:**
- 複選篩選（action、outcome）送出時以逗號串接成 query string，與現有 API schema 相容
- API 參數欄 hover tooltip + 點擊複製，使用 shadcn/ui `Tooltip`
- 來源 IP 欄遮蔽開關，純前端 util 函式處理字串
- 動作欄改用 `AUDIT_ACTION_LABELS`，統一與下拉選項
- Header 移除使用者資訊，Sidebar 左下角顯示
- Sidebar `height: 100%` / `min-h-screen` 確保全高
- 日期欄位回填：`new Date(value).toISOString().slice(0, 10)` 轉換為 `YYYY-MM-DD`

**Non-Goals:**
- 後端 API 調整（不需要）
- 新增 npm 依賴（shadcn/ui 現有元件已足夠）
- i18n、multi-tenant、生產部署

## Decisions（決策）

### 1. 複選 UI 實作方式：Popover + Checkbox 清單

**理由**：shadcn/ui 的 `Select` 元件不原生支援多選；`Popover` + `Checkbox` 清單是 shadcn/ui 生態中最常見的 multi-select pattern，且不需引入額外依賴。

**替代方案**：引入第三方 multi-select 元件（如 `cmdk`、`react-select`）—— 增加 bundle size 與維護成本，不採用。

篩選狀態以 `string[]` 陣列存在元件的 `useState`，送 API 時 `join(',')` 串接，reset 時清為 `[]`。

### 2. API 參數 Tooltip 實作

**理由**：shadcn/ui `Tooltip` 已安裝，hover 行為直接滿足需求。tooltip 內容以 `<pre>` + `JSON.stringify(metadata, null, 2)` 呈現，保有可讀性。點擊複製使用 `navigator.clipboard.writeText`，成功後以 `useState` 切換圖示或文字提示（500ms 後 reset）。

**替代方案**：Modal dialog 展開 metadata —— 點擊才出現較不直覺，不採用。

### 3. IP 遮蔽邏輯

IPv4 遮蔽格式：`a.*.*.d`（保留第一與第四段，中間兩段替換為 `*`）。

```ts
function maskIp(ip: string): string {
  const parts = ip.split('.');
  if (parts.length !== 4) return ip; // 非標準 IPv4 不處理
  return `${parts[0]}.*.*.${parts[3]}`;
}
```

開關狀態以 `useState(true)` 存在頁面層級，傳入表格 column render function；shadcn/ui `Switch` 元件顯示開關。

**替代方案**：`****` 全遮蔽 —— 失去網段識別能力，不採用。

### 4. 動作欄 fallback

`AUDIT_ACTION_LABELS[action] ?? action`，確保未涵蓋的動作字串不中斷渲染。

### 5. Sidebar 高度固定

在外殼根容器設 `h-screen flex`，sidebar 設 `h-full overflow-y-auto`（若側欄項目過多可自身捲動），主內容設 `flex-1 overflow-y-auto`。

**替代方案**：`position: fixed; height: 100vh` —— 需額外 margin-left 補位，Tailwind class 較複雜，不採用。

### 6. 使用者身分整合

移除 `Header` 中的 `<UserInfo>` / 歡迎字樣；在 `Sidebar` 底部插入使用者姓名與角色 badge。`Header` 僅保留主題切換按鈕與登出按鈕。

**替代方案**：在 Header 右側保留，Sidebar 不顯示 —— 不符合 spec 要求，不採用。

### 7. 日期欄位回填

API 回傳的 `purchasedAt` / `hiredAt` 為 ISO 8601 字串（含時區），`<input type="date">` 需純 `YYYY-MM-DD` 格式。

```ts
function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return '';
  return iso.slice(0, 10); // 取前 10 碼即 YYYY-MM-DD
}
```

在表單 `defaultValues` 或 `reset()` 呼叫時套用此轉換。

**替代方案**：`new Date(iso).toLocaleDateString('sv')` —— 依賴 locale，不穩定，不採用。

## Risks / Trade-offs（風險 / 取捨）

| 風險 | 緩解措施 |
|------|----------|
| Popover multi-select 在小螢幕下空間不足 | 本系統為內網桌面應用，螢幕尺寸可控，暫不處理 responsive |
| `navigator.clipboard` 在非 HTTPS 環境下失效 | 開發環境為 localhost（視為安全源），生產為 HTTPS，可接受 |
| Sidebar 加 `overflow-y-auto` 後若側欄項目少，底部使用者資訊可能貼底不美觀 | 以 `justify-between flex-col` 撐開空間，使用者區塊固定在最底部 |
| `ip.slice()` 遮蔽邏輯對 IPv6 不適用 | spec 明確只處理 IPv4，IPv6 或非標準格式 fallback 顯示原值 |

## Open Questions（待決）

無。所有技術決策已在上述 Decisions 中確立。

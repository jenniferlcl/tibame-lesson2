## MODIFIED Requirements

### Requirement: 儀表板顯示 KPI 摘要卡片
系統 SHALL 在儀表板頂部顯示四張 KPI 卡片，從 API 取得即時數據。KPI 卡片 SHALL 使用 shadcn/ui Card 元件，數字 SHALL 以 Magic UI NumberTicker 動畫呈現。

#### Scenario: 已登入使用者檢視 KPI 卡片
- **WHEN** 已登入使用者瀏覽至 /dashboard
- **THEN** 系統顯示四張卡片：車輛總數、可用車輛數、維修中車輛數、員工人數，數字以滾動動畫呈現

#### Scenario: KPI 資料反映當前資料庫狀態
- **WHEN** 車輛狀態被更改後重新整理儀表板
- **THEN** KPI 卡片顯示更新後的數值

### Requirement: 儀表板顯示每月新增車輛趨勢長條圖
系統 SHALL 顯示長條圖，呈現近 6 個月每月新增車輛數量。資料來源為 API 回應中的 `monthlyVehicles` 陣列，後端以 `DATE_TRUNC('month', created_at)` 統計。前端 SHALL 補足無資料月份（count: 0）以確保圖表完整顯示 6 個月。

#### Scenario: 長條圖以月統計資料渲染
- **WHEN** 資料庫中存在不同月份建立的車輛
- **THEN** 長條圖顯示近 6 個月每月新增車輛數，X 軸為月份，Y 軸為新增數量

#### Scenario: 無資料月份顯示為 0
- **WHEN** 某月份無新增車輛
- **THEN** 該月份的長條高度為 0，不隱藏該月份

#### Scenario: 無歷史資料時顯示全 0 圖表
- **WHEN** 資料庫中無車輛資料
- **THEN** 長條圖顯示近 6 個月，所有月份數值均為 0

## ADDED Requirements

### Requirement: Dashboard API 回傳月趨勢資料
`GET /api/dashboard/stats` SHALL 在回應中包含 `monthlyVehicles` 陣列，每個元素含 `month`（YYYY-MM 格式）與 `count`（當月新增車輛數），涵蓋近 6 個月（含當月）。

#### Scenario: API 回傳完整月趨勢陣列
- **WHEN** 已登入使用者呼叫 GET /api/dashboard/stats
- **THEN** 回應包含 `monthlyVehicles: [{ month: "YYYY-MM", count: N }, ...]`，共 6 筆

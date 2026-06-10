## Requirements

### Requirement: 儀表板顯示 KPI 摘要卡片
系統 SHALL 在儀表板頂部顯示四張 KPI 卡片，從 API 取得即時數據。

#### Scenario: 已登入使用者檢視 KPI 卡片
- **WHEN** 已登入使用者瀏覽至 /dashboard
- **THEN** 系統顯示四張卡片：車輛總數、可用車輛數、維修中車輛數、員工人數

#### Scenario: KPI 資料反映當前資料庫狀態
- **WHEN** 車輛狀態被更改後重新整理儀表板
- **THEN** KPI 卡片顯示更新後的數值

### Requirement: 儀表板顯示車輛狀態分佈圓餅圖
系統 SHALL 顯示圓餅圖，呈現各狀態（可用、使用中、維修中、報廢）的車輛數量與比例。

#### Scenario: 圓餅圖以車輛資料渲染
- **WHEN** 資料庫中存在不同狀態的車輛
- **THEN** 圓餅圖顯示每個狀態的區段，含標籤與數量

#### Scenario: 無資料時顯示空狀態
- **WHEN** 資料庫中無車輛資料
- **THEN** 圓餅圖顯示無資料的提示訊息

### Requirement: 儀表板顯示每月車輛趨勢圖
系統 SHALL 顯示折線圖或長條圖，呈現近 6 個月每月新增或活躍車輛數量。

#### Scenario: 趨勢圖以歷史資料渲染
- **WHEN** 資料庫中存在跨多個月份建立的車輛
- **THEN** 圖表顯示近 6 個月的每月細分

#### Scenario: 無資料時顯示佔位提示
- **WHEN** 無歷史車輛資料
- **THEN** 圖表顯示無資料提示訊息

### Requirement: 儀表板所有已登入使用者均可存取
系統 SHALL 允許 admin 與一般使用者均可檢視儀表板。

#### Scenario: 一般使用者檢視儀表板
- **WHEN** role 為 `user` 的已登入使用者瀏覽至 /dashboard
- **THEN** 系統完整渲染儀表板，含 KPI 卡片與圖表
